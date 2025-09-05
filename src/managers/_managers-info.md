# Managers

**Purpose**: Core system management components for configuration and serial communication

## Manager Components

| Manager | Purpose | Key Responsibility |
|---------|---------|-------------------|
| `ConfigManager.ts` | Configuration handling | JSON config validation and loading |
| `SerialManager.ts` | Hardware communication | USB-to-Serial FTDI adapter management |

## ConfigManager.ts - Configuration Management

**Purpose**: Centralized configuration with validation

### Key Features
- JSON-based configuration at ConfigManager.ts:25-45
- Joi schema validation at ConfigManager.ts:50-120
- Runtime type safety via TypeScript interfaces
- Hot-reload capability for development

### Configuration Sections
- `serial`: Port settings (9600 8N1)
- `commands`: Sterling 7600 command strings
- `polling`: Interval and retry settings
- `logging`: Winston logger configuration
- `mode`: Operation mode selection
- `validation`: Data validation rules

### Usage Pattern
```typescript
const config = ConfigManager.load();
const pollInterval = config.polling.interval;
```

## SerialManager.ts - Serial Communication

**Purpose**: USB-to-Serial adapter management and communication

### Key Features
- FTDI adapter auto-detection at SerialManager.ts:35-60
- Connection management at SerialManager.ts:65-90
- Data buffering and queuing at SerialManager.ts:95-110
- Error recovery at SerialManager.ts:115-140

### Connection Flow
1. Auto-detect FTDI adapter via vendor ID
2. Open port with configured settings
3. Set up data/error event handlers
4. Manage read/write buffers
5. Handle disconnection/reconnection

### Port Settings
- **Baud Rate**: 9600 (Sterling 7600 standard)
- **Data Bits**: 8
- **Stop Bits**: 1
- **Parity**: None
- **Timeout**: 5000ms

### Error Handling
- Port not found: Lists available ports
- Permission denied: Suggests sudo/admin
- Device busy: Retry with backoff
- Disconnection: Automatic reconnect attempt

## Integration Pattern

The managers work together:
1. ConfigManager loads and validates settings
2. SerialManager uses config for port setup
3. Controllers use both for scale communication
4. Changes to config.json trigger validation
5. Invalid configs prevented from loading

## Cross-References

- **Controllers**: See `../controllers/` for usage examples
- **Configuration file**: See `../../config.json`
- **Hardware docs**: See `../../project-management/hardware/`
- **Protocol specs**: See Sterling 7600 manual