import type { Block } from 'payload';
import { heroTitleConfig } from '@/fields/lexical/heroTitleConfig';
import { heroDescriptionConfig } from '@/fields/lexical/heroDescriptionConfig';
import { heroSubtitleConfig } from '@/fields/lexical/heroSubtitleConfig';

/**
 * Hero Block - Variant 1 (Process Steps)
 * This variant shows process steps and statistics
 */
export const HeroV1Block: Block = {
  slug: 'hero-v1',
  imageURL: '/admin/block-previews/hero-v1.svg',
  labels: {
    singular: {
      en: 'Hero - Text with Image v1',
      nl: 'Hero - Tekst met Afbeelding v1',
    },
    plural: {
      en: 'Hero - Text with Image v1',
      nl: 'Hero - Tekst met Afbeelding v1',
    },
  },
  fields: [
    {
      name: 'processSteps',
      type: 'array',
      label: {
        en: 'Process Steps',
        nl: 'Processtappen',
      },
      minRows: 1,
      maxRows: 4,
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
            en: 'Step Text',
            nl: 'Stap Tekst',
          },
        },
      ],
    },
    {
      name: 'title',
      type: 'richText',
      editor: heroTitleConfig,
      label: {
        en: 'Hero Title',
        nl: 'Hero Titel',
      },
      admin: {
        description: {
          en: 'The main heading text. Use formatting like bold, italic, or colors to highlight specific words.',
          nl: 'De hoofdtekst. Gebruik opmaak zoals vet, cursief of kleuren om specifieke woorden te benadrukken.',
        },
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: heroDescriptionConfig,
      label: {
        en: 'Hero Description',
        nl: 'Hero Beschrijving',
      },
      admin: {
        description: {
          en: 'Supporting text below the title. You can use formatting and links.',
          nl: 'Ondersteunende tekst onder de titel. Je kunt opmaak en links gebruiken.',
        },
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Hero Image',
        nl: 'Hero Afbeelding',
      },
    },
    {
      name: 'cta',
      type: 'group',
      label: {
        en: 'Call to Action Buttons',
        nl: 'Call to Action Knoppen',
      },
      fields: [
        // Primary Button
        {
          name: 'primaryLabel',
          type: 'text',
          defaultValue: 'Hoor het verschil',
          label: {
            en: 'Primary Button Label',
            nl: 'Primaire Knop Label',
          },
        },
        {
          name: 'primaryUrl',
          type: 'text',
          defaultValue: '/voice-overs',
          label: {
            en: 'Primary Button URL',
            nl: 'Primaire Knop URL',
          },
        },
        {
          name: 'primaryStyle',
          type: 'group',
          label: {
            en: 'Primary Button Style',
            nl: 'Primaire Knop Stijl',
          },
          fields: [
            {
              name: 'backgroundColor',
              type: 'text',
              defaultValue: '#000000',
              label: 'Background Color',
              admin: {
                description: 'Hex color code (e.g., #000000)',
              },
            },
            {
              name: 'textColor',
              type: 'text',
              defaultValue: '#FFFFFF',
              label: 'Text Color',
            },
            {
              name: 'borderRadius',
              type: 'select',
              defaultValue: 'rounded',
              label: 'Border Radius',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Small (4px)', value: 'small' },
                { label: 'Medium (8px)', value: 'medium' },
                { label: 'Large (12px)', value: 'large' },
                { label: 'Rounded (24px)', value: 'rounded' },
                { label: 'Full', value: 'full' },
              ],
            },
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'arrow-right',
              label: 'Icon',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Arrow Right', value: 'arrow-right' },
                { label: 'Arrow Left', value: 'arrow-left' },
                { label: 'Play', value: 'play' },
                { label: 'Download', value: 'download' },
                { label: 'External Link', value: 'external' },
              ],
            },
            {
              name: 'iconPosition',
              type: 'select',
              defaultValue: 'right',
              label: 'Icon Position',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.icon !== 'none',
              },
            },
          ],
        },
        // Secondary Button
        {
          name: 'secondaryLabel',
          type: 'text',
          defaultValue: 'Bekijk prijzen',
          label: {
            en: 'Secondary Button Label',
            nl: 'Secundaire Knop Label',
          },
        },
        {
          name: 'secondaryUrl',
          type: 'text',
          defaultValue: '#prijzen',
          label: {
            en: 'Secondary Button URL',
            nl: 'Secundaire Knop URL',
          },
        },
        {
          name: 'secondaryStyle',
          type: 'group',
          label: {
            en: 'Secondary Button Style',
            nl: 'Secundaire Knop Stijl',
          },
          fields: [
            {
              name: 'backgroundColor',
              type: 'text',
              defaultValue: 'transparent',
              label: 'Background Color',
            },
            {
              name: 'textColor',
              type: 'text',
              defaultValue: '#000000',
              label: 'Text Color',
            },
            {
              name: 'borderColor',
              type: 'text',
              defaultValue: '#E5E5E5',
              label: 'Border Color',
            },
            {
              name: 'borderRadius',
              type: 'select',
              defaultValue: 'rounded',
              label: 'Border Radius',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Small (4px)', value: 'small' },
                { label: 'Medium (8px)', value: 'medium' },
                { label: 'Large (12px)', value: 'large' },
                { label: 'Rounded (24px)', value: 'rounded' },
                { label: 'Full', value: 'full' },
              ],
            },
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'play',
              label: 'Icon',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Arrow Right', value: 'arrow-right' },
                { label: 'Arrow Left', value: 'arrow-left' },
                { label: 'Play', value: 'play' },
                { label: 'Download', value: 'download' },
                { label: 'External Link', value: 'external' },
              ],
            },
            {
              name: 'iconPosition',
              type: 'select',
              defaultValue: 'left',
              label: 'Icon Position',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.icon !== 'none',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: {
        en: 'Statistics',
        nl: 'Statistieken',
      },
      maxRows: 3,
      defaultValue: [
        { value: '14+', label: 'Stemacteurs' },
        { value: '100%', label: 'Kwaliteit' },
        { value: '24h', label: 'Levering' },
      ],
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: {
            en: 'Value',
            nl: 'Waarde',
          },
          admin: {
            description: {
              en: 'The number or percentage to display (e.g., "14+", "100%", "24h")',
              nl: 'Het nummer of percentage om weer te geven (bijv. "14+", "100%", "24h")',
            },
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
          admin: {
            description: {
              en: 'The description text below the value',
              nl: 'De beschrijvingstekst onder de waarde',
            },
          },
        },
        {
          name: 'link',
          type: 'text',
          label: {
            en: 'Link URL (optional)',
            nl: 'Link URL (optioneel)',
          },
          admin: {
            description: {
              en: 'Make this statistic clickable by adding a URL',
              nl: 'Maak deze statistiek klikbaar door een URL toe te voegen',
            },
          },
        },
        {
          name: 'hoverEffect',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Enable Hover Effect',
            nl: 'Hover Effect Inschakelen',
          },
          admin: {
            description: {
              en: 'Add a subtle scale effect on hover',
              nl: 'Voeg een subtiel schaaleffect toe bij hover',
            },
          },
        },
      ],
    },
  ],
};

/**
 * Hero Block - Variant 2 (Badge)
 * This variant shows a badge and subtitle
 */
export const HeroV2Block: Block = {
  slug: 'hero-v2',
  imageURL: '/admin/block-previews/hero-v2.svg',
  labels: {
    singular: {
      en: 'Hero - Center v1',
      nl: 'Hero - Center v1',
    },
    plural: {
      en: 'Hero - Center v1',
      nl: 'Hero - Center v1',
    },
  },
  fields: [
    {
      name: 'badge',
      type: 'group',
      label: {
        en: 'Badge',
        nl: 'Badge',
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
            condition: (_data, siblingData) => siblingData?.enabled !== false,
          },
        },
      ],
    },
    {
      name: 'title',
      type: 'richText',
      editor: heroTitleConfig,
      label: {
        en: 'Hero Title',
        nl: 'Hero Titel',
      },
      admin: {
        description: {
          en: 'The main heading text with formatting options.',
          nl: 'De hoofdtekst met opmaakopties.',
        },
      },
    },
    {
      name: 'subtitle',
      type: 'richText',
      editor: heroSubtitleConfig,
      label: {
        en: 'Hero Subtitle',
        nl: 'Hero Ondertitel',
      },
      admin: {
        description: {
          en: 'Subtitle text above the main title.',
          nl: 'Ondertitel tekst boven de hoofdtitel.',
        },
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: heroDescriptionConfig,
      label: {
        en: 'Hero Description',
        nl: 'Hero Beschrijving',
      },
      admin: {
        description: {
          en: 'Supporting text with formatting and link options.',
          nl: 'Ondersteunende tekst met opmaak- en linkopties.',
        },
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Hero Image',
        nl: 'Hero Afbeelding',
      },
    },
    {
      name: 'cta',
      type: 'group',
      label: {
        en: 'Call to Action',
        nl: 'Call to Action',
      },
      fields: [
        {
          name: 'primaryLabel',
          type: 'text',
          defaultValue: 'Get Started',
          label: {
            en: 'Primary Button Label',
            nl: 'Primaire Knop Label',
          },
        },
        {
          name: 'primaryUrl',
          type: 'text',
          defaultValue: '/voice-overs',
          label: {
            en: 'Primary Button URL',
            nl: 'Primaire Knop URL',
          },
        },
        {
          name: 'secondaryLabel',
          type: 'text',
          label: {
            en: 'Secondary Button Label',
            nl: 'Secundaire Knop Label',
          },
        },
        {
          name: 'secondaryUrl',
          type: 'text',
          label: {
            en: 'Secondary Button URL',
            nl: 'Secundaire Knop URL',
          },
        },
      ],
    },
  ],
};

/**
 * Content Block - Variant 1 (Link to Blog)
 */
export const ContentV1Block: Block = {
  slug: 'content-v1',
  imageURL: '/admin/block-previews/content-v1.svg',
  labels: {
    singular: {
      en: 'Content v1',
      nl: 'Content v1',
    },
    plural: {
      en: 'Content v1',
      nl: 'Content v1',
    },
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Content Image',
        nl: 'Content Afbeelding',
      },
      admin: {
        description: {
          en: 'Image to display above the content',
          nl: 'Afbeelding om boven de content weer te geven',
        },
      },
    },
    {
      name: 'imageStyle',
      type: 'group',
      label: {
        en: 'Image Style',
        nl: 'Afbeelding Stijl',
      },
      fields: [
        {
          name: 'grayscale',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Apply Grayscale Filter',
            nl: 'Grijswaarden Filter Toepassen',
          },
        },
        {
          name: 'rounded',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Rounded Corners',
            nl: 'Afgeronde Hoeken',
          },
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: {
        en: 'Content Title',
        nl: 'Content Titel',
      },
      admin: {
        description: {
          en: 'Main heading for the content section',
          nl: 'Hoofdtitel voor de content sectie',
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: {
        en: 'Content Description',
        nl: 'Content Beschrijving',
      },
      admin: {
        description: {
          en: 'Supporting text that appears next to the title',
          nl: 'Ondersteunende tekst die naast de titel verschijnt',
        },
      },
    },
    {
      name: 'button',
      type: 'group',
      label: {
        en: 'Call to Action Button',
        nl: 'Call to Action Knop',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Learn More',
          label: {
            en: 'Button Label',
            nl: 'Knop Label',
          },
        },
        {
          name: 'url',
          type: 'text',
          defaultValue: '#',
          label: {
            en: 'Button URL',
            nl: 'Knop URL',
          },
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'secondary',
          label: {
            en: 'Button Style',
            nl: 'Knop Stijl',
          },
          options: [
            { label: 'Primary', value: 'default' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
            { label: 'Ghost', value: 'ghost' },
          ],
        },
        {
          name: 'showIcon',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Show Arrow Icon',
            nl: 'Toon Pijl Icoon',
          },
        },
      ],
    },
  ],
};

/**
 * 14v Voiceover Cards Block - Version 1
 * Shows voiceover artist cards in grid layout
 */
export const VoiceoverV1Block: Block = {
  slug: 'voiceover-v1',
  imageURL: '/admin/block-previews/voiceover-v1.svg',
  labels: {
    singular: {
      en: '14v Voiceover Cards v1',
      nl: '14v Voiceover Kaarten v1',
    },
    plural: {
      en: '14v Voiceover Cards v1',
      nl: '14v Voiceover Kaarten v1',
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: {
        en: 'Section Title (optional)',
        nl: 'Sectie Titel (optioneel)',
      },
    },
    {
      name: 'showcase',
      type: 'checkbox',
      defaultValue: true,
      label: {
        en: 'Show Voiceover Showcase',
        nl: 'Toon Voiceover Showcase',
      },
    },
  ],
};

// Export all blocks as an array
export const pageBlocks = [
  HeroV1Block,
  HeroV2Block,
  ContentV1Block,
  VoiceoverV1Block,
];