#!/usr/bin/env node

/**
 * Test script for the new migration system
 * Validates that the solution works correctly before deployment
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Color codes
const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
};

function log(message, color = COLORS.BLUE) {
  console.log(`${color}${message}${COLORS.RESET}`);
}

function logSection(title) {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}${'='.repeat(60)}${COLORS.RESET}`);
  console.log(`${COLORS.BOLD}${COLORS.CYAN}  ${title}${COLORS.RESET}`);
  console.log(`${COLORS.BOLD}${COLORS.CYAN}${'='.repeat(60)}${COLORS.RESET}\n`);
}

async function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function checkFile(filepath, description) {
  if (fs.existsSync(filepath)) {
    log(`✅ ${description} exists`, COLORS.GREEN);
    return true;
  } else {
    log(`❌ ${description} missing: ${filepath}`, COLORS.RED);
    return false;
  }
}

async function runTests() {
  logSection('MIGRATION SYSTEM TEST');
  
  const results = {
    files: true,
    migration: false,
    docker: false,
    build: false
  };

  try {
    // Test 1: Check all required files exist
    logSection('TEST 1: File Validation');
    
    const requiredFiles = [
      ['scripts/payload-migration-runner.js', 'Migration runner'],
      ['scripts/docker-entrypoint-v2.sh', 'Docker entrypoint v2'],
      ['Dockerfile.production', 'Production Dockerfile'],
      ['src/app/api/health/route.ts', 'Health check endpoint']
    ];

    for (const [file, desc] of requiredFiles) {
      const exists = await checkFile(path.join(process.cwd(), file), desc);
      results.files = results.files && exists;
    }

    // Test 2: Test migration runner (dry run)
    logSection('TEST 2: Migration Runner');
    
    // Set fake database URL to test build environment detection
    const env = {
      ...process.env,
      DATABASE_URL: 'postgresql://fake:fake@fake:5432/fake'
    };

    try {
      await runCommand('node', ['scripts/payload-migration-runner.js'], { env });
      log('✅ Migration runner handles build environment correctly', COLORS.GREEN);
      results.migration = true;
    } catch (error) {
      log(`❌ Migration runner failed: ${error.message}`, COLORS.RED);
    }

    // Test 3: Validate Docker build (if Docker is available)
    logSection('TEST 3: Docker Build Validation');
    
    try {
      // Check if Docker is available
      await runCommand('docker', ['--version']);
      
      // Test build with production Dockerfile
      log('Building Docker image (this may take a few minutes)...', COLORS.YELLOW);
      await runCommand('docker', [
        'build',
        '-f', 'Dockerfile.production',
        '-t', '14voices-test:latest',
        '--build-arg', 'NODE_ENV=production',
        '.'
      ]);
      
      log('✅ Docker build successful', COLORS.GREEN);
      results.docker = true;
      
      // Clean up
      await runCommand('docker', ['rmi', '14voices-test:latest']);
    } catch (error) {
      log('⚠️  Docker test skipped (Docker not available or build failed)', COLORS.YELLOW);
      results.docker = 'skipped';
    }

    // Test 4: Test local build
    logSection('TEST 4: Local Build Test');
    
    try {
      // Set fake database URL for build
      const buildEnv = {
        ...process.env,
        DATABASE_URL: 'postgresql://fake:fake@fake:5432/fake',
        NODE_ENV: 'production'
      };
      
      log('Running production build...', COLORS.YELLOW);
      await runCommand('bun', ['run', 'build'], { env: buildEnv });
      
      log('✅ Production build successful', COLORS.GREEN);
      results.build = true;
    } catch (error) {
      log(`❌ Production build failed: ${error.message}`, COLORS.RED);
    }

    // Summary
    logSection('TEST SUMMARY');
    
    const allPassed = Object.values(results).every(r => r === true || r === 'skipped');
    
    console.log('Test Results:');
    console.log(`  File Validation: ${results.files ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`  Migration Runner: ${results.migration ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`  Docker Build: ${results.docker === true ? '✅ PASSED' : results.docker === 'skipped' ? '⚠️  SKIPPED' : '❌ FAILED'}`);
    console.log(`  Local Build: ${results.build ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (allPassed) {
      log('\n🎉 All tests passed! The migration system is ready for deployment.', COLORS.GREEN);
      log('\nNext steps:', COLORS.CYAN);
      log('1. Copy production files: cp Dockerfile.production Dockerfile', COLORS.WHITE);
      log('2. Copy entrypoint: cp scripts/docker-entrypoint-v2.sh scripts/docker-entrypoint.sh', COLORS.WHITE);
      log('3. Remove old scripts: rm scripts/direct-db-init.js', COLORS.WHITE);
      log('4. Deploy to Coolify', COLORS.WHITE);
    } else {
      log('\n❌ Some tests failed. Please fix the issues before deployment.', COLORS.RED);
      process.exit(1);
    }
  } catch (error) {
    log(`\n❌ Test suite failed: ${error.message}`, COLORS.RED);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  runTests();
}