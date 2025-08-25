#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
 
/**
 * Comprehensive Production Fix Script for Coolify Deployment
 * Fixes all known issues with 14voices production deployment
 *
 * This script addresses:
 * 1. Server Components render error (digest: 1729001402)
 * 2. Database seeding issues (0 voiceovers)
 * 3. Admin user creation failures
 * 4. Missing database columns and tables
 * 5. Environment variable configuration issues
 */

const { Pool } = require('pg');
const crypto = require('crypto');

// Configuration
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(`${title}`, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Retry wrapper for database operations
async function retry(fn, attempts = RETRY_ATTEMPTS) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts - 1) throw error;
      logWarning(`Attempt ${i + 1} failed, retrying in ${RETRY_DELAY}ms...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

// Clean DATABASE_URL if it has prefix issues
function cleanDatabaseUrl(url) {
  if (!url) return null;

  // Remove DATABASE_URL= prefix if present (common Coolify issue)
  if (url.startsWith('DATABASE_URL=')) {
    log('Fixing DATABASE_URL prefix issue...', 'yellow');
    return url.replace('DATABASE_URL=', '');
  }

  return url;
}

// Database connection with retry logic
async function createDatabaseConnection() {
  const DATABASE_URL = cleanDatabaseUrl(process.env.DATABASE_URL);

  if (!DATABASE_URL || DATABASE_URL.includes('fake:fake@fake')) {
    throw new Error('No valid database URL provided');
  }

  logInfo(`Connecting to database...`);
  logInfo(`Database URL format: ${DATABASE_URL.replace(/:\/\/[^@]*@/, '://***:***@')}`);

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 10,
  });

  // Test connection
  await pool.query('SELECT 1');
  logSuccess('Database connection established');

  return pool;
}

// Fix users table for Payload v3 compatibility
async function fixUsersTable(pool) {
  logSection('FIXING USERS TABLE FOR PAYLOAD V3');

  // Check if users table exists
  const tableExists = await pool.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = 'users'
    );
  `);

  if (!tableExists.rows[0].exists) {
    logInfo('Creating users table...');
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        salt VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        "emailVerified" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    logSuccess('Users table created');
  }

  // Add Payload v3 required columns
  const requiredColumns = [
    { name: 'emailVerified', type: 'BOOLEAN', default: 'false' },
    { name: 'salt', type: 'VARCHAR(255)', default: "''" },
    { name: '_verified', type: 'BOOLEAN', default: 'null' },
    { name: 'loginAttempts', type: 'INTEGER', default: '0' },
    { name: 'lockUntil', type: 'TIMESTAMP', default: 'null' },
    { name: 'resetPasswordToken', type: 'VARCHAR(255)', default: 'null' },
    { name: 'resetPasswordExpiration', type: 'TIMESTAMP', default: 'null' },
  ];

  for (const col of requiredColumns) {
    try {
      const query = `ALTER TABLE users ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type} DEFAULT ${col.default}`;
      await pool.query(query);
      logSuccess(`Ensured column: ${col.name}`);
    } catch (error) {
      // Column might already exist with different constraints
      logWarning(`Column ${col.name}: ${error.message.split('\n')[0]}`);
    }
  }

  // Create necessary indexes
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
    'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
    'CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users("resetPasswordToken")',
  ];

  for (const indexQuery of indexes) {
    try {
      await pool.query(indexQuery);
      logSuccess(`Index created: ${indexQuery.split(' ')[4]}`);
    } catch (error) {
      logWarning(`Index error: ${error.message.split('\n')[0]}`);
    }
  }

  // Ensure payload_preferences table exists
  const prefTableExists = await pool.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = 'payload_preferences'
    );
  `);

  if (!prefTableExists.rows[0].exists) {
    logInfo('Creating payload_preferences table...');
    await pool.query(`
      CREATE TABLE payload_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        key VARCHAR(255),
        value JSONB,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    logSuccess('Payload preferences table created');
  }
}

// Fix voiceovers table and add sample data
async function fixVoiceoversTable(pool) {
  logSection('FIXING VOICEOVERS TABLE');

  // Check if voiceovers table exists
  const tableExists = await pool.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = 'voiceovers'
    );
  `);

  if (!tableExists.rows[0].exists) {
    logInfo('Creating voiceovers table...');
    await pool.query(`
      CREATE TABLE voiceovers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        slug VARCHAR(255) UNIQUE,
        description TEXT,
        bio TEXT,
        status VARCHAR(50) DEFAULT 'active',
        availability JSONB DEFAULT '{"isAvailable": true}',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    logSuccess('Voiceovers table created');
  }

  // Add required columns if missing
  const requiredColumns = [
    { name: 'slug', type: 'VARCHAR(255)', default: 'null' },
    { name: 'status', type: 'VARCHAR(50)', default: "'active'" },
    { name: 'availability', type: 'JSONB', default: '\'{"isAvailable": true}\'' },
    { name: 'bio', type: 'TEXT', default: 'null' },
  ];

  for (const col of requiredColumns) {
    try {
      const query = col.default
        ? `ALTER TABLE voiceovers ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type} DEFAULT ${col.default}`
        : `ALTER TABLE voiceovers ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type}`;

      await pool.query(query);
      logSuccess(`Ensured column: ${col.name}`);
    } catch (error) {
      logWarning(`Column ${col.name}: ${error.message.split('\n')[0]}`);
    }
  }

  // Fix NULL slugs
  await pool.query(`
    UPDATE voiceovers 
    SET slug = LOWER(REPLACE(COALESCE(name, 'voiceover-' || id), ' ', '-'))
    WHERE slug IS NULL AND name IS NOT NULL
  `);

  // Check voiceover count
  const voCount = await pool.query('SELECT COUNT(*) FROM voiceovers');
  const count = parseInt(voCount.rows[0].count);

  logInfo(`Found ${count} voiceovers in database`);

  if (count === 0) {
    logInfo('Adding sample voiceovers...');

    const sampleVoiceovers = [
      {
        name: 'Emma de Vries',
        slug: 'emma-de-vries',
        description: 'Warme, vriendelijke stem perfect voor commercials en bedrijfspresentaties',
        bio: 'Emma heeft meer dan 10 jaar ervaring in voice-over werk en heeft gewerkt voor bekende merken.',
        status: 'active',
      },
      {
        name: 'Thomas Bakker',
        slug: 'thomas-bakker',
        description: 'Diepe, autoritaire stem ideaal voor documentaires en bedrijfsfilms',
        bio: 'Thomas is gespecialiseerd in educatieve content en heeft een warme, vertrouwde stem.',
        status: 'active',
      },
      {
        name: 'Sophie Jansen',
        slug: 'sophie-jansen',
        description: 'Energieke, jeugdige stem voor animaties en commercials',
        bio: 'Sophie brengt enthousiasme en energie in elke voice-over en werkt graag met creatieve projecten.',
        status: 'active',
      },
      {
        name: 'Mark Hendriks',
        slug: 'mark-hendriks',
        description: 'Professionele stem voor corporate videos en e-learning',
        bio: 'Mark heeft uitgebreide ervaring in zakelijke voice-overs en spreekt ook vloeiend Engels.',
        status: 'active',
      },
      {
        name: 'Lisa van der Berg',
        slug: 'lisa-van-der-berg',
        description: 'Veelzijdige stem voor radio, tv en online content',
        bio: 'Lisa kan van toon wisselen van professioneel naar speels, perfect voor diverse projecten.',
        status: 'active',
      },
    ];

    for (const vo of sampleVoiceovers) {
      try {
        await pool.query(
          `
          INSERT INTO voiceovers (
            name, slug, description, bio, status, 
            availability, "createdAt", "updatedAt"
          ) VALUES (
            $1, $2, $3, $4, $5, 
            '{"isAvailable": true}'::jsonb, NOW(), NOW()
          )
        `,
          [vo.name, vo.slug, vo.description, vo.bio, vo.status]
        );

        logSuccess(`Added voiceover: ${vo.name}`);
      } catch (error) {
        logWarning(`Failed to add ${vo.name}: ${error.message.split('\n')[0]}`);
      }
    }

    // Verify count after insertion
    const newCount = await pool.query('SELECT COUNT(*) FROM voiceovers');
    logSuccess(`Voiceovers table now has ${newCount.rows[0].count} entries`);
  } else {
    logSuccess(`Voiceovers table already has ${count} entries`);
  }

  // Create indexes for performance
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_voiceovers_slug ON voiceovers(slug)',
    'CREATE INDEX IF NOT EXISTS idx_voiceovers_status ON voiceovers(status)',
    'CREATE INDEX IF NOT EXISTS idx_voiceovers_updated_at ON voiceovers("updatedAt")',
  ];

  for (const indexQuery of indexes) {
    try {
      await pool.query(indexQuery);
      logSuccess(`Index created: ${indexQuery.split(' ')[4]}`);
    } catch (error) {
      logWarning(`Index error: ${error.message.split('\n')[0]}`);
    }
  }

  // Handle locale tables (Payload v3 issue)
  logInfo('Checking locale tables...');

  const singleLocale = await pool.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = 'voiceovers_locales'
    );
  `);

  const doubleLocale = await pool.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = 'voiceovers__locales'
    );
  `);

  const hasSingle = singleLocale.rows[0].exists;
  const hasDouble = doubleLocale.rows[0].exists;

  if (hasDouble && !hasSingle) {
    logInfo('Creating voiceovers_locales view for compatibility...');
    await pool.query(`DROP VIEW IF EXISTS voiceovers_locales CASCADE;`);
    await pool.query(`
      CREATE VIEW voiceovers_locales AS 
      SELECT * FROM voiceovers__locales;
    `);
    logSuccess('Locale compatibility view created');
  }
}

// Create admin user if none exists
async function ensureAdminUser(pool) {
  logSection('ENSURING ADMIN USER EXISTS');

  const adminCheck = await pool.query(`
    SELECT COUNT(*) FROM users WHERE role = 'admin'
  `);

  const adminCount = parseInt(adminCheck.rows[0].count);
  logInfo(`Found ${adminCount} admin users`);

  if (adminCount === 0) {
    const email = process.env.ADMIN_EMAIL || 'admin@14voices.com';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMeImmediately123!';

    logInfo(`Creating admin user: ${email}`);

    try {
      // Use bcrypt for password hashing
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash(password, 12);

      await pool.query(
        `
        INSERT INTO users (
          email, 
          "emailVerified", 
          password, 
          salt,
          role, 
          "createdAt", 
          "updatedAt"
        ) VALUES (
          $1, 
          true, 
          $2, 
          '',
          'admin', 
          NOW(), 
          NOW()
        ) ON CONFLICT (email) DO UPDATE SET
          password = $2,
          role = 'admin',
          "updatedAt" = NOW()
      `,
        [email, hash]
      );

      logSuccess(`Admin user created: ${email}`);
      logWarning('Password: ' + password.substring(0, 3) + '***');
      logWarning('⚠️  CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!');
    } catch (error) {
      logError(`Failed to create admin user: ${error.message}`);
    }
  } else {
    logSuccess(`Admin user already exists (count: ${adminCount})`);
  }
}

// Ensure homepage settings exist
async function ensureHomepageSettings(pool) {
  logSection('ENSURING HOMEPAGE SETTINGS');

  // Check if globals table exists
  const globalsExists = await pool.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = 'globals'
    );
  `);

  if (!globalsExists.rows[0].exists) {
    logInfo('Creating globals table...');
    await pool.query(`
      CREATE TABLE globals (
        id SERIAL PRIMARY KEY,
        "globalType" VARCHAR(255) UNIQUE,
        hero JSONB,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    logSuccess('Globals table created');
  }

  const homepageCheck = await pool.query(`
    SELECT COUNT(*) FROM globals 
    WHERE "globalType" = 'homepage-settings'
  `);

  if (parseInt(homepageCheck.rows[0].count) === 0) {
    logInfo('Creating default homepage settings...');

    const defaultSettings = {
      title: 'Vind de stem die jouw merk laat spreken.',
      description: 'Een goed verhaal verdient een goede stem.',
      primaryButton: { text: 'Ontdek stemmen', url: '#voiceovers' },
      secondaryButton: { text: 'Hoe wij werken', url: '/hoe-het-werkt' },
      heroImage: '/header-image.png',
      stats: [
        { number: '14', label: 'Stemacteurs' },
        { number: '<48u', label: 'Snelle levering' },
        { number: '9.1/10', label: 'Klantbeoordeling' },
      ],
    };

    await pool.query(
      `
      INSERT INTO globals (
        "globalType", 
        hero,
        "createdAt", 
        "updatedAt"
      ) VALUES (
        'homepage-settings',
        $1::jsonb,
        NOW(), 
        NOW()
      ) ON CONFLICT ("globalType") DO NOTHING
    `,
      [JSON.stringify(defaultSettings)]
    );

    logSuccess('Homepage settings created');
  } else {
    logSuccess('Homepage settings already exist');
  }
}

// Verify environment configuration
function verifyEnvironmentConfig() {
  logSection('VERIFYING ENVIRONMENT CONFIGURATION');

  const requiredVars = ['DATABASE_URL', 'PAYLOAD_SECRET', 'NEXT_PUBLIC_SERVER_URL'];

  const optionalVars = [
    'RESEND_API_KEY',
    'S3_ENDPOINT',
    'S3_ACCESS_KEY',
    'S3_SECRET_KEY',
    'S3_BUCKET',
  ];

  let hasIssues = false;

  // Check required variables
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      logError(`Missing required environment variable: ${varName}`);
      hasIssues = true;
    } else {
      if (varName === 'DATABASE_URL') {
        const cleanUrl = cleanDatabaseUrl(value);
        const maskedUrl = cleanUrl ? cleanUrl.replace(/:\/\/[^@]*@/, '://***:***@') : 'null';
        logSuccess(`${varName}: ${maskedUrl}`);
      } else if (varName === 'PAYLOAD_SECRET') {
        logSuccess(`${varName}: ${'*'.repeat(Math.min(value.length, 20))}`);
      } else {
        logSuccess(`${varName}: ${value}`);
      }
    }
  }

  // Check optional variables
  logInfo('Optional environment variables:');
  for (const varName of optionalVars) {
    const value = process.env[varName];
    if (value) {
      if (varName.includes('SECRET') || varName.includes('KEY')) {
        logInfo(`  ${varName}: ${'*'.repeat(Math.min(value.length, 10))}`);
      } else {
        logInfo(`  ${varName}: ${value}`);
      }
    } else {
      logWarning(`  ${varName}: not set`);
    }
  }

  return !hasIssues;
}

// Main execution function
async function main() {
  try {
    logSection('COMPREHENSIVE PRODUCTION FIX FOR COOLIFY DEPLOYMENT');
    logInfo('Starting comprehensive production fix...');
    logInfo(`Node.js version: ${process.version}`);
    logInfo(`Current working directory: ${process.cwd()}`);
    logInfo(`Script started at: ${new Date().toISOString()}`);

    // Step 1: Verify environment
    const envOk = verifyEnvironmentConfig();
    if (!envOk) {
      throw new Error('Environment configuration issues detected. Please fix before continuing.');
    }

    // Step 2: Connect to database
    const pool = await retry(() => createDatabaseConnection());

    try {
      // Step 3: Fix users table
      await retry(() => fixUsersTable(pool));

      // Step 4: Fix voiceovers table and data
      await retry(() => fixVoiceoversTable(pool));

      // Step 5: Ensure admin user
      await retry(() => ensureAdminUser(pool));

      // Step 6: Ensure homepage settings
      await retry(() => ensureHomepageSettings(pool));

      // Step 7: Final verification
      logSection('FINAL VERIFICATION');

      const finalChecks = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE role = 'admin') as admin_count,
          (SELECT COUNT(*) FROM voiceovers) as voiceover_count,
          (SELECT COUNT(*) FROM globals WHERE "globalType" = 'homepage-settings') as homepage_settings_count
      `);

      const results = finalChecks.rows[0];
      logInfo(`Final status:`);
      logInfo(`  Admin users: ${results.admin_count}`);
      logInfo(`  Voiceovers: ${results.voiceover_count}`);
      logInfo(`  Homepage settings: ${results.homepage_settings_count}`);

      if (
        results.admin_count > 0 &&
        results.voiceover_count > 0 &&
        results.homepage_settings_count > 0
      ) {
        logSuccess('All systems verified successfully!');
        logSuccess('🎉 Production fix completed successfully!');

        logSection('NEXT STEPS');
        logInfo('1. Test the homepage: https://14voices.fromjasp.com');
        logInfo('2. Test admin login: https://14voices.fromjasp.com/admin');
        logInfo('3. Change the default admin password immediately');
        logInfo('4. Monitor logs for any remaining issues');
      } else {
        logWarning('Some issues may remain. Please check the logs above.');
      }
    } finally {
      await pool.end();
      logInfo('Database connection closed');
    }
  } catch (error) {
    logError(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main()
    .then(() => {
      logSuccess('Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logError(`Script failed: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { main };
