import type { Field } from 'payload';

export const pageBlocksField: Field = {
  name: 'pageBlocks',
  type: 'array',
  label: {
    en: 'Layout',
    nl: 'Layout',
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
    description: {
      en: 'Control which blocks appear on the page and in what order',
      nl: 'Bepaal welke blokken op de pagina verschijnen en in welke volgorde',
    },
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
    // Hero variant field
    {
      name: 'heroVariant',
      type: 'select',
      defaultValue: 'variant1',
      label: {
        en: 'Variant',
        nl: 'Variant',
      },
      options: [
        {
          label: { en: 'Hero variant 1', nl: 'Hero variant 1' },
          value: 'variant1',
        },
        {
          label: { en: 'Hero variant 2', nl: 'Hero variant 2' },
          value: 'variant2',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'hero',
        description: {
          en: 'Choose the variant for the hero section',
          nl: 'Kies de variant voor de hero sectie',
        },
      },
    },
    // Voiceover/Special sections variant field
    {
      name: 'voiceoverVariant',
      type: 'select',
      defaultValue: 'variant1',
      label: {
        en: 'Variant',
        nl: 'Variant',
      },
      options: [
        {
          label: { en: 'Voiceover variant 1', nl: 'Voiceover variant 1' },
          value: 'variant1',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'voiceover',
        description: {
          en: 'Custom made designs for your company',
          nl: 'Speciale ontwerpen gemaakt voor jouw bedrijf',
        },
      },
    },
    // Content variant field
    {
      name: 'contentVariant',
      type: 'select',
      defaultValue: 'variant1',
      label: {
        en: 'Variant',
        nl: 'Variant',
      },
      options: [
        {
          label: { en: 'Content variant 1', nl: 'Content variant 1' },
          value: 'variant1',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.blockType === 'linkToBlog',
        description: {
          en: 'Choose the variant for this section',
          nl: 'Kies de variant voor deze sectie',
        },
      },
    },
  ],
  defaultValue: [
    { blockType: 'hero', enabled: true, heroVariant: 'variant1' },
    { blockType: 'linkToBlog', enabled: true, contentVariant: 'variant1' },
    { blockType: 'voiceover', enabled: true, voiceoverVariant: 'variant1' },
  ],
};
