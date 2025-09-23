#!/usr/bin/env bun
import { getPayload } from 'payload';
import configPromise from '../payload.config';

async function activateVoiceovers() {
  console.log('🎤 Activating voiceovers...\n');

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    // Get all draft voiceovers
    const draftVoiceovers = await payload.find({
      collection: 'voiceovers',
      where: {
        status: {
          equals: 'draft',
        },
      },
      limit: 100,
    });

    console.log(`Found ${draftVoiceovers.totalDocs} draft voiceovers`);

    // Update them to active status
    for (const voiceover of draftVoiceovers.docs) {
      try {
        await payload.update({
          collection: 'voiceovers',
          id: voiceover.id,
          data: {
            status: 'more-voices',
          },
        });
        console.log(`✓ Activated voiceover: ${voiceover.name}`);
      } catch (error) {
        console.error(`✗ Failed to activate voiceover ${voiceover.name}:`, error);
      }
    }

    console.log('\n✅ Voiceover activation completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

activateVoiceovers();
