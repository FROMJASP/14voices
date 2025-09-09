import { getPayload } from 'payload';
import configPromise from '../payload.config';

async function fixPageBlocks() {
  try {
    const payload = await getPayload({ config: configPromise });

    // Get all pages
    const pages = await payload.find({
      collection: 'pages',
      limit: 100,
    });

    console.log('\n=== Checking all pages for block issues ===\n');

    for (const page of pages.docs) {
      console.log(`\nPage: ${page.slug}`);
      console.log('-------------------');

      const pageData = page as any;

      // Show current state
      console.log('Has layout field:', Array.isArray(pageData.layout));
      console.log('Layout blocks count:', pageData.layout?.length || 0);
      console.log('Has pageBlocks field:', Array.isArray(pageData.pageBlocks));
      console.log('PageBlocks count:', pageData.pageBlocks?.length || 0);

      if (pageData.layout?.length > 0) {
        console.log('Layout blocks:', pageData.layout.map((b: any) => b.blockType).join(', '));
      }

      if (pageData.pageBlocks?.length > 0) {
        console.log(
          'Old pageBlocks:',
          pageData.pageBlocks
            .map((b: any) => `${b.blockType}(${b.enabled ? 'enabled' : 'disabled'})`)
            .join(', ')
        );
      }

      // Fix pages that have old pageBlocks but no layout
      if (!Array.isArray(pageData.layout) && pageData.pageBlocks) {
        console.log('\n⚠️  Page has old pageBlocks but no layout field!');

        const shouldFix = page.slug === 'blog' || page.slug === 'home';
        if (shouldFix) {
          console.log('🔧 Fixing by adding empty layout array...');

          await payload.update({
            collection: 'pages',
            id: page.id,
            data: {
              layout: [], // Add empty layout to trigger new blocks system
            } as any,
          });

          console.log('✅ Fixed!');
        }
      }
    }

    console.log('\n=== Done ===\n');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

fixPageBlocks();
