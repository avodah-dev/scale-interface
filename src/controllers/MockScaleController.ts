import { EventEmitter } from 'events';
import type { Config } from '../managers/ConfigManager';
import type DataLogger from '../utils/DataLogger';

interface MockState {
  grossWeight: number;
  netWeight: number;
  count: number;
  pieceWeight: number;
  unit: string;
  isZeroed: boolean;
  hasTare: boolean;
  isInMotion: boolean;
}

interface ScaleStats {
  commandsSent: number;
  responsesReceived: number;
  errors: number;
  timeouts: number;
  startTime: number | null;
  lastReading: number | null;
}

interface ParsedResponse {
  type: string;
  value?: number | string;
  unit?: string;
  status: 'ok' | 'error' | 'complete';
  error?: string;
}

interface ScaleResponse {
  raw: string;
  parsed: ParsedResponse;
  command: string;
  timestamp: number;
}

interface ConnectionInfo {
  isConnected: boolean;
  isConnecting: boolean;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  lastActivity: number | null;
  connectionStartTime: number | null;
  path: string;
}

interface ExtendedStats extends ScaleStats {
  runtime: number;
  packetLoss: number;
  isPolling: boolean;
  connectionInfo: ConnectionInfo;
}

class MockScaleController extends EventEmitter {
  private config: Config;
  private logger: DataLogger;
  private isConnected: boolean = false;
  private isPolling: boolean = false;
  private pollingTimer: NodeJS.Timeout | null = null;

  private stats: ScaleStats = {
    commandsSent: 0,
    responsesReceived: 0,
    errors: 0,
    timeouts: 0,
    startTime: null,
    lastReading: null,
  };

  // Mock scale state
  private mockState: MockState = {
    grossWeight: 100.55,
    netWeight: 95.3,
    count: 157,
    pieceWeight: 0.635,
    unit: 'lb',
    isZeroed: false,
    hasTare: false,
    isInMotion: false,
  };

  constructor(config: Config, logger: DataLogger) {
    super();
    this.config = config;
    this.logger = logger;
  }

  async listAvailablePorts(): Promise<any[]> {
    // Mock FTDI port
    return [
      {
        path: '/dev/tty.usbserial-MOCK001',
        manufacturer: 'FTDI',
        vendorId: '0403',
        productId: '6001',
      },
    ];
  }

  async connect(portPath: string | null = null): Promise<void> {
    this.logger.info('Mock scale connecting', { portPath });

    // Simulate connection time
    await new Promise(resolve => setTimeout(resolve, 100));

    this.isConnected = true;
    this.logger.info('Mock scale connected successfully');

    this.emit('connected', {
      path: portPath || '/dev/tty.usbserial-MOCK001',
      connectionTime: 100,
    });
  }

  disconnect(): void {
    this.logger.info('Mock scale disconnecting');
    this._stopPolling();
    this.isConnected = false;
    this.emit('disconnected');
  }

  async sendCommand(commandName: string, _retries: number | null = null): Promise<ScaleResponse> {
    if (!this.isConnected) {
      throw new Error('Mock scale not connected');
    }

    this.stats.commandsSent++;

    // Simulate response delay
    const delay = this.config.testing.responseDelay;

    // Check if delay exceeds response timeout - simulate timeout
    if (delay > this.config.validation.responseTimeout) {
      this.stats.timeouts++;
      throw new Error(
        `Command timeout: ${commandName} (mock scale response delay ${delay}ms > timeout ${this.config.validation.responseTimeout}ms)`
      );
    }

    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulate errors if configured
    if (this.config.testing.simulateErrors && Math.random() < this.config.testing.errorRate) {
      this.stats.errors++;
      const errorKeys = Object.keys(this.config.testing.errorResponses);
      const randomError = errorKeys[Math.floor(Math.random() * errorKeys.length)]!;

      const errorResponse: ScaleResponse = {
        raw: randomError,
        parsed: {
          type: 'error',
          status: 'error',
          error: this.config.testing.errorResponses[randomError]!,
        },
        command: commandName,
        timestamp: Date.now(),
      };

      this.logger.debug('Mock scale returning error response', errorResponse);
      this.stats.responsesReceived++;
      return errorResponse;
    }

    // Generate appropriate response based on command
    const response = this._generateResponse(commandName);
    this.stats.responsesReceived++;
    this.stats.lastReading = Date.now();

    this.logger.debug('Mock scale response', { command: commandName, response: response.raw });

    this.emit('response', response);
    return response;
  }

  private _generateResponse(commandName: string): ScaleResponse {
    const timestamp = Date.now();

    switch (commandName) {
      case 'grossWeight':
        return {
          raw: `Gross ${this.mockState.grossWeight} ${this.mockState.unit}.`,
          parsed: {
            type: 'grossWeight',
            value: this.mockState.grossWeight,
            unit: this.mockState.unit,
            status: 'ok',
          },
          command: commandName,
          timestamp,
        };

      case 'netWeight':
        return {
          raw: `Net ${this.mockState.netWeight} ${this.mockState.unit}.`,
          parsed: {
            type: 'netWeight',
            value: this.mockState.netWeight,
            unit: this.mockState.unit,
            status: 'ok',
          },
          command: commandName,
          timestamp,
        };

      case 'count':
        return {
          raw: `Count ${this.mockState.count} Pieces`,
          parsed: {
            type: 'count',
            value: this.mockState.count,
            unit: 'pieces',
            status: 'ok',
          },
          command: commandName,
          timestamp,
        };

      case 'pieceWeight':
        return {
          raw: `Piece Weight ${this.mockState.pieceWeight} ${this.mockState.unit}.`,
          parsed: {
            type: 'pieceWeight',
            value: this.mockState.pieceWeight,
            unit: this.mockState.unit,
            status: 'ok',
          },
          command: commandName,
          timestamp,
        };

      case 'zero':
        this.mockState.isZeroed = true;
        this.mockState.grossWeight = 0.0;
        return {
          raw: 'Zero Complete',
          parsed: {
            type: 'status',
            status: 'complete',
            value: 'Zero Complete',
          },
          command: commandName,
          timestamp,
        };

      case 'tare':
        this.mockState.hasTare = true;
        this.mockState.netWeight = 0.0;
        return {
          raw: 'Tare Acquired',
          parsed: {
            type: 'status',
            status: 'complete',
            value: 'Tare Acquired',
          },
          command: commandName,
          timestamp,
        };

      case 'print':
        return {
          raw: `${this.mockState.grossWeight} ${this.mockState.unit}. Gross`,
          parsed: {
            type: 'print',
            value: `${this.mockState.grossWeight} ${this.mockState.unit}. Gross`,
            status: 'ok',
          },
          command: commandName,
          timestamp,
        };

      case 'version':
        return {
          raw: 'V 2.01',
          parsed: {
            type: 'version',
            value: '2.01',
            status: 'ok',
          },
          command: commandName,
          timestamp,
        };

      default:
        throw new Error(`Unknown mock command: ${commandName}`);
    }
  }

  // Convenience methods (same interface as real ScaleController)
  async getGrossWeight(): Promise<ScaleResponse> {
    return await this.sendCommand('grossWeight');
  }

  async getNetWeight(): Promise<ScaleResponse> {
    return await this.sendCommand('netWeight');
  }

  async getCount(): Promise<ScaleResponse> {
    return await this.sendCommand('count');
  }

  async getPieceWeight(): Promise<ScaleResponse> {
    return await this.sendCommand('pieceWeight');
  }

  async zero(): Promise<ScaleResponse> {
    return await this.sendCommand('zero');
  }

  async tare(): Promise<ScaleResponse> {
    return await this.sendCommand('tare');
  }

  async getVersion(): Promise<ScaleResponse> {
    return await this.sendCommand('version');
  }

  async print(): Promise<ScaleResponse> {
    return await this.sendCommand('print');
  }

  // Polling functionality
  startPolling(commandName: string = 'grossWeight'): void {
    if (this.isPolling) {
      this.logger.warn('Mock polling already active');
      return;
    }

    this.isPolling = true;
    this.stats.startTime = Date.now();

    this.logger.info('Starting mock scale polling', {
      command: commandName,
      interval: this.config.polling.interval,
    });

    this._poll(commandName);
  }

  private _poll(commandName: string): void {
    if (!this.isPolling) {
      return;
    }

    // Add some variation to mock data
    this._varyMockData();

    this.sendCommand(commandName)
      .then(response => {
        this.emit('reading', response);

        // Schedule next poll
        if (this.isPolling) {
          this.pollingTimer = setTimeout(() => {
            this._poll(commandName);
          }, this.config.polling.interval);
        }
      })
      .catch(error => {
        this.logger.error('Mock polling error', { error: error.message });
        this.emit('pollingError', error);

        // Continue polling despite errors
        if (this.isPolling) {
          this.pollingTimer = setTimeout(() => {
            this._poll(commandName);
          }, this.config.polling.interval);
        }
      });
  }

  private _varyMockData(): void {
    // Add small random variations to simulate real scale behavior
    const variation = (Math.random() - 0.5) * 0.1; // ±0.05 lb variation
    this.mockState.grossWeight = Math.max(0, parseFloat((100.55 + variation).toFixed(2)));
    this.mockState.netWeight = Math.max(0, parseFloat((95.3 + variation).toFixed(2)));

    // Occasionally vary count
    if (Math.random() < 0.1) {
      this.mockState.count += Math.floor(Math.random() * 3) - 1; // ±1 piece
      this.mockState.count = Math.max(0, this.mockState.count);
    }
  }

  stopPolling(): void {
    this._stopPolling();
  }

  private _stopPolling(): void {
    if (!this.isPolling) {
      return;
    }

    this.isPolling = false;

    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
      this.pollingTimer = null;
    }

    this.logger.info('Mock scale polling stopped');
  }

  getStats(): ExtendedStats {
    const runtime = this.stats.startTime ? Date.now() - this.stats.startTime : 0;
    const packetLoss =
      this.stats.commandsSent > 0
        ? (this.stats.commandsSent - this.stats.responsesReceived) / this.stats.commandsSent
        : 0;

    return {
      ...this.stats,
      runtime,
      packetLoss,
      isPolling: this.isPolling,
      connectionInfo: {
        isConnected: this.isConnected,
        isConnecting: false,
        reconnectAttempts: 0,
        maxReconnectAttempts: 0,
        lastActivity: this.stats.lastReading,
        connectionStartTime: null,
        path: '/dev/tty.usbserial-MOCK001',
      },
    };
  }

  isHealthy(): boolean {
    const stats = this.getStats();
    return this.isConnected && stats.packetLoss <= this.config.validation.maxPacketLoss;
  }
}

export default MockScaleController;
