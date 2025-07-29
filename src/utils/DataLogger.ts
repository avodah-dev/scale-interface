import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import winston from 'winston';
import type { Config } from '../managers/ConfigManager';

const { createLogger, format, transports } = winston;
const { combine, timestamp, errors, json, printf, colorize } = format;

interface LogEntry {
  timestamp: string;
  type: string;
  [key: string]: any;
}

interface ScaleReading {
  command?: string;
  raw?: string;
  parsed: any;
  responseTime?: number;
  connectionInfo?: any;
  rawBytes?: string;
}

interface ConnectionInfo {
  event: 'connected' | 'disconnected' | 'reconnecting';
  [key: string]: any;
}

interface PerformanceMetrics {
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  totalReadings: number;
  successRate: number;
  errors: number;
  uptime: number;
}

interface SessionInfo {
  id: string;
  mode: string;
  config: any;
  hardware: string;
}

interface Stats {
  packetLoss: number;
  [key: string]: any;
}

class DataLogger {
  private config: Config;
  private logger!: winston.Logger;
  private scaleDataLogger!: winston.Logger;

  constructor(config: Config) {
    this.config = config;
    this._ensureLogsDirectory();
    this._createLoggers();
  }

  private _ensureLogsDirectory(): void {
    const logsDir = resolve('logs');
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }
  }

  private _createLoggers(): void {
    // Main application logger
    this.logger = createLogger({
      level: this.config.logging.level,
      format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' })),
      transports: this._createTransports('application'),
      exitOnError: false,
    });

    // Separate logger for scale data
    this.scaleDataLogger = createLogger({
      level: 'info',
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), json()),
      transports: this._createScaleDataTransports(),
      exitOnError: false,
    });
  }

  private _createTransports(prefix: string): winston.transport[] {
    const transportArray: winston.transport[] = [];

    // Console transport
    if (this.config.logging.format === 'json') {
      transportArray.push(
        new transports.Console({
          format: combine(colorize({ all: true }), json()),
        })
      );
    } else {
      transportArray.push(
        new transports.Console({
          format: combine(
            colorize({ all: true }),
            printf(({ timestamp, level, message, ...meta }) => {
              const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
              return `${timestamp} [${level}]: ${message}${metaStr}`;
            })
          ),
        })
      );
    }

    // File transport for all logs
    transportArray.push(
      new transports.File({
        filename: resolve('logs', `${prefix}-${this.config.logging.datePattern}.log`),
        format: json(),
        maxsize: this._parseSize(this.config.logging.maxSize),
        maxFiles: this.config.logging.maxFiles,
        tailable: true,
      })
    );

    // Error-only file transport
    transportArray.push(
      new transports.File({
        filename: resolve('logs', `${prefix}-error-${this.config.logging.datePattern}.log`),
        level: 'error',
        format: json(),
        maxsize: this._parseSize(this.config.logging.maxSize),
        maxFiles: this.config.logging.maxFiles,
        tailable: true,
      })
    );

    return transportArray;
  }

  private _createScaleDataTransports(): winston.transport[] {
    return [
      new transports.File({
        filename: resolve('logs', `scale-data-${this.config.logging.datePattern}.log`),
        format: json(),
        maxsize: this._parseSize(this.config.logging.maxSize),
        maxFiles: this.config.logging.maxFiles,
        tailable: true,
      }),
    ];
  }

  private _parseSize(sizeStr: string): number {
    const match = sizeStr.match(/^(\d+)([kmg]?)$/i);
    if (!match) return 10 * 1024 * 1024; // Default 10MB

    const size = parseInt(match[1]!);
    const unit = (match[2] || '').toLowerCase();

    switch (unit) {
      case 'k':
        return size * 1024;
      case 'm':
        return size * 1024 * 1024;
      case 'g':
        return size * 1024 * 1024 * 1024;
      default:
        return size;
    }
  }

  // Application logging methods
  error(message: string, meta: any = {}): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta: any = {}): void {
    this.logger.warn(message, meta);
  }

  info(message: string, meta: any = {}): void {
    this.logger.info(message, meta);
  }

  debug(message: string, meta: any = {}): void {
    this.logger.debug(message, meta);
  }

  // Scale-specific logging
  logScaleReading(reading: ScaleReading): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      type: 'scale_reading',
      command: reading.command || '',
      response: {
        raw: reading.raw || '',
        parsed: reading.parsed,
      },
      responseTime: reading.responseTime || null,
      connectionInfo: reading.connectionInfo || null,
    };

    // Include raw data if configured
    if (this.config.logging.includeRaw && reading.rawBytes) {
      logEntry.rawBytes = reading.rawBytes;
    }

    this.scaleDataLogger.info(logEntry);
  }

  logScaleConnection(connectionInfo: ConnectionInfo): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      type: 'scale_connection',
      ...connectionInfo,
    };

    this.scaleDataLogger.info(logEntry);
  }

  logScaleError(error: Error, context: any = {}): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      type: 'scale_error',
      error: {
        message: error.message,
        stack: error.stack,
        code: (error as any).code || null,
      },
      context,
    };

    this.scaleDataLogger.error(logEntry);
    this.logger.error('Scale error logged', { error: error.message, context });
  }

  logStats(stats: Stats): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      type: 'scale_stats',
      stats: {
        ...stats,
        packetLossPercentage: (stats.packetLoss * 100).toFixed(2),
      },
    };

    this.scaleDataLogger.info(logEntry);
  }

  // Performance logging
  logPerformanceMetrics(metrics: PerformanceMetrics): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      type: 'performance_metrics',
      metrics: {
        avgResponseTime: metrics.avgResponseTime,
        minResponseTime: metrics.minResponseTime,
        maxResponseTime: metrics.maxResponseTime,
        totalReadings: metrics.totalReadings,
        successRate: metrics.successRate,
        errors: metrics.errors,
        uptime: metrics.uptime,
      },
    };

    this.scaleDataLogger.info(logEntry);
    this.info('Performance metrics logged', logEntry.metrics);
  }

  // Session logging
  startSession(sessionInfo: SessionInfo): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      type: 'session_start',
      session: {
        id: sessionInfo.id,
        mode: sessionInfo.mode,
        config: sessionInfo.config,
        hardware: sessionInfo.hardware,
      },
    };

    this.scaleDataLogger.info(logEntry);
    this.info('Session started', sessionInfo);
  }

  endSession(sessionSummary: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      type: 'session_end',
      summary: sessionSummary,
    };

    this.scaleDataLogger.info(logEntry);
    this.info('Session completed', sessionSummary);
  }

  // Test result logging
  logTestResult(testName: string, result: 'pass' | 'fail' | 'warning', details: any = {}): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      type: 'test_result',
      test: {
        name: testName,
        result: result,
        details,
      },
    };

    this.scaleDataLogger.info(logEntry);

    if (result === 'pass') {
      this.info(`Test passed: ${testName}`, details);
    } else if (result === 'fail') {
      this.error(`Test failed: ${testName}`, details);
    } else {
      this.warn(`Test warning: ${testName}`, details);
    }
  }

  // Configuration logging
  logConfiguration(config: Config): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      type: 'configuration',
      config: {
        ...config,
        // Remove sensitive data if any
        serial: {
          ...config.serial,
          path: config.serial.path ? '[REDACTED]' : null,
        },
      },
    };

    this.scaleDataLogger.info(logEntry);
    this.debug('Configuration loaded', { configKeys: Object.keys(config) });
  }

  // Raw data logging (for debugging)
  logRawData(direction: 'sent' | 'received', data: Buffer | string): void {
    if (!this.config.logging.includeRaw) {
      return;
    }

    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      type: 'raw_data',
      direction: direction,
      data: {
        string: buffer.toString(),
        bytes: Array.from(buffer)
          .map(b => `0x${b.toString(16).padStart(2, '0')}`)
          .join(' '),
        length: buffer.length,
      },
    };

    this.scaleDataLogger.debug(logEntry);
  }

  // Get logger instance for direct use
  getLogger(): winston.Logger {
    return this.logger;
  }

  getScaleDataLogger(): winston.Logger {
    return this.scaleDataLogger;
  }

  // Flush all logs
  async flush(): Promise<void> {
    return new Promise(resolve => {
      let pending = 2;
      const complete = () => {
        pending--;
        if (pending === 0) resolve();
      };

      this.logger.on('finish', complete);
      this.scaleDataLogger.on('finish', complete);

      this.logger.end();
      this.scaleDataLogger.end();
    });
  }
}

export default DataLogger;
