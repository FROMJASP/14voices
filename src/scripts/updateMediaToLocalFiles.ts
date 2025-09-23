import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';
import path from 'path';
import fs from 'fs/promises';

export async function updateMediaToLocalFiles() {
  const payload = await getPayloadHMR({ config: configPromise });

  console.log('🔄 Updating media records to use local files...\n');

  // Map of known video files
  const videoFiles = {
    'videoproductie.mp4': '/videos/videoproductie.mp4',
    'tv-commercial.mp4': '/videos/tv-commercial.mp4',
    'web-commercial.mp4': '/videos/web-commercial.mp4',
    'e-learning.mp4': '/videos/e-learning.mp4',
    'radiospot.mp4': '/videos/radiospot.mp4',
    'voice-response.mp4': '/videos/voice-response.mp4',
  };

  try {
    // Get all media records
    const allMedia = await payload.find({
      collection: 'media',
      limit: 1000,
    });

    console.log(`Found ${allMedia.totalDocs} media records\n`);

    let updatedCount = 0;
    let missingCount = 0;
    let videoCount = 0;

    for (const media of allMedia.docs) {
      const filename = media.filename;

      if (!filename) {
        console.log(`⚠️  No filename for media ID ${media.id}`);
        continue;
      }

      // Check if it's a video file we have locally
      if (videoFiles[filename]) {
        const localUrl = videoFiles[filename];
        console.log(`📹 Updating video: ${filename} -> ${localUrl}`);

        await payload.update({
          collection: 'media',
          id: media.id,
          data: {
            url: localUrl,
            thumbnailURL: localUrl, // Videos use the same URL
            // Don't update mimeType - let it remain as stored
          },
          overrideAccess: true, // Skip validation
        });

        videoCount++;
        updatedCount++;
        continue;
      }

      // Check if it's an audio file (MP3)
      if (filename.endsWith('.mp3')) {
        console.log(`🎵 Audio file (missing): ${filename}`);
        // For now, we'll keep the existing URL structure but mark as missing
        missingCount++;
        continue;
      }

      // Check if it's an image file
      if (filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        console.log(`🖼️  Image file (missing): ${filename}`);

        // Update to use a placeholder or keep existing structure
        // For now, we'll update to use local path even though file is missing
        const localUrl = `/media/${filename}`;

        await payload.update({
          collection: 'media',
          id: media.id,
          data: {
            url: localUrl,
            thumbnailURL: localUrl,
          },
          overrideAccess: true, // Skip validation
        });

        missingCount++;
        updatedCount++;
        continue;
      }

      console.log(`❓ Unknown file type: ${filename}`);
    }

    console.log('\n📊 Update Summary:');
    console.log(`  ✅ Total records updated: ${updatedCount}`);
    console.log(`  📹 Video files found and updated: ${videoCount}`);
    console.log(`  ⚠️  Missing files (images/audio): ${missingCount}`);

    // Create a report of missing files
    console.log('\n📝 Missing Files Report:');
    console.log('The following files are missing and need to be re-uploaded:');

    for (const media of allMedia.docs) {
      if (!media.filename) continue;

      const isVideo = Object.keys(videoFiles).includes(media.filename);
      const isAudio = media.filename.endsWith('.mp3');
      const isImage = media.filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

      if (!isVideo && (isAudio || isImage)) {
        console.log(`  - ${media.filename} (${isAudio ? 'audio' : 'image'})`);
      }
    }
  } catch (error) {
    console.error('❌ Error updating media records:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.main) {
  updateMediaToLocalFiles()
    .then(() => {
      console.log('\n✅ Media update completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Media update failed:', error);
      process.exit(1);
    });
}
