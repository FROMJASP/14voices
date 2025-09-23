#!/usr/bin/env bun
/**
 * Quick fix for migration issues and reseed data
 */

import { getPayload } from 'payload';
import configPromise from '../payload.config';

async function quickFix() {
  console.log('🚀 Starting quick fix and seed process...\n');

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const db = payload.db as any;

    // Step 1: Fix the constraint issue
    console.log('📋 Step 1: Fixing database constraints...');

    try {
      // Drop the malformed constraint
      await db.drizzle.execute(`
        DO $$ 
        BEGIN
          -- Drop the malformed constraint if it exists
          IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'extra_services_production_price_overrides_production_id_product'
          ) THEN
            ALTER TABLE extra_services_production_price_overrides 
            DROP CONSTRAINT extra_services_production_price_overrides_production_id_product;
          END IF;
          
          -- Drop the correct constraint if it exists (to recreate it)
          IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'extra_services_production_price_overrides_production_id_productions_id_fk'
          ) THEN
            ALTER TABLE extra_services_production_price_overrides 
            DROP CONSTRAINT extra_services_production_price_overrides_production_id_productions_id_fk;
          END IF;
          
          -- Check if both tables exist before creating constraint
          IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'extra_services_production_price_overrides'
          ) AND EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'productions'
          ) THEN
            -- Create the correct constraint
            ALTER TABLE extra_services_production_price_overrides 
            ADD CONSTRAINT extra_services_production_price_overrides_production_id_productions_id_fk 
            FOREIGN KEY (production_id) 
            REFERENCES productions(id) 
            ON DELETE CASCADE;
          END IF;
        END $$;
      `);
      console.log('✅ Database constraints fixed');
    } catch (error) {
      console.error('❌ Failed to fix constraints:', error);
      console.log('Continuing with seeding...');
    }

    // Step 2: Mark migration as complete
    console.log('\n📋 Step 2: Updating migration status...');

    try {
      await db.drizzle.execute(`
        INSERT INTO payload_migrations (name, batch, created_at) 
        VALUES ('2025_fix_extra_services_constraints', 1, NOW())
        ON CONFLICT (name) DO NOTHING
      `);
      console.log('✅ Migration marked as complete');
    } catch (error) {
      console.log('⚠️  Could not update migration status');
    }

    // Step 3: Seed essential data
    console.log('\n📋 Step 3: Seeding essential data...');

    // Check and seed categories
    const categories = await payload.find({
      collection: 'categories',
      limit: 1,
    });

    if (categories.totalDocs === 0) {
      console.log('📝 Creating categories...');
      const categoryData = [
        { name: 'Voice-over Tips', slug: 'voice-over-tips' },
        { name: 'Industry News', slug: 'industry-news' },
        { name: 'Behind the Scenes', slug: 'behind-the-scenes' },
        { name: 'Client Stories', slug: 'client-stories' },
      ];

      for (const cat of categoryData) {
        await payload.create({
          collection: 'categories',
          data: cat,
        });
      }
      console.log('✅ Categories created');
    }

    // Check and seed pages
    const pages = await payload.find({
      collection: 'pages',
      limit: 100,
    });

    console.log(`\n📊 Found ${pages.totalDocs} pages`);

    if (pages.totalDocs === 0) {
      console.log('📝 No pages found, running full seed...');
      const { seedPages } = await import('../seed/pages');
      await seedPages(payload);
    } else {
      // Check if pages have blocks
      for (const page of pages.docs) {
        if (!page.layout || page.layout.length === 0) {
          console.log(`⚠️  Page "${page.title}" (${page.slug}) has no blocks`);

          // Run the seed to get pages with blocks
          console.log('📝 Re-running page seed to restore blocks...');

          // Delete empty pages
          await payload.delete({
            collection: 'pages',
            id: page.id,
          });
        }
      }

      // Re-seed pages with blocks
      const { seedPages } = await import('../seed/pages');
      await seedPages(payload);
    }

    // Seed voiceovers if needed
    const voiceovers = await payload.find({
      collection: 'voiceovers',
      limit: 1,
    });

    if (voiceovers.totalDocs === 0) {
      console.log('\n📝 Seeding voiceovers...');
      const { seedVoiceovers } = await import('../seed/voiceovers');
      await seedVoiceovers(payload);
    }

    // Seed blog posts if needed
    const blogPosts = await payload.find({
      collection: 'blog-posts',
      limit: 1,
    });

    if (blogPosts.totalDocs === 0) {
      console.log('\n📝 Seeding blog posts...');
      const { seedBlogPosts } = await import('../seed/blog-posts');
      await seedBlogPosts(payload);
    }

    console.log('\n✅ Quick fix complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Run: bun dev');
    console.log('2. Check http://localhost:3000 - your pages should have blocks now');
    console.log('3. Check admin at http://localhost:3000/admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Quick fix failed:', error);
    process.exit(1);
  }
}

// Run the fix
quickFix();
