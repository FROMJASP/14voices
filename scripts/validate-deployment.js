#!/usr/bin/env node

/**
 * Pre-deployment validation script
 * Ensures all common issues are caught before attempting deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes
const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
};

function log(message, color = COLORS.WHITE) {
  console.log(`${color}${message}${COLORS.RESET}`);
}

function logSection(title) {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}${'='.repeat(60)}${COLORS.RESET}`);
  console.log(`${COLORS.BOLD}${COLORS.CYAN}  ${title}${COLORS.RESET}`);
  console.log(`${COLORS.BOLD}${COLORS.CYAN}${'='.repeat(60)}${COLORS.RESET}\n`);
}

function logError(message) {
  console.error(`${COLORS.RED}❌ ${message}${COLORS.RESET}`);
}

function logWarning(message) {
  console.warn(`${COLORS.YELLOW}⚠️  ${message}${COLORS.RESET}`);
}

function logSuccess(message) {
  console.log(`${COLORS.GREEN}✅ ${message}${COLORS.RESET}`);
}

// Validation checks
const validations = {
  // Check for problematic files that should be removed
  checkProblematicFiles() {
    logSection('Checking for Problematic Files');
    
    const problematicFiles = [
      'scripts/direct-db-init.js',
      'scripts/fix-coolify-production-issues.js',
      'scripts/database-migration-for-container.sql'
    ];
    
    let hasProblems = false;
    for (const file of problematicFiles) {
      if (fs.existsSync(file)) {
        logError(`Found problematic file: ${file} - This should be removed!`);
        hasProblems = true;
      }
    }
    
    if (!hasProblems) {
      logSuccess('No problematic files found');
    }
    
    return !hasProblems;
  },

  // Check Docker configuration
  checkDockerConfig() {
    logSection('Checking Docker Configuration');
    
    // Check if production Dockerfile exists
    if (!fs.existsSync('Dockerfile')) {
      logError('Dockerfile not found!');
      logWarning('Run: cp Dockerfile.production Dockerfile');
      return false;
    }
    
    // Check if Dockerfile contains fake database URL
    const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
    if (!dockerfile.includes('fake:fake@fake')) {
      logError('Dockerfile missing fake DATABASE_URL for build isolation');
      return false;
    }
    
    // Check entrypoint
    if (!fs.existsSync('scripts/docker-entrypoint.sh')) {
      logError('Docker entrypoint not found!');
      logWarning('Run: cp scripts/docker-entrypoint-v2.sh scripts/docker-entrypoint.sh');
      return false;
    }
    
    // Check if using new entrypoint
    const entrypoint = fs.readFileSync('scripts/docker-entrypoint.sh', 'utf8');
    if (entrypoint.includes('direct-db-init.js') || entrypoint.includes('coolify-init.js')) {
      logError('Docker entrypoint still references old initialization scripts!');
      logWarning('Run: cp scripts/docker-entrypoint-v2.sh scripts/docker-entrypoint.sh');
      return false;
    }
    
    logSuccess('Docker configuration is correct');
    return true;
  },

  // Check migration system
  checkMigrationSystem() {
    logSection('Checking Migration System');
    
    // Check migration runner exists
    if (!fs.existsSync('scripts/payload-migration-runner.js')) {
      logError('Payload migration runner not found!');
      return false;
    }
    
    // Check if still using old migration scripts
    const runPayloadMigrations = 'scripts/run-payload-migrations.js';
    if (fs.existsSync(runPayloadMigrations)) {
      const content = fs.readFileSync(runPayloadMigrations, 'utf8');
      if (!content.includes('payload-migration-runner')) {
        logWarning('Old migration script detected - consider updating to use new runner');
      }
    }
    
    logSuccess('Migration system configured correctly');
    return true;
  },

  // Check environment variables
  checkEnvironmentExample() {
    logSection('Checking Environment Configuration');
    
    if (!fs.existsSync('.env.example')) {
      logError('.env.example not found!');
      return false;
    }
    
    const envExample = fs.readFileSync('.env.example', 'utf8');
    const requiredVars = [
      'DATABASE_URL',
      'PAYLOAD_SECRET',
      'NEXT_PUBLIC_SERVER_URL',
      'RESEND_API_KEY',
      'S3_ENDPOINT',
      'S3_ACCESS_KEY',
      'S3_SECRET_KEY',
      'S3_BUCKET',
      'ADMIN_EMAIL',
      'ADMIN_PASSWORD'
    ];
    
    const missingVars = requiredVars.filter(v => !envExample.includes(v));
    if (missingVars.length > 0) {
      logError(`Missing required environment variables in .env.example: ${missingVars.join(', ')}`);
      return false;
    }
    
    logSuccess('Environment configuration example is complete');
    return true;
  },

  // Check component database isolation
  checkComponentIsolation() {
    logSection('Checking Component Database Isolation');
    
    const componentsToCheck = [
      'src/components/common/layout/header/info-navbar/InfoNavbar.tsx',
      'src/app/(app)/(with-global-layout)/layout.tsx',
      'src/app/(app)/(with-global-layout)/producties/page.tsx'
    ];
    
    let hasIssues = false;
    for (const file of componentsToCheck) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        // Check if file queries database without checking for fake URL
        if ((content.includes('payload.find') || content.includes('getPayload')) && 
            !content.includes('fake:fake@fake')) {
          logWarning(`${file} may need database isolation check`);
          hasIssues = true;
        }
      }
    }
    
    if (!hasIssues) {
      logSuccess('Component database isolation looks good');
    }
    
    return !hasIssues;
  },

  // Check package.json scripts
  checkPackageScripts() {
    logSection('Checking Package Scripts');
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredScripts = [
      'build',
      'start',
      'payload generate:types',
      'payload generate:importmap',
      'payload migrate'
    ];
    
    const scripts = packageJson.scripts || {};
    const missingScripts = requiredScripts.filter(s => !scripts[s.replace(' ', ':')]);
    
    if (missingScripts.length > 0) {
      logError(`Missing required scripts: ${missingScripts.join(', ')}`);
      return false;
    }
    
    logSuccess('Package scripts configured correctly');
    return true;
  },

  // Run a test build
  async testBuild() {
    logSection('Testing Production Build');
    
    try {
      log('Running production build test (this may take a minute)...', COLORS.YELLOW);
      
      // Set fake database URL for build test
      const env = {
        ...process.env,
        DATABASE_URL: 'postgresql://fake:fake@fake:5432/fake',
        NODE_ENV: 'production'
      };
      
      execSync('bun run build', {
        stdio: 'pipe',
        env
      });
      
      logSuccess('Production build test passed');
      return true;
    } catch (error) {
      logError('Production build failed!');
      console.error(error.message);
      return false;
    }
  }
};

async function main() {
  logSection('PRE-DEPLOYMENT VALIDATION');
  
  const results = [];
  let allPassed = true;
  
  // Run all validations
  for (const [name, validator] of Object.entries(validations)) {
    try {
      const passed = await validator();
      results.push({ name, passed });
      allPassed = allPassed && passed;
    } catch (error) {
      logError(`Validation ${name} failed with error: ${error.message}`);
      results.push({ name, passed: false });
      allPassed = false;
    }
  }
  
  // Summary
  logSection('VALIDATION SUMMARY');
  
  results.forEach(({ name, passed }) => {
    const status = passed ? `${COLORS.GREEN}PASSED` : `${COLORS.RED}FAILED`;
    console.log(`  ${name}: ${status}${COLORS.RESET}`);
  });
  
  if (allPassed) {
    log(`\n${COLORS.GREEN}${COLORS.BOLD}🎉 ALL VALIDATIONS PASSED!${COLORS.RESET}`, '');
    log('\nYour deployment is ready. Next steps:', COLORS.CYAN);
    log('1. Ensure all environment variables are set in Coolify', COLORS.WHITE);
    log('2. Deploy using the production Dockerfile', COLORS.WHITE);
    log('3. Monitor logs during first deployment', COLORS.WHITE);
    log('4. Test health endpoint after deployment', COLORS.WHITE);
    process.exit(0);
  } else {
    log(`\n${COLORS.RED}${COLORS.BOLD}❌ VALIDATION FAILED${COLORS.RESET}`, '');
    log('\nPlease fix the issues above before deploying.', COLORS.YELLOW);
    log('\nQuick fixes:', COLORS.CYAN);
    log('1. cp Dockerfile.production Dockerfile', COLORS.WHITE);
    log('2. cp scripts/docker-entrypoint-v2.sh scripts/docker-entrypoint.sh', COLORS.WHITE);
    log('3. rm scripts/direct-db-init.js', COLORS.WHITE);
    log('4. rm scripts/fix-coolify-production-issues.js', COLORS.WHITE);
    process.exit(1);
  }
}

// Run validation
if (require.main === module) {
  main().catch(error => {
    logError(`Validation failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  });
}