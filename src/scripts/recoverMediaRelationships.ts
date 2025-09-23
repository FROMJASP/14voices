import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';

interface RecoveryStats {
  voiceovers: number;
  blogPosts: number;
  users: number;
  testimonials: number;
  productions: number;
  pages: number;
}

export async function recoverMediaRelationships() {
  const payload = await getPayloadHMR({ config: configPromise });

  console.log('🔗 Starting media relationship recovery...\n');

  const stats: RecoveryStats = {
    voiceovers: 0,
    blogPosts: 0,
    users: 0,
    testimonials: 0,
    productions: 0,
    pages: 0,
  };

  try {
    // Get all media records
    const allMedia = await payload.find({
      collection: 'media',
      limit: 1000,
    });

    console.log(`📚 Found ${allMedia.docs.length} media files\n`);

    // Create a map of filenames to media IDs for quick lookup
    const mediaMap = new Map<string, string>();
    allMedia.docs.forEach((media) => {
      mediaMap.set(media.filename, media.id);
      // Also map without extension for flexibility
      const nameWithoutExt = media.filename.replace(/\.[^/.]+$/, '');
      mediaMap.set(nameWithoutExt, media.id);
    });

    // Helper function to find media ID by various patterns
    const findMediaId = (hint: string): string | null => {
      if (!hint) return null;

      // Direct filename match
      if (mediaMap.has(hint)) return mediaMap.get(hint)!;

      // Try without extension
      const withoutExt = hint.replace(/\.[^/.]+$/, '');
      if (mediaMap.has(withoutExt)) return mediaMap.get(withoutExt)!;

      // Try to find by partial match
      for (const [filename, id] of mediaMap.entries()) {
        if (filename.includes(hint) || hint.includes(filename)) {
          return id;
        }
      }

      return null;
    };

    // 1. Recover Voiceover relationships
    console.log('🎙️  Recovering voiceover relationships...');
    const voiceovers = await payload.find({
      collection: 'voiceovers',
      limit: 1000,
    });

    for (const voiceover of voiceovers.docs) {
      const updates: any = {};
      let hasUpdates = false;

      // Check audio file
      if (!voiceover.audio && voiceover.title) {
        const audioHint = voiceover.title.toLowerCase().replace(/\s+/g, '-');
        const audioId = findMediaId(audioHint);
        if (audioId) {
          updates.audio = audioId;
          hasUpdates = true;
          console.log(`  ✓ Found audio for "${voiceover.title}"`);
        }
      }

      // Check coverImage
      if (!voiceover.coverImage && voiceover.title) {
        const imageHint = `${voiceover.title.toLowerCase().replace(/\s+/g, '-')}-cover`;
        const imageId = findMediaId(imageHint);
        if (imageId) {
          updates.coverImage = imageId;
          hasUpdates = true;
          console.log(`  ✓ Found cover image for "${voiceover.title}"`);
        }
      }

      if (hasUpdates) {
        await payload.update({
          collection: 'voiceovers',
          id: voiceover.id,
          data: updates,
        });
        stats.voiceovers++;
      }
    }

    // 2. Recover User avatars
    console.log('\n👤 Recovering user avatars...');
    const users = await payload.find({
      collection: 'users',
      limit: 1000,
    });

    for (const user of users.docs) {
      if (!user.avatar && user.email) {
        const username = user.email.split('@')[0];
        const avatarId = findMediaId(`${username}-avatar`) || findMediaId(username);

        if (avatarId) {
          await payload.update({
            collection: 'users',
            id: user.id,
            data: { avatar: avatarId },
          });
          stats.users++;
          console.log(`  ✓ Found avatar for ${user.email}`);
        }
      }
    }

    // 3. Recover Blog Post images
    console.log('\n📝 Recovering blog post images...');
    const blogPosts = await payload.find({
      collection: 'blog-posts',
      limit: 1000,
    });

    for (const post of blogPosts.docs) {
      if (!post.hero?.image && post.title) {
        const imageHint = post.title.toLowerCase().replace(/\s+/g, '-');
        const imageId = findMediaId(`${imageHint}-hero`) || findMediaId(imageHint);

        if (imageId) {
          await payload.update({
            collection: 'blog-posts',
            id: post.id,
            data: {
              hero: {
                ...post.hero,
                image: imageId,
              },
            },
          });
          stats.blogPosts++;
          console.log(`  ✓ Found hero image for "${post.title}"`);
        }
      }
    }

    // 4. Recover Production images
    console.log('\n🎬 Recovering production images...');
    const productions = await payload.find({
      collection: 'productions',
      limit: 1000,
    });

    for (const production of productions.docs) {
      if (!production.image && production.title) {
        const imageHint = production.title.toLowerCase().replace(/\s+/g, '-');
        const imageId = findMediaId(imageHint);

        if (imageId) {
          await payload.update({
            collection: 'productions',
            id: production.id,
            data: { image: imageId },
          });
          stats.productions++;
          console.log(`  ✓ Found image for "${production.title}"`);
        }
      }
    }

    // 5. Log unmatched media files for manual review
    console.log('\n📋 Media files that could not be automatically matched:');
    const matchedIds = new Set<string>();

    // Collect all matched IDs
    const collections = [
      { name: 'voiceovers', fields: ['audio', 'coverImage', 'thumbnail', 'waveform'] },
      { name: 'users', fields: ['avatar'] },
      { name: 'blog-posts', fields: ['hero.image'] },
      { name: 'productions', fields: ['image'] },
      { name: 'testimonials', fields: ['image', 'reviewer.image'] },
    ];

    for (const collection of collections) {
      const docs = await payload.find({
        collection: collection.name,
        limit: 1000,
      });

      docs.docs.forEach((doc: any) => {
        collection.fields.forEach((field) => {
          const value = field.includes('.')
            ? field.split('.').reduce((obj, key) => obj?.[key], doc)
            : doc[field];

          if (value && typeof value === 'string') {
            matchedIds.add(value);
          } else if (value && typeof value === 'object' && value.id) {
            matchedIds.add(value.id);
          }
        });
      });
    }

    const unmatchedMedia = allMedia.docs.filter((media) => !matchedIds.has(media.id));

    if (unmatchedMedia.length > 0) {
      console.log('\nUnmatched files:');
      unmatchedMedia.forEach((media) => {
        console.log(`  - ${media.filename} (${media.mimeType})`);
      });
      console.log(`\nTotal unmatched: ${unmatchedMedia.length}`);
      console.log('These files are safely stored but not linked to any content yet.');
    }

    // Summary
    console.log('\n📊 Recovery Summary:');
    console.log(`  Voiceovers updated: ${stats.voiceovers}`);
    console.log(`  Blog posts updated: ${stats.blogPosts}`);
    console.log(`  User avatars updated: ${stats.users}`);
    console.log(`  Productions updated: ${stats.productions}`);
    console.log(`  Pages updated: ${stats.pages}`);
    console.log(`  Testimonials updated: ${stats.testimonials}`);
  } catch (error) {
    console.error('❌ Error during relationship recovery:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  recoverMediaRelationships()
    .then(() => {
      console.log('\n✅ Media relationship recovery completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Media relationship recovery failed:', error);
      process.exit(1);
    });
}
