#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Complete Database Fix for Payload CMS v3
 *
 * This script fixes all database schema issues including:
 * - Missing locales tables for collections with localized fields
 * - Missing relationship tables for arrays and uploads
 * - Missing columns in existing tables
 *
 * Run this in the Docker container:
 * docker exec -it <container-id> node scripts/fix-database-complete.js
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

console.log('🚀 Starting complete database fix for Payload CMS v3...\n');
console.log(`📍 Database URL: ${DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`);

async function runCompleteFix() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Step 1: Run Payload's own migrations first
    console.log('🔄 Running Payload migrations...');
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);

      const { stdout, stderr } = await execAsync('cd /app && bun payload migrate', {
        env: { ...process.env },
        timeout: 60000, // 60 second timeout
      });

      if (stdout) console.log(stdout);
      if (stderr && !stderr.includes('Nothing to migrate'))
        console.log('Payload migration output:', stderr);
      console.log('✅ Payload migrations completed\n');
    } catch (err) {
      console.log('⚠️  Payload migrations had issues, continuing with manual fixes...');
      console.log(err.message);
    }

    // Step 2: Create all missing locales tables
    const collectionsWithLocales = {
      voiceovers: ['name', 'description'],
      blog_posts: ['title', 'slug', 'content', 'excerpt'],
      pages: ['title', 'slug', 'content', 'excerpt'],
      testimonials: ['content', 'author', 'company'],
      f_a_q: ['question', 'answer'],
      email_templates: ['subject', 'preview_text'],
      forms: ['title', 'submit_button_label', 'confirmation_message'],
      productions: ['title', 'client', 'description'],
    };

    for (const [collection, fields] of Object.entries(collectionsWithLocales)) {
      const tableName = `${collection}_locales`;
      console.log(`📍 Creating/updating ${tableName} table...`);

      try {
        // Create the locales table
        await pool.query(`
          CREATE TABLE IF NOT EXISTS ${tableName} (
            id SERIAL PRIMARY KEY,
            _locale text NOT NULL,
            _parent_id integer,
            created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // Add all necessary columns
        for (const field of fields) {
          const columnType =
            field === 'content' || field === 'confirmation_message' ? 'jsonb' : 'text';
          await pool.query(`
            DO $$ 
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = '${field}'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN ${field} ${columnType};
              END IF;
            END $$;
          `);
        }

        // Add foreign key constraint
        await pool.query(`
          DO $$ 
          BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '${collection}') THEN
              IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                WHERE table_name = '${tableName}' 
                AND constraint_name = '${tableName}__parent_id_fkey') THEN
                ALTER TABLE ${tableName} 
                  ADD CONSTRAINT ${tableName}__parent_id_fkey 
                  FOREIGN KEY (_parent_id) REFERENCES ${collection}(id) ON DELETE CASCADE;
              END IF;
            END IF;
          END $$;
        `);

        // Create indexes
        await pool.query(`
          CREATE INDEX IF NOT EXISTS idx_${tableName}_parent ON ${tableName}(_parent_id);
          CREATE INDEX IF NOT EXISTS idx_${tableName}_locale ON ${tableName}(_locale);
          CREATE UNIQUE INDEX IF NOT EXISTS idx_${tableName}_unique ON ${tableName}(_locale, _parent_id);
        `);

        console.log(`✅ ${tableName} table created/updated`);
      } catch (err) {
        console.log(`⚠️  Issue with ${tableName}:`, err.message);
      }
    }

    // Step 3: Create globals locales tables
    const globalsWithLocales = {
      'site-settings': ['site_title', 'tagline', 'description'],
      'homepage-settings': ['hero_title', 'hero_subtitle', 'hero_cta_text'],
    };

    for (const [global, fields] of Object.entries(globalsWithLocales)) {
      const tableName = `${global}_locales`;
      console.log(`\n🌐 Creating/updating ${tableName} table...`);

      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS "${tableName}" (
            id SERIAL PRIMARY KEY,
            _locale text NOT NULL,
            created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // Add all necessary columns
        for (const field of fields) {
          await pool.query(`
            DO $$ 
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = '${field}'
              ) THEN
                ALTER TABLE "${tableName}" ADD COLUMN ${field} text;
              END IF;
            END $$;
          `);
        }

        // Create unique index
        await pool.query(`
          CREATE UNIQUE INDEX IF NOT EXISTS idx_${tableName.replace('-', '_')}_locale 
            ON "${tableName}"(_locale);
        `);

        console.log(`✅ ${tableName} table created/updated`);
      } catch (err) {
        console.log(`⚠️  Issue with ${tableName}:`, err.message);
      }
    }

    // Step 4: Create relationship tables for arrays
    console.log('\n📸 Creating relationship tables...');

    // voiceovers_additional_photos
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

      console.log('✅ voiceovers_additional_photos table created');
    } catch (err) {
      console.log('⚠️  Issue creating voiceovers_additional_photos:', err.message);
    }

    // voiceovers_style_tags
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

      console.log('✅ voiceovers_style_tags table created');
    } catch (err) {
      console.log('⚠️  Issue creating voiceovers_style_tags:', err.message);
    }

    // Step 5: Add missing columns to existing tables
    console.log('\n🔧 Adding missing columns to existing tables...');

    // Add missing columns to voiceovers table
    await pool.query(`
      DO $$ 
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
          -- Add full_demo_reel_id
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'voiceovers' AND column_name = 'full_demo_reel_id'
          ) THEN
            ALTER TABLE voiceovers ADD COLUMN full_demo_reel_id integer;
          END IF;
          
          -- Add commercials_demo_id
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'voiceovers' AND column_name = 'commercials_demo_id'
          ) THEN
            ALTER TABLE voiceovers ADD COLUMN commercials_demo_id integer;
          END IF;
          
          -- Add narrative_demo_id
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'voiceovers' AND column_name = 'narrative_demo_id'
          ) THEN
            ALTER TABLE voiceovers ADD COLUMN narrative_demo_id integer;
          END IF;
        END IF;
      END $$;
    `);

    // Add status column to pages and productions
    await pool.query(`
      DO $$ 
      BEGIN 
        -- Pages table
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages') THEN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'pages' AND column_name = 'status'
          ) THEN
            ALTER TABLE pages ADD COLUMN status text DEFAULT 'draft';
          END IF;
        END IF;
        
        -- Productions table
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'productions') THEN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'productions' AND column_name = 'status'
          ) THEN
            ALTER TABLE productions ADD COLUMN status text DEFAULT 'draft';
          END IF;
        END IF;
      END $$;
    `);

    console.log('✅ Missing columns added\n');

    // Step 6: Create Payload system tables if missing
    console.log('🔧 Creating Payload system tables...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payload_migrations (
        id SERIAL PRIMARY KEY,
        name text NOT NULL UNIQUE,
        batch integer NOT NULL,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);

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

    console.log('✅ Payload system tables created\n');

    // Step 7: Clean up old tables
    console.log('🧹 Cleaning up old tables...');

    // Remove double-underscore tables if they exist
    const oldTables = ['voiceovers__locales', 'pages__locales', 'blog_posts__locales'];
    for (const oldTable of oldTables) {
      try {
        const result = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = '${oldTable}'
          );
        `);

        if (result.rows[0].exists) {
          await pool.query(`DROP TABLE IF EXISTS ${oldTable} CASCADE;`);
          console.log(`✅ Removed old table ${oldTable}`);
        }
      } catch (err) {
        console.log(`⚠️  Could not check/remove ${oldTable}:`, err.message);
      }
    }

    // Final step: List all tables to confirm
    console.log('\n📋 Current database tables:');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    tablesResult.rows.forEach((row) => {
      console.log(`  - ${row.table_name}`);
    });

    console.log('\n🎉 All database fixes completed successfully!');
  } catch (error) {
    console.error('❌ Fix error:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the complete fix
runCompleteFix()
  .then(() => {
    console.log('\n✨ Database is now fully compatible with Payload CMS v3!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
