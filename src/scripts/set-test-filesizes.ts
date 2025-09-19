import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function setTestFilesizes() {
  const payload = await getPayload({ config: configPromise });

  try {
    // Get a few media documents to test
    const media = await payload.find({
      collection: 'media',
      limit: 5,
    });

    console.log(`Found ${media.docs.length} media documents`);

    // Set test filesizes for demonstration
    const testSizes = [
      1234567, // 1.2 MB
      567890, // 554 KB
      23456789, // 22.4 MB
      345678, // 337 KB
      12345678, // 11.8 MB
    ];

    for (let i = 0; i < media.docs.length && i < testSizes.length; i++) {
      const doc = media.docs[i];

      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          filesize: testSizes[i],
        },
      });

      console.log(`✅ Set test filesize for ${doc.filename}: ${testSizes[i]} bytes`);
    }

    console.log('\n✨ Test filesizes set! Check the admin panel to see the human-readable sizes.');
  } catch (error) {
    console.error('Failed to set test filesizes:', error);
    process.exit(1);
  }

  process.exit(0);
}

setTestFilesizes();
