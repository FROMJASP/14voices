import type { CollectionConfig } from 'payload';
import { getCollectionLabels, getFAQFieldLabel, getFAQCategoryLabel } from '../i18n';
import { defaultFAQCategories } from '../lib/faq-categories';

const labels = getCollectionLabels('faq');

const FAQ: CollectionConfig = {
  slug: 'faq',
  labels: {
    singular: labels.singular,
    plural: labels.plural,
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order', 'published'],
    group: 'Site Builder',
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
      label: getFAQFieldLabel('question'),
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      label: getFAQFieldLabel('answer'),
    },
    {
      name: 'category',
      type: 'select',
      label: getFAQFieldLabel('category'),
      defaultValue: 'general',
      options: defaultFAQCategories.map((cat) => ({
        label: getFAQCategoryLabel(cat.value),
        value: cat.value,
      })),
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: getFAQFieldLabel('order'),
      admin: {
        components: {
          Cell: '@/components/admin/cells/OrderCell#OrderCell',
        },
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: getFAQFieldLabel('published'),
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

export default FAQ;
