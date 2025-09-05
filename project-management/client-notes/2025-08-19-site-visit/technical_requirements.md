# Technical Requirements Document - UQSA Scale System

## System Overview
Digital scale integration system to automate production tracking and eliminate manual paperwork in manufacturing operations.

## Hardware Requirements

### Per-Station Setup
- **Scale:** Digital scale capable of precise part counting (existing scales to be evaluated)
- **Interface Device:** 7" industrial tablet/touchscreen (~$200 budget)
- **Connectivity:** WiFi enabled for real-time data transmission
- **Mounting:** Portable/adjustable mounting solution (not wall-mounted)
- **Power:** Standard AC power connection

### Infrastructure
- **Network:** WiFi coverage for all production stations
- **Central Server:** System to collect and process data from all scales
- **Backup Storage:** Local data retention capability

## Software Requirements

### Core Functionality
1. **Real-time Scale Reading**
   - Read scale weight every second
   - Convert weight to piece count using part-specific calibration
   - Display current count and parts-per-hour calculation

2. **Dual Operating Modes**
   
   **Assembly Mode:**
   - Display: Parts per hour only (not live count)
   - Trigger: Material handler button press to record box
   - Workflow: Wait for Crystal to weigh completed assemblies
   
   **Sorting Mode:**
   - Display: Live piece count + parts per hour
   - Trigger: Employee button press when box complete
   - Workflow: Real-time counting as employee adds parts

3. **Data Recording**
   - **Primary Method:** Button press confirmation records final count
   - **Backup Method:** Track highest weight reading per minute
   - **Failsafe:** Detect weight drops to near-zero (box removal)
   - **Accuracy Protection:** Require human confirmation to prevent false readings

### User Interface Requirements

#### Station Interface (Touchscreen)
- **Login:** Employee ID entry at start of shift
- **Display:** Large, clear numbers showing:
  - Current piece count (sorting mode only)
  - Parts per hour calculation
  - Target parts per hour for comparison
- **Primary Action:** Large "Record Count" or "Box Complete" button
- **Secondary Functions:** 
  - Scrap entry (future enhancement)
  - Station setup/part number confirmation

#### Management Dashboard
- **Real-time Monitoring:** View all stations simultaneously
- **Alerts:** Highlight stations below target production
- **Historical Data:** Charts showing production trends
- **Reports:** Export data compatible with existing Excel workflows

### Data Management

#### Station Setup
- **Part Number Configuration:** Link part numbers to piece weight/count
- **Employee Assignment:** Associate employee ID with station
- **Production Targets:** Set parts-per-hour goals per part number
- **Box Capacity:** Configure expected pieces per box for each part

#### Data Processing
- **Parts Per Hour Calculation:** Always normalize to hourly rate regardless of timing
- **Time Tracking:** Account for breaks, delays, shift changes
- **Quality Assurance:** Track when checks occur vs. production timing
- **Batch Tracking:** Associate production with specific work orders

#### Integration Requirements
- **Export Format:** Generate data compatible with Sue's existing Excel spreadsheets
- **Copy/Paste Support:** Allow direct data transfer to current reporting system
- **Historical Archive:** Maintain detailed records for analysis and auditing

## Technical Architecture

### Communication Protocol
- Scale interface via RS232/USB (depending on existing scale model)
- WiFi for station-to-server communication
- Real-time data streaming with local buffering for connectivity issues

### Data Storage
- Local storage on each station device (minimum 30 days)
- Central database for all production records
- Backup system for data redundancy

### Performance Requirements
- **Response Time:** <1 second for scale reading updates
- **Accuracy:** ±1 piece counting accuracy for parts >5g
- **Uptime:** 99%+ availability during production hours
- **Capacity:** Support for 20+ concurrent stations

## Security & Access Control
- Employee ID authentication at station level
- Manager access codes for configuration changes
- Data encryption for network transmission
- Regular automated backups

## Scalability Considerations
- Modular design to add stations incrementally
- Support for different part types and scale configurations
- Future integration possibilities (barcode scanning, advanced analytics)

## Validation & Testing Requirements
- Pilot implementation with single trusted station
- A/B testing against manual counting for accuracy verification
- User acceptance testing with actual production staff
- Load testing with full production volumes

## Maintenance Requirements
- Remote monitoring and diagnostics capability
- Software update deployment system
- Scale calibration tracking and alerts
- User training materials and documentation

## Success Metrics
- Elimination of manual paper tracking
- Real-time production visibility (sub-minute updates)
- Reduction in data entry errors
- Improved production issue response time (immediate vs. next-day)
- Employee productivity gains through reduced administrative burden