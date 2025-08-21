#!/usr/bin/env node

import { program } from 'commander';
import { randomUUID } from 'crypto';
import ConfigManager from './managers/ConfigManager.js';
import ScaleController from './controllers/ScaleController.js';
import MockScaleController from './controllers/MockScaleController.js';
import DataLogger from './utils/DataLogger.js';

class ScaleInterfaceApp {
  constructor() {
    this.configManager = null;
    this.config = null;
    this.logger = null;
    this.scaleController = null;
    this.sessionId = randomUUID();
    this.startTime = Date.now();
    this.readings = [];
    this.isRunning = false;
    this.testResults = [];
  }

  async initialize(options = {}) {
    try {
      // Load configuration
      this.configManager = new ConfigManager();
      this.config = this.configManager.load();
      
      // Override mode if specified in options
      if (options.mode) {
        this.config.mode = options.mode;
      }

      // Initialize logger
      this.logger = new DataLogger(this.config);
      this.logger.logConfiguration(this.config);

      // Initialize scale controller based on mode
      switch (this.config.mode) {
        case 'setup-testing':
          this.scaleController = new MockScaleController(this.config, this.logger);
          this.logger.info('Initialized in setup-testing mode (mock scale for development)');
          break;
        case 'hardware-testing':
          this.scaleController = new ScaleController(this.config, this.logger);
          this.logger.info('Initialized in hardware-testing mode (FTDI adapter validation)');
          break;
        case 'scale':
          this.scaleController = new ScaleController(this.config, this.logger);
          this.logger.info('Initialized in scale mode (Sterling 7600 hardware)');
          break;
        case 'testing': // Legacy support
          this.scaleController = new MockScaleController(this.config, this.logger);
          this.logger.info('Initialized in testing mode (mock scale)');
          break;
        default:
          throw new Error(`Invalid mode: ${this.config.mode}. Use: setup-testing, hardware-testing, or scale`);
      }

      this._setupEventHandlers();

      this.logger.startSession({
        id: this.sessionId,
        mode: this.config.mode,
        config: {
          polling: this.config.polling,
          validation: this.config.validation
        },
        hardware: this.config.mode === 'scale' ? 'Sterling 7600 via FTDI adapter' : 'Mock scale'
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize application:', error.message);
      if (this.logger) {
        this.logger.error('Application initialization failed', { error: error.message });
      }
      return false;
    }
  }

  _setupEventHandlers() {
    this.scaleController.on('connected', (info) => {
      this.logger.logScaleConnection({ event: 'connected', ...info });
      console.log(`✅ Scale connected on ${info.path} (${info.connectionTime}ms)`);
    });

    this.scaleController.on('disconnected', () => {
      this.logger.logScaleConnection({ event: 'disconnected' });
      console.log('❌ Scale disconnected');
    });

    this.scaleController.on('reconnecting', (info) => {
      this.logger.logScaleConnection({ event: 'reconnecting', ...info });
      console.log(`🔄 Reconnecting... (attempt ${info.attempt}/${info.maxAttempts})`);
    });

    this.scaleController.on('reading', (reading) => {
      this.readings.push(reading);
      this.logger.logScaleReading(reading);
      
      const value = reading.parsed.value;
      const unit = reading.parsed.unit || '';
      const status = reading.parsed.status;
      const type = reading.parsed.type;
      
      // Track previous value to show changes
      if (!this.lastValue) this.lastValue = value;
      const change = value - this.lastValue;
      const changeStr = change > 0 ? ` ↑${change}` : change < 0 ? ` ↓${Math.abs(change)}` : '';
      this.lastValue = value;
      
      if (status === 'ok') {
        const timestamp = new Date().toLocaleTimeString();
        if (type === 'count') {
          console.log(`[${timestamp}] Count: ${value} ${unit}${changeStr}`);
        } else if (type === 'grossWeight' || type === 'netWeight') {
          console.log(`[${timestamp}] Weight: ${value.toFixed(3)} ${unit}${changeStr}`);
        } else {
          console.log(`[${timestamp}] ${type}: ${value} ${unit}${changeStr}`);
        }
      } else {
        console.log(`⚠️  ${reading.parsed.type}: ${reading.parsed.error || 'Error'}`);
      }
    });

    this.scaleController.on('error', (error) => {
      this.logger.logScaleError(error);
      console.error(`❌ Scale error: ${error.message}`);
    });

    this.scaleController.on('pollingError', (error) => {
      console.error(`⚠️  Polling error: ${error.message}`);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down...');
      this.shutdown();
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Terminating...');
      this.shutdown();
    });
  }

  async runDiagnostics() {
    console.log('\n🔍 Running Scale Interface Diagnostics\n');
    
    try {
      // Test 1: List available ports
      console.log('1. Listing available serial ports...');
      const ports = await this.scaleController.listAvailablePorts();
      
      if (ports.length === 0) {
        this.testResults.push({ name: 'Port Detection', result: 'fail', details: 'No serial ports found' });
        console.log('   ❌ No serial ports detected');
      } else {
        const ftdiPorts = ports.filter(p => p.manufacturer && p.manufacturer.toLowerCase().includes('ftdi'));
        
        if (ftdiPorts.length > 0) {
          this.testResults.push({ name: 'Port Detection', result: 'pass', details: `Found ${ftdiPorts.length} FTDI port(s)` });
          console.log(`   ✅ Found ${ftdiPorts.length} FTDI adapter(s):`);
          ftdiPorts.forEach(port => {
            console.log(`      - ${port.path} (${port.manufacturer})`);
          });
        } else {
          this.testResults.push({ name: 'Port Detection', result: 'warning', details: 'FTDI ports not found, but other ports available' });
          console.log('   ⚠️  No FTDI adapters found. Available ports:');
          ports.forEach(port => {
            console.log(`      - ${port.path} (${port.manufacturer || 'Unknown'})`);
          });
        }
      }

      // Test 2: Connection test
      console.log('\n2. Testing scale connection...');
      const connectionStart = Date.now();
      
      try {
        await this.scaleController.connect();
        const connectionTime = Date.now() - connectionStart;
        
        if (connectionTime <= this.config.validation.connectionTimeout) {
          this.testResults.push({ name: 'Connection', result: 'pass', details: `Connected in ${connectionTime}ms` });
          console.log(`   ✅ Connected successfully (${connectionTime}ms)`);
        } else {
          this.testResults.push({ name: 'Connection', result: 'warning', details: `Slow connection: ${connectionTime}ms` });
          console.log(`   ⚠️  Connected but slow: ${connectionTime}ms`);
        }
      } catch (error) {
        this.testResults.push({ name: 'Connection', result: 'fail', details: error.message });
        console.log(`   ❌ Connection failed: ${error.message}`);
        return false;
      }

      // Test 3: Command response test
      console.log('\n3. Testing scale commands...');
      const commands = ['version', 'grossWeight', 'netWeight', 'count'];
      
      for (const command of commands) {
        try {
          const response = await this.scaleController.sendCommand(command);
          
          if (response.parsed.status === 'ok') {
            this.testResults.push({ name: `Command ${command}`, result: 'pass', details: `${response.parsed.value} ${response.parsed.unit || ''}`.trim() });
            console.log(`   ✅ ${command}: ${response.parsed.value} ${response.parsed.unit || ''}`.trim());
          } else {
            this.testResults.push({ name: `Command ${command}`, result: 'warning', details: response.parsed.error });
            console.log(`   ⚠️  ${command}: ${response.parsed.error}`);
          }
        } catch (error) {
          this.testResults.push({ name: `Command ${command}`, result: 'fail', details: error.message });
          console.log(`   ❌ ${command}: ${error.message}`);
        }
      }

      return true;
    } catch (error) {
      console.error(`❌ Diagnostics failed: ${error.message}`);
      return false;
    }
  }

  async runPollingTest(duration = 60000, command = 'count') {
    console.log(`\n📊 Starting ${duration/1000}s polling test (${command})...\n`);
    
    // Suppress debug logs during polling for cleaner output
    const originalLevel = this.logger.logger.level;
    this.logger.logger.level = 'error';
    
    this.scaleController.startPolling(command);
    this.isRunning = true;

    const startTime = Date.now();
    const targetReadings = Math.floor(duration / this.config.polling.interval);
    
    console.log(`Target: ${targetReadings} readings at ${this.config.polling.interval}ms intervals`);
    console.log('Press Ctrl+C to stop early\n');

    return new Promise((resolve) => {
      const statusInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const stats = this.scaleController.getStats();
        
        console.log(`⏱️  ${Math.floor(elapsed/1000)}s | Readings: ${stats.responsesReceived} | Errors: ${stats.errors} | Packet Loss: ${(stats.packetLoss * 100).toFixed(1)}%`);
        
        if (elapsed >= duration) {
          clearInterval(statusInterval);
          this.scaleController.stopPolling();
          this.isRunning = false;
          // Restore original logging level
          this.logger.logger.level = originalLevel;
          resolve(this._generateTestSummary());
        }
      }, 5000);
    });
  }

  _generateTestSummary() {
    const stats = this.scaleController.getStats();
    const runtime = stats.runtime;
    const successRate = stats.commandsSent > 0 ? (stats.responsesReceived / stats.commandsSent) * 100 : 0;
    
    console.log('\n📋 Test Summary:');
    console.log(`├─ Runtime: ${Math.floor(runtime/1000)}s`);
    console.log(`├─ Commands sent: ${stats.commandsSent}`);
    console.log(`├─ Responses received: ${stats.responsesReceived}`);
    console.log(`├─ Errors: ${stats.errors}`);
    console.log(`├─ Timeouts: ${stats.timeouts}`);
    console.log(`├─ Success rate: ${successRate.toFixed(1)}%`);
    console.log(`└─ Packet loss: ${(stats.packetLoss * 100).toFixed(1)}%`);

    const summary = {
      runtime,
      commandsSent: stats.commandsSent,
      responsesReceived: stats.responsesReceived,
      errors: stats.errors,
      timeouts: stats.timeouts,
      successRate: successRate / 100,
      packetLoss: stats.packetLoss,
      totalReadings: this.readings.length,
      testResults: this.testResults
    };

    // Log performance metrics
    if (this.readings.length > 0) {
      const responseTimes = this.readings
        .filter(r => r.responseTime)
        .map(r => r.responseTime);
      
      if (responseTimes.length > 0) {
        const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        const minResponseTime = Math.min(...responseTimes);
        const maxResponseTime = Math.max(...responseTimes);
        
        summary.performance = {
          avgResponseTime,
          minResponseTime,
          maxResponseTime
        };

        this.logger.logPerformanceMetrics({
          ...summary.performance,
          totalReadings: this.readings.length,
          successRate: summary.successRate,
          errors: summary.errors,
          uptime: runtime
        });
      }
    }

    this.logger.logStats(stats);
    
    return summary;
  }

  async shutdown() {
    if (!this.isRunning) {
      process.exit(0);
      return;
    }

    this.isRunning = false;

    try {
      if (this.scaleController) {
        this.scaleController.stopPolling();
        this.scaleController.disconnect();
      }

      const summary = this._generateTestSummary();
      
      if (this.logger) {
        this.logger.endSession(summary);
        
        // Log all test results
        this.testResults.forEach(test => {
          this.logger.logTestResult(test.name, test.result, test.details);
        });
        
        await this.logger.flush();
      }

      console.log('\n✅ Application shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error.message);
      process.exit(1);
    }
  }
}

// CLI setup
program
  .name('scale-interface')
  .description('Sterling 7600 Scale Interface Console Application')
  .version('1.0.0');

program
  .option('-m, --mode <mode>', 'operation mode (testing|scale)', 'testing')
  .option('-d, --diagnostics', 'run diagnostics only')
  .option('-t, --time <seconds>', 'polling test duration in seconds', '60')
  .option('-c, --command <command>', 'polling command (count|grossWeight|netWeight)', 'count')
  .action(async (options) => {
    const app = new ScaleInterfaceApp();
    
    if (!await app.initialize(options)) {
      process.exit(1);
    }

    if (options.diagnostics) {
      const success = await app.runDiagnostics();
      await app.shutdown();
      process.exit(success ? 0 : 1);
    } else {
      const duration = parseInt(options.time) * 1000;
      const command = options.command || 'count';
      await app.runDiagnostics();
      await app.runPollingTest(duration, command);
      await app.shutdown();
    }
  });

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

program.parse();