import type { GlobalConfig } from 'payload';

export const HomepageSettings: GlobalConfig = {
  slug: 'homepage-settings',
  label: 'Homepage Settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Section',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'processSteps',
                  type: 'array',
                  label: 'Process Steps',
                  admin: {
                    description: 'The small process steps displayed at the top of the hero',
                    initCollapsed: false,
                  },
                  defaultValue: [
                    { text: '1. Kies de stem' },
                    { text: '2. Upload script' },
                    { text: '3. Ontvang audio' },
                  ],
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Text for this step (e.g., "1. Kies de stem")',
                      },
                    },
                  ],
                },
                {
                  name: 'title',
                  type: 'textarea',
                  label: 'Main Title',
                  required: true,
                  defaultValue: 'Vind de stem die jouw merk laat spreken.',
                  admin: {
                    description: 'Main hero title - use line breaks to separate lines',
                    rows: 3,
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  required: true,
                  defaultValue:
                    'Een goed verhaal verdient een goede stem. Daarom trainde wij onze 14 voice-overs die samen met onze technici klaarstaan om jouw tekst tot leven te brengen!',
                  admin: {
                    description: 'Hero description text',
                    rows: 4,
                  },
                },
                {
                  name: 'primaryButton',
                  type: 'group',
                  label: 'Primary Button',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                      defaultValue: 'Ontdek stemmen',
                      admin: {
                        description: 'Text for the primary call-to-action button',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      defaultValue: '#voiceovers',
                      admin: {
                        description: 'URL for the primary button (e.g., #voiceovers, /voiceovers)',
                      },
                    },
                  ],
                },
                {
                  name: 'secondaryButton',
                  type: 'group',
                  label: 'Secondary Button',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                      defaultValue: 'Hoe wij werken',
                      admin: {
                        description: 'Text for the secondary button',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      defaultValue: '/hoe-het-werkt',
                      admin: {
                        description: 'URL for the secondary button',
                      },
                    },
                  ],
                },
                {
                  name: 'heroImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Hero Image',
                  required: false,
                  admin: {
                    description:
                      'Main image displayed in the oval-shaped container on the right (recommended: high-quality portrait photo, minimum 400x500px)',
                  },
                },
                {
                  name: 'stats',
                  type: 'array',
                  label: 'Statistics',
                  admin: {
                    description: 'Statistics displayed below the buttons',
                    initCollapsed: false,
                  },
                  defaultValue: [
                    { number: '14', label: 'Stemacteurs' },
                    { number: '<48u', label: 'Snelle levering' },
                    { number: '9.1/10', label: 'Klantbeoordeling' },
                  ],
                  fields: [
                    {
                      name: 'number',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'The statistic number/value (e.g., "14", "<48u", "9.1/10")',
                      },
                    },
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'The statistic label (e.g., "Stemacteurs", "Snelle levering")',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
