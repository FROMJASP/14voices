import type { Field } from 'payload';

export const pageBlocksField: Field[] = [
  {
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
      en: 'Control which blocks appear on the page and in what order. Note: You can only have one active block of each type.',
      nl: 'Bepaal welke blokken op de pagina verschijnen en in welke volgorde. Let op: Je kunt maar één actief blok van elk type hebben.',
    },
    condition: (data) => data.slug === 'home' || data.slug === 'blog',
    initCollapsed: false,
    components: {
      RowLabel: '/components/admin/cells/PageBlockLabel#PageBlockLabel',
    },
  },
  validate: (value, { t }) => {
    if (!Array.isArray(value)) return true;
    
    // Check for duplicate enabled blocks of the same type
    const enabledBlockTypes = value
      .filter((block: any) => block.enabled !== false)
      .map((block: any) => block.blockType);
    
    const duplicates = enabledBlockTypes.filter((type: string, index: number) => 
      enabledBlockTypes.indexOf(type) !== index
    );
    
    if (duplicates.length > 0) {
      return `You can only have one active block of each type. Duplicate: ${duplicates[0]}`;
    }
    
    return true;
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
          en: 'Choose the visual style for the Hero section',
          nl: 'Kies de visuele stijl voor de Hero sectie',
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
          en: 'Choose the visual style for the Special section',
          nl: 'Kies de visuele stijl voor de Speciale sectie',
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
          en: 'Choose the visual style for the Content section',
          nl: 'Kies de visuele stijl voor de Content sectie',
        },
      },
    },
  ],
  defaultValue: [
    { blockType: 'hero', enabled: true, heroVariant: 'variant1' },
    { blockType: 'linkToBlog', enabled: true, contentVariant: 'variant1' },
    { blockType: 'voiceover', enabled: true, voiceoverVariant: 'variant1' },
  ],
},
];
