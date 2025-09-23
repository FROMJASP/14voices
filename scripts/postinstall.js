#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const os = require('os');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// Check if we should skip postinstall (for Docker builds)
if (process.env.SKIP_POSTINSTALL === 'true') {
  console.log('Skipping postinstall script (SKIP_POSTINSTALL=true)');
  process.exit(0);
}

// Check if we're already in a postinstall execution to prevent infinite loops
if (process.env.POSTINSTALL_RUNNING === 'true') {
  console.log('Postinstall already running, skipping to prevent infinite loop...');
  process.exit(0);
}

console.log('Running postinstall script...');
console.log(`Platform: ${os.platform()}, Architecture: ${os.arch()}`);

// Check if we're on Vercel
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;

// Function to check if a module exists
function moduleExists(moduleName) {
  try {
    const modulePath = path.join(process.cwd(), 'node_modules', moduleName);
    return fs.existsSync(modulePath);
  } catch {
    return false;
  }
}

if (isVercel || os.platform() === 'linux') {
  console.log('Installing native dependencies for Linux x64...');

  try {
    // Set environment variable to prevent recursive execution
    const env = {
      ...process.env,
      POSTINSTALL_RUNNING: 'true',
      npm_config_sharp_binary_host: 'https://github.com/lovell/sharp/releases/download',
    };

    // For Vercel, we need to use npm to install platform-specific binaries
    // Bun doesn't properly handle cross-platform binary installation
    const packageManager = isVercel ? 'npm' : 'bun';

    if (isVercel) {
      console.log('Using npm for Vercel deployment...');

      // Install sharp with platform-specific binaries
      execSync('npm install --force --os=linux --cpu=x64 sharp', {
        stdio: 'inherit',
        env,
      });

      // Check and install lightningcss Linux binaries
      const lightningcssGnu = 'lightningcss-linux-x64-gnu';
      const lightningcssMusl = 'lightningcss-linux-x64-musl';

      if (!moduleExists(lightningcssGnu) || !moduleExists(lightningcssMusl)) {
        console.log('Installing lightningcss Linux binaries...');
        execSync(`npm install --force ${lightningcssGnu}@1.30.1 ${lightningcssMusl}@1.30.1`, {
          stdio: 'inherit',
          env,
        });
      } else {
        console.log('Lightningcss Linux binaries already installed');
      }

      // Check and install Tailwind CSS oxide bindings
      const oxideGnu = '@tailwindcss/oxide-linux-x64-gnu';
      const oxideMusl = '@tailwindcss/oxide-linux-x64-musl';

      if (!moduleExists(oxideGnu) || !moduleExists(oxideMusl)) {
        console.log('Installing Tailwind CSS oxide Linux binaries...');
        execSync(`npm install --force ${oxideGnu}@4.1.10 ${oxideMusl}@4.1.10`, {
          stdio: 'inherit',
          env,
        });
      } else {
        console.log('Tailwind CSS oxide Linux binaries already installed');
      }
    } else {
      // For local Linux development, use bun
      console.log('Using bun for local Linux development...');

      // Install sharp with platform-specific binaries
      execSync('bun add --os=linux --cpu=x64 sharp', {
        stdio: 'inherit',
        env,
      });

      // Install lightningcss Linux binaries
      execSync('bun add lightningcss-linux-x64-gnu@1.30.1', {
        stdio: 'inherit',
        env,
      });

      // Install Tailwind CSS oxide bindings for Linux
      execSync('bun add @tailwindcss/oxide-linux-x64-gnu@4.1.10', {
        stdio: 'inherit',
        env,
      });
    }

    console.log('✅ Native dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install native dependencies:', error.message);
    console.error('Full error:', error);

    // Try to provide helpful debugging info
    try {
      console.log('\nChecking for installed modules:');
      console.log('- lightningcss-linux-x64-gnu:', moduleExists('lightningcss-linux-x64-gnu'));
      console.log('- lightningcss-linux-x64-musl:', moduleExists('lightningcss-linux-x64-musl'));
      console.log(
        '- @tailwindcss/oxide-linux-x64-gnu:',
        moduleExists('@tailwindcss/oxide-linux-x64-gnu')
      );
      console.log(
        '- @tailwindcss/oxide-linux-x64-musl:',
        moduleExists('@tailwindcss/oxide-linux-x64-musl')
      );
    } catch (debugError) {
      console.error('Debug check failed:', debugError.message);
    }

    // Don't fail the build, let it continue
  }
} else {
  console.log('Skipping Linux native dependencies on non-Linux platform');
}

console.log('Postinstall script completed');
