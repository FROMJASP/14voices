#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
 

/**
 * Fix Admin User Creation Issue
 * Ensures Payload CMS can create the first admin user
 */

const { Pool } = require('pg');
const path = require('path');

// Load environment variables if available
if (process.env.NODE_ENV !== 'production') {
  try {
    require.resolve('dotenv');
    require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
  } catch {
    // dotenv not available, continue without it
  }
}

async function fixAdminCreation() {
  console.log('🔧 Fixing admin user creation...');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // 1. Check if users table exists with all required columns
    console.log('\n📊 Checking users table structure...');
    const usersColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    if (usersColumns.rows.length === 0) {
      console.log('❌ Users table does not exist!');
      console.log('Please run Payload migrations first:');
      console.log('  bun payload migrate');
      return;
    }

    console.log(`Users table has ${usersColumns.rows.length} columns`);

    // Required columns for Payload v3
    const requiredColumns = ['id', 'email', 'hash', 'salt', 'created_at', 'updated_at'];

    const existingColumns = usersColumns.rows.map((row) => row.column_name);
    const missingColumns = requiredColumns.filter((col) => !existingColumns.includes(col));

    if (missingColumns.length > 0) {
      console.log('\n⚠️  Missing required columns:', missingColumns);

      // Add missing columns
      for (const col of missingColumns) {
        let query = '';
        switch (col) {
          case 'hash':
          case 'salt':
            query = `ALTER TABLE users ADD COLUMN IF NOT EXISTS ${col} VARCHAR(255)`;
            break;
          case 'email':
            query = `ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE`;
            break;
          case 'created_at':
          case 'updated_at':
            query = `ALTER TABLE users ADD COLUMN IF NOT EXISTS ${col} TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
            break;
        }

        if (query) {
          try {
            await pool.query(query);
            console.log(`✅ Added column: ${col}`);
          } catch (error) {
            console.error(`⚠️  Error adding column ${col}:`, error.message);
          }
        }
      }
    }

    // 2. Check for Payload v3 specific columns
    const v3Columns = ['_verified', '_verificationtoken', 'loginattempts', 'lockuntil'];
    const missingV3Columns = v3Columns.filter(
      (col) => !existingColumns.includes(col.toLowerCase())
    );

    if (missingV3Columns.length > 0) {
      console.log('\n🔄 Adding Payload v3 specific columns...');

      const v3ColumnQueries = [
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS _verified BOOLEAN DEFAULT false`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS _verificationtoken VARCHAR(255)`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS loginattempts INTEGER DEFAULT 0`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS lockuntil TIMESTAMP`,
      ];

      for (const query of v3ColumnQueries) {
        try {
          await pool.query(query);
          console.log(`✅ Added Payload v3 column`);
        } catch (error) {
          if (!error.message.includes('already exists')) {
            console.error(`⚠️  Error:`, error.message);
          }
        }
      }
    }

    // 3. Ensure indexes exist for performance
    console.log('\n🔍 Checking indexes...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    // 4. Check current user count
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    console.log(`\n👥 Current user count: ${userCount.rows[0].count}`);

    // 5. Ensure Payload preferences table exists
    console.log('\n🔧 Checking payload_preferences table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payload_preferences (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE,
        value JSONB,
        user_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Payload preferences table ready');

    // 6. Check CORS and API configuration
    console.log('\n🌐 Checking for API configuration issues...');
    console.log('Server URL:', process.env.NEXT_PUBLIC_SERVER_URL || 'Not set');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    console.log('Payload Secret:', process.env.PAYLOAD_SECRET ? 'Set' : 'Not set');

    console.log('\n✅ Admin creation fix completed!');
    console.log('\n📝 Summary:');
    console.log('- Users table structure verified');
    console.log('- Payload v3 columns added');
    console.log('- Indexes created');
    console.log('- Preferences table ensured');

    if (userCount.rows[0].count === '0') {
      console.log('\n🚀 Next steps:');
      console.log('1. Access /admin to create the first user');
      console.log('2. If "Failed to fetch" persists, check:');
      console.log('   - NEXT_PUBLIC_SERVER_URL is set correctly');
      console.log('   - No CORS issues (check browser console)');
      console.log('   - Server is running and accessible');
    }
  } catch (error) {
    console.error('❌ Error fixing admin creation:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  fixAdminCreation()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { fixAdminCreation };
