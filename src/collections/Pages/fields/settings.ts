import type { Tab } from 'payload';

export const settingsTab: Tab = {
  label: {
    en: 'Settings',
    nl: 'Instellingen',
  },
  fields: [
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        description: 'Set a parent page to create a hierarchy',
      },
      filterOptions: ({ id }) => {
        return {
          id: {
            not_equals: id,
          },
        };
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Page visibility status',
      },
    },
    {
      name: 'locked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Prevent deletion and structural changes to this page',
        condition: (_data, { req }) => req?.user?.role === 'admin',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Schedule page publication',
        components: {
          Cell: '/components/admin/cells/DateCell#DateCell',
        },
      },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'showInNav',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Show this page in the navigation menu',
      },
    },
    {
      name: 'navOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Order in navigation (lower numbers appear first)',
      },
    },
  ],
};
