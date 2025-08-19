#!/usr/bin/env node

/**
 * Fix column naming from camelCase to snake_case
 * This script handles the transition from camelCase to snake_case column names
 * and ensures all required columns exist with proper naming
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

console.log('🔧 Starting column naming fix...');
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
    return null;
  }
}

// Main migration SQL that handles column renaming and additions
const migrationSQL = `
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
  
  IF NOT table_exists THEN
    RAISE NOTICE 'Users table does not exist, skipping column fixes';
    RETURN;
  END IF;

  -- First, rename existing camelCase columns to snake_case
  -- This handles the transition from the old schema
  
  -- avatarColor -> avatar_color
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='users' AND column_name='avatarColor') THEN
    ALTER TABLE users RENAME COLUMN "avatarColor" TO avatar_color;
    RAISE NOTICE 'Renamed avatarColor to avatar_color';
  END IF;
  
  -- jobTitle -> job_title
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='users' AND column_name='jobTitle') THEN
    ALTER TABLE users RENAME COLUMN "jobTitle" TO job_title;
    RAISE NOTICE 'Renamed jobTitle to job_title';
  END IF;
  
  -- socialLinks -> social_links (if it's a single JSONB column)
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='users' AND column_name='socialLinks') THEN
    ALTER TABLE users RENAME COLUMN "socialLinks" TO social_links;
    RAISE NOTICE 'Renamed socialLinks to social_links';
  END IF;
  
  -- preferredLanguage -> preferred_language
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='users' AND column_name='preferredLanguage') THEN
    ALTER TABLE users RENAME COLUMN "preferredLanguage" TO preferred_language;
    RAISE NOTICE 'Renamed preferredLanguage to preferred_language';
  END IF;
  
  -- emailPreferences -> email_preferences (if it's a single JSONB column)
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='users' AND column_name='emailPreferences') THEN
    ALTER TABLE users RENAME COLUMN "emailPreferences" TO email_preferences;
    RAISE NOTICE 'Renamed emailPreferences to email_preferences';
  END IF;
  
  -- updatedAt -> updated_at
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='users' AND column_name='updatedAt') THEN
    ALTER TABLE users RENAME COLUMN "updatedAt" TO updated_at;
    RAISE NOTICE 'Renamed updatedAt to updated_at';
  END IF;
  
  -- createdAt -> created_at
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='users' AND column_name='createdAt') THEN
    ALTER TABLE users RENAME COLUMN "createdAt" TO created_at;
    RAISE NOTICE 'Renamed createdAt to created_at';
  END IF;

  -- Now add any missing columns with proper snake_case naming
  
  -- Essential auth columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='reset_password_token') THEN
    ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255);
    RAISE NOTICE 'Added column reset_password_token';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='reset_password_expiration') THEN
    ALTER TABLE users ADD COLUMN reset_password_expiration TIMESTAMP;
    RAISE NOTICE 'Added column reset_password_expiration';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='salt') THEN
    ALTER TABLE users ADD COLUMN salt VARCHAR(255);
    RAISE NOTICE 'Added column salt';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='hash') THEN
    ALTER TABLE users ADD COLUMN hash VARCHAR(255);
    RAISE NOTICE 'Added column hash';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='lock_until') THEN
    ALTER TABLE users ADD COLUMN lock_until TIMESTAMP;
    RAISE NOTICE 'Added column lock_until';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='login_attempts') THEN
    ALTER TABLE users ADD COLUMN login_attempts INT DEFAULT 0;
    RAISE NOTICE 'Added column login_attempts';
  END IF;

  -- Other columns with snake_case
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='avatar_color') THEN
    ALTER TABLE users ADD COLUMN avatar_color VARCHAR(50);
    RAISE NOTICE 'Added column avatar_color';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='job_title') THEN
    ALTER TABLE users ADD COLUMN job_title VARCHAR(255);
    RAISE NOTICE 'Added column job_title';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='social_links') THEN
    ALTER TABLE users ADD COLUMN social_links JSONB;
    RAISE NOTICE 'Added column social_links';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='preferred_language') THEN
    ALTER TABLE users ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'nl';
    RAISE NOTICE 'Added column preferred_language';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='email_preferences') THEN
    ALTER TABLE users ADD COLUMN email_preferences JSONB;
    RAISE NOTICE 'Added column email_preferences';
  END IF;
  
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

  -- Fix other tables as well
  
  -- Fix payload_preferences table
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'payload_preferences'
  ) INTO table_exists;
  
  IF table_exists THEN
    -- relationTo -> relation_to
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='payload_preferences' AND column_name='relationTo') THEN
      ALTER TABLE payload_preferences RENAME COLUMN "relationTo" TO relation_to;
      RAISE NOTICE 'Renamed relationTo to relation_to in payload_preferences';
    END IF;
    
    -- relationId -> relation_id
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='payload_preferences' AND column_name='relationId') THEN
      ALTER TABLE payload_preferences RENAME COLUMN "relationId" TO relation_id;
      RAISE NOTICE 'Renamed relationId to relation_id in payload_preferences';
    END IF;
    
    -- updatedAt -> updated_at
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='payload_preferences' AND column_name='updatedAt') THEN
      ALTER TABLE payload_preferences RENAME COLUMN "updatedAt" TO updated_at;
      RAISE NOTICE 'Renamed updatedAt to updated_at in payload_preferences';
    END IF;
    
    -- createdAt -> created_at
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='payload_preferences' AND column_name='createdAt') THEN
      ALTER TABLE payload_preferences RENAME COLUMN "createdAt" TO created_at;
      RAISE NOTICE 'Renamed createdAt to created_at in payload_preferences';
    END IF;
  END IF;

  -- Fix payload_migrations table
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'payload_migrations'
  ) INTO table_exists;
  
  IF table_exists THEN
    -- updatedAt -> updated_at
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='payload_migrations' AND column_name='updatedAt') THEN
      ALTER TABLE payload_migrations RENAME COLUMN "updatedAt" TO updated_at;
      RAISE NOTICE 'Renamed updatedAt to updated_at in payload_migrations';
    END IF;
    
    -- createdAt -> created_at
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='payload_migrations' AND column_name='createdAt') THEN
      ALTER TABLE payload_migrations RENAME COLUMN "createdAt" TO created_at;
      RAISE NOTICE 'Renamed createdAt to created_at in payload_migrations';
    END IF;
  END IF;

  -- Fix media table
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'media'
  ) INTO table_exists;
  
  IF table_exists THEN
    -- thumbnailURL -> thumbnail_url
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='media' AND column_name='thumbnailURL') THEN
      ALTER TABLE media RENAME COLUMN "thumbnailURL" TO thumbnail_url;
      RAISE NOTICE 'Renamed thumbnailURL to thumbnail_url in media';
    END IF;
    
    -- mimeType -> mime_type
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='media' AND column_name='mimeType') THEN
      ALTER TABLE media RENAME COLUMN "mimeType" TO mime_type;
      RAISE NOTICE 'Renamed mimeType to mime_type in media';
    END IF;
    
    -- focalX -> focal_x
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='media' AND column_name='focalX') THEN
      ALTER TABLE media RENAME COLUMN "focalX" TO focal_x;
      RAISE NOTICE 'Renamed focalX to focal_x in media';
    END IF;
    
    -- focalY -> focal_y
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='media' AND column_name='focalY') THEN
      ALTER TABLE media RENAME COLUMN "focalY" TO focal_y;
      RAISE NOTICE 'Renamed focalY to focal_y in media';
    END IF;
    
    -- updatedAt -> updated_at
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='media' AND column_name='updatedAt') THEN
      ALTER TABLE media RENAME COLUMN "updatedAt" TO updated_at;
      RAISE NOTICE 'Renamed updatedAt to updated_at in media';
    END IF;
    
    -- createdAt -> created_at
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='media' AND column_name='createdAt') THEN
      ALTER TABLE media RENAME COLUMN "createdAt" TO created_at;
      RAISE NOTICE 'Renamed createdAt to created_at in media';
    END IF;
  END IF;

  -- Fix other tables with camelCase columns
  -- pages table
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'pages'
  ) INTO table_exists;
  
  IF table_exists THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='pages' AND column_name='publishedDate') THEN
      ALTER TABLE pages RENAME COLUMN "publishedDate" TO published_date;
      RAISE NOTICE 'Renamed publishedDate to published_date in pages';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='pages' AND column_name='openGraph') THEN
      ALTER TABLE pages RENAME COLUMN "openGraph" TO open_graph;
      RAISE NOTICE 'Renamed openGraph to open_graph in pages';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='pages' AND column_name='updatedAt') THEN
      ALTER TABLE pages RENAME COLUMN "updatedAt" TO updated_at;
      RAISE NOTICE 'Renamed updatedAt to updated_at in pages';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='pages' AND column_name='createdAt') THEN
      ALTER TABLE pages RENAME COLUMN "createdAt" TO created_at;
      RAISE NOTICE 'Renamed createdAt to created_at in pages';
    END IF;
  END IF;

  -- voiceovers table
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'voiceovers'
  ) INTO table_exists;
  
  IF table_exists THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='voiceovers' AND column_name='profilePhoto') THEN
      ALTER TABLE voiceovers RENAME COLUMN "profilePhoto" TO profile_photo;
      RAISE NOTICE 'Renamed profilePhoto to profile_photo in voiceovers';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='voiceovers' AND column_name='styleTags') THEN
      ALTER TABLE voiceovers RENAME COLUMN "styleTags" TO style_tags;
      RAISE NOTICE 'Renamed styleTags to style_tags in voiceovers';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='voiceovers' AND column_name='updatedAt') THEN
      ALTER TABLE voiceovers RENAME COLUMN "updatedAt" TO updated_at;
      RAISE NOTICE 'Renamed updatedAt to updated_at in voiceovers';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='voiceovers' AND column_name='createdAt') THEN
      ALTER TABLE voiceovers RENAME COLUMN "createdAt" TO created_at;
      RAISE NOTICE 'Renamed createdAt to created_at in voiceovers';
    END IF;
  END IF;

  -- productions table
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'productions'
  ) INTO table_exists;
  
  IF table_exists THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='productions' AND column_name='projectCode') THEN
      ALTER TABLE productions RENAME COLUMN "projectCode" TO project_code;
      RAISE NOTICE 'Renamed projectCode to project_code in productions';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='productions' AND column_name='clientName') THEN
      ALTER TABLE productions RENAME COLUMN "clientName" TO client_name;
      RAISE NOTICE 'Renamed clientName to client_name in productions';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='productions' AND column_name='dateDelivered') THEN
      ALTER TABLE productions RENAME COLUMN "dateDelivered" TO date_delivered;
      RAISE NOTICE 'Renamed dateDelivered to date_delivered in productions';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='productions' AND column_name='updatedAt') THEN
      ALTER TABLE productions RENAME COLUMN "updatedAt" TO updated_at;
      RAISE NOTICE 'Renamed updatedAt to updated_at in productions';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='productions' AND column_name='createdAt') THEN
      ALTER TABLE productions RENAME COLUMN "createdAt" TO created_at;
      RAISE NOTICE 'Renamed createdAt to created_at in productions';
    END IF;
  END IF;

  -- email_campaigns table
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'email_campaigns'
  ) INTO table_exists;
  
  IF table_exists THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='email_campaigns' AND column_name='scheduledAt') THEN
      ALTER TABLE email_campaigns RENAME COLUMN "scheduledAt" TO scheduled_at;
      RAISE NOTICE 'Renamed scheduledAt to scheduled_at in email_campaigns';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='email_campaigns' AND column_name='sentAt') THEN
      ALTER TABLE email_campaigns RENAME COLUMN "sentAt" TO sent_at;
      RAISE NOTICE 'Renamed sentAt to sent_at in email_campaigns';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='email_campaigns' AND column_name='updatedAt') THEN
      ALTER TABLE email_campaigns RENAME COLUMN "updatedAt" TO updated_at;
      RAISE NOTICE 'Renamed updatedAt to updated_at in email_campaigns';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='email_campaigns' AND column_name='createdAt') THEN
      ALTER TABLE email_campaigns RENAME COLUMN "createdAt" TO created_at;
      RAISE NOTICE 'Renamed createdAt to created_at in email_campaigns';
    END IF;
  END IF;

  -- contact_submissions table
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'contact_submissions'
  ) INTO table_exists;
  
  IF table_exists THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='contact_submissions' AND column_name='updatedAt') THEN
      ALTER TABLE contact_submissions RENAME COLUMN "updatedAt" TO updated_at;
      RAISE NOTICE 'Renamed updatedAt to updated_at in contact_submissions';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='contact_submissions' AND column_name='createdAt') THEN
      ALTER TABLE contact_submissions RENAME COLUMN "createdAt" TO created_at;
      RAISE NOTICE 'Renamed createdAt to created_at in contact_submissions';
    END IF;
  END IF;

  -- demo_requests table
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'demo_requests'
  ) INTO table_exists;
  
  IF table_exists THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='demo_requests' AND column_name='projectDetails') THEN
      ALTER TABLE demo_requests RENAME COLUMN "projectDetails" TO project_details;
      RAISE NOTICE 'Renamed projectDetails to project_details in demo_requests';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='demo_requests' AND column_name='voiceoverInterest') THEN
      ALTER TABLE demo_requests RENAME COLUMN "voiceoverInterest" TO voiceover_interest;
      RAISE NOTICE 'Renamed voiceoverInterest to voiceover_interest in demo_requests';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='demo_requests' AND column_name='updatedAt') THEN
      ALTER TABLE demo_requests RENAME COLUMN "updatedAt" TO updated_at;
      RAISE NOTICE 'Renamed updatedAt to updated_at in demo_requests';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='demo_requests' AND column_name='createdAt') THEN
      ALTER TABLE demo_requests RENAME COLUMN "createdAt" TO created_at;
      RAISE NOTICE 'Renamed createdAt to created_at in demo_requests';
    END IF;
  END IF;

END
$$;
`;

// Run the migration
const result = runSQL(migrationSQL, 'Fixing column naming conventions');

if (result) {
  console.log('\n✅ Column naming fix completed successfully!');
  
  // Verify critical columns
  console.log('\n🔍 Verifying critical auth columns...');
  const criticalColumns = ['reset_password_token', 'reset_password_expiration', 'salt', 'hash'];
  let allColumnsGood = true;

  for (const column of criticalColumns) {
    try {
      const checkResult = execSync(
        `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = '${column}';" -t -A`,
        { encoding: 'utf8' }
      ).trim();

      if (checkResult === column) {
        console.log(`✅ Column '${column}' exists`);
      } else {
        console.log(`❌ Column '${column}' is missing`);
        allColumnsGood = false;
      }
    } catch (error) {
      console.log(`❌ Failed to verify column '${column}'`);
      allColumnsGood = false;
    }
  }

  // Check for any remaining camelCase columns
  console.log('\n🔍 Checking for remaining camelCase columns in users table...');
  try {
    const camelCaseCheck = execSync(
      `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name ~ '[A-Z]';" -t -A`,
      { encoding: 'utf8' }
    ).trim();

    if (camelCaseCheck) {
      console.log(`⚠️  Found remaining camelCase columns: ${camelCaseCheck.split('\n').join(', ')}`);
      allColumnsGood = false;
    } else {
      console.log('✅ No camelCase columns found in users table');
    }
  } catch (error) {
    console.log('⚠️  Could not check for camelCase columns');
  }

  if (allColumnsGood) {
    console.log('\n🎉 All column naming issues have been resolved!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some issues remain, but the migration has improved the situation');
    process.exit(1);
  }
} else {
  console.error('\n❌ Column naming fix failed');
  process.exit(1);
}