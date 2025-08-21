#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Fix All Locales Tables
 *
 * This script ensures all Payload CMS locales tables use double underscores (__).
 * It's designed to run after Payload migrations to fix any incorrectly named tables.
 *
 * Usage: node scripts/fix-all-locales-tables.js
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

console.log('🚀 Starting comprehensive locales table fix...\n');

async function fixAllLocalesTables() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Find all tables ending with _locales (single underscore)
    console.log('🔍 Searching for tables with single underscore _locales...');
    const singleUnderscoreTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE '%_locales' 
        AND table_name NOT LIKE '%__locales'
        AND table_schema = 'public'
      ORDER BY table_name;
    `);

    if (singleUnderscoreTables.rows.length === 0) {
      console.log('✅ No single underscore _locales tables found\n');
    } else {
      console.log(`Found ${singleUnderscoreTables.rows.length} tables to fix:\n`);

      for (const row of singleUnderscoreTables.rows) {
        const oldTableName = row.table_name;
        const newTableName = oldTableName.replace(/_locales$/, '__locales');

        console.log(`🔄 Processing ${oldTableName} -> ${newTableName}`);

        // Check if double underscore version already exists
        const doubleExists = await pool.query(
          `
          SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = $1
          );
        `,
          [newTableName]
        );

        if (doubleExists.rows[0].exists) {
          console.log(`   ⚠️  ${newTableName} already exists, removing ${oldTableName}...`);

          // Drop the single underscore version
          await pool.query(`DROP TABLE IF EXISTS ${oldTableName} CASCADE;`);
          console.log(`   ✅ Removed duplicate ${oldTableName}\n`);
        } else {
          console.log(`   📝 Renaming ${oldTableName} to ${newTableName}...`);

          // Get all constraints on the old table
          const constraints = await pool.query(
            `
            SELECT constraint_name, constraint_type
            FROM information_schema.table_constraints
            WHERE table_name = $1 AND constraint_type = 'FOREIGN KEY';
          `,
            [oldTableName]
          );

          // Drop foreign key constraints
          for (const constraint of constraints.rows) {
            await pool.query(`
              ALTER TABLE ${oldTableName} 
              DROP CONSTRAINT IF EXISTS ${constraint.constraint_name};
            `);
          }

          // Rename the table
          await pool.query(`ALTER TABLE ${oldTableName} RENAME TO ${newTableName};`);

          // Get all indexes on the renamed table
          const indexes = await pool.query(
            `
            SELECT indexname 
            FROM pg_indexes 
            WHERE tablename = $1 
              AND indexname LIKE '%_locales_%';
          `,
            [newTableName]
          );

          // Rename indexes
          for (const index of indexes.rows) {
            const newIndexName = index.indexname.replace(/_locales_/, '__locales_');
            if (newIndexName !== index.indexname) {
              await pool.query(`
                ALTER INDEX IF EXISTS ${index.indexname} 
                RENAME TO ${newIndexName};
              `);
            }
          }

          // Re-add foreign key constraint with new name
          const parentTable = newTableName.replace(/__locales$/, '');
          const parentExists = await pool.query(
            `
            SELECT EXISTS (
              SELECT 1 FROM information_schema.tables 
              WHERE table_name = $1
            );
          `,
            [parentTable]
          );

          if (parentExists.rows[0].exists) {
            await pool.query(`
              DO $$ 
              BEGIN
                IF NOT EXISTS (
                  SELECT 1 FROM information_schema.table_constraints 
                  WHERE table_name = '${newTableName}' 
                  AND constraint_name = '${newTableName}__parent_id_fkey'
                ) THEN
                  ALTER TABLE ${newTableName} 
                    ADD CONSTRAINT ${newTableName}__parent_id_fkey 
                    FOREIGN KEY (_parent_id) REFERENCES ${parentTable}(id) ON DELETE CASCADE;
                END IF;
              END $$;
            `);
          }

          console.log(`   ✅ Successfully renamed to ${newTableName}\n`);
        }
      }
    }

    // Verify all locales tables now use double underscores
    console.log('🔍 Verifying all locales tables use double underscores...');
    const allLocalesTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE '%__locales' 
        AND table_schema = 'public'
      ORDER BY table_name;
    `);

    if (allLocalesTables.rows.length > 0) {
      console.log('\n✅ Found the following correctly named locales tables:');
      allLocalesTables.rows.forEach((row) => {
        console.log(`   - ${row.table_name}`);
      });
    }

    // Final check for any remaining single underscore tables
    const remainingSingle = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE '%_locales' 
        AND table_name NOT LIKE '%__locales'
        AND table_schema = 'public';
    `);

    if (remainingSingle.rows.length > 0) {
      console.log('\n⚠️  WARNING: Still found single underscore tables:');
      remainingSingle.rows.forEach((row) => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('\n✅ All locales tables now use double underscores!');
    }

    console.log('\n🎉 Locales table fix completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the fix
fixAllLocalesTables()
  .then(() => {
    console.log('\n✨ Database schema fixed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
