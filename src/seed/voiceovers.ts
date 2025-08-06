import { Payload } from 'payload';

export const seedVoiceovers = async (payload: Payload): Promise<void> => {
  // Check if voiceovers already exist
  const existingVoiceovers = await payload.find({
    collection: 'voiceovers',
    limit: 1,
  });

  if (existingVoiceovers.totalDocs > 0) {
    console.log('✓ Voiceovers already exist');
    return;
  }

  console.log('→ Creating voiceovers...');

  const voiceovers = [
    {
      name: 'Emma van der Berg',
      description:
        'Warme, vriendelijke stem perfect voor commercials en bedrijfsfilms. Gespecialiseerd in natuurlijke, conversationele voice-overs.',
      styleTags: [{ tag: 'warm-donker' }, { tag: 'zakelijk' }, { tag: 'kwaliteit' }],
      status: 'active',
      availability: {
        isAvailable: true,
      },
    },
    {
      name: 'Jan de Vries',
      description:
        'Krachtige, autoritaire stem met jarenlange ervaring. Ideaal voor serieuze documentaires en zakelijke presentaties.',
      styleTags: [{ tag: 'autoriteit' }, { tag: 'zakelijk' }, { tag: 'stoer' }],
      status: 'active',
      availability: {
        isAvailable: true,
      },
    },
    {
      name: 'Sophie Janssen',
      description:
        'Energieke, jeugdige stem die perfect past bij moderne merken. Specialiteit: online content en social media.',
      styleTags: [
        { tag: 'jeugdig-fris' },
        { tag: 'kwaliteit' },
        { tag: 'custom', customTag: 'Energiek' },
      ],
      status: 'active',
      availability: {
        isAvailable: true,
      },
    },
    {
      name: 'Thomas Bakker',
      description:
        'Veelzijdige stem met uitstekende timing voor humor en drama. Van animaties tot serieuze narraties.',
      styleTags: [
        { tag: 'warm-donker' },
        { tag: 'stoer' },
        { tag: 'custom', customTag: 'Veelzijdig' },
      ],
      status: 'active',
      availability: {
        isAvailable: false,
        unavailableFrom: new Date('2024-12-20'),
        unavailableUntil: new Date('2025-01-05'),
      },
    },
    {
      name: 'Lisa Vermeer',
      description:
        "Heldere, professionele stem voor e-learning en instructievideo's. Duidelijke articulatie en prettig tempo.",
      styleTags: [{ tag: 'zakelijk' }, { tag: 'kwaliteit' }, { tag: 'jeugdig-fris' }],
      status: 'more-voices',
      availability: {
        isAvailable: true,
      },
    },
    {
      name: 'Robert van Dijk',
      description:
        'Diepe, resonante stem met internationale ervaring. Perfect voor luxe merken en premium producties.',
      styleTags: [{ tag: 'autoriteit' }, { tag: 'warm-donker' }, { tag: 'kwaliteit' }],
      status: 'active',
      availability: {
        isAvailable: true,
      },
    },
    {
      name: 'Anna Visser',
      description:
        'Veelzijdige stem voor karakters en animaties. Van kinderboeken tot spelletjes, brengt elk personage tot leven.',
      styleTags: [
        { tag: 'jeugdig-fris' },
        { tag: 'custom', customTag: 'Karakterstemmen' },
        { tag: 'kwaliteit' },
      ],
      status: 'active',
      availability: {
        isAvailable: true,
      },
    },
    {
      name: 'Mark de Groot',
      description:
        'Ervaren radiomaker en voice-over. Natuurlijke presentatiestijl met uitstekende improvisatievaardigheden.',
      styleTags: [{ tag: 'zakelijk' }, { tag: 'stoer' }, { tag: 'custom', customTag: 'Radio' }],
      status: 'more-voices',
      availability: {
        isAvailable: true,
      },
    },
  ];

  // Create voiceovers
  for (const voiceover of voiceovers) {
    try {
      await payload.create({
        collection: 'voiceovers',
        data: voiceover as any,
      });
      console.log(`  ✓ Created voiceover: ${voiceover.name}`);
    } catch (error) {
      console.error(`  ✗ Failed to create voiceover ${voiceover.name}:`, error);
    }
  }

  console.log('✓ Voiceovers created successfully');
};
