import { getPayload } from 'payload';
import configPromise from '@payload-config';

/**
 * Script to specifically restore hero content from previous versions
 * Focuses on finding and restoring processSteps, title, description, etc.
 */

async function restoreHeroContent() {
  const payload = await getPayload({ config: configPromise });

  try {
    // Find the home page
    const homePage = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'home' },
      },
    });

    if (homePage.docs.length === 0) {
      console.log('Home page not found');
      return;
    }

    const page = homePage.docs[0];
    console.log(`\nChecking home page for hero content restoration`);
    console.log(`Current page ID: ${page.id}`);
    
    // Get current page with full depth
    const currentPage = await payload.findByID({
      collection: 'pages',
      id: page.id,
      depth: 3,
    });
    
    // Check current hero content
    console.log('\nCurrent hero content status:');
    console.log(`- Has hero object: ${!!currentPage.hero}`);
    if (currentPage.hero) {
      console.log(`- Hero variant: ${currentPage.hero.layout || 'not set'}`);
      console.log(`- Has title: ${!!currentPage.hero.title}`);
      console.log(`- Has titleRichText: ${!!currentPage.hero.titleRichText}`);
      console.log(`- Has description: ${!!currentPage.hero.description}`);
      console.log(`- Has descriptionRichText: ${!!currentPage.hero.descriptionRichText}`);
      console.log(`- Has processSteps: ${!!currentPage.hero.processSteps}`);
      if (currentPage.hero.processSteps) {
        console.log(`  - Number of steps: ${currentPage.hero.processSteps.length}`);
      }
      console.log(`- Has stats: ${!!currentPage.hero.stats}`);
      if (currentPage.hero.stats) {
        console.log(`  - Number of stats: ${currentPage.hero.stats.length}`);
      }
    }
    
    // Get all versions for this page
    const versions = await payload.findVersions({
      collection: 'pages',
      where: {
        parent: {
          equals: page.id,
        },
      },
      sort: '-createdAt', // Most recent first
      limit: 100, // Check last 100 versions to be sure
    });

    console.log(`\nFound ${versions.docs.length} versions to check`);

    // Find the most recent version with hero content
    let bestVersion = null;
    let bestVersionDate = null;
    
    for (const version of versions.docs) {
      const versionData = version.version;
      
      // Check if this version has hero content
      if (versionData.hero) {
        const hasProcessSteps = versionData.hero.processSteps && versionData.hero.processSteps.length > 0;
        const hasTitle = versionData.hero.title || versionData.hero.titleRichText;
        const hasDescription = versionData.hero.description || versionData.hero.descriptionRichText;
        const hasStats = versionData.hero.stats && versionData.hero.stats.length > 0;
        
        if (hasProcessSteps || hasTitle || hasDescription || hasStats) {
          console.log(`\nFound version from ${version.createdAt} with:`);
          if (hasProcessSteps) console.log(`  ✓ Process steps: ${versionData.hero.processSteps.length}`);
          if (hasTitle) console.log(`  ✓ Title: "${versionData.hero.title || 'Rich text title'}"`);
          if (hasDescription) console.log(`  ✓ Description: "${versionData.hero.description?.substring(0, 50) || 'Rich text description'}..."`);
          if (hasStats) console.log(`  ✓ Stats: ${versionData.hero.stats.length}`);
          
          // If we haven't found a version yet, or this one has more content, use it
          if (!bestVersion || 
              (hasProcessSteps && !bestVersion.hero.processSteps) ||
              (hasStats && !bestVersion.hero.stats)) {
            bestVersion = versionData;
            bestVersionDate = version.createdAt;
            console.log('  → Selected as best version');
          }
        }
      }
    }

    if (bestVersion && bestVersion.hero) {
      console.log(`\n✅ Best version found from ${bestVersionDate}`);
      console.log('\nRestoring hero content...');
      
      // Prepare the update data - merge with current data
      const updateData = {
        ...currentPage,
        hero: {
          ...currentPage.hero, // Keep existing structure
          ...bestVersion.hero, // Override with restored content
          layout: currentPage.hero?.layout || bestVersion.hero.layout || 'variant1', // Preserve current variant selection
        },
      };
      
      // Log what we're restoring
      console.log('\nRestoring the following hero fields:');
      if (bestVersion.hero.processSteps) console.log(`  - processSteps: ${bestVersion.hero.processSteps.length} items`);
      if (bestVersion.hero.title) console.log(`  - title: "${bestVersion.hero.title}"`);
      if (bestVersion.hero.titleRichText) console.log(`  - titleRichText: [Rich text content]`);
      if (bestVersion.hero.description) console.log(`  - description: "${bestVersion.hero.description.substring(0, 50)}..."`);
      if (bestVersion.hero.descriptionRichText) console.log(`  - descriptionRichText: [Rich text content]`);
      if (bestVersion.hero.stats) console.log(`  - stats: ${bestVersion.hero.stats.length} items`);
      if (bestVersion.hero.image) console.log(`  - image: [Media reference]`);
      
      // Update the page with restored content
      await payload.update({
        collection: 'pages',
        id: page.id,
        data: updateData,
      });
      
      console.log('\n✅ Hero content restored successfully!');
      console.log('Please refresh the admin panel to see the restored content.');
    } else {
      console.log('\n⚠️ No previous version with hero content found.');
      console.log('The content may have been permanently deleted or never existed in the database.');
      console.log('\nYou will need to re-enter the hero content manually.');
    }

  } catch (error) {
    console.error('Error restoring hero content:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
restoreHeroContent();