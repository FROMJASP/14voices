import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';
import {
  S3Client,
  ListObjectsV2Command,
  HeadObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import sharp from 'sharp';
import mime from 'mime-types';
import path from 'path';

interface MediaRecord {
  filename: string;
  alt: string;
  mimeType: string;
  filesize: number;
  url: string;
  width?: number;
  height?: number;
  sizes?: any;
  scanStatus: 'safe';
  uploadedBy?: string;
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function getImageDimensions(
  buffer: Buffer
): Promise<{ width: number; height: number } | null> {
  try {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  } catch (error) {
    console.log('Could not extract image dimensions:', error);
    return null;
  }
}

export async function recoverMediaFromStorage() {
  const payload = await getPayloadHMR({ config: configPromise });

  // Initialize S3 client
  const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
    forcePathStyle: true,
  });

  const bucketName = process.env.S3_BUCKET!;
  const publicUrl = process.env.S3_PUBLIC_URL;

  console.log('🔍 Starting media recovery from storage...');
  console.log(`📦 Bucket: ${bucketName}`);
  console.log(`🌐 Public URL: ${publicUrl}`);

  try {
    // List all objects in the bucket
    let continuationToken: string | undefined;
    let totalFiles = 0;
    let recoveredFiles = 0;
    let skippedFiles = 0;

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

        totalFiles++;
        const filename = path.basename(object.Key);

        // Skip directories
        if (object.Key.endsWith('/')) {
          console.log(`⏭️  Skipping directory: ${object.Key}`);
          continue;
        }

        // Check if media already exists
        const existing = await payload.find({
          collection: 'media',
          where: {
            filename: {
              equals: filename,
            },
          },
          limit: 1,
        });

        if (existing.docs.length > 0) {
          console.log(`✅ Media already exists: ${filename}`);
          skippedFiles++;
          continue;
        }

        console.log(`📄 Processing: ${object.Key}`);

        try {
          // Get object metadata
          const headCommand = new HeadObjectCommand({
            Bucket: bucketName,
            Key: object.Key,
          });
          const headResponse = await s3Client.send(headCommand);

          // Determine mime type
          const mimeType =
            headResponse.ContentType || mime.lookup(filename) || 'application/octet-stream';
          const filesize = headResponse.ContentLength || object.Size || 0;

          // Build the URL
          const url = publicUrl
            ? `${publicUrl.replace(/\/$/, '')}/${bucketName}/${object.Key}`
            : `${process.env.S3_ENDPOINT}/${bucketName}/${object.Key}`;

          // Create the media record
          const mediaData: MediaRecord = {
            filename,
            alt: filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            mimeType,
            filesize,
            url,
            scanStatus: 'safe',
          };

          // For images, try to get dimensions
          if (mimeType.startsWith('image/')) {
            try {
              console.log(`  🖼️  Getting image dimensions for ${filename}...`);
              const getCommand = new GetObjectCommand({
                Bucket: bucketName,
                Key: object.Key,
              });
              const getResponse = await s3Client.send(getCommand);

              if (getResponse.Body) {
                const buffer = await streamToBuffer(getResponse.Body as Readable);
                const dimensions = await getImageDimensions(buffer);

                if (dimensions) {
                  mediaData.width = dimensions.width;
                  mediaData.height = dimensions.height;
                  console.log(`  📐 Dimensions: ${dimensions.width}x${dimensions.height}`);
                }
              }
            } catch (error) {
              console.log(`  ⚠️  Could not get dimensions: ${error}`);
            }
          }

          // Check for size variants
          const sizes: Record<string, any> = {};
          const baseName = filename.replace(/\.[^/.]+$/, '');
          const extension = path.extname(filename);

          // Common size suffixes used by Payload
          const sizeVariants = ['thumbnail', 'card', 'tablet'];

          for (const variant of sizeVariants) {
            const variantKey = object.Key.replace(filename, `${baseName}-${variant}${extension}`);

            try {
              const variantHead = await s3Client.send(
                new HeadObjectCommand({
                  Bucket: bucketName,
                  Key: variantKey,
                })
              );

              if (variantHead) {
                sizes[variant] = {
                  filename: `${baseName}-${variant}${extension}`,
                  filesize: variantHead.ContentLength || 0,
                  mimeType: variantHead.ContentType || mimeType,
                  width: null,
                  height: null,
                  url: publicUrl
                    ? `${publicUrl.replace(/\/$/, '')}/${bucketName}/${variantKey}`
                    : `${process.env.S3_ENDPOINT}/${bucketName}/${variantKey}`,
                };
                console.log(`  🎯 Found variant: ${variant}`);
              }
            } catch {
              // Variant doesn't exist, skip
            }
          }

          if (Object.keys(sizes).length > 0) {
            mediaData.sizes = sizes;
          }

          // Create the media record
          const created = await payload.create({
            collection: 'media',
            data: mediaData,
          });

          console.log(`  ✅ Recovered: ${filename} (ID: ${created.id})`);
          recoveredFiles++;
        } catch (error) {
          console.error(`  ❌ Error processing ${object.Key}:`, error);
        }
      }

      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);

    console.log('\n📊 Recovery Summary:');
    console.log(`  Total files found: ${totalFiles}`);
    console.log(`  Files recovered: ${recoveredFiles}`);
    console.log(`  Files skipped (already exist): ${skippedFiles}`);
  } catch (error) {
    console.error('❌ Error during recovery:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  recoverMediaFromStorage()
    .then(() => {
      console.log('✅ Media recovery completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Media recovery failed:', error);
      process.exit(1);
    });
}
