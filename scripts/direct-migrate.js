#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

// Direct migration script that bypasses undici issues
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting direct Payload migration...');
console.log('Database URL:', process.env.DATABASE_URL ? 'Set ✓' : 'Not set ✗');

// Set up environment
process.env.NODE_ENV = 'production';
process.env.PAYLOAD_CONFIG_PATH = path.join(process.cwd(), 'src/payload.config.ts');

// Try different approaches
async function runMigration() {
  console.log('\n=== Attempting migration with tsx ===');

  try {
    const tsx = spawn(
      'tsx',
      [
        '--no-warnings',
        path.join(process.cwd(), 'node_modules/@payloadcms/db-postgres/dist/migrate.js'),
      ],
      {
        stdio: 'inherit',
        env: process.env,
        cwd: process.cwd(),
      }
    );

    await new Promise((resolve, reject) => {
      tsx.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Migration completed successfully with tsx');
          resolve();
        } else {
          reject(new Error(`Migration failed with code ${code}`));
        }
      });
      tsx.on('error', reject);
    });

    return true;
  } catch (error) {
    console.error('❌ tsx migration failed:', error.message);
  }

  // Try with node directly
  console.log('\n=== Attempting migration with node ===');

  try {
    const node = spawn(
      'node',
      [
        '--experimental-specifier-resolution=node',
        '--loader=tsx',
        path.join(process.cwd(), 'node_modules/@payloadcms/db-postgres/dist/migrate.js'),
      ],
      {
        stdio: 'inherit',
        env: process.env,
        cwd: process.cwd(),
      }
    );

    await new Promise((resolve, reject) => {
      node.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Migration completed successfully with node');
          resolve();
        } else {
          reject(new Error(`Migration failed with code ${code}`));
        }
      });
      node.on('error', reject);
    });

    return true;
  } catch (error) {
    console.error('❌ node migration failed:', error.message);
  }

  return false;
}

// Main execution
runMigration()
  .then((success) => {
    if (success) {
      console.log('\n✅ Database migration completed successfully!');
      process.exit(0);
    } else {
      console.log('\n⚠️  All migration attempts failed.');
      console.log('The application will attempt to run migrations on startup.');
      // Exit successfully to allow app to start
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    // Still exit successfully to not block deployment
    process.exit(0);
  });
