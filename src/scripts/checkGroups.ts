import { getPayload } from 'payload';
import configPromise from '../payload.config';

async function checkGroups() {
  try {
    const payload = await getPayload({ config: configPromise });

    const groups = await payload.find({
      collection: 'groups',
      limit: 100,
      depth: 0,
    });

    console.log(`Total groups: ${groups.totalDocs}`);
    console.log('Available groups:');

    groups.docs.forEach((group: any) => {
      console.log(`- ID: ${group.id}, Name: ${group.name}, Slug: ${group.slug}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

checkGroups();
