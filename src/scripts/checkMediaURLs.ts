import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';

export async function checkMediaURLs() {
  const payload = await getPayloadHMR({ config: configPromise });

  console.log('Checking media URLs in database...\n');

  try {
    const media = await payload.find({
      collection: 'media',
      limit: 5, // Just check first 5
    });

    console.log(`Found ${media.totalDocs} total media records\n`);

    for (const item of media.docs) {
      console.log(`ID: ${item.id}`);
      console.log(`Filename: ${item.filename}`);
      console.log(`URL: ${item.url}`);
      console.log(`Thumbnail URL: ${item.thumbnailURL}`);
      console.log(`---`);
    }
  } catch (error) {
    console.error('Error checking media URLs:', error);
  }
}

// Run if called directly
if (import.meta.main) {
  checkMediaURLs()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
