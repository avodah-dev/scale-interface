# Sterling 7600 Scale Interface - Phase 1 Console Application

## Overview

This console application validates RS-232 communication with Sterling 7600 industrial scales using Node.js runtime. It serves as the foundation for Phase 2 client site validation and Phase 3 full system development.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run diagnostics in testing mode (mock scale)
pnpm start --mode=testing --diagnostics

# Run polling test for 60 seconds
pnpm start --mode=testing --time=60

# Run with real scale hardware (requires FTDI adapter)
pnpm start --mode=scale --diagnostics
```

## Success Criteria ✅

All Phase 1a success criteria have been validated with mock scale simulation:

- ✅ **Connection**: Establish serial connection within 10 seconds  
- ✅ **Communication**: Send command and receive response in <2 seconds
- ✅ **Error Handling**: Gracefully handle 7+ error scenarios (timeout, malformed data, etc.)
- ✅ **Data Capture**: Log 100+ scale readings with structured timestamps
- ✅ **Configuration**: Change all settings via config.json without code changes
- ✅ **Recovery**: Automatically reconnect after connection loss  
- ✅ **Performance**: Maintain <5% packet loss during extended testing

## Architecture

### Core Modules (Electron-Ready)

- **ConfigManager** - JSON configuration loading and validation
- **SerialManager** - Connection, reconnection, and error recovery
- **ScaleController** - Sterling 7600 protocol and command parsing
- **MockScaleController** - Testing mode simulation
- **DataLogger** - Structured logging with timestamps

### Sterling 7600 Protocol Support

- **Commands**: SGW (gross weight), SNW (net weight), SCO (count), SPW (piece weight), ZRO (zero), ATW (tare), SRP (print), SVN (version)
- **Error Handling**: Err.80, Err.81, ULULUL, OLOLOL, ------- status conditions
- **Serial Settings**: 9600 baud, 8-N-1, no flow control, 5s timeout
- **Response Parsing**: Full protocol compliance with validation

## Configuration

All settings are managed via `config.json`:

```json
{
  "serial": {
    "baudRate": 9600,
    "dataBits": 8,
    "stopBits": 1,
    "parity": "none",
    "timeout": 5000
  },
  "polling": {
    "interval": 1000,
    "timeout": 5000,
    "retries": 3
  },
  "mode": "testing"
}
```

## CLI Commands

```bash
# Show help
pnpm start --help

# Testing mode (mock scale)
pnpm start --mode=testing --diagnostics
pnpm start --mode=testing --time=30

# Real hardware mode
pnpm start --mode=scale --diagnostics
pnpm start --mode=scale --time=600

# Validate success criteria
node testing-archive/validate-success-criteria.js
```

## Logging

Structured logs are written to `logs/` directory:

- `application-YYYY-MM-DD.log` - Application events and errors
- `scale-data-YYYY-MM-DD.log` - Scale readings and metrics
- `application-error-YYYY-MM-DD.log` - Error-only logs

## Hardware Requirements

### Phase 1 (Testing Mode)
- Node.js runtime
- No hardware required (mock scale)

### Phase 2 (Client Site Validation)  
- **Gearmo USB-to-Serial Adapter** (FTDI-based)
- **Sterling 7600 Industrial Scale** with RS-232 output
- **CableMax RS-232 LED Tester** (optional, for diagnostics)

## Phase 1b & Phase 2 Readiness

This console application is ready for Phase 1b hardware testing and Phase 2 client site validation:

1. **Portable**: Single executable with all dependencies
2. **Hardware Detection**: Automatic FTDI adapter discovery
3. **Comprehensive Logging**: All communication captured for analysis
4. **Error Resilience**: Handles all known scale error conditions
5. **Performance Monitoring**: Packet loss and response time tracking

## Next Steps

1. **Phase 1b**: Test with real hardware in office (FTDI adapter + any RS-232 device)
2. **Phase 2**: Deploy to client site for Sterling 7600 validation
3. **Phase 3**: Integrate modules into Electron application for full system
4. **Production**: Scale to 13-station deployment

## Development

```bash
# Development mode with auto-reload
pnpm run dev

# Run with specific config
cp config.json config-custom.json
# Edit config-custom.json
CONFIG_FILE=config-custom.json pnpm start
```

All modules are designed for seamless integration into the future Electron application with minimal changes required.
