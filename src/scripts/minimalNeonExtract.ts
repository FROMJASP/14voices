#!/usr/bin/env bun
/**
 * Minimal extraction - get only the most critical page block data
 */

import { neon } from '@neondatabase/serverless';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const NEON_URL =
  'postgres://neondb_owner:npg_qZ2OGKbv1tMC@ep-spring-sun-a2r5782c-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function extractMinimal() {
  console.log('🎯 Attempting minimal data extraction...\n');

  const sql = neon(NEON_URL);
  const outputDir = path.join(process.cwd(), 'neon-minimal-extract');
  await mkdir(outputDir, { recursive: true });

  try {
    // Try to get just the page layouts (most critical data)
    console.log('📄 Extracting page layouts only...');

    const pageLayouts = await sql`
      SELECT 
        p.id,
        p.slug,
        p.title,
        p.layout
      FROM pages p
      WHERE p.layout IS NOT NULL
      LIMIT 10
    `;

    if (pageLayouts.length > 0) {
      await writeFile(
        path.join(outputDir, 'page-layouts.json'),
        JSON.stringify(pageLayouts, null, 2)
      );
      console.log(`✅ Saved ${pageLayouts.length} page layouts`);

      // Create update script
      const updateScript = `
// Update existing pages with recovered layouts
import { getPayload } from 'payload';
import configPromise from '../payload.config';
import layouts from './neon-minimal-extract/page-layouts.json';

async function updateLayouts() {
  const payload = await getPayload({ config: configPromise });
  
  for (const pageData of layouts) {
    try {
      const existingPage = await payload.find({
        collection: 'pages',
        where: { slug: { equals: pageData.slug } },
        limit: 1
      });
      
      if (existingPage.docs.length > 0) {
        await payload.update({
          collection: 'pages',
          id: existingPage.docs[0].id,
          data: { layout: pageData.layout }
        });
        console.log(\`✅ Updated layout for: \${pageData.slug}\`);
      }
    } catch (error) {
      console.error(\`Failed to update \${pageData.slug}:\`, error);
    }
  }
}

updateLayouts();
`;

      await writeFile(path.join(outputDir, 'apply-layouts.ts'), updateScript);

      console.log('📝 Created apply-layouts.ts script');
      console.log('\nTo apply the layouts:');
      console.log('bun run neon-minimal-extract/apply-layouts.ts');
    }
  } catch (error: any) {
    if (error.message?.includes('quota')) {
      console.error('❌ Still hitting quota limits');

      // Provide manual recovery instructions
      console.log('\n📋 Manual Recovery Steps:');
      console.log('────────────────────────');
      console.log('Since we cannot access the database programmatically,');
      console.log('you will need to manually recover the data:\n');

      console.log('1. Try accessing https://console.neon.tech');
      console.log('2. If you can login, go to the SQL Editor');
      console.log('3. Run this query:');
      console.log('\n   SELECT slug, title, layout FROM pages;\n');
      console.log('4. Copy the results');
      console.log('5. Save as page-layouts.json');
      console.log('6. Run the apply-layouts.ts script\n');

      console.log('Alternative: Wait for quota reset (usually monthly)');
      console.log('or upgrade to a paid Neon plan temporarily.\n');
    } else {
      console.error('Error:', error);
    }
  }
}

extractMinimal();
