#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Database Diagnostic Script
 *
 * Quick diagnostic to check the current state of the database
 * and identify missing tables or columns.
 *
 * Usage: node scripts/diagnose-database.js
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
  console.log('⏭️  Skipping diagnosis for build environment');
  process.exit(0);
}

console.log('🔍 Running database diagnostics...\n');

async function diagnoseDatabace() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful\n');

    // 1. Check for critical tables
    console.log('📊 Checking critical tables:');
    console.log('----------------------------');

    const criticalTables = [
      { name: 'voiceovers', type: 'Main collection' },
      { name: 'voiceovers__locales', type: 'Locales (double underscore)' },
      { name: 'voiceovers_locales', type: 'Locales (single underscore - WRONG)' },
      { name: 'voiceovers_additional_photos', type: 'Relationship' },
      { name: 'voiceovers_style_tags', type: 'Relationship' },
      { name: 'media', type: 'Upload collection' },
      { name: 'users', type: 'Auth collection' },
      { name: 'payload_migrations', type: 'System' },
      { name: 'payload_preferences', type: 'System' },
    ];

    for (const table of criticalTables) {
      const result = await pool.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1 AND table_schema = 'public'
        ) as exists,
        (
          SELECT COUNT(*) FROM information_schema.columns 
          WHERE table_name = $1 AND table_schema = 'public'
        ) as column_count;
      `,
        [table.name]
      );

      const exists = result.rows[0].exists;
      const columnCount = result.rows[0].column_count;

      if (exists) {
        console.log(`  ✅ ${table.name} (${table.type}) - ${columnCount} columns`);
      } else {
        console.log(`  ❌ ${table.name} (${table.type}) - MISSING`);
      }
    }

    console.log('\n');

    // 2. Check voiceovers table columns
    console.log('🎤 Checking voiceovers table structure:');
    console.log('--------------------------------------');

    const voiceoverColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'voiceovers' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);

    if (voiceoverColumns.rows.length > 0) {
      console.log('  Columns found:');

      const importantColumns = [
        'full_demo_reel_id',
        'commercials_demo_id',
        'narrative_demo_id',
        'profile_photo_id',
        'slug',
        'status',
        'cohort_id',
      ];

      voiceoverColumns.rows.forEach((col) => {
        const isImportant = importantColumns.includes(col.column_name);
        const marker = isImportant ? '⭐' : '  ';
        console.log(`  ${marker} ${col.column_name} (${col.data_type})`);
      });

      // Check for missing important columns
      const foundColumns = voiceoverColumns.rows.map((r) => r.column_name);
      const missingColumns = importantColumns.filter((c) => !foundColumns.includes(c));

      if (missingColumns.length > 0) {
        console.log('\n  ❌ Missing important columns:');
        missingColumns.forEach((col) => {
          console.log(`     - ${col}`);
        });
      }
    } else {
      console.log('  ❌ Table not found or has no columns');
    }

    console.log('\n');

    // 3. Check for all locales tables
    console.log('🌍 Checking all locales tables:');
    console.log('------------------------------');

    const localesTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND (table_name LIKE '%_locales' OR table_name LIKE '%__locales')
      ORDER BY table_name;
    `);

    if (localesTables.rows.length > 0) {
      localesTables.rows.forEach((row) => {
        const isDouble = row.table_name.includes('__locales');
        const marker = isDouble ? '✅' : '⚠️ ';
        const note = isDouble ? '(correct)' : '(should be double underscore)';
        console.log(`  ${marker} ${row.table_name} ${note}`);
      });
    } else {
      console.log('  ❌ No locales tables found');
    }

    console.log('\n');

    // 4. Check foreign key constraints
    console.log('🔗 Checking foreign key constraints:');
    console.log('-----------------------------------');

    const constraints = await pool.query(`
      SELECT 
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_schema = 'public'
        AND tc.table_name LIKE 'voiceovers%'
      ORDER BY tc.table_name, tc.constraint_name;
    `);

    if (constraints.rows.length > 0) {
      constraints.rows.forEach((row) => {
        console.log(
          `  ✅ ${row.table_name}.${row.column_name} → ${row.foreign_table_name}.${row.foreign_column_name}`
        );
      });
    } else {
      console.log('  ⚠️  No foreign key constraints found for voiceovers tables');
    }

    console.log('\n');

    // 5. Check indexes
    console.log('🚀 Checking performance indexes:');
    console.log('-------------------------------');

    const indexes = await pool.query(`
      SELECT 
        tablename,
        indexname,
        pg_size_pretty(pg_relation_size(indexname::regclass)) as size
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND tablename LIKE 'voiceovers%'
      ORDER BY tablename, indexname;
    `);

    if (indexes.rows.length > 0) {
      let currentTable = '';
      indexes.rows.forEach((row) => {
        if (row.tablename !== currentTable) {
          currentTable = row.tablename;
          console.log(`\n  ${row.tablename}:`);
        }
        console.log(`    - ${row.indexname} (${row.size})`);
      });
    } else {
      console.log('  ⚠️  No indexes found for voiceovers tables');
    }

    console.log('\n');

    // 6. Summary and recommendations
    console.log('📋 Summary and Recommendations:');
    console.log('------------------------------');

    // Count issues
    let issues = [];

    // Check for wrong locale table names
    const wrongLocales = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE '%_locales' 
        AND table_name NOT LIKE '%__locales';
    `);

    if (wrongLocales.rows[0].count > 0) {
      issues.push(
        `${wrongLocales.rows[0].count} locale tables with single underscore (should be double)`
      );
    }

    // Check for missing voiceovers__locales
    const hasVoiceoversLocales = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers__locales' AND table_schema = 'public'
      );
    `);

    if (!hasVoiceoversLocales.rows[0].exists) {
      issues.push('Missing voiceovers__locales table');
    }

    // Check for missing columns
    if (voiceoverColumns.rows.length > 0) {
      const foundColumns = voiceoverColumns.rows.map((r) => r.column_name);
      const missingImportant = [
        'full_demo_reel_id',
        'commercials_demo_id',
        'narrative_demo_id',
        'profile_photo_id',
      ].filter((c) => !foundColumns.includes(c));

      if (missingImportant.length > 0) {
        issues.push(`Missing ${missingImportant.length} upload columns in voiceovers table`);
      }
    }

    if (issues.length === 0) {
      console.log('  ✅ No critical issues found!');
      console.log('  Database appears to be properly configured.');
    } else {
      console.log('  ❌ Issues found:');
      issues.forEach((issue, i) => {
        console.log(`     ${i + 1}. ${issue}`);
      });
      console.log('\n  🔧 To fix these issues, run:');
      console.log('     docker exec -it <container> /app/scripts/fix-production-all-in-one.sh');
    }

    console.log('\n✨ Diagnostics completed!');
  } catch (error) {
    console.error('❌ Diagnostic error:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run diagnostics
diagnoseDatabace()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Diagnostics failed:', error);
    process.exit(1);
  });
