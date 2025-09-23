#!/usr/bin/env bun
import { getPayload } from 'payload';
import configPromise from '../payload.config';
import { seedVoiceovers } from '../seed/voiceovers';

async function main() {
  console.log('🎤 Seeding voiceovers...\n');

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    await seedVoiceovers(payload);

    console.log('\n✅ Voiceovers seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding voiceovers:', error);
    process.exit(1);
  }
}

main();
