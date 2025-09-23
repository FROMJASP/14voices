#!/usr/bin/env bun
/**
 * Export ALL data from Neon database
 * Attempts multiple methods to work around network transfer limits
 */

import { neon } from '@neondatabase/serverless';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration
const NEON_CONNECTION_STRING = process.env.NEON_DATABASE_URL || '';
const OUTPUT_DIR = path.join(process.cwd(), 'neon-full-export');

// Method 1: Direct SQL dump using Neon's serverless driver
async function exportUsingNeonDriver() {
  console.log('🔄 Method 1: Using Neon serverless driver...');

  const sql = neon(NEON_CONNECTION_STRING);
  const exportData: any = {};

  try {
    // First, get all table names
    const tables = await sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'payload_migrations%'
      AND tablename NOT LIKE '_prisma%'
      ORDER BY tablename
    `;

    console.log(`Found ${tables.length} tables to export`);

    // Export each table
    for (const { tablename } of tables) {
      try {
        console.log(`  📤 Exporting ${tablename}...`);
        const data = await sql(`SELECT * FROM ${tablename}`);
        exportData[tablename] = data;
        console.log(`     ✅ Exported ${data.length} rows`);
      } catch (error) {
        console.log(`     ❌ Failed to export ${tablename}:`, error);
        exportData[tablename] = { error: error.toString() };
      }
    }

    // Save to JSON
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'neon-full-export.json'),
      JSON.stringify(exportData, null, 2)
    );

    console.log('✅ Export complete using Neon driver');
    return true;
  } catch (error) {
    console.error('❌ Neon driver export failed:', error);
    return false;
  }
}

// Method 2: Using pg_dump with compression
async function exportUsingPgDump() {
  console.log('\n🔄 Method 2: Using pg_dump with compression...');

  if (!NEON_CONNECTION_STRING) {
    console.log('  ⚠️  Skipping - no connection string');
    return false;
  }

  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Use compressed format to reduce transfer size
    const dumpFile = path.join(OUTPUT_DIR, 'neon-full-dump.sql.gz');
    const command = `pg_dump "${NEON_CONNECTION_STRING}" --no-owner --no-privileges --compress=9 --file="${dumpFile}"`;

    console.log('  📤 Creating compressed dump...');
    await execAsync(command);

    const stats = await fs.stat(dumpFile);
    console.log(`  ✅ Created dump: ${(stats.size / 1024 / 1024).toFixed(2)} MB (compressed)`);
    return true;
  } catch (error) {
    console.error('  ❌ pg_dump failed:', error);
    return false;
  }
}

// Method 3: Schema-only export + essential data
async function exportSchemaAndEssentialData() {
  console.log('\n🔄 Method 3: Schema + essential data export...');

  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Export schema only (small)
    const schemaFile = path.join(OUTPUT_DIR, 'schema.sql');
    const schemaCommand = `pg_dump "${NEON_CONNECTION_STRING}" --schema-only --no-owner --no-privileges --file="${schemaFile}"`;

    console.log('  📤 Exporting schema...');
    await execAsync(schemaCommand);
    console.log('  ✅ Schema exported');

    // Export essential data tables
    const essentialTables = [
      'pages',
      'pages_blocks',
      'pages_rels',
      'voiceovers',
      'productions',
      'categories',
      'blog_posts',
      'blog_posts_rels',
      'extra_services',
      'extra_services_production_price_overrides',
      'users',
      'media',
      'globals',
    ];

    for (const table of essentialTables) {
      try {
        const dataFile = path.join(OUTPUT_DIR, `data-${table}.sql`);
        const dataCommand = `pg_dump "${NEON_CONNECTION_STRING}" --table="${table}" --data-only --no-owner --no-privileges --file="${dataFile}"`;

        console.log(`  📤 Exporting data for ${table}...`);
        await execAsync(dataCommand);
        console.log(`  ✅ ${table} data exported`);
      } catch (error) {
        console.log(`  ⚠️  Failed to export ${table}`);
      }
    }

    return true;
  } catch (error) {
    console.error('  ❌ Schema export failed:', error);
    return false;
  }
}

// Method 4: Using COPY TO STDOUT (most efficient)
async function exportUsingCopy() {
  console.log('\n🔄 Method 4: Using COPY command for efficiency...');

  const sql = neon(NEON_CONNECTION_STRING);

  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Get all tables
    const tables = await sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `;

    // Create a script to export using COPY
    let exportScript = '-- Neon data export using COPY\n\n';

    for (const { tablename } of tables) {
      exportScript += `\\echo 'Exporting ${tablename}...'\n`;
      exportScript += `\\COPY ${tablename} TO '${tablename}.csv' WITH (FORMAT CSV, HEADER true);\n`;
    }

    await fs.writeFile(path.join(OUTPUT_DIR, 'export-using-copy.sql'), exportScript);

    console.log('  ✅ Created COPY export script');
    console.log('  📝 Run with: psql $NEON_DATABASE_URL < export-using-copy.sql');

    return true;
  } catch (error) {
    console.error('  ❌ COPY script generation failed:', error);
    return false;
  }
}

// Generate comprehensive import script
async function generateImportScript() {
  const importScript = `#!/usr/bin/env bun
/**
 * Import all Neon data into self-hosted database
 */

import { getPayload } from 'payload';
import configPromise from '../../payload.config';
import fs from 'fs/promises';
import path from 'path';
import { sql } from '../../lib/neon/client';

async function importAllData() {
  console.log('🚀 Starting comprehensive data import...');
  
  const payload = await getPayload({ config: configPromise });
  
  try {
    // Method 1: Import from JSON export
    const jsonPath = path.join(process.cwd(), 'neon-full-export/neon-full-export.json');
    if (await fs.access(jsonPath).then(() => true).catch(() => false)) {
      console.log('📥 Importing from JSON export...');
      
      const data = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
      
      // Import tables in dependency order
      const importOrder = [
        'users', 'categories', 'media',
        'pages', 'pages_blocks', 'pages_rels',
        'productions', 'extra_services', 'extra_services_production_price_overrides',
        'voiceovers', 'blog_posts', 'blog_posts_rels'
      ];
      
      for (const table of importOrder) {
        if (data[table] && !data[table].error) {
          console.log(\`\\n📥 Importing \${table}...\`);
          
          for (const row of data[table]) {
            try {
              // Clean payload fields
              const cleanRow = { ...row };
              delete cleanRow._id;
              delete cleanRow.__v;
              delete cleanRow.id; // Let Payload generate new IDs
              
              await payload.create({
                collection: table,
                data: cleanRow,
              });
            } catch (error) {
              console.error(\`  ❌ Failed to import row in \${table}\`, error);
            }
          }
        }
      }
    }
    
    // Method 2: Import from SQL dumps
    const schemaPath = path.join(process.cwd(), 'neon-full-export/schema.sql');
    if (await fs.access(schemaPath).then(() => true).catch(() => false)) {
      console.log('\\n📥 Found SQL dumps - use psql to import:');
      console.log('psql $DATABASE_URL < neon-full-export/schema.sql');
      console.log('psql $DATABASE_URL < neon-full-export/data-*.sql');
    }
    
    console.log('\\n✅ Import process complete!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

importAllData();
`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'import-all-data.ts'), importScript);
  console.log('\n📝 Generated comprehensive import script');
}

// Alternative: Direct database-to-database transfer
async function createDirectTransferScript() {
  const transferScript = `#!/bin/bash
# Direct transfer from Neon to self-hosted database
# This uses pipe to minimize intermediate storage

NEON_DB="${NEON_CONNECTION_STRING}"
TARGET_DB="$1"

if [ -z "$TARGET_DB" ]; then
  echo "Usage: ./direct-transfer.sh <TARGET_DATABASE_URL>"
  exit 1
fi

echo "🚀 Starting direct database transfer..."
echo "⚠️  This will use network transfer - watch for limits!"

# Method 1: Using pg_dump | psql pipe
echo "📤 Transferring schema and data..."
pg_dump "$NEON_DB" --no-owner --no-privileges | psql "$TARGET_DB"

# Method 2: Table by table (if above fails)
# TABLES=(pages pages_blocks voiceovers productions)
# for table in "\${TABLES[@]}"; do
#   echo "📤 Transferring $table..."
#   pg_dump "$NEON_DB" --table="$table" --no-owner | psql "$TARGET_DB"
# done

echo "✅ Transfer complete!"
`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'direct-transfer.sh'), transferScript);
  await fs.chmod(path.join(OUTPUT_DIR, 'direct-transfer.sh'), 0o755);
  console.log('📝 Created direct transfer script');
}

async function main() {
  console.log('🚀 Starting comprehensive Neon data export...\n');

  if (!NEON_CONNECTION_STRING) {
    console.error('❌ NEON_DATABASE_URL environment variable not set!');
    console.log('\n📝 To get your Neon connection string:');
    console.log('1. Check your email for Neon database credentials');
    console.log('2. Look in Vercel project settings if connected');
    console.log('3. Check git history: git log --all -p | grep "neon.tech"');
    console.log('\nThen run:');
    console.log('NEON_DATABASE_URL="postgresql://..." bun run src/scripts/exportAllNeonData.ts');
    process.exit(1);
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Try multiple export methods
  const methods = [
    exportUsingNeonDriver,
    exportUsingPgDump,
    exportSchemaAndEssentialData,
    exportUsingCopy,
  ];

  let success = false;
  for (const method of methods) {
    if (await method()) {
      success = true;
      break; // Stop on first success to save network
    }
  }

  // Generate helper scripts
  await generateImportScript();
  await createDirectTransferScript();

  console.log('\n📊 Export Summary:');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`✅ Export successful: ${success}`);

  if (success) {
    console.log('\n📝 Next steps:');
    console.log('1. Check the export directory for data');
    console.log('2. Use import-all-data.ts to import into self-hosted DB');
    console.log('3. Or use direct-transfer.sh for direct migration');
  }
}

// Run the export
if (import.meta.main) {
  main().catch((error) => {
    console.error('❌ Export failed:', error);
    process.exit(1);
  });
}
