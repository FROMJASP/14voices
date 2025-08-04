import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function checkVoiceovers() {
  console.log('🔍 Checking voiceover data...\n');

  try {
    const payload = await getPayload({ config: configPromise });

    // Check total voiceovers
    const allVoiceovers = await payload.find({
      collection: 'voiceovers',
      limit: 100,
      depth: 2,
    });

    console.log(`📊 Total voiceovers in database: ${allVoiceovers.totalDocs}`);
    console.log(`📄 Total pages: ${allVoiceovers.totalPages}`);

    // Check by status
    const statuses = ['active', 'draft', 'more-voices', 'archived'];
    
    for (const status of statuses) {
      const result = await payload.find({
        collection: 'voiceovers',
        where: {
          status: {
            equals: status,
          },
        },
        limit: 100,
      });
      console.log(`\n✅ ${status}: ${result.totalDocs} voiceovers`);
      
      if (result.docs.length > 0 && status === 'active') {
        console.log('\n🎤 Active voiceovers:');
        result.docs.forEach((voiceover: any) => {
          const hasProfilePhoto = voiceover.profilePhoto ? '✓' : '✗';
          const hasDemos = voiceover.fullDemoReel || voiceover.commercialsDemo || voiceover.narrativeDemo ? '✓' : '✗';
          const isAvailable = voiceover.availability?.isAvailable ? '✓' : '✗';
          
          console.log(`  - ${voiceover.name} (${voiceover.slug})`);
          console.log(`    Profile Photo: ${hasProfilePhoto} | Demos: ${hasDemos} | Available: ${isAvailable}`);
          console.log(`    Tags: ${voiceover.styleTags?.map((t: any) => t.tag).join(', ') || 'None'}`);
        });
      }
    }

    // Check for media uploads
    const mediaWithAudio = await payload.find({
      collection: 'media',
      where: {
        mimeType: {
          contains: 'audio',
        },
      },
      limit: 10,
    });

    console.log(`\n🎵 Audio files in media library: ${mediaWithAudio.totalDocs}`);

    // Check for profile photos
    const mediaWithImages = await payload.find({
      collection: 'media',
      where: {
        mimeType: {
          contains: 'image',
        },
      },
      limit: 10,
    });

    console.log(`📸 Image files in media library: ${mediaWithImages.totalDocs}`);

    // Summary and recommendations
    console.log('\n📋 SUMMARY:');
    if (allVoiceovers.totalDocs === 0) {
      console.log('❌ No voiceovers found in the database!');
      console.log('\n💡 RECOMMENDATIONS:');
      console.log('1. Run "bun run seed" to populate with sample data');
      console.log('2. Or manually add voiceovers through the admin panel at /admin');
      console.log('3. Make sure to upload profile photos and demo audio files');
    } else if (allVoiceovers.docs.filter((v: any) => v.status === 'active').length === 0) {
      console.log('⚠️  Voiceovers exist but none are active!');
      console.log('\n💡 RECOMMENDATIONS:');
      console.log('1. Set some voiceovers to "active" status in the admin panel');
      console.log('2. Active voiceovers will appear on the homepage');
    } else {
      console.log('✅ Voiceovers are properly configured');
      
      // Check for missing data
      const activeVoiceovers = allVoiceovers.docs.filter((v: any) => v.status === 'active');
      const missingPhotos = activeVoiceovers.filter((v: any) => !v.profilePhoto);
      const missingDemos = activeVoiceovers.filter((v: any) => !v.fullDemoReel && !v.commercialsDemo && !v.narrativeDemo);
      
      if (missingPhotos.length > 0) {
        console.log(`\n⚠️  ${missingPhotos.length} active voiceovers are missing profile photos`);
      }
      if (missingDemos.length > 0) {
        console.log(`⚠️  ${missingDemos.length} active voiceovers are missing demo audio files`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking voiceovers:', error);
    process.exit(1);
  }
}

checkVoiceovers();