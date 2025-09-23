import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import path from 'path';
import mime from 'mime-types';

// Manual mapping of files we know exist in storage
const KNOWN_FILES = [
  // Audio files
  { filename: 'Bjo_rn-full-Demo-reel_1756831589510.mp3', type: 'audio', size: 4309514 },
  { filename: 'Gina-Demo_1756819589316.mp3', type: 'audio', size: 2193808 },
  { filename: 'Jorien-full-demo-reel_1756827433284.mp3', type: 'audio', size: 4310968 },
  { filename: 'Michelle-Full-Demo-reel_1756828103959.mp3', type: 'audio', size: 2391240 },
  { filename: 'Oguilvio-Full-Demo-Reel_1756827933923.mp3', type: 'audio', size: 3355848 },
  { filename: 'Sabine-Demo_1756827747714.mp3', type: 'audio', size: 2054424 },
  { filename: 'ivan-full-demo-reel_1756831364726.mp3', type: 'audio', size: 0 },

  // Main images (not variants)
  { filename: 'Bjorn-portret_1756831503805.jpg', type: 'image', variants: ['400x300'] },
  {
    filename: 'Ivan_1756831231250.jpg',
    type: 'image',
    variants: ['400x300', '768x1024', '1024x1293'],
  },
  {
    filename: 'Michelle-portet_1756828385087.jpg',
    type: 'image',
    variants: ['400x300', '768x1024'],
  },
  {
    filename: 'Oguilvio_1756827865158.jpg',
    type: 'image',
    variants: ['400x300', '768x1024', '1024x1280'],
  },
  {
    filename: 'T308TMLTU-U308TMLV8-4fba3b66ba84-512_1757944406369.png',
    type: 'image',
    variants: ['400x300'],
  },
  { filename: 'camilla_1757945165753.png', type: 'image', variants: ['400x300'] },
  { filename: 'gina_1756819501697.png', type: 'image', variants: ['400x300', '768x1024'] },
  { filename: 'hero-image_1756746260304.png', type: 'image', variants: ['400x300', '768x1024'] },
  { filename: 'jan_1757944664431.jpeg', type: 'image', variants: ['400x300'] },
  { filename: 'jasp-avatar_1756391814877.jpg', type: 'avatar', variants: ['400x300'] },
  { filename: 'jasp-avatar_1756395782624.jpg', type: 'avatar', variants: [] },
  { filename: 'jasp_1756455422733.jpeg', type: 'avatar', variants: ['400x300'] },
  { filename: 'jorien_1756827355452', type: 'image', variants: ['400x300'] },
  { filename: 'lune_1757945319258.png', type: 'image', variants: ['400x300'] },
  { filename: 'mabel_1757944756546.jpeg', type: 'image', variants: ['400x300'] },
  { filename: 'malou_1757945069112.png', type: 'image', variants: ['400x300'] },
  { filename: 'mike_1757945241386.jpeg', type: 'image', variants: ['400x300'] },
  { filename: 'nienke_1757944950725.jpeg', type: 'image', variants: ['400x300'] },
  { filename: 'rinus_1757944548634.jpeg', type: 'image', variants: ['400x300'] },
  { filename: 'sabine-portret_1756827684881', type: 'image', variants: ['400x300'] },
  { filename: 'thyrza_1757944852461.png', type: 'image', variants: ['400x300'] },
  {
    filename: 'vrouw-die-koptelefoon-draagt-op-station_1756911823149',
    type: 'image',
    variants: ['400x300', '768x1024', '1024x574'],
  },

  // Video
  { filename: 'videoproductie.mp4', type: 'video', size: 2203911 },
];

export async function recoverMediaManual() {
  const payload = await getPayloadHMR({ config: configPromise });

  const publicUrl = process.env.S3_PUBLIC_URL;
  const bucketName = process.env.S3_BUCKET!;

  console.log('🔍 Starting manual media recovery...');
  console.log(`📦 Using public URL: ${publicUrl}`);
  console.log(`🗂️  Processing ${KNOWN_FILES.length} known files\n`);

  let recoveredFiles = 0;
  let skippedFiles = 0;

  for (const fileInfo of KNOWN_FILES) {
    const { filename, type, variants = [], size } = fileInfo;

    // Skip variant files themselves
    if (
      filename.includes('-400x300') ||
      filename.includes('-768x1024') ||
      filename.includes('-1024x')
    ) {
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
      console.log(`✅ Already exists: ${filename}`);
      skippedFiles++;
      continue;
    }

    console.log(`📄 Creating: ${filename}`);

    try {
      // Determine mime type
      const extension = path.extname(filename).toLowerCase();
      let mimeType = mime.lookup(filename) || 'application/octet-stream';

      // Override for files without extension
      if (!extension) {
        if (type === 'image') mimeType = 'image/jpeg';
        else if (type === 'audio') mimeType = 'audio/mpeg';
      }

      // Build the URL
      const url = publicUrl
        ? `${publicUrl.replace(/\/$/, '')}/${filename}`
        : `${process.env.S3_ENDPOINT}/${bucketName}/${filename}`;

      // Create the media data
      const mediaData: any = {
        filename,
        alt: filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        mimeType,
        filesize: size || 0,
        url,
        scanStatus: 'safe',
        scanDetails: {
          scannedAt: new Date(),
          note: 'Manually recovered from storage',
        },
        thumbnailURL: url,
      };

      // Add sizes for images with variants
      if (type === 'image' && variants.length > 0) {
        const sizes: Record<string, any> = {};
        const baseName = filename.replace(/\.[^/.]+$/, '');
        const ext = extension || '.jpg';

        for (const variant of variants) {
          const variantFilename = `${baseName}-${variant}${ext}`;
          const variantUrl = publicUrl
            ? `${publicUrl.replace(/\/$/, '')}/${variantFilename}`
            : `${process.env.S3_ENDPOINT}/${bucketName}/${variantFilename}`;

          const sizeName =
            variant === '400x300'
              ? 'thumbnail'
              : variant === '768x1024'
                ? 'card'
                : variant === '1024x574'
                  ? 'tablet'
                  : variant === '1024x1280'
                    ? 'tablet'
                    : variant === '1024x1293'
                      ? 'tablet'
                      : variant;

          sizes[sizeName] = {
            filename: variantFilename,
            mimeType: mimeType,
            filesize: 0,
            width: parseInt(variant.split('x')[0]) || null,
            height: parseInt(variant.split('x')[1]) || null,
            url: variantUrl,
          };
        }

        mediaData.sizes = sizes;

        // Use thumbnail for thumbnailURL if available
        if (sizes.thumbnail) {
          mediaData.thumbnailURL = sizes.thumbnail.url;
        }
      }

      // Create the media record
      const created = await payload.create({
        collection: 'media',
        data: mediaData,
        overrideAccess: true,
        disableVerificationEmail: true,
      });

      console.log(`  ✅ Created: ${filename} (ID: ${created.id})`);
      recoveredFiles++;
    } catch (error) {
      console.error(`  ❌ Error creating ${filename}:`, error);
    }
  }

  console.log('\n📊 Recovery Summary:');
  console.log(`  Files processed: ${KNOWN_FILES.length}`);
  console.log(`  Files recovered: ${recoveredFiles}`);
  console.log(`  Files skipped (already exist): ${skippedFiles}`);
}

// Run if called directly
if (require.main === module) {
  recoverMediaManual()
    .then(() => {
      console.log('✅ Manual media recovery completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Manual media recovery failed:', error);
      process.exit(1);
    });
}
