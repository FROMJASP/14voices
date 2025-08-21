#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Fix Locales Tables - Complete Solution
 *
 * This script ensures that locales tables exist with the correct naming convention.
 * Payload CMS 3.x with PostgreSQL adapter defaults to single underscore (_locales)
 * unless explicitly configured otherwise.
 *
 * Usage: node scripts/fix-locales-tables-complete.js
 */

const { Pool } = require('pg');

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL not found in environment variables');
  process.exit(1);
}

// Don't run on fake build database
if (DATABASE_URL.includes('fake:fake@fake')) {
  console.log('⏭️  Skipping migrations for build environment');
  process.exit(0);
}

console.log('🚀 Starting comprehensive locales table fix...\n');

async function fixLocalesTables() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // List of collections that have localized fields
    const localizedCollections = [
      'voiceovers',
      'pages',
      'blog_posts',
      'testimonials',
      'faq',
      'email_templates',
      'email_components',
      'forms',
    ];

    for (const collection of localizedCollections) {
      console.log(`\n📋 Processing ${collection}...`);

      const singleUnderscoreName = `${collection}_locales`;
      const doubleUnderscoreName = `${collection}__locales`;

      // Check what exists
      const singleExists = await pool.query(
        `SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1 AND table_schema = 'public'
        );`,
        [singleUnderscoreName]
      );

      const doubleExists = await pool.query(
        `SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1 AND table_schema = 'public'
        );`,
        [doubleUnderscoreName]
      );

      const hasSingle = singleExists.rows[0].exists;
      const hasDouble = doubleExists.rows[0].exists;

      console.log(
        `   Single underscore (${singleUnderscoreName}): ${hasSingle ? '✅ exists' : '❌ missing'}`
      );
      console.log(
        `   Double underscore (${doubleUnderscoreName}): ${hasDouble ? '✅ exists' : '❌ missing'}`
      );

      // Payload 3.x defaults to single underscore, so we need to ensure those exist
      if (!hasSingle && !hasDouble) {
        // Create the single underscore version
        console.log(`   🔨 Creating ${singleUnderscoreName}...`);

        // Get columns from the main collection to determine what localized fields exist
        const mainTableColumns = await pool.query(
          `SELECT column_name, data_type 
           FROM information_schema.columns 
           WHERE table_name = $1 AND table_schema = 'public'
           ORDER BY ordinal_position;`,
          [collection]
        );

        if (mainTableColumns.rows.length === 0) {
          console.log(`   ⚠️  Main table ${collection} not found, skipping...`);
          continue;
        }

        // Create the locales table with standard structure
        await pool.query(`
          CREATE TABLE IF NOT EXISTS ${singleUnderscoreName} (
            id SERIAL PRIMARY KEY,
            _locale text NOT NULL,
            _parent_id integer,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // Add localized fields based on collection
        if (collection === 'voiceovers') {
          await pool.query(`
            ALTER TABLE ${singleUnderscoreName}
            ADD COLUMN IF NOT EXISTS name text,
            ADD COLUMN IF NOT EXISTS description text;
          `);
        } else if (collection === 'pages' || collection === 'blog_posts') {
          await pool.query(`
            ALTER TABLE ${singleUnderscoreName}
            ADD COLUMN IF NOT EXISTS title text,
            ADD COLUMN IF NOT EXISTS meta_title text,
            ADD COLUMN IF NOT EXISTS meta_description text;
          `);
        } else if (collection === 'testimonials') {
          await pool.query(`
            ALTER TABLE ${singleUnderscoreName}
            ADD COLUMN IF NOT EXISTS content text,
            ADD COLUMN IF NOT EXISTS author text,
            ADD COLUMN IF NOT EXISTS role text,
            ADD COLUMN IF NOT EXISTS company text;
          `);
        } else if (collection === 'faq') {
          await pool.query(`
            ALTER TABLE ${singleUnderscoreName}
            ADD COLUMN IF NOT EXISTS question text,
            ADD COLUMN IF NOT EXISTS answer text;
          `);
        }

        // Add foreign key constraint
        const parentTableExists = await pool.query(
          `SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = $1 AND table_schema = 'public'
          );`,
          [collection]
        );

        if (parentTableExists.rows[0].exists) {
          await pool.query(`
            DO $$ 
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.table_constraints 
                WHERE table_name = '${singleUnderscoreName}' 
                AND constraint_name = '${singleUnderscoreName}__parent_id_fkey'
              ) THEN
                ALTER TABLE ${singleUnderscoreName} 
                  ADD CONSTRAINT ${singleUnderscoreName}__parent_id_fkey 
                  FOREIGN KEY (_parent_id) REFERENCES ${collection}(id) ON DELETE CASCADE;
              END IF;
            END $$;
          `);
        }

        // Create indexes
        await pool.query(`
          CREATE INDEX IF NOT EXISTS idx_${singleUnderscoreName}_parent 
            ON ${singleUnderscoreName}(_parent_id);
          CREATE INDEX IF NOT EXISTS idx_${singleUnderscoreName}_locale 
            ON ${singleUnderscoreName}(_locale);
          CREATE INDEX IF NOT EXISTS idx_${singleUnderscoreName}_parent_locale 
            ON ${singleUnderscoreName}(_parent_id, _locale);
        `);

        console.log(`   ✅ Created ${singleUnderscoreName}`);
      } else if (!hasSingle && hasDouble) {
        // If only double underscore exists, create single underscore as a copy
        console.log(`   🔄 Creating ${singleUnderscoreName} from ${doubleUnderscoreName}...`);

        // Create table with same structure
        await pool.query(`
          CREATE TABLE ${singleUnderscoreName} (LIKE ${doubleUnderscoreName} INCLUDING ALL);
        `);

        // Copy data
        await pool.query(`
          INSERT INTO ${singleUnderscoreName} 
          SELECT * FROM ${doubleUnderscoreName};
        `);

        console.log(`   ✅ Created ${singleUnderscoreName} from existing data`);
      } else if (hasSingle && hasDouble) {
        // Both exist - ensure single underscore has latest data
        console.log(`   ℹ️  Both versions exist, keeping both for compatibility`);
      }
    }

    // Final verification
    console.log('\n📊 Final verification...');
    const allLocalesTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE (table_name LIKE '%_locales' OR table_name LIKE '%__locales')
        AND table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\nLocales tables found:');
    allLocalesTables.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });

    console.log('\n🎉 Locales table fix completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the fix
fixLocalesTables()
  .then(() => {
    console.log('\n✨ Database schema fixed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
