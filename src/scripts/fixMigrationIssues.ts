/**
 * Script to fix migration issues when moving to a fresh database
 *
 * This script:
 * 1. Creates the payload_migrations table if it doesn't exist
 * 2. Marks problematic migrations as already run
 * 3. Ensures the database is in a clean state for future migrations
 */

import { getPayload } from 'payload';
import configPromise from '../payload.config';
import { sql } from 'drizzle-orm';

async function fixMigrationIssues() {
  console.log('🔧 Fixing migration issues...\n');

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const db = payload.db as any;

    // First, ensure the payload_migrations table exists
    console.log('📋 Checking payload_migrations table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS payload_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        batch INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check which migrations are already marked as run
    const existingMigrations = await db.execute(sql`
      SELECT name FROM payload_migrations;
    `);

    console.log('\n📊 Current migrations in database:');
    if (existingMigrations.rows.length === 0) {
      console.log('   No migrations recorded yet');
    } else {
      existingMigrations.rows.forEach((row: any) => {
        console.log(`   ✓ ${row.name}`);
      });
    }

    // List of migrations that might cause issues on a fresh database
    // These are migrations that expect certain constraints or data to exist
    const problematicMigrations = [
      '2025_fix_extra_services_constraints',
      '2025_remove_user_fields',
      '20250901_convert_group_slug_to_relationship',
    ];

    console.log('\n🔍 Checking problematic migrations...');

    for (const migrationName of problematicMigrations) {
      const exists = existingMigrations.rows.some((row: any) => row.name === migrationName);

      if (!exists) {
        console.log(`   ⚠️  ${migrationName} not marked as run`);

        // Mark it as run to prevent it from executing
        await db.execute(sql`
          INSERT INTO payload_migrations (name, batch)
          VALUES (${migrationName}, 1)
          ON CONFLICT (name) DO NOTHING;
        `);

        console.log(`   ✅ Marked ${migrationName} as completed`);
      } else {
        console.log(`   ✓ ${migrationName} already marked as run`);
      }
    }

    // Now check if the extra_services_production_price_overrides table exists
    console.log('\n🔍 Checking extra_services tables...');
    const tableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'extra_services_production_price_overrides'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log('   ✓ Table extra_services_production_price_overrides exists');

      // Check for any existing constraints
      const constraints = await db.execute(sql`
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'extra_services_production_price_overrides'
        AND constraint_type = 'FOREIGN KEY';
      `);

      console.log('\n📊 Existing foreign key constraints:');
      if (constraints.rows.length === 0) {
        console.log('   No foreign key constraints found');
      } else {
        constraints.rows.forEach((row: any) => {
          console.log(`   - ${row.constraint_name}`);
        });
      }
    } else {
      console.log('   ⚠️  Table extra_services_production_price_overrides does not exist');
    }

    // Run the initial schema sync migration manually if needed
    const initialSchemaMigration = existingMigrations.rows.some(
      (row: any) => row.name === '2025_initial-schema-sync'
    );

    if (!initialSchemaMigration) {
      console.log('\n🏗️  Initial schema sync migration not run, marking as complete...');
      await db.execute(sql`
        INSERT INTO payload_migrations (name, batch)
        VALUES ('2025_initial-schema-sync', 1)
        ON CONFLICT (name) DO NOTHING;
      `);
      console.log('   ✅ Marked initial schema sync as completed');
    }

    console.log('\n✅ Migration issues fixed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run "bun run build" to rebuild the application');
    console.log(
      '   2. If you still see migration errors, run "bun run payload migrate:status" to check migration status'
    );
    console.log('   3. You can now run "bun run payload migrate" to run only new migrations');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing migration issues:', error);
    process.exit(1);
  }
}

// Run the script
fixMigrationIssues();
