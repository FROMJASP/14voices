import { getPayload } from 'payload';
import config from '@/payload.config';

async function debugMediaThumbnails() {
  const payload = await getPayload({ config });

  try {
    // Fetch all media items
    const media = await payload.find({
      collection: 'media',
      limit: 10,
      depth: 1,
    });

    console.log('Total media items:', media.totalDocs);
    console.log('\n=== Media Thumbnail Debug ===\n');

    media.docs.forEach((doc: any, index: number) => {
      console.log(`\n--- Media Item ${index + 1} ---`);
      console.log('ID:', doc.id);
      console.log('Filename:', doc.filename);
      console.log('MimeType:', doc.mimeType);
      console.log('Main URL:', doc.url);
      console.log('ThumbnailURL:', doc.thumbnailURL);

      if (doc.sizes) {
        console.log('\nGenerated Sizes:');
        Object.entries(doc.sizes).forEach(([sizeName, sizeData]: [string, any]) => {
          console.log(`  ${sizeName}:`);
          console.log(`    - Filename: ${sizeData.filename}`);
          console.log(`    - URL: ${sizeData.url}`);
          console.log(`    - Width: ${sizeData.width}`);
          console.log(`    - Height: ${sizeData.height}`);
        });
      } else {
        console.log('No sizes generated');
      }
    });

    // Test direct S3 URL construction
    console.log('\n=== Testing S3 URL Construction ===');
    const s3PublicUrl = process.env.S3_PUBLIC_URL;
    console.log('S3_PUBLIC_URL:', s3PublicUrl);

    if (media.docs.length > 0 && s3PublicUrl) {
      const firstDoc = media.docs[0] as any;
      console.log('\nExpected URLs for first media item:');
      console.log('Main:', `${s3PublicUrl}/media/${firstDoc.filename}`);
      if (firstDoc.sizes?.thumbnail) {
        console.log('Thumbnail:', `${s3PublicUrl}/media/${firstDoc.sizes.thumbnail.filename}`);
      }
    }
  } catch (error) {
    console.error('Error debugging media:', error);
  }

  process.exit(0);
}

debugMediaThumbnails();
