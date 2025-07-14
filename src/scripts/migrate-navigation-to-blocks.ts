import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function migrateNavigationToBlocks() {
  const payload = await getPayload({ config: configPromise });

  try {
    console.log('Starting Navigation to Blocks migration...');

    // Get all navigation documents
    const navigations = await payload.find({
      collection: 'navigation',
      limit: 100,
    });

    console.log(`Found ${navigations.docs.length} navigation documents to migrate`);

    for (const nav of navigations.docs) {
      console.log(`\nMigrating navigation: ${nav.id}`);

      // Create navbar block if navbar exists
      if (nav.navbar) {
        const navbarBlock = await payload.create({
          collection: 'blocks',
          data: {
            name: `Navbar - ${nav.name || 'Default'}`,
            blockType: 'navbar',
            navbar: nav.navbar,
            visibility: nav.navbarVisibility || {
              desktop: true,
              tablet: true,
              mobile: true,
            },
          },
        });
        console.log(`Created navbar block: ${navbarBlock.id}`);
      }

      // Create footer block if footer exists
      if (nav.footer) {
        const footerBlock = await payload.create({
          collection: 'blocks',
          data: {
            name: `Footer - ${nav.name || 'Default'}`,
            blockType: 'footer',
            footer: nav.footer,
            visibility: nav.footerVisibility || {
              desktop: true,
              tablet: true,
              mobile: true,
            },
          },
        });
        console.log(`Created footer block: ${footerBlock.id}`);
      }

      // Create banner block if banner exists
      if (nav.banner && nav.banner.enabled) {
        const bannerBlock = await payload.create({
          collection: 'blocks',
          data: {
            name: `Banner - ${nav.name || 'Default'}`,
            blockType: 'banner',
            banner: nav.banner,
            visibility: nav.bannerVisibility || {
              desktop: true,
              tablet: true,
              mobile: true,
            },
          },
        });
        console.log(`Created banner block: ${bannerBlock.id}`);
      }
    }

    // Create a default layout with the migrated blocks
    const blocks = await payload.find({
      collection: 'blocks',
      where: {
        or: [
          { blockType: { equals: 'navbar' } },
          { blockType: { equals: 'footer' } },
          { blockType: { equals: 'banner' } },
        ],
      },
      limit: 100,
    });

    const blockIds = blocks.docs.map((block) => block.id);

    const defaultLayout = await payload.create({
      collection: 'layouts',
      data: {
        name: 'Default Layout (Migrated)',
        description: 'Automatically migrated from Navigation collection',
        blocks: blockIds,
        isDefault: true,
        settings: {
          containerWidth: 'standard',
          spacing: {
            contentPadding: 'medium',
          },
        },
      },
    });

    console.log(`\nCreated default layout: ${defaultLayout.id} with ${blockIds.length} blocks`);
    console.log('\nMigration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify the migrated blocks in the Blocks collection');
    console.log('2. Check the default layout in the Layouts collection');
    console.log('3. Remove the Navigation collection from your database');
    console.log('4. Update any pages that were using the Navigation collection');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

migrateNavigationToBlocks();
