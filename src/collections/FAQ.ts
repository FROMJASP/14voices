import type { CollectionConfig } from 'payload';

export const FAQ: CollectionConfig = {
  slug: 'faq',
  labels: {
    singular: 'FAQ Item',
    plural: 'FAQ Items',
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order', 'published'],
    description: 'Manage frequently asked questions for the website',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: 'Question',
      admin: {
        description: 'The question that visitors frequently ask',
      },
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      label: 'Answer',
      admin: {
        description: 'Detailed answer to the question',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      defaultValue: 'general',
      options: [
        { label: 'Algemeen', value: 'general' },
        { label: 'Prijzen', value: 'pricing' },
        { label: 'Levering', value: 'delivery' },
        { label: 'Technisch', value: 'technical' },
        { label: 'Rechten', value: 'rights' },
      ],
      admin: {
        description: 'Category to group related questions',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Lower numbers appear first (0, 1, 2, ...)',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'Published',
      admin: {
        description: 'Only published FAQ items will be shown on the website',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure order is set
        if (data && typeof data.order === 'undefined') {
          data.order = 999;
        }
        return data;
      },
    ],
  },
};