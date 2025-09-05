#!/usr/bin/env node

import { SerialPort } from 'serialport';

const portPath = '/dev/cu.usbserial-BG011ORJ';
const testMessage = 'TEST\r';

console.log('🔍 Testing Serial with Hardware Flow Control Disabled');
console.log(`Port: ${portPath}`);

const port = new SerialPort({
  path: portPath,
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
  rtscts: false,      // Disable hardware flow control
  xon: false,         // Disable software flow control
  xoff: false,
  xany: false
});

port.on('open', () => {
  console.log('✅ Serial port opened (flow control disabled)');
  console.log('👀 Watch the CableMax LEDs now...');
  
  // Set up data listener
  port.on('data', (data) => {
    const received = data.toString();
    console.log(`📥 Loopback received: "${received.replace(/\r/g, '\\r').replace(/\n/g, '\\n')}"`);
    console.log('✅ Hardware communication successful!');
    port.close();
  });
  
  // Send test message every 500ms for 3 attempts
  let attempts = 0;
  const sendTest = () => {
    attempts++;
    console.log(`📤 Attempt ${attempts}: Sending "${testMessage.replace(/\r/g, '\\r')}"`);
    
    port.write(testMessage, (err) => {
      if (err) {
        console.error('❌ Write error:', err.message);
        port.close();
      }
    });
    
    if (attempts < 3) {
      setTimeout(sendTest, 500);
    } else {
      setTimeout(() => {
        console.log('⏰ Test complete - check if TXD LED flashed on CableMax');
        port.close();
      }, 1000);
    }
  };
  
  sendTest();
});

port.on('error', (err) => {
  console.error('❌ Serial port error:', err.message);
});

port.on('close', () => {
  console.log('🔌 Serial port closed');
  process.exit(0);
});