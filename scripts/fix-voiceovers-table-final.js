#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Final fix for voiceovers table issues
 *
 * This script ensures voiceovers__locales exists with the proper structure
 * and that there's no conflicting voiceovers_locales table.
 */

const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function fixVoiceoversTable() {
  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Check for both tables
    const singleCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers_locales'
      );
    `);

    const doubleCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers__locales'
      );
    `);

    const hasSingle = singleCheck.rows[0].exists;
    const hasDouble = doubleCheck.rows[0].exists;

    console.log(`voiceovers_locales exists: ${hasSingle}`);
    console.log(`voiceovers__locales exists: ${hasDouble}`);

    // If we only have single underscore, rename it
    if (hasSingle && !hasDouble) {
      console.log('\n🔄 Renaming voiceovers_locales to voiceovers__locales...');

      await pool.query(`
        ALTER TABLE voiceovers_locales 
        DROP CONSTRAINT IF EXISTS voiceovers_locales__parent_id_fkey;
      `);

      await pool.query(`
        ALTER TABLE voiceovers_locales RENAME TO voiceovers__locales;
      `);

      await pool.query(`
        ALTER TABLE voiceovers__locales 
        ADD CONSTRAINT voiceovers__locales__parent_id_fkey 
        FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
      `);

      console.log('✅ Renamed successfully');
    }

    // If we have both, drop the single underscore version
    else if (hasSingle && hasDouble) {
      console.log('\n⚠️  Both tables exist, removing voiceovers_locales...');
      await pool.query(`DROP TABLE IF EXISTS voiceovers_locales CASCADE;`);
      console.log('✅ Removed duplicate table');
    }

    // If we have neither, create the double underscore version
    else if (!hasSingle && !hasDouble) {
      console.log('\n📝 Creating voiceovers__locales table...');

      await pool.query(`
        CREATE TABLE voiceovers__locales (
          id SERIAL PRIMARY KEY,
          name text,
          description text,
          _locale text NOT NULL,
          _parent_id integer,
          created_at timestamp DEFAULT CURRENT_TIMESTAMP,
          updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT voiceovers__locales__parent_id_fkey 
            FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE
        );
      `);

      await pool.query(`
        CREATE INDEX idx_voiceovers__locales_parent 
          ON voiceovers__locales(_parent_id);
        CREATE INDEX idx_voiceovers__locales_locale 
          ON voiceovers__locales(_locale);
      `);

      console.log('✅ Created voiceovers__locales table');
    }

    console.log('\n🎉 Voiceovers table fix completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

fixVoiceoversTable()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
