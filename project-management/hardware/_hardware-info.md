# Hardware Documentation Index

This directory contains detailed documentation for all hardware and tools used in the scale interface project.

## Overview Documents
- **[hardware-overview.md](hardware-overview.md)** - Overarching hardware concepts, compatibility matrix, and deployment considerations

## Current Hardware Inventory

### Primary Development Hardware
- **[macbook-pro-m2-max.md](macbook-pro-m2-max.md)** - Primary development platform specifications and capabilities

### RS-232 Communication Hardware
- **[gearmo-usb-serial-adapter.md](gearmo-usb-serial-adapter.md)** - ⚠️ Primary USB-to-RS232 adapter (NEED BACKUP)
- **[cablemax-rs232-tester.md](cablemax-rs232-tester.md)** - LED signal monitoring and diagnostics tool
- **[db9-null-modem-adapter.md](db9-null-modem-adapter.md)** - Testing and troubleshooting adapter

### Connectivity & Expansion
- **[anker-powerexpand-hub.md](anker-powerexpand-hub.md)** - 7-in-1 USB-C hub for port expansion

### Software Tools
- **[coolterm-software.md](coolterm-software.md)** - Serial terminal emulator for manual testing

### Station Hardware Configuration (Locked)
- **[smartipi-touch-pro-3.md](smartipi-touch-pro-3.md)** - Raspberry Pi case for touchscreen stations ($39.99/case)
- **[raspberry-pi-touch-display.md](raspberry-pi-touch-display.md)** - 7" Official touch display ($72.50)
- **[usb-extension-protection-cables.md](usb-extension-protection-cables.md)** - Right-angle USB cables to protect adapters ($10/cable)

## Hardware Status by Phase

### Phase 1b - Hardware Testing (Current)
| Hardware | Status | Notes |
|----------|---------|-------|
| Gearmo Adapter | ✅ Available | Single unit - high risk |
| CableMax Tester | ✅ Available | Ready for testing |
| DB9 Null Modem | ✅ Available | Loopback testing ready |
| MacBook Pro | ✅ Available | Primary platform |
| Anker Hub | ✅ Available | Port expansion |
| CoolTerm | ✅ Installed | Manual testing ready |

### Phase 2 - Client Site Validation
| Hardware | Required | Status |
|----------|----------|---------|
| Primary Gearmo | Yes | ✅ Available |
| Backup Gearmo | Yes | ❌ **NEED TO ORDER** |
| CableMax Tester | Yes | ✅ Available |
| MacBook Pro | Yes | ✅ Available |

### Phase 3 - Full Deployment (Locked Configuration)
| Hardware | Quantity Needed | Current | Cost Estimate |
|----------|-----------------|---------|---------------|
| Complete Station Setups | 15 (13+2 spares) | 0 | $2,992.35 |
| Gearmo USB-Serial Adapters | 16 (13+3 spares) | 1 | $480.00 |
| VESA Wall Mounts | 13 | 0 | $260.00 |
| Network Infrastructure | TBD | Planning | $500.00 |
| **Total Hardware Budget** | | | **$4,232.35** |

*Locked station configuration:
- Raspberry Pi 4 (4GB) + SmartiPi case + 7" display + accessories: $199.49/station
- Alternative Android tablet option available but not recommended

## Critical Missing Hardware
1. **Backup Gearmo USB-to-Serial Adapter** - Single point of failure risk
2. **Windows Testing Environment** - Needed for cross-platform validation
3. **Station Hardware Decision** - Choose between SmartiPi/Raspberry Pi vs Android tablets

## Hardware Procurement Priority
1. **IMMEDIATE**: Order backup Gearmo adapter for client site redundancy
2. **PHASE 2**: Confirm Sterling 7600 connectivity requirements
3. **PHASE 3**: Evaluate and select Android tablets for stations

## Quick Reference Links
- [Tool Inventory Archive](../tool-inventory.md) - Original consolidated inventory document
- [Project Overview](../project-overview.md) - System architecture and requirements
- [Scale Manual](../scale-manual.md) - Sterling 7600 specifications