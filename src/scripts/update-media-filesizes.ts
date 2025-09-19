import { getPayload } from 'payload';
import configPromise from '@payload-config';
import fs from 'fs';
import path from 'path';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';

async function updateMediaFilesizes() {
  const payload = await getPayload({ config: configPromise });

  try {
    // Get all media documents
    const media = await payload.find({
      collection: 'media',
      limit: 1000,
    });

    console.log(`Found ${media.docs.length} media documents`);

    let updated = 0;
    let errors = 0;

    // Initialize S3 client for production
    let s3Client: S3Client | null = null;
    const isProduction = process.env.NODE_ENV === 'production' || !!process.env.S3_ACCESS_KEY;

    if (isProduction && process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY) {
      s3Client = new S3Client({
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_KEY,
        },
        region: process.env.S3_REGION || 'us-east-1',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
      });
    }

    for (const doc of media.docs) {
      try {
        // Skip if filesize already exists
        if (doc.filesize && typeof doc.filesize === 'number') {
          console.log(`✓ ${doc.filename} already has filesize: ${doc.filesize}`);
          continue;
        }

        let filesize: number | null = null;

        // Try to get filesize from the file system (development)
        if ((!isProduction || !s3Client) && doc.filename) {
          const mediaPath = path.join(process.cwd(), 'media', doc.filename);

          if (fs.existsSync(mediaPath)) {
            const stats = fs.statSync(mediaPath);
            filesize = stats.size;
          }
        } else if (s3Client && process.env.S3_BUCKET && doc.filename) {
          // Try to get filesize from S3
          try {
            const command = new HeadObjectCommand({
              Bucket: process.env.S3_BUCKET,
              Key: `media/${doc.filename}`,
            });

            const response = await s3Client.send(command);
            if (response.ContentLength) {
              filesize = response.ContentLength;
            }
          } catch (s3Error) {
            console.log(`⚠️  Could not get S3 object size for ${doc.filename}`);
          }
        }

        if (filesize !== null) {
          await payload.update({
            collection: 'media',
            id: doc.id,
            data: {
              filesize,
            },
          });

          updated++;
          console.log(`✅ Updated ${doc.filename} with filesize: ${filesize}`);
        } else {
          console.log(`⚠️  Could not determine filesize for: ${doc.filename}`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error updating ${doc.filename}:`, error);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total documents: ${media.docs.length}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors: ${errors}`);
    console.log(`   Skipped: ${media.docs.length - updated - errors}`);
  } catch (error) {
    console.error('Failed to update media filesizes:', error);
    process.exit(1);
  }

  process.exit(0);
}

updateMediaFilesizes();
