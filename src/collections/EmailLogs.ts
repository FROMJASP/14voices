import { CollectionConfig } from 'payload';

export const EmailLogs: CollectionConfig = {
  slug: 'email-logs',
  admin: {
    useAsTitle: 'subject',
    group: 'Email System',
    defaultColumns: ['recipient', 'template', 'status', 'sentAt'],
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
      name: 'recipientEmail',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address (denormalized for queries)',
      },
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
        description: 'If sent as part of a sequence',
      },
    },
    {
      name: 'sequenceEmailIndex',
      type: 'number',
      admin: {
        description: 'Position in sequence (0-based)',
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Opened', value: 'opened' },
        { label: 'Clicked', value: 'clicked' },
        { label: 'Bounced', value: 'bounced' },
        { label: 'Failed', value: 'failed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'deliveredAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'openedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'clickedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'openCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of times email was opened',
      },
    },
    {
      name: 'clickCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of clicks on links',
      },
    },
    {
      name: 'resendId',
      type: 'text',
      admin: {
        description: 'Resend API email ID',
      },
    },
    {
      name: 'error',
      type: 'textarea',
      admin: {
        description: 'Error message if sending failed',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata from Resend webhooks',
      },
    },
  ],
  indexes: [
    {
      fields: ['recipientEmail', 'sentAt'],
    },
    {
      fields: ['template', 'status'],
    },
    {
      fields: ['resendId'],
      unique: true,
    },
  ],
};

export default EmailLogs;
