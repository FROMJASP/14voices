import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';
import path from 'path';
import fs from 'fs/promises';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import https from 'https';

async function streamToFile(stream: Readable, filepath: string): Promise<void> {
  const writeStream = createWriteStream(filepath);
  await pipeline(stream, writeStream);
}

export async function downloadMediaDirectly() {
  const payload = await getPayloadHMR({ config: configPromise });

  // Get credentials from environment
  const accessKeyId = process.env.S3_ACCESS_KEY!;
  const secretAccessKey = process.env.S3_SECRET_KEY!;
  const endpoint = process.env.S3_ENDPOINT!;
  const bucketName = process.env.S3_BUCKET!;

  // Local media directory
  const mediaDir = path.join(process.cwd(), 'public', 'media');

  // Create media directory if it doesn't exist
  await fs.mkdir(mediaDir, { recursive: true });

  console.log('🔍 Starting MinIO media download...');
  console.log(`📦 Bucket: ${bucketName}`);
  console.log(`🌐 Endpoint: ${endpoint}`);
  console.log(`📁 Local directory: ${mediaDir}\n`);

  // Initialize S3 client with environment credentials
  const s3Client = new S3Client({
    endpoint,
    region: process.env.S3_REGION || 'us-east-1',
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
    // Add custom agent to handle self-signed certificates if needed
    requestHandler: {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Only for self-signed certs
      }),
    } as any,
  });

  let downloadedFiles = 0;
  let skippedFiles = 0;
  let errorFiles = 0;

  try {
    // First, let's test the connection
    console.log('🔗 Testing MinIO connection...');
    const testCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 1,
    });

    try {
      await s3Client.send(testCommand);
      console.log('✅ Successfully connected to MinIO\n');
    } catch (error) {
      console.error('❌ Failed to connect to MinIO:', error);
      throw error;
    }

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

      console.log(`📋 Found ${objects.length} objects in this batch\n`);

      for (const object of objects) {
        if (!object.Key) continue;

        const filename = path.basename(object.Key);
        const localPath = path.join(mediaDir, filename);

        // Skip directories
        if (object.Key.endsWith('/')) {
          console.log(`⏭️  Skipping directory: ${object.Key}`);
          continue;
        }

        // Check if file already exists locally with correct size
        try {
          const stats = await fs.stat(localPath);
          if (stats.size === object.Size) {
            console.log(`✅ Already exists locally: ${filename} (${object.Size} bytes)`);
            skippedFiles++;
            continue;
          } else {
            console.log(
              `⚠️  File exists but size mismatch: ${filename} (local: ${stats.size}, remote: ${object.Size})`
            );
            // Delete the incorrect file
            await fs.unlink(localPath);
          }
        } catch {
          // File doesn't exist, proceed with download
        }

        console.log(`📥 Downloading: ${filename} (${object.Size} bytes)`);

        try {
          // Download the file
          const getCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: object.Key,
          });

          const response = await s3Client.send(getCommand);

          if (response.Body) {
            await streamToFile(response.Body as Readable, localPath);

            // Verify file size after download
            const downloadedStats = await fs.stat(localPath);
            if (downloadedStats.size === object.Size) {
              console.log(`  ✅ Successfully downloaded: ${filename}`);
              downloadedFiles++;
            } else {
              console.error(`  ❌ Size mismatch after download: ${filename}`);
              await fs.unlink(localPath);
              errorFiles++;
            }
          }
        } catch (error) {
          console.error(`  ❌ Error downloading ${filename}:`, error);
          errorFiles++;

          // Clean up partial download
          try {
            await fs.unlink(localPath);
          } catch {}
        }
      }

      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);

    console.log('\n📊 Download Summary:');
    console.log(`  ✅ Files downloaded: ${downloadedFiles}`);
    console.log(`  ⏭️  Files skipped (already exist): ${skippedFiles}`);
    console.log(`  ❌ Errors: ${errorFiles}`);

    // Update database records to use local URLs
    console.log('\n🔄 Updating database records...');

    const allMedia = await payload.find({
      collection: 'media',
      limit: 1000,
    });

    let updatedRecords = 0;

    for (const media of allMedia.docs) {
      const localUrl = `/media/${media.filename}`;

      // Check if file exists locally
      const localPath = path.join(mediaDir, media.filename);
      try {
        await fs.access(localPath);

        // Update database record
        await payload.update({
          collection: 'media',
          id: media.id,
          data: {
            url: localUrl,
            thumbnailURL: localUrl, // Use same URL for thumbnail
          },
        });
        updatedRecords++;
        console.log(`  ✅ Updated: ${media.filename}`);
      } catch (error) {
        console.log(`  ⏭️  Skipping update for missing file: ${media.filename}`);
      }
    }

    console.log(`\n✅ Updated ${updatedRecords} database records to use local URLs`);
  } catch (error) {
    console.error('❌ Error during download:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.main) {
  downloadMediaDirectly()
    .then(() => {
      console.log('\n✅ Media download completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Media download failed:', error);
      process.exit(1);
    });
}
