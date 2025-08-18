#!/usr/bin/env node

/**
 * Simple migration runner for production Docker environment
 * This script initializes Payload which automatically runs migrations
 */

/* eslint-disable @typescript-eslint/no-require-imports */
 

const { getPayload } = require('payload');
const path = require('path');

async function runMigrations() {
  try {
    console.log('🚀 Starting Payload initialization and migrations...');

    // Load the compiled payload config
    const configPath = path.resolve(__dirname, '../src/payload.config.ts');

    // Use require to load the TypeScript config (will be compiled by tsx)
    const configModule = require(configPath);
    const config = configModule.default || configModule;

    // Initialize Payload - this automatically runs migrations
    await getPayload({
      config: await config,
      disableAdmin: true,
      disableScheduledJobs: true,
    });

    console.log('✅ Payload initialized successfully');
    console.log('✅ Database migrations completed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations
runMigrations();
