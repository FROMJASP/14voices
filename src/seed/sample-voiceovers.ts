export const sampleVoiceovers = [
  {
    name: {
      nl: 'Emma van der Berg',
      en: 'Emma van der Berg',
    },
    description: {
      nl: 'Warme, vriendelijke stem perfect voor commercials en bedrijfsfilms. Gespecialiseerd in natuurlijke, conversationele voice-overs.',
      en: 'Warm, friendly voice perfect for commercials and corporate videos. Specialized in natural, conversational voice-overs.',
    },
    styleTags: [
      { tag: 'warm-donker' },
      { tag: 'zakelijk' },
      { tag: 'kwaliteit' },
    ],
    status: 'active',
    availability: {
      isAvailable: true,
    },
  },
  {
    name: {
      nl: 'Jan de Vries',
      en: 'Jan de Vries',
    },
    description: {
      nl: 'Krachtige, autoritaire stem met jarenlange ervaring. Ideaal voor serieuze documentaires en zakelijke presentaties.',
      en: 'Powerful, authoritative voice with years of experience. Ideal for serious documentaries and business presentations.',
    },
    styleTags: [
      { tag: 'autoriteit' },
      { tag: 'zakelijk' },
      { tag: 'stoer' },
    ],
    status: 'active',
    availability: {
      isAvailable: true,
    },
  },
  {
    name: {
      nl: 'Sophie Janssen',
      en: 'Sophie Janssen',
    },
    description: {
      nl: 'Energieke, jeugdige stem die perfect past bij moderne merken. Specialiteit: online content en social media.',
      en: 'Energetic, youthful voice that perfectly fits modern brands. Specialty: online content and social media.',
    },
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
    name: {
      nl: 'Thomas Bakker',
      en: 'Thomas Bakker',
    },
    description: {
      nl: 'Veelzijdige stem met uitstekende timing voor humor en drama. Van animaties tot serieuze narraties.',
      en: 'Versatile voice with excellent timing for humor and drama. From animations to serious narrations.',
    },
    styleTags: [
      { tag: 'warm-donker' },
      { tag: 'stoer' },
      { tag: 'custom', customTag: 'Veelzijdig' },
    ],
    status: 'active',
    availability: {
      isAvailable: false,
      unavailableFrom: new Date('2024-12-20').toISOString(),
      unavailableUntil: new Date('2025-01-05').toISOString(),
    },
  },
  {
    name: {
      nl: 'Lisa Vermeer',
      en: 'Lisa Vermeer',
    },
    description: {
      nl: 'Heldere, professionele stem voor e-learning en instructievideo\'s. Duidelijke articulatie en prettig tempo.',
      en: 'Clear, professional voice for e-learning and instructional videos. Clear articulation and pleasant pace.',
    },
    styleTags: [
      { tag: 'zakelijk' },
      { tag: 'kwaliteit' },
      { tag: 'jeugdig-fris' },
    ],
    status: 'more-voices',
    availability: {
      isAvailable: true,
    },
  },
]