#!/usr/bin/env node

/**
 * Migration script to add missing status column to pages table
 * This fixes the error: "column pages.status does not exist"
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');

// Database connection from environment
const database =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  'postgresql://postgres:postgres@localhost:5432/14voices';

// Parse connection string
const url = new URL(database);
const user = url.username;
const password = url.password;
const host = url.hostname;
const port = url.port || 5432;
const dbname = url.pathname.slice(1);

// Set password for psql commands
process.env.PGPASSWORD = password;

function runQuery(query, ignoreError = false) {
  try {
    const result = execSync(
      `psql -h ${host} -p ${port} -U ${user} -d ${dbname} -c "${query}" 2>&1`,
      { encoding: 'utf8' }
    );
    console.log(`✅ Query executed: ${query.substring(0, 60)}...`);
    return result;
  } catch (error) {
    if (!ignoreError) {
      console.error(`❌ Query failed: ${query}`);
      console.error(`Error: ${error.message}`);
    }
    return null;
  }
}

function columnExists(tableName, columnName) {
  try {
    const result = execSync(
      `psql -h ${host} -p ${port} -U ${user} -d ${dbname} -t -c "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '${tableName}' AND column_name = '${columnName}');" 2>&1`,
      { encoding: 'utf8' }
    );
    return result.toString().trim().includes('t');
  } catch {
    return false;
  }
}

console.log('🔧 Starting pages table migration...');
console.log(`📦 Database: ${dbname}`);
console.log(`🏠 Host: ${host}:${port}`);

// Check if pages table exists
const tablesResult = runQuery(
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pages';",
  true
);

if (!tablesResult || !tablesResult.includes('pages')) {
  console.log('⚠️  Pages table does not exist yet. It will be created when Payload initializes.');
  process.exit(0);
}

console.log('✅ Pages table exists');

// Check and add status column
if (!columnExists('pages', 'status')) {
  console.log('Adding status column to pages table...');
  runQuery("ALTER TABLE pages ADD COLUMN status VARCHAR(50) DEFAULT 'draft' NOT NULL;");

  // Create index on status for performance
  runQuery('CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);');
} else {
  console.log('✅ Status column already exists in pages table');
}

// Check and add other potentially missing columns
const columnsToCheck = [
  { name: 'published_date', type: 'TIMESTAMPTZ', default: 'CURRENT_TIMESTAMP' },
  { name: 'show_in_nav', type: 'BOOLEAN', default: 'true' },
  { name: 'nav_order', type: 'INTEGER', default: '0' },
];

for (const column of columnsToCheck) {
  if (!columnExists('pages', column.name)) {
    console.log(`Adding ${column.name} column to pages table...`);
    runQuery(
      `ALTER TABLE pages ADD COLUMN ${column.name} ${column.type} DEFAULT ${column.default};`
    );
  } else {
    console.log(`✅ ${column.name} column already exists`);
  }
}

// Update any NULL status values to 'draft'
runQuery("UPDATE pages SET status = 'draft' WHERE status IS NULL;", true);

console.log('✅ Pages table migration completed successfully!');

// Clean up
delete process.env.PGPASSWORD;
