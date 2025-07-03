#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const os = require('os');

// Check if we're already in a postinstall execution to prevent infinite loops
if (process.env.POSTINSTALL_RUNNING === 'true') {
  console.log('Postinstall already running, skipping to prevent infinite loop...');
  process.exit(0);
}

console.log('Running postinstall script...');
console.log(`Platform: ${os.platform()}, Architecture: ${os.arch()}`);

// Check if we're on Vercel
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;

if (isVercel || os.platform() === 'linux') {
  console.log('Installing native dependencies for Linux x64...');

  try {
    // Set environment variable to prevent recursive execution
    const env = {
      ...process.env,
      POSTINSTALL_RUNNING: 'true',
      npm_config_sharp_binary_host: 'https://github.com/lovell/sharp/releases/download',
    };

    // Install sharp with platform-specific binaries
    execSync('bun add --os=linux --cpu=x64 sharp', {
      stdio: 'inherit',
      env,
    });

    // Install Tailwind CSS oxide bindings for Linux
    execSync('bun add @tailwindcss/oxide-linux-x64-gnu@4.1.10', {
      stdio: 'inherit',
      env,
    });

    console.log('✅ Native dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install native dependencies:', error.message);
    // Don't fail the build, let it continue
  }
} else {
  console.log('Skipping Linux native dependencies on non-Linux platform');
}

console.log('Postinstall script completed');
