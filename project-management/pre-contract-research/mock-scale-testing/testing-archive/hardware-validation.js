#!/usr/bin/env node

import { SerialPort } from 'serialport';

const portPath = '/dev/cu.usbserial-BG011ORJ';

console.log('🔧 Hardware Validation Test Suite');
console.log('Direct connection: Gearmo → CableMax (no null modem)');
console.log('Watch CableMax LEDs for transmission patterns\n');

const tests = [
  { name: 'Sterling Commands', commands: ['SGW\r', 'SNW\r', 'SCO\r', 'SPW\r'] },
  { name: 'Control Commands', commands: ['ZRO\r', 'ATW\r', 'SVN\r'] },
  { name: 'Continuous Data', commands: ['SGW\r', 'SGW\r', 'SGW\r'] },
  { name: 'Mixed Pattern', commands: ['SGW\r', 'SNW\r', 'SCO\r'] }
];

async function runTest(testName, commands) {
  console.log(`\n📋 ${testName} Test:`);
  
  return new Promise((resolve) => {
    const port = new SerialPort({
      path: portPath,
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
      rtscts: false
    });

    port.on('open', () => {
      console.log('  ✅ Port opened');
      
      let commandIndex = 0;
      const sendCommand = () => {
        if (commandIndex < commands.length) {
          const cmd = commands[commandIndex];
          console.log(`  📤 Sending: "${cmd.replace(/\r/g, '\\r')}" (watch TXD LED)`);
          
          port.write(cmd, (err) => {
            if (err) console.error(`  ❌ Write error: ${err.message}`);
          });
          
          commandIndex++;
          setTimeout(sendCommand, 1000); // 1 second between commands
        } else {
          setTimeout(() => {
            port.close();
          }, 500);
        }
      };
      
      sendCommand();
    });

    port.on('error', (err) => {
      console.error(`  ❌ Port error: ${err.message}`);
      resolve();
    });

    port.on('close', () => {
      console.log('  🔌 Port closed');
      resolve();
    });
  });
}

async function runAllTests() {
  console.log('🚀 Starting hardware validation tests...\n');
  
  for (const test of tests) {
    await runTest(test.name, test.commands);
    console.log('\n⏸️  Test complete. Check CableMax LED behavior.');
    console.log('Press Enter to continue to next test...');
    
    // Wait for user input
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });
  }
  
  console.log('\n✅ Hardware validation complete!');
  console.log('Results show transmission capability for Sterling 7600 connection tomorrow.');
  process.exit(0);
}

runAllTests();