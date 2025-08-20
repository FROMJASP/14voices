#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not found in environment variables');
  process.exit(1);
}

console.log('🔧 Running Payload migrations to ensure all tables exist...\n');

async function runMigrations() {
  try {
    // Run Payload migrations through the CLI
    const { execSync } = require('child_process');  

    console.log('Running: bun payload migrate');
    execSync('bun payload migrate', {
      stdio: 'inherit',
      env: {
        ...process.env,
        PAYLOAD_CONFIG_PATH: path.join(process.cwd(), 'src/payload.config.ts'),
      },
    });

    console.log('\n✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migrations
runMigrations().catch(console.error);
