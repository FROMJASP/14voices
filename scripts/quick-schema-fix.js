#!/usr/bin/env node

/**
 * Quick schema fix for missing authentication columns
 * This script adds the missing columns to the users table with correct snake_case naming
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

console.log('🔧 Running quick schema fix...');
console.log(`📍 Host: ${host}`);
console.log(`📍 Database: ${database}`);

// SQL to add missing columns
const fixSQL = `
DO $$
BEGIN
  -- Add reset_password_token if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='reset_password_token') THEN
    ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255);
    RAISE NOTICE 'Added column reset_password_token';
  END IF;
  
  -- Add reset_password_expiration if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='reset_password_expiration') THEN
    ALTER TABLE users ADD COLUMN reset_password_expiration TIMESTAMP;
    RAISE NOTICE 'Added column reset_password_expiration';
  END IF;
  
  -- Add salt if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='salt') THEN
    ALTER TABLE users ADD COLUMN salt VARCHAR(255);
    RAISE NOTICE 'Added column salt';
  END IF;
  
  -- Add hash if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='hash') THEN
    ALTER TABLE users ADD COLUMN hash VARCHAR(255);
    RAISE NOTICE 'Added column hash';
  END IF;
  
  -- Add lock_until if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='lock_until') THEN
    ALTER TABLE users ADD COLUMN lock_until TIMESTAMP;
    RAISE NOTICE 'Added column lock_until';
  END IF;
  
  -- Add login_attempts if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='login_attempts') THEN
    ALTER TABLE users ADD COLUMN login_attempts INT DEFAULT 0;
    RAISE NOTICE 'Added column login_attempts';
  END IF;
  
  -- Add avatar_id if missing (snake_case for avatar relationship)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='avatar_id') THEN
    ALTER TABLE users ADD COLUMN avatar_id INT;
    RAISE NOTICE 'Added column avatar_id';
  END IF;
  
  -- Add avatar_color if missing (snake_case)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='avatar_color') THEN
    ALTER TABLE users ADD COLUMN avatar_color VARCHAR(50);
    RAISE NOTICE 'Added column avatar_color';
  END IF;
  
  -- Add job_title if missing (snake_case)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='job_title') THEN
    ALTER TABLE users ADD COLUMN job_title VARCHAR(255);
    RAISE NOTICE 'Added column job_title';
  END IF;
  
  -- Add social links columns (snake_case)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='social_links_linkedin') THEN
    ALTER TABLE users ADD COLUMN social_links_linkedin VARCHAR(255);
    RAISE NOTICE 'Added column social_links_linkedin';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='social_links_twitter') THEN
    ALTER TABLE users ADD COLUMN social_links_twitter VARCHAR(255);
    RAISE NOTICE 'Added column social_links_twitter';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='social_links_github') THEN
    ALTER TABLE users ADD COLUMN social_links_github VARCHAR(255);
    RAISE NOTICE 'Added column social_links_github';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='social_links_website') THEN
    ALTER TABLE users ADD COLUMN social_links_website VARCHAR(255);
    RAISE NOTICE 'Added column social_links_website';
  END IF;
  
  -- Add email preferences columns (snake_case)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='email_preferences_unsubscribed') THEN
    ALTER TABLE users ADD COLUMN email_preferences_unsubscribed BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added column email_preferences_unsubscribed';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='email_preferences_marketing') THEN
    ALTER TABLE users ADD COLUMN email_preferences_marketing BOOLEAN DEFAULT TRUE;
    RAISE NOTICE 'Added column email_preferences_marketing';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='email_preferences_transactional') THEN
    ALTER TABLE users ADD COLUMN email_preferences_transactional BOOLEAN DEFAULT TRUE;
    RAISE NOTICE 'Added column email_preferences_transactional';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='email_preferences_updates') THEN
    ALTER TABLE users ADD COLUMN email_preferences_updates BOOLEAN DEFAULT TRUE;
    RAISE NOTICE 'Added column email_preferences_updates';
  END IF;
  
  -- Add security columns (snake_case)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='security_last_login') THEN
    ALTER TABLE users ADD COLUMN security_last_login TIMESTAMP;
    RAISE NOTICE 'Added column security_last_login';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='security_login_count') THEN
    ALTER TABLE users ADD COLUMN security_login_count INT DEFAULT 0;
    RAISE NOTICE 'Added column security_login_count';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='security_two_factor_enabled') THEN
    ALTER TABLE users ADD COLUMN security_two_factor_enabled BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added column security_two_factor_enabled';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='security_password_changed_at') THEN
    ALTER TABLE users ADD COLUMN security_password_changed_at TIMESTAMP;
    RAISE NOTICE 'Added column security_password_changed_at';
  END IF;
  
  -- Add notification columns (snake_case)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='notifications_in_app') THEN
    ALTER TABLE users ADD COLUMN notifications_in_app BOOLEAN DEFAULT TRUE;
    RAISE NOTICE 'Added column notifications_in_app';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='notifications_push') THEN
    ALTER TABLE users ADD COLUMN notifications_push BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added column notifications_push';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='notifications_sms') THEN
    ALTER TABLE users ADD COLUMN notifications_sms BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added column notifications_sms';
  END IF;
  
  -- Add metadata columns (snake_case)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='metadata_notes') THEN
    ALTER TABLE users ADD COLUMN metadata_notes TEXT;
    RAISE NOTICE 'Added column metadata_notes';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='metadata_custom_fields') THEN
    ALTER TABLE users ADD COLUMN metadata_custom_fields JSONB;
    RAISE NOTICE 'Added column metadata_custom_fields';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='metadata_created_by_id') THEN
    ALTER TABLE users ADD COLUMN metadata_created_by_id INT;
    RAISE NOTICE 'Added column metadata_created_by_id';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='metadata_updated_by_id') THEN
    ALTER TABLE users ADD COLUMN metadata_updated_by_id INT;
    RAISE NOTICE 'Added column metadata_updated_by_id';
  END IF;
  
  -- Add preferred_language if missing (snake_case)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='preferred_language') THEN
    ALTER TABLE users ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'nl';
    RAISE NOTICE 'Added column preferred_language';
  END IF;
  
  -- Add timestamps if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='updated_at') THEN
    ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    RAISE NOTICE 'Added column updated_at';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='created_at') THEN
    ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    RAISE NOTICE 'Added column created_at';
  END IF;
END
$$;
`;

try {
  console.log('\n🔧 Applying schema fix...');
  const result = execSync(
    `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -c "${fixSQL}" 2>&1`,
    { encoding: 'utf8' }
  );
  console.log('✅ Schema fix applied successfully');
  console.log(result);

  // Verify critical columns
  console.log('\n🔍 Verifying critical columns...');
  const criticalColumns = ['reset_password_token', 'reset_password_expiration', 'salt', 'hash'];

  for (const column of criticalColumns) {
    try {
      const checkResult = execSync(
        `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = '${column}';" -t -A`,
        { encoding: 'utf8' }
      ).trim();

      if (checkResult === column) {
        console.log(`✅ Column '${column}' exists`);
      } else {
        console.log(`❌ Column '${column}' still missing`);
      }
    } catch (error) {
      console.log(`❌ Failed to verify column '${column}'`);
    }
  }

  process.exit(0);
} catch (error) {
  console.error('❌ Schema fix failed:', error.message);
  process.exit(1);
}
