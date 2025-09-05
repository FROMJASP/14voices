import { getPayload } from 'payload';
import configPromise from '@payload-config';

/**
 * Script to restore page content from previous versions
 * This will find the most recent version that has hero/linkToBlog content
 * and restore it to the current document
 */

async function restorePageContent() {
  const payload = await getPayload({ config: configPromise });

  try {
    // Find the home and blog pages
    const pages = await payload.find({
      collection: 'pages',
      where: {
        or: [
          { slug: { equals: 'home' } },
          { slug: { equals: 'blog' } },
        ],
      },
    });

    for (const page of pages.docs) {
      console.log(`\nChecking page: ${page.slug}`);
      
      // Get all versions for this page
      const versions = await payload.findVersions({
        collection: 'pages',
        where: {
          parent: {
            equals: page.id,
          },
        },
        sort: '-createdAt', // Most recent first
        limit: 50, // Check last 50 versions
      });

      console.log(`Found ${versions.docs.length} versions`);

      // Find the most recent version with actual content
      let versionWithContent = null;
      for (const version of versions.docs) {
        const versionData = version.version;
        
        // Check if this version has actual content (not just empty objects)
        const hasHeroContent = versionData.hero && (
          versionData.hero.title || 
          versionData.hero.titleRichText || 
          versionData.hero.description ||
          versionData.hero.processSteps?.length > 0
        );
        
        const hasLinkToBlogContent = versionData.linkToBlog && (
          versionData.linkToBlog.title || 
          versionData.linkToBlog.description ||
          versionData.linkToBlog.links?.length > 0
        );

        if (hasHeroContent || hasLinkToBlogContent) {
          versionWithContent = versionData;
          console.log(`Found version with content from: ${version.createdAt}`);
          
          // Log what content was found
          if (hasHeroContent) {
            console.log('  - Has hero content');
            if (versionData.hero.title) console.log(`    Title: "${versionData.hero.title}"`);
            if (versionData.hero.processSteps?.length) console.log(`    Process steps: ${versionData.hero.processSteps.length}`);
          }
          if (hasLinkToBlogContent) {
            console.log('  - Has linkToBlog content');
            if (versionData.linkToBlog.title) console.log(`    Title: "${versionData.linkToBlog.title}"`);
            if (versionData.linkToBlog.links?.length) console.log(`    Links: ${versionData.linkToBlog.links.length}`);
          }
          break;
        }
      }

      if (versionWithContent) {
        // Check current page content
        const currentPage = await payload.findByID({
          collection: 'pages',
          id: page.id,
          depth: 2,
        });

        const currentHasContent = currentPage.hero?.title || currentPage.linkToBlog?.title;
        
        if (!currentHasContent) {
          console.log('\nCurrent page is missing content. Restoring from version...');
          
          // Restore the content
          const restoredData = {
            ...currentPage,
            hero: versionWithContent.hero || currentPage.hero,
            linkToBlog: versionWithContent.linkToBlog || currentPage.linkToBlog,
            voiceover: versionWithContent.voiceover || currentPage.voiceover,
          };

          // Update the page with restored content
          await payload.update({
            collection: 'pages',
            id: page.id,
            data: restoredData,
          });
          
          console.log('✅ Content restored successfully!');
        } else {
          console.log('✅ Current page already has content, no restoration needed.');
        }
      } else {
        console.log('⚠️ No previous version with content found.');
        console.log('You may need to manually re-enter the content or restore from a database backup.');
      }
    }

  } catch (error) {
    console.error('Error restoring content:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
restorePageContent();