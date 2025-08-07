#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating dependencies...\n');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const devDependencies = Object.keys(packageJson.devDependencies || {});

// Packages that are allowed in devDependencies even if imported
const allowedDevImports = [
  '@types/',
  '@testing-library/',
  '@playwright/',
  'vitest',
  'eslint',
  'prettier',
  'husky',
  'lint-staged',
  'tsx',
  'dotenv',
  '@vitejs/',
  'jsdom',
  '@next/bundle-analyzer',
];

// Function to check if import is allowed in devDependencies
function isAllowedDevImport(packageName) {
  return allowedDevImports.some((allowed) => packageName.includes(allowed));
}

// Function to extract imports from a file
function extractImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = [];

  // Check for CSS imports if it's a CSS file
  if (filePath.endsWith('.css')) {
    const cssImportRegex = /@import\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = cssImportRegex.exec(content)) !== null) {
      const importPath = match[1];
      // Only track external packages (not relative imports or URLs)
      if (
        !importPath.startsWith('.') &&
        !importPath.startsWith('http') &&
        !importPath.startsWith('/')
      ) {
        imports.push(importPath);
      }
    }
  } else {
    // Match various JS/TS import patterns
    const importRegex =
      /(?:import|require)\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)?\s*(?:from)?\s*['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      // Only track external packages (not relative imports)
      if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
        // Extract package name (handle scoped packages)
        const packageName = importPath.startsWith('@')
          ? importPath.split('/').slice(0, 2).join('/')
          : importPath.split('/')[0];
        imports.push(packageName);
      }
    }

    // Also check for dynamic imports (e.g., await import('dotenv'))
    const dynamicImportRegex = /await\s+import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = dynamicImportRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
        const packageName = importPath.startsWith('@')
          ? importPath.split('/').slice(0, 2).join('/')
          : importPath.split('/')[0];

        // Check if the dynamic import is properly guarded
        const importLine = content.substring(match.index - 200, match.index + 200);
        const hasEnvCheck = /process\.env\.NODE_ENV\s*!==?\s*['"]production['"]/.test(importLine);
        const hasTryCatch = /try\s*\{/.test(importLine.substring(0, 200));

        if (!hasEnvCheck || !hasTryCatch) {
          imports.push(packageName);
        }
      }
    }
  }

  return imports;
}

// Function to recursively find all source files
function findSourceFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
        findSourceFiles(fullPath, files);
      }
    } else if (stat.isFile()) {
      // Include TS/JS files and CSS files
      if (/\.(ts|tsx|js|jsx|css)$/.test(item)) {
        // Skip test files
        if (!item.includes('.test.') && !item.includes('.spec.')) {
          files.push(fullPath);
        }
      }
    }
  }

  return files;
}

// Find all source files
const srcPath = path.join(__dirname, '../src');
const sourceFiles = findSourceFiles(srcPath);

// Track imports from devDependencies
const devImportsInProd = new Map();

// Check each source file
for (const file of sourceFiles) {
  try {
    const imports = extractImports(file);

    for (const importName of imports) {
      if (devDependencies.includes(importName) && !isAllowedDevImport(importName)) {
        if (!devImportsInProd.has(importName)) {
          devImportsInProd.set(importName, []);
        }
        devImportsInProd.get(importName).push(file.replace(path.join(__dirname, '../'), ''));
      }
    }
  } catch (error) {
    console.error(`Error processing ${file}: ${error.message}`);
  }
}

// Report results
if (devImportsInProd.size > 0) {
  console.log('❌ Found devDependencies imported in production code:\n');

  for (const [packageName, files] of devImportsInProd) {
    console.log(`📦 ${packageName}`);
    console.log('   Used in:');
    files.slice(0, 5).forEach((file) => console.log(`   - ${file}`));
    if (files.length > 5) {
      console.log(`   ... and ${files.length - 5} more files`);
    }
    console.log('');
  }

  console.log('🔧 Fix: Move these packages from devDependencies to dependencies in package.json\n');
  process.exit(1);
} else {
  console.log('✅ All dependencies are properly categorized!\n');
  console.log('📋 Checked:');
  console.log(`   - ${sourceFiles.length} source files`);
  console.log(`   - ${devDependencies.length} devDependencies`);
  console.log('\n✨ No issues found. Safe to deploy!\n');
}
