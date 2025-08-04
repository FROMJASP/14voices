import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function POST() {
  try {
    const payload = await getPayload({ config: configPromise });

    // Get all active voiceovers
    const voiceovers = await payload.find({
      collection: 'voiceovers',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 100,
      depth: 0,
    });

    console.log(`Found ${voiceovers.docs.length} active voiceovers`);

    // First, create placeholder media entries
    const placeholderMedia = await payload.create({
      collection: 'media',
      data: {
        filename: 'placeholder-demo.mp3',
        alt: 'Placeholder Demo Audio',
        mimeType: 'audio/mpeg',
        filesize: 1024 * 1024, // 1MB placeholder
        url: '/audio/placeholder-demo.mp3', // Local placeholder URL
      },
    });

    console.log('Created placeholder media:', placeholderMedia.id);

    // Update all voiceovers without demo files
    let updatedCount = 0;
    const errors: string[] = [];

    for (const voiceover of voiceovers.docs) {
      // Check if voiceover needs demo files
      if (!voiceover.fullDemoReel && !voiceover.commercialsDemo && !voiceover.narrativeDemo) {
        try {
          await payload.update({
            collection: 'voiceovers',
            id: voiceover.id,
            data: {
              fullDemoReel: placeholderMedia.id,
              // Only add full demo reel to satisfy the requirement
            },
          });
          
          updatedCount++;
          console.log(`✓ Updated ${voiceover.name}`);
        } catch (error) {
          const errorMsg = `Failed to update ${voiceover.name}: ${error}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }
    }

    return NextResponse.json({ 
      message: 'Voiceover demos fixed!',
      updated: updatedCount,
      total: voiceovers.docs.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error fixing voiceover demos:', error);
    return NextResponse.json({ 
      error: 'Failed to fix voiceover demos',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}