#!/usr/bin/env bun
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

      console.log(`📝 Importing ${pagesData.length} pages...`);

      for (const page of pagesData) {
        try {
          // Clean the data
          delete page.id;
          delete page._id;

          await payload.create({
            collection: 'pages',
            data: page,
          });

          console.log(`   ✅ Imported page: ${page.title}`);
        } catch (error) {
          console.error(`   ❌ Failed to import page: ${page.title}`, error);
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

      console.log(`\n📝 Importing ${voiceoversData.length} voiceovers...`);

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

          console.log(`   ✅ Imported voiceover: ${voiceover.name}`);
        } catch (error) {
          console.error(`   ❌ Failed to import voiceover: ${voiceover.name}`, error);
        }
      }
    } catch (error) {
      console.log('⚠️  No voiceovers data found');
    }

    // Add similar blocks for other collections...

    console.log('\n✅ Import complete!');
  } catch (error) {
    console.error('❌ Import failed:', error);
  }

  process.exit(0);
}

importRecoveredData();
