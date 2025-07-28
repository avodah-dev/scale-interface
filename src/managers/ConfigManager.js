import Joi from 'joi';
import { readFileSync } from 'fs';
import { resolve } from 'path';

class ConfigManager {
  constructor(configPath = 'config.json') {
    this.configPath = resolve(configPath);
    this.config = null;
    this.schema = this._createSchema();
  }

  _createSchema() {
    return Joi.object({
      serial: Joi.object({
        baudRate: Joi.number().valid(300, 1200, 2400, 4800, 9600, 19200, 38400).required(),
        dataBits: Joi.number().valid(7, 8).required(),
        stopBits: Joi.number().valid(1, 2).required(),
        parity: Joi.string().valid('none', 'odd', 'even').required(),
        timeout: Joi.number().min(1000).max(30000).required(),
        autoOpen: Joi.boolean().required(),
        path: Joi.string().allow(null)
      }).required(),

      commands: Joi.object({
        grossWeight: Joi.string().required(),
        netWeight: Joi.string().required(),
        count: Joi.string().required(),
        pieceWeight: Joi.string().required(),
        zero: Joi.string().required(),
        tare: Joi.string().required(),
        print: Joi.string().required(),
        version: Joi.string().required()
      }).required(),

      polling: Joi.object({
        interval: Joi.number().min(500).max(10000).required(),
        timeout: Joi.number().min(1000).max(30000).required(),
        retries: Joi.number().min(1).max(10).required(),
        minInterval: Joi.number().min(100).required(),
        maxInterval: Joi.number().min(1000).required()
      }).required(),

      logging: Joi.object({
        level: Joi.string().valid('error', 'warn', 'info', 'debug').required(),
        format: Joi.string().valid('json', 'simple').required(),
        includeRaw: Joi.boolean().required(),
        maxFiles: Joi.number().min(1).max(100).required(),
        maxSize: Joi.string().required(),
        datePattern: Joi.string().required()
      }).required(),

      mode: Joi.string().valid('setup-testing', 'hardware-testing', 'scale', 'testing').required(),

      testing: Joi.object({
        mockResponses: Joi.object().pattern(Joi.string(), Joi.string()).required(),
        errorResponses: Joi.object().pattern(Joi.string(), Joi.string()).required(),
        simulateErrors: Joi.boolean().required(),
        errorRate: Joi.number().min(0).max(1).required(),
        responseDelay: Joi.number().min(0).max(5000).required()
      }).required(),

      validation: Joi.object({
        connectionTimeout: Joi.number().min(1000).max(60000).required(),
        responseTimeout: Joi.number().min(500).max(10000).required(),
        maxPacketLoss: Joi.number().min(0).max(1).required(),
        minReadings: Joi.number().min(1).max(10000).required()
      }).required()
    });
  }

  load() {
    try {
      const configData = readFileSync(this.configPath, 'utf8');
      const parsedConfig = JSON.parse(configData);
      
      const { error, value } = this.schema.validate(parsedConfig, { 
        abortEarly: false,
        allowUnknown: false 
      });

      if (error) {
        const errors = error.details.map(detail => detail.message).join(', ');
        throw new Error(`Configuration validation failed: ${errors}`);
      }

      this.config = value;

      // Additional validation rules
      this._validateAdditionalRules();

      return this.config;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Configuration file not found: ${this.configPath}`);
      }
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in configuration file: ${error.message}`);
      }
      throw error;
    }
  }

  _validateAdditionalRules() {
    // Ensure polling interval is within allowed range
    if (this.config.polling.interval < this.config.polling.minInterval ||
        this.config.polling.interval > this.config.polling.maxInterval) {
      throw new Error(`Polling interval must be between ${this.config.polling.minInterval} and ${this.config.polling.maxInterval} ms`);
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
      if (command.length !== 4) { // 3 letters + \r
        throw new Error(`Command '${name}' must be exactly 3 letters followed by \\r`);
      }
    }
  }

  get(path) {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call load() first.');
    }

    const keys = path.split('.');
    let value = this.config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  getSerial() {
    return this.get('serial');
  }

  getCommands() {
    return this.get('commands');
  }

  getPolling() {
    return this.get('polling');
  }

  getLogging() {
    return this.get('logging');
  }

  getMode() {
    return this.get('mode');
  }

  getTesting() {
    return this.get('testing');
  }

  getValidation() {
    return this.get('validation');
  }

  isTestingMode() {
    return this.getMode() === 'testing';
  }

  isScaleMode() {
    return this.getMode() === 'scale';
  }
}

export default ConfigManager;