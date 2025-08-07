#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}`),
};

// Track if any validation failed
let hasErrors = false;

// 1. Check TypeScript compilation
log.section('🔍 Running TypeScript type check...');
try {
  execSync('bun run typecheck', { stdio: 'inherit' });
  log.success('TypeScript compilation passed');
} catch (error) {
  log.error('TypeScript compilation failed');
  hasErrors = true;
}

// 2. Check for dependency issues
log.section('📦 Validating dependencies...');
try {
  execSync('node scripts/validate-dependencies.js', { stdio: 'inherit' });
  log.success('Dependencies properly categorized');
} catch (error) {
  log.error('Dependency validation failed');
  hasErrors = true;
}

// 3. Check for common import issues
log.section('🔎 Checking for common import issues...');

const commonIssues = [
  {
    pattern: /await\s+import\s*\(\s*['"]dotenv['"]\s*\)/,
    message: 'Unguarded dotenv import found',
    fix: 'Wrap dotenv imports with NODE_ENV check and try-catch',
    check: (content, match) => {
      // Check if the import is properly guarded
      const index = content.indexOf(match);
      const before = content.substring(Math.max(0, index - 500), index);
      return !before.includes('process.env.NODE_ENV') || !before.includes('try');
    },
  },
  {
    pattern: /import\s+type\s*\{[^}]*\}\s*from\s*['"]payload['"];?/,
    message: 'Missing Where type import',
    check: (content) => {
      // Check if Where is used but not imported
      const usesWhere = content.includes(': Where');
      const importsWhere = /import\s+type\s*\{[^}]*Where[^}]*\}\s*from\s*['"]payload['"]/.test(content);
      return usesWhere && !importsWhere;
    },
  },
  {
    pattern: /user:\s*currentUser\.id[,\s;]/,
    message: 'Potential Payload ID type mismatch',
    fix: 'Use Number(currentUser.id) for numeric IDs',
  },
];

function checkFileForIssues(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  for (const issue of commonIssues) {
    if (issue.pattern) {
      const match = content.match(issue.pattern);
      if (match) {
        if (issue.check) {
          if (issue.check(content, match[0])) {
            issues.push({
              file: filePath.replace(process.cwd() + '/', ''),
              message: issue.message,
              fix: issue.fix,
            });
          }
        } else {
          issues.push({
            file: filePath.replace(process.cwd() + '/', ''),
            message: issue.message,
            fix: issue.fix,
          });
        }
      }
    } else if (issue.check && issue.check(content)) {
      issues.push({
        file: filePath.replace(process.cwd() + '/', ''),
        message: issue.message,
        fix: issue.fix,
      });
    }
  }
  
  return issues;
}

function findSourceFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
        findSourceFiles(fullPath, files);
      }
    } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

const sourceFiles = findSourceFiles(path.join(__dirname, '../src'));
const allIssues = [];

for (const file of sourceFiles) {
  try {
    const issues = checkFileForIssues(file);
    allIssues.push(...issues);
  } catch (error) {
    // Skip files that can't be read
  }
}

if (allIssues.length > 0) {
  log.warning(`Found ${allIssues.length} potential issues:`);
  allIssues.forEach((issue) => {
    console.log(`  ${issue.file}:`);
    console.log(`    ${issue.message}`);
    if (issue.fix) {
      console.log(`    Fix: ${issue.fix}`);
    }
  });
  hasErrors = true;
} else {
  log.success('No common import issues found');
}

// 4. Test production build
log.section('🏗️  Testing production build...');
try {
  log.info('This may take a few minutes...');
  execSync('bun run build', { stdio: 'inherit' });
  log.success('Production build succeeded');
} catch (error) {
  log.error('Production build failed');
  hasErrors = true;
}

// 5. Check for build output warnings
log.section('⚠️  Checking for build warnings...');
const buildLogPath = path.join(__dirname, '../.next/build-manifest.json');
if (fs.existsSync(buildLogPath)) {
  log.success('Build manifest generated');
} else {
  log.warning('Build manifest not found - build may have issues');
}

// Final report
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  log.error('❌ VALIDATION FAILED - DO NOT PUSH TO PRODUCTION');
  console.log('\nPlease fix all issues before pushing to prevent build failures.');
  console.log('\nRun this command again after fixing: bun run validate:build');
  process.exit(1);
} else {
  log.success('✅ ALL VALIDATIONS PASSED - SAFE TO PUSH');
  console.log('\nYour code is ready for production deployment!');
  console.log('\n🚀 Next steps:');
  console.log('   1. git add -A');
  console.log('   2. git commit -m "your message"');
  console.log('   3. git push');
}