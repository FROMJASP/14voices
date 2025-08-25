#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
 

/**
 * Direct Database Initialization Script
 * Bypasses Payload migrations and sets up the database directly
 * This avoids the undici CacheStorage error
 */

const { Pool } = require('pg');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function initializeDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL || DATABASE_URL.includes('fake:fake@fake')) {
    log('❌ No valid DATABASE_URL provided', 'red');
    process.exit(1);
  }

  log('🚀 Direct Database Initialization Starting...', 'cyan');

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
  });

  try {
    // Test connection
    await pool.query('SELECT 1');
    log('✅ Database connected', 'green');

    // Create users table with CORRECT Payload v3 structure
    log('📊 Creating/updating users table...', 'blue');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        hash VARCHAR(255),
        salt VARCHAR(255) DEFAULT '',
        role VARCHAR(50) DEFAULT 'user',
        _verified BOOLEAN DEFAULT false,
        "loginAttempts" INTEGER DEFAULT 0,
        "lockUntil" TIMESTAMP DEFAULT null,
        "resetPasswordToken" VARCHAR(255) DEFAULT null,
        "resetPasswordExpiration" TIMESTAMP DEFAULT null,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    // Add any missing columns
    const alterQueries = [
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS hash VARCHAR(255)',
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS salt VARCHAR(255) DEFAULT ''",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user'",
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS _verified BOOLEAN DEFAULT false',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS "loginAttempts" INTEGER DEFAULT 0',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS "lockUntil" TIMESTAMP DEFAULT null',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS "resetPasswordToken" VARCHAR(255) DEFAULT null',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS "resetPasswordExpiration" TIMESTAMP DEFAULT null',
    ];

    for (const query of alterQueries) {
      try {
        await pool.query(query);
      } catch (e) {
        // Column might already exist
      }
    }

    log('✅ Users table ready', 'green');

    // Create admin user if needed
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@14voices.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMeImmediately123!';

    const adminCheck = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);

    if (adminCheck.rows.length === 0) {
      log('👤 Creating admin user...', 'blue');

      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash(adminPassword, 10);

      await pool.query(
        `
        INSERT INTO users (email, hash, salt, role, _verified, "createdAt", "updatedAt")
        VALUES ($1, $2, '', 'admin', true, NOW(), NOW())
      `,
        [adminEmail, hash]
      );

      log(`✅ Admin user created: ${adminEmail}`, 'green');
    } else {
      log('✅ Admin user already exists', 'green');
    }

    // Create voiceovers table
    log('🎤 Creating voiceovers table...', 'blue');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS voiceovers (
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

    // Add sample voiceovers if empty
    const voCount = await pool.query('SELECT COUNT(*) FROM voiceovers');
    if (parseInt(voCount.rows[0].count) === 0) {
      log('🎤 Adding sample voiceovers...', 'blue');

      const sampleVoiceovers = [
        [
          'Emma de Vries',
          'emma-de-vries',
          'Warme, vriendelijke stem perfect voor commercials',
          'Emma heeft meer dan 10 jaar ervaring.',
        ],
        [
          'Thomas Bakker',
          'thomas-bakker',
          'Diepe, autoritaire stem ideaal voor documentaires',
          'Thomas is gespecialiseerd in educatieve content.',
        ],
        [
          'Sophie Jansen',
          'sophie-jansen',
          'Energieke, jeugdige stem voor animaties',
          'Sophie brengt enthousiasme in elke voice-over.',
        ],
      ];

      for (const [name, slug, description, bio] of sampleVoiceovers) {
        await pool.query(
          `
          INSERT INTO voiceovers (name, slug, description, bio, status, availability)
          VALUES ($1, $2, $3, $4, 'active', '{"isAvailable": true}'::jsonb)
        `,
          [name, slug, description, bio]
        );
      }

      log('✅ Sample voiceovers added', 'green');
    }

    // Create globals table for homepage settings
    log('🏠 Creating globals table...', 'blue');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS globals (
        id SERIAL PRIMARY KEY,
        "globalType" VARCHAR(255) UNIQUE,
        hero JSONB,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    // Add homepage settings
    const settingsCheck = await pool.query(
      'SELECT id FROM globals WHERE "globalType" = \'homepage-settings\''
    );

    if (settingsCheck.rows.length === 0) {
      const heroData = {
        title: 'Vind de stem die jouw merk laat spreken.',
        description: 'Een goed verhaal verdient een goede stem.',
        primaryButton: { text: 'Ontdek stemmen', url: '#voiceovers' },
        secondaryButton: { text: 'Hoe wij werken', url: '/hoe-het-werkt' },
      };

      await pool.query(
        `
        INSERT INTO globals ("globalType", hero, "createdAt", "updatedAt")
        VALUES ('homepage-settings', $1::jsonb, NOW(), NOW())
      `,
        [JSON.stringify(heroData)]
      );

      log('✅ Homepage settings created', 'green');
    }

    // Create other essential tables
    log('📋 Creating other essential tables...', 'blue');

    // Pages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        slug VARCHAR(255) UNIQUE,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    // Media table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255),
        "mimeType" VARCHAR(100),
        filesize INTEGER,
        url VARCHAR(500),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    log('✅ All essential tables created', 'green');
    log('🎉 Database initialization complete!', 'green');
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
