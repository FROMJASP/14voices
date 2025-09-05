import { getPayload } from 'payload';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function clearHeroData() {
  const configPath = path.resolve(process.cwd(), 'src/payload.config.ts');
  const config = await import(configPath).then(mod => mod.default);
  const payload = await getPayload({ config });

  try {
    console.log('Finding pages with hero data to clear...');
    
    // Find all pages
    const pages = await payload.find({
      collection: 'pages',
      limit: 100,
      depth: 0,
    });

    console.log(`Found ${pages.docs.length} pages`);

    for (const page of pages.docs) {
      // Check if this page has layout blocks with hero data
      if (page.layout && Array.isArray(page.layout)) {
        let hasChanges = false;
        const updatedLayout = page.layout.map((block: any) => {
          if (block.blockType === 'hero-v1' || block.blockType === 'hero-v2') {
            // Clear title and description if they're strings (plain text)
            if (typeof block.title === 'string') {
              console.log(`Clearing plain text title for ${page.slug} (${block.blockType})`);
              block.title = null;
              hasChanges = true;
            }
            if (typeof block.description === 'string') {
              console.log(`Clearing plain text description for ${page.slug} (${block.blockType})`);
              block.description = null;
              hasChanges = true;
            }
            if (block.blockType === 'hero-v2' && typeof block.subtitle === 'string') {
              console.log(`Clearing plain text subtitle for ${page.slug} (hero-v2)`);
              block.subtitle = null;
              hasChanges = true;
            }
          }
          return block;
        });

        if (hasChanges) {
          // Update the page with cleared data
          await payload.update({
            collection: 'pages',
            id: page.id,
            data: {
              layout: updatedLayout,
            },
          });
          console.log(`✓ Updated page: ${page.slug}`);
        } else {
          console.log(`- No plain text data to clear in page: ${page.slug}`);
        }
      }
    }

    console.log('\n✓ Successfully cleared all plain text hero data');
    console.log('You can now enter fresh content using the rich text editor in the admin panel.');
  } catch (error) {
    console.error('Error clearing hero data:', error);
  } finally {
    process.exit(0);
  }
}

clearHeroData();