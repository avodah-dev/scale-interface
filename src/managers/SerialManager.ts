import { SerialPort } from 'serialport';
import { EventEmitter } from 'events';
import type { Config } from '../managers/ConfigManager';
import type DataLogger from '../utils/DataLogger';

interface SerialPortInfo {
  path: string;
  manufacturer?: string | undefined;
  vendorId?: string | undefined;
  productId?: string | undefined;
}

interface ConnectionInfo {
  isConnected: boolean;
  isConnecting: boolean;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  lastActivity: number | null;
  connectionStartTime: number | null;
  path: string | null;
}

class SerialManager extends EventEmitter {
  private config: Config;
  private logger: DataLogger;
  private port: SerialPort | null = null;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectDelay: number = 1000; // Start with 1 second
  private maxReconnectDelay: number = 30000; // Max 30 seconds
  private connectionStartTime: number | null = null;
  private lastActivity: number | null = null;

  constructor(config: Config, logger: DataLogger) {
    super();
    this.config = config;
    this.logger = logger;
  }

  async listPorts(): Promise<SerialPortInfo[]> {
    try {
      const ports = await SerialPort.list();
      this.logger.debug('Available serial ports:', { 
        ports: ports.map(p => ({ 
          path: p.path, 
          manufacturer: p.manufacturer, 
          vendorId: p.vendorId, 
          productId: p.productId 
        })) 
      });
      return ports;
    } catch (error: any) {
      this.logger.error('Failed to list serial ports:', { error: error.message });
      throw error;
    }
  }

  async connect(portPath: string): Promise<void> {
    if (this.isConnecting) {
      throw new Error('Connection already in progress');
    }

    if (this.isConnected) {
      this.logger.warn('Already connected to serial port');
      return;
    }

    this.isConnecting = true;
    this.connectionStartTime = Date.now();

    try {
      this.logger.info('Attempting to connect to serial port', { 
        path: portPath,
        config: this.config.serial 
      });

      // Create SerialPort instance
      this.port = new SerialPort({
        path: portPath,
        baudRate: this.config.serial.baudRate,
        dataBits: this.config.serial.dataBits as 5 | 6 | 7 | 8,
        stopBits: this.config.serial.stopBits as 1 | 2,
        parity: this.config.serial.parity,
        autoOpen: false
      });

      // Set up event handlers
      this._setupEventHandlers();

      // Open the port with timeout
      await this._openWithTimeout();

      this.isConnected = true;
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000; // Reset delay
      this.lastActivity = Date.now();

      const connectionTime = Date.now() - this.connectionStartTime;
      this.logger.info('Successfully connected to serial port', { 
        path: portPath, 
        connectionTime 
      });

      this.emit('connected', { path: portPath, connectionTime });

    } catch (error: any) {
      this.isConnecting = false;
      this.isConnected = false;
      
      const connectionTime = Date.now() - this.connectionStartTime;
      this.logger.error('Failed to connect to serial port', { 
        path: portPath, 
        error: error.message, 
        connectionTime 
      });

      if (this.port && !(this.port as any).destroyed) {
        this.port.destroy();
      }
      this.port = null;

      this.emit('error', error);
      throw error;
    }
  }

  private _openWithTimeout(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Connection timeout after ${this.config.validation.connectionTimeout}ms`));
      }, this.config.validation.connectionTimeout);

      this.port!.open((error?: Error | null) => {
        clearTimeout(timeout);
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private _setupEventHandlers(): void {
    if (!this.port) return;

    this.port.on('open', () => {
      this.logger.debug('Serial port opened');
    });

    this.port.on('data', (data: Buffer) => {
      this.lastActivity = Date.now();
      this.logger.debug('Received data from serial port', { 
        data: data.toString(),
        raw: Array.from(data).map(b => `0x${b.toString(16).padStart(2, '0')}`).join(' ')
      });
      this.emit('data', data);
    });

    this.port.on('error', (error: Error) => {
      this.logger.error('Serial port error', { error: error.message });
      this.emit('error', error);
      this._handleDisconnection();
    });

    this.port.on('close', () => {
      this.logger.info('Serial port closed');
      this.emit('disconnected');
      this._handleDisconnection();
    });
  }

  private _handleDisconnection(): void {
    this.isConnected = false;
    if (this.port && !(this.port as any).destroyed) {
      this.port.destroy();
    }
    this.port = null;

    // Start reconnection process if not manually disconnected
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this._scheduleReconnect();
    } else {
      this.logger.error('Max reconnection attempts reached', { 
        attempts: this.maxReconnectAttempts 
      });
      this.emit('maxReconnectAttemptsReached');
    }
  }

  private _scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), this.maxReconnectDelay);

    this.logger.info('Scheduling reconnection attempt', { 
      attempt: this.reconnectAttempts,
      delay,
      maxAttempts: this.maxReconnectAttempts
    });

    this.reconnectTimer = setTimeout(() => {
      this.emit('reconnecting', { 
        attempt: this.reconnectAttempts,
        maxAttempts: this.maxReconnectAttempts
      });
    }, delay);
  }

  async write(data: string | Buffer): Promise<void> {
    if (!this.isConnected || !this.port) {
      throw new Error('Serial port not connected');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Write timeout after ${this.config.polling.timeout}ms`));
      }, this.config.polling.timeout);

      const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
      
      this.logger.debug('Writing data to serial port', { 
        data: buffer.toString(),
        raw: Array.from(buffer).map(b => `0x${b.toString(16).padStart(2, '0')}`).join(' ')
      });

      this.port!.write(buffer, (error?: Error | null) => {
        clearTimeout(timeout);
        if (error) {
          this.logger.error('Failed to write to serial port', { error: error.message });
          reject(error);
        } else {
          this.lastActivity = Date.now();
          resolve();
        }
      });
    });
  }

  async drain(): Promise<void> {
    if (!this.isConnected || !this.port) {
      throw new Error('Serial port not connected');
    }

    return new Promise((resolve, reject) => {
      this.port!.drain((error?: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  disconnect(): void {
    this.logger.info('Manually disconnecting from serial port');

    // Clear reconnection timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Reset reconnection attempts to prevent auto-reconnect
    this.reconnectAttempts = this.maxReconnectAttempts;

    if (this.port && this.isConnected) {
      this.port.close((error?: Error | null) => {
        if (error) {
          this.logger.error('Error closing serial port', { error: error.message });
        } else {
          this.logger.info('Serial port closed successfully');
        }
      });
    }

    this.isConnected = false;
    this.isConnecting = false;
    this.port = null;
  }

  getConnectionInfo(): ConnectionInfo {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      lastActivity: this.lastActivity,
      connectionStartTime: this.connectionStartTime,
      path: this.port?.path || null
    };
  }

  async flush(): Promise<void> {
    if (!this.isConnected || !this.port) {
      throw new Error('Serial port not connected');
    }

    return new Promise((resolve, reject) => {
      this.port!.flush((error?: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  // Check if connection is healthy based on activity
  isConnectionHealthy(): boolean {
    if (!this.isConnected) {
      return false;
    }

    const now = Date.now();
    const maxIdleTime = this.config.polling.timeout * 3; // 3x polling timeout
    
    return this.lastActivity !== null && (now - this.lastActivity) < maxIdleTime;
  }
}

export default SerialManager;