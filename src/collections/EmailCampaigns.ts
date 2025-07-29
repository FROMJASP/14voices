import { CollectionConfig } from 'payload';

export const EmailCampaigns: CollectionConfig = {
  slug: 'email-campaigns',
  admin: {
    useAsTitle: 'name',
    group: 'Email System',
    defaultColumns: ['name', 'status', 'scheduledAt', 'sentCount'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Campaign name for internal reference',
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      admin: {
        description: 'Email subject line - supports personalization like {{{first_name}}}',
      },
    },
    {
      name: 'previewText',
      type: 'text',
      admin: {
        description: 'Preview text shown in email clients',
      },
    },
    {
      name: 'fromName',
      type: 'text',
      defaultValue: '14voices',
      admin: {
        description: 'Sender name',
      },
    },
    {
      name: 'fromEmail',
      type: 'text',
      defaultValue: 'hello@14voices.com',
      admin: {
        description: 'Sender email address',
      },
    },
    {
      name: 'replyTo',
      type: 'text',
      admin: {
        description: 'Reply-to email address',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Campaign content with visual editor',
      },
    },
    {
      name: 'markdownContent',
      type: 'textarea',
      admin: {
        description: 'Alternative markdown content for Resend',
        condition: (data) => data.contentType === 'markdown',
      },
    },
    {
      name: 'contentType',
      type: 'radio',
      defaultValue: 'richtext',
      options: [
        {
          label: 'Rich Text Editor',
          value: 'richtext',
        },
        {
          label: 'Markdown',
          value: 'markdown',
        },
        {
          label: 'React Email Component',
          value: 'react',
        },
      ],
    },
    {
      name: 'reactComponent',
      type: 'text',
      admin: {
        description: 'React Email component name',
        condition: (data) => data.contentType === 'react',
      },
    },
    {
      name: 'audience',
      type: 'relationship',
      relationTo: 'email-audiences',
      required: true,
      admin: {
        description: 'Target audience for this campaign',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Tags for organizing and filtering campaigns',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Scheduled',
          value: 'scheduled',
        },
        {
          label: 'Sending',
          value: 'sending',
        },
        {
          label: 'Sent',
          value: 'sent',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'scheduledAt',
      type: 'date',
      admin: {
        description: 'Schedule campaign for future sending',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'resendBroadcastId',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'analytics',
      type: 'group',
      admin: {
        description: 'Campaign performance metrics',
      },
      fields: [
        {
          name: 'sentCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'deliveredCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'openedCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'clickedCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'bouncedCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'unsubscribedCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'openRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Percentage of opens',
          },
        },
        {
          name: 'clickRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Percentage of clicks',
          },
        },
      ],
    },
    {
      name: 'testEmails',
      type: 'array',
      admin: {
        description: 'Send test emails before launching campaign',
      },
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'sentAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'abTesting',
      type: 'group',
      admin: {
        description: 'A/B testing configuration',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'variants',
          type: 'array',
          admin: {
            condition: (data) => data.abTesting?.enabled,
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'subject',
              type: 'text',
              required: true,
            },
            {
              name: 'percentage',
              type: 'number',
              required: true,
              min: 0,
              max: 100,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          data.createdBy = data.createdBy || 'system';
        }
        return data;
      },
    ],
  },
};

export default EmailCampaigns;
