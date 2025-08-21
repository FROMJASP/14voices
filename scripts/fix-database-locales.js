#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Fix Database Locales Tables for Payload CMS v3
 *
 * This script creates all missing locales tables for collections that have localized fields.
 * Payload v3 uses single underscore for locales tables (e.g., voiceovers_locales)
 *
 * Usage: node scripts/fix-database-locales.js
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

console.log('🚀 Starting database locales fix for Payload CMS v3...\n');

async function fixLocalesTables() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Collections that have localized fields
    const collectionsWithLocales = [
      'voiceovers',
      'blog_posts',
      'pages',
      'testimonials',
      'f_a_q',
      'email_templates',
      'forms',
    ];

    // Global configs that have localized fields
    const globalsWithLocales = ['site-settings', 'homepage-settings'];

    // Create locales tables for collections
    for (const collection of collectionsWithLocales) {
      const tableName = `${collection}_locales`;
      console.log(`📍 Creating/updating ${tableName} table...`);

      try {
        // Create the locales table with proper structure
        await pool.query(`
          CREATE TABLE IF NOT EXISTS ${tableName} (
            id SERIAL PRIMARY KEY,
            _locale text NOT NULL,
            _parent_id integer,
            created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // Add columns based on collection
        if (collection === 'voiceovers') {
          await pool.query(`
            DO $$ 
            BEGIN
              -- Add name column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'name'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN name text;
              END IF;
              
              -- Add description column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'description'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN description text;
              END IF;
            END $$;
          `);
        } else if (collection === 'blog_posts' || collection === 'pages') {
          await pool.query(`
            DO $$ 
            BEGIN
              -- Add title column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'title'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN title text;
              END IF;
              
              -- Add slug column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'slug'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN slug text;
              END IF;
              
              -- Add content column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'content'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN content jsonb;
              END IF;
              
              -- Add excerpt column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'excerpt'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN excerpt text;
              END IF;
            END $$;
          `);
        } else if (collection === 'testimonials') {
          await pool.query(`
            DO $$ 
            BEGIN
              -- Add content column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'content'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN content text;
              END IF;
              
              -- Add author column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'author'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN author text;
              END IF;
              
              -- Add company column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'company'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN company text;
              END IF;
            END $$;
          `);
        } else if (collection === 'f_a_q') {
          await pool.query(`
            DO $$ 
            BEGIN
              -- Add question column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'question'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN question text;
              END IF;
              
              -- Add answer column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'answer'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN answer text;
              END IF;
            END $$;
          `);
        } else if (collection === 'email_templates') {
          await pool.query(`
            DO $$ 
            BEGIN
              -- Add subject column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'subject'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN subject text;
              END IF;
              
              -- Add preview_text column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'preview_text'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN preview_text text;
              END IF;
            END $$;
          `);
        } else if (collection === 'forms') {
          await pool.query(`
            DO $$ 
            BEGIN
              -- Add title column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'title'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN title text;
              END IF;
              
              -- Add submit_button_label column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'submit_button_label'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN submit_button_label text;
              END IF;
              
              -- Add confirmation_message column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'confirmation_message'
              ) THEN
                ALTER TABLE ${tableName} ADD COLUMN confirmation_message jsonb;
              END IF;
            END $$;
          `);
        }

        // Add foreign key constraint if parent table exists
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

        // Create indexes for performance
        await pool.query(`
          CREATE INDEX IF NOT EXISTS idx_${tableName}_parent 
            ON ${tableName}(_parent_id);
          CREATE INDEX IF NOT EXISTS idx_${tableName}_locale 
            ON ${tableName}(_locale);
          CREATE UNIQUE INDEX IF NOT EXISTS idx_${tableName}_unique 
            ON ${tableName}(_locale, _parent_id);
        `);

        console.log(`✅ ${tableName} table created/updated\n`);
      } catch (err) {
        console.log(`⚠️  Issue with ${tableName}:`, err.message);
      }
    }

    // Create locales tables for globals
    for (const global of globalsWithLocales) {
      const tableName = `${global}_locales`;
      console.log(`🌐 Creating/updating ${tableName} table...`);

      try {
        // Create the locales table
        await pool.query(`
          CREATE TABLE IF NOT EXISTS "${tableName}" (
            id SERIAL PRIMARY KEY,
            _locale text NOT NULL,
            created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // Add columns based on global
        if (global === 'site-settings') {
          await pool.query(`
            DO $$ 
            BEGIN
              -- Add site_title column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'site_title'
              ) THEN
                ALTER TABLE "${tableName}" ADD COLUMN site_title text;
              END IF;
              
              -- Add tagline column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'tagline'
              ) THEN
                ALTER TABLE "${tableName}" ADD COLUMN tagline text;
              END IF;
              
              -- Add description column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'description'
              ) THEN
                ALTER TABLE "${tableName}" ADD COLUMN description text;
              END IF;
            END $$;
          `);
        } else if (global === 'homepage-settings') {
          await pool.query(`
            DO $$ 
            BEGIN
              -- Add hero_title column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'hero_title'
              ) THEN
                ALTER TABLE "${tableName}" ADD COLUMN hero_title text;
              END IF;
              
              -- Add hero_subtitle column if it doesn't exist
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'hero_subtitle'
              ) THEN
                ALTER TABLE "${tableName}" ADD COLUMN hero_subtitle text;
              END IF;
            END $$;
          `);
        }

        // Create unique index for locale
        await pool.query(`
          CREATE UNIQUE INDEX IF NOT EXISTS idx_${tableName.replace('-', '_')}_locale 
            ON "${tableName}"(_locale);
        `);

        console.log(`✅ ${tableName} table created/updated\n`);
      } catch (err) {
        console.log(`⚠️  Issue with ${tableName}:`, err.message);
      }
    }

    // Also ensure the productions table has required columns if it exists
    console.log('🎬 Checking productions table...');
    await pool.query(`
      DO $$ 
      BEGIN 
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'productions') THEN
          -- Add status column if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'productions' AND column_name = 'status'
          ) THEN
            ALTER TABLE productions ADD COLUMN status text DEFAULT 'draft';
          END IF;
        END IF;
      END $$;
    `);
    console.log('✅ productions table checked\n');

    // Clean up any old double-underscore tables if they exist
    console.log('🧹 Cleaning up old double-underscore tables...');
    const oldTables = ['voiceovers__locales'];
    for (const oldTable of oldTables) {
      try {
        await pool.query(`DROP TABLE IF EXISTS ${oldTable} CASCADE;`);
        console.log(`✅ Removed old table ${oldTable}`);
      } catch (err) {
        console.log(`⚠️  Could not remove ${oldTable}:`, err.message);
      }
    }

    console.log('\n🎉 All database locales tables fixed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the fix
fixLocalesTables()
  .then(() => {
    console.log('\n✨ Database is ready for Payload CMS v3 with localization!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
