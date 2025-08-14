import path from 'path';
import { getPayload } from 'payload';

async function loadEnv() {
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
}

async function runSeed() {
  // Load environment variables first
  await loadEnv();
  
  console.log('🔍 Environment check:');
  console.log('   PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? '✓ Set' : '✗ Missing');
  console.log('   POSTGRES_URL:', process.env.POSTGRES_URL ? '✓ Set' : '✗ Missing');
  console.log('');
  
  // Dynamically import the config AFTER env vars are loaded
  const configModule = await import('../payload.config');
  const config = configModule.default;

  // Import seed functions
  const { seedSiteSettings } = await import('./site-settings');
  const { seedLayouts } = await import('./layouts');
  const { seedPages } = await import('./pages');
  const { seedVoiceovers } = await import('./voiceovers');
  const { faqSeedData } = await import('./faq');

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

    // 7. Navigation - skipped (collection disabled)
    console.log('🧭 Navigation setup skipped (collection disabled)');
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

runSeed();
