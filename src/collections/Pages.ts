import type { CollectionConfig } from 'payload';
import { getCollectionLabels } from '../i18n';
import { pageEditorConfig } from '../fields/lexical/pageEditorConfig';
import {
  heroBlock,
  voiceoverBlock,
  linkToBlogBlock,
  basicContentFields,
  pageBlocksField,
  seoTab,
  settingsTab,
} from './Pages/index';

const labels = getCollectionLabels('pages');

const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: labels.singular,
    plural: labels.plural,
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'title', 'status', 'updatedAt'],
    listSearchableFields: ['title', 'slug'],
    group: {
      en: 'Site Builder',
      nl: 'Site Builder',
    },
    livePreview: {
      url: ({ data }) => {
        const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || '';
        const path = data.slug === 'home' ? '' : data.slug;
        return `${baseURL}/${path}`;
      },
    },
    components: {
      beforeListTable: ['/components/admin/views/PagesList#PagesList'],
      edit: {
        SaveButton: '/components/admin/SaveDraftControls#SaveDraftControls',
      },
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin' || user?.role === 'editor') return true;

      // Public can only see published pages
      return {
        _or: [
          {
            status: {
              equals: 'published',
            },
          },
          {
            status: {
              exists: false,
            },
          },
        ],
      };
    },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => {
      // Only admins can delete pages
      if (user?.role !== 'admin') return false;

      // Return a query to check for locked pages
      return {
        slug: {
          not_equals: 'home',
        },
      };
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 300000, // 5 minutes
      },
    },
    maxPerDoc: 20,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            en: 'Content',
            nl: 'Inhoud',
          },
          fields: [
            ...basicContentFields,
            pageBlocksField,
            {
              name: 'editBlocksTitle',
              type: 'ui',
              admin: {
                condition: (data) => data.slug === 'home' || data.slug === 'blog',
                components: {
                  Field: '/components/admin/fields/EditBlocksTitle#EditBlocksTitle',
                },
              },
            },
            heroBlock,
            voiceoverBlock,
            linkToBlogBlock,
            {
              name: 'content',
              type: 'richText',
              editor: pageEditorConfig,
              label: {
                en: 'Content',
                nl: 'Inhoud',
              },
              admin: {
                description: {
                  en: 'Main page content',
                  nl: 'Hoofdinhoud van de pagina',
                },
                condition: (data) => {
                  // Hide content field for homepage and blog since they use custom layouts
                  return data.slug !== 'home' && data.slug !== 'blog';
                },
              },
            },
            {
              name: 'sections',
              type: 'array',
              label: {
                en: 'Page Sections',
                nl: 'Pagina Secties',
              },
              admin: {
                description: {
                  en: 'Add content sections to build your page',
                  nl: 'Voeg inhoudssecties toe om je pagina op te bouwen',
                },
                condition: (data) => {
                  // Hide sections field for homepage and blog since they use custom layouts
                  return data.slug !== 'home' && data.slug !== 'blog';
                },
              },
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  label: {
                    en: 'Section Type',
                    nl: 'Sectie Type',
                  },
                  options: [
                    { label: { en: 'Rich Text', nl: 'Rijke Tekst' }, value: 'richText' },
                    { label: { en: 'Two Column', nl: 'Twee Kolommen' }, value: 'twoColumn' },
                    { label: { en: 'Call to Action', nl: 'Call to Action' }, value: 'cta' },
                    { label: { en: 'Contact', nl: 'Contact' }, value: 'contact' },
                    { label: { en: 'Pricing', nl: 'Prijzen' }, value: 'pricing' },
                    { label: { en: 'Testimonials', nl: 'Testimonials' }, value: 'testimonials' },
                    { label: { en: 'FAQ', nl: 'FAQ' }, value: 'faq' },
                    { label: { en: 'Gallery', nl: 'Galerij' }, value: 'gallery' },
                  ],
                },
                // Section-specific fields would be defined here
                // For brevity, I'm omitting these as they would be moved to their own files
              ],
            },
          ],
        },
        seoTab,
        settingsTab,
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Set default publishedDate if creating a new page
        if (operation === 'create' && !data.publishedDate) {
          data.publishedDate = new Date().toISOString();
        }

        // Ensure home page remains locked
        if (data.slug === 'home' || data.slug === 'blog') {
          data.locked = true;
        }

        return data;
      },
    ],
  },
};

export default Pages;
