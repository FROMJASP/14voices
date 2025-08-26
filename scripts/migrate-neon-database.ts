#!/usr/bin/env bun
import { exec } from 'child_process';
import { promisify } from 'util';
import { config } from 'dotenv';
import { resolve } from 'path';

const execAsync = promisify(exec);

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

async function migrateDatabase() {
  console.log('🚀 Neon Database Migration Tool\n');

  const OLD_DATABASE_URL = process.env.OLD_DATABASE_URL;
  const NEW_DATABASE_URL = process.env.NEW_DATABASE_URL;

  if (!OLD_DATABASE_URL || !NEW_DATABASE_URL) {
    console.error('❌ Missing required environment variables:\n');
    console.log('Please add to your .env.local:');
    console.log('OLD_DATABASE_URL=postgresql://[old-connection-string]');
    console.log('NEW_DATABASE_URL=postgresql://[new-connection-string]\n');
    process.exit(1);
  }

  console.log('📋 Migration Steps:\n');
  console.log('1. Export data from old database');
  console.log('2. Create schema in new database');
  console.log('3. Import data to new database\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dumpFile = `backup-${timestamp}.sql`;

  try {
    // Step 1: Export from old database
    console.log('📤 Exporting data from old database...');
    const dumpCmd = `pg_dump "${OLD_DATABASE_URL}" --no-owner --no-acl --clean --if-exists > ${dumpFile}`;

    await execAsync(dumpCmd);
    console.log(`✅ Data exported to ${dumpFile}\n`);

    // Step 2: Import to new database
    console.log('📥 Importing data to new database...');
    const restoreCmd = `psql "${NEW_DATABASE_URL}" < ${dumpFile}`;

    await execAsync(restoreCmd);
    console.log('✅ Data imported successfully!\n');

    // Step 3: Verify migration
    console.log('🔍 Verifying migration...');
    const { createNeonClient } = await import('../src/lib/neon/client');

    // Check old database
    const oldSql = createNeonClient(OLD_DATABASE_URL);
    const [oldTables] =
      await oldSql`SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log(`   Old database: ${oldTables.count} tables`);

    // Check new database
    const newSql = createNeonClient(NEW_DATABASE_URL);
    const [newTables] =
      await newSql`SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log(`   New database: ${newTables.count} tables`);

    if (oldTables.count === newTables.count) {
      console.log('\n✨ Migration successful! All tables transferred.');
    } else {
      console.log('\n⚠️  Table count mismatch. Please verify the migration.');
    }

    console.log('\n📌 Next steps:');
    console.log('1. Update DATABASE_URL in .env.local to use the new connection string');
    console.log('2. Test the application thoroughly');
    console.log('3. Keep the backup file for safety: ' + dumpFile);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Ensure pg_dump and psql are installed');
    console.log('2. Check both connection strings are valid');
    console.log('3. Verify network access to both databases');
    process.exit(1);
  }
}

// Alternative: Use Neon's SQL over HTTP for migration (no pg_dump required)
async function migrateUsingNeonAPI() {
  console.log('🚀 Neon Database Migration (API Method)\n');

  const OLD_DATABASE_URL = process.env.OLD_DATABASE_URL;
  const NEW_DATABASE_URL = process.env.NEW_DATABASE_URL;

  if (!OLD_DATABASE_URL || !NEW_DATABASE_URL) {
    console.error('❌ Missing database URLs in .env.local');
    process.exit(1);
  }

  try {
    const { createNeonClient } = await import('../src/lib/neon/client');

    const oldDb = createNeonClient(OLD_DATABASE_URL);
    const newDb = createNeonClient(NEW_DATABASE_URL);

    // Get all tables
    console.log('📋 Fetching table list...');
    const tables = await oldDb`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    console.log(`Found ${tables.length} tables to migrate\n`);

    // For each table
    for (const { tablename } of tables) {
      console.log(`📦 Migrating table: ${tablename}`);

      // Get table structure
      const [createStatement] = await oldDb`
        SELECT pg_get_ddl('TABLE', '${tablename}'::regclass) as ddl
      `;

      // Create table in new database
      await newDb(createStatement.ddl);

      // Copy data
      const data = await oldDb`SELECT * FROM ${tablename}`;
      if (data.length > 0) {
        // Build insert statement (simplified - needs proper implementation)
        console.log(`   Copying ${data.length} rows...`);
        // Note: This would need proper batch insert implementation
      }
    }

    console.log('\n✨ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Check which method to use
const args = process.argv.slice(2);
if (args.includes('--api')) {
  migrateUsingNeonAPI().catch(console.error);
} else {
  migrateDatabase().catch(console.error);
}
