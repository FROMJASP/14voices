#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Build script for validation that uses fake database URL
 * This allows the build to complete without needing database access
 */

const { execSync } = require('child_process');

// Set fake environment variables for build
const buildEnv = {
  ...process.env,
  DATABASE_URL: 'postgresql://fake:fake@fake:5432/fake',
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || 'dummy-secret-for-build',
  CSRF_SECRET: process.env.CSRF_SECRET || 'dummy-csrf-secret-for-build',
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  RESEND_API_KEY: process.env.RESEND_API_KEY || 're_dummy_build_key',
};

console.log('🏗️  Running build with validation-safe environment...');

try {
  // Run the build command with the fake environment
  execSync('bun run build', {
    stdio: 'inherit',
    env: buildEnv,
  });
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
