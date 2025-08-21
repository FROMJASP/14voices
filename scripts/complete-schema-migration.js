#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Complete Schema Migration for Self-Hosted PostgreSQL
 *
 * This script ensures all tables are created with the correct naming convention
 * that Payload CMS expects, particularly for localized collections.
 *
 * Key insight: Payload CMS uses double underscores (__) for localized tables
 *
 * Usage: node scripts/complete-schema-migration.js
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

console.log('🚀 Starting complete schema migration...\n');

async function runCompleteMigration() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // 1. Check and fix voiceovers__locales table
    console.log('🌍 Ensuring voiceovers__locales table...');

    // First check if single underscore version exists
    const singleExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers_locales'
      );
    `);

    // Check if double underscore version exists
    const doubleExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers__locales'
      );
    `);

    if (singleExists.rows[0].exists && !doubleExists.rows[0].exists) {
      console.log('📝 Found voiceovers_locales, renaming to voiceovers__locales...');

      // Drop old constraint
      await pool.query(`
        ALTER TABLE voiceovers_locales 
        DROP CONSTRAINT IF EXISTS voiceovers_locales__parent_id_fkey;
      `);

      // Rename table
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

      console.log('✅ Renamed to voiceovers__locales');
    } else if (!singleExists.rows[0].exists && !doubleExists.rows[0].exists) {
      console.log('📝 Creating voiceovers__locales table...');

      await pool.query(`
        CREATE TABLE voiceovers__locales (
          id SERIAL PRIMARY KEY,
          name text,
          description text,
          _locale text NOT NULL,
          _parent_id integer,
          created_at timestamp DEFAULT CURRENT_TIMESTAMP,
          updated_at timestamp DEFAULT CURRENT_TIMESTAMP
        );
      `);

      console.log('✅ Created voiceovers__locales table');
    } else if (doubleExists.rows[0].exists) {
      console.log('✅ voiceovers__locales table already exists');

      // Check if single underscore version also exists and remove it
      if (singleExists.rows[0].exists) {
        console.log('⚠️  Found duplicate voiceovers_locales table, removing it...');
        await pool.query(`DROP TABLE IF EXISTS voiceovers_locales CASCADE;`);
        console.log('✅ Removed duplicate voiceovers_locales table');
      }
    }

    // Add constraints and indexes
    await pool.query(`
      DO $$ 
      BEGIN
        -- Add foreign key constraint if it doesn't exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'voiceovers__locales' 
            AND constraint_name = 'voiceovers__locales__parent_id_fkey'
          ) THEN
            ALTER TABLE voiceovers__locales 
              ADD CONSTRAINT voiceovers__locales__parent_id_fkey 
              FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
          END IF;
        END IF;
      END $$;
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_parent 
        ON voiceovers__locales(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_locale 
        ON voiceovers__locales(_locale);
      CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_parent_locale 
        ON voiceovers__locales(_parent_id, _locale);
    `);

    console.log('✅ voiceovers__locales table ready\n');

    // 2. Check voiceovers_additional_photos table
    console.log('📸 Ensuring voiceovers_additional_photos table...');
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

    // Add constraints
    await pool.query(`
      DO $$ 
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'voiceovers_additional_photos' 
            AND constraint_name = 'voiceovers_additional_photos__parent_id_fkey'
          ) THEN
            ALTER TABLE voiceovers_additional_photos 
              ADD CONSTRAINT voiceovers_additional_photos__parent_id_fkey 
              FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
          END IF;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'media') THEN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'voiceovers_additional_photos' 
            AND constraint_name = 'voiceovers_additional_photos_photo_id_fkey'
          ) THEN
            ALTER TABLE voiceovers_additional_photos 
              ADD CONSTRAINT voiceovers_additional_photos_photo_id_fkey 
              FOREIGN KEY (photo_id) REFERENCES media(id) ON DELETE SET NULL;
          END IF;
        END IF;
      END $$;
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_parent 
        ON voiceovers_additional_photos(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_order 
        ON voiceovers_additional_photos(_order);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_photo 
        ON voiceovers_additional_photos(photo_id);
    `);

    console.log('✅ voiceovers_additional_photos table ready\n');

    // 3. Check voiceovers_style_tags table
    console.log('🏷️  Ensuring voiceovers_style_tags table...');
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

    // Add constraint
    await pool.query(`
      DO $$ 
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'voiceovers_style_tags' 
            AND constraint_name = 'voiceovers_style_tags__parent_id_fkey'
          ) THEN
            ALTER TABLE voiceovers_style_tags 
              ADD CONSTRAINT voiceovers_style_tags__parent_id_fkey 
              FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
          END IF;
        END IF;
      END $$;
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_parent 
        ON voiceovers_style_tags(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_order 
        ON voiceovers_style_tags(_order);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_tag 
        ON voiceovers_style_tags(tag);
    `);

    console.log('✅ voiceovers_style_tags table ready\n');

    // 4. Check for other potential localized collections
    console.log('🔍 Checking other potentially localized collections...');

    // Based on common Payload patterns, check these collections
    const potentialLocalizedCollections = [
      'pages',
      'blog_posts',
      'testimonials',
      'faq',
      'email_templates',
    ];

    for (const collection of potentialLocalizedCollections) {
      const singleName = `${collection}_locales`;
      const doubleName = `${collection}__locales`;

      const single = await pool.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        );
      `,
        [singleName]
      );

      const double = await pool.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        );
      `,
        [doubleName]
      );

      if (single.rows[0].exists && !double.rows[0].exists) {
        console.log(`📝 Found ${singleName}, might need renaming to ${doubleName}`);
        // Don't auto-rename these as they might not be localized
      }
    }

    // 5. Verify the main voiceovers table structure
    console.log('\n📋 Verifying voiceovers table structure...');
    const voiceoverColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'voiceovers'
      ORDER BY ordinal_position;
    `);

    if (voiceoverColumns.rows.length > 0) {
      console.log('Columns in voiceovers table:');
      voiceoverColumns.rows.forEach((col) => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    }

    // 6. Final verification
    console.log('\n🔍 Final schema verification...');

    // Check that voiceovers__locales has the description column
    const descCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'voiceovers__locales' 
        AND column_name = 'description'
      );
    `);

    if (descCheck.rows[0].exists) {
      console.log('✅ voiceovers__locales.description column exists');
    } else {
      console.log('❌ voiceovers__locales.description column missing!');

      // Add it if missing
      await pool.query(`
        ALTER TABLE voiceovers__locales 
        ADD COLUMN IF NOT EXISTS description text;
      `);
      console.log('✅ Added description column to voiceovers__locales');
    }

    console.log('\n🎉 Schema migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    console.error('Full error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration
runCompleteMigration()
  .then(() => {
    console.log('\n✨ Database schema is ready for Payload CMS!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
