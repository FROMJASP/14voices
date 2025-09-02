import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function updateLastLoginForAllUsers() {
  const payload = await getPayload({ config: configPromise });

  try {
    console.log('Starting to update lastLogin for all users...');

    // Get all users
    const users = await payload.find({
      collection: 'users',
      limit: 1000,
    });

    console.log(`Found ${users.docs.length} users`);

    // Update each user's lastLogin to their updatedAt time if lastLogin is not set
    for (const user of users.docs) {
      if (!user.lastLogin && user.updatedAt) {
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            lastLogin: user.updatedAt,
          },
        });
        console.log(`Updated lastLogin for user: ${user.email}`);
      }
    }

    console.log('Finished updating lastLogin for all users');
    process.exit(0);
  } catch (error) {
    console.error('Error updating lastLogin:', error);
    process.exit(1);
  }
}

updateLastLoginForAllUsers();
