import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function resetNavigation() {
  try {
    const payload = await getPayload({ config: configPromise });

    // Delete existing navigation
    const result = await payload.find({
      collection: 'navigation',
      limit: 1,
    });

    if (result.docs.length > 0) {
      console.log('Deleting existing navigation...');
      await payload.delete({
        collection: 'navigation',
        id: result.docs[0].id,
      });
      console.log('Navigation deleted successfully');
    } else {
      console.log('No navigation found to delete');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error resetting navigation:', error);
    process.exit(1);
  }
}

resetNavigation();
