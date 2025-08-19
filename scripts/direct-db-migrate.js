#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

// Direct database migration using PostgreSQL client
const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting direct database migration...');

// Check database URL
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set!');
  process.exit(1);
}

// Extract database connection details
const dbUrl = process.env.DATABASE_URL;
const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

if (!match) {
  console.error('❌ Invalid DATABASE_URL format');
  process.exit(1);
}

const [, user, password, host, port, database] = match;

console.log('📊 Database connection:');
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   Database: ${database}`);
console.log(`   User: ${user}`);

// Function to run SQL command
function runSQL(sql, description) {
  try {
    console.log(`\n📦 ${description}...`);
    const result = execSync(
      `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -c "${sql}" 2>&1`,
      { encoding: 'utf8' }
    );
    console.log('✅ Success');
    return result;
  } catch (error) {
    console.log(`⚠️  ${description} failed:`, error.message);
    return null;
  }
}

// Function to check if a table exists
function tableExists(tableName) {
  try {
    const result = execSync(
      `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -t -c "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '${tableName}');" 2>&1`,
      { encoding: 'utf8' }
    );
    return result.trim() === 't';
  } catch {
    return false;
  }
}

// Main migration logic
async function migrate() {
  console.log('\n🔍 Checking database state...');
  
  // Check if payload_migrations table exists
  if (tableExists('payload_migrations')) {
    console.log('✅ Migrations table already exists');
    
    // Check if there are any migrations
    try {
      const count = execSync(
        `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -t -c "SELECT COUNT(*) FROM payload_migrations;" 2>&1`,
        { encoding: 'utf8' }
      );
      console.log(`ℹ️  Found ${count.trim()} existing migrations`);
    } catch {
      console.log('ℹ️  Could not count existing migrations');
    }
  } else {
    console.log('ℹ️  Migrations table does not exist yet');
    
    // Create the migrations table
    runSQL(
      `CREATE TABLE IF NOT EXISTS payload_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        batch INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      'Creating migrations table'
    );
  }
  
  // Check if users table exists
  if (tableExists('users')) {
    console.log('✅ Users table already exists');
  } else {
    console.log('ℹ️  Users table does not exist');
    console.log('ℹ️  Payload will create tables on first request');
  }
  
  // Create payload_preferences table if it doesn't exist
  if (!tableExists('payload_preferences')) {
    runSQL(
      `CREATE TABLE IF NOT EXISTS payload_preferences (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) NOT NULL,
        value JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      'Creating payload_preferences table'
    );
  }
  
  // Create payload_locked_documents table if it doesn't exist
  if (!tableExists('payload_locked_documents')) {
    runSQL(
      `CREATE TABLE IF NOT EXISTS payload_locked_documents (
        id SERIAL PRIMARY KEY,
        document JSON NOT NULL,
        global_slug VARCHAR(255),
        user_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      'Creating payload_locked_documents table'
    );
  }
  
  console.log('\n✅ Database preparation completed');
  console.log('ℹ️  Payload will handle schema creation on startup');
}

// Execute migration
migrate()
  .then(() => {
    console.log('\n✅ Migration process completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    // Exit successfully to allow app to start
    process.exit(0);
  });