import type { CollectionConfig } from 'payload';

const Cohorts: CollectionConfig = {
  slug: 'cohorts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'color', 'description', 'createdAt'],
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
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the cohort (e.g., "November 2025", "Summer Voices")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version (e.g., "nov-2025")',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'color',
      type: 'select',
      required: true,
      defaultValue: 'blue',
      options: [
        { label: 'Blue', value: 'blue' },
        { label: 'Purple', value: 'purple' },
        { label: 'Green', value: 'green' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Red', value: 'red' },
        { label: 'Pink', value: 'pink' },
        { label: 'Orange', value: 'orange' },
        { label: 'Teal', value: 'teal' },
        { label: 'Indigo', value: 'indigo' },
        { label: 'Gray', value: 'gray' },
      ],
      admin: {
        description: 'Color for the cohort badge',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description of this cohort',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this cohort is currently active',
      },
    },
  ],
};

export default Cohorts;
