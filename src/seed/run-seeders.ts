import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { seedProductions } from './productions';
import { seedExtraServices } from './extra-services';

async function runSeeders() {
  try {
    console.log('🌱 Starting seeding process...\n');

    const payload = await getPayload({ config: configPromise });

    // Run seeders in order
    await seedProductions(payload);
    console.log('\n');
    await seedExtraServices(payload);

    console.log('\n✅ All seeders completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeders();
