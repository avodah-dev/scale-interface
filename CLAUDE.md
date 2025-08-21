# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Documentation Structure

- **project-overview.md** - Complete system requirements, architecture, and end-to-end specifications for the 13-station scale interface system
- **game-plan.md** - Phased development approach with current focus on console testing for proposal validation
- **scale-manual.md** - Sterling 7600 technical specifications, RS-232 protocol, commands, and response formats
- **tool-inventory.md** - Available hardware tools and development equipment for current testing phase
- **CLAUDE.md** - This file - development guidance and project context for Claude Code

## Project Overview

This is a scale-based workstation system project for industrial manufacturing environments. The goal is to create 13 identical stations where employees can:

- Sign in with employee ID on touchscreen devices
- Enter project/part IDs to activate stations
- Monitor real-time metrics from Sterling 7600 industrial scales via RS-232 serial communication
- Display metrics: total counts today, counts this hour, expected per hour, average per hour
- Upload data to cloud database with offline resilience

## Development Phases

### Phase 1a: Console-Based Testing - Mock Scale (✅ COMPLETED)
**Status**: All success criteria met and validated with mock scale simulation
**Runtime**: Bun 1.2 with full npm compatibility
**Ready for**: Phase 1b hardware testing with office equipment

Built a comprehensive Node.js/Bun console application with:

```javascript
// Configuration structure - load from config.json
const defaultConfig = {
  serial: {
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    timeout: 5000
  },
  commands: {
    grossWeight: 'SGW\r',    // Send gross weight
    netWeight: 'SNW\r',     // Send net weight
    count: 'SCO\r',         // Send count (counting mode)
    pieceWeight: 'SPW\r',   // Send piece weight
    zero: 'ZRO\r',          // Zero the scale
    tare: 'ATW\r',          // Acquire tare weight
    print: 'SRP\r',         // Send formatted data output
    version: 'SVN\r'        // Send firmware version
  },
  polling: {
    interval: 1000,     // 1 second, configurable
    timeout: 5000,      // Response timeout
    retries: 3          // Failed command retries
  },
  logging: {
    level: 'debug',
    format: 'json',
    includeRaw: true
  },
  mode: 'testing'       // 'testing' or 'scale'
};
```

### Phase 1b: Console-Based Testing - Real Hardware (✅ COMPLETED)
**Status**: Successfully tested with Gearmo FTDI adapter (no scale hardware needed for this phase)
**Goal**: Test console application with actual RS-232 hardware using office equipment
**Available Hardware**: Gearmo USB-to-Serial adapter, CableMax LED tester, DB9 null modem adapter

**Phase 1b Test Plan**:
1. Connect Gearmo FTDI adapter to available RS-232 device (any scale or RS-232 equipment)
2. Run hardware diagnostics: `bun start --mode=scale --diagnostics`
3. Test actual serial communication vs mock responses
4. Validate FTDI adapter auto-detection and connection
5. Test error handling with real hardware timeouts and disconnections
6. Document actual vs simulated response timing and behavior
7. Test loopback communication with null modem adapter if no scale available

**Hardware Setup for Phase 1b**:
- Any available RS-232 device OR loopback testing with null modem adapter
- Gearmo USB-to-Serial FTDI adapter (primary)
- CableMax RS-232 LED tester (signal verification and diagnostics)
- DB9 null modem adapter (for loopback testing if no scale available)
- MacBook Pro M2 Max (development platform)

**Expected Outcomes**:
- Validation of real serial communication vs mock simulation
- FTDI adapter compatibility and performance confirmation
- Real-world timing and error handling validation
- Confidence in hardware approach before client site visit

### Phase 2: Client Site Validation with Sterling 7600 (✅ COMPLETED 2025-08-19)
**Status**: Successfully validated all Sterling 7600 functionality at client site
**Goal**: Validate console application with actual Sterling 7600 scales at client site
**Available Hardware**: Tested console app + FTDI adapter from Phase 1b

**Phase 2 Test Plan**:
1. Deploy tested console application to client site
2. Connect to actual Sterling 7600 scale (DB-9 serial port)
3. Validate Sterling 7600 specific protocol implementation
4. Capture and document actual Sterling 7600 data formats
5. Test all Sterling 7600 commands (SGW, SNW, SCO, SPW, ZRO, ATW, SRP, SVN)
6. Document any Sterling 7600-specific protocol adjustments needed
7. Assess communication reliability for project estimation confidence

**Actual Outcomes** (2025-08-19):
- ✅ Sterling 7600 protocol validated (with command echo discovery)
- ✅ Performance: 0% packet loss, <30ms response times
- ✅ Perfect stability in client environment
- ✅ 100% confidence for Phase 3 full system development
- ✅ Count tracking works perfectly (tested up to 19 pieces)
- ✅ Firmware version 4.31.0 identified

### Phase 3: Full Multi-Station System Development
Develop complete 13-station sorting system with:

**Per Station Components**:
- Android tablet application (touchscreen UI)
- Employee ID sign-in system
- Part number entry and target tracking
- Real-time scale data collection via USB-to-Serial
- Local data buffering for network resilience
- Progress tracking against assigned quotas

**Central System Components**:
- Central database for all station data
- Master monitoring dashboard for supervisors
- Real-time aggregation of all 13 stations
- Part number to target count mapping
- Employee productivity tracking
- Historical reporting and analytics

**Technical Challenges**:
- Android USB serial communication permissions
- Multi-station data synchronization
- Network reliability in industrial environment
- Offline operation with automatic sync
- Real-time updates to master dashboard
- Scale USB connection to Android tablets

## Technical Architecture

### Hardware Setup
- **Scales**: Sterling 7600 series with RS-232 DB9 serial output
- **Connection**: USB-to-RS232 adapters (FTDI-based recommended)
- **Stations**: Windows/Linux devices with touchscreens
- **Communication**: Direct serial connection, no intermediary controllers

### Serial Communication
- **Port Settings**: 9600 baud, 8 data bits, 1 stop bit, no parity, 5s timeout
- **Pinout**: Pin 2 (TX), Pin 3 (RX), Pin 5 (Ground)
- **Commands**: 3-letter commands + CR: `SGW\r` (gross weight), `ZRO\r` (zero), `ATW\r` (tare), `SCO\r` (count)
- **Polling**: 1000ms interval (configurable 500-10000ms range)
- **Protocol**: ASCII responses in specific formats:
  - Weight: `"Gross 100.55 lb.<cr><lf>"`
  - Count: `"Count 157 Pieces<cr><lf>"`
  - Piece Weight: `"Piece Weight 0.6350 lb.<cr><lf>"`
- **Error Handling**: Scale error codes (`Err.80`, `Err.81`), status conditions (`ULULUL`, `OLOLOL`, `-------`), timeout, connection loss, retry logic
- **Data Validation**: Bounds checking, format validation, completeness checks

### Tech Stack
- **Electron**: Cross-platform application framework
- **Node.js**: Serial communication and API calls
- **Libraries**:
  - **node-serialport**: USB serial communication
  - **Local Storage**: SQLite recommended with WAL mode for offline resilience
  - **axios**: HTTP client with retry/timeout
  - **electron-store**: Configuration management
  - **winston**: Structured logging
  - **joi**: Data validation schemas
- **Development**: electron-builder, jest, eslint, nodemon
- **Frontend**: React (recommended for component reusability)

## Development Tools Available

### Hardware Toolkit
- **MacBook Pro M2 Max**: Primary development platform (macOS 15.5)
- **Gearmo USB-to-Serial Adapter**: FTDI-based, LED indicators (**NEED BACKUP UNIT**)
- **CableMax RS-232 LED Tester**: Signal monitoring and troubleshooting
- **DB9 Null Modem Adapter**: Testing and loopback scenarios
- **Anker PowerExpand+ Hub**: Port expansion for multiple connections

### Future Production Considerations
For full system deployment, additional tools will be needed:
- Backup USB-to-Serial adapters for redundancy
- Windows/Linux testing environments for cross-platform validation
- Additional hardware for 13-station deployment

### Development Approach
1. **Console Testing**: Build Node.js app for scale communication validation
2. **Data Format Capture**: Log all serial communication for protocol analysis
3. **Electron Development**: Build touchscreen-optimized UI
4. **Cross-Platform Testing**: Validate on Windows/Linux targets
5. **Cloud Integration**: Implement API calls with offline buffering

## Key Success Criteria

### Phase 1a Console App - Mock Scale (✅ ALL CRITERIA MET)
- ✅ **Connection**: Establish serial connection within 10 seconds (achieved: 105ms with mock)
- ✅ **Communication**: Send command and receive response in <2 seconds (achieved: ~102ms with mock) 
- ✅ **Error Handling**: Gracefully handle 7+ error scenarios (achieved: 10/10 scenarios with simulation)
- ✅ **Data Capture**: Log 100+ scale readings with structured timestamps (achieved: 110+ mock readings)
- ✅ **Configuration**: Change all settings via config.json without code changes (full validation system)
- ✅ **Recovery**: Automatically reconnect after connection loss (tested with mock disconnections)
- ✅ **Performance**: Maintain <5% packet loss during extended test (achieved: 0.9% with mock)

**Phase 1a Validation Commands**: 
- `bun start --mode=testing --diagnostics` (quick mock test)
- `bun run validate-success-criteria.js` (comprehensive mock validation)
- `bun start --mode=testing --time=60` (extended mock polling test)

### Phase 1b Hardware Testing (🎯 CURRENT FOCUS)
- Connect to actual RS-232 hardware within 5 minutes
- Validate FTDI adapter auto-detection and compatibility
- Test real serial communication vs mock simulation timing
- Assess communication reliability with physical hardware (any RS-232 device)
- Document actual vs simulated response characteristics
- Test loopback communication if no scale hardware available

**Phase 1b Commands for Hardware Testing**:
```bash
# Test with real hardware (FTDI adapter required)
bun start --mode=scale --diagnostics
bun start --mode=scale --time=300

# Compare real vs mock data
grep "scale_reading" logs/scale-data-*.log | tail -20
```

### Phase 2 Sterling 7600 Validation
- Connect to Sterling 7600 within 5 minutes at client site
- Validate all Sterling 7600 commands and response formats
- Capture and document Sterling 7600 specific data formats
- Assess communication reliability with target hardware
- Provide confidence for project estimation and Phase 3 scope

### Phase 3 Full System
- 13 stations with touchscreen interfaces
- Real-time data collection and cloud sync
- Offline resilience with local data buffering
- Industrial environment usability

## Critical Considerations

- **Sterling 7600 Protocol**: Manual obtained - use 3-letter commands, handle specific response formats and error codes
- **Hardware Redundancy**: Plan for backup adapters in production deployment
- **Cross-Platform Testing**: Address during full system development phase
- **Serial Communication Reliability**: Comprehensive error handling and recovery
- **Offline Resilience**: Core requirement - maintain data integrity during network outages (SQLite WAL mode suggested approach)
- **Data Validation**: Input validation, bounds checking, format verification
- **Security**: Secure API authentication and encrypted data transmission
- **Performance**: Sub-2-second response times for all operations
- **Monitoring**: Structured logging for field support and troubleshooting

## Project Status

### ✅ Phase 1a - Console Testing with Mock Scale COMPLETED:
- ✅ **Complete Bun 1.2 console application** - All success criteria validated with mock scale
- ✅ **Sterling 7600 protocol implementation** - Full command set and error handling (simulated)
- ✅ **Mock testing framework** - Hardware-independent development and validation
- ✅ **Configuration management** - JSON-based with full validation
- ✅ **Structured logging** - Comprehensive data capture and analysis
- ✅ **Performance validation** - Sub-second response times, <1% packet loss (simulated)

**Ready for Phase 1b**: Console application tested and validated with mock, ready for real hardware testing

### 🎯 Phase 1b - Hardware Testing with Office Equipment (CURRENT FOCUS):
- ✅ **Console application completed** - Validated with comprehensive mock testing
- ✅ **Hardware available** - Gearmo FTDI adapter and testing tools on hand  
- ✅ **Development environment** - MacBook Pro with complete console application
- 🔄 **Hardware testing plan** - Ready to connect to actual RS-232 hardware

**Phase 1b Commands for Hardware Testing**:
```bash
# Test with real hardware (FTDI adapter + any RS-232 device)
bun start --mode=scale --diagnostics
bun start --mode=scale --time=300

# Compare real vs mock data in logs
grep "scale_reading" logs/scale-data-*.log | tail -20
```

### Phase 2 - Sterling 7600 Client Site Validation (TOMORROW):
- Pending Phase 1b completion and real hardware validation
- Deploy tested console application to client site with Sterling 7600 scales
- Validate Sterling 7600 specific protocol and response formats
- Final confidence assessment for Phase 3 full system development

### Future Phase 3 Will Address:
- Electron UI development based on validated console modules
- Cross-platform deployment (Windows/Linux)
- Multi-station coordination and cloud integration
- Production deployment for 13-station system