#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');

console.log('Running postinstall script...');
console.log(`Platform: ${os.platform()}, Architecture: ${os.arch()}`);

// Check if we're on Vercel
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;

if (isVercel || os.platform() === 'linux') {
  console.log('Installing native dependencies for Linux x64...');
  
  try {
    // Install sharp with platform-specific binaries
    execSync('npm install --os=linux --cpu=x64 sharp', { 
      stdio: 'inherit',
      env: { ...process.env, npm_config_sharp_binary_host: 'https://github.com/lovell/sharp/releases/download' }
    });
    
    // Install Tailwind CSS oxide bindings for Linux
    execSync('npm install @tailwindcss/oxide-linux-x64-gnu@4.1.10', { stdio: 'inherit' });
    
    console.log('✅ Native dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install native dependencies:', error.message);
    // Don't fail the build, let it continue
  }
} else {
  console.log('Skipping Linux native dependencies on non-Linux platform');
}

console.log('Postinstall script completed');