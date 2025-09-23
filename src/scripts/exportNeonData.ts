#!/usr/bin/env bun
/**
 * Export essential data from Neon database using minimal network transfer
 * This script exports only the most critical data to work around network limits
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

// Configuration
const NEON_DATABASE_URL = process.env.NEON_DATABASE_URL || '';
const OUTPUT_DIR = path.join(process.cwd(), 'neon-export');

// Tables to export (ordered by priority)
const CRITICAL_TABLES = [
  'pages',
  'pages_blocks',
  'voiceovers',
  'productions',
  'extra_services',
  'extra_services_production_price_overrides',
  'users',
  'categories',
  'blog_posts',
  'pages_rels',
  'blog_posts_rels',
];

async function ensureOutputDir() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`✅ Created output directory: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('❌ Failed to create output directory:', error);
    process.exit(1);
  }
}

async function exportTable(tableName: string) {
  if (!NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL environment variable not set');
  }

  const outputFile = path.join(OUTPUT_DIR, `${tableName}.sql`);

  // Use pg_dump with specific table and minimal options
  const command = `pg_dump "${NEON_DATABASE_URL}" \
    --table="${tableName}" \
    --no-owner \
    --no-privileges \
    --no-comments \
    --data-only \
    --disable-triggers \
    --file="${outputFile}"`;

  console.log(`📤 Exporting table: ${tableName}...`);

  try {
    await execAsync(command);
    const stats = await fs.stat(outputFile);
    console.log(`   ✅ Exported ${tableName} (${(stats.size / 1024).toFixed(2)} KB)`);
    return true;
  } catch (error: any) {
    console.error(`   ❌ Failed to export ${tableName}:`, error.message);
    return false;
  }
}

async function exportCriticalData() {
  console.log('🚀 Starting Neon data export with minimal network usage...\n');

  await ensureOutputDir();

  let successCount = 0;
  const failedTables: string[] = [];

  for (const table of CRITICAL_TABLES) {
    const success = await exportTable(table);
    if (success) {
      successCount++;
    } else {
      failedTables.push(table);

      // Stop if we hit network limits
      if (failedTables.length >= 3) {
        console.log('\n⚠️  Multiple failures detected - may have hit network limit');
        break;
      }
    }
  }

  console.log('\n📊 Export Summary:');
  console.log(`   ✅ Successfully exported: ${successCount} tables`);
  console.log(`   ❌ Failed tables: ${failedTables.join(', ') || 'None'}`);
  console.log(`   📁 Output directory: ${OUTPUT_DIR}`);

  // Generate import script
  await generateImportScript(successCount);
}

async function generateImportScript(tableCount: number) {
  const importScript = `#!/bin/bash
# Import script for exported Neon data

DATABASE_URL="$1"
if [ -z "$DATABASE_URL" ]; then
  echo "Usage: ./import-neon-data.sh <DATABASE_URL>"
  exit 1
fi

echo "🚀 Importing ${tableCount} tables..."

${CRITICAL_TABLES.slice(0, tableCount)
  .map(
    (table) => `
# Import ${table}
if [ -f "${table}.sql" ]; then
  echo "📥 Importing ${table}..."
  psql "$DATABASE_URL" < "${table}.sql"
else
  echo "⚠️  Skipping ${table} (file not found)"
fi
`
  )
  .join('\n')}

echo "✅ Import complete!"
`;

  const scriptPath = path.join(OUTPUT_DIR, 'import-neon-data.sh');
  await fs.writeFile(scriptPath, importScript);
  await fs.chmod(scriptPath, 0o755);
  console.log(`\n📝 Generated import script: ${scriptPath}`);
}

// Alternative: Export as CSV for even smaller transfer
async function exportTableAsCSV(tableName: string) {
  if (!NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL environment variable not set');
  }

  const outputFile = path.join(OUTPUT_DIR, `${tableName}.csv`);

  // Use psql with COPY command
  const command = `psql "${NEON_DATABASE_URL}" -c "\\COPY ${tableName} TO '${outputFile}' WITH CSV HEADER"`;

  console.log(`📤 Exporting table as CSV: ${tableName}...`);

  try {
    await execAsync(command);
    const stats = await fs.stat(outputFile);
    console.log(`   ✅ Exported ${tableName} (${(stats.size / 1024).toFixed(2)} KB)`);
    return true;
  } catch (error: any) {
    console.error(`   ❌ Failed to export ${tableName}:`, error.message);
    return false;
  }
}

// Main execution
if (import.meta.main) {
  exportCriticalData().catch((error) => {
    console.error('❌ Export failed:', error);
    process.exit(1);
  });
}
