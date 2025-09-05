import { getPayload } from 'payload';
import configPromise from '@payload-config';

/**
 * Script to check ALL versions and drafts for hero content
 */

async function checkAllVersions() {
  const payload = await getPayload({ config: configPromise });

  try {
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
    console.log(`Checking ALL versions for home page (ID: ${page.id})`);
    
    // Get ALL versions (no limit)
    const versions = await payload.findVersions({
      collection: 'pages',
      where: {
        parent: {
          equals: page.id,
        },
      },
      sort: '-createdAt',
      limit: 1000, // Get up to 1000 versions
    });

    console.log(`\nTotal versions found: ${versions.docs.length}`);
    
    // Also check for draft versions
    const drafts = await payload.findVersions({
      collection: 'pages',
      where: {
        parent: {
          equals: page.id,
        },
        'version._status': {
          equals: 'draft',
        },
      },
      sort: '-createdAt',
      limit: 1000,
    });
    
    console.log(`Draft versions found: ${drafts.docs.length}`);

    let versionsWithHeroContent = 0;
    let oldestWithContent = null;
    let newestWithContent = null;

    // Check each version for hero content
    for (const version of versions.docs) {
      const versionData = version.version;
      
      if (versionData.hero) {
        const hasProcessSteps = versionData.hero.processSteps && versionData.hero.processSteps.length > 0;
        const hasTitle = versionData.hero.title || versionData.hero.titleRichText;
        const hasDescription = versionData.hero.description || versionData.hero.descriptionRichText;
        const hasStats = versionData.hero.stats && versionData.hero.stats.length > 0;
        
        if (hasProcessSteps || hasTitle || hasDescription || hasStats) {
          versionsWithHeroContent++;
          
          if (!newestWithContent) {
            newestWithContent = {
              date: version.createdAt,
              hasProcessSteps,
              processStepsCount: versionData.hero.processSteps?.length || 0,
              hasTitle,
              title: versionData.hero.title,
              hasDescription,
              hasStats,
              statsCount: versionData.hero.stats?.length || 0,
              versionId: version.id,
            };
          }
          
          oldestWithContent = {
            date: version.createdAt,
            hasProcessSteps,
            processStepsCount: versionData.hero.processSteps?.length || 0,
            hasTitle,
            title: versionData.hero.title,
            hasDescription,
            hasStats,
            statsCount: versionData.hero.stats?.length || 0,
            versionId: version.id,
          };
        }
      }
    }

    console.log(`\nVersions with hero content: ${versionsWithHeroContent}`);
    
    if (newestWithContent) {
      console.log('\nNewest version with content:');
      console.log(`  Date: ${newestWithContent.date}`);
      console.log(`  Version ID: ${newestWithContent.versionId}`);
      if (newestWithContent.hasProcessSteps) console.log(`  - Process steps: ${newestWithContent.processStepsCount}`);
      if (newestWithContent.hasTitle) console.log(`  - Title: "${newestWithContent.title || 'Rich text'}"`);
      if (newestWithContent.hasDescription) console.log(`  - Has description`);
      if (newestWithContent.hasStats) console.log(`  - Stats: ${newestWithContent.statsCount}`);
    }
    
    if (oldestWithContent && oldestWithContent.versionId !== newestWithContent?.versionId) {
      console.log('\nOldest version with content:');
      console.log(`  Date: ${oldestWithContent.date}`);
      console.log(`  Version ID: ${oldestWithContent.versionId}`);
      if (oldestWithContent.hasProcessSteps) console.log(`  - Process steps: ${oldestWithContent.processStepsCount}`);
      if (oldestWithContent.hasTitle) console.log(`  - Title: "${oldestWithContent.title || 'Rich text'}"`);
      if (oldestWithContent.hasDescription) console.log(`  - Has description`);
      if (oldestWithContent.hasStats) console.log(`  - Stats: ${oldestWithContent.statsCount}`);
    }

    if (!newestWithContent) {
      console.log('\n❌ No versions found with hero content.');
      console.log('This suggests the content was never saved to the database.');
      
      // Check if there are any autosave versions
      const autosaves = versions.docs.filter(v => v.autosave === true);
      console.log(`\nAutosave versions: ${autosaves.length}`);
      
      // Check the published version
      const published = versions.docs.filter(v => v.version._status === 'published');
      console.log(`Published versions: ${published.length}`);
    }

  } catch (error) {
    console.error('Error checking versions:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
checkAllVersions();