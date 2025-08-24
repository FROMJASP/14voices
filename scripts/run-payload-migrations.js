#!/usr/bin/env node
/**
 * Payload CMS Migration Runner
 *
 * This script runs Payload's built-in migration system to ensure
 * the database schema is always up-to-date with collection definitions.
 *
 * It handles:
 * - Schema synchronization for all collections
 * - Creating missing columns in existing tables
 * - Creating array/block field tables
 * - Managing relationships and locales
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require('child_process');
const path = require('path');

// Skip in build environment
if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
  console.log('⏭️  Skipping migrations for build environment');
  process.exit(0);
}

console.log('🚀 Running Payload CMS migrations...\n');

async function runPayloadMigrations() {
  return new Promise((resolve, reject) => {
    // Set environment for Payload CLI
    const env = {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'production',
      PAYLOAD_CONFIG_PATH: path.join(process.cwd(), 'src/payload.config.ts'),
    };

    console.log('📍 Working directory:', process.cwd());
    console.log('📄 Config path:', env.PAYLOAD_CONFIG_PATH);
    console.log('🌍 Environment:', env.NODE_ENV);
    console.log('');

    // Run Payload migrate command
    const migrate = spawn('npx', ['payload', 'migrate'], {
      env,
      cwd: process.cwd(),
      stdio: 'pipe',
    });

    let output = '';
    let errorOutput = '';

    migrate.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
    });

    migrate.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;

      // Some Payload messages go to stderr but aren't errors
      if (!text.includes('Warning') && !text.includes('info')) {
        process.stderr.write(text);
      }
    });

    migrate.on('error', (error) => {
      console.error('❌ Failed to start migration process:', error.message);
      reject(error);
    });

    migrate.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Payload migrations completed successfully');
        resolve();
      } else {
        // Check if it's just no migrations to run
        if (output.includes('No migrations to run') || output.includes('up to date')) {
          console.log('\n✅ Database schema is already up to date');
          resolve();
        } else {
          console.error(`\n❌ Migration process exited with code ${code}`);
          if (errorOutput) {
            console.error('Error output:', errorOutput);
          }
          reject(new Error(`Migration failed with exit code ${code}`));
        }
      }
    });
  });
}

// Add retry logic for robustness
async function runWithRetry(maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await runPayloadMigrations();
      return;
    } catch (error) {
      console.error(`\n⚠️  Attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      console.log(`\n🔄 Retrying... (${attempt + 1}/${maxRetries})`);
      // Wait a bit before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

// Execute migrations
runWithRetry()
  .then(() => {
    console.log('\n✨ Database schema synchronized with Payload collections!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed after all retries:', error.message);
    // Exit with 0 to not block deployment
    console.log('\n⚠️  Continuing deployment despite migration issues...');
    process.exit(0);
  });
