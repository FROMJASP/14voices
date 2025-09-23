import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';
import path from 'path';
import fs from 'fs/promises';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

async function streamToFile(stream: Readable, filepath: string): Promise<void> {
  const writeStream = createWriteStream(filepath);
  await pipeline(stream, writeStream);
}

export async function downloadMediaFromMinIO() {
  const payload = await getPayloadHMR({ config: configPromise });

  // MinIO credentials
  const accessKeyId = '1fOtwN2kmPcyI5gD';
  const secretAccessKey = 'zVoUWeTeOM7WuGQdXu0zfj9oa0Rg9mjO';
  const endpoint = process.env.S3_ENDPOINT;
  const bucketName = process.env.S3_BUCKET!;

  // Local media directory
  const mediaDir = path.join(process.cwd(), 'public', 'media');

  // Create media directory if it doesn't exist
  await fs.mkdir(mediaDir, { recursive: true });

  console.log('🔍 Starting MinIO media download...');
  console.log(`📦 Bucket: ${bucketName}`);
  console.log(`📁 Local directory: ${mediaDir}`);
  console.log(`🔑 Using provided credentials\n`);

  // Initialize S3 client with provided credentials
  const s3Client = new S3Client({
    endpoint,
    region: process.env.S3_REGION || 'us-east-1',
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });

  let downloadedFiles = 0;
  let skippedFiles = 0;
  let errorFiles = 0;

  try {
    // List all objects in the bucket
    let continuationToken: string | undefined;

    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: continuationToken,
        MaxKeys: 1000,
      });

      const listResponse = await s3Client.send(listCommand);
      const objects = listResponse.Contents || [];

      for (const object of objects) {
        if (!object.Key) continue;

        const filename = path.basename(object.Key);
        const localPath = path.join(mediaDir, filename);

        // Skip directories
        if (object.Key.endsWith('/')) {
          console.log(`⏭️  Skipping directory: ${object.Key}`);
          continue;
        }

        // Check if file already exists locally
        try {
          await fs.access(localPath);
          console.log(`✅ Already exists locally: ${filename}`);
          skippedFiles++;
          continue;
        } catch {
          // File doesn't exist, proceed with download
        }

        console.log(`📥 Downloading: ${filename}`);

        try {
          // Download the file
          const getCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: object.Key,
          });

          const response = await s3Client.send(getCommand);

          if (response.Body) {
            await streamToFile(response.Body as Readable, localPath);
            console.log(`  ✅ Downloaded: ${filename} (${object.Size} bytes)`);
            downloadedFiles++;
          }
        } catch (error) {
          console.error(`  ❌ Error downloading ${filename}:`, error);
          errorFiles++;
        }
      }

      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);

    console.log('\n📊 Download Summary:');
    console.log(`  Files downloaded: ${downloadedFiles}`);
    console.log(`  Files skipped (already exist): ${skippedFiles}`);
    console.log(`  Errors: ${errorFiles}`);

    // Update database records to use local URLs
    console.log('\n🔄 Updating database records...');

    const allMedia = await payload.find({
      collection: 'media',
      limit: 1000,
    });

    let updatedRecords = 0;

    for (const media of allMedia.docs) {
      const localUrl = `/media/${media.filename}`;
      let thumbnailURL = localUrl;

      // Update thumbnail URL if it exists
      if (media.sizes?.thumbnail?.filename) {
        thumbnailURL = `/media/${media.sizes.thumbnail.filename}`;
      }

      try {
        await payload.update({
          collection: 'media',
          id: media.id,
          data: {
            url: localUrl,
            thumbnailURL: thumbnailURL,
          },
        });
        updatedRecords++;
      } catch (error) {
        console.error(`Error updating media ${media.id}:`, error);
      }
    }

    console.log(`✅ Updated ${updatedRecords} database records to use local URLs`);
  } catch (error) {
    console.error('❌ Error during download:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  downloadMediaFromMinIO()
    .then(() => {
      console.log('\n✅ Media download completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Media download failed:', error);
      process.exit(1);
    });
}
