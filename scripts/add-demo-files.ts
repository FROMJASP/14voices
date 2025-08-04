import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function addDemoFiles() {
  console.log('Adding demo files to voiceovers...');

  try {
    const payload = await getPayload({ config: configPromise });

    // Get all active voiceovers without demo files
    const voiceovers = await payload.find({
      collection: 'voiceovers',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 100,
    });

    console.log(`Found ${voiceovers.docs.length} active voiceovers`);

    // Check which voiceovers need demo files
    const voiceoversNeedingDemos = voiceovers.docs.filter(
      v => !v.fullDemoReel && !v.commercialsDemo && !v.narrativeDemo
    );

    console.log(`${voiceoversNeedingDemos.length} voiceovers need demo files`);

    if (voiceoversNeedingDemos.length === 0) {
      console.log('All voiceovers already have demo files!');
      return;
    }

    // Create demo media files
    const demoTypes = ['full-demo', 'commercials', 'narrative'];
    const mediaMap: Record<string, Record<string, string>> = {};

    for (const voiceover of voiceoversNeedingDemos) {
      mediaMap[String(voiceover.id)] = {};
      
      for (const demoType of demoTypes) {
        try {
          const media = await payload.create({
            collection: 'media',
            data: {
              filename: `${voiceover.slug}-${demoType}.mp3`,
              alt: `${voiceover.name} ${demoType}`,
              mimeType: 'audio/mpeg',
              filesize: 1024 * 1024 * 2, // 2MB dummy size
              url: `/media/${voiceover.slug}-${demoType}.mp3`,
            },
          });
          
          mediaMap[String(voiceover.id)][demoType] = String(media.id);
          console.log(`Created ${demoType} for ${voiceover.name}`);
        } catch (error) {
          console.error(`Failed to create ${demoType} for ${voiceover.name}:`, error);
        }
      }
    }

    // Update voiceovers with demo files
    for (const voiceover of voiceoversNeedingDemos) {
      const demos = mediaMap[String(voiceover.id)];
      if (!demos) continue;

      try {
        await payload.update({
          collection: 'voiceovers',
          id: voiceover.id,
          data: {
            fullDemoReel: demos['full-demo'],
            commercialsDemo: demos['commercials'],
            narrativeDemo: demos['narrative'],
          },
        });
        
        console.log(`✓ Updated demos for ${voiceover.name}`);
      } catch (error) {
        console.error(`Failed to update ${voiceover.name}:`, error);
      }
    }

    console.log('✨ Demo files added successfully!');
  } catch (error) {
    console.error('Error adding demo files:', error);
  } finally {
    process.exit(0);
  }
}

addDemoFiles();