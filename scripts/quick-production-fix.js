#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Quick production fix
 *
 * Creates voiceovers_locales as a copy or alias of voiceovers__locales
 * to satisfy Payload's query expectations
 */

const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function quickFix() {
  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Check current state
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

    // If we have double but not single, copy it
    if (hasDouble && !hasSingle) {
      console.log('\n📝 Creating voiceovers_locales from voiceovers__locales...');

      // Create table with same structure
      await pool.query(`
        CREATE TABLE voiceovers_locales AS 
        SELECT * FROM voiceovers__locales;
      `);

      // Add primary key
      await pool.query(`
        ALTER TABLE voiceovers_locales 
        ADD PRIMARY KEY (id);
      `);

      // Add foreign key
      await pool.query(`
        ALTER TABLE voiceovers_locales 
        ADD CONSTRAINT voiceovers_locales__parent_id_fkey 
        FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
      `);

      // Add indexes
      await pool.query(`
        CREATE INDEX idx_voiceovers_locales_parent 
          ON voiceovers_locales(_parent_id);
        CREATE INDEX idx_voiceovers_locales_locale 
          ON voiceovers_locales(_locale);
      `);

      console.log('✅ Created voiceovers_locales table');
    }

    // If neither exists, create single underscore version
    else if (!hasSingle && !hasDouble) {
      console.log('\n📝 Creating voiceovers_locales table...');

      await pool.query(`
        CREATE TABLE voiceovers_locales (
          id SERIAL PRIMARY KEY,
          name text,
          description text,
          _locale text NOT NULL,
          _parent_id integer,
          created_at timestamp DEFAULT CURRENT_TIMESTAMP,
          updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT voiceovers_locales__parent_id_fkey 
            FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE
        );
      `);

      await pool.query(`
        CREATE INDEX idx_voiceovers_locales_parent 
          ON voiceovers_locales(_parent_id);
        CREATE INDEX idx_voiceovers_locales_locale 
          ON voiceovers_locales(_locale);
      `);

      console.log('✅ Created voiceovers_locales table');
    }

    console.log('\n🎉 Quick fix completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

quickFix()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
