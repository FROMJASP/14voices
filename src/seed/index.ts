import path from 'path';

// Load environment variables only if dotenv is available (dev environment)
if (process.env.NODE_ENV !== 'production') {
  try {
    // Dynamically import dotenv to avoid production dependency
    const dotenv = await import('dotenv');
    dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
  } catch (e) {
    // dotenv is not available, which is fine
    // Environment variables should already be set
    console.warn('dotenv not available. Ensure environment variables are set.');
  }
}

// Now import everything else after env vars are loaded
import { getPayload } from 'payload';
import config from '../payload.config';
import { seedSiteSettings } from './site-settings';
import { seedLayouts } from './layouts';
import { seedPages } from './pages';
import { seedVoiceovers } from './voiceovers';
import { faqSeedData } from './faq';

// Debug: Check if env vars are loaded
console.log('🔍 Checking environment variables...');
console.log('   PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? '✓ Set' : '✗ Missing');
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ Missing');
console.log('   POSTGRES_URL:', process.env.POSTGRES_URL ? '✓ Set' : '✗ Missing');
console.log('');

// Validate required environment variables
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ Missing required environment variable: PAYLOAD_SECRET');
  console.error('\n💡 Make sure you have a .env.local file with this variable.');
  console.error('   See .env.example for reference.');
  process.exit(1);
}

if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  console.error('❌ Missing required database connection string.');
  console.error('   Please set either DATABASE_URL or POSTGRES_URL in your .env.local file.');
  console.error('\n💡 See .env.example for reference.');
  process.exit(1);
}

async function seed() {
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
          status: 'active',
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
    await seedLayouts();
    console.log('');

    // 4. Create sample pages
    console.log('📄 Creating sample pages...');
    await seedPages(payload);
    console.log('');

    // 5. Create voiceovers
    console.log('🎤 Creating voiceovers...');
    await seedVoiceovers(payload);
    console.log('');

    // 6. Create FAQ items
    console.log('❓ Creating FAQ items...');
    const existingFAQ = await payload.find({
      collection: 'faq',
      limit: 1,
    });

    if (existingFAQ.docs.length === 0) {
      for (const faq of faqSeedData) {
        await payload.create({
          collection: 'faq',
          data: faq,
        });
      }
      console.log(`✓ Created ${faqSeedData.length} FAQ items`);
    } else {
      console.log('✓ FAQ items already exist, skipping...');
    }
    console.log('');

    // 7. Create navigation
    console.log('🧭 Creating navigation...');
    // Navigation seeding removed - navigation collection is disabled
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
