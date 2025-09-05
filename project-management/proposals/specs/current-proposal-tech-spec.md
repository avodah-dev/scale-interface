# Technical Specification
## UQSA Scale Integration System

---

## System Architecture Overview

```
Station Device (Raspberry Pi)          Cloud Infrastructure
┌─────────────────────────────┐       ┌────────────────────────┐
│  7" Touch Display           │       │  PostgreSQL Database   │
│  ├── Employee Login         │       │  ├── Minute Readings   │
│  ├── Part Selection         │ ──────│  ├── Box Completions   │
│  └── Production Display     │  WiFi │  ├── Employees         │
│                             │       │  ├── Parts             │
│  Local Storage (SQLite)     │       │  └── Stations          │
│  └── 10 min buffer         │       └────────────────────────┘
│                             │       
│  Serial Connection          │       ┌────────────────────────┐
│  └── Sterling 7600 Scale   │       │  Web Dashboard         │
└─────────────────────────────┘       │  ├── Station Overview  │
                                      │  ├── Admin Panel       │
                                      │  └── Reports           │
                                      └────────────────────────┘
```

---

## Data Flow

### Real-time Scale Reading
1. **Scale → Station (every second)**
   - Read current weight via RS-232 serial
   - Convert weight to piece count using part configuration
   - Display on screen immediately
   - Store in local buffer

2. **Station → Cloud (every minute)**
   - Send highest piece count from past minute
   - Include station_id, part_number, employee_id, timestamp
   - Retry on network failure

3. **Box Completion Events**
   - Primary: Employee presses "Record Count" button
   - Fallback: Auto-detect when count drops below 10% for 5+ seconds
   - Record final count with trigger type

---

## Database Schema

### 1. Minute Readings Table
```sql
CREATE TABLE minute_readings (
    id SERIAL PRIMARY KEY,
    station_id INTEGER NOT NULL,
    part_number VARCHAR(50) NOT NULL,
    employee_id VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    highest_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX idx_station_time (station_id, timestamp),
    INDEX idx_part_time (part_number, timestamp)
);
```

### 2. Box Completions Table
```sql
CREATE TABLE box_completions (
    id SERIAL PRIMARY KEY,
    station_id INTEGER NOT NULL,
    part_number VARCHAR(50) NOT NULL,
    employee_id VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    final_count INTEGER NOT NULL,
    trigger_type VARCHAR(20) NOT NULL, -- 'button' or 'auto_reset'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX idx_station_date (station_id, DATE(timestamp)),
    INDEX idx_employee_date (employee_id, DATE(timestamp))
);
```

### 3. Employees Table
```sql
CREATE TABLE employees (
    employee_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    pin VARCHAR(10) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Parts Table
```sql
CREATE TABLE parts (
    part_number VARCHAR(50) PRIMARY KEY,
    description VARCHAR(200),
    piece_weight_grams DECIMAL(10,4) NOT NULL,
    target_pph INTEGER NOT NULL, -- target pieces per hour
    box_capacity INTEGER NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Stations Table
```sql
CREATE TABLE stations (
    station_id INTEGER PRIMARY KEY,
    station_name VARCHAR(50) NOT NULL,
    mode VARCHAR(20) NOT NULL, -- 'assembly' or 'sorting'
    active BOOLEAN DEFAULT true,
    current_employee_id VARCHAR(20),
    current_part_number VARCHAR(50),
    last_activity TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Station Software (Raspberry Pi)

### Technology Stack
- **OS**: Raspberry Pi OS (Debian-based)
- **Runtime**: Node.js 18+ with TypeScript
- **UI Framework**: React with touch-optimized components
- **Local Database**: SQLite for buffering
- **Serial Communication**: serialport library
- **Process Manager**: PM2 for auto-restart

### Core Modules

#### 1. Scale Interface Module
```typescript
interface ScaleReading {
    timestamp: Date;
    rawWeight: number;
    pieceCount: number;
    isStable: boolean;
}

class ScaleInterface {
    connect(port: string): Promise<void>
    getReading(): Promise<ScaleReading>
    calibrate(partNumber: string): Promise<void>
}
```

#### 2. Local Storage Module
```typescript
class LocalBuffer {
    // Stores last 10 minutes of readings
    addReading(reading: ScaleReading): void
    getMinuteHighest(minute: Date): number
    getRecentReadings(seconds: number): ScaleReading[]
    clearOldReadings(): void
}
```

#### 3. Cloud Sync Module
```typescript
class CloudSync {
    sendMinuteReading(data: MinuteReading): Promise<void>
    sendBoxCompletion(data: BoxCompletion): Promise<void>
    getConfiguration(stationId: number): Promise<StationConfig>
    retryFailedUploads(): Promise<void>
}
```

#### 4. Box Detection Module
```typescript
class BoxDetection {
    checkForCompletion(readings: ScaleReading[]): boolean
    // Returns true if count dropped >90% for 5+ seconds
    calculateFinalCount(readings: ScaleReading[]): number
}
```

### User Interface Screens

#### Screen 1: Employee Login
- Numeric keypad for employee ID entry
- Validates against local cached employee list
- Shows step indicator (1 of 3)

#### Screen 2: Part Selection
- Numeric keypad for part number entry
- Shows employee ID from previous screen
- Validates against local cached parts list
- Shows step indicator (2 of 3)

#### Screen 3: Production Display
- **Top Bar**: Station number, Employee ID, Part number
- **Main Display**:
  - Current piece count (large, centered)
  - Pieces per hour (calculated from recent data)
- **Action Button**: "Record Count" (large, green)
- **Secondary**: "Logout" button
- Shows step indicator (3 of 3)

---

## Dashboard Software

### Technology Stack
- **Framework**: React with TypeScript
- **State Management**: Redux or Zustand
- **Charts**: Chart.js or Recharts
- **Real-time Updates**: WebSocket or polling
- **Styling**: Tailwind CSS

### Main Dashboard View
```
┌─────────────────────────────────────────────────────┐
│  UQSA Production Dashboard      [Admin] [Export]   │
├─────────────────────────────────────────────────────┤
│  Total Today: 24,367 | This Hour: 3,842 | Active: 10│
├─────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│ │Station 1 │ │Station 2 │ │Station 3 │ │Station 4 ││
│ │Jake W.   │ │Crystal M.│ │Jenny T.  │ │Mike J.   ││
│ │Part:78542│ │Part:45123│ │Part:67890│ │Part:12345││
│ │247 pcs   │ │189 pcs   │ │156 pcs   │ │312 pcs   ││
│ │2,145 pph │ │1,923 pph │ │1,456 pph │ │1,876 pph ││
│ │  🟢      │ │  🟢      │ │  🟡      │ │  🟢      ││
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘│
└─────────────────────────────────────────────────────┘
```

### Station Detail Modal
- Production graph (last 8 hours)
- Current metrics (pieces, rate, efficiency)
- Box completion history
- Employee performance for shift

---

## Admin Panel (Level 1 Features Only)

### Employee Management
```
┌─────────────────────────────────────────────────────┐
│  Employee Management                                │
├─────────────────────────────────────────────────────┤
│  [+ Add Employee]                                   │
│                                                     │
│  ID      Name              PIN    Active           │
│  1234    Jake Wilson       ****   ✓               │
│  5678    Crystal Martinez  ****   ✓               │
│  [Edit] [Deactivate]                               │
└─────────────────────────────────────────────────────┘
```
**Features:**
- Add new employee (ID, Name, PIN)
- Edit existing employee
- Activate/Deactivate employee
- No bulk import, no complex permissions

### Part Configuration
```
┌─────────────────────────────────────────────────────┐
│  Part Configuration                                 │
├─────────────────────────────────────────────────────┤
│  [+ Add Part]                                       │
│                                                     │
│  Part #  Description  Weight(g)  Target PPH  Box   │
│  78542   Widget A     12.5       1800        250   │
│  45123   Bracket B    8.2        2200        300   │
│  [Edit] [Deactivate]                               │
└─────────────────────────────────────────────────────┘
```
**Features:**
- Add new part (number, weight, targets)
- Edit part configuration
- Activate/Deactivate parts
- Simple form-based entry

### Station Setup
```
┌─────────────────────────────────────────────────────┐
│  Station Configuration                              │
├─────────────────────────────────────────────────────┤
│  Station  Name         Mode       Active           │
│  1        Assembly 1   Assembly   ✓                │
│  5        Sorting 5    Sorting    ✓                │
│  [Edit Mode] [Toggle Active]                       │
└─────────────────────────────────────────────────────┘
```
**Features:**
- Set station mode (Assembly/Sorting)
- Activate/Deactivate stations
- View current status

### Access Control
- Single admin PIN/password for admin panel
- No complex role system
- Admin can access all configuration
- Regular users only see dashboard

---

## API Endpoints

### Station APIs
```
POST /api/minute-reading
POST /api/box-completion
GET  /api/station-config/{stationId}
GET  /api/employees  // For local caching
GET  /api/parts      // For local caching
```

### Dashboard APIs
```
GET  /api/dashboard/overview
GET  /api/dashboard/station/{stationId}
GET  /api/dashboard/history/{stationId}?hours=8
```

### Admin APIs
```
GET    /api/admin/employees
POST   /api/admin/employees
PUT    /api/admin/employees/{id}
DELETE /api/admin/employees/{id}

GET    /api/admin/parts
POST   /api/admin/parts
PUT    /api/admin/parts/{partNumber}
DELETE /api/admin/parts/{partNumber}

GET    /api/admin/stations
PUT    /api/admin/stations/{stationId}
```

### Report APIs
```
GET  /api/reports/hourly?date=2025-01-20
GET  /api/reports/daily?date=2025-01-20
GET  /api/reports/export/excel?date=2025-01-20
```

---

## Calculation Methods

### Pieces Per Hour
```typescript
function calculatePPH(readings: MinuteReading[]): number {
    // Get readings from last 10 minutes
    const recentReadings = readings.slice(-10);
    
    // Calculate pieces added per minute
    const piecesPerMinute = [];
    for (let i = 1; i < recentReadings.length; i++) {
        const delta = recentReadings[i].count - recentReadings[i-1].count;
        if (delta > 0) piecesPerMinute.push(delta);
    }
    
    // Average and extrapolate to hourly rate
    const avgPerMinute = average(piecesPerMinute);
    return Math.round(avgPerMinute * 60);
}
```

### Box Completion Detection
```typescript
function detectBoxCompletion(buffer: Reading[]): boolean {
    const recent = buffer.slice(-10); // Last 10 seconds
    const peak = Math.max(...buffer.slice(-60).map(r => r.count));
    const current = recent[recent.length - 1].count;
    
    // If current is less than 10% of peak
    if (current < peak * 0.1) {
        // Check if low for at least 5 seconds
        const lowReadings = recent.slice(-5);
        return lowReadings.every(r => r.count < peak * 0.1);
    }
    return false;
}
```

### Status Color Coding
```typescript
function getStationStatus(pph: number, target: number): Status {
    const efficiency = pph / target;
    if (efficiency >= 0.95) return 'green';
    if (efficiency >= 0.80) return 'yellow';
    return 'red';
}
```

---

## Network & Security

### Network Requirements
- Reliable WiFi coverage at all stations
- Minimum 1 Mbps per station
- Local network for station-to-server communication
- Internet connection for cloud backup (optional)

### Security Measures
- Employee PINs stored as hashed values
- HTTPS for all API communication
- API authentication tokens
- Automatic session timeout after 8 hours
- Local data encrypted at rest

### Offline Resilience
- 10-minute local buffer on each station
- Automatic retry for failed uploads
- Queue system for pending data
- Visual indicator when offline
- Bulk sync when connection restored

---

## Performance Requirements

### Response Times
- Scale reading update: < 1 second
- Screen transitions: < 500ms
- Dashboard refresh: < 2 seconds
- Report generation: < 5 seconds

### Reliability
- System uptime: 99%+ during production hours
- Data accuracy: 99%+ match with manual counts
- Network resilience: 10-minute offline capability
- Auto-recovery from power loss

### Scalability
- Support 13 concurrent stations (Phase 2)
- Handle 1000+ box completions per day
- Store 90 days of minute-by-minute data
- Generate reports for any date range

---

## Deployment Configuration

### Station Deployment
```bash
# Each station runs these services
scale-reader.service    # Reads from scale
ui-server.service      # Serves touch interface
data-sync.service      # Syncs to cloud
```

### Environment Variables
```env
# Station Configuration
STATION_ID=5
SCALE_PORT=/dev/ttyUSB0
API_ENDPOINT=http://server.local:3000
SYNC_INTERVAL=60000

# Cloud Database
DB_HOST=localhost
DB_NAME=uqsa_production
DB_USER=uqsa_app
DB_PASSWORD=secure_password
```

---

## Testing Requirements

### Unit Tests
- Scale reading accuracy
- Piece count calculations
- Box detection logic
- PPH calculations

### Integration Tests
- Station to cloud sync
- Offline/online transitions
- Multi-station updates
- Report generation

### User Acceptance Tests
- Employee login flow
- Part selection process
- Count recording accuracy
- Dashboard real-time updates
- Admin panel functionality

---

## Support & Maintenance

### Monitoring
- Health check endpoint for each station
- Dashboard shows offline stations
- Alert when station inactive > 15 minutes
- Daily backup verification

### Troubleshooting Tools
- Station diagnostic mode
- Scale calibration utility
- Network connectivity test
- Data sync status viewer

### Updates
- Remote update capability
- Staged rollout support
- Rollback mechanism
- Version tracking

---

## Phase-Specific Implementation

### Phase 1 (Pilot Station)
- Single station deployment
- Basic dashboard (1 station)
- Manual admin configuration
- Core functionality only

### Phase 2 (Full Deployment)
- All 13 stations
- Complete dashboard
- Full admin panel
- Hourly reports
- Excel export

### Phase 3 (Future Enhancements)
- Advanced analytics
- Predictive alerts
- API integrations
- Mobile app
- Custom KPIs