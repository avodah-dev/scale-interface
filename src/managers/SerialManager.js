import { SerialPort } from 'serialport';
import { EventEmitter } from 'events';

class SerialManager extends EventEmitter {
  constructor(config, logger) {
    super();
    this.config = config;
    this.logger = logger;
    this.port = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 1000; // Start with 1 second
    this.maxReconnectDelay = 30000; // Max 30 seconds
    this.connectionStartTime = null;
    this.lastActivity = null;
  }

  async listPorts() {
    try {
      const ports = await SerialPort.list();
      this.logger.debug('Available serial ports:', { ports: ports.map(p => ({ path: p.path, manufacturer: p.manufacturer, vendorId: p.vendorId, productId: p.productId })) });
      return ports;
    } catch (error) {
      this.logger.error('Failed to list serial ports:', { error: error.message });
      throw error;
    }
  }

  async connect(portPath) {
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
        dataBits: this.config.serial.dataBits,
        stopBits: this.config.serial.stopBits,
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

    } catch (error) {
      this.isConnecting = false;
      this.isConnected = false;
      
      const connectionTime = Date.now() - this.connectionStartTime;
      this.logger.error('Failed to connect to serial port', { 
        path: portPath, 
        error: error.message, 
        connectionTime 
      });

      if (this.port && !this.port.destroyed) {
        this.port.destroy();
      }
      this.port = null;

      this.emit('error', error);
      throw error;
    }
  }

  _openWithTimeout() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Connection timeout after ${this.config.validation.connectionTimeout}ms`));
      }, this.config.validation.connectionTimeout);

      this.port.open((error) => {
        clearTimeout(timeout);
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  _setupEventHandlers() {
    this.port.on('open', () => {
      this.logger.debug('Serial port opened');
    });

    this.port.on('data', (data) => {
      this.lastActivity = Date.now();
      this.logger.debug('Received data from serial port', { 
        data: data.toString(),
        raw: Array.from(data).map(b => `0x${b.toString(16).padStart(2, '0')}`).join(' ')
      });
      this.emit('data', data);
    });

    this.port.on('error', (error) => {
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

  _handleDisconnection() {
    this.isConnected = false;
    if (this.port && !this.port.destroyed) {
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

  _scheduleReconnect() {
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

  async write(data) {
    if (!this.isConnected || !this.port) {
      throw new Error('Serial port not connected');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Write timeout after ${this.config.polling.timeout}ms`));
      }, this.config.polling.timeout);

      this.logger.debug('Writing data to serial port', { 
        data: data.toString(),
        raw: Array.from(Buffer.from(data)).map(b => `0x${b.toString(16).padStart(2, '0')}`).join(' ')
      });

      this.port.write(data, (error) => {
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

  async drain() {
    if (!this.isConnected || !this.port) {
      throw new Error('Serial port not connected');
    }

    return new Promise((resolve, reject) => {
      this.port.drain((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  disconnect() {
    this.logger.info('Manually disconnecting from serial port');

    // Clear reconnection timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Reset reconnection attempts to prevent auto-reconnect
    this.reconnectAttempts = this.maxReconnectAttempts;

    if (this.port && this.isConnected) {
      this.port.close((error) => {
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

  getConnectionInfo() {
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

  async flush() {
    if (!this.isConnected || !this.port) {
      throw new Error('Serial port not connected');
    }

    return new Promise((resolve, reject) => {
      this.port.flush((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  // Check if connection is healthy based on activity
  isConnectionHealthy() {
    if (!this.isConnected) {
      return false;
    }

    const now = Date.now();
    const maxIdleTime = this.config.polling.timeout * 3; // 3x polling timeout
    
    return this.lastActivity && (now - this.lastActivity) < maxIdleTime;
  }
}

export default SerialManager;