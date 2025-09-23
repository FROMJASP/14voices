#!/usr/bin/env bun
import { getPayload } from 'payload';
import configPromise from '../payload.config';

async function seedVoiceoverComplete() {
  console.log('🎤 Setting up complete voiceover data...\n');

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    // Step 1: Create or find groups
    console.log('Setting up groups...');

    let defaultGroup = await payload.find({
      collection: 'groups',
      where: {
        slug: {
          equals: 'standard-voices',
        },
      },
      limit: 1,
    });

    if (defaultGroup.docs.length === 0) {
      defaultGroup = await payload.create({
        collection: 'groups',
        data: {
          name: 'Standard Voices',
          slug: 'standard-voices',
          description: 'Our standard voice-over artists',
        },
      });
    } else {
      defaultGroup = defaultGroup.docs[0];
    }

    let premiumGroup = await payload.find({
      collection: 'groups',
      where: {
        slug: {
          equals: 'premium-voices',
        },
      },
      limit: 1,
    });

    if (premiumGroup.docs.length === 0) {
      premiumGroup = await payload.create({
        collection: 'groups',
        data: {
          name: 'Premium Voices',
          slug: 'premium-voices',
          description: 'Our premium voice-over artists',
        },
      });
    } else {
      premiumGroup = premiumGroup.docs[0];
    }

    console.log('✓ Groups ready');

    // Step 2: Create voiceovers with minimal required fields
    console.log('\nCreating voiceovers...');

    const voiceoverData = [
      {
        name: 'Emma',
        description: 'Warme, vriendelijke stem perfect voor commercials en bedrijfsfilms.',
        status: 'draft', // Using draft to bypass media requirements
        group: (defaultGroup as any).id,
        availability: {
          isAvailable: true,
        },
        styleTags: [{ tag: 'warm-donker' }, { tag: 'vriendelijk-vrolijk' }, { tag: 'kwaliteit' }],
      },
      {
        name: 'Jan',
        description: 'Krachtige, autoritaire stem met jarenlange ervaring.',
        status: 'draft',
        group: (defaultGroup as any).id,
        availability: {
          isAvailable: true,
        },
        styleTags: [{ tag: 'autoriteit' }, { tag: 'zakelijk' }, { tag: 'stoer' }],
      },
      {
        name: 'Sophie',
        description: 'Energieke, jeugdige stem die perfect past bij moderne merken.',
        status: 'draft',
        group: (premiumGroup as any).id,
        availability: {
          isAvailable: true,
        },
        styleTags: [{ tag: 'jeugdig-fris' }, { tag: 'eigentijds' }, { tag: 'vernieuwend' }],
      },
      {
        name: 'Thomas',
        description: 'Veelzijdige stem voor diverse projecten.',
        status: 'draft',
        group: (defaultGroup as any).id,
        availability: {
          isAvailable: true,
        },
        styleTags: [{ tag: 'helder' }, { tag: 'naturel' }, { tag: 'zakelijk' }],
      },
    ];

    for (const voiceoverInfo of voiceoverData) {
      try {
        const voiceover = await payload.create({
          collection: 'voiceovers',
          data: voiceoverInfo,
        });
        console.log(`✓ Created voiceover: ${voiceoverInfo.name}`);
      } catch (error) {
        console.error(`✗ Failed to create voiceover ${voiceoverInfo.name}:`, error);
      }
    }

    console.log('\n✅ Voiceover data setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedVoiceoverComplete();
