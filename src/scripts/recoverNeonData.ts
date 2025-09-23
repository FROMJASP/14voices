#!/usr/bin/env bun
/**
 * Comprehensive Neon data recovery solution
 * Combines multiple approaches to recover all data
 */

import { getPayload } from 'payload';
import configPromise from '../payload.config';

async function recoverData() {
  console.log('🚀 Starting Neon data recovery process...\n');

  const payload = await getPayload({
    config: configPromise,
  });

  try {
    // Step 1: Fix migration constraints first
    console.log('📋 Step 1: Fixing migration constraints...');

    const db = payload.db as any;

    // Fix the constraint error
    try {
      await db.drizzle.execute(`
        ALTER TABLE extra_services_production_price_overrides 
        DROP CONSTRAINT IF EXISTS extra_services_production_price_overrides_production_id_product
      `);
      console.log('✅ Dropped malformed constraint');
    } catch (e) {
      console.log('⚠️  Constraint already fixed or does not exist');
    }

    // Step 2: Re-seed pages with blocks
    console.log('\n📋 Step 2: Re-seeding pages with blocks...');

    // Import and run the seed function
    const { seedPages } = await import('../seed/pages');

    // Clear existing pages if needed
    const existingPages = await payload.find({
      collection: 'pages',
      limit: 100,
    });

    if (existingPages.docs.length === 0) {
      console.log('📝 No pages found, creating from seed...');
      await seedPages(payload);
    } else {
      console.log(`ℹ️  Found ${existingPages.docs.length} existing pages`);

      // Check if pages have blocks
      for (const page of existingPages.docs) {
        if (!page.layout || page.layout.length === 0) {
          console.log(`⚠️  Page "${page.title}" has no blocks, updating...`);

          // Get the layout from seed data
          const seedLayouts: any = {
            home: [
              {
                blockType: 'hero-v1',
                processSteps: [
                  { text: '1. Kies de stem' },
                  { text: '2. Upload script' },
                  { text: '3. Ontvang audio' },
                ],
                title: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'heading',
                        tag: 'h1',
                        children: [
                          { type: 'text', text: 'Professionele ' },
                          { type: 'text', text: 'voice-overs', format: ['bold'] },
                          { type: 'text', text: ' voor elk project' },
                        ],
                      },
                    ],
                  },
                },
                description: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            text: 'Van commercials tot bedrijfsfilms, wij leveren de perfecte stem voor jouw project. Ontdek onze professionele stemacteurs en vraag direct een offerte aan.',
                          },
                        ],
                      },
                    ],
                  },
                },
                cta: {
                  primaryLabel: 'Hoor het verschil',
                  primaryUrl: '/voiceovers',
                  primaryStyle: {
                    backgroundColor: '#000000',
                    textColor: '#FFFFFF',
                    borderRadius: 'rounded',
                    icon: 'arrow-right',
                    iconPosition: 'right',
                  },
                  secondaryLabel: 'Bekijk prijzen',
                  secondaryUrl: '#prijzen',
                  secondaryStyle: {
                    backgroundColor: 'transparent',
                    textColor: '#000000',
                    borderColor: '#E5E5E5',
                    borderRadius: 'rounded',
                    icon: 'play',
                    iconPosition: 'left',
                  },
                },
                stats: [
                  { value: '14+', label: 'Stemacteurs', hoverEffect: true },
                  { value: '100%', label: 'Kwaliteit', hoverEffect: true },
                  { value: '24h', label: 'Levering', hoverEffect: true },
                ],
              },
              {
                blockType: 'voiceover-v1',
                title: 'Onze Stemacteurs',
                showcase: true,
              },
              {
                blockType: 'content-v1',
                title: 'Ontdek onze laatste projecten',
                description:
                  "Van internationale commercials tot lokale bedrijfsvideo's, onze stemacteurs hebben aan diverse projecten meegewerkt. Laat je inspireren door onze portfolio en ontdek wat wij voor jouw project kunnen betekenen.",
                imageStyle: {
                  grayscale: true,
                  rounded: true,
                },
                button: {
                  label: 'Bekijk portfolio',
                  url: '/blog',
                  style: 'secondary',
                  showIcon: true,
                },
              },
              {
                blockType: 'price-calculator',
                title: 'Bereken je voice-over prijs',
                subtitle: 'Krijg direct een indicatie voor jouw project',
                showVAT: true,
                showDeliveryTime: true,
              },
            ],
            blog: [
              {
                blockType: 'hero-v2',
                badge: {
                  enabled: true,
                  text: '📝 Tips, nieuws & inzichten',
                },
                title: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'heading',
                        tag: 'h1',
                        children: [
                          { type: 'text', text: 'Het laatste uit de ' },
                          { type: 'text', text: 'voice-over wereld', format: ['bold'] },
                        ],
                      },
                    ],
                  },
                },
                subtitle: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'paragraph',
                        children: [{ type: 'text', text: 'Blog & Nieuws' }],
                      },
                    ],
                  },
                },
                description: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            text: 'Ontdek tips voor het schrijven van scripts, trends in de voice-over industrie, en verhalen achter onze projecten.',
                          },
                        ],
                      },
                    ],
                  },
                },
                cta: {
                  primaryLabel: 'Nieuwste artikelen',
                  primaryUrl: '#artikelen',
                },
                paddingTop: 'medium',
                paddingBottom: 'medium',
              },
              {
                blockType: 'blog-section-1',
                title: 'Laatste Nieuws & Updates',
                description: 'Ontdek tips, nieuws en inzichten uit de wereld van voice-overs',
                postsLimit: 8,
                showCategories: true,
                paddingTop: 'medium',
                paddingBottom: 'large',
              },
            ],
          };

          if (seedLayouts[page.slug]) {
            await payload.update({
              collection: 'pages',
              id: page.id,
              data: {
                layout: seedLayouts[page.slug],
              },
            });
            console.log(`✅ Updated layout for ${page.slug} page`);
          }
        }
      }
    }

    // Step 3: Seed other collections if empty
    console.log('\n📋 Step 3: Checking other collections...');

    // Check voiceovers
    const voiceovers = await payload.find({
      collection: 'voiceovers',
      limit: 1,
    });

    if (voiceovers.totalDocs === 0) {
      console.log('📝 No voiceovers found, running seed...');
      const { seedVoiceovers } = await import('../seed/voiceovers');
      await seedVoiceovers(payload);
    } else {
      console.log(`✅ Found ${voiceovers.totalDocs} voiceovers`);
    }

    // Check categories
    const categories = await payload.find({
      collection: 'categories',
      limit: 1,
    });

    if (categories.totalDocs === 0) {
      console.log('📝 No categories found, running seed...');
      const { seedCategories } = await import('../seed/categories');
      await seedCategories(payload);
    } else {
      console.log(`✅ Found ${categories.totalDocs} categories`);
    }

    // Check blog posts
    const blogPosts = await payload.find({
      collection: 'blog-posts',
      limit: 1,
    });

    if (blogPosts.totalDocs === 0) {
      console.log('📝 No blog posts found, running seed...');
      const { seedBlogPosts } = await import('../seed/blog-posts');
      await seedBlogPosts(payload);
    } else {
      console.log(`✅ Found ${blogPosts.totalDocs} blog posts`);
    }

    console.log('\n✅ Recovery process complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Try running: bun dev');
    console.log(
      '2. If you have access to Neon, run: NEON_DATABASE_URL="..." bun run src/scripts/exportAllNeonData.ts'
    );
    console.log('3. Check the admin panel at http://localhost:3000/admin');
  } catch (error) {
    console.error('❌ Recovery failed:', error);
    process.exit(1);
  }
}

// Run the recovery
if (import.meta.main) {
  recoverData();
}
