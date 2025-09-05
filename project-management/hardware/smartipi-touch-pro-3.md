# SmartiPi Touch Pro 3 - Station Display Case

**Product**: SmartiPi Touch Pro 3  
**Manufacturer**: Smarticase  
**Price**: $39.99 per unit  
**Product Link**: [Smarticase Official](https://smarticase.com/products/smartipi-touch-pro-3)

## Description
A professional case designed for Raspberry Pi (models 3, 4, and 5) with the Raspberry Pi Touch Display 2. Provides a robust, industrial-suitable enclosure for creating touchscreen stations with integrated computing capabilities.

## Key Features
- **Compatible with Raspberry Pi 3, 4, and 5** - flexibility in compute selection
- **Designed for Raspberry Pi Touch Display 2** - official touchscreen support
- **Interchangeable back covers** - Large and Small sizes for different configurations
- **Spacious internal cavity** - Room for HAT boards and additional hardware
- **75mm VESA mount points** - Standard mounting for walls or stands
- **Weighted base** - Stable desktop placement
- **Tilting display** - Adjustable viewing angle
- **Side switch for Pi 5** - Dedicated power control
- **Accessible ports** - USB, Ethernet, HDMI, and audio remain accessible

## Technical Specifications
- **Camera mounting** - Dedicated space for Raspberry Pi Camera V2 and V3
- **Port access** - Removable panel near Raspberry Pi ports
- **SD card access** - Micro SD card extender included
- **Port covers** - Punch-out USB/Ethernet covers for clean installation
- **Mount compatibility** - 75mm VESA standard for industrial mounting

## Power Requirements
- **Separate USB-C power supply required**
- **Raspberry Pi 5**: 27W recommended
- **Raspberry Pi 4**: 15W recommended
- **Note**: Power supply not included

## Use Cases for This Project
- **Station touchscreen interface** - Complete solution for operator interaction
- **Wall-mounted display** - VESA mount points for industrial installation
- **Desktop station** - Weighted base for stable desk placement
- **Serial adapter housing** - Internal cavity can accommodate USB-to-serial adapter
- **Camera integration** - Optional camera for operator identification or QR scanning
- **Compact station design** - Professional appearance for manufacturing floor

## Cost Analysis for 13 Stations

### Hardware Components per Station
| Component | Unit Cost | Notes |
|-----------|-----------|-------|
| SmartiPi Touch Pro 3 Case | $39.99 | Enclosure only |
| Raspberry Pi 4 (4GB) | ~$55.00 | Sufficient for this application |
| Touch Display (5" or 7") | $50-$80 | 5" (~$50) or 7" (~$80) |
| MicroSD Card (32GB) | ~$10.00 | OS and storage |
| USB-C Power Supply (15W) | ~$12.00 | Required separately |
| **Total per Station (5")** | **~$167.00** | With 5" display |
| **Total per Station (7")** | **~$197.00** | With 7" display (recommended) |

### Full Deployment (13 Stations + Spares)

#### Option 1: With 7" Displays (Recommended)
| Component | Qty | Unit Cost | Total |
|-----------|-----|-----------|--------|
| Complete Station Setup (7") | 15 | $197.00 | $2,955.00 |
| Gearmo USB-Serial Adapters | 16 | $30.00 | $480.00 |
| VESA Wall Mounts | 13 | $20.00 | $260.00 |
| Network Equipment | - | - | $500.00 |
| **Total Hardware** | | | **$4,195.00** |

#### Option 2: With 5" Displays (Budget)
| Component | Qty | Unit Cost | Total |
|-----------|-----|-----------|--------|
| Complete Station Setup (5") | 15 | $167.00 | $2,505.00 |
| Gearmo USB-Serial Adapters | 16 | $30.00 | $480.00 |
| VESA Wall Mounts | 13 | $20.00 | $260.00 |
| Network Equipment | - | - | $500.00 |
| **Total Hardware** | | | **$3,745.00** |

## Advantages for Scale Interface Project
- **All-in-one solution** - Computer and display in single package
- **Industrial suitable** - Robust case for manufacturing environment
- **Cost-effective** - Under $220 per complete station
- **Flexible mounting** - Wall or desktop placement options
- **Professional appearance** - Clean, modern design
- **Expandable** - HAT support for additional functionality
- **Linux-based** - Raspberry Pi OS well-suited for serial communication

## Considerations
- **Linux development required** - Different from Windows/Mac testing environment
- **ARM architecture** - May need to recompile some dependencies
- **Serial adapter compatibility** - Need to verify Gearmo works with Pi
- **Network connectivity** - Built-in Ethernet, Wi-Fi available
- **Performance** - Adequate for serial monitoring and display
- **Not included** - Must purchase Pi and display separately

## Alternative Configurations

### Budget Option
- Raspberry Pi 3B+ (~$35) instead of Pi 4
- Smaller power supply (10W)
- Total per station: ~$177

### Premium Option
- Raspberry Pi 5 (~$80) for future-proofing
- 27W power supply required
- Total per station: ~$232

### Tablet Alternative Comparison
| Aspect | SmartiPi Setup | Android Tablet |
|--------|---------------|----------------|
| Cost per station | ~$217 | ~$200 |
| Mounting flexibility | Excellent (VESA) | Limited |
| Serial compatibility | Good (Linux) | Requires testing |
| Development effort | Higher (Linux app) | Higher (Android app) |
| Durability | Excellent | Good with case |
| Customization | Full control | Limited |

## Implementation Notes
- **Operating System**: Raspberry Pi OS (Debian-based Linux)
- **Serial Support**: Native Linux serial port drivers
- **Display**: 800x480 resolution touchscreen
- **Development**: Can use Electron or web-based interface
- **Remote Management**: SSH access for maintenance
- **Updates**: Easy OTA updates via network

## Project-Specific Benefits
1. **Dedicated hardware** - No tablet battery concerns
2. **24/7 operation** - Designed for continuous use
3. **Standard mounting** - VESA compatibility for any mount
4. **Local processing** - Edge computing capabilities
5. **Cost predictable** - Fixed hardware costs
6. **Long-term availability** - Raspberry Pi ecosystem stability