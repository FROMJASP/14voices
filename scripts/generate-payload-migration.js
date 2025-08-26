#!/usr/bin/env node
/**
 * Payload Migration Generator
 * 
 * Creates a new Payload migration file for schema changes.
 * This should be used when you need custom migrations beyond
 * what Payload's automatic schema sync provides.
 * 
 * Usage: node scripts/generate-payload-migration.js <migration-name>
 */

const fs = require('fs');
const path = require('path');

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('❌ Please provide a migration name');
  console.log('Usage: node scripts/generate-payload-migration.js <migration-name>');
  process.exit(1);
}

// Sanitize migration name
const safeName = migrationName
  .toLowerCase()
  .replace(/[^a-z0-9-_]/g, '-')
  .replace(/-+/g, '-');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const fileName = `${timestamp}_${safeName}.ts`;
const filePath = path.join(process.cwd(), 'src', 'migrations', fileName);

// Ensure migrations directory exists
const migrationsDir = path.dirname(filePath);
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const migrationTemplate = `import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

/**
 * Migration: ${safeName}
 * Generated: ${new Date().toISOString()}
 * 
 * Description: [Add description of what this migration does]
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Add your migration logic here
  // Example: Adding a new column
  /*
  await db.execute(sql\`
    ALTER TABLE your_table 
    ADD COLUMN IF NOT EXISTS new_column VARCHAR(255)
  \`);
  */
  
  // You can also use Payload's API if needed
  // const users = await payload.find({ collection: 'users' });
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Add your rollback logic here (optional)
  // This is rarely used in production but included for completeness
  /*
  await db.execute(sql\`
    ALTER TABLE your_table 
    DROP COLUMN IF EXISTS new_column
  \`);
  */
}
`;

try {
  fs.writeFileSync(filePath, migrationTemplate);
  console.log(`✅ Created migration: ${fileName}`);
  console.log(`📁 Location: ${filePath}`);
  console.log('\nNext steps:');
  console.log('1. Edit the migration file to add your schema changes');
  console.log('2. Run: bun payload migrate');
} catch (error) {
  console.error('❌ Failed to create migration:', error.message);
  process.exit(1);
}