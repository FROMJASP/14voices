#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Fix Production Issues Script
 *
 * This script addresses two critical production issues:
 * 1. Missing voiceovers__locales table (double underscore naming)
 * 2. S3ClientUploadHandler import error when S3 is not configured
 *
 * Run this script in production to fix the issues immediately.
 *
 * Usage: node scripts/fix-production-issues.js
 */

const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

console.log('🚨 Production Fix Script Starting...\n');

async function fixDatabaseSchema() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not found');
    return false;
  }

  // Don't run on fake build database
  if (DATABASE_URL.includes('fake:fake@fake')) {
    console.log('⏭️  Skipping for build environment');
    return true;
  }

  console.log('🔧 Part 1: Fixing Database Schema...\n');

  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // 1. Create voiceovers__locales table with double underscore
    console.log('📋 Creating voiceovers__locales table...');

    // First check if it exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers__locales'
      );
    `);

    if (!tableExists.rows[0].exists) {
      // Create the table
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

      // Add foreign key constraint
      await pool.query(`
        ALTER TABLE voiceovers__locales 
        ADD CONSTRAINT voiceovers__locales__parent_id_fkey 
        FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
      `);

      // Create indexes
      await pool.query(`
        CREATE INDEX idx_voiceovers__locales_parent 
          ON voiceovers__locales(_parent_id);
        CREATE INDEX idx_voiceovers__locales_locale 
          ON voiceovers__locales(_locale);
        CREATE INDEX idx_voiceovers__locales_parent_locale 
          ON voiceovers__locales(_parent_id, _locale);
      `);

      console.log('✅ voiceovers__locales table created successfully');

      // Copy data from single underscore table if it exists
      const singleExists = await pool.query(`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = 'voiceovers_locales'
        );
      `);

      if (singleExists.rows[0].exists) {
        console.log('📋 Migrating data from voiceovers_locales...');
        await pool.query(`
          INSERT INTO voiceovers__locales (name, description, _locale, _parent_id, created_at, updated_at)
          SELECT name, description, _locale, _parent_id, created_at, updated_at
          FROM voiceovers_locales;
        `);

        // Drop the old table
        await pool.query(`DROP TABLE IF EXISTS voiceovers_locales CASCADE;`);
        console.log('✅ Data migrated and old table removed');
      }
    } else {
      console.log('✅ voiceovers__locales table already exists');
    }

    // 2. Ensure other required tables exist
    console.log('\n📋 Ensuring other required tables...');

    // voiceovers_additional_photos
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

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_parent 
        ON voiceovers_additional_photos(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_order 
        ON voiceovers_additional_photos(_order);
    `);

    // voiceovers_style_tags
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

    console.log('✅ All required tables verified\n');

    return true;
  } catch (error) {
    console.error('❌ Database error:', error.message);
    return false;
  } finally {
    await pool.end();
  }
}

async function fixImportMap() {
  console.log('🔧 Part 2: Fixing Import Map...\n');

  try {
    const importMapPath = path.join(process.cwd(), 'src/app/(payload)/admin/importMap.js');

    // Check if file exists
    try {
      await fs.access(importMapPath);
    } catch {
      console.log('⚠️  Import map file not found, creating minimal version...');

      // Create a minimal import map without S3
      const minimalImportMap = `// Minimal import map for production
export const importMap = {};
`;

      // Ensure directory exists
      const dir = path.dirname(importMapPath);
      await fs.mkdir(dir, { recursive: true });

      await fs.writeFile(importMapPath, minimalImportMap, 'utf8');
      console.log('✅ Created minimal import map');
      return true;
    }

    // Read the import map
    let content = await fs.readFile(importMapPath, 'utf8');

    // Check if S3 is configured properly
    const hasValidS3 =
      process.env.S3_ACCESS_KEY &&
      process.env.S3_SECRET_KEY &&
      process.env.S3_ACCESS_KEY !== 'dummy' &&
      process.env.S3_SECRET_KEY !== 'dummy' &&
      !process.env.S3_ACCESS_KEY.includes('dummy-s3');

    if (!hasValidS3 && content.includes('S3ClientUploadHandler')) {
      console.log('🔄 Removing S3ClientUploadHandler from import map...');

      // Remove the import line
      content = content.replace(
        /import\s*{\s*S3ClientUploadHandler[^}]*}\s*from\s*['"]@payloadcms\/storage-s3\/client['"]\s*;?\s*\n/g,
        ''
      );

      // Remove from the export map
      content = content.replace(
        /\s*["']@payloadcms\/storage-s3\/client#S3ClientUploadHandler["']\s*:\s*S3ClientUploadHandler[^,\n]*,?\s*/g,
        ''
      );

      // Clean up any trailing commas
      content = content.replace(/,(\s*})/, '$1');

      await fs.writeFile(importMapPath, content, 'utf8');
      console.log('✅ Import map updated successfully');
    } else if (hasValidS3) {
      console.log('✅ S3 is properly configured, import map is correct');
    } else {
      console.log('✅ Import map does not contain S3ClientUploadHandler');
    }

    return true;
  } catch (error) {
    console.error('❌ Import map error:', error.message);
    return false;
  }
}

async function runFixes() {
  console.log('Environment check:');
  console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
  console.log(`- S3_ACCESS_KEY: ${process.env.S3_ACCESS_KEY || 'Not set'}`);
  console.log(`- S3_SECRET_KEY: ${process.env.S3_SECRET_KEY ? 'Set' : 'Not set'}`);
  console.log();

  let success = true;

  // Fix database schema
  const dbFixed = await fixDatabaseSchema();
  if (!dbFixed) {
    console.error('⚠️  Database fixes failed, but continuing...');
    success = false;
  }

  // Fix import map
  const importFixed = await fixImportMap();
  if (!importFixed) {
    console.error('⚠️  Import map fixes failed');
    success = false;
  }

  console.log('\n' + '='.repeat(50));
  if (success) {
    console.log('✅ All fixes applied successfully!');
    console.log('\nNext steps:');
    console.log('1. Restart the application');
    console.log('2. Test the homepage and admin panel');
  } else {
    console.log('⚠️  Some fixes failed, but the application may still work');
    console.log('\nPlease check the errors above and restart the application');
  }

  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Run the fixes
runFixes().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
