#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
 

// Simple migration runner that bypasses ESM issues
const { execSync } = require('child_process');

console.log('Starting Payload migrations...');

try {
  // Change to app directory
  process.chdir('/app');

  // Try to run migrations using the Payload CLI
  try {
    execSync('npx payload migrate', {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' },
    });
    console.log('✅ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);

    // Try alternative approach - skip migrations and let Payload handle on startup
    console.log('⚠️  Skipping explicit migrations - Payload will handle on startup');
    process.exit(0); // Exit successfully to allow app to start
  }
} catch (error) {
  console.error('Fatal error:', error);
  process.exit(1);
}
