import { getPayload } from 'payload';
import config from '@/payload.config';

async function migrateVoiceoverSlugs() {
  const payload = await getPayload({ config });

  try {
    console.log('Starting voiceover slug migration...');

    // Fetch all voiceovers
    const { docs: voiceovers } = await payload.find({
      collection: 'voiceovers',
      limit: 1000,
      depth: 0,
    });

    console.log(`Found ${voiceovers.length} voiceovers to migrate`);

    // Track duplicates
    const firstNameMap = new Map<string, string[]>();

    // First pass: check for duplicate first names
    for (const voiceover of voiceovers) {
      const firstName = voiceover.name.split(' ')[0].toLowerCase();
      const existing = firstNameMap.get(firstName) || [];
      existing.push(voiceover.name);
      firstNameMap.set(firstName, existing);
    }

    // Report duplicates
    const duplicates = Array.from(firstNameMap.entries()).filter(([_, names]) => names.length > 1);
    if (duplicates.length > 0) {
      console.log('\n⚠️  WARNING: Found duplicate first names:');
      duplicates.forEach(([firstName, names]) => {
        console.log(`  - "${firstName}": ${names.join(', ')}`);
      });
      console.log('\nThese voiceovers will need manual intervention to ensure unique URLs.');
      console.log('Consider adding middle initials or nicknames to differentiate them.\n');
    }

    // Second pass: update slugs
    let updated = 0;
    let skipped = 0;

    for (const voiceover of voiceovers) {
      const firstName = voiceover.name.split(' ')[0];
      const newSlug = firstName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (voiceover.slug !== newSlug) {
        try {
          await payload.update({
            collection: 'voiceovers',
            id: voiceover.id,
            data: {
              slug: newSlug,
            },
          });
          console.log(`✅ Updated ${voiceover.name}: ${voiceover.slug} → ${newSlug}`);
          updated++;
        } catch (error) {
          console.error(`❌ Failed to update ${voiceover.name}:`, error);
          skipped++;
        }
      } else {
        console.log(`⏭️  Skipped ${voiceover.name}: slug already correct (${voiceover.slug})`);
        skipped++;
      }
    }

    console.log(`\nMigration complete!`);
    console.log(`✅ Updated: ${updated} voiceovers`);
    console.log(`⏭️  Skipped: ${skipped} voiceovers`);

    if (duplicates.length > 0) {
      console.log(
        `\n⚠️  Remember to manually handle the ${duplicates.length} duplicate first names listed above!`
      );
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the migration
migrateVoiceoverSlugs();
