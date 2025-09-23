#!/usr/bin/env bun
/**
 * Minimal Neon data export using direct queries
 * This approach uses less network transfer by querying specific data
 */

import { neon } from '@neondatabase/serverless';
import fs from 'fs/promises';
import path from 'path';

// Configuration - you need to set this
const NEON_CONNECTION_STRING = process.env.NEON_DATABASE_URL || 'YOUR_NEON_CONNECTION_STRING_HERE';
const OUTPUT_DIR = path.join(process.cwd(), 'neon-export-minimal');

async function ensureOutputDir() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`✅ Created output directory: ${OUTPUT_DIR}`);
}

async function exportPagesData() {
  const sql = neon(NEON_CONNECTION_STRING);

  try {
    // Export pages with their blocks
    console.log('📤 Exporting pages data...');

    // Get pages
    const pages = await sql`
      SELECT * FROM pages 
      ORDER BY created_at DESC
    `;

    console.log(`   Found ${pages.length} pages`);

    // Get page blocks for each page
    const pageBlocks: any = {};
    for (const page of pages) {
      try {
        const blocks = await sql`
          SELECT * FROM pages_blocks 
          WHERE pages_id = ${page.id}
          ORDER BY _order ASC
        `;
        pageBlocks[page.id] = blocks;
        console.log(`   ✅ Got ${blocks.length} blocks for page: ${page.title || page.slug}`);
      } catch (error) {
        console.log(`   ⚠️  Failed to get blocks for page ${page.id}`);
      }
    }

    // Save data
    const exportData = {
      pages,
      pageBlocks,
      exportedAt: new Date().toISOString(),
    };

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'pages-export.json'),
      JSON.stringify(exportData, null, 2)
    );

    console.log('✅ Pages data exported');
    return true;
  } catch (error) {
    console.error('❌ Failed to export pages:', error);
    return false;
  }
}

async function exportVoiceoversData() {
  const sql = neon(NEON_CONNECTION_STRING);

  try {
    console.log('📤 Exporting voiceovers data...');

    const voiceovers = await sql`
      SELECT * FROM voiceovers 
      ORDER BY created_at DESC
    `;

    console.log(`   Found ${voiceovers.length} voiceovers`);

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'voiceovers-export.json'),
      JSON.stringify(voiceovers, null, 2)
    );

    console.log('✅ Voiceovers data exported');
    return true;
  } catch (error) {
    console.error('❌ Failed to export voiceovers:', error);
    return false;
  }
}

async function exportProductionsData() {
  const sql = neon(NEON_CONNECTION_STRING);

  try {
    console.log('📤 Exporting productions data...');

    const productions = await sql`
      SELECT * FROM productions 
      ORDER BY created_at DESC
    `;

    console.log(`   Found ${productions.length} productions`);

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'productions-export.json'),
      JSON.stringify(productions, null, 2)
    );

    console.log('✅ Productions data exported');
    return true;
  } catch (error) {
    console.error('❌ Failed to export productions:', error);
    return false;
  }
}

async function generateImportScript() {
  const importScript = `#!/usr/bin/env bun
/**
 * Import exported Neon data into new database
 */

import { getPayload } from 'payload';
import configPromise from '../../payload.config';
import fs from 'fs/promises';
import path from 'path';

async function importData() {
  const payload = await getPayload({ config: configPromise });
  
  try {
    // Import pages
    const pagesData = JSON.parse(
      await fs.readFile(path.join(process.cwd(), 'neon-export-minimal/pages-export.json'), 'utf-8')
    );
    
    console.log('📥 Importing pages...');
    
    for (const page of pagesData.pages) {
      // Clean up the data
      delete page._id;
      delete page.__v;
      
      try {
        await payload.create({
          collection: 'pages',
          data: page,
        });
        console.log(\`   ✅ Imported page: \${page.title || page.slug}\`);
      } catch (error) {
        console.error(\`   ❌ Failed to import page: \${page.title}\`, error);
      }
    }
    
    console.log('✅ Import complete!');
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

importData();
`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'import-data.ts'), importScript);
  console.log('📝 Generated import script');
}

async function main() {
  console.log('🚀 Starting minimal Neon data export...\n');

  if (NEON_CONNECTION_STRING === 'YOUR_NEON_CONNECTION_STRING_HERE') {
    console.error('❌ Please set NEON_DATABASE_URL environment variable');
    console.log('\nTo find your Neon connection string:');
    console.log('1. Try to access https://console.neon.tech');
    console.log('2. If you can login, go to your project');
    console.log('3. Copy the connection string');
    console.log(
      '4. Run: NEON_DATABASE_URL="your-connection-string" bun run src/scripts/exportNeonDataMinimal.ts'
    );
    process.exit(1);
  }

  await ensureOutputDir();

  // Export data with minimal network usage
  await exportPagesData();
  await exportVoiceoversData();
  await exportProductionsData();

  await generateImportScript();

  console.log('\n✅ Export complete!');
  console.log(`📁 Data saved to: ${OUTPUT_DIR}`);
}

// Run the export
if (import.meta.main) {
  main().catch((error) => {
    console.error('❌ Export failed:', error);
    process.exit(1);
  });
}
