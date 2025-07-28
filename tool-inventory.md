# Tool Inventory

This document tracks the tools available for the scale-based workstation system project.

## 1. CableMax RS-232 LED Link Tester

**Model**: DB-9 Male to DB-9 Female  
**Manufacturer**: CableMax  
**Product Links**: 
- [Amazon](https://www.amazon.com/CableMax-RS-232-link-Tester-Female/dp/B004OT995U)
- [CableMax](https://cablemax.com/db9-ters)
- [USBGear](https://www.usbgear.com/db9-ters.html)

### Description
A compact, plug-and-play device designed for testing and troubleshooting RS-232 serial connections. Features a DB-9 male connector on one end and a DB-9 female connector on the other, allowing it to connect in series with any 9-pin RS-232 interface.

### Key Features
- **No external power or drivers required** - ideal for on-the-go testing
- **Plug-and-play installation** for quick setup and use
- **Compact size** (1.77 × 1.38 × 0.82 inches) for portability
- **Universal compatibility** with RS-232 DB-9 and DB-25 configurations
- **Operating system support**: Windows (98, ME, XP, 2000, 2003, CE, Vista, 7, 8), Linux, and Mac OS 10.X
- **Data transfer rate** up to 200 Kbps
- **Surge protection** in some models with transient voltage suppressors (TVS)
  - 600W peak pulse power dissipation
  - ±30V breakdown voltage

### Functionality
- Monitors status of serial connections using dual-color LEDs
  - Red for logic LOW
  - Green for logic HIGH
- LEDs flash to indicate activity on eight signal lines:
  - DCD (Data Carrier Detect)
  - RXD (Receive Data)
  - TXD (Transmit Data)
  - DTR (Data Terminal Ready)
  - DSR (Data Set Ready)
  - RTS (Request To Send)
  - CTS (Clear To Send)
  - RI (Ring Indicator)

### Use Cases for This Project
- **Verify Sterling 7600 scale RS-232 connectivity** before deploying stations
- **Test USB-to-RS232 adapter functionality** and signal integrity
- **Diagnose communication issues** between scale and station devices
- **Validate pinout connections** (Pin 2: Transmit, Pin 3: Receive, Pin 5: Ground)
- **Monitor data transfer activity** during scale polling operations
- **Troubleshoot connection problems** in the field

### Known Limitations
- Metal overlay or retaining nuts may detach when unscrewed for direct device connection
- LEDs may appear dim to some users (though others report bright, clear indicators)
- Female screw holes on both sides can complicate direct connections to devices with similar screw configurations, sometimes requiring gender changers

---

## Future Tools

*Additional tools will be added here as they become available.*

## 2. Gearmo USB to Serial RS-232 Adapter with LED Indicators

**Model**: USB to Serial RS-232 Adapter with LED Indicators  
**Manufacturer**: Gearmo  
**Chipset**: FTDI (FT232R or FT232RL)  
**Product Links**: 
- [Amazon](https://www.amazon.com/GearMo-Adapter-Indicators-Windows-Support/dp/B00AHYJWWG)
- [Gearmo USB-A](https://www.gearmo.com/shop/usb2-0-rs-232-serial-adapter-led-indicators/)
- [Gearmo USB-C](https://www.gearmo.com/shop/usb-c-serial-rs232-adapter-led-indicators-usb2/)

### Description
A reliable, plug-and-play device designed to add a serial RS-232 port to computers lacking native serial support. Ideal for connecting legacy devices like PDAs, GPS units, modems, and industrial equipment. Features a USB 2.0 interface (Type-A or Type-C variants) and a DB-9 male connector, with dual-color LED indicators to monitor signal activity.

### Key Features
- **Plug-and-play installation** with no external power required, powered via USB
- **Wide compatibility** with Windows (7, 8, 10, 11), Linux, and Mac OS X (10.6 and above)
- **Automatic driver installation** in most cases
- **LED activity monitoring** for real-time diagnostics, aiding troubleshooting of serial connections
- **Surge protection** up to 15kV to safeguard devices from static and voltage spikes
- **Compact design** available in various lengths (12, 16, 36 inches, or 5 feet) for portability and flexibility
- **Supports full RS-232 signals**, including hardware handshaking (e.g., RTS/CTS)
- **High-speed data transfers** up to 921.6 Kbps
- **FTDI chipset** ensuring stable performance and superior driver stability

### Functionality
- **Dual-color LED indicators** (typically red for TX, green for RX) to monitor signal activity
- **Monitors signal lines**: TXD, RXD, DTR, DSR, RTS, CTS, and GND
- **Hardware handshaking support** making it suitable for industrial applications
- **High-performance FTDI chipset** (FT232R or FT232RL) for reliable communication

### Use Cases for This Project
- **Primary USB-to-RS232 adapter** for connecting Sterling 7600 scale to station devices
- **Real-time communication monitoring** via LED indicators during scale polling
- **Reliable driver support** across Windows, Linux, and Mac OS X for cross-platform deployment
- **Industrial-grade reliability** for 24/7 operation in manufacturing environments
- **Hardware handshaking support** for robust communication with industrial scales
- **Surge protection** to safeguard expensive scale equipment from electrical damage
- **Multiple cable length options** for flexible installation in different station layouts
- **USB-C variant support** for modern devices and future-proofing

### **CRITICAL: Order Backup Unit**
⚠️ **Action Required**: Order a second Gearmo adapter immediately for:
- **Client site redundancy** - Essential backup if primary unit fails during validation
- **Development continuity** - Prevent project delays due to hardware failure
- **Cross-platform testing** - Test on multiple platforms simultaneously
- **Field deployment** - Spare units for 13-station deployment

### Known Limitations
- LEDs may be dim or all amber, making it hard to distinguish signals in some units
- The translucent case sticker can obscure indicators if misaligned
- Some users find the price slightly high for the design, though it's justified by performance

---

## **Immediate Tool Requirements**

### **Phase 1 Preparation (ORDER NOW)**
1. **Second Gearmo USB-to-Serial Adapter** - Backup for client site visit
2. **Windows Testing Environment** - VM or dedicated machine for cross-platform validation
3. **Sterling 7600 Documentation** - Official manual/protocol specification

### **Phase 2 Client Site Kit**
- Primary + Backup Gearmo adapters
- CableMax LED tester for quick diagnostics
- DB9 null modem adapter for troubleshooting
- MacBook Pro with charged battery + power adapter
- Network connectivity backup (mobile hotspot)

## Future Tools

*Additional tools will be added here as they become available.*

## 3. DB9 Null Modem Male to Female Slimline Data Transfer Serial Port Adapter

**Model**: DB9 Null Modem Male to Female Slimline Data Transfer Serial Port Adapter  
**Type**: Null Modem Adapter  
**Product Links**: 
- [Amazon Canada](https://www.amazon.ca/female-slimline-transfer-serial-adapter/dp/B075XHWVSJ)
- [L-Com](https://www.l-com.com/d-sub-slimline-null-modem-adapter-db9-male-female)
- [ShowMeCables](https://www.showmecables.com/by-category/cables/serial/db9)

### Description
A compact, plug-and-play device designed to convert standard straight-through RS-232 serial cables into null modem cables by crossing over transmit (TXD), receive (RXD), and select handshake lines (e.g., RTS/CTS, DTR/DSR). Features a DB-9 male connector on one side and a DB-9 female connector on the other, enabling direct communication between two DTE (Data Terminal Equipment) devices without requiring a modem.

### Key Features
- **Plug-and-play functionality** requiring no external power or drivers
- **Compact, low-profile design** reduces leverage strain on ports and saves space (often under 0.5 inches long)
- **Gold-plated contacts** ensure reliable, durable connections with minimal signal loss
- **Shielded construction** protects against EMI/RFI interference for stable data transfer
- **UL-grade 94V-0 insulator** meets flammability standards for safety
- **Wide compatibility** with devices requiring RS-232 COM port connections
- **Data transfer rates** typically support up to 230 Kbps or higher
- **Removable screws/nuts** allow easy adaptation for direct device connections or cable extensions

### Functionality
- **Crosses over signal lines**: TXD, RXD, and select handshake lines (RTS/CTS, DTR/DSR)
- **Enables DTE-to-DTE communication** without requiring a modem
- **Converts straight-through cables** into null modem cables
- **Supports legacy equipment** and industrial devices requiring null modem connections

### Use Cases for This Project
- **Testing scale communication** by creating null modem connections for loopback testing
- **Connecting two station devices** for data transfer or synchronization testing
- **Troubleshooting serial connections** when direct DTE-to-DTE communication is needed
- **Repurposing existing straight-through cables** for null modem applications
- **Console access** to network equipment or industrial devices requiring null modem connections
- **Legacy equipment integration** for devices that require null modem connections
- **Backup communication method** if direct scale-to-device connection fails
- **Development and testing** of serial communication protocols

### Known Limitations
- Some units may have overly long or misaligned screw posts, complicating connections to certain ports
- Rare reports of non-functional units, though replacing the adapter typically resolves issues
- Gender-specific needs can lead to ordering errors (e.g., needing female-to-female instead), requiring additional gender changers

---

## Future Tools

*Additional tools will be added here as they become available.*

## 4. MacBook Pro with Apple M2 Max

**Model**: MacBook Pro with Apple M2 Max  
**Operating System**: macOS 15.5 (Sequoia)  
**Processor**: Apple M2 Max chip (12-core CPU, 38-core GPU)  
**Memory**: Up to 96GB unified memory (LPDDR5-6400)  
**Display**: 14.2" or 16.2" Liquid Retina XDR (3024x1964 or 3456x2234)

### Key Features for Serial Communication
- **Three Thunderbolt 4 ports** (USB-C) for connecting USB-to-serial adapters
- **High-performance M2 Max chip** with 12-core CPU for real-time serial data processing
- **Up to 96GB unified memory** for handling complex diagnostic software and data streams
- **macOS 15.5 compatibility** with broad driver support for FTDI-based adapters
- **High-resolution display** (254 ppi) for monitoring serial data outputs and debugging interfaces
- **Long battery life** (15-22 hours) for extended diagnostic sessions
- **Wi-Fi 6E and Bluetooth 5.3** for network connectivity and data transfer

### Functionality for This Project
- **Development platform** for creating and testing the Electron-based scale interface application
- **Serial communication host** via USB-to-serial adapters (Gearmo adapter)
- **Real-time data processing** for scale readings and metrics calculations
- **Cross-platform development** (Windows, Linux, macOS) for the Electron app
- **Diagnostic and troubleshooting** capabilities with serial communication tools
- **Data analysis and reporting** for scale performance metrics

### Use Cases for This Project
- **Primary development workstation** for building the 13-station scale interface system
- **Testing and debugging** serial communication with Sterling 7600 scale
- **Real-time monitoring** of scale data streams and LED indicators from tools
- **Cross-platform application development** for Windows/Linux station deployment
- **Data analysis and visualization** of scale performance metrics
- **Remote troubleshooting** of station devices via network connectivity
- **Backup station device** for testing and development purposes
- **Documentation and reporting** for system performance and issues

### Compatibility with Project Tools
- **Gearmo USB-to-Serial Adapter**: Full compatibility via Thunderbolt 4 ports with automatic FTDI driver installation
- **CableMax RS-232 Tester**: Works in conjunction with Gearmo adapter for signal monitoring
- **DB9 Null Modem Adapter**: Compatible for testing and troubleshooting scenarios
- **Electron Development**: Native support for cross-platform application development

### Technical Advantages
- **High memory bandwidth** (400GB/s) for handling real-time data streams
- **Graphics performance** (13.6 TFLOPS) for responsive UI development and testing
- **Neural Engine** for potential AI-assisted data analysis and optimization
- **Studio-quality audio** for voice communication during remote troubleshooting
- **1080p webcam** for video conferencing and remote support

### Limitations and Considerations
- **No native serial ports** - relies entirely on USB-to-serial adapters (**requires backup**)
- **macOS-specific development** - **MUST set up Windows VM for cross-platform testing**
- **Adapter dependencies** - requires Gearmo adapter for RS-232 connectivity (**single point of failure**)
- **Cost considerations** - high-end hardware for development vs. deployment costs
- **Client site risk** - single adapter failure could derail validation visit

---

## Future Tools

*Additional tools will be added here as they become available.*

## 5. Anker PowerExpand+ 7-in-1 USB-C PD Media Hub

**Model**: PowerExpand+ 7-in-1 USB-C PD Media Hub  
**Manufacturer**: Anker  
**Connectivity**: USB-C hub with 0.6 ft built-in cable  
**Product Links**: 
- [Amazon](https://www.amazon.com/Anker-Adapter-MicroSD-Delivery-Chromebook/dp/B071JV4NPS)
- [NewEgg](https://www.newegg.com/anker-powerexpand-usb-c-adapter/p/0J2-00C0-000X8)

### Description
A compact, plug-and-play USB-C hub designed to expand connectivity for modern laptops. Connects via a built-in 0.6 ft USB-C cable and offers seven ports for enhanced connectivity and data transfer capabilities.

### Key Features
- **4K@30Hz HDMI port** for external displays (limited to 2K for 60Hz)
- **USB-C Power Delivery (PD) port** (up to 60W input, 48W pass-through charging)
- **USB-C data port** (5 Gbps) for high-speed data transfer
- **Two USB-A 3.0 ports** (5 Gbps) for legacy device connectivity
- **SD/microSD card readers** (UHS-I, 104 MBps) for data storage
- **1 Gbps Ethernet port** for stable wired internet connection
- **Compact design** (4.6 x 2.1 x 0.6 inches, 4.4 oz) for portability
- **Durable aluminum/polycarbonate build** for reliability

### Functionality
- **Port expansion** for MacBook Pro's Thunderbolt 4 ports
- **Simultaneous use** of all ports (900mA combined current limit)
- **No drivers required** for plug-and-play operation
- **Power delivery** with pass-through charging capabilities
- **Data transfer** via USB-A and USB-C ports
- **External display support** via HDMI for monitoring

### Use Cases for This Project
- **Port expansion** for connecting multiple serial adapters to MacBook Pro
- **External display connectivity** for monitoring scale data on larger screens
- **Ethernet connection** for stable network connectivity during development
- **USB-A ports** for connecting Gearmo USB-to-serial adapter
- **SD/microSD card readers** for data logging and transfer from serial devices
- **Power delivery** for charging MacBook Pro during extended development sessions
- **Multiple device connectivity** for testing various serial communication scenarios
- **Backup connectivity** when direct Thunderbolt ports are occupied

### Compatibility with Project Tools
- **Gearmo USB-to-Serial Adapter**: Compatible via USB-A 3.0 ports
- **CableMax RS-232 Tester**: Works in conjunction with Gearmo adapter through hub
- **DB9 Null Modem Adapter**: Compatible for testing scenarios via USB-A ports
- **MacBook Pro M2 Max**: Full compatibility with macOS 15.5

### Technical Advantages
- **High-speed data transfer** (5 Gbps) for efficient serial communication
- **Stable Ethernet connection** (1 Gbps) for network-dependent operations
- **External display support** for multi-monitor development and monitoring
- **Power delivery** to maintain MacBook Pro charge during extended sessions
- **Compact and portable** design for fieldwork and on-site testing

### Known Limitations
- **HDMI limited to 4K@30Hz** (DP 1.2) - may not support high refresh rates
- **No Thunderbolt support** - limited to USB-C data transfer speeds
- **USB-C data port doesn't support video** - HDMI port required for displays
- **Tight USB-A ports** - may require careful insertion of adapters
- **Occasional Ethernet dropouts** reported by some users
- **Pass-through charging (48W)** may not suffice for power-hungry M2 Max workloads
- **900mA combined current limit** for high-power devices

---

## 6. CoolTerm - Serial Port Terminal Application

**Software**: CoolTerm  
**Version**: Latest for macOS  
**Type**: Serial Terminal Emulator  
**Platform**: macOS (also available for Windows/Linux)  
**Product Links**: 
- [CoolTerm Official](http://freeware.the-meiers.org)
- [SparkFun Tutorial](https://learn.sparkfun.com/tutorials/terminal-basics/coolterm-windows-mac-linux)

### Description
A simple, easy-to-use terminal application specifically designed for serial communication. Provides a user-friendly interface for sending and receiving data through serial ports, with features for monitoring, logging, and debugging serial connections. Validated July 28, 2025 for Sterling 7600 testing.

### Key Features
- **Simple GUI interface** for serial port configuration and monitoring
- **Real-time data display** in ASCII or Hex format
- **Local echo option** to see what you're typing
- **Connection settings** saved as .stc files for quick reuse
- **Data logging** to capture serial communication
- **Send string/file** capabilities for testing commands
- **Hex viewer** for analyzing raw data bytes
- **Line mode and raw mode** for different communication styles
- **Cross-platform** consistency across macOS, Windows, and Linux

### Functionality
- **Direct serial communication** without programming
- **Manual command testing** for Sterling 7600 commands
- **Raw data capture** for protocol analysis
- **Quick connectivity testing** independent of application code
- **Visual feedback** of sent and received data
- **Connection parameter adjustment** on the fly

### Use Cases for This Project
- **Independent validation** of serial communication outside Node.js app
- **Sterling 7600 command testing** - manually send SGW, SNW, SCO, etc.
- **Protocol debugging** - see exact bytes sent/received in hex view
- **Quick connectivity verification** at client site before running app
- **Baud rate discovery** - quickly test different rates if 9600 doesn't work
- **Response format documentation** - capture actual Sterling 7600 responses
- **Troubleshooting backup** - when automated tools fail, use manual control
- **Training tool** - teach others how RS-232 communication works

### Configuration for Sterling 7600
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

### Test Results
- ✅ Successfully connected to Gearmo adapter
- ✅ Commands sent verified by Gearmo TXD LED flash
- ✅ Hex view confirmed correct byte transmission (SGW = 53 47 57 0D)
- ✅ Ready for Sterling 7600 direct testing

### Advantages Over Automated Testing
- **No code dependencies** - works even if Node.js app fails
- **Visual confirmation** - see exactly what's happening
- **Manual control** - test edge cases and specific scenarios
- **Quick parameter changes** - adjust settings without editing config files
- **Universal tool** - works with any serial device, not just scales

### Site Testing Usage
1. **Pre-app testing**: Use CoolTerm first to verify Sterling 7600 connectivity
2. **Response capture**: Document actual scale responses for app validation
3. **Troubleshooting**: If app fails, use CoolTerm to isolate issues
4. **Parameter discovery**: Test different settings if defaults don't work
5. **Client demonstration**: Show real-time communication visually

---

## Complete Tool Inventory Summary

### Development & Testing Toolkit
1. **MacBook Pro with M2 Max** - Primary development platform
2. **Gearmo USB to Serial RS-232 Adapter** - Scale connection method (**NEED BACKUP**)
3. **CableMax RS-232 LED Link Tester** - Signal diagnostics
4. **DB9 Null Modem Adapter** - Testing and troubleshooting
5. **Anker PowerExpand+ 7-in-1 USB-C Hub** - Port expansion
6. **CoolTerm Terminal Application** - Manual serial testing and validation

### **MISSING CRITICAL TOOLS** ⚠️
- **Backup Gearmo Adapter** - Essential for client site visit
- **Windows Testing Environment** - Required for cross-platform validation
- **Sterling 7600 Manual** - Protocol specification needed before development

### Project-Specific Capabilities
- ✅ **Scale Communication Testing** - Complete setup for Sterling 7600 integration
- ⚠️ **Cross-Platform Development** - Need Windows VM for full testing
- ✅ **Real-time Monitoring** - LED indicators and multi-display support
- ✅ **Network Connectivity** - Ethernet and Wi-Fi for cloud integration
- ⚠️ **Field Deployment Ready** - Need backup adapter for reliability
- ✅ **Comprehensive Diagnostics** - Signal monitoring and troubleshooting tools

### Development Workflow Integration
- **Phase 1: Scale Testing** - Use Gearmo adapter + CableMax tester to verify Sterling 7600 communication
- **Phase 2: App Development** - MacBook Pro + Anker hub for multi-monitor development
- **Phase 3: Cross-Platform Testing** - Test Electron app on target Windows/Linux platforms
- **Phase 4: Deployment** - Use tools for on-site station setup and troubleshooting

## Tool Usage by Game Plan Phase

### Phase 1 (Today) - Console Testing
**Primary Tools:**
- **MacBook Pro M2 Max** - Development environment
- **Gearmo USB-to-Serial Adapter** - Serial communication
- **CableMax RS-232 LED Tester** - Signal verification

**Usage Scenarios:**
- Connect Gearmo adapter to MacBook via Anker hub
- Use CableMax tester to verify signal activity
- Test with DB9 null modem adapter for loopback testing
- Monitor LED indicators for TX/RX activity

### Phase 2 (Tomorrow) - Client Site Validation
**Primary Tools:**
- **Console application** from Phase 1
- **Gearmo USB-to-Serial Adapter** - Direct scale connection
- **CableMax RS-232 LED Tester** - Quick signal verification
- **MacBook Pro** - Testing platform

**Usage Scenarios:**
- Quick connection test to Sterling 7600 scale
- Data format capture and logging
- LED indicator monitoring for signal verification
- Backup testing with null modem adapter if needed

### Phase 3 (Future) - Full System Development
**Primary Tools:**
- **MacBook Pro** - Cross-platform development
- **Anker Hub** - Multi-monitor development setup
- **All adapters** - Testing on target hardware platforms

**Usage Scenarios:**
- Electron app development with multi-monitor setup
- Cross-platform testing (Windows/Linux)
- Hardware validation for station deployment
- Field troubleshooting and maintenance

## Tool Compatibility Matrix

| Tool | Phase 1 | Phase 2 | Phase 3 | Notes |
|------|---------|---------|---------|-------|
| MacBook Pro M2 Max | ✅ Primary dev | ✅ Testing platform | ✅ Cross-platform dev | Core development platform |
| Gearmo USB-to-Serial | ✅ Primary connection | ✅ Scale connection | ✅ Hardware testing | FTDI chipset reliability |
| CableMax LED Tester | ✅ Signal monitoring | ✅ Quick verification | ✅ Field diagnostics | No power required |
| DB9 Null Modem | ✅ Loopback testing | ✅ Backup testing | ✅ Troubleshooting | Compact, portable |
| Anker PowerExpand Hub | ✅ Port expansion | ✅ Backup connectivity | ✅ Multi-monitor dev | 7-in-1 connectivity |

---

## Notes

- This inventory will be updated as new tools are acquired
- Each tool should include specifications, use cases for the project, and any relevant limitations
- Tools should be tested with the Sterling 7600 scale and USB-to-RS232 adapter before deployment 