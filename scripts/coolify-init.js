#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
 

/**
 * Coolify Production Initialization Script
 *
 * This script handles all necessary initialization for a Coolify deployment:
 * 1. Database connectivity verification
 * 2. Admin user creation (if needed)
 * 3. Import map generation
 * 4. Environment variable validation
 *
 * Security: Uses parameterized queries and proper error handling
 */

const { Pool } = require('pg');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration with proper defaults
const config = {
  maxRetries: 30,
  retryDelay: 2000,
  requiredEnvVars: ['DATABASE_URL', 'PAYLOAD_SECRET', 'NEXT_PUBLIC_SERVER_URL'],
};

// Logging utilities
const log = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  success: (msg) => console.log(`[SUCCESS] ${new Date().toISOString()} - ✅ ${msg}`),
};

// Validate environment variables
function validateEnvironment() {
  log.info('Validating environment variables...');

  const missing = [];
  const invalid = [];

  for (const varName of config.requiredEnvVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    } else {
      // Check for common Coolify issues
      const value = process.env[varName];

      // Check if variable contains its own name (common Coolify issue)
      if (value.startsWith(`${varName}=`)) {
        invalid.push(`${varName} contains its own name - likely misconfigured in Coolify`);
        // Try to fix it
        process.env[varName] = value.substring(`${varName}=`.length);
        log.warn(`Fixed ${varName} by removing prefix`);
      }

      // Validate specific variables
      if (varName === 'DATABASE_URL' && !value.startsWith('postgresql://')) {
        invalid.push(`${varName} must start with postgresql://`);
      }

      if (varName === 'PAYLOAD_SECRET' && value.length < 32) {
        invalid.push(`${varName} must be at least 32 characters long`);
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (invalid.length > 0) {
    throw new Error(`Invalid environment variables:\n${invalid.join('\n')}`);
  }

  // Log sanitized values for debugging
  log.info(`DATABASE_URL format: ${process.env.DATABASE_URL.replace(/\/\/[^@]+@/, '//***:***@')}`);
  log.info(`NEXT_PUBLIC_SERVER_URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`);
  log.info(`PAYLOAD_SECRET length: ${process.env.PAYLOAD_SECRET.length}`);

  log.success('Environment validation passed');
}

// Wait for database to be ready
async function waitForDatabase() {
  log.info('Waiting for database connection...');

  let lastError = null;

  for (let i = 0; i < config.maxRetries; i++) {
    try {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 1,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 1000,
      });

      await pool.query('SELECT 1');
      await pool.end();

      log.success('Database connection established');
      return;
    } catch (error) {
      lastError = error;
      log.warn(`Database not ready (attempt ${i + 1}/${config.maxRetries}): ${error.message}`);

      if (i < config.maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, config.retryDelay));
      }
    }
  }

  throw new Error(
    `Database connection failed after ${config.maxRetries} attempts: ${lastError?.message}`
  );
}

// Run Payload migrations
async function runMigrations() {
  log.info('Running Payload migrations...');

  try {
    // First, generate schema migration if needed
    const generateMigrationScript = path.join(__dirname, 'generate-schema-migration.js');
    if (fs.existsSync(generateMigrationScript)) {
      try {
        execSync(`node ${generateMigrationScript} production-sync`, {
          stdio: 'inherit',
          env: process.env,
        });
        log.success('Schema migration generated');
      } catch (error) {
        log.warn('Schema migration generation had issues, continuing...');
      }
    }

    // Run Payload migrations
    const runMigrationsScript = path.join(__dirname, 'run-payload-migrations.js');
    if (fs.existsSync(runMigrationsScript)) {
      execSync(`node ${runMigrationsScript}`, {
        stdio: 'inherit',
        env: process.env,
      });
      log.success('Payload migrations completed');
    } else {
      // Fallback to npx
      execSync('npx payload migrate', {
        stdio: 'inherit',
        env: process.env,
      });
      log.success('Payload migrations completed (via npx)');
    }

    // Force schema sync
    const forceSyncScript = path.join(__dirname, 'force-schema-sync.js');
    if (fs.existsSync(forceSyncScript)) {
      try {
        execSync(`node ${forceSyncScript}`, {
          stdio: 'inherit',
          env: process.env,
        });
        log.success('Schema force sync completed');
      } catch (error) {
        log.warn('Schema force sync had issues, continuing...');
      }
    }
  } catch (error) {
    log.error(`Migration error: ${error.message}`);
    throw error;
  }
}

// Create admin user if needed
async function ensureAdminUser() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    log.info('Skipping admin user creation (ADMIN_EMAIL or ADMIN_PASSWORD not provided)');
    return;
  }

  log.info('Checking for admin user...');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
  });

  try {
    // Check if admin exists using parameterized query
    const checkResult = await pool.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [
      process.env.ADMIN_EMAIL,
    ]);

    if (checkResult.rows.length > 0) {
      log.info('Admin user already exists');
      return;
    }

    log.info('Creating admin user...');

    // Hash password using bcryptjs (compatible with Payload)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    // Create admin user with parameterized query
    const insertResult = await pool.query(
      `INSERT INTO users (email, hash, verified, roles, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id`,
      [
        process.env.ADMIN_EMAIL,
        hashedPassword,
        true,
        JSON.stringify(['admin']),
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );

    log.success(`Admin user created with ID: ${insertResult.rows[0].id}`);
  } catch (error) {
    log.error(`Failed to create admin user: ${error.message}`);
    // Don't throw - admin creation is not critical for app startup
  } finally {
    await pool.end();
  }
}

// Generate import map
async function generateImportMap() {
  log.info('Generating import map...');

  const generateScript = path.join(__dirname, 'generate-importmap.js');
  if (fs.existsSync(generateScript)) {
    try {
      execSync(`node ${generateScript}`, {
        stdio: 'inherit',
        env: process.env,
      });
      log.success('Import map generated');
    } catch (error) {
      log.warn('Import map generation had issues, continuing...');
    }
  } else {
    log.warn('Import map generation script not found');
  }
}

// Fix NEXT_PUBLIC_SERVER_URL at runtime
async function fixRuntimeUrl() {
  log.info('Checking runtime URL configuration...');

  const runtimeUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const coolifyUrl = process.env.COOLIFY_URL;
  const coolifyFqdn = process.env.COOLIFY_FQDN;

  // If NEXT_PUBLIC_SERVER_URL is not set or is localhost, try to use Coolify URLs
  if (!runtimeUrl || runtimeUrl === 'http://localhost:3000') {
    const finalUrl = coolifyUrl || coolifyFqdn || runtimeUrl;
    if (finalUrl && finalUrl !== runtimeUrl) {
      process.env.NEXT_PUBLIC_SERVER_URL = finalUrl;
      log.info(`Updated NEXT_PUBLIC_SERVER_URL to: ${finalUrl}`);
    }
  }

  // Write runtime config file for client-side access
  const runtimeConfig = {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    generated: new Date().toISOString(),
  };

  const configPath = path.join(process.cwd(), 'public', 'runtime-config.json');
  try {
    fs.writeFileSync(configPath, JSON.stringify(runtimeConfig, null, 2));
    log.success('Runtime configuration written');
  } catch (error) {
    log.warn(`Failed to write runtime config: ${error.message}`);
  }
}

// Main initialization function
async function initialize() {
  log.info('Starting Coolify initialization...');

  try {
    // Step 1: Validate environment
    validateEnvironment();

    // Step 2: Wait for database
    await waitForDatabase();

    // Step 3: Run migrations
    await runMigrations();

    // Step 4: Ensure admin user
    await ensureAdminUser();

    // Step 5: Generate import map
    await generateImportMap();

    // Step 6: Fix runtime URL
    await fixRuntimeUrl();

    log.success('Coolify initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    log.error(`Initialization failed: ${error.message}`);
    process.exit(1);
  }
}

// Run initialization
initialize();
