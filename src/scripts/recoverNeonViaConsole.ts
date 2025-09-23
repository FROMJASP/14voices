#!/usr/bin/env bun
/**
 * Alternative Neon data recovery via console access
 * This script helps recover data by accessing Neon's web console
 */

import { writeFile } from 'fs/promises';
import path from 'path';

console.log('📋 Neon Data Recovery Guide\n');

console.log('Since your Neon database has exceeded its data transfer quota,');
console.log('we need to use alternative methods to recover your data.\n');

console.log('🔧 Option 1: Use Neon SQL Editor (if you can still access the console)');
console.log('───────────────────────────────────────────────────────────────────');
console.log('1. Go to https://console.neon.tech');
console.log('2. Navigate to your project: "spring-sun-a2r5782c"');
console.log('3. Click on "SQL Editor" in the left sidebar');
console.log('4. Run these queries one by one and save the results:\n');

const queries = [
  {
    name: 'pages_with_blocks',
    description: 'Export pages with their blocks',
    query: `
-- Get all pages with their block data
SELECT 
  p.id,
  p.title,
  p.slug,
  p.status,
  p.layout,
  p.meta,
  p.created_at,
  p.updated_at
FROM pages p
ORDER BY p.created_at DESC;

-- Get page blocks separately if needed
SELECT 
  pb.*,
  p.title as page_title,
  p.slug as page_slug
FROM pages_blocks pb
JOIN pages p ON p.id = pb.pages_id
ORDER BY pb.pages_id, pb._order;
    `,
  },
  {
    name: 'voiceovers',
    description: 'Export all voiceover data',
    query: `
SELECT 
  v.id,
  v.name,
  v.slug,
  v.status,
  v.meta_tags,
  v.languages,
  v.group,
  v.profile_photo,
  v.full_demo_reel,
  v.created_at,
  v.updated_at
FROM voiceovers v
ORDER BY v.created_at DESC;
    `,
  },
  {
    name: 'productions',
    description: 'Export production data',
    query: `
SELECT 
  p.id,
  p.name,
  p.slug,
  p.status,
  p.base_price,
  p.includes_music_composition,
  p.created_at
FROM productions p
ORDER BY p.name;
    `,
  },
  {
    name: 'blog_posts',
    description: 'Export blog posts',
    query: `
SELECT 
  bp.id,
  bp.title,
  bp.slug,
  bp.status,
  bp.excerpt,
  bp.content,
  bp.featured_image,
  bp.publish_date,
  bp.created_at
FROM blog_posts bp
ORDER BY bp.publish_date DESC;
    `,
  },
  {
    name: 'categories',
    description: 'Export categories',
    query: `
SELECT * FROM categories ORDER BY name;
    `,
  },
  {
    name: 'media',
    description: 'Export media references',
    query: `
SELECT 
  id,
  filename,
  mime_type,
  filesize,
  url,
  created_at
FROM media
ORDER BY created_at DESC
LIMIT 100;
    `,
  },
];

// Save queries to file
const queriesContent = queries
  .map((q) => `-- ${q.description}\n-- Save as: ${q.name}.json\n${q.query}\n`)
  .join('\n'.repeat(3));

await writeFile(path.join(process.cwd(), 'neon-recovery-queries.sql'), queriesContent);

console.log('💾 Queries saved to: neon-recovery-queries.sql\n');

console.log('📝 For each query:');
console.log('   1. Run the query in Neon SQL Editor');
console.log('   2. Click "Download" or copy the results');
console.log('   3. Save as JSON format if possible\n');

console.log('\n🔧 Option 2: Use Vercel Integration (if your project is connected)');
console.log('─────────────────────────────────────────────────────────────────');
console.log('1. Go to your Vercel project dashboard');
console.log('2. Check Environment Variables for the Neon connection');
console.log('3. Look for any Neon integration that might allow data access\n');

console.log('\n🔧 Option 3: Check Browser Developer Tools');
console.log('──────────────────────────────────────────');
console.log('If you can access Neon console:');
console.log('1. Open Developer Tools (F12)');
console.log('2. Go to Network tab');
console.log('3. Navigate through your tables in Neon console');
console.log('4. Look for API calls that return your data');
console.log('5. Copy the response data from these calls\n');

console.log('\n🔧 Option 4: Contact Neon Support');
console.log('─────────────────────────────────');
console.log('1. Explain that you need a one-time data export');
console.log('2. Your project ID: spring-sun-a2r5782c');
console.log('3. Ask if they can provide a database dump\n');

console.log('\n📦 After recovering data:');
console.log('1. Save all JSON/CSV files to a "neon-recovered-data" folder');
console.log('2. Run: bun run src/scripts/importRecoveredData.ts');
console.log('3. This will import the data into your self-hosted database\n');

// Create import script template
const importScript = `#!/usr/bin/env bun
/**
 * Import recovered Neon data into self-hosted database
 */

import { getPayload } from 'payload';
import configPromise from '../payload.config';
import { readFile } from 'fs/promises';
import path from 'path';

async function importRecoveredData() {
  console.log('📥 Importing recovered Neon data...');
  
  const payload = await getPayload({
    config: configPromise,
  });
  
  const dataDir = path.join(process.cwd(), 'neon-recovered-data');
  
  try {
    // Import pages
    try {
      const pagesData = JSON.parse(
        await readFile(path.join(dataDir, 'pages_with_blocks.json'), 'utf-8')
      );
      
      console.log(\`📝 Importing \${pagesData.length} pages...\`);
      
      for (const page of pagesData) {
        try {
          // Clean the data
          delete page.id;
          delete page._id;
          
          await payload.create({
            collection: 'pages',
            data: page,
          });
          
          console.log(\`   ✅ Imported page: \${page.title}\`);
        } catch (error) {
          console.error(\`   ❌ Failed to import page: \${page.title}\`, error);
        }
      }
    } catch (error) {
      console.log('⚠️  No pages data found');
    }
    
    // Import voiceovers
    try {
      const voiceoversData = JSON.parse(
        await readFile(path.join(dataDir, 'voiceovers.json'), 'utf-8')
      );
      
      console.log(\`\\n📝 Importing \${voiceoversData.length} voiceovers...\`);
      
      for (const voiceover of voiceoversData) {
        try {
          delete voiceover.id;
          
          // Set defaults for required fields
          if (!voiceover.group) voiceover.group = 'nederlands';
          if (voiceover.status === 'active' && !voiceover.profilePhoto) {
            voiceover.status = 'draft';
          }
          
          await payload.create({
            collection: 'voiceovers',
            data: voiceover,
          });
          
          console.log(\`   ✅ Imported voiceover: \${voiceover.name}\`);
        } catch (error) {
          console.error(\`   ❌ Failed to import voiceover: \${voiceover.name}\`, error);
        }
      }
    } catch (error) {
      console.log('⚠️  No voiceovers data found');
    }
    
    // Add similar blocks for other collections...
    
    console.log('\\n✅ Import complete!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
  
  process.exit(0);
}

importRecoveredData();
`;

await writeFile(path.join(process.cwd(), 'src/scripts/importRecoveredData.ts'), importScript);

console.log('✅ Created import script: src/scripts/importRecoveredData.ts');
