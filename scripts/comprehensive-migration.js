#!/usr/bin/env node

/**
 * Comprehensive Database Migration Script
 * Handles all edge cases and can be run multiple times safely
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse database connection from DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
  process.exit(1);
}

// Extract connection details
const urlPattern = /postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^:\/]+)(?::(\d+))?\/([^?]+)/;
const match = DATABASE_URL.match(urlPattern);

if (!match) {
  console.error('❌ Invalid DATABASE_URL format');
  process.exit(1);
}

const [, user, password, host, port = '5432', database] = match;

console.log('🚀 Starting comprehensive database migration...');
console.log(`📊 Database connection:`);
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   Database: ${database}`);
console.log(`   User: ${user}`);

// Helper function to run SQL commands
function runSQL(sql, description, ignoreErrors = false) {
  try {
    console.log(`\n🔧 ${description}...`);
    const result = execSync(
      `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -c "${sql.replace(/"/g, '\\"')}" 2>&1`,
      { encoding: 'utf8' }
    );
    console.log('✅ Success');
    return { success: true, result };
  } catch (error) {
    if (!ignoreErrors) {
      console.error(`❌ Failed: ${error.message}`);
    } else {
      console.log(`⚠️  ${description} had issues, but continuing...`);
    }
    return { success: false, error: error.message };
  }
}

// Helper function to check if table exists
function tableExists(tableName) {
  try {
    const result = execSync(
      `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '${tableName}');" 2>&1`,
      { encoding: 'utf8' }
    );
    return result.toString().trim().includes('t');
  } catch (error) {
    return false;
  }
}

// Helper function to check if column exists
function columnExists(tableName, columnName) {
  try {
    const result = execSync(
      `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -t -c "SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${tableName}' AND column_name = '${columnName}');" 2>&1`,
      { encoding: 'utf8' }
    );
    return result.toString().trim().includes('t');
  } catch (error) {
    return false;
  }
}

// Main migration logic
async function runMigration() {
  const migrationResults = {
    successful: 0,
    failed: 0,
    skipped: 0
  };

  // 1. Create essential tables if they don't exist
  console.log('\n📋 Step 1: Creating essential tables...');
  
  // Users table
  if (!tableExists('users')) {
    const createUsersSQL = `
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        salt VARCHAR(255),
        hash VARCHAR(255),
        reset_password_token VARCHAR(255),
        reset_password_expiration TIMESTAMP,
        lock_until TIMESTAMP,
        login_attempts INT DEFAULT 0,
        enable_api BOOLEAN DEFAULT false,
        api_key VARCHAR(255) UNIQUE,
        api_key_index VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    const result = runSQL(createUsersSQL, 'Creating users table');
    result.success ? migrationResults.successful++ : migrationResults.failed++;
  } else {
    console.log('✅ Table users already exists');
    migrationResults.skipped++;
  }

  // Payload tables
  const payloadTables = [
    {
      name: 'payload_preferences',
      sql: `
        CREATE TABLE payload_preferences (
          id SERIAL PRIMARY KEY,
          key VARCHAR(255) UNIQUE NOT NULL,
          value JSONB,
          relation_to VARCHAR(255),
          relation_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    },
    {
      name: 'payload_migrations',
      sql: `
        CREATE TABLE payload_migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          batch INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    }
  ];

  for (const table of payloadTables) {
    if (!tableExists(table.name)) {
      const result = runSQL(table.sql, `Creating ${table.name} table`);
      result.success ? migrationResults.successful++ : migrationResults.failed++;
    } else {
      console.log(`✅ Table ${table.name} already exists`);
      migrationResults.skipped++;
    }
  }

  // 2. Fix column naming (camelCase to snake_case)
  console.log('\n📋 Step 2: Fixing column naming conventions...');
  
  // Run the comprehensive column naming fix
  const columnFixSQL = fs.readFileSync(
    path.join(__dirname, 'fix-column-naming.sql'),
    'utf8'
  ).replace(/\n/g, ' ');
  
  const columnFixResult = runSQL(columnFixSQL, 'Fixing column naming', true);
  columnFixResult.success ? migrationResults.successful++ : migrationResults.failed++;

  // 3. Add missing columns to users table
  console.log('\n📋 Step 3: Adding missing columns to users table...');
  
  const userColumns = [
    { name: 'reset_password_token', type: 'VARCHAR(255)' },
    { name: 'reset_password_expiration', type: 'TIMESTAMP' },
    { name: 'salt', type: 'VARCHAR(255)' },
    { name: 'hash', type: 'VARCHAR(255)' },
    { name: 'lock_until', type: 'TIMESTAMP' },
    { name: 'login_attempts', type: 'INT DEFAULT 0' },
    { name: 'enable_api', type: 'BOOLEAN DEFAULT false' },
    { name: 'api_key', type: 'VARCHAR(255)' },
    { name: 'api_key_index', type: 'VARCHAR(255)' },
    { name: 'created_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
    { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' }
  ];

  for (const column of userColumns) {
    if (!columnExists('users', column.name)) {
      const result = runSQL(
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS ${column.name} ${column.type};`,
        `Adding column ${column.name}`,
        true
      );
      result.success ? migrationResults.successful++ : migrationResults.failed++;
    } else {
      migrationResults.skipped++;
    }
  }

  // 4. Create indexes
  console.log('\n📋 Step 4: Creating indexes...');
  
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',
    'CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_password_token);',
    'CREATE INDEX IF NOT EXISTS idx_users_api_key ON users(api_key);',
    'CREATE INDEX IF NOT EXISTS idx_payload_preferences_key ON payload_preferences(key);',
    'CREATE INDEX IF NOT EXISTS idx_payload_migrations_name ON payload_migrations(name);'
  ];

  for (const indexSQL of indexes) {
    const result = runSQL(indexSQL, 'Creating index', true);
    result.success ? migrationResults.successful++ : migrationResults.failed++;
  }

  // 5. Verify critical columns exist
  console.log('\n📋 Step 5: Verifying critical columns...');
  
  const criticalColumns = [
    'reset_password_token',
    'reset_password_expiration',
    'salt',
    'hash'
  ];

  let allColumnsOk = true;
  for (const column of criticalColumns) {
    if (columnExists('users', column)) {
      console.log(`✅ Column users.${column} exists`);
    } else {
      console.log(`❌ Column users.${column} is missing`);
      allColumnsOk = false;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Migration Summary:');
  console.log(`✅ Successful operations: ${migrationResults.successful}`);
  console.log(`⚠️  Failed operations: ${migrationResults.failed}`);
  console.log(`⏭️  Skipped operations: ${migrationResults.skipped}`);
  console.log('='.repeat(50));

  if (allColumnsOk) {
    console.log('\n🎉 All critical database structures are in place!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some critical columns are still missing.');
    console.log('💡 Payload CMS will attempt to create them on startup.');
    process.exit(1);
  }
}

// Create the SQL file for column fixes if it doesn't exist
const sqlFilePath = path.join(__dirname, 'fix-column-naming.sql');
if (!fs.existsSync(sqlFilePath)) {
  const sqlContent = `
DO $$
DECLARE
  table_exists boolean;
BEGIN
  -- Check if users table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) INTO table_exists;
  
  IF table_exists THEN
    -- Add missing auth columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='reset_password_token') THEN
      ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='reset_password_expiration') THEN
      ALTER TABLE users ADD COLUMN reset_password_expiration TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='salt') THEN
      ALTER TABLE users ADD COLUMN salt VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='hash') THEN
      ALTER TABLE users ADD COLUMN hash VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='lock_until') THEN
      ALTER TABLE users ADD COLUMN lock_until TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='login_attempts') THEN
      ALTER TABLE users ADD COLUMN login_attempts INT DEFAULT 0;
    END IF;
  END IF;
END
$$;
  `;
  
  fs.writeFileSync(sqlFilePath, sqlContent.trim());
}

// Run the migration
runMigration().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});