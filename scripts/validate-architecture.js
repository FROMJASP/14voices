#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

let hasErrors = false;

function error(message) {
  console.error(`${colors.red}❌ ${message}${colors.reset}`);
  hasErrors = true;
}

function warning(message) {
  console.warn(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function success(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function info(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

// Check domain boundaries
function checkDomainBoundaries() {
  info('Checking domain boundaries...');

  const domainsDir = path.join(__dirname, '../src/domains');
  const collectionsDir = path.join(__dirname, '../src/collections');

  // Check that collections don't import from domains
  try {
    const result = execSync(`grep -r "from ['\\"].*domains" ${collectionsDir} || true`, {
      encoding: 'utf-8',
    });

    if (result.trim()) {
      error('Collections should not import from domains:');
      console.log(result);
    }
  } catch (e) {
    // grep returns non-zero if no matches, which is what we want
  }

  // Check cross-domain imports
  if (fs.existsSync(domainsDir)) {
    const domains = fs
      .readdirSync(domainsDir)
      .filter((d) => fs.statSync(path.join(domainsDir, d)).isDirectory());

    domains.forEach((domain) => {
      const domainPath = path.join(domainsDir, domain);
      try {
        const result = execSync(
          `grep -r "from ['\\"]\\.\\./" ${domainPath} | grep -v "${domain}" | grep "domains/" || true`,
          { encoding: 'utf-8' }
        );

        if (result.trim()) {
          error(`Domain "${domain}" has cross-domain imports:`);
          console.log(result);
        }
      } catch (e) {
        // Expected when no cross-domain imports
      }
    });
  }

  if (!hasErrors) {
    success('Domain boundaries check passed');
  }
}

// Check component organization
function checkComponentPatterns() {
  info('Checking component patterns...');

  const componentsDir = path.join(__dirname, '../src/components');

  // Check admin components aren't imported outside admin
  try {
    const result = execSync(
      `grep -r "from ['\\"].*admin/" ${componentsDir} | grep -v "${componentsDir}/admin/" || true`,
      { encoding: 'utf-8' }
    );

    if (result.trim()) {
      error('Admin components imported outside admin folder:');
      console.log(result);
    }
  } catch (e) {
    // Expected when no violations
  }

  // Check that domain components don't contain repositories or services
  const domainComponentsDir = path.join(componentsDir, 'domains');
  if (fs.existsSync(domainComponentsDir)) {
    try {
      const result = execSync(
        `grep -r "Repository\\|Service" ${domainComponentsDir} | grep -E "class|interface|type.*Repository|type.*Service" || true`,
        { encoding: 'utf-8' }
      );

      if (result.trim()) {
        warning('Domain components may contain business logic:');
        console.log(result);
      }
    } catch (e) {
      // Expected when no violations
    }
  }

  if (!hasErrors) {
    success('Component patterns check passed');
  }
}

// Check for common Payload type issues
function checkPayloadTypes() {
  info('Checking Payload type usage...');

  const srcDir = path.join(__dirname, '../src');

  // Check for Where type imports
  try {
    const filesUsingWhere = execSync(
      `grep -r "\\bWhere\\b" ${srcDir} --include="*.ts" --include="*.tsx" | grep -v "import.*Where.*from.*payload" | grep -v "node_modules" || true`,
      { encoding: 'utf-8' }
    );

    if (filesUsingWhere.trim()) {
      const lines = filesUsingWhere.trim().split('\n');
      lines.forEach((line) => {
        if (line.includes(': Where') || line.includes('<Where>')) {
          warning(`Possible missing Where import: ${line}`);
        }
      });
    }
  } catch (e) {
    // Expected when no issues
  }

  // Check for numeric ID conversions
  try {
    const userIdUsage = execSync(
      `grep -r "user:.*\\.id[^)]" ${srcDir} --include="*.ts" --include="*.tsx" | grep -v "Number(" | grep -v "String(" | grep -v "node_modules" || true`,
      { encoding: 'utf-8' }
    );

    if (userIdUsage.trim()) {
      warning('Possible missing ID type conversion for Payload:');
      console.log(userIdUsage);
    }
  } catch (e) {
    // Expected when no issues
  }

  success('Payload type check completed');
}

// Check for build-blocking issues
function checkBuildBlockers() {
  info('Checking for common build blockers...');

  // Check for console.log in production code
  try {
    const consoleLogs = execSync(
      `grep -r "console\\.log" src/ --include="*.ts" --include="*.tsx" | grep -v "test" | grep -v "seed" | grep -v "scripts" || true`,
      { encoding: 'utf-8' }
    );

    if (consoleLogs.trim()) {
      warning('console.log statements found in production code:');
      const lines = consoleLogs.trim().split('\n');
      lines.slice(0, 5).forEach((line) => console.log(line));
      if (lines.length > 5) {
        console.log(`... and ${lines.length - 5} more`);
      }
    }
  } catch (e) {
    // Expected when no console.logs
  }

  success('Build blocker check completed');
}

// Main execution
console.log(`${colors.blue}🏗️  Running Architecture Validation${colors.reset}\n`);

checkDomainBoundaries();
console.log('');

checkComponentPatterns();
console.log('');

checkPayloadTypes();
console.log('');

checkBuildBlockers();
console.log('');

if (hasErrors) {
  console.log(`${colors.red}❌ Architecture validation failed!${colors.reset}`);
  process.exit(1);
} else {
  console.log(`${colors.green}✅ All architecture checks passed!${colors.reset}`);
}
