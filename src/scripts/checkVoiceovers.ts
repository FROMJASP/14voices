import { getPayload } from 'payload';
import configPromise from '../payload.config';

async function checkVoiceovers() {
  try {
    const payload = await getPayload({ config: configPromise });

    const voiceovers = await payload.find({
      collection: 'voiceovers',
      limit: 100,
      depth: 0,
    });

    console.log(`Total voiceovers: ${voiceovers.totalDocs}`);
    console.log('Voiceover statuses:');

    voiceovers.docs.forEach((vo: any) => {
      console.log(`- ${vo.firstName} ${vo.lastName}: ${vo.status}`);
    });

    const activeVoiceovers = await payload.find({
      collection: 'voiceovers',
      where: {
        status: {
          in: ['active', 'more-voices'],
        },
      },
      limit: 100,
    });

    console.log(`\nActive/More-voices voiceovers: ${activeVoiceovers.totalDocs}`);
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

checkVoiceovers();
