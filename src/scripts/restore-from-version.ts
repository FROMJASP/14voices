import { getPayload } from 'payload';
import configPromise from '@payload-config';

/**
 * Script to restore content from a specific version
 * You can see version IDs in the admin panel's Versions tab
 */

async function restoreFromVersion() {
  const payload = await getPayload({ config: configPromise });

  try {
    // First, let's list all versions with their content summary
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
    console.log(`\nListing all versions for home page (ID: ${page.id})`);
    console.log('Check these against what you see in the admin panel:\n');
    
    // Get ALL versions including their full data
    const versions = await payload.findVersions({
      collection: 'pages',
      where: {
        parent: {
          equals: page.id,
        },
      },
      sort: '-updatedAt', // Sort by updated date like in admin
      limit: 100,
      depth: 3, // Get full depth to see all nested data
    });

    console.log(`Found ${versions.docs.length} versions\n`);
    console.log('Version details:');
    console.log('================\n');

    // List each version with details
    versions.docs.forEach((version, index) => {
      console.log(`Version ${index + 1}:`);
      console.log(`  ID: ${version.id}`);
      console.log(`  Updated: ${version.updatedAt}`);
      console.log(`  Created: ${version.createdAt}`);
      console.log(`  Status: ${version.version?._status || 'unknown'}`);
      console.log(`  Autosave: ${version.autosave ? 'Yes' : 'No'}`);
      
      // Check for hero content
      const heroData = version.version?.hero;
      if (heroData) {
        console.log(`  Hero content:`);
        console.log(`    - Variant: ${heroData.layout || 'not set'}`);
        
        // Check for process steps
        if (heroData.processSteps && Array.isArray(heroData.processSteps)) {
          console.log(`    - Process steps: ${heroData.processSteps.length} items`);
          if (heroData.processSteps.length > 0) {
            heroData.processSteps.slice(0, 3).forEach((step: any, i: number) => {
              console.log(`      ${i + 1}. ${step.text || step.title || 'No text'}`);
            });
          }
        }
        
        // Check for title
        if (heroData.title) {
          console.log(`    - Title: "${heroData.title.substring(0, 50)}..."`);
        }
        if (heroData.titleRichText) {
          console.log(`    - Title (rich text): Yes`);
        }
        
        // Check for description  
        if (heroData.description) {
          console.log(`    - Description: "${heroData.description.substring(0, 50)}..."`);
        }
        if (heroData.descriptionRichText) {
          console.log(`    - Description (rich text): Yes`);
        }
        
        // Check for stats
        if (heroData.stats && Array.isArray(heroData.stats)) {
          console.log(`    - Stats: ${heroData.stats.length} items`);
          if (heroData.stats.length > 0) {
            heroData.stats.slice(0, 2).forEach((stat: any, i: number) => {
              console.log(`      ${i + 1}. ${stat.value || '?'} - ${stat.label || 'No label'}`);
            });
          }
        }
        
        // Check for other fields
        if (heroData.image) {
          console.log(`    - Has image: Yes`);
        }
        if (heroData.cta) {
          console.log(`    - Has CTA: Yes`);
        }
      } else {
        console.log(`  Hero content: None`);
      }
      
      // Check for linkToBlog content
      const linkToBlogData = version.version?.linkToBlog;
      if (linkToBlogData && (linkToBlogData.title || linkToBlogData.links?.length > 0)) {
        console.log(`  LinkToBlog content:`);
        if (linkToBlogData.title) {
          console.log(`    - Title: "${linkToBlogData.title}"`);
        }
        if (linkToBlogData.links?.length > 0) {
          console.log(`    - Links: ${linkToBlogData.links.length} items`);
        }
      }
      
      console.log('');
    });

    // Now provide restoration instructions
    console.log('\n=========================================');
    console.log('TO RESTORE A SPECIFIC VERSION:');
    console.log('=========================================\n');
    console.log('If you see a version above with the content you want to restore,');
    console.log('note its ID and run this command:\n');
    console.log('bun run src/scripts/restore-specific-version.ts <VERSION_ID>\n');
    console.log('For example: bun run src/scripts/restore-specific-version.ts 123\n');
    console.log('You can also restore directly from the admin panel by clicking');
    console.log('"Restore this version" on any version in the Versions tab.');

  } catch (error) {
    console.error('Error listing versions:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
restoreFromVersion();