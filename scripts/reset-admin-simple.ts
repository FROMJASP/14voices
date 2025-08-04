#!/usr/bin/env bun

/**
 * Simple direct database script to reset admin access
 */

import { Client } from 'pg';
import bcrypt from 'bcryptjs';

// Use direct connection (not pooler) - change pooler to the direct hostname
const DATABASE_URL = "postgres://neondb_owner:npg_qZ2OGKbv1tMC@ep-spring-sun-a2r5782c.eu-central-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
  console.log('🚀 Starting admin reset...');
  
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔗 Connecting to Neon database...');
    await client.connect();
    console.log('✅ Connected!');

    // Check tables
    const { rows: tables } = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    console.log('\n📋 Tables found:', tables.map(t => t.table_name).join(', '));

    // Check if users table exists
    if (!tables.find(t => t.table_name === 'users')) {
      console.error('❌ No users table found!');
      return;
    }

    // List existing users
    const { rows: users } = await client.query(
      'SELECT id, email, role FROM users ORDER BY id'
    );
    console.log('\n👥 Current users:');
    users.forEach(u => console.log(`   ${u.email} (role: ${u.role || 'none'})`));

    // Reset admin password
    const adminEmail = 'admin@14voices.nl';
    const adminPassword = 'Admin123!@#';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin exists
    const { rows: existing } = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );

    if (existing.length > 0) {
      // Update existing
      await client.query(
        'UPDATE users SET password = $1, role = $2 WHERE email = $3',
        [hashedPassword, 'admin', adminEmail]
      );
      console.log('\n✅ Updated existing admin user');
    } else {
      // Create new
      await client.query(
        `INSERT INTO users (email, password, "firstName", "lastName", role, "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [adminEmail, hashedPassword, 'Admin', 'User', 'admin']
      );
      console.log('\n✅ Created new admin user');
    }

    console.log('\n🎉 Success!');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('\n⚠️  Change this password after logging in!');

  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await client.end();
  }
}

main().catch(console.error);