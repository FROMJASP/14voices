#!/usr/bin/env bun
/**
 * Debug script to check page data
 */

import { getPayload } from 'payload';
import configPromise from '../payload.config';

async function debugPageData() {
  console.log('🔍 Debugging page data...\n');

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    // Get home page
    const pages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
        status: {
          equals: 'published',
        },
      },
      limit: 1,
      depth: 2,
    });

    const page = pages.docs[0];

    if (!page) {
      console.log('❌ No home page found!');
      return;
    }

    console.log('✅ Home page found:');
    console.log('  ID:', page.id);
    console.log('  Title:', page.title);
    console.log('  Slug:', page.slug);
    console.log('  Status:', page.status);
    console.log('  Has layout:', Array.isArray(page.layout));

    if (page.layout) {
      console.log(`  Layout blocks: ${page.layout.length}`);
      page.layout.forEach((block: any, index: number) => {
        console.log(
          `    ${index + 1}. ${block.blockType}${block.enabled === false ? ' (disabled)' : ''}`
        );
      });
    }

    // Check if page is rendered correctly
    console.log('\n📄 Page structure:');
    console.log(JSON.stringify(page, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugPageData();
