// Alternative seed script using Next.js environment loading
import '@/lib/env';
import { getPayload } from 'payload';
import config from '../payload.config';
import { seedSiteSettings } from './site-settings';
import { seedLayouts } from './layouts';
import { seedPages } from './pages';
import { seedVoiceovers } from './voiceovers';
import { seedNavigation } from './navigation';

async function seed() {
  console.log('🔍 Environment check:');
  console.log('   PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? '✓ Set' : '✗ Missing');
  console.log('   POSTGRES_URL:', process.env.POSTGRES_URL ? '✓ Set' : '✗ Missing');
  console.log('');

  if (!process.env.PAYLOAD_SECRET) {
    console.error('❌ PAYLOAD_SECRET is required');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    console.error('❌ Database connection string is required');
    process.exit(1);
  }

  const payload = await getPayload({ config });

  try {
    console.log('🌱 Starting database seed...\n');

    // 1. Create admin user if needed
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    });

    if (existingUsers.docs.length === 0) {
      const adminUser = await payload.create({
        collection: 'users',
        data: {
          email: process.env.ADMIN_EMAIL || 'admin@14voices.com',
          password: process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!',
          name: 'Admin User',
          role: 'admin',
        },
      });

      console.log('✅ Admin user created:', adminUser.email);
      console.log('⚠️  IMPORTANT: Change the password after first login!\n');
    } else {
      console.log('ℹ️  Users already exist, skipping user seed\n');
    }

    // 2. Create site settings
    console.log('📋 Setting up site configuration...');
    await seedSiteSettings(payload);
    console.log('');

    // 3. Create layouts with beautiful footer
    console.log('🎨 Creating layouts with footer...');
    await seedLayouts(payload);
    console.log('');

    // 4. Create sample pages
    console.log('📄 Creating sample pages...');
    await seedPages(payload);
    console.log('');

    // 5. Create voiceovers
    console.log('🎤 Creating voiceovers...');
    await seedVoiceovers(payload);
    console.log('');

    // 6. Create navigation
    console.log('🧭 Creating navigation...');
    await seedNavigation(payload);
    console.log('');

    console.log('✨ Database seed completed successfully!');
    console.log('\n🚀 You can now:');
    console.log('   - Log in to the admin panel with the credentials above');
    console.log('   - View the default layout with a beautiful footer');
    console.log('   - Customize the footer in Site Builder → Layouts');
    console.log('   - Create new pages using the default layout');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
