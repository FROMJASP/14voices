import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function seedBlogPosts() {
  console.log('📝 Seeding blog posts...\n');

  const payload = await getPayload({ config: configPromise });

  try {
    // Check if posts already exist
    const existingPosts = await payload.find({
      collection: 'blog-posts',
      limit: 1,
    });

    if (existingPosts.docs.length > 0) {
      console.log('ℹ️  Blog posts already exist, skipping seed');
      process.exit(0);
    }

    // Create sample blog posts
    const posts = [
      {
        title: '5 Tips voor het schrijven van effectieve voice-over scripts',
        slug: '5-tips-voice-over-scripts',
        excerpt:
          'Een goed script is de basis van elke succesvolle voice-over. Ontdek onze professionele tips voor het schrijven van scripts die echt werken.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Een professionele voice-over begint met een sterk script. Of je nu werkt aan een commercial, e-learning module of bedrijfsvideo, deze tips helpen je om teksten te schrijven die perfect klinken wanneer ze worden ingesproken.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [{ type: 'text', text: '1. Schrijf zoals je spreekt' }],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Voice-over scripts zijn bedoeld om hardop te worden gelezen. Gebruik natuurlijke, conversationele taal en vermijd complexe zinnen die moeilijk uit te spreken zijn.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [{ type: 'text', text: '2. Houd het kort en krachtig' }],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Luisteraars hebben een beperkte aandachtsspanne. Kom snel tot de kern en gebruik korte zinnen die makkelijk te volgen zijn.',
                  },
                ],
              },
            ],
          },
        },
        author: {
          name: 'Jasper Hartsuijker',
          role: 'Content Specialist',
        },
        publishedDate: new Date().toISOString(),
        status: 'published',
        featured: true,
        readingTime: 5,
        meta: {
          title: '5 Tips voor effectieve voice-over scripts | 14voices Blog',
          description:
            'Leer hoe je professionele voice-over scripts schrijft met deze 5 praktische tips van onze experts.',
        },
      },
      {
        title: 'De opkomst van AI-stemmen: Kans of bedreiging?',
        slug: 'opkomst-ai-stemmen-voice-over',
        excerpt:
          'Kunstmatige intelligentie verandert de voice-over industrie. Wat betekent dit voor professionele stemacteurs en hun klanten?',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'AI-technologie heeft de afgelopen jaren enorme sprongen gemaakt, ook in de wereld van voice-overs. Maar kunnen deze synthetische stemmen echt concurreren met menselijke stemacteurs?',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [{ type: 'text', text: 'De voordelen van AI-stemmen' }],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'AI-stemmen bieden snelheid en consistentie. Voor eenvoudige, informatieve content kunnen ze een kosteneffectieve oplossing zijn.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [
                  { type: 'text', text: 'Waarom menselijke stemmen onvervangbaar blijven' },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Emotie, nuance en authenticiteit - dat zijn de kenmerken die menselijke stemacteurs uniek maken. Voor merken die echt willen verbinden met hun publiek, blijft de menselijke stem de gouden standaard.',
                  },
                ],
              },
            ],
          },
        },
        author: {
          name: 'Emma de Boer',
          role: 'Voice-over Director',
        },
        publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        status: 'published',
        featured: false,
        readingTime: 7,
        meta: {
          title: 'AI-stemmen vs Menselijke Voice-overs | 14voices Blog',
          description:
            'Ontdek de impact van AI op de voice-over industrie en waarom menselijke stemacteurs onvervangbaar blijven.',
        },
      },
      {
        title: 'Voice-over tarieven: Wat kost een professionele stem?',
        slug: 'voice-over-tarieven-kosten',
        excerpt:
          'Transparantie over voice-over prijzen. Leer welke factoren de kosten bepalen en hoe je het beste uit je budget haalt.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Een van de meest gestelde vragen die we krijgen is: "Wat kost een voice-over?" Het antwoord hangt af van verschillende factoren die we hier uitleggen.',
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [{ type: 'text', text: 'Factoren die de prijs bepalen' }],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'De lengte van het script, het gebruiksdoel, de ervaring van de stemacteur en de gewenste levertijd spelen allemaal een rol in de uiteindelijke prijs.',
                  },
                ],
              },
            ],
          },
        },
        author: {
          name: 'Mark van den Berg',
          role: 'Account Manager',
        },
        publishedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        status: 'published',
        featured: false,
        readingTime: 6,
        meta: {
          title: 'Voice-over Tarieven en Kosten Uitgelegd | 14voices',
          description:
            'Alles wat je moet weten over voice-over prijzen, tarieven en wat een professionele stem kost.',
        },
      },
    ];

    console.log('Creating blog posts...');
    for (const postData of posts) {
      const post = await payload.create({
        collection: 'blog-posts',
        data: postData as any,
      });
      console.log(`✅ Created: ${post.title}`);
    }

    console.log('\n✨ Blog posts seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

seedBlogPosts();
