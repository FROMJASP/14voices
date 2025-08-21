#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Comprehensive Production Database Fix
 *
 * This script fixes the main production deployment issues:
 * 1. Missing voiceover upload columns (full_demo_reel_id, commercials_demo_id, narrative_demo_id)
 * 2. Incorrect locales table naming (single vs double underscores)
 *
 * This script should be run immediately to fix the production deployment.
 *
 * Usage: node scripts/fix-production-database.js
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

console.log('🚀 Starting comprehensive production database fix...\n');
console.log('🎯 This will fix the main deployment issues:');
console.log('   1. Missing voiceover upload columns');
console.log('   2. Incorrect locales table naming\n');

async function fixProductionDatabase() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // ===================================================================
    // PART 1: FIX MISSING VOICEOVER UPLOAD COLUMNS
    // ===================================================================

    console.log('🎵 PART 1: Fixing voiceover upload columns...\n');

    // Check if voiceovers table exists
    const voiceoversExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers'
      );
    `);

    if (!voiceoversExists.rows[0].exists) {
      console.log(
        '⚠️  Voiceovers table does not exist. This indicates a more serious migration issue.'
      );
      console.log('   Run the main payload-migrate.js script first.');
      process.exit(1);
    }

    // Check which upload columns currently exist
    const existingUploadColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'voiceovers' 
      AND column_name IN ('full_demo_reel_id', 'commercials_demo_id', 'narrative_demo_id');
    `);

    const existingUploadNames = existingUploadColumns.rows.map((row) => row.column_name);

    console.log('📊 Upload column status:');
    console.log(
      `   full_demo_reel_id exists: ${existingUploadNames.includes('full_demo_reel_id')}`
    );
    console.log(
      `   commercials_demo_id exists: ${existingUploadNames.includes('commercials_demo_id')}`
    );
    console.log(
      `   narrative_demo_id exists: ${existingUploadNames.includes('narrative_demo_id')}\n`
    );

    // Add missing upload columns
    const uploadColumnsToAdd = [
      { field: 'full_demo_reel_id', description: 'Full demo reel audio file reference' },
      { field: 'commercials_demo_id', description: 'Commercials demo audio file reference' },
      { field: 'narrative_demo_id', description: 'Narrative demo audio file reference' },
    ];

    let columnsAdded = 0;
    for (const { field, description } of uploadColumnsToAdd) {
      if (!existingUploadNames.includes(field)) {
        console.log(`🔧 Adding column: ${field}...`);

        await pool.query(`
          ALTER TABLE voiceovers 
          ADD COLUMN ${field} integer;
        `);

        // Add comment for documentation
        await pool.query(`
          COMMENT ON COLUMN voiceovers.${field} IS '${description}';
        `);

        console.log(`✅ Added column: ${field}`);
        columnsAdded++;
      } else {
        console.log(`ℹ️  Column ${field} already exists, skipping`);
      }
    }

    // Add foreign key constraints to media table if it exists
    if (columnsAdded > 0) {
      console.log('\n🔗 Adding foreign key constraints...');

      const mediaExists = await pool.query(`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = 'media'
        );
      `);

      if (mediaExists.rows[0].exists) {
        const constraints = [
          { column: 'full_demo_reel_id', constraint: 'voiceovers_full_demo_reel_id_fkey' },
          { column: 'commercials_demo_id', constraint: 'voiceovers_commercials_demo_id_fkey' },
          { column: 'narrative_demo_id', constraint: 'voiceovers_narrative_demo_id_fkey' },
        ];

        for (const { column, constraint } of constraints) {
          // Only add constraint if column was just added
          if (!existingUploadNames.includes(column)) {
            await pool.query(`
              ALTER TABLE voiceovers 
              ADD CONSTRAINT ${constraint} 
              FOREIGN KEY (${column}) REFERENCES media(id) ON DELETE SET NULL;
            `);
            console.log(`✅ Added foreign key constraint for ${column}`);
          }
        }

        // Create indexes for performance
        console.log('\n📊 Creating indexes...');
        for (const { column } of constraints) {
          if (!existingUploadNames.includes(column)) {
            await pool.query(`
              CREATE INDEX IF NOT EXISTS idx_voiceovers_${column} 
              ON voiceovers(${column});
            `);
            console.log(`✅ Created index for ${column}`);
          }
        }
      } else {
        console.log('⚠️  Media table not found, skipping foreign key constraints');
      }
    }

    console.log('\n✅ PART 1 COMPLETED: Voiceover upload columns fixed\n');

    // ===================================================================
    // PART 2: FIX LOCALES TABLE NAMING
    // ===================================================================

    console.log('🌍 PART 2: Fixing locales table naming...\n');

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
      console.log(`Found ${singleUnderscoreTables.rows.length} locales tables to fix:\n`);

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

    console.log('✅ PART 2 COMPLETED: Locales table naming fixed\n');

    // ===================================================================
    // FINAL VERIFICATION
    // ===================================================================

    console.log('🔍 FINAL VERIFICATION:\n');

    // Verify upload columns
    const finalUploadCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'voiceovers' 
      AND column_name IN ('full_demo_reel_id', 'commercials_demo_id', 'narrative_demo_id')
      ORDER BY column_name;
    `);

    console.log('📊 Voiceover upload columns:');
    if (finalUploadCheck.rows.length === 3) {
      finalUploadCheck.rows.forEach((row) => {
        console.log(`   ✅ ${row.column_name}`);
      });
    } else {
      console.log('   ❌ Missing columns detected');
      const missing = ['full_demo_reel_id', 'commercials_demo_id', 'narrative_demo_id'].filter(
        (col) => !finalUploadCheck.rows.some((row) => row.column_name === col)
      );
      missing.forEach((col) => console.log(`   ❌ Missing: ${col}`));
    }

    // Verify locales tables
    const finalLocalesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE '%__locales' 
        AND table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\n🌍 Locales tables (double underscore):');
    if (finalLocalesCheck.rows.length > 0) {
      finalLocalesCheck.rows.forEach((row) => {
        console.log(`   ✅ ${row.table_name}`);
      });
    } else {
      console.log('   ℹ️  No locales tables found (this might be normal)');
    }

    // Check for any remaining single underscore locales tables
    const remainingIssues = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE '%_locales' 
        AND table_name NOT LIKE '%__locales'
        AND table_schema = 'public';
    `);

    if (remainingIssues.rows.length > 0) {
      console.log('\n⚠️  WARNING: Single underscore locales tables still exist:');
      remainingIssues.rows.forEach((row) => {
        console.log(`   ⚠️  ${row.table_name}`);
      });
    }

    console.log('\n🎉 Production database fix completed successfully!');

    if (finalUploadCheck.rows.length === 3 && remainingIssues.rows.length === 0) {
      console.log('\n🚀 Database is now ready for production deployment!');
      console.log('\n📋 Next steps:');
      console.log('   1. Redeploy the application');
      console.log('   2. Verify voiceover pages load correctly');
      console.log('   3. Test admin panel voiceover functionality');
      console.log('   4. Check for any remaining errors in logs');
    } else {
      console.log('\n⚠️  Some issues may remain - check the warnings above');
    }
  } catch (error) {
    console.error('❌ Fix error:', error.message);
    console.error('\n🔧 Troubleshooting tips:');
    console.error('   - Ensure DATABASE_URL is correct');
    console.error('   - Check if the database is accessible');
    console.error('   - Verify the database user has ALTER permissions');
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the comprehensive fix
fixProductionDatabase()
  .then(() => {
    console.log('\n✨ All production database issues fixed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Production fix failed:', error);
    console.error('\nThis likely means there are deeper database issues.');
    console.error('Contact the development team for assistance.');
    process.exit(1);
  });
