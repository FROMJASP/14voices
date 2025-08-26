#!/usr/bin/env bun
import { getPayload } from 'payload';
import configPromise from '../src/payload.config';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

async function cleanupTestData() {
  console.log('🧹 Starting cleanup of test data...\n');

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    // First, clear homepage_settings hero image reference
    console.log('🏠 Clearing homepage settings hero image...');
    try {
      const currentSettings = await payload.findGlobal({
        slug: 'homepage-settings',
      });

      // Update with all required fields, removing heroImage
      await payload.updateGlobal({
        slug: 'homepage-settings',
        data: {
          hero: {
            processSteps: currentSettings?.hero?.processSteps || [
              { text: '1. Kies de stem' },
              { text: '2. Upload script' },
              { text: '3. Ontvang audio' },
            ],
            title: currentSettings?.hero?.title || 'Vind de stem die jouw merk laat spreken.',
            description:
              currentSettings?.hero?.description ||
              'Een goed verhaal verdient een goede stem. Daarom trainde wij onze 14 voice-overs die samen met onze technici klaarstaan om jouw tekst tot leven te brengen!',
            primaryButton: currentSettings?.hero?.primaryButton || {
              text: 'Ontdek stemmen',
              url: '#voiceovers',
            },
            secondaryButton: currentSettings?.hero?.secondaryButton || {
              text: 'Hoe wij werken',
              url: '/hoe-het-werkt',
            },
            stats: currentSettings?.hero?.stats || [
              { number: '14', label: 'Stemacteurs' },
              { number: '<48u', label: 'Snelle levering' },
              { number: '9.1/10', label: 'Klantbeoordeling' },
            ],
            // Explicitly set heroImage to null to remove the reference
            heroImage: null,
          },
        },
      });
      console.log('✅ Cleared hero image reference\n');
    } catch (e) {
      console.log('   Note: Could not clear hero image reference\n');
      console.log('   Error:', e);
    }

    // Delete all voiceovers first (they might reference media)
    console.log('🎤 Deleting voiceover entries...');
    const voiceoversToDelete = await payload.find({
      collection: 'voiceovers',
      limit: 1000,
    });

    for (const voiceover of voiceoversToDelete.docs) {
      try {
        await payload.delete({
          collection: 'voiceovers',
          id: voiceover.id,
        });
        console.log(`   Deleted: ${voiceover.name}`);
      } catch (e) {
        console.log(`   Could not delete: ${voiceover.name}`);
      }
    }
    console.log(`✅ Deleted ${voiceoversToDelete.docs.length} voiceover entries\n`);

    // Delete all media entries
    console.log('📸 Deleting media entries...');
    const mediaToDelete = await payload.find({
      collection: 'media',
      limit: 1000,
    });

    for (const media of mediaToDelete.docs) {
      try {
        await payload.delete({
          collection: 'media',
          id: media.id,
        });
        console.log(`   Deleted: ${media.filename}`);
      } catch (e) {
        console.log(`   Could not delete: ${media.filename} (referenced elsewhere)`);
      }
    }
    console.log(`✅ Processed ${mediaToDelete.docs.length} media entries\n`);

    // Delete all testimonials
    console.log('💬 Deleting testimonial entries...');
    const testimonialsToDelete = await payload.find({
      collection: 'testimonials',
      limit: 1000,
    });

    for (const testimonial of testimonialsToDelete.docs) {
      try {
        await payload.delete({
          collection: 'testimonials',
          id: testimonial.id,
        });
        console.log(`   Deleted testimonial from: ${testimonial.name}`);
      } catch (e) {
        console.log(`   Could not delete testimonial from: ${testimonial.name}`);
      }
    }
    console.log(`✅ Processed ${testimonialsToDelete.docs.length} testimonial entries\n`);

    console.log('✨ Cleanup complete! Database is now cleaner.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

cleanupTestData().catch(console.error);
