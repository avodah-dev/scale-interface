# CoolTerm - Serial Port Terminal Application

**Software**: CoolTerm  
**Version**: Latest for macOS  
**Type**: Serial Terminal Emulator  
**Platform**: macOS (also available for Windows/Linux)  
**Product Links**: 
- [CoolTerm Official](http://freeware.the-meiers.org)
- [SparkFun Tutorial](https://learn.sparkfun.com/tutorials/terminal-basics/coolterm-windows-mac-linux)

## Description
A simple, easy-to-use terminal application specifically designed for serial communication. Provides a user-friendly interface for sending and receiving data through serial ports, with features for monitoring, logging, and debugging serial connections. Validated July 28, 2025 for Sterling 7600 testing.

## Key Features
- **Simple GUI interface** for serial port configuration and monitoring
- **Real-time data display** in ASCII or Hex format
- **Local echo option** to see what you're typing
- **Connection settings** saved as .stc files for quick reuse
- **Data logging** to capture serial communication
- **Send string/file** capabilities for testing commands
- **Hex viewer** for analyzing raw data bytes
- **Line mode and raw mode** for different communication styles
- **Cross-platform** consistency across macOS, Windows, and Linux

## Functionality
- **Direct serial communication** without programming
- **Manual command testing** for Sterling 7600 commands
- **Raw data capture** for protocol analysis
- **Quick connectivity testing** independent of application code
- **Visual feedback** of sent and received data
- **Connection parameter adjustment** on the fly

## Use Cases for This Project
- **Independent validation** of serial communication outside Node.js app
- **Sterling 7600 command testing** - manually send SGW, SNW, SCO, etc.
- **Protocol debugging** - see exact bytes sent/received in hex view
- **Quick connectivity verification** at client site before running app
- **Baud rate discovery** - quickly test different rates if 9600 doesn't work
- **Response format documentation** - capture actual Sterling 7600 responses
- **Troubleshooting backup** - when automated tools fail, use manual control
- **Training tool** - teach others how RS-232 communication works

## Configuration for Sterling 7600
**Tested Configuration (July 28, 2025):**
- Port: `usbserial-BG011ORJ` (Gearmo adapter)
- Baudrate: 9600
- Data Bits: 8
- Parity: None
- Stop Bits: 1
- Terminal Mode: Line Mode
- Enter Key: CR
- Local Echo: ON

**Save as**: `Sterling7600-9600.stc` for quick loading at client site

## Test Results
- ✅ Successfully connected to Gearmo adapter
- ✅ Commands sent verified by Gearmo TXD LED flash
- ✅ Hex view confirmed correct byte transmission (SGW = 53 47 57 0D)
- ✅ Ready for Sterling 7600 direct testing

## Advantages Over Automated Testing
- **No code dependencies** - works even if Node.js app fails
- **Visual confirmation** - see exactly what's happening
- **Manual control** - test edge cases and specific scenarios
- **Quick parameter changes** - adjust settings without editing config files
- **Universal tool** - works with any serial device, not just scales

## Site Testing Usage
1. **Pre-app testing**: Use CoolTerm first to verify Sterling 7600 connectivity
2. **Response capture**: Document actual scale responses for app validation
3. **Troubleshooting**: If app fails, use CoolTerm to isolate issues
4. **Parameter discovery**: Test different settings if defaults don't work
5. **Client demonstration**: Show real-time communication visually

## Project-Specific Notes
- Software tool, not hardware, but critical for hardware validation
- Already tested with Gearmo adapter on macOS
- Configuration file saved for quick client site setup
- Provides backup testing method if console app fails