import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';
import path from 'path';
import fs from 'fs/promises';
import https from 'https';
import http from 'http';

async function downloadFile(url: string, filepath: string): Promise<void> {
  const file = await fs.open(filepath, 'w');
  const stream = file.createWriteStream();

  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }

        response.pipe(stream);

        stream.on('finish', () => {
          stream.close();
          resolve();
        });

        stream.on('error', (err) => {
          fs.unlink(filepath).catch(() => {});
          reject(err);
        });
      })
      .on('error', (err) => {
        fs.unlink(filepath).catch(() => {});
        reject(err);
      });
  });
}

export async function downloadMediaFromPublicURL() {
  const payload = await getPayloadHMR({ config: configPromise });

  // Public URL from environment
  const publicUrl = process.env.S3_PUBLIC_URL!;

  // Local media directory
  const mediaDir = path.join(process.cwd(), 'public', 'media');

  // Create media directory if it doesn't exist
  await fs.mkdir(mediaDir, { recursive: true });

  console.log('🔍 Starting media download from public URL...');
  console.log(`🌐 Public URL: ${publicUrl}`);
  console.log(`📁 Local directory: ${mediaDir}\n`);

  let downloadedFiles = 0;
  let skippedFiles = 0;
  let errorFiles = 0;

  try {
    // Get all media records from database
    const allMedia = await payload.find({
      collection: 'media',
      limit: 1000,
    });

    console.log(`📋 Found ${allMedia.docs.length} media records in database\n`);

    for (const media of allMedia.docs) {
      if (!media.filename) continue;

      const localPath = path.join(mediaDir, media.filename);

      // Check if file already exists locally
      try {
        const stats = await fs.stat(localPath);
        // Check if it's not an HTML error page
        if (stats.size > 2000) {
          // Most error pages are around 1309 bytes
          console.log(`✅ Already exists: ${media.filename} (${stats.size} bytes)`);
          skippedFiles++;
          continue;
        } else {
          console.log(`⚠️  Removing invalid file: ${media.filename} (${stats.size} bytes)`);
          await fs.unlink(localPath);
        }
      } catch {
        // File doesn't exist, proceed with download
      }

      // Try to download from public URL
      const publicFileUrl = `${publicUrl}/${media.filename}`;
      console.log(`📥 Downloading: ${media.filename}`);
      console.log(`   URL: ${publicFileUrl}`);

      try {
        await downloadFile(publicFileUrl, localPath);

        // Verify file after download
        const downloadedStats = await fs.stat(localPath);

        // Check if it's likely a real file (not an error page)
        if (downloadedStats.size > 2000) {
          console.log(`  ✅ Downloaded: ${media.filename} (${downloadedStats.size} bytes)`);
          downloadedFiles++;

          // Update database record to use local URL
          const localUrl = `/media/${media.filename}`;
          await payload.update({
            collection: 'media',
            id: media.id,
            data: {
              url: localUrl,
              thumbnailURL: localUrl,
            },
          });
          console.log(`  ✅ Updated database record\n`);
        } else {
          console.error(
            `  ❌ Downloaded file too small (likely error page): ${downloadedStats.size} bytes`
          );
          await fs.unlink(localPath);
          errorFiles++;
        }
      } catch (error) {
        console.error(`  ❌ Error downloading: ${error}\n`);
        errorFiles++;

        // Clean up partial download
        try {
          await fs.unlink(localPath);
        } catch {}
      }
    }

    console.log('\n📊 Download Summary:');
    console.log(`  ✅ Files downloaded: ${downloadedFiles}`);
    console.log(`  ⏭️  Files skipped (already exist): ${skippedFiles}`);
    console.log(`  ❌ Errors: ${errorFiles}`);
    console.log(`\n✅ Updated ${downloadedFiles} database records to use local URLs`);
  } catch (error) {
    console.error('❌ Error during download:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.main) {
  downloadMediaFromPublicURL()
    .then(() => {
      console.log('\n✅ Media download completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Media download failed:', error);
      process.exit(1);
    });
}
