#!/usr/bin/env bun
/**
 * Script to check admin users and their status
 * Run with: bun run scripts/check-admin-users.ts
 */

import { getPayload } from 'payload';
import configPromise from '@payload-config';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

async function checkAdminUsers() {
  try {
    console.log('🔍 Checking admin users...\n');
    
    const payload = await getPayload({ config: configPromise });

    // Find all users
    const users = await payload.find({
      collection: 'users',
      limit: 1000,
    });

    console.log(`Total users found: ${users.docs.length}\n`);

    // Check admin users
    const adminUsers = users.docs.filter(user => user.role === 'admin');
    console.log(`Admin users found: ${adminUsers.length}`);

    if (adminUsers.length === 0) {
      console.log('\n⚠️  No admin users found! Creating a default admin...');
      
      const defaultAdmin = await payload.create({
        collection: 'users',
        data: {
          email: 'admin@14voices.com',
          password: 'Admin123!@#',
          name: 'Default Admin',
          role: 'admin',
          status: 'active',
        },
      });

      console.log('✅ Default admin created:');
      console.log(`   Email: admin@14voices.com`);
      console.log(`   Password: Admin123!@#`);
      console.log(`   ID: ${defaultAdmin.id}`);
      console.log('\n⚠️  Please change this password immediately after login!');
    } else {
      console.log('\nAdmin users:');
      adminUsers.forEach(admin => {
        console.log(`\n👤 ${admin.email}`);
        console.log(`   Name: ${admin.name || 'Not set'}`);
        console.log(`   Status: ${admin.status || 'active'}`);
        console.log(`   ID: ${admin.id}`);
        console.log(`   Created: ${new Date(admin.createdAt).toLocaleString()}`);
        
        if (admin.security?.lastLogin) {
          console.log(`   Last login: ${new Date(admin.security.lastLogin).toLocaleString()}`);
        }
      });

      // Check for inactive admins
      const inactiveAdmins = adminUsers.filter(admin => admin.status !== 'active');
      if (inactiveAdmins.length > 0) {
        console.log('\n⚠️  Found inactive admin users:');
        inactiveAdmins.forEach(admin => {
          console.log(`   - ${admin.email} (Status: ${admin.status})`);
        });

        const readline = await import('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        const answer = await new Promise<string>(resolve => {
          rl.question('\nWould you like to activate these admin users? (y/n): ', resolve);
        });
        rl.close();

        if (answer.toLowerCase() === 'y') {
          for (const admin of inactiveAdmins) {
            await payload.update({
              collection: 'users',
              id: admin.id,
              data: {
                status: 'active',
              },
            });
            console.log(`✅ Activated: ${admin.email}`);
          }
        }
      }
    }

    // Check environment
    console.log('\n🔧 Environment check:');
    console.log(`   PAYLOAD_SECRET: ${process.env.PAYLOAD_SECRET ? '✅ Set' : '❌ Not set'}`);
    console.log(`   DATABASE_URL: ${process.env.DATABASE_URL || process.env.POSTGRES_URL ? '✅ Set' : '❌ Not set'}`);
    console.log(`   SERVER_URL: ${process.env.NEXT_PUBLIC_SERVER_URL || 'Not set (using default)'}`);

    console.log('\n📝 Login URL:');
    console.log(`   ${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin/login`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAdminUsers();