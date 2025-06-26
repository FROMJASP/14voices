import { CollectionConfig } from 'payload'

export const EmailJobs: CollectionConfig = {
  slug: 'email-jobs',
  admin: {
    useAsTitle: 'id',
    group: 'Email System',
    defaultColumns: ['recipient', 'template', 'status', 'scheduledFor'],
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'email-templates',
      required: true,
    },
    {
      name: 'sequence',
      type: 'relationship',
      relationTo: 'email-sequences',
      admin: {
        description: 'If part of a sequence',
      },
    },
    {
      name: 'sequenceEmailIndex',
      type: 'number',
      admin: {
        description: 'Position in sequence',
      },
    },
    {
      name: 'scheduledFor',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When to send this email',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Processing', value: 'processing' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'variables',
      type: 'json',
      admin: {
        description: 'Variables to use when rendering template',
      },
    },
    {
      name: 'attempts',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of send attempts',
      },
    },
    {
      name: 'lastAttempt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'error',
      type: 'textarea',
      admin: {
        description: 'Last error message',
      },
    },
    {
      name: 'emailLog',
      type: 'relationship',
      relationTo: 'email-logs',
      admin: {
        description: 'Created after successful send',
      },
    },
  ],
  indexes: [
    {
      fields: ['status', 'scheduledFor'],
    },
    {
      fields: ['recipient', 'sequence'],
    },
  ],
}

export default EmailJobs