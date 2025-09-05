# src/ - Scale Interface Core Implementation

**Purpose**: TypeScript implementation of Sterling 7600 scale communication system

## Which File Do I Need?

| If you need to... | Use this file | Why |
|-------------------|---------------|-----|
| Run the application | `index.ts` | Main entry point and CLI handler |
| Communicate with real scale | `controllers/ScaleController.ts` | Sterling 7600 protocol implementation |
| Test without hardware | `controllers/MockScaleController.ts` | Simulates scale responses |
| Manage serial connections | `managers/SerialManager.ts` | FTDI adapter communication |
| Handle configuration | `managers/ConfigManager.ts` | JSON config with validation |
| Log scale data | `utils/DataLogger.ts` | Winston-based structured logging |

## File Breakdown

### `index.ts` - Application Entry Point
- **Purpose**: CLI interface and mode selection
- **Key functions**: Mode routing (scale/testing/setup-testing)
- **Commands**: `--mode`, `--time`, `--diagnostics`
- **See**: index.ts:50-150 (main logic)

### `controllers/ScaleController.ts` - Scale Communication
- **Purpose**: Sterling 7600 protocol implementation
- **Key methods**: `pollScale()`, `sendCommand()`, `parseResponse()`
- **Commands**: SGW, SNW, SCO, SPW, ZRO, ATW, SRP, SVN
- **See**: ScaleController.ts:89-180 (command handling)

### `controllers/MockScaleController.ts` - Testing Controller
- **Purpose**: Simulates Sterling 7600 without hardware
- **Features**: Realistic response timing, error simulation
- **Used by**: Phase 1a testing, development mode
- **See**: MockScaleController.ts:45-120 (response generation)

### `managers/SerialManager.ts` - Hardware Interface
- **Purpose**: USB-to-Serial FTDI adapter management
- **Features**: Auto-detection, connection recovery
- **Config**: 9600 baud, 8N1, 5s timeout
- **See**: SerialManager.ts:35-90 (connection logic)

## Common Tasks

**Add new scale command**: See ScaleController.ts:150-200
**Change polling interval**: Update config.json `polling.interval`
**Debug serial communication**: Enable `logging.includeRaw` in config.json
**Test error scenarios**: Use MockScaleController.ts with error flags