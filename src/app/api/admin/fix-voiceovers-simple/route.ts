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

    // First check if we have any existing media files we can use
    const existingMedia = await payload.find({
      collection: 'media',
      where: {
        mimeType: {
          contains: 'audio',
        },
      },
      limit: 1,
    });

    let audioMediaId: string | null = null;

    if (existingMedia.docs.length > 0) {
      audioMediaId = String(existingMedia.docs[0].id);
      console.log('Using existing audio media:', audioMediaId);
    } else {
      // Create a simple media entry without file upload
      try {
        const mediaEntry = await payload.create({
          collection: 'media',
          data: {
            filename: 'demo-audio.mp3',
            alt: 'Demo Audio',
            mimeType: 'audio/mpeg',
            filesize: 1024000,
            // Don't provide URL - let it be handled by the system
          },
        });
        audioMediaId = String(mediaEntry.id);
        console.log('Created media entry:', audioMediaId);
      } catch (error) {
        console.error('Failed to create media entry:', error);
      }
    }

    // If we still don't have a media ID, try a different approach
    // Create media entries for each voiceover individually
    let updatedCount = 0;
    const errors: string[] = [];

    for (const voiceover of voiceovers.docs) {
      // Check if voiceover needs demo files
      if (!voiceover.fullDemoReel) {
        try {
          // First get a user to use as uploadedBy
          const users = await payload.find({
            collection: 'users',
            limit: 1,
          });

          if (users.docs.length === 0) {
            throw new Error('No users found to assign as uploader');
          }

          // Create a unique media entry for this voiceover
          const mediaEntry = await payload.create({
            collection: 'media',
            data: {
              filename: `${voiceover.slug}-demo.mp3`,
              alt: `${voiceover.name} Demo`,
              mimeType: 'audio/mpeg',
              filesize: 1024000,
              uploadedBy: users.docs[0].id,
            },
          });

          // Update the voiceover with the media ID
          await payload.update({
            collection: 'voiceovers',
            id: voiceover.id,
            data: {
              fullDemoReel: mediaEntry.id,
            },
          });
          
          updatedCount++;
          console.log(`✓ Updated ${voiceover.name} with media ID ${mediaEntry.id}`);
        } catch (error) {
          const errorMsg = `Failed to update ${voiceover.name}: ${error}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }
    }

    return NextResponse.json({ 
      message: 'Voiceovers updated!',
      updated: updatedCount,
      total: voiceovers.docs.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error updating voiceovers:', error);
    return NextResponse.json({ 
      error: 'Failed to update voiceovers',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}