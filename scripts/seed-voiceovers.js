import { getPayload } from 'payload';
import { importConfig } from 'payload/node';
import { sampleVoiceovers } from '../src/seed/sample-voiceovers.js';

async function seedVoiceovers() {
  const configPath = process.cwd() + '/src/payload.config.ts';
  const config = await importConfig(configPath);
  const payload = await getPayload({ config });

  console.log('Seeding voiceovers...');

  try {
    // Check if we already have voiceovers
    const existing = await payload.find({
      collection: 'voiceovers',
      limit: 1,
    });

    if (existing.totalDocs > 0) {
      console.log('Voiceovers already exist. Skipping seed.');
      return;
    }

    // Create voiceovers
    for (const voiceover of sampleVoiceovers) {
      await payload.create({
        collection: 'voiceovers',
        data: voiceover,
      });
      console.log(`Created voiceover: ${voiceover.name.nl}`);
    }

    console.log('Successfully seeded voiceovers!');
  } catch (error) {
    console.error('Error seeding voiceovers:', error);
  } finally {
    process.exit(0);
  }
}

seedVoiceovers();
