import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function resetAndSeedPages() {
  console.log('🔄 Resetting and seeding pages...\n');

  const payload = await getPayload({ config: configPromise });

  try {
    // Delete existing pages
    console.log('🗑️  Deleting existing pages...');
    const existingPages = await payload.find({
      collection: 'pages',
      limit: 100,
    });

    for (const page of existingPages.docs) {
      await payload.delete({
        collection: 'pages',
        id: page.id,
      });
      console.log(`  ✓ Deleted: ${page.title}`);
    }

    console.log('\n📄 Creating new pages...');

    // Create Home page with proper blocks
    const homePage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        status: 'published',
        layout: [
          {
            blockType: 'hero-v1',
            processSteps: [
              { text: '1. Kies de stem' },
              { text: '2. Upload script' },
              { text: '3. Ontvang audio' },
            ],
            title: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    tag: 'h1',
                    children: [
                      { type: 'text', text: 'Professionele ' },
                      { type: 'text', text: 'voice-overs', format: ['bold'] },
                      { type: 'text', text: ' voor elk project' },
                    ],
                  },
                ],
              },
            },
            description: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Van commercials tot bedrijfsfilms, wij leveren de perfecte stem voor jouw project. Ontdek onze professionele stemacteurs en vraag direct een offerte aan.',
                      },
                    ],
                  },
                ],
              },
            },
            cta: {
              primaryLabel: 'Hoor het verschil',
              primaryUrl: '/voiceovers',
              primaryStyle: {
                backgroundColor: '#000000',
                textColor: '#FFFFFF',
                borderRadius: 'rounded',
                icon: 'arrow-right',
                iconPosition: 'right',
              },
              secondaryLabel: 'Bekijk prijzen',
              secondaryUrl: '#prijzen',
              secondaryStyle: {
                backgroundColor: 'transparent',
                textColor: '#000000',
                borderColor: '#E5E5E5',
                borderRadius: 'rounded',
                icon: 'play',
                iconPosition: 'left',
              },
            },
            stats: [
              { value: '14+', label: 'Stemacteurs', hoverEffect: true },
              { value: '100%', label: 'Kwaliteit', hoverEffect: true },
              { value: '24h', label: 'Levering', hoverEffect: true },
            ],
          },
          {
            blockType: 'voiceover-v1',
            title: 'Onze Stemacteurs',
            showcase: true,
          },
          {
            blockType: 'content-v1',
            title: 'Ontdek onze laatste projecten',
            description:
              "Van internationale commercials tot lokale bedrijfsvideo's, onze stemacteurs hebben aan diverse projecten meegewerkt. Laat je inspireren door onze portfolio en ontdek wat wij voor jouw project kunnen betekenen.",
            imageStyle: {
              grayscale: true,
              rounded: true,
            },
            button: {
              label: 'Bekijk blog',
              url: '/blog',
              style: 'secondary',
              showIcon: true,
            },
          },
        ],
        meta: {
          title: '14voices - Professionele Voice-overs',
          description:
            'Professionele voice-over services voor commercials, bedrijfsfilms, e-learning en meer. Ontdek onze stemacteurs en krijg direct een offerte.',
        },
      } as any,
    });
    console.log(`✅ Created: ${homePage.title} (${homePage.slug})`);

    // Create Blog page
    const blogPage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Blog',
        slug: 'blog',
        status: 'published',
        layout: [
          {
            blockType: 'hero-v2',
            badge: {
              enabled: true,
              text: '📝 Tips, nieuws & inzichten',
            },
            title: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    tag: 'h1',
                    children: [
                      { type: 'text', text: 'Het laatste uit de ' },
                      { type: 'text', text: 'voice-over wereld', format: ['bold'] },
                    ],
                  },
                ],
              },
            },
            subtitle: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: 'Blog & Nieuws' }],
                  },
                ],
              },
            },
            description: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Ontdek tips voor het schrijven van scripts, trends in de voice-over industrie, en verhalen achter onze projecten.',
                      },
                    ],
                  },
                ],
              },
            },
            cta: {
              primaryLabel: 'Nieuwste artikelen',
              primaryUrl: '#artikelen',
            },
            paddingTop: 'medium',
            paddingBottom: 'medium',
          },
          {
            blockType: 'blog-section-1',
            title: 'Laatste Nieuws & Updates',
            description: 'Ontdek tips, nieuws en inzichten uit de wereld van voice-overs',
            postsLimit: 8,
            showCategories: true,
            paddingTop: 'medium',
            paddingBottom: 'large',
          },
        ],
        meta: {
          title: 'Blog - 14voices',
          description:
            'Lees het laatste nieuws, tips en inzichten over voice-overs, script schrijven, en audio productie.',
        },
      } as any,
    });
    console.log(`✅ Created: ${blogPage.title} (${blogPage.slug})`);

    console.log('\n✨ Pages reset and seeded successfully!');
    console.log('\n🌐 You can now visit:');
    console.log('   - Homepage: http://localhost:3000');
    console.log('   - Blog: http://localhost:3000/blog');
    console.log('   - Admin: http://localhost:3000/admin');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

resetAndSeedPages();
