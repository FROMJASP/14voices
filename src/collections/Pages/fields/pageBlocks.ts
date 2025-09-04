import type { Field } from 'payload';

export const pageBlocksField: Field = {
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
      options: [
        {
          label: { en: 'Hero', nl: 'Hero' },
          value: 'hero',
        },
        {
          label: { en: 'Voiceover', nl: 'Voiceover' },
          value: 'voiceover',
        },
        {
          label: { en: 'Link to Blog', nl: 'Link naar Blog' },
          value: 'linkToBlog',
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
  ],
  defaultValue: [
    { blockType: 'hero', enabled: true },
    { blockType: 'voiceover', enabled: true },
    { blockType: 'linkToBlog', enabled: true },
  ],
};
