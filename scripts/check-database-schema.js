#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Database Schema Health Check
 *
 * This script checks the database schema for common issues after migrating
 * from Neon to self-hosted PostgreSQL.
 *
 * Usage: node scripts/check-database-schema.js
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
  console.log('⏭️  Skipping checks for build environment');
  process.exit(0);
}

console.log('🔍 Starting database schema health check...\n');

async function checkDatabaseSchema() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  let hasIssues = false;

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // 1. Check for required tables
    console.log('📋 Checking required tables...');
    const requiredTables = [
      'users',
      'media',
      'cohorts',
      'voiceovers',
      'voiceovers__locales',
      'voiceovers_additional_photos',
      'voiceovers_style_tags',
      'bookings',
      'scripts',
      'invoices',
      'blog_posts',
      'pages',
      'forms',
      'form_submissions',
      'testimonials',
      'faq',
      'email_components',
      'email_templates',
      'email_sequences',
      'email_logs',
      'email_jobs',
      'email_campaigns',
      'email_audiences',
      'email_contacts',
      'security_logs',
      'payload_migrations',
      'payload_preferences',
    ];

    for (const table of requiredTables) {
      const result = await pool.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        );
      `,
        [table]
      );

      if (!result.rows[0].exists) {
        console.log(`❌ Missing table: ${table}`);
        hasIssues = true;
      } else {
        console.log(`✅ Table exists: ${table}`);
      }
    }

    console.log('');

    // 2. Check voiceovers__locales table structure
    console.log('🔍 Checking voiceovers__locales table structure...');
    const voiceoverLocalesCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'voiceovers__locales'
      ORDER BY ordinal_position;
    `);

    if (voiceoverLocalesCheck.rows.length > 0) {
      console.log('Columns in voiceovers__locales:');
      const expectedColumns = [
        'id',
        'name',
        'description',
        '_locale',
        '_parent_id',
        'created_at',
        'updated_at',
      ];

      voiceoverLocalesCheck.rows.forEach((col) => {
        console.log(
          `  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`
        );
      });

      // Check for missing columns
      const actualColumns = voiceoverLocalesCheck.rows.map((r) => r.column_name);
      const missingColumns = expectedColumns.filter((col) => !actualColumns.includes(col));

      if (missingColumns.length > 0) {
        console.log(`\n❌ Missing columns in voiceovers__locales: ${missingColumns.join(', ')}`);
        hasIssues = true;
      }
    } else {
      console.log('❌ voiceovers__locales table not found or empty');
      hasIssues = true;
    }

    console.log('');

    // 3. Check for wrong table names (single underscore instead of double)
    console.log('🔍 Checking for incorrectly named locales tables...');
    const wrongLocalesTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE '%_locales' 
        AND table_name NOT LIKE '%__locales'
        AND table_schema = 'public';
    `);

    if (wrongLocalesTables.rows.length > 0) {
      console.log('❌ Found tables with single underscore (should be double):');
      wrongLocalesTables.rows.forEach((row) => {
        console.log(
          `  - ${row.table_name} → should be ${row.table_name.replace('_locales', '__locales')}`
        );
      });
      hasIssues = true;
    } else {
      console.log('✅ All locales tables use correct double underscore naming');
    }

    console.log('');

    // 4. Check foreign key relationships
    console.log('🔗 Checking foreign key relationships...');
    const fkCheck = await pool.query(`
      SELECT
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS referenced_table_name,
        ccu.column_name AS referenced_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name IN ('voiceovers__locales', 'voiceovers_additional_photos', 'voiceovers_style_tags')
      ORDER BY tc.table_name;
    `);

    if (fkCheck.rows.length > 0) {
      console.log('Foreign keys found:');
      fkCheck.rows.forEach((fk) => {
        console.log(
          `  ✅ ${fk.table_name}.${fk.column_name} → ${fk.referenced_table_name}.${fk.referenced_column_name}`
        );
      });
    } else {
      console.log('⚠️  No foreign keys found for voiceovers relationship tables');
    }

    console.log('');

    // 5. Check indexes
    console.log('📊 Checking indexes on voiceovers tables...');
    const indexCheck = await pool.query(`
      SELECT
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename IN ('voiceovers', 'voiceovers__locales', 'voiceovers_additional_photos', 'voiceovers_style_tags')
      ORDER BY tablename, indexname;
    `);

    if (indexCheck.rows.length > 0) {
      let currentTable = '';
      indexCheck.rows.forEach((idx) => {
        if (currentTable !== idx.tablename) {
          currentTable = idx.tablename;
          console.log(`\n  Table: ${idx.tablename}`);
        }
        console.log(`    ✅ ${idx.indexname}`);
      });
    } else {
      console.log('⚠️  No indexes found on voiceovers tables');
    }

    console.log('\n');

    // Summary
    if (hasIssues) {
      console.log('❌ Schema issues detected! Run the following to fix:');
      console.log('   1. node scripts/fix-voiceovers-locales.js');
      console.log('   2. node scripts/payload-migrate.js');
    } else {
      console.log('✅ Database schema looks healthy!');
    }
  } catch (error) {
    console.error('❌ Check error:', error.message);
    hasIssues = true;
  } finally {
    await pool.end();
  }

  return !hasIssues;
}

// Run the check
checkDatabaseSchema()
  .then((isHealthy) => {
    if (isHealthy) {
      console.log('\n✨ Database schema is ready!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Database schema needs attention');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ Check failed:', error);
    process.exit(1);
  });
