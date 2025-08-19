#!/usr/bin/env node

/**
 * Comprehensive database migration script for Payload CMS
 * Creates all necessary tables and columns based on Payload schema
 */

const { execSync } = require('child_process'); // eslint-disable-line @typescript-eslint/no-require-imports

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

console.log('📦 Starting comprehensive database migration...');
console.log(`📍 Host: ${host}`);
console.log(`📍 Database: ${database}`);
console.log(`📍 User: ${user}`);

function runSQL(sql, description) {
  try {
    console.log(`\n🔧 ${description}...`);
    const result = execSync(
      `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -c "${sql}" 2>&1`,
      { encoding: 'utf8' }
    );
    console.log('✅ Success');
    return result;
  } catch (error) {
    console.log(`⚠️  ${description} failed:`, error.message);
    // Don't exit on individual SQL failures - some operations might already exist
    return null;
  }
}

// Create essential tables
const migrations = [
  // 1. Create users table with all auth-related columns
  {
    description: 'Creating users table',
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        "resetPasswordToken" VARCHAR(255),
        "resetPasswordExpiration" TIMESTAMP,
        salt VARCHAR(255),
        hash VARCHAR(255),
        "lockUntil" TIMESTAMP,
        "loginAttempts" INT DEFAULT 0,
        name VARCHAR(255),
        avatar INT,
        "avatarColor" VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        role VARCHAR(50) DEFAULT 'user',
        department VARCHAR(100),
        "jobTitle" VARCHAR(255),
        phone VARCHAR(50),
        bio TEXT,
        timezone VARCHAR(100) DEFAULT 'Europe/Amsterdam',
        "socialLinks" JSONB,
        "preferredLanguage" VARCHAR(10) DEFAULT 'nl',
        "emailPreferences" JSONB,
        security JSONB,
        notifications JSONB,
        metadata JSONB,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },

  // 2. Create payload_preferences table
  {
    description: 'Creating payload_preferences table',
    sql: `
      CREATE TABLE IF NOT EXISTS payload_preferences (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255),
        value JSONB,
        "relationTo" VARCHAR(255),
        "relationId" INT,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },

  // 3. Create payload_migrations table
  {
    description: 'Creating payload_migrations table',
    sql: `
      CREATE TABLE IF NOT EXISTS payload_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        batch INT,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },

  // 4. Create media table
  {
    description: 'Creating media table',
    sql: `
      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        alt VARCHAR(255),
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        url VARCHAR(1000),
        "thumbnailURL" VARCHAR(1000),
        filename VARCHAR(255),
        "mimeType" VARCHAR(100),
        filesize INT,
        width INT,
        height INT,
        sizes JSONB,
        "focalX" INT,
        "focalY" INT
      );
    `,
  },

  // 5. Create pages table
  {
    description: 'Creating pages table',
    sql: `
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        slug VARCHAR(255) UNIQUE,
        status VARCHAR(50) DEFAULT 'draft',
        "publishedDate" TIMESTAMP,
        author INT,
        meta JSONB,
        "openGraph" JSONB,
        content JSONB,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },

  // 6. Create voiceovers table
  {
    description: 'Creating voiceovers table',
    sql: `
      CREATE TABLE IF NOT EXISTS voiceovers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        bio TEXT,
        "profilePhoto" INT,
        status VARCHAR(50) DEFAULT 'active',
        availability JSONB,
        "styleTags" JSONB,
        demos JSONB,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },

  // 7. Create productions table
  {
    description: 'Creating productions table',
    sql: `
      CREATE TABLE IF NOT EXISTS productions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        slug VARCHAR(255) UNIQUE,
        status VARCHAR(50) DEFAULT 'draft',
        "projectCode" VARCHAR(100),
        "clientName" VARCHAR(255),
        voiceover INT,
        "dateDelivered" TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },

  // 8. Create email_campaigns table
  {
    description: 'Creating email_campaigns table',
    sql: `
      CREATE TABLE IF NOT EXISTS email_campaigns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        subject VARCHAR(255),
        status VARCHAR(50) DEFAULT 'draft',
        "scheduledAt" TIMESTAMP,
        "sentAt" TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },

  // 9. Create contact_submissions table
  {
    description: 'Creating contact_submissions table',
    sql: `
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        company VARCHAR(255),
        message TEXT,
        status VARCHAR(50) DEFAULT 'unread',
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },

  // 10. Create demo_requests table
  {
    description: 'Creating demo_requests table',
    sql: `
      CREATE TABLE IF NOT EXISTS demo_requests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        company VARCHAR(255),
        "projectDetails" TEXT,
        "voiceoverInterest" JSONB,
        status VARCHAR(50) DEFAULT 'pending',
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },

  // 11. Add missing columns to users table (for auth)
  {
    description: 'Adding auth columns to users table',
    sql: `
      DO $$
      BEGIN
        -- Add reset password token if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='users' AND column_name='resetPasswordToken') THEN
          ALTER TABLE users ADD COLUMN "resetPasswordToken" VARCHAR(255);
        END IF;
        
        -- Add reset password expiration if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='users' AND column_name='resetPasswordExpiration') THEN
          ALTER TABLE users ADD COLUMN "resetPasswordExpiration" TIMESTAMP;
        END IF;
        
        -- Add salt if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='users' AND column_name='salt') THEN
          ALTER TABLE users ADD COLUMN salt VARCHAR(255);
        END IF;
        
        -- Add hash if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='users' AND column_name='hash') THEN
          ALTER TABLE users ADD COLUMN hash VARCHAR(255);
        END IF;
        
        -- Add lockUntil if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='users' AND column_name='lockUntil') THEN
          ALTER TABLE users ADD COLUMN "lockUntil" TIMESTAMP;
        END IF;
        
        -- Add loginAttempts if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='users' AND column_name='loginAttempts') THEN
          ALTER TABLE users ADD COLUMN "loginAttempts" INT DEFAULT 0;
        END IF;
      END
      $$;
    `,
  },

  // 12. Create indexes for performance
  {
    description: 'Creating indexes',
    sql: `
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users("resetPasswordToken");
      CREATE INDEX IF NOT EXISTS idx_voiceovers_slug ON voiceovers(slug);
      CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
      CREATE INDEX IF NOT EXISTS idx_productions_slug ON productions(slug);
    `,
  },
];

// Run all migrations
console.log('\n🚀 Running comprehensive database migrations...\n');

let successCount = 0;
let failCount = 0;

for (const migration of migrations) {
  const result = runSQL(migration.sql, migration.description);
  if (result !== null) {
    successCount++;
  } else {
    failCount++;
  }
}

console.log('\n📊 Migration Summary:');
console.log(`✅ Successful operations: ${successCount}`);
console.log(`⚠️  Failed operations: ${failCount}`);

// Check if critical tables exist
console.log('\n🔍 Verifying critical tables...');

const criticalTables = ['users', 'payload_preferences', 'payload_migrations'];
let allCriticalTablesExist = true;

for (const table of criticalTables) {
  try {
    const result = execSync(
      `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '${table}');" -t -A`,
      { encoding: 'utf8' }
    ).trim();

    if (result === 't') {
      console.log(`✅ Table '${table}' exists`);
    } else {
      console.log(`❌ Table '${table}' does not exist`);
      allCriticalTablesExist = false;
    }
  } catch {
    console.log(`❌ Failed to check table '${table}'`);
    allCriticalTablesExist = false;
  }
}

// Check for critical auth columns in users table
console.log('\n🔍 Verifying auth columns in users table...');

const authColumns = ['resetPasswordToken', 'resetPasswordExpiration', 'salt', 'hash'];
let allAuthColumnsExist = true;

for (const column of authColumns) {
  try {
    const result = execSync(
      `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -c "SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = '${column}');" -t -A`,
      { encoding: 'utf8' }
    ).trim();

    if (result === 't') {
      console.log(`✅ Column 'users.${column}' exists`);
    } else {
      console.log(`❌ Column 'users.${column}' does not exist`);
      allAuthColumnsExist = false;
    }
  } catch {
    console.log(`❌ Failed to check column 'users.${column}'`);
    allAuthColumnsExist = false;
  }
}

if (allCriticalTablesExist && allAuthColumnsExist) {
  console.log('\n✅ All critical database structures are in place!');
  console.log('🎉 Database is ready for Payload CMS');
  process.exit(0);
} else {
  console.log('\n⚠️  Some critical database structures are missing');
  console.log('💡 Payload CMS will attempt to create missing structures on startup');
  process.exit(1);
}
