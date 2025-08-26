#!/usr/bin/env node

/**
 * Production-ready Payload migration runner
 * Handles all database migrations using ONLY Payload's built-in system
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Build environment detection
 * - Comprehensive error handling
 * - Database validation before migrations
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
};

function log(message, color = COLORS.WHITE) {
  const timestamp = new Date().toISOString();
  console.log(`${color}[${timestamp}] ${message}${COLORS.RESET}`);
}

function logSection(title) {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}${'='.repeat(60)}${COLORS.RESET}`);
  console.log(`${COLORS.BOLD}${COLORS.CYAN}  ${title}${COLORS.RESET}`);
  console.log(`${COLORS.BOLD}${COLORS.CYAN}${'='.repeat(60)}${COLORS.RESET}\n`);
}

/**
 * Check if we're in a build environment
 */
function isBuildEnvironment() {
  const dbUrl = process.env.DATABASE_URL || '';
  return dbUrl.includes('fake:fake@fake');
}

/**
 * Validate database connection
 */
async function validateDatabase() {
  if (isBuildEnvironment()) {
    log('Build environment detected, skipping database validation', COLORS.YELLOW);
    return true;
  }

  const { Client } = require('pg');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    const result = await client.query('SELECT NOW()');
    log(`Database connected successfully at ${result.rows[0].now}`, COLORS.GREEN);
    
    // Check if migrations table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'payload_migrations'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      log('Payload migrations table exists', COLORS.GREEN);
    } else {
      log('Payload migrations table will be created', COLORS.YELLOW);
    }
    
    await client.end();
    return true;
  } catch (error) {
    log(`Database validation failed: ${error.message}`, COLORS.RED);
    return false;
  }
}

/**
 * Run Payload migrations with retry logic
 */
async function runPayloadMigrations(attempt = 1, maxAttempts = 5) {
  return new Promise((resolve, reject) => {
    log(`Running Payload migrations (attempt ${attempt}/${maxAttempts})...`, COLORS.BLUE);

    // Use the Payload CLI to run migrations
    const payloadPath = path.join(__dirname, '..', 'node_modules', '.bin', 'payload');
    const args = ['migrate'];
    
    // Add database URL as environment variable
    const env = {
      ...process.env,
      SKIP_SEED_ON_INIT: 'true' // Don't seed during migrations
    };

    const child = spawn(payloadPath, args, {
      cwd: path.join(__dirname, '..'),
      env,
      stdio: 'pipe'
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      process.stdout.write(data);
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });

    child.on('close', async (code) => {
      if (code === 0) {
        log('Payload migrations completed successfully!', COLORS.GREEN);
        resolve(true);
      } else {
        log(`Payload migrations failed with code ${code}`, COLORS.RED);
        
        if (attempt < maxAttempts) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          log(`Retrying in ${delay / 1000} seconds...`, COLORS.YELLOW);
          
          setTimeout(async () => {
            try {
              await runPayloadMigrations(attempt + 1, maxAttempts);
              resolve(true);
            } catch (error) {
              reject(error);
            }
          }, delay);
        } else {
          reject(new Error(`Migration failed after ${maxAttempts} attempts`));
        }
      }
    });

    child.on('error', (error) => {
      log(`Failed to start Payload migration process: ${error.message}`, COLORS.RED);
      reject(error);
    });
  });
}

/**
 * Create admin user if needed
 */
async function ensureAdminUser() {
  if (isBuildEnvironment()) {
    log('Build environment detected, skipping admin user creation', COLORS.YELLOW);
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    log('Admin credentials not provided in environment variables', COLORS.YELLOW);
    return;
  }

  try {
    const { getPayload } = await import('../src/lib/payload/get-payload-client.js');
    const payload = await getPayload();
    
    // Check if admin exists
    const existingAdmin = await payload.find({
      collection: 'users',
      where: { email: { equals: adminEmail } },
      limit: 1
    });

    if (existingAdmin.docs.length === 0) {
      // Create admin user
      await payload.create({
        collection: 'users',
        data: {
          email: adminEmail,
          password: adminPassword,
          role: 'admin'
        }
      });
      log(`Admin user created: ${adminEmail}`, COLORS.GREEN);
    } else {
      log(`Admin user already exists: ${adminEmail}`, COLORS.BLUE);
    }
  } catch (error) {
    log(`Admin user check/creation failed: ${error.message}`, COLORS.YELLOW);
    // Non-fatal error, continue
  }
}

/**
 * Main execution
 */
async function main() {
  logSection('PAYLOAD MIGRATION RUNNER');

  try {
    // Skip everything in build environment
    if (isBuildEnvironment()) {
      log('Build environment detected, skipping all migrations', COLORS.YELLOW);
      process.exit(0);
    }

    // Step 1: Validate database connection
    log('Step 1: Validating database connection...', COLORS.BLUE);
    const dbValid = await validateDatabase();
    if (!dbValid) {
      throw new Error('Database validation failed');
    }

    // Step 2: Run Payload migrations
    log('\nStep 2: Running Payload migrations...', COLORS.BLUE);
    await runPayloadMigrations();

    // Step 3: Ensure admin user exists
    log('\nStep 3: Ensuring admin user exists...', COLORS.BLUE);
    await ensureAdminUser();

    logSection('MIGRATION COMPLETED SUCCESSFULLY');
    process.exit(0);
  } catch (error) {
    logSection('MIGRATION FAILED');
    log(error.message, COLORS.RED);
    log('Stack trace:', COLORS.RED);
    console.error(error.stack);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  log('Unhandled rejection:', COLORS.RED);
  console.error(error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log('Uncaught exception:', COLORS.RED);
  console.error(error);
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateDatabase, runPayloadMigrations, ensureAdminUser };