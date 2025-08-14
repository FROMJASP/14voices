#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Generating Payload types...');

try {
  // Use tsx to run the TypeScript config
  execSync('npx tsx node_modules/payload/dist/bin/index.js generate:types', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      PAYLOAD_CONFIG_PATH: 'src/payload.config.ts'
    }
  });
  
  console.log('✅ Payload types generated successfully!');
} catch (error) {
  console.error('❌ Failed to generate types:', error.message);
  process.exit(1);
}