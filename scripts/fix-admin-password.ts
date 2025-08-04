#!/usr/bin/env bun

/**
 * Fix admin password using Bun and bcryptjs
 */

import { Client } from 'pg';
import bcrypt from 'bcryptjs';

const DATABASE_URL = "postgres://neondb_owner:npg_qZ2OGKbv1tMC@ep-spring-sun-a2r5782c-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

async function fixAdminPassword() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Generate proper hash and salt
    const password = 'Admin123!@#';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    console.log('🔐 Generated hash and salt');

    // Update both admin accounts
    const emails = ['admin@14voices.nl', 'admin@14voices.com'];
    
    for (const email of emails) {
      const result = await client.query(
        'UPDATE users SET hash = $1, salt = $2, login_attempts = 0, lock_until = NULL WHERE email = $3',
        [hash, salt, email]
      );
      
      if (result.rowCount !== null && result.rowCount > 0) {
        console.log(`✅ Updated password for ${email}`);
      }
    }

    console.log('\n🎉 Success! You can now login with:');
    console.log('   Email: admin@14voices.nl or admin@14voices.com');
    console.log('   Password: Admin123!@#');
    console.log('\n🔗 Login at: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

fixAdminPassword().catch(console.error);