// import { getPayload } from 'payload';
// import configPromise from '@payload-config';

async function createDefaultBlocks() {
  // const payload = await getPayload({ config: configPromise });

  try {
    console.log('Default blocks functionality has been disabled - collections do not exist');
    // The 'blocks' and 'layouts' collections referenced in this file no longer exist
    // in the current Payload CMS configuration. This functionality has been disabled.
    return;

    /*
    // Original code commented out as collections don't exist
    console.log('Creating default blocks for 14voices...');

    // Check if blocks already exist
    const existingBlocks = await payload.find({
      collection: 'blocks',
      limit: 100,
    });

    if (existingBlocks.docs.length > 0) {
      console.log('Blocks already exist. Skipping creation.');

      // Create or update homepage layout
      const layouts = await payload.find({
        collection: 'layouts',
        where: {
          name: {
            equals: 'Homepage Layout',
          },
        },
      });

      if (layouts.docs.length === 0) {
        // Get all block IDs in order: navbar, hero, footer
        const navbar = existingBlocks.docs.find((block) => block.blockType === 'navbar');
        const hero = existingBlocks.docs.find((block) => block.blockType === 'hero');
        const footer = existingBlocks.docs.find((block) => block.blockType === 'footer');

        if (navbar && hero && footer) {
          await payload.create({
            collection: 'layouts',
            data: {
              name: 'Homepage Layout',
              blocks: [navbar.id, hero.id, footer.id],
            },
          });

          console.log('Homepage layout created with existing blocks');
        }
      }

      return;
    }

    // ... rest of the original code ...
    */
  } catch (error) {
    console.error('Error in createDefaultBlocks:', error);
  }
}

export default createDefaultBlocks;
