import { EventEmitter } from 'events';
import type { Config } from '../managers/ConfigManager';
import SerialManager from '../managers/SerialManager.js';
import type DataLogger from '../utils/DataLogger';

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
  value: number | string | null;
  unit: string | null;
  status: 'ok' | 'error' | 'underload' | 'overload' | 'acquiring' | 'complete';
  error: string | null;
}

interface ScaleResponse {
  raw: string;
  parsed: ParsedResponse;
  command: string | null;
  timestamp: number;
}

interface ExtendedStats extends ScaleStats {
  runtime: number;
  packetLoss: number;
  isPolling: boolean;
  connectionInfo: any;
}

class ScaleController extends EventEmitter {
  protected config: Config;
  protected logger: DataLogger;
  protected serialManager: SerialManager;
  protected isPolling: boolean = false;
  protected pollingTimer: NodeJS.Timeout | null = null;
  protected responseBuffer: string = '';
  protected pendingCommand: string | null = null;
  protected commandTimeout: NodeJS.Timeout | null = null;
  protected stats: ScaleStats = {
    commandsSent: 0,
    responsesReceived: 0,
    errors: 0,
    timeouts: 0,
    startTime: null,
    lastReading: null,
  };

  constructor(config: Config, logger: DataLogger) {
    super();
    this.config = config;
    this.logger = logger;
    this.serialManager = new SerialManager(config, logger);
    this._setupEventHandlers();
  }

  private _setupEventHandlers(): void {
    this.serialManager.on('connected', info => {
      this.logger.info('Scale connected', info);
      this.emit('connected', info);
    });

    this.serialManager.on('disconnected', () => {
      this.logger.warn('Scale disconnected');
      this.emit('disconnected');
      this._stopPolling();
    });

    this.serialManager.on('data', (data: Buffer) => {
      this._handleSerialData(data);
    });

    this.serialManager.on('error', (error: Error) => {
      this.logger.error('Scale error', { error: error.message });
      this.stats.errors++;
      this.emit('error', error);
    });

    this.serialManager.on('reconnecting', info => {
      this.logger.info('Scale reconnecting', info);
      this.emit('reconnecting', info);
    });

    this.serialManager.on('maxReconnectAttemptsReached', () => {
      this.logger.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
    });
  }

  async listAvailablePorts(): Promise<any[]> {
    return await this.serialManager.listPorts();
  }

  async connect(portPath: string | null = null): Promise<void> {
    let connectionPath = portPath;

    if (!connectionPath) {
      // Auto-detect port if not specified
      const ports = await this.listAvailablePorts();
      const ftdiPorts = ports.filter(p => p.manufacturer?.toLowerCase().includes('ftdi'));

      if (ftdiPorts.length === 0) {
        throw new Error('No FTDI USB-to-Serial adapter found. Please connect Gearmo adapter.');
      }

      if (ftdiPorts.length > 1) {
        this.logger.warn('Multiple FTDI adapters found, using first one', {
          ports: ftdiPorts.map(p => p.path),
        });
      }

      connectionPath = ftdiPorts[0].path;
    }

    await this.serialManager.connect(connectionPath!);
  }

  disconnect(): void {
    this._stopPolling();
    this.serialManager.disconnect();
  }

  private _handleSerialData(data: Buffer): void {
    this.responseBuffer += data.toString();

    // Process complete responses (ending with \r\n or \n)
    const lines = this.responseBuffer.split(/\r?\n/);
    this.responseBuffer = lines.pop() || ''; // Keep incomplete line in buffer

    for (const line of lines) {
      if (line.trim()) {
        this._processResponse(line.trim());
      }
    }
  }

  private _processResponse(response: string): void {
    this.logger.debug('Processing scale response', {
      response,
      pendingCommand: this.pendingCommand,
    });

    // Clear command timeout
    if (this.commandTimeout) {
      clearTimeout(this.commandTimeout);
      this.commandTimeout = null;
    }

    // Parse response based on Sterling 7600 protocol
    const parsed = this._parseResponse(response);

    this.stats.responsesReceived++;
    this.stats.lastReading = Date.now();

    this.emit('response', {
      raw: response,
      parsed,
      command: this.pendingCommand ?? '',
      timestamp: Date.now(),
    });

    // Clear pending command
    this.pendingCommand = null;
  }

  private _parseResponse(response: string): ParsedResponse {
    const result: ParsedResponse = {
      type: 'unknown',
      value: null,
      unit: null,
      status: 'ok',
      error: null,
    };

    // Handle error responses first
    if (response.startsWith('Err.')) {
      result.type = 'error';
      result.status = 'error';
      result.error = response;

      switch (response) {
        case 'Err.80':
          result.error = 'Serial command data error';
          break;
        case 'Err.81':
          result.error = 'Unknown serial command';
          break;
        default:
          result.error = `Scale error: ${response}`;
      }
      return result;
    }

    // Handle status conditions
    if (response === 'ULULUL') {
      result.type = 'status';
      result.status = 'underload';
      result.error = 'Under-load condition';
      return result;
    }

    if (response === 'OLOLOL') {
      result.type = 'status';
      result.status = 'overload';
      result.error = 'Over-load condition';
      return result;
    }

    if (response === '-------') {
      result.type = 'status';
      result.status = 'acquiring';
      result.error = 'A/D acquisition in progress';
      return result;
    }

    // Parse weight responses
    const weightMatch = response.match(/^(Gross|Net)\s+([\d.-]+)\s+(\w+)\.?$/i);
    if (weightMatch) {
      result.type = weightMatch[1]!.toLowerCase() === 'gross' ? 'grossWeight' : 'netWeight';
      result.value = parseFloat(weightMatch[2]!);
      result.unit = weightMatch[3]!;
      return result;
    }

    // Parse count response
    const countMatch = response.match(/^Count\s+(\d+)\s+Pieces$/i);
    if (countMatch) {
      result.type = 'count';
      result.value = parseInt(countMatch[1]!);
      result.unit = 'pieces';
      return result;
    }

    // Parse piece weight response
    const pieceWeightMatch = response.match(/^Piece Weight\s+([\d.-]+)\s+(\w+)\.?$/i);
    if (pieceWeightMatch) {
      result.type = 'pieceWeight';
      result.value = parseFloat(pieceWeightMatch[1]!);
      result.unit = pieceWeightMatch[2]!;
      return result;
    }

    // Parse version response
    const versionMatch = response.match(/^V\s+([\d.]+)$/);
    if (versionMatch) {
      result.type = 'version';
      result.value = versionMatch[1]!;
      return result;
    }

    // Parse status responses for zero/tare
    if (response.includes('Complete') || response.includes('Acquired')) {
      result.type = 'status';
      result.status = 'complete';
      result.value = response;
      return result;
    }

    // If we can't parse it, return as raw
    result.type = 'raw';
    result.value = response;

    return result;
  }

  async sendCommand(commandName: string, retries: number | null = null): Promise<ScaleResponse> {
    if (!this.serialManager.getConnectionInfo().isConnected) {
      throw new Error('Scale not connected');
    }

    const command = this.config.commands[commandName as keyof typeof this.config.commands];
    if (!command) {
      throw new Error(`Unknown command: ${commandName}`);
    }

    const maxRetries = retries !== null ? retries : this.config.polling.retries;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        return await this._executeCommand(command, commandName, attempt);
      } catch (error: any) {
        attempt++;

        if (attempt > maxRetries) {
          this.stats.errors++;
          this.logger.error('Command failed after all retries', {
            command: commandName,
            attempts: attempt,
            error: error.message,
          });
          throw error;
        }

        this.logger.warn('Command attempt failed, retrying', {
          command: commandName,
          attempt,
          maxRetries,
          error: error.message,
        });

        // Brief delay before retry
        await new Promise(resolve => setTimeout(resolve, 100 * attempt));
      }
    }

    throw new Error(`Failed to send command ${commandName} after ${maxRetries} attempts`);
  }

  private _executeCommand(
    command: string,
    commandName: string,
    attempt: number
  ): Promise<ScaleResponse> {
    return new Promise((resolve, reject) => {
      this.pendingCommand = commandName;
      this.stats.commandsSent++;

      // Set timeout for response
      this.commandTimeout = setTimeout(() => {
        this.pendingCommand = null;
        this.stats.timeouts++;
        reject(new Error(`Command timeout: ${commandName} (attempt ${attempt + 1})`));
      }, this.config.validation.responseTimeout);

      // Set up one-time response listener
      const responseHandler = (data: ScaleResponse) => {
        if (this.commandTimeout) {
          clearTimeout(this.commandTimeout);
          this.commandTimeout = null;
        }
        this.removeListener('response', responseHandler);
        resolve(data);
      };

      this.once('response', responseHandler);

      // Execute the async operations
      (async () => {
        try {
          await this.serialManager.write(command);
          await this.serialManager.drain();
        } catch (error) {
          if (this.commandTimeout) {
            clearTimeout(this.commandTimeout);
            this.commandTimeout = null;
          }
          this.removeListener('response', responseHandler);
          this.pendingCommand = null;
          reject(error);
        }
      })();
    });
  }

  // Convenience methods for common commands
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
      this.logger.warn('Polling already active');
      return;
    }

    this.isPolling = true;
    this.stats.startTime = Date.now();

    this.logger.info('Starting scale polling', {
      command: commandName,
      interval: this.config.polling.interval,
    });

    this._poll(commandName);
  }

  private _poll(commandName: string): void {
    if (!this.isPolling) {
      return;
    }

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
        this.logger.error('Polling error', { error: error.message });
        this.emit('pollingError', error);

        // Continue polling despite errors
        if (this.isPolling) {
          this.pollingTimer = setTimeout(() => {
            this._poll(commandName);
          }, this.config.polling.interval);
        }
      });
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

    this.logger.info('Scale polling stopped');
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
      connectionInfo: this.serialManager.getConnectionInfo(),
    };
  }

  // Health check
  isHealthy(): boolean {
    const stats = this.getStats();
    return (
      this.serialManager.getConnectionInfo().isConnected &&
      this.serialManager.isConnectionHealthy() &&
      stats.packetLoss <= this.config.validation.maxPacketLoss
    );
  }
}

export default ScaleController;
