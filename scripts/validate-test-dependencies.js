#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// In production builds, skip this validation
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  console.log('Skipping test dependency validation in production build');
  process.exit(0);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

// Test-related dependencies to check
const testDependencies = [
  '@testing-library/jest-dom',
  '@testing-library/react',
  '@testing-library/user-event',
  'vitest',
  'jsdom',
];

function validateTestDependencies() {
  const errors = [];

  // Check if test dependencies are in production dependencies
  testDependencies.forEach((dep) => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      errors.push(`Warning: Test dependency ${dep} should NOT be in dependencies`);
    }
  });

  // Check for imports of test dependencies in production files
  // Skip test directories and test files
  const checkProductionFiles = (dir) => {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      // Skip test directories and files
      if (
        file === 'test' ||
        file === '__tests__' ||
        file.includes('.test.') ||
        file.includes('.spec.')
      ) {
        return;
      }

      if (stat.isDirectory() && !['node_modules', '.next', 'build'].includes(file)) {
        checkProductionFiles(filePath);
      } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(file)) {
        const content = fs.readFileSync(filePath, 'utf8');
        testDependencies.forEach((dep) => {
          if (content.includes(`from '${dep}'`) || content.includes(`from "${dep}"`)) {
            errors.push(
              `ERROR: Test dependency ${dep} imported in production file: ${filePath.replace(path.join(__dirname, '..'), '')}`
            );
          }
        });
      }
    });
  };

  // Only check src directory for production imports
  const srcDir = path.join(__dirname, '..', 'src');
  if (fs.existsSync(srcDir)) {
    checkProductionFiles(srcDir);
  }

  if (errors.length > 0) {
    console.error('Test Dependency Validation Errors:');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }
}

validateTestDependencies();
