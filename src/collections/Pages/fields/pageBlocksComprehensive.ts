import type { Field } from 'payload';
import { heroTitleConfig } from '@/fields/lexical/heroTitleConfig';
import { heroDescriptionConfig } from '@/fields/lexical/heroDescriptionConfig';
import { heroSubtitleConfig } from '@/fields/lexical/heroSubtitleConfig';

/**
 * Comprehensive pageBlocks field that contains both layout controls and content fields
 * This allows for dynamic block management where blocks only appear when added to the layout
 */
export const pageBlocksComprehensiveField: Field[] = [
  {
    name: 'pageBlocks',
    type: 'array',
    label: {
      en: 'Page Blocks',
      nl: 'Pagina Blokken',
    },
    labels: {
      singular: {
        en: 'Block',
        nl: 'Blok',
      },
      plural: {
        en: 'Blocks',
        nl: 'Blokken',
      },
    },
    admin: {
      condition: (data) => data.slug === 'home' || data.slug === 'blog',
      initCollapsed: false,
      components: {
        RowLabel: '/components/admin/cells/PageBlockLabel#PageBlockLabel',
      },
    },
    fields: [
      // ========================================
      // LAYOUT CONTROLS (Always visible)
      // ========================================
      {
        type: 'collapsible',
        label: {
          en: 'Layout Settings',
          nl: 'Layout Instellingen',
        },
        admin: {
          initCollapsed: false,
        },
        fields: [
          {
            name: 'blockType',
            type: 'select',
            required: true,
            label: {
              en: 'Block Type',
              nl: 'Blok Type',
            },
            options: [
              {
                label: { en: 'Hero Section', nl: 'Hero Section' },
                value: 'hero',
              },
              {
                label: { en: 'Content', nl: 'Content' },
                value: 'linkToBlog',
              },
              {
                label: { en: 'Special sections', nl: 'Speciale secties' },
                value: 'voiceover',
              },
            ],
          },
          {
            name: 'enabled',
            type: 'checkbox',
            defaultValue: true,
            label: {
              en: 'Enabled',
              nl: 'Ingeschakeld',
            },
            admin: {
              description: {
                en: 'Toggle to show/hide this block',
                nl: 'Schakel in/uit om dit blok te tonen/verbergen',
              },
            },
          },
          // Single variant field - we'll use conditional fields to show the right options
          {
            name: 'variant',
            type: 'select',
            label: {
              en: 'Variant',
              nl: 'Variant',
            },
            defaultValue: 'variant1',
            options: [
              { label: { en: 'Variant 1', nl: 'Variant 1' }, value: 'variant1' },
              { label: { en: 'Variant 2', nl: 'Variant 2' }, value: 'variant2' },
            ],
            admin: {
              description: {
                en: 'Choose the visual style for this block',
                nl: 'Kies de visuele stijl voor dit blok',
              },
            },
          },
        ],
      },

      // ========================================
      // CONTENT SECTION (Block-specific fields)
      // ========================================
      {
        type: 'collapsible',
        label: {
          en: 'Block Content',
          nl: 'Blok Inhoud',
        },
        admin: {
          initCollapsed: false,
          description: {
            en: 'Configure the content for this block',
            nl: 'Configureer de inhoud voor dit blok',
          },
        },
        fields: [
          // ========================================
          // HERO BLOCK FIELDS
          // ========================================
          {
            name: 'heroContent',
            type: 'group',
            label: {
              en: 'Hero Content',
              nl: 'Hero Inhoud',
            },
            admin: {
              condition: (_, siblingData) => siblingData?.blockType === 'hero',
            },
            fields: [
              // Process steps (variant 1 only)
              {
                name: 'processSteps',
                type: 'array',
                label: {
                  en: 'Process Steps',
                  nl: 'Processtappen',
                },
                admin: {
                  condition: (_, siblingData) => siblingData?.variant === 'variant1',
                  description: {
                    en: 'The small process steps displayed at the top of the hero',
                    nl: 'De kleine processtappen die bovenaan de hero worden weergegeven',
                  },
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
                    label: {
                      en: 'Text',
                      nl: 'Tekst',
                    },
                  },
                ],
              },
              // Badge (variant 2 only)
              {
                name: 'badge',
                type: 'group',
                label: {
                  en: 'Badge',
                  nl: 'Badge',
                },
                admin: {
                  condition: (_, siblingData) => siblingData?.variant === 'variant2',
                },
                fields: [
                  {
                    name: 'enabled',
                    type: 'checkbox',
                    defaultValue: true,
                    label: {
                      en: 'Show Badge',
                      nl: 'Toon Badge',
                    },
                  },
                  {
                    name: 'text',
                    type: 'text',
                    defaultValue: 'Just released v1.0.0',
                    label: {
                      en: 'Badge Text',
                      nl: 'Badge Tekst',
                    },
                    admin: {
                      condition: (_, siblingData) => siblingData?.enabled !== false,
                    },
                  },
                ],
              },
              // Common hero fields
              {
                name: 'titleRichText',
                type: 'richText',
                editor: heroTitleConfig,
                label: {
                  en: 'Hero Title',
                  nl: 'Hero Titel',
                },
                admin: {
                  description: {
                    en: 'Use the <code> button to highlight text in brand color.',
                    nl: 'Gebruik de <code> knop om tekst in merkkleur te markeren.',
                  },
                },
              },
              {
                name: 'subtitleRichText',
                type: 'richText',
                editor: heroSubtitleConfig,
                label: {
                  en: 'Subtitle',
                  nl: 'Ondertitel',
                },
                admin: {
                  condition: (_, siblingData) => siblingData?.variant === 'variant2',
                },
              },
              {
                name: 'descriptionRichText',
                type: 'richText',
                editor: heroDescriptionConfig,
                label: {
                  en: 'Description',
                  nl: 'Beschrijving',
                },
                admin: {
                  condition: (_, siblingData) => siblingData?.variant === 'variant1',
                },
              },
              {
                name: 'heroImage',
                type: 'upload',
                relationTo: 'media',
                label: {
                  en: 'Hero Image',
                  nl: 'Hero Afbeelding',
                },
                admin: {
                  condition: (_, siblingData) => siblingData?.variant === 'variant1',
                  description: {
                    en: 'Main image displayed in the hero section',
                    nl: 'Hoofdafbeelding weergegeven in de hero sectie',
                  },
                },
              },
              // Primary Button
              {
                name: 'primaryButton',
                type: 'group',
                label: {
                  en: 'Primary Button',
                  nl: 'Primaire Knop',
                },
                fields: [
                  {
                    name: 'enabled',
                    type: 'checkbox',
                    defaultValue: true,
                    label: {
                      en: 'Show Button',
                      nl: 'Toon Knop',
                    },
                  },
                  {
                    name: 'text',
                    type: 'text',
                    defaultValue: 'Ontdek stemmen',
                    label: {
                      en: 'Button Text',
                      nl: 'Knop Tekst',
                    },
                    admin: {
                      condition: (_, siblingData) => siblingData?.enabled !== false,
                    },
                  },
                  {
                    name: 'url',
                    type: 'text',
                    defaultValue: '#voiceovers',
                    label: {
                      en: 'Button URL',
                      nl: 'Knop URL',
                    },
                    admin: {
                      condition: (_, siblingData) => siblingData?.enabled !== false,
                    },
                  },
                ],
              },
              // Secondary Button
              {
                name: 'secondaryButton',
                type: 'group',
                label: {
                  en: 'Secondary Button',
                  nl: 'Secundaire Knop',
                },
                fields: [
                  {
                    name: 'enabled',
                    type: 'checkbox',
                    defaultValue: true,
                    label: {
                      en: 'Show Button',
                      nl: 'Toon Knop',
                    },
                  },
                  {
                    name: 'text',
                    type: 'text',
                    defaultValue: 'Hoe wij werken',
                    label: {
                      en: 'Button Text',
                      nl: 'Knop Tekst',
                    },
                    admin: {
                      condition: (_, siblingData) => siblingData?.enabled !== false,
                    },
                  },
                  {
                    name: 'url',
                    type: 'text',
                    defaultValue: '/hoe-het-werkt',
                    label: {
                      en: 'Button URL',
                      nl: 'Knop URL',
                    },
                    admin: {
                      condition: (_, siblingData) => siblingData?.enabled !== false,
                    },
                  },
                ],
              },
              // Stats (variant 1 only)
              {
                name: 'stats',
                type: 'array',
                label: {
                  en: 'Hero Stats',
                  nl: 'Hero Statistieken',
                },
                admin: {
                  condition: (_, siblingData) => siblingData?.variant === 'variant1',
                  description: {
                    en: 'Statistics displayed at the bottom of the hero section',
                    nl: 'Statistieken weergegeven onderaan de hero sectie',
                  },
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
                    label: {
                      en: 'Number/Value',
                      nl: 'Nummer/Waarde',
                    },
                  },
                  {
                    name: 'label',
                    type: 'text',
                    required: true,
                    label: {
                      en: 'Label',
                      nl: 'Label',
                    },
                  },
                ],
              },
            ],
          },

          // ========================================
          // VOICEOVER BLOCK FIELDS
          // ========================================
          {
            name: 'voiceoverContent',
            type: 'group',
            label: {
              en: 'Voiceover Content',
              nl: 'Voiceover Inhoud',
            },
            admin: {
              condition: (_, siblingData) => siblingData?.blockType === 'voiceover',
            },
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

          // ========================================
          // LINK TO BLOG BLOCK FIELDS
          // ========================================
          {
            name: 'linkToBlogContent',
            type: 'group',
            label: {
              en: 'Content Block',
              nl: 'Content Blok',
            },
            admin: {
              condition: (_, siblingData) => siblingData?.blockType === 'linkToBlog',
            },
            fields: [
              {
                name: 'enabled',
                type: 'checkbox',
                defaultValue: true,
                label: {
                  en: 'Enable Section',
                  nl: 'Sectie Inschakelen',
                },
              },
              {
                name: 'image',
                type: 'upload',
                relationTo: 'media',
                label: {
                  en: 'Section Image',
                  nl: 'Sectie Afbeelding',
                },
              },
              {
                name: 'imageGrayscale',
                type: 'checkbox',
                defaultValue: true,
                label: {
                  en: 'Apply Grayscale Filter',
                  nl: 'Grijstinten Filter Toepassen',
                },
              },
              {
                name: 'badge',
                type: 'text',
                defaultValue: 'Nieuw',
                label: {
                  en: 'Badge Text',
                  nl: 'Badge Tekst',
                },
              },
              {
                name: 'title',
                type: 'text',
                defaultValue: 'Het Blog',
                label: {
                  en: 'Title',
                  nl: 'Titel',
                },
              },
              {
                name: 'subtitle',
                type: 'textarea',
                defaultValue: 'Lees meer over de subtiele kunst die stemacteren heet.',
                label: {
                  en: 'Subtitle',
                  nl: 'Ondertitel',
                },
              },
              {
                name: 'buttonText',
                type: 'text',
                defaultValue: 'Bekijk posts',
                label: {
                  en: 'Button Text',
                  nl: 'Knop Tekst',
                },
              },
              {
                name: 'buttonUrl',
                type: 'text',
                defaultValue: '/blog',
                label: {
                  en: 'Button URL',
                  nl: 'Knop URL',
                },
              },
            ],
          },
        ],
      },
    ],
    defaultValue: [
      { 
        blockType: 'hero', 
        enabled: true, 
        variant: 'variant1',
      },
      { 
        blockType: 'linkToBlog', 
        enabled: true, 
        variant: 'variant1',
      },
      { 
        blockType: 'voiceover', 
        enabled: true, 
        variant: 'variant1',
      },
    ],
  },
];