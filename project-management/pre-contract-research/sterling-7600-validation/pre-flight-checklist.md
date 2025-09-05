# Pre-Flight Checklist for Sterling 7600 Site Visit

## Night Before (July 28)
- [x] Console application tested with mock scale
- [x] Gearmo FTDI adapter validated
- [x] Hardware communication verified with CableMax
- [x] Three-mode system implemented
- [x] Site test procedure documented
- [ ] Charge MacBook Pro to 100%
- [ ] Pack equipment bag

## Equipment Bag
- [ ] MacBook Pro M2 Max (charged)
- [ ] Gearmo USB-to-Serial adapter (tested today)
- [ ] CableMax RS-232 LED tester
- [ ] DB9 gender changer (just in case)
- [ ] USB-C to USB-A adapter (if needed)
- [ ] Power adapter for MacBook

## Software Checklist
- [x] Node.js v22.11.0 installed
- [x] Console application at: `/Users/andrewbailey/dev/scale-interface`
- [x] Config file shows mode: `hardware-testing` (will change on-site)
- [x] Test commands memorized:
  ```bash
  node src/index.js --mode=scale --diagnostics
  node src/index.js --mode=scale --time=300
  ```

## Quick Test Before Leaving
```bash
# Run this before you leave for the site:
cd /Users/andrewbailey/dev/scale-interface
pnpm start:test
# Should see all green checkmarks
```

## Contact Information
- [ ] Client contact number saved
- [ ] Site address confirmed
- [ ] Parking instructions reviewed

## Contingency Plans
1. **If Gearmo fails:** Use CableMax to verify Sterling 7600 is transmitting
2. **If wrong baud rate:** Test 4800, 9600, 19200 (9600 most likely)
3. **If Node.js app fails:** Use CoolTerm for manual command testing
4. **If no DB9 port:** Check for RS-232 adapter cables at site
5. **If permission issues:** Document and plan for Phase 3

## Success Metrics to Capture
- [ ] Exact firmware version from SVN command
- [ ] Sample weight readings (gross, net, count)
- [ ] Response time measurements
- [ ] Any error messages from scale
- [ ] Photos of setup (if permitted)

## Remember
- Start with baseline test (no hardware)
- Validate with CableMax before Sterling connection
- Document everything in test-results.log
- Stay calm if issues arise - we have good diagnostics