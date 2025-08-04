#!/usr/bin/env bun

/**
 * Direct database script to reset admin access
 * This bypasses Payload CMS entirely and works directly with PostgreSQL
 */

import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

// Try different possible database URL environment variables
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URI;

console.log('🔍 Checking environment variables:');
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✓ Found' : '✗ Not found');
console.log('   POSTGRES_URL:', process.env.POSTGRES_URL ? '✓ Found' : '✗ Not found');
console.log('   DATABASE_URI:', process.env.DATABASE_URI ? '✓ Found' : '✗ Not found');

if (!DATABASE_URL) {
  console.error('❌ No database URL found in environment variables');
  console.error('   Checked: POSTGRES_URL, DATABASE_URI, DATABASE_URL');
  process.exit(1);
}

async function resetAdminAccess() {
  console.log('📍 Using database URL:', DATABASE_URL?.replace(/:[^@]+@/, ':****@'));
  
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Neon
    },
    connectionTimeoutMillis: 10000, // 10 second timeout
  });

  try {
    console.log('🔗 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // First, let's see what tables we have
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Available tables:');
    tablesResult.rows.forEach(row => console.log(`   - ${row.table_name}`));

    // Check if users table exists
    const userTableExists = tablesResult.rows.some(row => row.table_name === 'users');
    
    if (!userTableExists) {
      console.error('\n❌ No "users" table found in the database');
      console.log('   This might indicate Payload CMS hasn\'t been initialized yet');
      return;
    }

    // Get column information for users table
    const columnsResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📊 Users table columns:');
    columnsResult.rows.forEach(row => console.log(`   - ${row.column_name} (${row.data_type})`));

    // Query existing users
    const usersResult = await client.query(`
      SELECT id, email, "firstName", "lastName", role, "createdAt"
      FROM users
      ORDER BY "createdAt" DESC;
    `);

    console.log(`\n👥 Found ${usersResult.rows.length} existing users:`);
    usersResult.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.firstName} ${user.lastName}) - Role: ${user.role || 'unknown'}`);
    });

    // Prepare new admin credentials
    const adminEmail = 'admin@14voices.nl';
    const adminPassword = 'Admin123!@#'; // Strong temporary password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin user exists
    const existingAdminResult = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );

    if (existingAdminResult.rows.length > 0) {
      // Update existing admin
      console.log('\n🔄 Updating existing admin user...');
      
      await client.query(`
        UPDATE users 
        SET 
          password = $1,
          role = 'admin',
          "updatedAt" = NOW()
        WHERE email = $2
      `, [hashedPassword, adminEmail]);

      console.log('✅ Admin password reset successfully!');
    } else {
      // Create new admin
      console.log('\n➕ Creating new admin user...');
      
      await client.query(`
        INSERT INTO users (
          email, 
          password, 
          "firstName", 
          "lastName", 
          role,
          "createdAt",
          "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      `, [
        adminEmail,
        hashedPassword,
        'Admin',
        'User',
        'admin'
      ]);

      console.log('✅ New admin user created successfully!');
    }

    console.log('\n🎉 Admin access has been reset!');
    console.log('   Email: ' + adminEmail);
    console.log('   Password: ' + adminPassword);
    console.log('\n⚠️  IMPORTANT: Change this password immediately after logging in!');

  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the script
console.log('🚀 Starting admin access reset...\n');
resetAdminAccess().catch(console.error);