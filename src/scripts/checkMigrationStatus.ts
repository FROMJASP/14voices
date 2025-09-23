/**
 * Script to check the current migration status and database state
 */

import { getPayload } from 'payload';
import configPromise from '../payload.config';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function checkMigrationStatus() {
  console.log('🔍 Checking migration status and database state...\n');

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const db = payload.db as any;

    // 1. Check if payload_migrations table exists
    console.log('📋 Checking payload_migrations table...');
    const migrationTableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'payload_migrations'
      );
    `);

    if (!migrationTableExists.rows[0].exists) {
      console.log('   ❌ payload_migrations table does not exist');
      console.log('   Run the fixMigrationIssues.ts script first!');
      process.exit(1);
    } else {
      console.log('   ✓ payload_migrations table exists');
    }

    // 2. List all migrations in the database
    const dbMigrations = await db.execute(sql`
      SELECT name, batch, created_at 
      FROM payload_migrations 
      ORDER BY batch, created_at;
    `);

    console.log('\n📊 Migrations recorded in database:');
    if (dbMigrations.rows.length === 0) {
      console.log('   No migrations recorded');
    } else {
      dbMigrations.rows.forEach((row: any) => {
        console.log(
          `   ✓ ${row.name} (batch: ${row.batch}, created: ${new Date(row.created_at).toLocaleString()})`
        );
      });
    }

    // 3. List all migration files
    const migrationsDir = path.join(process.cwd(), 'src/migrations');
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.ts'))
      .map((file) => file.replace('.ts', ''));

    console.log('\n📁 Migration files in src/migrations:');
    migrationFiles.forEach((file) => {
      const isRun = dbMigrations.rows.some((row: any) => row.name === file);
      console.log(`   ${isRun ? '✓' : '○'} ${file}`);
    });

    // 4. Check for unrun migrations
    const unrunMigrations = migrationFiles.filter(
      (file) => !dbMigrations.rows.some((row: any) => row.name === file)
    );

    if (unrunMigrations.length > 0) {
      console.log('\n⚠️  Unrun migrations:');
      unrunMigrations.forEach((migration) => {
        console.log(`   - ${migration}`);
      });
    } else {
      console.log('\n✅ All migration files are marked as run');
    }

    // 5. Check specific problematic tables
    console.log('\n🔍 Checking database tables...');

    const tablesToCheck = [
      'extra_services_production_price_overrides',
      'productions',
      'extra_services',
      'users',
      'pages',
      'payload_migrations',
    ];

    for (const tableName of tablesToCheck) {
      const tableExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${tableName}
        );
      `);

      console.log(`   ${tableExists.rows[0].exists ? '✓' : '❌'} ${tableName}`);
    }

    // 6. Check constraints on extra_services_production_price_overrides if it exists
    const extraServicesTableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'extra_services_production_price_overrides'
      );
    `);

    if (extraServicesTableExists.rows[0].exists) {
      console.log('\n📊 Constraints on extra_services_production_price_overrides:');

      const constraints = await db.execute(sql`
        SELECT 
          constraint_name,
          constraint_type
        FROM information_schema.table_constraints 
        WHERE table_name = 'extra_services_production_price_overrides'
        ORDER BY constraint_type, constraint_name;
      `);

      if (constraints.rows.length === 0) {
        console.log('   No constraints found');
      } else {
        constraints.rows.forEach((row: any) => {
          console.log(`   - ${row.constraint_type}: ${row.constraint_name}`);
        });
      }
    }

    console.log('\n✅ Migration status check complete!');
  } catch (error) {
    console.error('❌ Error checking migration status:', error);
    process.exit(1);
  }
}

// Run the script
checkMigrationStatus();
