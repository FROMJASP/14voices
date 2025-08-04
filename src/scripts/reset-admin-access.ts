#!/usr/bin/env bun
/**
 * Script to reset admin access or create a new admin user
 * Run with: bun run src/scripts/reset-admin-access.ts
 */

import { getPayload } from 'payload';
import configPromise from '@payload-config';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

console.log('🔍 Environment check:');
console.log('   PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? '✓ Set' : '✗ Missing');
console.log('   POSTGRES_URL:', process.env.POSTGRES_URL ? '✓ Set' : '✗ Missing');
console.log('');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
};

async function resetAdminAccess() {
  try {
    log.info('Initializing Payload...');
    
    const payload = await getPayload({ config: configPromise });

    log.success('Payload initialized successfully');

    // List existing admin users
    log.info('Checking existing admin users...');
    
    const existingAdmins = await payload.find({
      collection: 'users',
      where: {
        role: {
          equals: 'admin',
        },
      },
      limit: 100,
    });

    if (existingAdmins.docs.length > 0) {
      log.info(`Found ${existingAdmins.docs.length} admin user(s):`);
      existingAdmins.docs.forEach((admin) => {
        console.log(`  - ${admin.email} (${admin.name || 'No name'}) - Status: ${admin.status || 'active'}`);
      });
    } else {
      log.warning('No admin users found in the database');
    }

    // Prompt for action
    console.log(`\n${colors.bright}What would you like to do?${colors.reset}`);
    console.log('1. Reset password for existing admin');
    console.log('2. Create new admin user');
    console.log('3. List all users');
    console.log('4. Exit');
    
    const action = prompt('\nEnter your choice (1-4): ');

    switch (action) {
      case '1':
        await resetExistingAdminPassword(payload);
        break;
      case '2':
        await createNewAdminUser(payload);
        break;
      case '3':
        await listAllUsers(payload);
        break;
      case '4':
        log.info('Exiting...');
        process.exit(0);
      default:
        log.error('Invalid choice');
        process.exit(1);
    }

  } catch (error) {
    log.error(`Failed to reset admin access: ${error}`);
    process.exit(1);
  }
}

async function resetExistingAdminPassword(payload: any) {
  const email = prompt('\nEnter admin email address: ');
  if (!email) {
    log.error('Email is required');
    return;
  }

  // Find the user
  const user = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: email,
      },
    },
    limit: 1,
  });

  if (user.docs.length === 0) {
    log.error(`No user found with email: ${email}`);
    return;
  }

  const foundUser = user.docs[0];
  log.info(`Found user: ${foundUser.name || foundUser.email} (Role: ${foundUser.role})`);

  // Generate new password
  const newPassword = generateSecurePassword();

  // Update the user
  await payload.update({
    collection: 'users',
    id: foundUser.id,
    data: {
      password: newPassword,
      status: 'active',
      role: 'admin', // Ensure they have admin role
      'security.passwordChangedAt': new Date().toISOString(),
    },
  });

  log.success('Password reset successfully!');
  console.log(`\n${colors.bright}New credentials:${colors.reset}`);
  console.log(`Email: ${colors.cyan}${email}${colors.reset}`);
  console.log(`Password: ${colors.cyan}${newPassword}${colors.reset}`);
  console.log(`\n${colors.yellow}⚠️  Please change this password after logging in${colors.reset}`);
  console.log(`Login URL: ${colors.cyan}${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin/login${colors.reset}`);
}

async function createNewAdminUser(payload: any) {
  const email = prompt('\nEnter email for new admin: ');
  if (!email || !email.includes('@')) {
    log.error('Valid email is required');
    return;
  }

  const name = prompt('Enter name (optional): ') || 'Admin User';

  // Check if user already exists
  const existing = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: email,
      },
    },
    limit: 1,
  });

  if (existing.docs.length > 0) {
    log.error(`User with email ${email} already exists`);
    const update = prompt('Would you like to update this user to admin? (y/n): ');
    if (update?.toLowerCase() === 'y') {
      await resetExistingAdminPassword(payload);
    }
    return;
  }

  // Generate password
  const password = generateSecurePassword();

  // Create the user
  await payload.create({
    collection: 'users',
    data: {
      email,
      password,
      name,
      role: 'admin',
      status: 'active',
      department: 'management',
      jobTitle: 'Administrator',
      preferredLanguage: 'nl',
      timezone: 'Europe/Amsterdam',
      emailPreferences: {
        unsubscribed: false,
        marketing: true,
        transactional: true,
        updates: true,
      },
      notifications: {
        inApp: true,
        push: false,
        sms: false,
      },
    },
  });

  log.success('Admin user created successfully!');
  console.log(`\n${colors.bright}New admin credentials:${colors.reset}`);
  console.log(`Email: ${colors.cyan}${email}${colors.reset}`);
  console.log(`Password: ${colors.cyan}${password}${colors.reset}`);
  console.log(`\n${colors.yellow}⚠️  Please change this password after logging in${colors.reset}`);
  console.log(`Login URL: ${colors.cyan}${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin/login${colors.reset}`);
}

async function listAllUsers(payload: any) {
  log.info('Fetching all users...');
  
  const users = await payload.find({
    collection: 'users',
    limit: 1000,
    sort: '-createdAt',
  });

  if (users.docs.length === 0) {
    log.warning('No users found');
    return;
  }

  console.log(`\n${colors.bright}Total users: ${users.docs.length}${colors.reset}\n`);
  
  // Group by role
  const byRole = users.docs.reduce((acc: any, user: any) => {
    const role = user.role || 'user';
    if (!acc[role]) acc[role] = [];
    acc[role].push(user);
    return acc;
  }, {});

  Object.entries(byRole).forEach(([role, users]: [string, any]) => {
    console.log(`${colors.bright}${role.toUpperCase()} (${users.length})${colors.reset}`);
    users.forEach((user: any) => {
      const status = user.status || 'active';
      const statusColor = status === 'active' ? colors.green : colors.red;
      console.log(`  - ${user.email} (${user.name || 'No name'}) - ${statusColor}${status}${colors.reset}`);
    });
    console.log('');
  });

  // Ask if they want to take action
  const continueAction = prompt('Would you like to reset a password or create a new admin? (y/n): ');
  if (continueAction?.toLowerCase() === 'y') {
    await resetAdminAccess();
  }
}

function generateSecurePassword(length = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each set
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Run the script
resetAdminAccess().catch((error) => {
  log.error(`Script failed: ${error}`);
  process.exit(1);
});