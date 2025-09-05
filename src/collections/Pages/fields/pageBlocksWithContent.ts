import type { Field } from 'payload';
import { heroTitleConfig } from '@/fields/lexical/heroTitleConfig';
import { heroDescriptionConfig } from '@/fields/lexical/heroDescriptionConfig';
import { heroSubtitleConfig } from '@/fields/lexical/heroSubtitleConfig';

/**
 * This is a new unified pageBlocks field that contains both layout AND content
 * Each block stores its own content, allowing multiple blocks of the same type
 */
export const pageBlocksWithContentField: Field = {
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
          label: { en: 'Hero Section', nl: 'Hero Sectie' },
          value: 'hero',
        },
        {
          label: { en: 'Content', nl: 'Content' },
          value: 'linkToBlog',
        },
        {
          label: { en: 'Voiceover', nl: 'Voiceover' },
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
    },
    
    // ============================================
    // HERO BLOCK FIELDS
    // ============================================
    {
      name: 'heroVariant',
      type: 'select',
      defaultValue: 'variant1',
      label: {
        en: 'Hero Variant',
        nl: 'Hero Variant',
      },
      options: [
        {
          label: { en: 'Variant 1 (Process Steps)', nl: 'Variant 1 (Processtappen)' },
          value: 'variant1',
        },
        {
          label: { en: 'Variant 2 (Badge)', nl: 'Variant 2 (Badge)' },
          value: 'variant2',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'hero',
      },
    },
    
    // Hero Variant 1 Fields (Process Steps)
    {
      name: 'processSteps',
      type: 'array',
      label: {
        en: 'Process Steps',
        nl: 'Processtappen',
      },
      admin: {
        condition: (_, siblingData) => 
          siblingData?.blockType === 'hero' && siblingData?.heroVariant === 'variant1',
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
        },
      ],
    },
    
    // Hero Variant 2 Fields (Badge)
    {
      name: 'badge',
      type: 'group',
      label: {
        en: 'Badge',
        nl: 'Badge',
      },
      admin: {
        condition: (_, siblingData) => 
          siblingData?.blockType === 'hero' && siblingData?.heroVariant === 'variant2',
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
        },
      ],
    },
    
    // Common Hero Fields (both variants)
    {
      name: 'heroTitle',
      type: 'text',
      label: {
        en: 'Hero Title',
        nl: 'Hero Titel',
      },
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'hero',
      },
    },
    {
      name: 'heroTitleRichText',
      type: 'richText',
      editor: heroTitleConfig,
      label: {
        en: 'Hero Title (Rich Text)',
        nl: 'Hero Titel (Rich Text)',
      },
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'hero',
      },
    },
    {
      name: 'heroDescription',
      type: 'textarea',
      label: {
        en: 'Hero Description',
        nl: 'Hero Beschrijving',
      },
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'hero',
      },
    },
    {
      name: 'heroDescriptionRichText',
      type: 'richText',
      editor: heroDescriptionConfig,
      label: {
        en: 'Hero Description (Rich Text)',
        nl: 'Hero Beschrijving (Rich Text)',
      },
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'hero',
      },
    },
    {
      name: 'heroSubtitle',
      type: 'text',
      label: {
        en: 'Hero Subtitle',
        nl: 'Hero Ondertitel',
      },
      admin: {
        condition: (_, siblingData) => 
          siblingData?.blockType === 'hero' && siblingData?.heroVariant === 'variant2',
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
        condition: (_, siblingData) => siblingData?.blockType === 'hero',
      },
    },
    {
      name: 'heroCta',
      type: 'group',
      label: {
        en: 'Call to Action',
        nl: 'Call to Action',
      },
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'hero',
      },
      fields: [
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
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: {
        en: 'Statistics',
        nl: 'Statistieken',
      },
      admin: {
        condition: (_, siblingData) => 
          siblingData?.blockType === 'hero' && siblingData?.heroVariant === 'variant1',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: {
            en: 'Value',
            nl: 'Waarde',
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
    
    // ============================================
    // CONTENT (LINK TO BLOG) FIELDS
    // ============================================
    {
      name: 'contentVariant',
      type: 'select',
      defaultValue: 'variant1',
      label: {
        en: 'Content Variant',
        nl: 'Content Variant',
      },
      options: [
        {
          label: { en: 'Variant 1', nl: 'Variant 1' },
          value: 'variant1',
        },
        {
          label: { en: 'Variant 2', nl: 'Variant 2' },
          value: 'variant2',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'linkToBlog',
      },
    },
    {
      name: 'contentTitle',
      type: 'text',
      label: {
        en: 'Content Title',
        nl: 'Content Titel',
      },
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'linkToBlog',
      },
    },
    {
      name: 'contentDescription',
      type: 'textarea',
      label: {
        en: 'Content Description',
        nl: 'Content Beschrijving',
      },
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'linkToBlog',
      },
    },
    {
      name: 'contentLinks',
      type: 'array',
      label: {
        en: 'Content Links',
        nl: 'Content Links',
      },
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'linkToBlog',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    
    // ============================================
    // VOICEOVER FIELDS
    // ============================================
    {
      name: 'voiceoverVariant',
      type: 'select',
      defaultValue: 'variant1',
      label: {
        en: 'Voiceover Variant',
        nl: 'Voiceover Variant',
      },
      options: [
        {
          label: { en: 'Variant 1', nl: 'Variant 1' },
          value: 'variant1',
        },
        {
          label: { en: 'Variant 2', nl: 'Variant 2' },
          value: 'variant2',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'voiceover',
      },
    },
    {
      name: 'voiceoverTitle',
      type: 'text',
      label: {
        en: 'Voiceover Title',
        nl: 'Voiceover Titel',
      },
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'voiceover',
      },
    },
    {
      name: 'voiceoverDescription',
      type: 'textarea',
      label: {
        en: 'Voiceover Description',
        nl: 'Voiceover Beschrijving',
      },
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'voiceover',
      },
    },
    {
      name: 'voiceoverShowcase',
      type: 'checkbox',
      defaultValue: true,
      label: {
        en: 'Show Voiceover Showcase',
        nl: 'Toon Voiceover Showcase',
      },
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'voiceover',
      },
    },
  ],
};