#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not found in environment variables');
  process.exit(1);
}

console.log('🔧 Creating missing tables for Payload CMS...\n');

async function createMissingTables() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Create voiceovers_additional_photos table
    const createAdditionalPhotosTable = `
      CREATE TABLE IF NOT EXISTS voiceovers_additional_photos (
        id SERIAL PRIMARY KEY,
        _order integer NOT NULL,
        _parent_id integer REFERENCES voiceovers(id) ON DELETE CASCADE,
        photo_id integer REFERENCES media(id),
        caption text,
        _uuid text,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_parent 
        ON voiceovers_additional_photos(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_order 
        ON voiceovers_additional_photos(_order);
    `;

    console.log('Creating voiceovers_additional_photos table...');
    await pool.query(createAdditionalPhotosTable);
    console.log('✅ voiceovers_additional_photos table created');

    // Create voiceovers_style_tags table
    const createStyleTagsTable = `
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
      
      CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_parent 
        ON voiceovers_style_tags(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_order 
        ON voiceovers_style_tags(_order);
    `;

    console.log('Creating voiceovers_style_tags table...');
    await pool.query(createStyleTagsTable);
    console.log('✅ voiceovers_style_tags table created');

    // Create voiceovers_locales table
    const createLocalesTable = `
      CREATE TABLE IF NOT EXISTS voiceovers_locales (
        id SERIAL PRIMARY KEY,
        name text,
        description text,
        _locale text NOT NULL,
        _parent_id integer REFERENCES voiceovers(id) ON DELETE CASCADE,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_voiceovers_locales_parent 
        ON voiceovers_locales(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_locales_locale 
        ON voiceovers_locales(_locale);
    `;

    console.log('Creating voiceovers_locales table...');
    await pool.query(createLocalesTable);
    console.log('✅ voiceovers_locales table created');

    console.log('\n✅ All missing tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the script
createMissingTables()
  .then(() => {
    console.log('\n🎉 Database tables created successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed to create tables:', error);
    process.exit(1);
  });
