import type { Field } from 'payload';
import { formatSlug } from '@/utilities/formatSlug';

export const basicContentFields: Field[] = [
  {
    name: 'slug',
    type: 'text',
    unique: true,
    index: true,
    required: true,
    label: {
      en: 'Slug',
      nl: 'URL-pad',
    },
    admin: {
      description: {
        en: 'URL path for this page (e.g., "about-us")',
        nl: 'URL-pad voor deze pagina (bijv. "over-ons")',
      },
      components: {
        Cell: '/components/admin/cells/PageSlugCell#PageSlugCell',
      },
    },
    validate: (value: unknown) => {
      if (!value) return 'Slug is required';
      if (typeof value !== 'string') return 'Slug must be a string';
      // Prevent reserved routes
      const reserved = ['api', 'admin', '_next', 'payload'];
      if (reserved.includes(value)) {
        return `"${value}" is a reserved route`;
      }
      return true;
    },
    hooks: {
      beforeValidate: [formatSlug('title')],
    },
  },
  {
    name: 'title',
    type: 'text',
    required: true,
    label: {
      en: 'Title',
      nl: 'Titel',
    },
    admin: {
      description: {
        en: 'Page title displayed in browser tabs and search results',
        nl: 'Paginatitel weergegeven in browsertabbladen en zoekresultaten',
      },
      components: {
        Cell: '/components/admin/cells/PageTitleCell#PageTitleCell',
      },
    },
  },
];
