import type { CollectionConfig } from 'payload';

const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['form', 'submittedAt', 'status'],
    group: 'Site Builder',
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    create: () => true, // Allow public form submissions
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'data',
      type: 'json',
      required: true,
      admin: {
        description: 'Form submission data',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
        { label: 'Archived', value: 'archived' },
        { label: 'Spam', value: 'spam' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this submission',
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
    },
    {
      name: 'submittedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'User who submitted (if logged in)',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        // Future hook implementations can go here
        return doc;
      },
    ],
  },
};

export default FormSubmissions;
