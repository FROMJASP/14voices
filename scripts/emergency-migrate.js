#!/usr/bin/env node

// Emergency migration script for Coolify deployment
// Run this inside the container if normal migrations fail

const { spawn } = require('child_process');
const path = require('path');

console.log('🚨 Emergency Migration Script');
console.log('=============================\n');

async function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    const proc = spawn(command, args, {
      stdio: 'inherit',
      cwd: '/app',
      env: process.env
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  try {
    // First, try to generate import map
    console.log('\n1. Generating import map...');
    try {
      await runCommand('npx', ['payload', 'generate:importmap']);
      console.log('✅ Import map generated');
    } catch (e) {
      console.log('⚠️  Import map generation failed (might be okay)');
    }

    // Then run migrations
    console.log('\n2. Running database migrations...');
    await runCommand('npx', ['payload', 'migrate']);
    console.log('✅ Migrations completed successfully!');

    console.log('\n🎉 All done! The application should now work properly.');
    console.log('You may need to restart the container in Coolify.');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\nTrying alternative approach...');
    
    // Try with Node directly
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      console.log('Running Payload CLI directly...');
      const { stdout, stderr } = await execAsync('cd /app && NODE_ENV=production node node_modules/.bin/payload migrate');
      
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      
      console.log('✅ Alternative migration approach succeeded!');
    } catch (altError) {
      console.error('❌ Alternative approach also failed:', altError.message);
      console.log('\n⚠️  Manual intervention required:');
      console.log('1. Check DATABASE_URL is correct');
      console.log('2. Ensure database user has CREATE TABLE permissions');
      console.log('3. Try running: npx payload migrate --drop-db (WARNING: This drops all data!)');
    }
  }
}

main().catch(console.error);