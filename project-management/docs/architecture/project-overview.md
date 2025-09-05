# Project Overview: Scale-Based Workstation System

## Goal

Create 13 identical "stations" where an employee can:

- Sign in with an employee ID on a touchscreen device.
- Enter a project or part ID.
- Once both IDs are entered, the station becomes active, begins reading counts from an industrial scale (Sterling 7600 series), and displays real-time metrics:
  - Total counts today
  - Counts this hour
  - Expected per hour
  - Average per hour
  - Other custom metrics as needed.
- Upload reading data to a cloud-based database for centralized reporting and analysis.
- Provide offline resilience: if the station loses internet, it must continue capturing and buffering data locally, then sync to the server when reconnected.

## System Architecture

### Hardware:
Each station has:
- Sterling 7600 scale with RS-232 DB9 serial output.
- USB-to-RS232 adapter (FTDI recommended).
- A device running Windows or Linux (e.g., rugged tablet, mini-PC) with touchscreen.
- Station devices have consistent power and wired or stable Wi-Fi network connectivity.

### Communication:
- Direct wired serial connection between scale and station device.
- No intermediary microcontrollers or wireless links needed.

### Backend:
- Central cloud database/API server.
- Aggregates data from all 13 stations.
- Provides dashboards, historical reports, and management tools.

## Employee Workflow at a Station

1. Employee walks to their assigned station.
2. On the touchscreen, they enter:
   - Employee ID
   - Station number (auto-detected or selected)
3. Station moves to pending state, requesting Part/Project ID.
4. Once Part/Project ID is entered, station enters active state:
   - Electron app begins reading data from the scale.
   - Metrics start displaying in real time.
   - Data is continuously uploaded to cloud database.
5. Employee can view:
   - Live count metrics.
   - Daily/hourly performance stats.
6. Employee ends session by logging out or closing project ID.

## Electron App Requirements

### Core Responsibilities
- Open and manage the serial port connection to the scale via USB RS-232 adapter.
- Send periodic 3-letter commands to request data: `SGW\r` (gross weight), `SCO\r` (count), `SPW\r` (piece weight).
- Receive and parse ASCII responses from the scale.
- Process and locally store readings with timestamps, employee ID, part ID, and station number.
- Calculate and update on-screen metrics, including:
  - Total today
  - This hour's counts
  - Expected per hour
  - Average per hour
- Display a clean, responsive UI optimized for a touchscreen:
  - Employee/part ID entry screens
  - Pending/active state transitions
  - Real-time metrics view
  - Error/connection status indicators
- Push readings and metrics to the central API in near real time.
- Implement offline buffering: if the device loses internet, store data locally and sync when back online.
- Provide logging for troubleshooting (scale connection, API calls, errors).

## Serial Communication Details

### Port Settings:
- **Baud Rate**: 9600 (confirmed from Sterling 7600 manual)
- **Data Bits**: 8
- **Stop Bits**: 1
- **Parity**: none
- **Flow Control**: none (confirmed from Sterling 7600 manual)
- **Timeout**: 5000ms (configurable)
- **Buffer Size**: 1024 bytes (configurable)

### Pinout (RS-232 DB9):
- **Pin 5**: Signal Ground
- **Pin 2**: Transmit (scale → device)
- **Pin 3**: Receive (device → scale)

### Command/Response Flow:
- Send 3-letter commands: `SGW\r` (gross weight), `SCO\r` (count), `ZRO\r` (zero), `ATW\r` (tare)
- Receive formatted ASCII responses:
  - Weight: `"Gross 100.55 lb.<cr><lf>"`
  - Count: `"Count 157 Pieces<cr><lf>"`
  - Piece Weight: `"Piece Weight 0.6350 lb.<cr><lf>"`
- Parse and validate response:
  - Check for numeric value in expected format
  - Validate response completeness (proper termination)
  - Handle specific error codes: `Err.80` (data error), `Err.81` (unknown command), `ULULUL` (underload), `OLOLOL` (overload), `-------` (A/D in progress)
  - Ignore incomplete or malformed lines
  - Apply data bounds checking (min/max weight values)
- Implement retry logic for failed commands (max 3 retries)
- Log all communication for troubleshooting

### Communication Frequency:
- **Default Polling**: 1000ms (1 second) - configurable via config.json
- **Minimum Interval**: 500ms (to avoid overwhelming scale)
- **Maximum Interval**: 10000ms (10 seconds)
- **Adaptive Polling**: Reduce frequency on consecutive errors
- **Burst Protection**: Limit consecutive commands without delay
- **Performance Monitoring**: Track response times and adjust if needed

## Cloud Integration

### API Integration Requirements

Electron app must:
- **Authentication**: Use secure token or key (JWT recommended)
- **Data Format**: POST reading data as JSON:
  ```json
  {
    "station_id": "STATION_01",
    "employee_id": "EMP123",
    "part_id": "PART_ABC",
    "timestamp": 1640995200000,
    "raw_weight": 15.75,
    "processed_count": 157,
    "metrics": {
      "total_today": 1250,
      "counts_this_hour": 65,
      "average_per_hour": 78.5
    }
  }
  ```
- **Upload Strategy**: Batch uploads when possible (max 100 records)
- **Error Handling**: Retry failed uploads with exponential backoff
- **Status Tracking**: Update local database upload_status field
- **Network Detection**: Monitor connection status and adjust behavior
- **Data Compression**: Gzip compress large payloads
- **Rate Limiting**: Respect API rate limits (max 10 requests/second)

## User Interface Requirements

- Touch-friendly design with large buttons and text.
- Three key screens:
  1. **Login Screen** — Employee ID and station selection (if not auto-detected).
  2. **Part/Project Entry Screen** — Part ID input, moves station to active.
  3. **Active Screen** — Real-time metrics, session status, logout button.

### Optional:
- Admin settings or diagnostics page.
- Visual cues for errors (scale disconnected, network down).
- Responsive UI to handle different resolutions (8–15" touchscreens).

## Offline Resilience - Core Requirement

**Primary Objective**: System must continue operating and preserve data integrity when network connectivity is lost.

**Implementation Approach** (SQLite suggested):
- Local data storage with atomic transactions
- Automatic sync when connectivity restored
- Data validation and integrity checks
- Conflict resolution for simultaneous updates

### Suggested Local Data Storage Schema (SQLite)
```sql
-- Readings table for scale data
CREATE TABLE readings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  station_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  part_id TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  raw_weight REAL NOT NULL,
  processed_count INTEGER,
  upload_status TEXT DEFAULT 'pending', -- pending, uploaded, failed
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  uploaded_at INTEGER
);

-- Additional tables for error logging, configuration as needed
```

### Data Synchronization Strategy
- **Offline Mode**: Store all data locally when cloud API is unreachable
- **Connection Recovery**: Automatically detect network restoration
- **Upload Queue**: Process pending uploads in chronological order
- **Conflict Resolution**: Server timestamps take precedence
- **Data Integrity**: Core requirement - handle power loss gracefully (WAL mode recommended for SQLite)
- **Retry Logic**: Exponential backoff for failed uploads (max 3 attempts)
- **Data Validation**: Verify data integrity before upload attempts

## Lifecycle & Maintenance

### On startup:
- Initialize serial port.
- Attempt to connect to cloud.
- Show login screen.

### On shutdown:
- Flush pending data to local storage.
- Cleanly close serial connection.
- Auto-update support (optional but recommended).

## Tech Stack

- **Electron**: cross-platform shell for the app.
- **Node.js**: serial communication, API calls, offline buffer
- **Frontend**: HTML, CSS, JS (React recommended for component reusability)
- **Local Storage**: SQLite with WAL mode recommended for offline resilience
- **Suggested Libraries**:
  - **node-serialport**: USB serial communication
  - **Local storage solution**: SQLite recommended for offline data integrity
  - **HTTP client**: axios or similar with retry/timeout support
  - **Configuration management**: electron-store or equivalent
  - **Logging framework**: winston or equivalent for structured logging
  - **Data validation**: joi or equivalent schema validation
- **Development Tools**:
  - **electron-builder**: Cross-platform packaging
  - **jest**: Unit testing framework
  - **eslint**: Code quality
  - **nodemon**: Development hot reload

## Prompt for Developer or LLM

Build an Electron-based touchscreen app to communicate with a Sterling 7600 RS-232 scale using a USB-RS232 adapter. The app must:

- Open a serial connection with 9600 baud, 8N1.
- Periodically send a weight/count request command (e.g., `P\r`) to the scale.
- Parse ASCII responses from the scale into numeric counts.
- Display a touchscreen-friendly UI for login, project entry, and live metrics.
- Upload reading data with employee ID, part ID, station number, and metrics to a cloud API.
- Cache data locally using SQLite when offline, retry uploads automatically.
- Support offline operation for extended internet outages.
- Include logging, error handling, and UI feedback for connection or upload failures.
- Provide a responsive and modern user experience using Electron.
- Follow the Project Overview provided for architecture, workflow, and responsibilities.

## Development Resources & Tools

### Current Development Setup:
- **MacBook Pro M2 Max**: Development platform for console testing
- **Gearmo USB-to-Serial Adapter**: Scale connection for validation
- **CableMax RS-232 LED Tester**: Signal monitoring and diagnostics
- **Testing Tools**: DB9 null modem adapter, port expansion hub

### Key Development Phases:
1. **Scale Communication Testing** - Verify Sterling 7600 connectivity and data format
2. **Electron App Development** - Core application with serial communication
3. **UI/UX Development** - Touchscreen-optimized interface
4. **Cloud Integration** - API development and data synchronization
5. **Testing & Deployment** - Cross-platform testing and station deployment

### Critical Success Factors:
- **Serial Communication Reliability** - Must work consistently with Sterling 7600
- **Data Validation** - Comprehensive input validation and error handling
- **Offline Resilience** - Data integrity during network outages with SQLite WAL mode
- **Cross-Platform Compatibility** - Windows/Linux deployment targets (test early)
- **Touchscreen Optimization** - Industrial environment usability with large touch targets
- **Real-time Performance** - Sub-2-second response times for all operations
- **Security** - Secure API authentication and data transmission
- **Monitoring** - Comprehensive logging and error tracking for field support

## Console Application Specifications (Phase 1)

### Core Requirements
- **Node.js application** with serial communication capabilities
- **Configurable parameters**: baud rate, commands, polling frequency
- **Dual modes**: Testing (simulated responses) and Scale (real communication)
- **Comprehensive logging**: All sent/received data with timestamps
- **Error handling**: Connection failures, invalid responses, timeouts
- **Real-time monitoring**: LED indicator status via CableMax tester

### Technical Implementation
```javascript
// Example structure for console app
const SerialPort = require('serialport');
const config = {
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
  pollingInterval: 1000, // ms
  commands: ['SGW\r', 'SCO\r', 'ZRO\r'], // Sterling 7600 commands
  mode: 'testing' // or 'scale'
};
```

### Data Format Capture
- **Raw communication logs** with timestamps
- **Parsed response data** (weight/count values)
- **Error logs** for troubleshooting
- **Performance metrics** (response times, success rates)
- **Scale protocol documentation** for future reference

### Success Validation
- Can connect to RS-232 device within 30 seconds
- Can send commands and receive responses reliably
- Can handle connection interruptions gracefully
- Can log all communication for analysis
- Can switch between testing and scale modes seamlessly
