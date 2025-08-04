import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function seedVoiceovers() {
  const payload = await getPayload({ config: configPromise });

  console.log('Seeding voiceovers...');

  try {
    // Check if we already have voiceovers
    const existing = await payload.find({
      collection: 'voiceovers',
      limit: 1,
    });

    if (existing.totalDocs > 0) {
      console.log(`Found ${existing.totalDocs} existing voiceovers.`);
      
      // Get all voiceovers to check their status
      const allVoiceovers = await payload.find({
        collection: 'voiceovers',
        limit: 100,
      });
      
      const activeCount = allVoiceovers.docs.filter(v => v.status === 'active').length;
      console.log(`Active voiceovers: ${activeCount}`);
      
      if (activeCount === 0) {
        console.log('No active voiceovers found. Creating sample active voiceovers...');
      } else {
        console.log('Active voiceovers exist. Skipping seed.');
        return;
      }
    }

    // First, create some sample media entries for demo files
    console.log('Creating sample media entries...');
    
    const demoFiles = [
      { filename: 'emma-demo-reel.mp3', alt: 'Emma Demo Reel' },
      { filename: 'emma-commercials.mp3', alt: 'Emma Commercials' },
      { filename: 'emma-narrative.mp3', alt: 'Emma Narrative' },
      { filename: 'jan-demo-reel.mp3', alt: 'Jan Demo Reel' },
      { filename: 'jan-commercials.mp3', alt: 'Jan Commercials' },
      { filename: 'sophie-demo-reel.mp3', alt: 'Sophie Demo Reel' },
      { filename: 'sophie-commercials.mp3', alt: 'Sophie Commercials' },
      { filename: 'thomas-demo-reel.mp3', alt: 'Thomas Demo Reel' },
    ];

    const mediaIds: Record<string, string> = {};

    for (const file of demoFiles) {
      const media = await payload.create({
        collection: 'media',
        data: {
          filename: file.filename,
          alt: file.alt,
          mimeType: 'audio/mpeg',
          filesize: 1024 * 1024 * 2, // 2MB dummy size
          url: `/media/${file.filename}`,
        },
      });
      mediaIds[file.filename] = String(media.id);
    }

    // Create sample voiceovers with proper demo files
    const sampleVoiceovers = [
      {
        name: 'Emma van der Berg',
        slug: 'emma-van-der-berg',
        description: 'Warme, vriendelijke stem perfect voor commercials en bedrijfsfilms. Gespecialiseerd in natuurlijke, conversationele voice-overs.',
        styleTags: [
          { tag: 'warm-donker' },
          { tag: 'vriendelijk-vrolijk' },
          { tag: 'kwaliteit' }
        ],
        status: 'active',
        fullDemoReel: mediaIds['emma-demo-reel.mp3'],
        commercialsDemo: mediaIds['emma-commercials.mp3'],
        narrativeDemo: mediaIds['emma-narrative.mp3'],
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Jan de Vries',
        slug: 'jan-de-vries',
        description: 'Krachtige, autoritaire stem met jarenlange ervaring. Ideaal voor serieuze documentaires en zakelijke presentaties.',
        styleTags: [
          { tag: 'autoriteit' },
          { tag: 'zakelijk' },
          { tag: 'stoer' }
        ],
        status: 'active',
        fullDemoReel: mediaIds['jan-demo-reel.mp3'],
        commercialsDemo: mediaIds['jan-commercials.mp3'],
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Sophie Janssen',
        slug: 'sophie-janssen',
        description: 'Energieke, jeugdige stem die perfect past bij moderne merken. Specialiteit: online content en social media.',
        styleTags: [
          { tag: 'jeugdig-fris' },
          { tag: 'eigentijds' },
          { tag: 'custom', customTag: 'Energiek' }
        ],
        status: 'active',
        fullDemoReel: mediaIds['sophie-demo-reel.mp3'],
        commercialsDemo: mediaIds['sophie-commercials.mp3'],
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Thomas Bakker',
        slug: 'thomas-bakker',
        description: 'Veelzijdige stem met uitstekende timing voor humor en drama. Van animaties tot serieuze narraties.',
        styleTags: [
          { tag: 'warm-donker' },
          { tag: 'stoer' },
          { tag: 'vernieuwend' }
        ],
        status: 'active',
        fullDemoReel: mediaIds['thomas-demo-reel.mp3'],
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Lisa Vermeer',
        slug: 'lisa-vermeer',
        description: 'Heldere, professionele stem voor e-learning en instructievideo\'s. Duidelijke articulatie en prettig tempo.',
        styleTags: [
          { tag: 'zakelijk' },
          { tag: 'helder' },
          { tag: 'kwaliteit' }
        ],
        status: 'active',
        fullDemoReel: mediaIds['emma-demo-reel.mp3'], // Reusing for demo
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Mark van Houten',
        slug: 'mark-van-houten',
        description: 'Urban en eigentijds geluid. Perfect voor jonge doelgroepen en moderne merken.',
        styleTags: [
          { tag: 'urban' },
          { tag: 'eigentijds' },
          { tag: 'stoer' }
        ],
        status: 'active',
        fullDemoReel: mediaIds['jan-demo-reel.mp3'], // Reusing for demo
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Sarah de Boer',
        slug: 'sarah-de-boer',
        description: 'Naturel en authentiek. Ideaal voor documentaires en natuurprogramma\'s.',
        styleTags: [
          { tag: 'naturel' },
          { tag: 'warm-donker' },
          { tag: 'kwaliteit' }
        ],
        status: 'active',
        fullDemoReel: mediaIds['sophie-demo-reel.mp3'], // Reusing for demo
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Pieter Jansen',
        slug: 'pieter-jansen',
        description: 'Gezellige stem met een glimlach. Perfect voor familievriendelijke content.',
        styleTags: [
          { tag: 'gezellig-genieten' },
          { tag: 'vriendelijk-vrolijk' },
          { tag: 'warm-donker' }
        ],
        status: 'active',
        fullDemoReel: mediaIds['thomas-demo-reel.mp3'], // Reusing for demo
        availability: {
          isAvailable: true,
        },
      },
    ];

    // Create voiceovers
    for (const voiceover of sampleVoiceovers) {
      await payload.create({
        collection: 'voiceovers',
        data: voiceover,
      });
      console.log(`Created voiceover: ${voiceover.name}`);
    }

    console.log('Successfully seeded voiceovers!');
  } catch (error) {
    console.error('Error seeding voiceovers:', error);
  } finally {
    process.exit(0);
  }
}

seedVoiceovers();