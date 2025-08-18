#!/usr/bin/env node

/**
 * Database migration script for Docker deployment
 * 
 * This script runs Payload migrations programmatically to avoid
 * issues with TypeScript config resolution in Docker environments.
 */

import { Pool } from 'pg';
import { spawn } from 'child_process';
import { execSync } from 'child_process';

async function checkDatabaseConnection() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    await pool.end();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    await pool.end();
    return false;
  }
}

async function checkIfMigrationsRan() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    // Check if the payload_migrations table exists
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'payload_migrations'
      );
    `);
    
    const exists = result.rows[0].exists;
    
    if (exists) {
      // Check if there are any migrations
      const countResult = await pool.query('SELECT COUNT(*) FROM payload_migrations');
      const count = parseInt(countResult.rows[0].count, 10);
      
      await pool.end();
      
      if (count > 0) {
        console.log(`✅ Found ${count} existing migrations - skipping migration run`);
        return true;
      }
    }
    
    await pool.end();
    return false;
  } catch {
    // Table doesn't exist or error querying
    await pool.end();
    return false;
  }
}

async function runPayloadMigrations() {
  console.log('🚀 Running Payload migrations...');
  
  // First check if tsx is available
  try {
    execSync('which tsx', { stdio: 'ignore' });
  } catch {
    console.log('📦 Installing tsx for TypeScript execution...');
    try {
      execSync('npm install -g tsx', { stdio: 'inherit' });
    } catch (installError) {
      console.error('❌ Failed to install tsx:', installError.message);
      return false;
    }
  }
  
  // Create a script that will be executed with tsx
  const migrationScript = `
    import { getPayload } from 'payload';
    import configPromise from './src/payload.config.ts';
    
    async function migrate() {
      try {
        const config = await configPromise;
        
        // Initialize Payload which will automatically run migrations
        const payload = await getPayload({
          config,
          disableAdmin: true,
          disableScheduledJobs: true,
        });
        
        console.log('✅ Payload initialized and migrations completed');
        process.exit(0);
      } catch (error) {
        console.error('❌ Migration error:', error);
        process.exit(1);
      }
    }
    
    migrate();
  `;
  
  return new Promise((resolve) => {
    // Try using tsx directly first, then fallback to npx
    const tsxCommand = process.platform === 'win32' ? 'tsx.cmd' : 'tsx';
    let command = tsxCommand;
    let args = ['-e', migrationScript];
    
    // Check if tsx exists as a command
    try {
      execSync(`which ${tsxCommand}`, { stdio: 'ignore' });
    } catch {
      // Fallback to npx
      command = 'npx';
      args = ['tsx', '-e', migrationScript];
    }
    
    const migrationProcess = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' },
      shell: true
    });
    
    migrationProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Migrations completed successfully');
        resolve(true);
      } else {
        console.error('❌ Migrations failed with exit code:', code);
        resolve(false);
      }
    });
    
    migrationProcess.on('error', (error) => {
      console.error('❌ Failed to start migration process:', error);
      resolve(false);
    });
  });
}

async function runPayloadMigrationsFallback() {
  console.log('🔄 Trying alternative migration method...');
  
  // Alternative method: directly import and run
  try {
    const { getPayload } = await import('payload');
    const configModule = await import('../src/payload.config.ts');
    const config = await configModule.default;
    
    // Initialize Payload which will automatically run migrations
    await getPayload({
      config,
      disableAdmin: true,
      disableScheduledJobs: true,
    });
    
    console.log('✅ Migrations completed successfully (fallback method)');
    return true;
  } catch (error) {
    console.error('❌ Fallback migration failed:', error.message);
    return false;
  }
}

async function runSeedIfNeeded() {
  try {
    // Check if admin user exists
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM users WHERE email = $1
      );
    `, [process.env.ADMIN_EMAIL || 'admin@14voices.com']);
    
    const adminExists = result.rows[0].exists;
    await pool.end();
    
    if (!adminExists) {
      console.log('🌱 Running seed script...');
      execSync('node ./node_modules/payload/dist/bin/index.js seed', { stdio: 'inherit' });
      console.log('✅ Seed completed');
    } else {
      console.log('ℹ️  Admin user already exists, skipping seed');
    }
  } catch (error) {
    console.error('⚠️  Seed check/run failed:', error.message);
    // Don't fail the entire process if seeding fails
  }
}

async function main() {
  console.log('🔍 Checking database connection...');
  
  // Wait for database to be ready
  let dbReady = false;
  for (let i = 0; i < 30; i++) {
    dbReady = await checkDatabaseConnection();
    if (dbReady) break;
    
    console.log(`⏳ Waiting for database... (attempt ${i + 1}/30)`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  if (!dbReady) {
    console.error('❌ Database connection failed after 30 attempts');
    process.exit(1);
  }
  
  // Check if migrations have already run
  const migrationsExist = await checkIfMigrationsRan();
  if (migrationsExist) {
    console.log('ℹ️  Migrations already completed, skipping...');
    await runSeedIfNeeded();
    process.exit(0);
  }
  
  // Run migrations
  let success = await runPayloadMigrations();
  
  // If primary method fails, try fallback
  if (!success) {
    success = await runPayloadMigrationsFallback();
  }
  
  if (success) {
    // Run seed after successful migration
    await runSeedIfNeeded();
    process.exit(0);
  } else {
    console.error('❌ All migration methods failed');
    process.exit(1);
  }
}

// Run the migration
main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});