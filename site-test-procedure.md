# Sterling 7600 Site Test Procedure

## Pre-Site Checklist
- [ ] MacBook Pro charged
- [ ] Gearmo USB-to-Serial adapter
- [ ] CableMax RS-232 LED tester
- [ ] DB9 gender changer (if needed)
- [ ] Console application on MacBook
- [ ] Node.js confirmed working (v22.11.0)

## Test Phases Overview
1. **Phase A**: Baseline Test (No Hardware)
2. **Phase B**: Hardware Validation (Gearmo + CableMax)
3. **Phase C**: Sterling 7600 Connection & Validation

---

## Phase A: Baseline Test (5 minutes)
*Purpose: Confirm software is working before connecting any hardware*

### A1. Check Node.js Installation
```bash
node --version
```
**Expected Output:** `v22.11.0` or higher

### A2. Navigate to Project
```bash
cd /Users/andrewbailey/dev/scale-interface
```

### A3. Run Mock Scale Test
```bash
pnpm start:test
```

**Expected Output:**
```
✅ Mock scale initialized
✅ Mock scale connected (simulated) (~100ms)
✅ version: V 2.01
✅ grossWeight: Gross 100.55 lb.
✅ netWeight: Net 95.30 lb.
✅ count: Count 157 Pieces
```

**Success Criteria:** All commands return mock responses without errors

---

## Phase B: Hardware Validation (10 minutes)
*Purpose: Verify Gearmo adapter is working before Sterling 7600 connection*

### B1. Connect Gearmo Adapter
1. Plug Gearmo USB-to-Serial adapter into MacBook USB port
2. Wait 10-15 seconds for macOS recognition
3. If prompted "Allow accessory to connect?", click **Allow**

### B2. Verify Adapter Detection
```bash
ls /dev/cu.* | grep usbserial
```
**Expected Output:** `/dev/cu.usbserial-XXXXXXXX` (note the exact name)

### B3. Update Configuration with Detected Port
```bash
# Check current port setting
grep "path" config.json

# If needed, update to match detected port:
# Edit config.json and update "path": "/dev/cu.usbserial-XXXXXXXX"
```

### B4. Connect CableMax Tester
1. Connect CableMax directly to Gearmo DB9 port
2. Note initial LED states:
   - **Expected:** PWR on, some LEDs may be green

### B5. Run Hardware Test
```bash
pnpm start:hardware
```

**Expected Observations:**
1. **Console Output:**
   ```
   ✅ Found 1 FTDI adapter(s)
   ✅ Scale connected on /dev/cu.usbserial-XXXXXXXX (20-30ms)
   ❌ version: Command timeout (expected - no response device)
   ```

2. **LED Behavior:**
   - **Gearmo TXD:** Flash 4+ times during test
   - **CableMax TXD:** Solid green with faint red flashes
   - **CableMax DTR/RTS:** May turn red during transmission

**Success Criteria:** 
- Gearmo TXD LED flashes during transmission
- Commands timeout (expected - no scale connected)
- No connection errors

### B6. Disconnect CableMax
Remove CableMax tester - ready for Sterling 7600 connection

---

## Phase C: Sterling 7600 Testing (20 minutes)
*Purpose: Validate communication with actual Sterling 7600 scale*

### C1. Physical Connection
1. Locate Sterling 7600 DB9 serial port
2. Connect: MacBook → Gearmo USB adapter → Sterling 7600 DB9 port
3. Ensure scale is powered on and in normal operating mode

### C2. Initial Connection Test
```bash
pnpm start:scale
```

**Expected Output:**
```
✅ Found 1 FTDI adapter(s)
✅ Scale connected on /dev/cu.usbserial-XXXXXXXX (20-30ms)
✅ version: V 2.01 (or similar firmware version)
✅ grossWeight: Gross XXX.XX lb.
✅ netWeight: Net XXX.XX lb.
✅ count: Count XXX Pieces (if in counting mode)
```

**Troubleshooting:**
- If timeouts occur, check:
  - [ ] DB9 connection is secure
  - [ ] Scale is powered on
  - [ ] Scale is not in setup/config mode
  - [ ] Try different baud rate (scale might not be 9600)

### C3. Extended Data Collection
```bash
pnpm start -- --mode=scale --time=60
```

**Expected Behavior:**
- Polls scale every second for 60 seconds
- Logs show continuous readings
- Watch for patterns in the data

**Sample Output:**
```
{"command":"grossWeight","response":"Gross 125.50 lb.","timestamp":"2025-07-29 10:15:32"}
{"command":"grossWeight","response":"Gross 125.50 lb.","timestamp":"2025-07-29 10:15:33"}
{"command":"grossWeight","response":"Gross 126.25 lb.","timestamp":"2025-07-29 10:15:34"}
```

### C4. Test All Sterling 7600 Commands
Run each command individually to document responses:

```bash
# Create a test script for individual commands
node -e "
const { SerialPort } = require('serialport');
const port = new SerialPort({
  path: '/dev/cu.usbserial-XXXXXXXX',
  baudRate: 9600
});
port.on('open', () => {
  console.log('Testing SGW command...');
  port.write('SGW\\r');
  port.on('data', (data) => {
    console.log('Response:', data.toString());
    port.close();
  });
});
"
```

**Test Each Command:**
1. `SGW\r` - Gross Weight
2. `SNW\r` - Net Weight  
3. `SCO\r` - Count
4. `SPW\r` - Piece Weight
5. `ZRO\r` - Zero Scale
6. `ATW\r` - Acquire Tare
7. `SRP\r` - Print/Send Data
8. `SVN\r` - Firmware Version

**Document Actual Responses:**
```
SGW: "Gross 125.50 lb.<cr><lf>"
SNW: "Net 120.25 lb.<cr><lf>"
SCO: "Count 250 Pieces<cr><lf>"
SPW: "Piece Weight 0.4810 lb.<cr><lf>"
ZRO: "Zero Complete<cr><lf>"
ATW: "Tare Acquired<cr><lf>"
SRP: "125.50 lb. Gross<cr><lf>"
SVN: "V 2.01<cr><lf>"
```

### C5. Error Condition Testing
*If safe and permitted by client:*

1. **Test Overload Response:**
   - Apply excessive weight (if safe)
   - Document error response (expect "OLOLOL")

2. **Test Underload Response:**
   - Remove all weight
   - Document response (expect "ULULUL" or similar)

3. **Test Motion Response:**
   - Add weight while polling
   - Document "-------" or motion indicator

### C6. Performance Validation
```bash
# Run 5-minute continuous test
node src/index.js --mode=scale --time=300 > test-results.log 2>&1
```

**Analyze Results:**
```bash
# Check response times
grep "responseTime" logs/scale-data-*.log | tail -20

# Check for errors
grep -i "error" logs/application-*.log | tail -20

# Count successful readings
grep "scale_reading" logs/scale-data-*.log | wc -l
```

**Success Metrics:**
- [ ] <2 second response time
- [ ] <5% packet loss
- [ ] No connection drops
- [ ] Consistent data format

### C7. Final Validation Summary
Create a summary of findings:

1. **Connection Details:**
   - Port used: _______________
   - Connection time: _____ ms
   - Baud rate confirmed: 9600

2. **Command Responses Verified:**
   - [ ] SGW - Gross Weight
   - [ ] SNW - Net Weight
   - [ ] SCO - Count
   - [ ] SPW - Piece Weight
   - [ ] ZRO - Zero
   - [ ] ATW - Tare
   - [ ] SRP - Print
   - [ ] SVN - Version

3. **Performance Metrics:**
   - Average response time: _____ ms
   - Packet loss rate: _____ %
   - Total readings collected: _____

---

## Post-Test Cleanup

1. **Save Test Results:**
   ```bash
   # Create results archive
   mkdir sterling-test-results-$(date +%Y%m%d)
   cp logs/*.log sterling-test-results-$(date +%Y%m%d)/
   cp test-results.log sterling-test-results-$(date +%Y%m%d)/
   ```

2. **Reset Configuration:**
   ```bash
   # Set mode back to setup-testing for development
   # Edit config.json: "mode": "setup-testing"
   ```

3. **Disconnect Hardware:**
   - Safely disconnect from Sterling 7600
   - Store Gearmo adapter properly

---

## Quick Reference Card

### Essential Commands:
```bash
# Mock test (no hardware)
pnpm start:test

# Hardware test (with CableMax)
pnpm start:hardware

# Scale test (with Sterling 7600)
pnpm start:scale

# Extended data collection
pnpm start -- --mode=scale --time=300
```

### Troubleshooting:
- **No serial port found:** Check USB connection, wait 15 seconds
- **Permission denied:** May need to run with sudo (not recommended)
- **Timeouts with scale:** Check DB9 connection, verify scale power
- **Wrong data format:** Verify baud rate (try 4800 or 19200)
- **Node.js app fails:** Use CoolTerm for manual testing (Sterling7600-9600.stc)
- **Protocol debugging:** CoolTerm hex view shows exact bytes sent/received

### Success Indicators:
✅ Gearmo detected as /dev/cu.usbserial-XXXXXXXX
✅ Connection established <100ms
✅ Valid responses from all commands
✅ Consistent data format matching manual
✅ <5% packet loss over 5 minutes