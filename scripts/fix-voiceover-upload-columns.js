#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Fix Missing Voiceover Upload Columns
 *
 * This script adds the missing upload relationship columns to the voiceovers table.
 * These columns are required for Payload CMS to properly handle upload fields.
 *
 * Missing columns:
 * - full_demo_reel_id (for fullDemoReel field)
 * - commercials_demo_id (for commercialsDemo field)
 * - narrative_demo_id (for narrativeDemo field)
 *
 * Usage: node scripts/fix-voiceover-upload-columns.js
 */

const { Pool } = require('pg');

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL not found in environment variables');
  process.exit(1);
}

// Don't run migrations on fake build database
if (DATABASE_URL.includes('fake:fake@fake')) {
  console.log('⏭️  Skipping migrations for build environment');
  process.exit(0);
}

console.log('🚀 Starting voiceover upload columns fix...\n');

async function fixVoiceoverUploadColumns() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Check if voiceovers table exists
    const voiceoversExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers'
      );
    `);

    if (!voiceoversExists.rows[0].exists) {
      console.log('⚠️  Voiceovers table does not exist. Run main migrations first.');
      process.exit(1);
    }

    // Check which columns currently exist
    const existingColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'voiceovers' 
      AND column_name IN ('full_demo_reel_id', 'commercials_demo_id', 'narrative_demo_id');
    `);

    const existingColumnNames = existingColumns.rows.map((row) => row.column_name);

    console.log('📊 Current upload column status:');
    console.log(
      `   full_demo_reel_id exists: ${existingColumnNames.includes('full_demo_reel_id')}`
    );
    console.log(
      `   commercials_demo_id exists: ${existingColumnNames.includes('commercials_demo_id')}`
    );
    console.log(
      `   narrative_demo_id exists: ${existingColumnNames.includes('narrative_demo_id')}\n`
    );

    // Add missing columns
    const columnsToAdd = [
      { field: 'full_demo_reel_id', description: 'Full demo reel audio file reference' },
      { field: 'commercials_demo_id', description: 'Commercials demo audio file reference' },
      { field: 'narrative_demo_id', description: 'Narrative demo audio file reference' },
    ];

    for (const { field, description } of columnsToAdd) {
      if (!existingColumnNames.includes(field)) {
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
      } else {
        console.log(`ℹ️  Column ${field} already exists, skipping`);
      }
    }

    // Add foreign key constraints to media table if it exists
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
        // Check if constraint already exists
        const constraintExists = await pool.query(
          `
          SELECT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'voiceovers' 
            AND constraint_name = $1
          );
        `,
          [constraint]
        );

        if (!constraintExists.rows[0].exists) {
          await pool.query(`
            ALTER TABLE voiceovers 
            ADD CONSTRAINT ${constraint} 
            FOREIGN KEY (${column}) REFERENCES media(id) ON DELETE SET NULL;
          `);
          console.log(`✅ Added foreign key constraint for ${column}`);
        } else {
          console.log(`ℹ️  Foreign key constraint for ${column} already exists`);
        }
      }
    } else {
      console.log('⚠️  Media table not found, skipping foreign key constraints');
    }

    // Create indexes for performance
    console.log('\n📊 Creating indexes...');
    const indexes = ['full_demo_reel_id', 'commercials_demo_id', 'narrative_demo_id'];

    for (const column of indexes) {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_voiceovers_${column} 
        ON voiceovers(${column});
      `);
      console.log(`✅ Created index for ${column}`);
    }

    console.log('\n🎉 All voiceover upload column fixes completed successfully!');

    // Verify the fix
    const finalCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'voiceovers' 
      AND column_name IN ('full_demo_reel_id', 'commercials_demo_id', 'narrative_demo_id');
    `);

    console.log('\n✅ Final verification:');
    finalCheck.rows.forEach((row) => {
      console.log(`   ${row.column_name} ✓`);
    });
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the fix
fixVoiceoverUploadColumns()
  .then(() => {
    console.log('\n✨ Voiceover upload columns fixed successfully!');
    console.log('\n🔄 Next steps:');
    console.log('   1. Deploy the application');
    console.log('   2. Verify voiceover pages load correctly');
    console.log('   3. Test voiceover admin functionality');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
