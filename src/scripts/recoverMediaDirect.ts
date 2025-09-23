import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';
import { S3Client, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import mime from 'mime-types';

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

export async function recoverMediaDirect() {
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

  console.log('🔍 Starting direct media recovery from storage...');
  console.log(`📦 Bucket: ${bucketName}`);
  console.log(`🌐 Public URL: ${publicUrl}`);
  console.log('⚠️  This script bypasses file validation for recovery purposes\n');

  try {
    // First, let's test if we can actually access the files
    console.log('🧪 Testing S3/MinIO access...');

    const testCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 1,
    });

    const testResponse = await s3Client.send(testCommand);
    console.log('✅ S3/MinIO connection successful\n');

    // List all objects in the bucket
    let continuationToken: string | undefined;
    let totalFiles = 0;
    let recoveredFiles = 0;
    let skippedFiles = 0;

    // Get database connection to insert directly
    const db = payload.db;

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

          // Determine mime type based on file extension
          const extension = path.extname(filename).toLowerCase();
          const mimeType = mime.lookup(filename) || 'application/octet-stream';

          // Override mime type based on extension if we got text/html
          if (headResponse.ContentType === 'text/html') {
            console.log(
              `  ⚠️  Got text/html for ${filename}, using extension-based mime type: ${mimeType}`
            );
          }

          const filesize = headResponse.ContentLength || object.Size || 0;

          // Build the URL
          const url = publicUrl
            ? `${publicUrl.replace(/\/$/, '')}/${object.Key}`
            : `${process.env.S3_ENDPOINT}/${bucketName}/${object.Key}`;

          // Directly insert into database, bypassing hooks
          const mediaData = {
            filename,
            alt: filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            mimeType,
            filesize,
            url,
            scanStatus: 'safe',
            scanDetails: {
              scannedAt: new Date(),
              note: 'Recovered from storage - validation bypassed',
            },
            width: null,
            height: null,
            thumbnailURL: url, // Use main URL as thumbnail for now
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // For images, check for size variants
          if (mimeType.startsWith('image/')) {
            const sizes: Record<string, any> = {};
            const baseName = filename.replace(/\.[^/.]+$/, '');
            const extension = path.extname(filename);

            // Check if this IS a size variant
            const sizePattern = /-(thumbnail|card|tablet|400x300|768x1024|1024x\d+)(\.|$)/;
            const isVariant = sizePattern.test(filename);

            if (!isVariant) {
              // This is a main file, look for its variants
              const sizeVariants = ['thumbnail', 'card', 'tablet', '400x300', '768x1024'];

              for (const variant of sizeVariants) {
                const variantFilename = `${baseName}-${variant}${extension}`;

                // Check if this variant exists in our file list
                const variantExists = objects.some(
                  (obj) => obj.Key && path.basename(obj.Key) === variantFilename
                );

                if (variantExists) {
                  const variantUrl = publicUrl
                    ? `${publicUrl.replace(/\/$/, '')}/${variantFilename}`
                    : `${process.env.S3_ENDPOINT}/${bucketName}/${variantFilename}`;

                  sizes[
                    variant === '400x300'
                      ? 'thumbnail'
                      : variant === '768x1024'
                        ? 'card'
                        : variant === '1024x1293'
                          ? 'tablet'
                          : variant
                  ] = {
                    filename: variantFilename,
                    mimeType: mimeType,
                    filesize: 0, // We'll update this when we process the variant file
                    width: null,
                    height: null,
                    url: variantUrl,
                  };
                  console.log(`  🎯 Found variant: ${variant}`);
                }
              }

              if (Object.keys(sizes).length > 0) {
                mediaData.sizes = sizes;
                // Use thumbnail for thumbnailURL if available
                if (sizes.thumbnail) {
                  mediaData.thumbnailURL = sizes.thumbnail.url;
                }
              }
            } else {
              // This is a variant file, skip creating a separate record for it
              console.log(`  ⏭️  Skipping variant file: ${filename}`);
              continue;
            }
          }

          // Create the media record using Payload's API (without file upload)
          const created = await payload.create({
            collection: 'media',
            data: mediaData,
            overrideAccess: true, // Override access control
            disableVerificationEmail: true,
            skipValidation: true, // Skip validation if possible
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
  recoverMediaDirect()
    .then(() => {
      console.log('✅ Media recovery completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Media recovery failed:', error);
      process.exit(1);
    });
}
