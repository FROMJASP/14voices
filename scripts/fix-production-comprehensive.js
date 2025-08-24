#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Comprehensive Production Fix Script
 *
 * This script addresses critical production issues:
 * 1. Payload CMS localization table naming mismatch
 *
 * Note: Previously this script also overwrote the import map to remove S3,
 * but this was causing issues when S3/MinIO is properly configured.
 * The import map is now handled by generate-importmap.js which correctly
 * detects S3 configuration and includes/excludes the handler as needed.
 */

const { Pool } = require('pg');
const path = require('path');

console.log('🚨 Comprehensive Production Fix Script Starting...\n');

async function fixDatabaseLocalizationIssue() {
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

  console.log('🔧 Part 1: Fixing Database Localization Issue...\n');

  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Check current state of tables
    console.log('📋 Checking current table state...');

    const doubleUnderscoreExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers__locales'
      );
    `);

    const singleUnderscoreExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers_locales'
      );
    `);

    console.log(
      `- voiceovers__locales (double underscore) exists: ${doubleUnderscoreExists.rows[0].exists}`
    );
    console.log(
      `- voiceovers_locales (single underscore) exists: ${singleUnderscoreExists.rows[0].exists}`
    );

    // Strategy: Create a view that maps single underscore to double underscore
    // This way Payload can query using single underscore, but data is stored with double
    if (doubleUnderscoreExists.rows[0].exists && !singleUnderscoreExists.rows[0].exists) {
      console.log('\n📋 Creating view to map single underscore to double underscore...');

      // Drop view if exists
      await pool.query(`DROP VIEW IF EXISTS voiceovers_locales CASCADE;`);

      // Create view
      await pool.query(`
        CREATE VIEW voiceovers_locales AS 
        SELECT * FROM voiceovers__locales;
      `);

      console.log('✅ Created view voiceovers_locales -> voiceovers__locales');

      // Also create insert/update/delete rules for the view
      await pool.query(`
        CREATE OR REPLACE RULE voiceovers_locales_insert AS
        ON INSERT TO voiceovers_locales
        DO INSTEAD
        INSERT INTO voiceovers__locales (name, description, _locale, _parent_id, created_at, updated_at)
        VALUES (NEW.name, NEW.description, NEW._locale, NEW._parent_id, NEW.created_at, NEW.updated_at)
        RETURNING *;
      `);

      await pool.query(`
        CREATE OR REPLACE RULE voiceovers_locales_update AS
        ON UPDATE TO voiceovers_locales
        DO INSTEAD
        UPDATE voiceovers__locales
        SET name = NEW.name,
            description = NEW.description,
            _locale = NEW._locale,
            _parent_id = NEW._parent_id,
            updated_at = NEW.updated_at
        WHERE id = OLD.id
        RETURNING *;
      `);

      await pool.query(`
        CREATE OR REPLACE RULE voiceovers_locales_delete AS
        ON DELETE TO voiceovers_locales
        DO INSTEAD
        DELETE FROM voiceovers__locales
        WHERE id = OLD.id
        RETURNING *;
      `);

      console.log('✅ Created insert/update/delete rules for view');
    } else if (!doubleUnderscoreExists.rows[0].exists && singleUnderscoreExists.rows[0].exists) {
      // If only single underscore exists, rename it to double
      console.log('\n📋 Renaming single underscore table to double underscore...');
      await pool.query(`ALTER TABLE voiceovers_locales RENAME TO voiceovers__locales;`);

      // Update constraints
      await pool.query(`
        ALTER TABLE voiceovers__locales 
        RENAME CONSTRAINT voiceovers_locales__parent_id_fkey 
        TO voiceovers__locales__parent_id_fkey;
      `);

      // Then create the view
      await pool.query(`
        CREATE VIEW voiceovers_locales AS 
        SELECT * FROM voiceovers__locales;
      `);

      console.log('✅ Renamed table and created compatibility view');
    }

    // Also check and fix other localized collections
    const localizedCollections = [
      'pages',
      'blog_posts',
      'scripts',
      'forms',
      'faq',
      'email_templates',
    ];

    for (const collection of localizedCollections) {
      const doubleTable = `${collection}__locales`;
      const singleTable = `${collection}_locales`;

      const doubleExists = await pool.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        );
      `,
        [doubleTable]
      );

      const singleExists = await pool.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        );
      `,
        [singleTable]
      );

      if (doubleExists.rows[0].exists && !singleExists.rows[0].exists) {
        console.log(`\n📋 Creating view for ${collection}...`);

        await pool.query(`DROP VIEW IF EXISTS ${singleTable} CASCADE;`);
        await pool.query(`
          CREATE VIEW ${singleTable} AS 
          SELECT * FROM ${doubleTable};
        `);

        console.log(`✅ Created view ${singleTable} -> ${doubleTable}`);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Database error:', error.message);
    return false;
  } finally {
    await pool.end();
  }
}

async function fixImportMapComprehensive() {
  console.log('\n🔧 Part 2: Import Map Check...\n');

  try {
    const importMapPath = path.join(process.cwd(), 'src/app/(payload)/admin/importMap.js');

    // Check if import map exists
    const fs = require('fs');
    if (fs.existsSync(importMapPath)) {
      console.log('✅ Import map exists at:', importMapPath);
      console.log('✅ Keeping existing import map generated by generate-importmap.js');
      console.log('   (The import map already handles S3 configuration appropriately)');
    } else {
      console.log('⚠️  Import map not found, it will be generated by generate-importmap.js');
    }

    // DO NOT overwrite the import map anymore
    // The generate-importmap.js script handles S3 configuration correctly

    return true;
  } catch (error) {
    console.error('❌ Import map check error:', error.message);
    return false;
  }
}

async function fixServerComponentsRenderError() {
  // Import the fix functions
  const { fixProductionRenderError } = require('./fix-production-render-error');
  const { fixAdminCreation } = require('./fix-admin-creation');

  try {
    console.log('\n🔧 Part 3: Fixing Server Components Render Error...\n');
    await fixProductionRenderError();

    console.log('\n🔧 Part 4: Fixing Admin User Creation...\n');
    await fixAdminCreation();

    return true;
  } catch (error) {
    console.error('❌ Error fixing server components:', error.message);
    return false;
  }
}

async function runComprehensiveFixes() {
  console.log('Environment check:');
  console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
  console.log();

  let success = true;

  // Fix database localization issue
  const dbFixed = await fixDatabaseLocalizationIssue();
  if (!dbFixed) {
    console.error('⚠️  Database fixes failed, but continuing...');
    success = false;
  }

  // Fix import map
  const importFixed = await fixImportMapComprehensive();
  if (!importFixed) {
    console.error('⚠️  Import map fixes failed');
    success = false;
  }

  // Fix server components render error and admin creation
  const serverFixed = await fixServerComponentsRenderError();
  if (!serverFixed) {
    console.error('⚠️  Server components fixes failed, but continuing...');
    success = false;
  }

  console.log('\n' + '='.repeat(50));
  if (success) {
    console.log('✅ All fixes applied successfully!');
    console.log('\nThe application should now work properly.');
  } else {
    console.log('⚠️  Some fixes failed, but the application may still work');
    console.log('\nPlease check the errors above and restart the application');
  }

  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Run the fixes
runComprehensiveFixes().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
