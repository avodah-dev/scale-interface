#!/usr/bin/env node

import { SerialPort } from 'serialport';

const portPath = '/dev/cu.usbserial-BG011ORJ';
const testMessage = 'HELLO\r\n';

console.log('🔍 Testing Serial Loopback with Null Modem Adapter');
console.log(`Port: ${portPath}`);
console.log(`Test message: "${testMessage.replace(/\r/g, '\\r').replace(/\n/g, '\\n')}"`);

const port = new SerialPort({
  path: portPath,
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none'
});

port.on('open', () => {
  console.log('✅ Serial port opened');
  
  // Set up data listener
  port.on('data', (data) => {
    const received = data.toString();
    console.log(`📥 Received: "${received.replace(/\r/g, '\\r').replace(/\n/g, '\\n')}"`);
    
    if (received.includes('HELLO')) {
      console.log('✅ Loopback test successful! Null modem adapter is working.');
    } else {
      console.log('⚠️  Unexpected response in loopback test');
    }
    
    port.close();
  });
  
  // Send test message
  console.log('📤 Sending test message...');
  port.write(testMessage, (err) => {
    if (err) {
      console.error('❌ Write error:', err.message);
      port.close();
    }
  });
  
  // Timeout after 3 seconds
  setTimeout(() => {
    console.log('⏰ Test timeout - no response received');
    console.log('This suggests the null modem adapter may not be properly connected');
    port.close();
  }, 3000);
});

port.on('error', (err) => {
  console.error('❌ Serial port error:', err.message);
});

port.on('close', () => {
  console.log('🔌 Serial port closed');
  process.exit(0);
});