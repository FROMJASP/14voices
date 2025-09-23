/**
 * Setup script for new PostgreSQL database
 */

import { getPayload } from 'payload';
import config from '@/payload.config';

const setupDatabase = async () => {
  console.log('\n🚀 Setting up new PostgreSQL database\n');

  try {
    // Initialize Payload - this will create all tables
    console.log('📋 Creating database schema...');
    const payload = await getPayload({
      config,
    });

    console.log('✅ Database schema created successfully!');

    // Create admin user
    console.log('\n👤 Creating admin user...');

    const existingAdmin = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'jasper@stemacteren.nl',
        },
      },
      limit: 1,
    });

    if (existingAdmin.docs.length === 0) {
      const admin = await payload.create({
        collection: 'users',
        data: {
          email: 'jasper@stemacteren.nl',
          password: 'Welcome123!', // Please change this!
          name: 'Jasper Hartsuijker',
          role: 'admin',
          jobTitle: 'Administrator',
        },
      });

      console.log('✅ Admin user created!');
      console.log('📧 Email:', admin.email);
      console.log('🔑 Temporary password: Welcome123!');
      console.log('⚠️  Please change this password immediately!');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create default site settings
    console.log('\n⚙️  Creating site settings...');

    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    });

    if (!siteSettings) {
      await payload.updateGlobal({
        slug: 'site-settings',
        data: {
          siteName: 'Fourteen Voices',
          siteUrl: 'https://14voices.com',
          language: 'nl',
        },
      });
      console.log('✅ Site settings created');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('\nYou can now:');
    console.log('1. Start your development server: bun dev');
    console.log('2. Login at http://localhost:3000/admin');
    console.log('3. Use the credentials provided above');
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    console.log('\nTroubleshooting:');
    console.log('1. Check your DATABASE_URL in .env.local');
    console.log('2. Ensure PostgreSQL is running in Coolify');
    console.log('3. Check if you can connect using psql');
  }
};

// Run the setup
setupDatabase().catch(console.error);
