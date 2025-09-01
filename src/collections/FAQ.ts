import type { CollectionConfig } from 'payload';
import { getCollectionLabels, getFAQFieldLabel, getFAQFieldDescription } from '../i18n';
import { defaultFAQCategories } from '../lib/faq-categories';

const labels = getCollectionLabels('faq');

export const FAQ: CollectionConfig = {
  slug: 'faq',
  labels: {
    singular: labels.singular,
    plural: labels.plural,
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order', 'published'],
    description: {
      en: 'Manage frequently asked questions and configure how they appear on the homepage',
      nl: 'Beheer veelgestelde vragen en configureer hoe ze op de homepage worden weergegeven',
    },
    group: 'Content',
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
      admin: {
        description: getFAQFieldDescription('question'),
      },
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      label: getFAQFieldLabel('answer'),
      admin: {
        description: getFAQFieldDescription('answer'),
      },
    },
    {
      name: 'category',
      type: 'select',
      label: getFAQFieldLabel('category'),
      defaultValue: 'general',
      options: defaultFAQCategories,
      admin: {
        description: getFAQFieldDescription('category'),
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: getFAQFieldLabel('order'),
      admin: {
        description: getFAQFieldDescription('order'),
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
      admin: {
        description: getFAQFieldDescription('published'),
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
