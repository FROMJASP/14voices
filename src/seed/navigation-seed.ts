import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function seedNavigation() {
  const payload = await getPayload({ config: configPromise });

  try {
    // Check if navigation already exists
    const existing = await payload.find({
      collection: 'navigation',
      limit: 1,
    });

    if (existing.docs.length > 0) {
      console.log('Navigation already exists, updating...');

      // Update existing navigation
      await payload.update({
        collection: 'navigation',
        id: existing.docs[0].id,
        data: {
          mainMenu: [
            {
              label: 'Home',
              type: 'page',
              page: null, // Will link to home page
            },
            {
              label: 'Voiceovers',
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
          banner: {
            enabled: true,
            message: '🚀 **14 Nieuwe Stemmen**. Beluister hier wat ze voor jou kunnen betekenen!',
            dismissible: false,
            style: 'subtle',
            linkType: 'none',
          },
        },
      });

      console.log('Navigation updated successfully!');
    } else {
      // Create new navigation
      await payload.create({
        collection: 'navigation',
        data: {
          mainMenu: [
            {
              label: 'Home',
              type: 'page',
              page: null,
            },
            {
              label: 'Voiceovers',
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
          banner: {
            enabled: true,
            message: '🚀 **14 Nieuwe Stemmen**. Beluister hier wat ze voor jou kunnen betekenen!',
            dismissible: false,
            style: 'subtle',
            linkType: 'none',
          },
        },
      });

      console.log('Navigation created successfully!');
    }
  } catch (error) {
    console.error('Error seeding navigation:', error);
  }
}

// Run the seed function
seedNavigation()
  .then(() => {
    console.log('Navigation seeding complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Navigation seeding failed:', error);
    process.exit(1);
  });
