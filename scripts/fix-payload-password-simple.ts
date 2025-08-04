#!/usr/bin/env bun
import crypto from 'crypto';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

console.log('🔧 Starting password reset script...');

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');

let DATABASE_URL = '';
for (const line of envLines) {
  if (line.startsWith('DATABASE_URL=')) {
    DATABASE_URL = line.split('=')[1].replace(/["']/g, '');
    break;
  }
}

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

console.log('✅ Found DATABASE_URL');

// Generate salt and hash using Payload's exact method
function generatePasswordSaltHash(password: string): Promise<{ salt: string; hash: string }> {
  return new Promise((resolve, reject) => {
    // Generate random salt (32 bytes)
    crypto.randomBytes(32, (err, saltBuffer) => {
      if (err) return reject(err);
      
      const salt = saltBuffer.toString('hex');
      
      // Generate hash using PBKDF2 with Payload's exact parameters
      crypto.pbkdf2(password, salt, 25000, 512, 'sha256', (err, hashBuffer) => {
        if (err) return reject(err);
        
        const hash = hashBuffer.toString('hex');
        resolve({ salt, hash });
      });
    });
  });
}

async function resetAdminPassword() {
  console.log('🔌 Attempting to connect to database...');
  const client = new Client({ 
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Check existing users
    const checkResult = await client.query(`
      SELECT id, email, "createdAt" 
      FROM users 
      WHERE email IN ('admin@14voices.nl', 'admin@14voices.com')
      ORDER BY "createdAt" DESC
    `);
    
    console.log('\n📋 Found admin users:');
    checkResult.rows.forEach(row => {
      console.log(`- ${row.email} (ID: ${row.id}, Created: ${row.createdAt})`);
    });
    
    // Generate new password hash and salt
    const newPassword = 'Admin123!@#';
    const { salt, hash } = await generatePasswordSaltHash(newPassword);
    
    console.log('\n🔐 Generated new password hash using Payload\'s PBKDF2 method');
    console.log('- Algorithm: PBKDF2');
    console.log('- Iterations: 25000');
    console.log('- Key Length: 512');
    console.log('- Digest: SHA256');
    
    // Update passwords
    const updateResult = await client.query(`
      UPDATE users 
      SET 
        hash = $1,
        salt = $2,
        "lockUntil" = NULL,
        "loginAttempts" = 0,
        _verified = true,
        _verificationToken = NULL
      WHERE email IN ('admin@14voices.nl', 'admin@14voices.com')
      RETURNING id, email
    `, [hash, salt]);
    
    if (updateResult.rowCount === 0) {
      console.error('❌ No admin users found to update');
      return;
    }
    
    console.log('\n✅ Password reset successful!');
    console.log(`Updated ${updateResult.rowCount} user(s):`);
    updateResult.rows.forEach(row => {
      console.log(`- ${row.email}`);
    });
    
    console.log('\n🔑 Login credentials:');
    console.log('Email: admin@14voices.nl or admin@14voices.com');
    console.log('Password:', newPassword);
    console.log('URL: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

// Run the reset
resetAdminPassword().catch(console.error);