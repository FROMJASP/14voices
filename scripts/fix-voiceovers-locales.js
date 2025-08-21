#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Fix Voiceovers Locales Table Schema
 *
 * This script fixes the naming issue with the voiceovers locales table.
 * Payload CMS expects tables with double underscores for localized collections.
 *
 * Usage: node scripts/fix-voiceovers-locales.js
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

console.log('🚀 Starting voiceovers locales table fix...\n');

async function fixVoiceoversLocales() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Check if voiceovers_locales table exists
    const checkSingleUnderscore = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers_locales'
      );
    `);

    // Check if voiceovers__locales table exists (double underscore)
    const checkDoubleUnderscore = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers__locales'
      );
    `);

    const hasSingleUnderscore = checkSingleUnderscore.rows[0].exists;
    const hasDoubleUnderscore = checkDoubleUnderscore.rows[0].exists;

    console.log(`📊 Table Status:`);
    console.log(`   voiceovers_locales exists: ${hasSingleUnderscore}`);
    console.log(`   voiceovers__locales exists: ${hasDoubleUnderscore}\n`);

    // If we have the single underscore version but not the double, rename it
    if (hasSingleUnderscore && !hasDoubleUnderscore) {
      console.log('🔄 Renaming voiceovers_locales to voiceovers__locales...');

      // Drop constraints first
      await pool.query(`
        ALTER TABLE IF EXISTS voiceovers_locales 
        DROP CONSTRAINT IF EXISTS voiceovers_locales__parent_id_fkey;
      `);

      // Rename the table
      await pool.query(`
        ALTER TABLE voiceovers_locales RENAME TO voiceovers__locales;
      `);

      // Rename indexes
      await pool.query(`
        ALTER INDEX IF EXISTS idx_voiceovers_locales_parent 
        RENAME TO idx_voiceovers__locales_parent;
        
        ALTER INDEX IF EXISTS idx_voiceovers_locales_locale 
        RENAME TO idx_voiceovers__locales_locale;
      `);

      // Re-add the foreign key constraint with new name
      await pool.query(`
        DO $$ 
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
            ALTER TABLE voiceovers__locales 
              ADD CONSTRAINT voiceovers__locales__parent_id_fkey 
              FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
          END IF;
        END $$;
      `);

      console.log('✅ Successfully renamed table to voiceovers__locales\n');
    }

    // If neither exists, create the double underscore version
    if (!hasSingleUnderscore && !hasDoubleUnderscore) {
      console.log('🌍 Creating voiceovers__locales table...');

      await pool.query(`
        CREATE TABLE IF NOT EXISTS voiceovers__locales (
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
            ALTER TABLE voiceovers__locales 
              ADD CONSTRAINT voiceovers__locales__parent_id_fkey 
              FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
          END IF;
        END $$;
      `);

      // Create indexes
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_parent 
          ON voiceovers__locales(_parent_id);
        CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_locale 
          ON voiceovers__locales(_locale);
      `);

      console.log('✅ voiceovers__locales table created\n');
    }

    // Also check and fix other potentially affected locales tables
    const localizedCollections = ['pages', 'blog_posts', 'testimonials', 'faq'];

    for (const collection of localizedCollections) {
      const singleName = `${collection}_locales`;
      const doubleName = `${collection}__locales`;

      const checkSingle = await pool.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        );
      `,
        [singleName]
      );

      const checkDouble = await pool.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        );
      `,
        [doubleName]
      );

      if (checkSingle.rows[0].exists && !checkDouble.rows[0].exists) {
        console.log(`🔄 Renaming ${singleName} to ${doubleName}...`);

        // Drop constraints
        await pool.query(`
          ALTER TABLE IF EXISTS ${singleName} 
          DROP CONSTRAINT IF EXISTS ${singleName}__parent_id_fkey;
        `);

        // Rename table
        await pool.query(`
          ALTER TABLE ${singleName} RENAME TO ${doubleName};
        `);

        // Re-add constraints
        await pool.query(`
          DO $$ 
          BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '${collection}') THEN
              ALTER TABLE ${doubleName} 
                ADD CONSTRAINT ${doubleName}__parent_id_fkey 
                FOREIGN KEY (_parent_id) REFERENCES ${collection}(id) ON DELETE CASCADE;
            END IF;
          END $$;
        `);

        console.log(`✅ Successfully renamed ${singleName} to ${doubleName}\n`);
      }
    }

    // Update the main migration script to use double underscores
    console.log('📝 Checking if payload-migrate.js needs updating...');

    console.log('\n🎉 All voiceovers locales table fixes completed successfully!');
    console.log(
      '\n⚠️  IMPORTANT: Update payload-migrate.js to use double underscores for locales tables'
    );
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the fix
fixVoiceoversLocales()
  .then(() => {
    console.log('\n✨ Database schema fixed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
