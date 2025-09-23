#!/usr/bin/env bun
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
    if (
      await fs
        .access(jsonPath)
        .then(() => true)
        .catch(() => false)
    ) {
      console.log('📥 Importing from JSON export...');

      const data = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

      // Import tables in dependency order
      const importOrder = [
        'users',
        'categories',
        'media',
        'pages',
        'pages_blocks',
        'pages_rels',
        'productions',
        'extra_services',
        'extra_services_production_price_overrides',
        'voiceovers',
        'blog_posts',
        'blog_posts_rels',
      ];

      for (const table of importOrder) {
        if (data[table] && !data[table].error) {
          console.log(`\n📥 Importing ${table}...`);

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
              console.error(`  ❌ Failed to import row in ${table}`, error);
            }
          }
        }
      }
    }

    // Method 2: Import from SQL dumps
    const schemaPath = path.join(process.cwd(), 'neon-full-export/schema.sql');
    if (
      await fs
        .access(schemaPath)
        .then(() => true)
        .catch(() => false)
    ) {
      console.log('\n📥 Found SQL dumps - use psql to import:');
      console.log('psql $DATABASE_URL < neon-full-export/schema.sql');
      console.log('psql $DATABASE_URL < neon-full-export/data-*.sql');
    }

    console.log('\n✅ Import process complete!');
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

importAllData();
