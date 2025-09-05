# Sterling 7600 Scale Interface Manual

This document provides the essential technical specifications and interface details for the Sterling 7600 industrial scale, extracted from the official technical manual (7600TM2021REV7).

## Hardware Specifications

### Scale Model
- **Model**: Sterling 7600 Industrial Counting Scale
- **Manufacturer**: Pennsylvania Scale Company
- **Capacities**: 2, 5, 10, 20, 50, 100, 150, 200 lbs
- **Display**: 6-digit, 0.6-inch LED
- **Power**: 117/217 VAC, 50-60 HZ, 20 watts
- **Certifications**: NTEP Class III/IIIL, 10,000 divisions CoC 91-149A7

### Load Cell Specifications
- **Type**: 24-bit delta sigma A/D converter (1:16,777,216)
- **Excitation**: 5 VDC, 120 mA max
- **Signal Input**: 16 mv
- **Sensitivity**: 0.1 Uv/grad
- **Update Rate**: 30 updates/second

## RS-232 Serial Communication

### Physical Connection
- **Connector**: DB-9 female connector (located in access area under scale)
- **Internal Connection**: Main board TB2-1,2,3

### Pin Assignments
| Pin | Function |
|-----|----------|
| 5   | Signal Ground |
| 2   | Transmit Data (scale → device) |
| 3   | Receive Data (device → scale) |

### Serial Port Configuration
- **Baud Rate**: 9600 (default, configurable)
- **Data Bits**: 8
- **Stop Bits**: 1
- **Parity**: None
- **Flow Control**: None
- **Echo**: No Echo (default)

## Remote Command Protocol

The Sterling 7600 accepts 3-letter commands followed by carriage return (`<cr>`).

### Basic Commands
| Command | Description | Response Format |
|---------|-------------|----------------|
| `ZRO<cr>` | Zero the scale | Status response |
| `SRP<cr>` | Send formatted data output | Configured data string |
| `ATW<cr>` | Acquire tare weight | Status response |
| `SGW<cr>` | Send gross weight | `Gross <weight><cr><lf>` |
| `SNW<cr>` | Send net weight | `Net <weight><cr><lf>` |
| `SCO<cr>` | Send count (7600 only) | `Count <count> Pieces<cr><lf>` |
| `SPW<cr>` | Send piece weight (7600 only) | `Piece Weight <weight><cr><lf>` |

### Data Input Commands
| Command | Format | Description |
|---------|--------|-------------|
| `IPW<cr>` | `IPW <weight><cr>` | Input piece weight and enter count mode |
| `ITW<cr>` | `ITW <weight><cr>` | Input tare weight and enter net mode |
| `IID<cr>` | `IID <id><cr>` | Input product ID (up to 15 characters) |

### Status Commands
| Command | Description | Response |
|---------|-------------|----------|
| `SVN<cr>` | Send firmware version | `V <version><cr><lf>` |
| `SDT<cr>` | Send date (if available) | `MM/DD/YY<cr><lf>` |
| `STM<cr>` | Send time (if available) | `HH:MM:SS<cr><lf>` |

## Data Output Formats

### Standard Weight Response
```
Manual Format: Gross 100.55 lb.<cr><lf>
Actual Format (v4.31.0): SGWGross   100.55 lb<cr><lf>
Alternative Format: WGross   100.55 lb<cr><lf>
```
*Note: Sterling 7600 v4.31.0 echoes command in response (verified 2025-08-19)*

### Count Response (Counting Mode)
```
Manual Format: Count 157 Pieces<cr><lf>
Actual Format (v4.31.0): SCOCount   157 Pieces<cr><lf>
Alternative Format: OCount   157 Pieces<cr><lf>
```
*Note: Supports negative counts (e.g., -14 Pieces)*

### Piece Weight Response
```
Manual Format: Piece Weight 0.6350 lb.<cr><lf>
Expected Format (v4.31.0): SPWPiece Weight 0.6350 lb<cr><lf>
```
*Note: Not tested but command echo expected based on pattern*

## Special Emulation Modes

The Sterling 7600 supports multiple emulation modes for compatibility with shipping software:

### UPS WorldShip Emulation
- **Default Settings**: 9600-7-odd-2
- **Command**: `<cr>` (carriage return)
- **Response**: `<sp><sp>0.00<sp>lb.<sp>GR<sp><sp><cr><lf><etx>`
- **Motion Response**: "GR" becomes "gr" when scale is in motion
- **Overload Response**: `<cr><etx>`

### FedEx Emulation (FED12 & FED96)
- **FED12 Settings**: 1200-8-N-1
- **FED96 Settings**: 9600-7-E-1
- **Command**: `W<cr>`
- **Response**: `<lf><sp>000.00LB<cr>00<etx>`

### Toledo Emulation
- **Command**: `W*` (normal resolution weight)
- **Response**: `<stx>XXXX.X<cr>` (for 300 x 0.1 lbs capacity)
- **Zero Command**: `Z`
- **High Resolution**: `H` command

### NCI Emulation
- **Command**: `W`
- **Response**: `<lf>XXXXXXX<unit><cr><lf><status><cr><etx>`

## Configuration Menu Access

To access scale configuration:
1. Press and hold ZERO button for 5 seconds
2. Enter access code: `0000`
3. Press ENT button

### Key Configuration Parameters
- **CFG 60**: RS-232 Port Configuration
  - Baud Rate (BAU 61): 300-38400
  - Data Bits (LEN 62): 7 or 8
  - Stop Bits (SPB 63): 1 or 2
  - Parity (PAR 64): None, Odd, Even
  - Echo (ECH 65): No Echo or Echo

## Error Handling

### Common Error Messages
| Error | Description |
|-------|-------------|
| `Err.80` | Serial command data error |
| `Err.81` | Unknown serial command |
| `ULULUL` | Under-load condition |
| `OLOLOL` | Over-load condition |
| `-------` | A/D acquisition in progress |

### Status Indicators
- Scale sends status information when unable to provide weight data
- Motion, overload, and underload conditions are indicated in responses
- Timeout handling required for non-responsive conditions

## Implementation Notes

### For Node.js Integration
```javascript
const config = {
  serial: {
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    flowControl: false
  },
  commands: {
    weight: 'SGW\r',      // Send gross weight
    zero: 'ZRO\r',        // Zero scale
    tare: 'ATW\r',        // Acquire tare
    count: 'SCO\r',       // Send count (if in counting mode)
    print: 'SRP\r'        // Send formatted data
  },
  timing: {
    commandTimeout: 5000,   // 5 second timeout
    pollingInterval: 1000,  // 1 second between requests
    retries: 3             // Retry failed commands
  }
};
```

### Communication Flow
1. Send command with `\r` termination
2. Wait for response (typically within 1-2 seconds)
3. Parse response based on command type
4. Handle error conditions and retries
5. Implement timeout for non-responsive scale

### Best Practices
- Always terminate commands with carriage return (`\r`)
- Implement proper timeout handling (5 second default)
- Parse responses carefully - format varies by command
- Handle motion and overload conditions gracefully
- Use appropriate polling intervals (1 second recommended)
- Monitor for error messages and implement retry logic

## Troubleshooting

### Connection Issues
- Verify DB-9 pin connections (2-TX, 3-RX, 5-GND)
- Check baud rate matches scale configuration (default 9600)
- Ensure proper grounding between devices
- Use CableMax LED tester to verify signal activity

### Communication Problems
- Scale may be in motion (wait for stability)
- Command format incorrect (must be 3 letters + CR)
- Scale in overload/underload condition
- Wrong emulation mode selected
- Timeout too short for scale response time

### Data Parsing
- Response formats vary by emulation mode
- Handle both stable and motion indicators
- Account for different unit formats (lb, kg, oz)
- Parse status characters in emulation modes
- Implement bounds checking on received values