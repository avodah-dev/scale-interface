#!/usr/bin/env node

import { SerialPort } from 'serialport';

const portPath = '/dev/cu.usbserial-BG011ORJ';

console.log('💥 Burst Transmission Test');
console.log('Sending longer data bursts to make LED activity more visible\n');

const port = new SerialPort({
  path: portPath,
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
  rtscts: false
});

port.on('open', () => {
  console.log('✅ Port opened - watch CableMax TXD for red flashes\n');
  
  let testNum = 0;
  const runBurst = () => {
    testNum++;
    if (testNum <= 3) {
      console.log(`🔴 Test ${testNum}: Sending continuous burst...`);
      
      // Send multiple commands rapidly
      for (let i = 0; i < 50; i++) {
        port.write('SGW\r');
        port.write('SNW\r');
        port.write('SCO\r');
      }
      
      console.log('   Should see more pronounced TXD activity\n');
      setTimeout(runBurst, 3000);
    } else {
      console.log('✅ Burst test complete');
      port.close();
    }
  };
  
  runBurst();
});

port.on('close', () => {
  console.log('🔌 Port closed');
  process.exit(0);
});