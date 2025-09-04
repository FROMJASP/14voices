import type { Field } from 'payload';

export const voiceoverBlock: Field = {
  type: 'collapsible',
  label: {
    en: 'Special sections',
    nl: 'Speciale secties',
  },
  admin: {
    condition: (data) => data.slug === 'home' || data.slug === 'blog',
    initCollapsed: true,
    description: {
      en: 'Custom made designs for your company',
      nl: 'Speciale ontwerpen gemaakt voor jouw bedrijf',
    },
  },
  fields: [
    {
      name: 'voiceover',
      type: 'group',
      fields: [
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'variant1',
          label: {
            en: 'Variant',
            nl: 'Variant',
          },
          options: [
            {
              label: { en: 'Special section variant 1', nl: 'Speciale sectie variant 1' },
              value: 'variant1',
            },
          ],
          admin: {
            description: {
              en: 'Choose the variant for this section',
              nl: 'Kies de variant voor deze sectie',
            },
          },
        },
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
