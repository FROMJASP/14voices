#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Verify Database Schema
 *
 * This script checks the current state of the database schema
 * and reports on locales tables and their structure.
 *
 * Usage: node scripts/verify-database-schema.js
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
  console.log('⏭️  Skipping for build environment');
  process.exit(0);
}

console.log('🔍 Verifying database schema...\n');

async function verifySchema() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Check for all locales tables
    console.log('📊 Checking locales tables...\n');

    const localesTables = await pool.query(`
      SELECT 
        table_name,
        CASE 
          WHEN table_name LIKE '%__locales' THEN 'double underscore'
          WHEN table_name LIKE '%_locales' THEN 'single underscore'
        END as type
      FROM information_schema.tables 
      WHERE (table_name LIKE '%_locales' OR table_name LIKE '%__locales')
        AND table_schema = 'public'
      ORDER BY table_name;
    `);

    if (localesTables.rows.length === 0) {
      console.log('❌ No locales tables found!');
    } else {
      console.log('Found locales tables:');
      localesTables.rows.forEach((row) => {
        console.log(`   - ${row.table_name} (${row.type})`);
      });
    }

    // Check voiceovers table specifically
    console.log('\n📋 Checking voiceovers tables specifically...\n');

    const voiceoversTables = await pool.query(`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_name IN ('voiceovers', 'voiceovers_locales', 'voiceovers__locales')
        AND table_schema = 'public';
    `);

    voiceoversTables.rows.forEach((row) => {
      console.log(`Table: ${row.table_name}`);
      console.log(`   Columns: ${row.column_count}`);
    });

    // Check voiceovers_locales structure if it exists
    const localesStructure = await pool.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name IN ('voiceovers_locales', 'voiceovers__locales')
        AND table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);

    if (localesStructure.rows.length > 0) {
      console.log('\n📐 Locales table structure:');
      let currentTable = '';
      localesStructure.rows.forEach((row) => {
        if (currentTable !== row.table_name) {
          currentTable = row.table_name;
          console.log(`\nTable: ${currentTable}`);
        }
        console.log(
          `   - ${row.column_name} (${row.data_type}) ${row.is_nullable === 'NO' ? 'NOT NULL' : ''}`
        );
      });
    }

    // Check for any foreign key constraints
    console.log('\n🔗 Checking foreign key constraints...\n');

    const foreignKeys = await pool.query(`
      SELECT 
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name LIKE '%voiceovers%locales%';
    `);

    if (foreignKeys.rows.length > 0) {
      console.log('Foreign keys found:');
      foreignKeys.rows.forEach((row) => {
        console.log(
          `   - ${row.table_name}.${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name}`
        );
      });
    } else {
      console.log('No foreign keys found for voiceovers locales tables');
    }

    console.log('\n✅ Schema verification complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run verification
verifySchema()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  });
