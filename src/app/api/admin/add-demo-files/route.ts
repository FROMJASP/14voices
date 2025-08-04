import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function POST() {
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
    console.log('Sample voiceover:', voiceovers.docs[0]);

    if (voiceoversNeedingDemos.length === 0) {
      return NextResponse.json({ 
        message: 'All voiceovers already have demo files!',
        count: 0 
      });
    }

    // Create demo media files
    const demoTypes = ['full-demo', 'commercials', 'narrative'];
    const mediaMap: Record<string, Record<string, string>> = {};
    let createdCount = 0;

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
    const updated = [];
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
        
        updated.push(voiceover.name);
        createdCount++;
        console.log(`✓ Updated demos for ${voiceover.name}`);
      } catch (error) {
        console.error(`Failed to update ${voiceover.name}:`, error);
      }
    }

    return NextResponse.json({ 
      message: 'Demo files added successfully!',
      count: createdCount,
      updated
    });
  } catch (error) {
    console.error('Error adding demo files:', error);
    return NextResponse.json({ 
      error: 'Failed to add demo files',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}