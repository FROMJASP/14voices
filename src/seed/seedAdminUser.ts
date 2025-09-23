/**
 * Seed an admin user for fresh database setup
 */

import { getPayload } from 'payload';
import config from '@/payload.config';

const seedAdmin = async () => {
  console.log('\n👤 Creating Admin User\n');

  const payload = await getPayload({
    config,
  });

  try {
    // Check if admin already exists
    const existingAdmin = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'jasper@stemacteren.nl',
        },
      },
      limit: 1,
    });

    if (existingAdmin.docs.length > 0) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const admin = await payload.create({
      collection: 'users',
      data: {
        email: 'jasper@stemacteren.nl',
        password: 'TempPassword123!', // Change this immediately after first login!
        name: 'Jasper Hartsuijker',
        role: 'admin',
        jobTitle: 'Administrator',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Temporary password: TempPassword123!');
    console.log('⚠️  Please change this password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
};

// Run the seeder
seedAdmin().catch(console.error);
