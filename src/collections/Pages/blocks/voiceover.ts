import type { Field } from 'payload';

export const voiceoverBlock: Field = {
  type: 'collapsible',
  label: 'Voiceover',
  admin: {
    condition: (data) => data.slug === 'home' || data.slug === 'blog',
    initCollapsed: true,
  },
  fields: [
    {
      name: 'voiceover',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Onze Stemacteurs',
          label: {
            en: 'Section Title',
            nl: 'Sectie Titel',
          },
          admin: {
            description: {
              en: 'Title displayed above the voiceover cards',
              nl: 'Titel weergegeven boven de stemacteur kaarten',
            },
          },
        },
      ],
    },
  ],
};
