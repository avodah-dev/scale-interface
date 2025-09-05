# Controllers

**Purpose**: Scale communication controllers for both real hardware and testing

## Controller Selection

| Scenario | Use | Key Difference |
|----------|-----|----------------|
| Production/Hardware Testing | `ScaleController.ts` | Real serial communication via FTDI |
| Development/Mock Testing | `MockScaleController.ts` | Simulated responses, no hardware needed |

## ScaleController.ts - Real Hardware

**Purpose**: Sterling 7600 protocol implementation for actual scales

### Key Methods
- `connect()`: Establishes serial connection at ScaleController.ts:45-78
- `pollScale()`: Continuous data collection at ScaleController.ts:89-125
- `sendCommand(cmd)`: Send Sterling commands at ScaleController.ts:150-180
- `parseResponse(data)`: Process scale responses at ScaleController.ts:200-250

### Sterling 7600 Commands
- `SGW` - Gross weight
- `SNW` - Net weight  
- `SCO` - Piece count
- `SPW` - Piece weight
- `ZRO` - Zero scale
- `ATW` - Auto tare
- `SRP` - Print ticket
- `SVN` - Firmware version

## MockScaleController.ts - Testing

**Purpose**: Simulates Sterling 7600 without hardware for development

### Features
- Realistic response timing (~100ms delay)
- Error simulation (configurable error rates)
- Weight drift simulation
- Count increment simulation
- Matches ScaleController interface exactly

### Testing Scenarios
- Normal operation: Default mode
- Error conditions: Set `simulateErrors: true`
- Connection loss: Use `disconnect()` method
- Response timeout: Configurable delays

## Common Patterns

### Error Handling
Both controllers implement:
- Connection retry logic
- Response timeout handling
- Invalid data validation
- Graceful disconnection

### Data Flow
1. Command sent via `sendCommand()`
2. Response received and queued
3. `parseResponse()` validates format
4. Data logged via DataLogger
5. Errors trigger retry logic

## Cross-References

- **Serial communication**: See `../managers/SerialManager.ts`
- **Configuration**: See `../managers/ConfigManager.ts`
- **Logging**: See `../utils/DataLogger.ts`
- **Protocol docs**: See `../../project-management/hardware/sterling-7600-manual.md`