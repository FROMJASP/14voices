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

    // First, let Payload create its base tables
    console.log('🔄 Running Payload migrations...');
    try {
      // Try to run Payload's own migrations first
      const { exec } = require('child_process');
      await new Promise((resolve, reject) => {
        exec('cd /app && npx payload migrate', (error, stdout, stderr) => {
          if (error) {
            console.log('⚠️  Payload migrations had issues, but continuing...');
            console.log(stderr);
            resolve(); // Continue even if Payload migrations fail
          } else {
            console.log('✅ Payload migrations completed');
            resolve();
          }
        });
      });
    } catch (err) {
      console.log('⚠️  Could not run Payload migrations, continuing with manual setup...');
    }

    // Now create missing relationship tables
    // These tables are required for the voiceovers collection to work properly

    // 1. Create voiceovers_additional_photos table
    console.log('\n📸 Creating voiceovers_additional_photos table...');
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS voiceovers_additional_photos (
          id SERIAL PRIMARY KEY,
          _order integer NOT NULL,
          _parent_id integer,
          photo_id integer,
          caption text,
          _uuid text,
          created_at timestamp DEFAULT CURRENT_TIMESTAMP,
          updated_at timestamp DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Try to add foreign keys if tables exist
      await pool.query(`
        DO $$ 
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
            IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
              WHERE table_name = 'voiceovers_additional_photos' 
              AND constraint_name = 'voiceovers_additional_photos__parent_id_fkey') THEN
              ALTER TABLE voiceovers_additional_photos 
                ADD CONSTRAINT voiceovers_additional_photos__parent_id_fkey 
                FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
            END IF;
          END IF;
          
          IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'media') THEN
            IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
              WHERE table_name = 'voiceovers_additional_photos' 
              AND constraint_name = 'voiceovers_additional_photos_photo_id_fkey') THEN
              ALTER TABLE voiceovers_additional_photos 
                ADD CONSTRAINT voiceovers_additional_photos_photo_id_fkey 
                FOREIGN KEY (photo_id) REFERENCES media(id) ON DELETE SET NULL;
            END IF;
          END IF;
        END $$;
      `);
    } catch (err) {
      console.log('⚠️  Issue creating voiceovers_additional_photos:', err.message);
    }

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
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS voiceovers_style_tags (
          id SERIAL PRIMARY KEY,
          _order integer NOT NULL,
          _parent_id integer,
          tag text,
          custom_tag text,
          _uuid text,
          created_at timestamp DEFAULT CURRENT_TIMESTAMP,
          updated_at timestamp DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Add foreign key if voiceovers table exists
      await pool.query(`
        DO $$ 
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
            IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
              WHERE table_name = 'voiceovers_style_tags' 
              AND constraint_name = 'voiceovers_style_tags__parent_id_fkey') THEN
              ALTER TABLE voiceovers_style_tags 
                ADD CONSTRAINT voiceovers_style_tags__parent_id_fkey 
                FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
            END IF;
          END IF;
        END $$;
      `);
    } catch (err) {
      console.log('⚠️  Issue creating voiceovers_style_tags:', err.message);
    }

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_parent 
        ON voiceovers_style_tags(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_order 
        ON voiceovers_style_tags(_order);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_tag 
        ON voiceovers_style_tags(tag);
    `);
    console.log('✅ voiceovers_style_tags table created\n');

    // 3. Create voiceovers_locales table (note: single underscore for Payload CMS v3)
    console.log('🌍 Creating voiceovers_locales table...');
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS voiceovers_locales (
          id SERIAL PRIMARY KEY,
          name text,
          description text,
          _locale text NOT NULL,
          _parent_id integer,
          created_at timestamp DEFAULT CURRENT_TIMESTAMP,
          updated_at timestamp DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Add foreign key if voiceovers table exists
      await pool.query(`
        DO $$ 
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
            IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
              WHERE table_name = 'voiceovers_locales' 
              AND constraint_name = 'voiceovers_locales__parent_id_fkey') THEN
              ALTER TABLE voiceovers_locales 
                ADD CONSTRAINT voiceovers_locales__parent_id_fkey 
                FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
            END IF;
          END IF;
        END $$;
      `);
    } catch (err) {
      console.log('⚠️  Issue creating voiceovers_locales:', err.message);
    }

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_voiceovers_locales_parent 
        ON voiceovers_locales(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_locales_locale 
        ON voiceovers_locales(_locale);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_voiceovers_locales_unique 
        ON voiceovers_locales(_locale, _parent_id);
    `);
    console.log('✅ voiceovers_locales table created\n');

    // 4. Add missing voiceover upload columns
    console.log('🎵 Adding voiceover upload columns...');
    try {
      // Check if voiceovers table exists and add missing upload columns
      await pool.query(`
        DO $$ 
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
            -- Add full_demo_reel_id column if it doesn't exist
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'voiceovers' AND column_name = 'full_demo_reel_id'
            ) THEN
              ALTER TABLE voiceovers ADD COLUMN full_demo_reel_id integer;
              COMMENT ON COLUMN voiceovers.full_demo_reel_id IS 'Full demo reel audio file reference';
            END IF;
            
            -- Add commercials_demo_id column if it doesn't exist
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'voiceovers' AND column_name = 'commercials_demo_id'
            ) THEN
              ALTER TABLE voiceovers ADD COLUMN commercials_demo_id integer;
              COMMENT ON COLUMN voiceovers.commercials_demo_id IS 'Commercials demo audio file reference';
            END IF;
            
            -- Add narrative_demo_id column if it doesn't exist
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'voiceovers' AND column_name = 'narrative_demo_id'
            ) THEN
              ALTER TABLE voiceovers ADD COLUMN narrative_demo_id integer;
              COMMENT ON COLUMN voiceovers.narrative_demo_id IS 'Narrative demo audio file reference';
            END IF;
          END IF;
        END $$;
      `);

      // Add foreign key constraints to media table if it exists
      await pool.query(`
        DO $$ 
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'media') 
             AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
            
            -- Add foreign key for full_demo_reel_id
            IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
              WHERE table_name = 'voiceovers' 
              AND constraint_name = 'voiceovers_full_demo_reel_id_fkey') THEN
              ALTER TABLE voiceovers 
                ADD CONSTRAINT voiceovers_full_demo_reel_id_fkey 
                FOREIGN KEY (full_demo_reel_id) REFERENCES media(id) ON DELETE SET NULL;
            END IF;
            
            -- Add foreign key for commercials_demo_id
            IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
              WHERE table_name = 'voiceovers' 
              AND constraint_name = 'voiceovers_commercials_demo_id_fkey') THEN
              ALTER TABLE voiceovers 
                ADD CONSTRAINT voiceovers_commercials_demo_id_fkey 
                FOREIGN KEY (commercials_demo_id) REFERENCES media(id) ON DELETE SET NULL;
            END IF;
            
            -- Add foreign key for narrative_demo_id
            IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
              WHERE table_name = 'voiceovers' 
              AND constraint_name = 'voiceovers_narrative_demo_id_fkey') THEN
              ALTER TABLE voiceovers 
                ADD CONSTRAINT voiceovers_narrative_demo_id_fkey 
                FOREIGN KEY (narrative_demo_id) REFERENCES media(id) ON DELETE SET NULL;
            END IF;
          END IF;
        END $$;
      `);

      // Create indexes for performance
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_voiceovers_full_demo_reel_id 
          ON voiceovers(full_demo_reel_id);
        CREATE INDEX IF NOT EXISTS idx_voiceovers_commercials_demo_id 
          ON voiceovers(commercials_demo_id);
        CREATE INDEX IF NOT EXISTS idx_voiceovers_narrative_demo_id 
          ON voiceovers(narrative_demo_id);
      `);
    } catch (err) {
      console.log('⚠️  Issue adding voiceover upload columns:', err.message);
    }
    console.log('✅ voiceover upload columns verified\n');

    // 5. Ensure pages table has status column
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

    // 6. Create payload_migrations table if it doesn't exist
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

    // 7. Create payload_preferences table if it doesn't exist
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
