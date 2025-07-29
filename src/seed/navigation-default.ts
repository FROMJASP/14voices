import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function seedDefaultNavigation() {
  const payload = await getPayload({ config: configPromise });

  try {
    // Check if navigation already exists
    const existingNav = await payload.find({
      collection: 'navigation',
      limit: 1,
    });

    if (existingNav.docs.length > 0) {
      console.log('Navigation already exists, updating...');

      // Update existing navigation
      await payload.update({
        collection: 'navigation',
        id: existingNav.docs[0].id,
        data: {
          mainMenu: [
            {
              label: 'Home',
              type: 'page',
              page: undefined, // This would need to be linked to actual page
            },
            {
              label: 'Stemmen',
              type: 'anchor',
              anchor: 'stemmen',
            },
            {
              label: 'Prijzen',
              type: 'anchor',
              anchor: 'prijzen',
            },
            {
              label: 'Blog',
              type: 'anchor',
              anchor: 'blog',
            },
            {
              label: 'Contact',
              type: 'anchor',
              anchor: 'contact',
            },
          ],
        },
      });
    } else {
      // Create new navigation
      await payload.create({
        collection: 'navigation',
        data: {
          mainMenu: [
            {
              label: 'Home',
              type: 'page',
              page: undefined,
            },
            {
              label: 'Stemmen',
              type: 'anchor',
              anchor: 'stemmen',
            },
            {
              label: 'Prijzen',
              type: 'anchor',
              anchor: 'prijzen',
            },
            {
              label: 'Blog',
              type: 'anchor',
              anchor: 'blog',
            },
            {
              label: 'Contact',
              type: 'anchor',
              anchor: 'contact',
            },
          ],
        },
      });
    }

    console.log('✅ Default navigation seeded successfully');
  } catch (error) {
    console.error('Error seeding navigation:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedDefaultNavigation()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
