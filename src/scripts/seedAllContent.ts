/**
 * Comprehensive seeding script for all content
 */

import { getPayload } from 'payload';
import config from '@/payload.config';

const seedAll = async () => {
  console.log('\n🌱 Seeding All Content\n');

  const payload = await getPayload({
    config,
  });

  try {
    // 1. Get the admin user
    console.log('👤 Getting admin user...');
    const adminUser = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'jasper@stemacteren.nl',
        },
      },
      limit: 1,
    });

    if (adminUser.docs.length === 0) {
      throw new Error('Admin user not found');
    }

    const admin = adminUser.docs[0];
    console.log(`✅ Found admin: ${admin.name}`);

    // 2. Create Categories
    console.log('\n📁 Creating categories...');
    const categories = [];

    const categoryData = [
      { name: 'Voice Acting', slug: 'voice-acting' },
      { name: 'Commercial', slug: 'commercial' },
      { name: 'Documentary', slug: 'documentary' },
      { name: 'E-Learning', slug: 'e-learning' },
    ];

    for (const cat of categoryData) {
      try {
        const existing = await payload.find({
          collection: 'categories',
          where: {
            slug: {
              equals: cat.slug,
            },
          },
          limit: 1,
        });

        if (existing.docs.length === 0) {
          const category = await payload.create({
            collection: 'categories',
            data: cat,
          });
          categories.push(category);
          console.log(`✅ Created category: ${cat.name}`);
        } else {
          categories.push(existing.docs[0]);
          console.log(`✓ Category exists: ${cat.name}`);
        }
      } catch (error) {
        console.log(`⚠️  Error creating category ${cat.name}`);
      }
    }

    // 3. Create Voice Groups
    console.log('\n🎭 Creating voice groups...');
    const groups = [];

    const groupData = [
      { name: { en: 'Male Voices', nl: 'Mannelijke Stemmen' }, slug: 'male-voices' },
      { name: { en: 'Female Voices', nl: 'Vrouwelijke Stemmen' }, slug: 'female-voices' },
      { name: { en: 'Young Voices', nl: 'Jonge Stemmen' }, slug: 'young-voices' },
    ];

    for (const grp of groupData) {
      try {
        const existing = await payload.find({
          collection: 'groups',
          where: {
            slug: {
              equals: grp.slug,
            },
          },
          limit: 1,
        });

        if (existing.docs.length === 0) {
          const group = await payload.create({
            collection: 'groups',
            data: grp,
          });
          groups.push(group);
          console.log(`✅ Created group: ${grp.name.en}`);
        } else {
          groups.push(existing.docs[0]);
          console.log(`✓ Group exists: ${grp.name.en}`);
        }
      } catch (error) {
        console.log(`⚠️  Error creating group ${grp.name.en}`);
      }
    }

    // 4. Create Sample Voiceovers
    console.log('\n🎙️ Creating sample voiceovers...');

    const voiceoverData = [
      {
        name: 'John',
        lastName: 'Doe',
        slug: 'john-doe',
        group: groups[0]?.id, // Male voices
        description: {
          en: 'Professional male voice with warm, trustworthy tone',
          nl: 'Professionele mannelijke stem met warme, betrouwbare toon',
        },
        languages: ['en', 'nl'],
        status: 'published',
      },
      {
        name: 'Emma',
        lastName: 'Smith',
        slug: 'emma-smith',
        group: groups[1]?.id, // Female voices
        description: {
          en: 'Versatile female voice perfect for commercials',
          nl: 'Veelzijdige vrouwelijke stem perfect voor commercials',
        },
        languages: ['en', 'nl', 'de'],
        status: 'published',
      },
      {
        name: 'Lisa',
        lastName: 'Johnson',
        slug: 'lisa-johnson',
        group: groups[2]?.id, // Young voices
        description: {
          en: 'Young, energetic voice for modern brands',
          nl: 'Jonge, energieke stem voor moderne merken',
        },
        languages: ['nl'],
        status: 'published',
      },
    ];

    const voiceovers = [];
    for (const vo of voiceoverData) {
      try {
        const existing = await payload.find({
          collection: 'voiceovers',
          where: {
            slug: {
              equals: vo.slug,
            },
          },
          limit: 1,
        });

        if (existing.docs.length === 0) {
          const voiceover = await payload.create({
            collection: 'voiceovers',
            data: vo,
          });
          voiceovers.push(voiceover);
          console.log(`✅ Created voiceover: ${vo.name} ${vo.lastName}`);
        } else {
          voiceovers.push(existing.docs[0]);
          console.log(`✓ Voiceover exists: ${vo.name} ${vo.lastName}`);
        }
      } catch (error) {
        console.log(`⚠️  Error creating voiceover ${vo.name}: ${error}`);
      }
    }

    // 5. Create Sample Blog Posts
    console.log('\n📝 Creating sample blog posts...');

    const blogData = [
      {
        title: 'The Art of Voice Acting',
        slug: 'the-art-of-voice-acting',
        content: {
          root: {
            children: [
              {
                type: 'paragraph',
                children: [
                  { text: 'Voice acting is more than just reading words from a script...' },
                ],
              },
            ],
          },
        },
        excerpt: 'Discover the techniques and skills needed for professional voice acting',
        category: categories[0]?.id,
        author: admin.id,
        status: 'published',
        publishedAt: new Date().toISOString(),
      },
      {
        title: 'Tips for Recording Commercials',
        slug: 'tips-for-recording-commercials',
        content: {
          root: {
            children: [
              {
                type: 'paragraph',
                children: [{ text: 'Recording commercials requires specific techniques...' }],
              },
            ],
          },
        },
        excerpt: 'Learn how to deliver impactful commercial voiceovers',
        category: categories[1]?.id,
        author: admin.id,
        status: 'published',
        publishedAt: new Date().toISOString(),
      },
    ];

    for (const post of blogData) {
      try {
        const existing = await payload.find({
          collection: 'blog-posts',
          where: {
            slug: {
              equals: post.slug,
            },
          },
          limit: 1,
        });

        if (existing.docs.length === 0) {
          await payload.create({
            collection: 'blog-posts',
            data: post,
          });
          console.log(`✅ Created blog post: ${post.title}`);
        } else {
          console.log(`✓ Blog post exists: ${post.title}`);
        }
      } catch (error) {
        console.log(`⚠️  Error creating blog post ${post.title}: ${error}`);
      }
    }

    // 6. Create Productions
    console.log('\n🎬 Creating productions...');

    const productionData = [
      {
        title: { en: 'TV Commercial', nl: 'TV Commercial' },
        slug: 'tv-commercial',
        description: {
          en: 'Professional TV commercial voiceover',
          nl: 'Professionele TV commercial voice-over',
        },
        basePrice: 500,
        status: 'active',
      },
      {
        title: { en: 'Radio Spot', nl: 'Radio Spot' },
        slug: 'radio-spot',
        description: {
          en: 'Radio advertisement voiceover',
          nl: 'Radio advertentie voice-over',
        },
        basePrice: 300,
        status: 'active',
      },
      {
        title: { en: 'E-Learning Module', nl: 'E-Learning Module' },
        slug: 'e-learning-module',
        description: {
          en: 'Educational content narration',
          nl: 'Educatieve content vertelling',
        },
        basePrice: 400,
        status: 'active',
      },
    ];

    for (const prod of productionData) {
      try {
        const existing = await payload.find({
          collection: 'productions',
          where: {
            slug: {
              equals: prod.slug,
            },
          },
          limit: 1,
        });

        if (existing.docs.length === 0) {
          await payload.create({
            collection: 'productions',
            data: prod,
          });
          console.log(`✅ Created production: ${prod.title.en}`);
        } else {
          console.log(`✓ Production exists: ${prod.title.en}`);
        }
      } catch (error) {
        console.log(`⚠️  Error creating production ${prod.title.en}: ${error}`);
      }
    }

    console.log('\n🎉 Seeding complete!');
    console.log('\nYour site now has:');
    console.log('- Homepage with blocks');
    console.log('- Blog page');
    console.log('- Sample voiceovers');
    console.log('- Blog posts');
    console.log('- Categories');
    console.log('- Productions');
    console.log('\nVisit http://localhost:3000 to see your site!');
  } catch (error) {
    console.error('\n❌ Seeding error:', error);
  }
};

// Run the seeder
seedAll().catch(console.error);
