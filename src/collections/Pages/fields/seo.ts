import type { Tab } from 'payload';

export const seoTab: Tab = {
  label: {
    en: 'SEO',
    nl: 'SEO',
  },
  fields: [
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO meta title (overrides page title if set)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO meta description for search results',
          },
        },
        {
          name: 'keywords',
          type: 'array',
          label: 'Keywords',
          labels: {
            singular: 'Keyword',
            plural: 'Keywords',
          },
          fields: [
            {
              name: 'keyword',
              type: 'text',
            },
          ],
          admin: {
            description: 'SEO keywords (not used by most search engines)',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Social media preview image',
          },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Prevent search engines from indexing this page',
          },
        },
      ],
    },
    {
      name: 'openGraph',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'OG title for social sharing',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'OG description for social sharing',
          },
        },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'website',
          options: [
            { label: 'Website', value: 'website' },
            { label: 'Article', value: 'article' },
          ],
        },
      ],
    },
  ],
};
