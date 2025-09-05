# Sterling 7600 Scale Testing Quick Guide

## Pre-Connection Checklist

1. **Hardware Setup**
   - Sterling 7600 scale powered on and stable
   - DB9 serial cable connected to scale's RS-232 port
   - Gearmo USB-to-Serial adapter connected to laptop
   - Note the USB port path (will auto-detect FTDI adapters)

2. **Scale Configuration**
   - Verify scale is set to 9600 baud, 8 data bits, 1 stop bit, no parity
   - Scale should be in normal weighing mode (not calibration)

## Quick Test Commands

### 1. Initial Port Detection
```bash
# List all available serial ports
bun start --mode=scale --diagnostics
```
This will show all detected ports and identify FTDI adapters.

### 2. Basic Connection Test (5-second quick test)
```bash
# Connect and test basic commands
bun start --mode=scale --diagnostics
```
Expected output:
- ✅ FTDI adapter detected
- ✅ Connection established (<10s)
- ✅ Version command response
- ✅ Weight reading received

### 3. Extended Polling Test (1 minute)
```bash
# Run 60-second continuous polling
bun start --mode=scale --time=60
```
Monitor for:
- Consistent readings every second
- Packet loss <5%
- No timeout errors
- Response times <2 seconds

### 4. Full Validation Test (5 minutes)
```bash
# Run comprehensive 5-minute test
bun start --mode=scale --time=300
```
Success criteria:
- 300+ readings captured
- <5% packet loss
- Automatic reconnection after disconnection
- All Sterling commands working

## Troubleshooting Commands

### If No FTDI Adapter Detected:
```bash
# Check USB connection and list all ports
ls /dev/cu.* /dev/tty.*
```

### If Connection Fails:
```bash
# Test with specific port path
bun start --mode=scale --diagnostics
# Then manually edit config.json with correct port path
```

### To View Real-Time Logs:
```bash
# Watch scale data log
tail -f logs/scale-data-*.log

# Check for errors
tail -f logs/application-error-*.log
```

### Test Individual Commands:
Once connected via diagnostics mode, the system will test:
- `SGW` - Gross weight
- `SNW` - Net weight  
- `SCO` - Count
- `SPW` - Piece weight
- `SVN` - Version
- `ZRO` - Zero scale
- `ATW` - Acquire tare

## Data Validation

### Check Captured Data:
```bash
# View last 20 readings
grep "scale_reading" logs/scale-data-*.log | tail -20

# Count total readings
grep -c "scale_reading" logs/scale-data-*.log

# Check for errors
grep "error" logs/scale-data-*.log | tail -10
```

## Expected Sterling 7600 Responses

### Normal Responses:
- Weight: `"Gross 100.55 lb.\r\n"`
- Count: `"Count 157 Pieces\r\n"`
- Piece Weight: `"Piece Weight 0.6350 lb.\r\n"`
- Version: `"V 2.01\r\n"`

### Error Conditions:
- `Err.80` - Serial command data error
- `Err.81` - Unknown serial command
- `ULULUL` - Under-load condition
- `OLOLOL` - Over-load condition
- `-------` - A/D acquisition in progress

## Quick Status Check

```bash
# Check if app is healthy
bun start --mode=scale --diagnostics
```

Look for:
- ✅ Port Detection: PASS
- ✅ Connection: PASS (<10s)
- ✅ Command responses: PASS
- ✅ Packet loss: <5%

## Emergency Stop

Press `Ctrl+C` to gracefully shutdown and save all data.

## Notes for Client Testing

1. **First Connection**: May take up to 10 seconds to establish
2. **Response Times**: Should be <500ms in normal operation
3. **Data Files**: All readings saved to `logs/scale-data-*.log`
4. **Auto-Recovery**: System will auto-reconnect if cable disconnected
5. **Performance**: Can handle 1000+ readings per session

## Success Indicators

✅ **Phase 2 Complete** when:
- Connected to Sterling 7600 within 5 minutes
- All commands return valid responses
- 100+ readings captured with <5% loss
- Response times consistently <2 seconds
- Auto-reconnection works after cable disconnect