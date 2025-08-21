#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Comprehensive Payload CMS Migration Script
 *
 * This single script handles all database migrations for Payload CMS
 * including creating missing tables for voiceovers relationships.
 *
 * Usage: node scripts/payload-migrate.js
 */

const { Pool } = require('pg');

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL not found in environment variables');
  process.exit(1);
}

// Don't run migrations on fake build database
if (DATABASE_URL.includes('fake:fake@fake')) {
  console.log('⏭️  Skipping migrations for build environment');
  process.exit(0);
}

console.log('🚀 Starting Payload CMS database migration...\n');

async function runMigrations() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Create missing voiceovers relationship tables
    // These tables are required for the voiceovers collection to work properly

    // 1. Create voiceovers_additional_photos table
    console.log('📸 Creating voiceovers_additional_photos table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS voiceovers_additional_photos (
        id SERIAL PRIMARY KEY,
        _order integer NOT NULL,
        _parent_id integer REFERENCES voiceovers(id) ON DELETE CASCADE,
        photo_id integer REFERENCES media(id) ON DELETE SET NULL,
        caption text,
        _uuid text,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_parent 
        ON voiceovers_additional_photos(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_order 
        ON voiceovers_additional_photos(_order);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_photo 
        ON voiceovers_additional_photos(photo_id);
    `);
    console.log('✅ voiceovers_additional_photos table created\n');

    // 2. Create voiceovers_style_tags table
    console.log('🏷️  Creating voiceovers_style_tags table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS voiceovers_style_tags (
        id SERIAL PRIMARY KEY,
        _order integer NOT NULL,
        _parent_id integer REFERENCES voiceovers(id) ON DELETE CASCADE,
        tag text,
        custom_tag text,
        _uuid text,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_parent 
        ON voiceovers_style_tags(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_order 
        ON voiceovers_style_tags(_order);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_tag 
        ON voiceovers_style_tags(tag);
    `);
    console.log('✅ voiceovers_style_tags table created\n');

    // 3. Create voiceovers_locales table
    console.log('🌍 Creating voiceovers_locales table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS voiceovers_locales (
        id SERIAL PRIMARY KEY,
        name text,
        description text,
        _locale text NOT NULL,
        _parent_id integer REFERENCES voiceovers(id) ON DELETE CASCADE,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_voiceovers_locales_parent 
        ON voiceovers_locales(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_locales_locale 
        ON voiceovers_locales(_locale);
    `);
    console.log('✅ voiceovers_locales table created\n');

    // 4. Ensure pages table has status column
    console.log('📄 Checking pages table status column...');
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'pages' AND column_name = 'status'
        ) THEN
          ALTER TABLE pages ADD COLUMN status text DEFAULT 'draft';
        END IF;
      END $$;
    `);
    console.log('✅ pages table status column verified\n');

    // 5. Create payload_migrations table if it doesn't exist
    console.log('🔧 Creating payload_migrations table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payload_migrations (
        id SERIAL PRIMARY KEY,
        name text NOT NULL UNIQUE,
        batch integer NOT NULL,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ payload_migrations table created\n');

    // 6. Create payload_preferences table if it doesn't exist
    console.log('⚙️  Creating payload_preferences table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payload_preferences (
        id SERIAL PRIMARY KEY,
        key text NOT NULL,
        value jsonb,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_payload_preferences_key 
        ON payload_preferences(key);
    `);
    console.log('✅ payload_preferences table created\n');

    console.log('🎉 All database migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migrations
runMigrations()
  .then(() => {
    console.log('\n✨ Database is ready for Payload CMS!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
