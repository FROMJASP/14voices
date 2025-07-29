import { getPayload } from 'payload';
import configPromise from '../src/payload.config.js';

async function checkDatabase() {
  console.log('Checking database...');

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    console.log('✅ Database connection successful');

    // Try to fetch layouts
    const layouts = await payload.find({
      collection: 'layouts',
      limit: 1,
    });

    console.log(`✅ Found ${layouts.totalDocs} layouts`);
    console.log('✅ Database schema appears to be up to date');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.log('\nPlease run: npm run payload migrate');
    process.exit(1);
  }
}

checkDatabase();
