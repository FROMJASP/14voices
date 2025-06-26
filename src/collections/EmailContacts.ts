import { CollectionConfig } from 'payload'

export const EmailContacts: CollectionConfig = {
  slug: 'email-contacts',
  admin: {
    useAsTitle: 'email',
    group: 'Email System',
    defaultColumns: ['email', 'firstName', 'lastName', 'subscribed', 'tags'],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        description: 'Contact email address',
      },
    },
    {
      name: 'firstName',
      type: 'text',
      admin: {
        description: 'Contact first name',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      admin: {
        description: 'Contact last name',
      },
    },
    {
      name: 'resendContactId',
      type: 'text',
      admin: {
        description: 'Resend Contact ID',
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Link to existing user account if applicable',
      },
    },
    {
      name: 'subscribed',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether the contact is subscribed to emails',
      },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      admin: {
        condition: (data) => !data.subscribed,
        readOnly: true,
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Tags for segmentation and organization',
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
      name: 'customFields',
      type: 'json',
      admin: {
        description: 'Custom data fields for personalization',
      },
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'country',
          type: 'text',
        },
        {
          name: 'state',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'timezone',
          type: 'text',
          admin: {
            description: 'Timezone for optimal send times',
          },
        },
      ],
    },
    {
      name: 'preferences',
      type: 'group',
      admin: {
        description: 'Email preferences',
      },
      fields: [
        {
          name: 'frequency',
          type: 'select',
          defaultValue: 'all',
          options: [
            {
              label: 'All emails',
              value: 'all',
            },
            {
              label: 'Weekly digest',
              value: 'weekly',
            },
            {
              label: 'Monthly digest',
              value: 'monthly',
            },
            {
              label: 'Important only',
              value: 'important',
            },
          ],
        },
        {
          name: 'categories',
          type: 'array',
          admin: {
            description: 'Subscribed email categories',
          },
          fields: [
            {
              name: 'category',
              type: 'select',
              options: [
                {
                  label: 'Newsletter',
                  value: 'newsletter',
                },
                {
                  label: 'Product Updates',
                  value: 'product',
                },
                {
                  label: 'Promotions',
                  value: 'promotions',
                },
                {
                  label: 'Events',
                  value: 'events',
                },
                {
                  label: 'Educational',
                  value: 'educational',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'engagement',
      type: 'group',
      admin: {
        description: 'Engagement metrics',
        readOnly: true,
      },
      fields: [
        {
          name: 'totalSent',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'totalOpened',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'totalClicked',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'lastOpenedAt',
          type: 'date',
        },
        {
          name: 'lastClickedAt',
          type: 'date',
        },
        {
          name: 'engagementScore',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Calculated engagement score (0-100)',
          },
        },
      ],
    },
    {
      name: 'source',
      type: 'group',
      admin: {
        description: 'Contact source information',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'manual',
          options: [
            {
              label: 'Manual Import',
              value: 'manual',
            },
            {
              label: 'Website Signup',
              value: 'website',
            },
            {
              label: 'API',
              value: 'api',
            },
            {
              label: 'CSV Import',
              value: 'csv',
            },
            {
              label: 'Integration',
              value: 'integration',
            },
          ],
        },
        {
          name: 'detail',
          type: 'text',
          admin: {
            description: 'Additional source details',
          },
        },
        {
          name: 'signupDate',
          type: 'date',
          defaultValue: () => new Date(),
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Bounced',
          value: 'bounced',
        },
        {
          label: 'Complained',
          value: 'complained',
        },
        {
          label: 'Suppressed',
          value: 'suppressed',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this contact',
      },
    },
  ],
  indexes: [
    {
      fields: ['email'],
    },
    {
      fields: ['engagement.engagementScore'],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (data.firstName && data.lastName && !data.customFields?.fullName) {
          if (!data.customFields) data.customFields = {}
          data.customFields.fullName = `${data.firstName} ${data.lastName}`
        }
        
        if (operation === 'update' && data.subscribed === false && !data.unsubscribedAt) {
          data.unsubscribedAt = new Date()
        }
        
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create' || operation === 'update') {
          // TODO: Sync with Resend Contacts API
        }
        return doc
      },
    ],
  },
}

export default EmailContacts