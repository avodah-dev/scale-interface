import { readFileSync } from 'fs';
import Joi from 'joi';
import { resolve } from 'path';

interface SerialConfig {
  baudRate: number;
  dataBits: number;
  stopBits: number;
  parity: 'none' | 'odd' | 'even';
  timeout: number;
  autoOpen: boolean;
  path: string | null;
}

interface CommandsConfig {
  grossWeight: string;
  netWeight: string;
  count: string;
  pieceWeight: string;
  zero: string;
  tare: string;
  print: string;
  version: string;
}

interface PollingConfig {
  interval: number;
  timeout: number;
  retries: number;
  minInterval: number;
  maxInterval: number;
}

interface LoggingConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  format: 'json' | 'simple';
  includeRaw: boolean;
  maxFiles: number;
  maxSize: string;
  datePattern: string;
}

interface TestingConfig {
  mockResponses: Record<string, string>;
  errorResponses: Record<string, string>;
  simulateErrors: boolean;
  errorRate: number;
  responseDelay: number;
}

interface ValidationConfig {
  connectionTimeout: number;
  responseTimeout: number;
  maxPacketLoss: number;
  minReadings: number;
}

export interface Config {
  serial: SerialConfig;
  commands: CommandsConfig;
  polling: PollingConfig;
  logging: LoggingConfig;
  mode: 'setup-testing' | 'hardware-testing' | 'scale' | 'testing';
  testing: TestingConfig;
  validation: ValidationConfig;
}

class ConfigManager {
  private configPath: string;
  private config: Config | null = null;
  private schema: Joi.ObjectSchema;

  constructor(configPath: string = 'config.json') {
    this.configPath = resolve(configPath);
    this.schema = this._createSchema();
  }

  private _createSchema(): Joi.ObjectSchema {
    return Joi.object({
      serial: Joi.object({
        baudRate: Joi.number().valid(300, 1200, 2400, 4800, 9600, 19200, 38400).required(),
        dataBits: Joi.number().valid(7, 8).required(),
        stopBits: Joi.number().valid(1, 2).required(),
        parity: Joi.string().valid('none', 'odd', 'even').required(),
        timeout: Joi.number().min(1000).max(30000).required(),
        autoOpen: Joi.boolean().required(),
        path: Joi.string().allow(null),
      }).required(),

      commands: Joi.object({
        grossWeight: Joi.string().required(),
        netWeight: Joi.string().required(),
        count: Joi.string().required(),
        pieceWeight: Joi.string().required(),
        zero: Joi.string().required(),
        tare: Joi.string().required(),
        print: Joi.string().required(),
        version: Joi.string().required(),
      }).required(),

      polling: Joi.object({
        interval: Joi.number().min(500).max(10000).required(),
        timeout: Joi.number().min(1000).max(30000).required(),
        retries: Joi.number().min(1).max(10).required(),
        minInterval: Joi.number().min(100).required(),
        maxInterval: Joi.number().min(1000).required(),
      }).required(),

      logging: Joi.object({
        level: Joi.string().valid('error', 'warn', 'info', 'debug').required(),
        format: Joi.string().valid('json', 'simple').required(),
        includeRaw: Joi.boolean().required(),
        maxFiles: Joi.number().min(1).max(100).required(),
        maxSize: Joi.string().required(),
        datePattern: Joi.string().required(),
      }).required(),

      mode: Joi.string().valid('setup-testing', 'hardware-testing', 'scale', 'testing').required(),

      testing: Joi.object({
        mockResponses: Joi.object().pattern(Joi.string(), Joi.string()).required(),
        errorResponses: Joi.object().pattern(Joi.string(), Joi.string()).required(),
        simulateErrors: Joi.boolean().required(),
        errorRate: Joi.number().min(0).max(1).required(),
        responseDelay: Joi.number().min(0).max(5000).required(),
      }).required(),

      validation: Joi.object({
        connectionTimeout: Joi.number().min(1000).max(60000).required(),
        responseTimeout: Joi.number().min(500).max(10000).required(),
        maxPacketLoss: Joi.number().min(0).max(1).required(),
        minReadings: Joi.number().min(1).max(10000).required(),
      }).required(),
    });
  }

  load(): Config {
    try {
      const configData = readFileSync(this.configPath, 'utf8');
      const parsedConfig = JSON.parse(configData);

      const { error, value } = this.schema.validate(parsedConfig, {
        abortEarly: false,
        allowUnknown: false,
      });

      if (error) {
        const errors = error.details.map(detail => detail.message).join(', ');
        throw new Error(`Configuration validation failed: ${errors}`);
      }

      this.config = value as Config;

      // Additional validation rules
      this._validateAdditionalRules();

      return this.config;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw new Error(`Configuration file not found: ${this.configPath}`);
      }
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in configuration file: ${error.message}`);
      }
      throw error;
    }
  }

  private _validateAdditionalRules(): void {
    if (!this.config) return;

    // Ensure polling interval is within allowed range
    if (
      this.config.polling.interval < this.config.polling.minInterval ||
      this.config.polling.interval > this.config.polling.maxInterval
    ) {
      throw new Error(
        `Polling interval must be between ${this.config.polling.minInterval} and ${this.config.polling.maxInterval} ms`
      );
    }

    // Ensure response timeout is less than polling timeout
    if (this.config.validation.responseTimeout >= this.config.polling.timeout) {
      throw new Error('Response timeout must be less than polling timeout');
    }

    // Validate command format - all commands should end with \r
    for (const [name, command] of Object.entries(this.config.commands)) {
      if (!command.endsWith('\r')) {
        throw new Error(`Command '${name}' must end with carriage return (\\r)`);
      }
      if (command.length !== 4) {
        // 3 letters + \r
        throw new Error(`Command '${name}' must be exactly 3 letters followed by \\r`);
      }
    }
  }

  get<K extends keyof Config>(path: K): Config[K];
  get(path: string): any;
  get(path: string): any {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call load() first.');
    }

    const keys = path.split('.');
    let value: any = this.config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  getSerial(): SerialConfig {
    return this.get('serial');
  }

  getCommands(): CommandsConfig {
    return this.get('commands');
  }

  getPolling(): PollingConfig {
    return this.get('polling');
  }

  getLogging(): LoggingConfig {
    return this.get('logging');
  }

  getMode(): Config['mode'] {
    return this.get('mode');
  }

  getTesting(): TestingConfig {
    return this.get('testing');
  }

  getValidation(): ValidationConfig {
    return this.get('validation');
  }

  isTestingMode(): boolean {
    return this.getMode() === 'testing';
  }

  isScaleMode(): boolean {
    return this.getMode() === 'scale';
  }
}

export default ConfigManager;
