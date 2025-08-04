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
      depth: 1,
    });

    console.log(`Found ${voiceovers.docs.length} active voiceovers`);

    // Get a user to use as uploadedBy
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    });

    if (users.docs.length === 0) {
      return NextResponse.json({ 
        error: 'No users found to assign as uploader'
      }, { status: 400 });
    }

    const userId = users.docs[0].id;
    let updatedCount = 0;
    const errors: string[] = [];

    // Create profile photo and demo files for each voiceover
    for (const voiceover of voiceovers.docs) {
      try {
        const updates: any = {};
        
        // Create profile photo if missing
        if (!voiceover.profilePhoto) {
          const profilePhoto = await payload.create({
            collection: 'media',
            data: {
              filename: `${voiceover.slug}-profile.jpg`,
              alt: `${voiceover.name} Profile Photo`,
              mimeType: 'image/jpeg',
              filesize: 512000,
              uploadedBy: userId,
              width: 400,
              height: 400,
            },
          });
          updates.profilePhoto = profilePhoto.id;
          console.log(`Created profile photo for ${voiceover.name}`);
        }

        // Create demo files if missing
        if (!voiceover.fullDemoReel) {
          const fullDemo = await payload.create({
            collection: 'media',
            data: {
              filename: `${voiceover.slug}-full-demo.mp3`,
              alt: `${voiceover.name} Full Demo`,
              mimeType: 'audio/mpeg',
              filesize: 2048000,
              uploadedBy: userId,
            },
          });
          updates.fullDemoReel = fullDemo.id;
          console.log(`Created full demo for ${voiceover.name}`);
        }

        if (!voiceover.commercialsDemo) {
          const commercialsDemo = await payload.create({
            collection: 'media',
            data: {
              filename: `${voiceover.slug}-commercials.mp3`,
              alt: `${voiceover.name} Commercials Demo`,
              mimeType: 'audio/mpeg',
              filesize: 1536000,
              uploadedBy: userId,
            },
          });
          updates.commercialsDemo = commercialsDemo.id;
          console.log(`Created commercials demo for ${voiceover.name}`);
        }

        if (!voiceover.narrativeDemo) {
          const narrativeDemo = await payload.create({
            collection: 'media',
            data: {
              filename: `${voiceover.slug}-narrative.mp3`,
              alt: `${voiceover.name} Narrative Demo`,
              mimeType: 'audio/mpeg',
              filesize: 1792000,
              uploadedBy: userId,
            },
          });
          updates.narrativeDemo = narrativeDemo.id;
          console.log(`Created narrative demo for ${voiceover.name}`);
        }

        // Update the voiceover if we have any updates
        if (Object.keys(updates).length > 0) {
          await payload.update({
            collection: 'voiceovers',
            id: voiceover.id,
            data: updates,
          });
          
          updatedCount++;
          console.log(`✓ Updated ${voiceover.name}`);
        }
      } catch (error) {
        const errorMsg = `Failed to update ${voiceover.name}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    // Clear the cache to ensure fresh data
    const clearCacheResponse = await fetch('http://localhost:3000/api/cache/clear', {
      method: 'POST',
    });

    return NextResponse.json({ 
      message: 'Voiceovers fixed successfully!',
      updated: updatedCount,
      total: voiceovers.docs.length,
      cacheCleared: clearCacheResponse.ok,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error fixing voiceovers:', error);
    return NextResponse.json({ 
      error: 'Failed to fix voiceovers',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}