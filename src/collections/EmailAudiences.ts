import { CollectionConfig } from 'payload';

export const EmailAudiences: CollectionConfig = {
  slug: 'email-audiences',
  admin: {
    useAsTitle: 'name',
    group: 'Email System',
    defaultColumns: ['name', 'type', 'contactCount', 'active'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Audience name (e.g., "Newsletter Subscribers", "VIP Clients")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Describe the purpose and criteria for this audience',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'static',
      options: [
        {
          label: 'Static List',
          value: 'static',
        },
        {
          label: 'Dynamic Segment',
          value: 'dynamic',
        },
        {
          label: 'All Contacts',
          value: 'all',
        },
      ],
    },
    {
      name: 'resendAudienceId',
      type: 'text',
      admin: {
        description: 'Resend Audience ID for syncing',
        readOnly: true,
      },
    },
    {
      name: 'contacts',
      type: 'relationship',
      relationTo: 'email-contacts',
      hasMany: true,
      admin: {
        condition: (data) => data.type === 'static',
        description: 'Manually selected contacts for this audience',
      },
    },
    {
      name: 'segmentRules',
      type: 'group',
      admin: {
        condition: (data) => data.type === 'dynamic',
        description: 'Dynamic segmentation rules',
      },
      fields: [
        {
          name: 'rules',
          type: 'array',
          fields: [
            {
              name: 'field',
              type: 'select',
              required: true,
              options: [
                {
                  label: 'Tags',
                  value: 'tags',
                },
                {
                  label: 'Location',
                  value: 'location',
                },
                {
                  label: 'Engagement Level',
                  value: 'engagement',
                },
                {
                  label: 'Sign Up Date',
                  value: 'signupDate',
                },
                {
                  label: 'Last Activity',
                  value: 'lastActivity',
                },
                {
                  label: 'Custom Field',
                  value: 'custom',
                },
              ],
            },
            {
              name: 'operator',
              type: 'select',
              required: true,
              options: [
                {
                  label: 'Contains',
                  value: 'contains',
                },
                {
                  label: 'Does not contain',
                  value: 'not_contains',
                },
                {
                  label: 'Equals',
                  value: 'equals',
                },
                {
                  label: 'Not equals',
                  value: 'not_equals',
                },
                {
                  label: 'Greater than',
                  value: 'greater_than',
                },
                {
                  label: 'Less than',
                  value: 'less_than',
                },
                {
                  label: 'Is empty',
                  value: 'is_empty',
                },
                {
                  label: 'Is not empty',
                  value: 'is_not_empty',
                },
              ],
            },
            {
              name: 'value',
              type: 'text',
              admin: {
                condition: (data, siblingData) =>
                  siblingData?.operator !== 'is_empty' && siblingData?.operator !== 'is_not_empty',
              },
            },
            {
              name: 'customField',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData?.field === 'custom',
                description: 'Custom field name',
              },
            },
          ],
        },
        {
          name: 'logic',
          type: 'radio',
          defaultValue: 'all',
          options: [
            {
              label: 'Match all rules (AND)',
              value: 'all',
            },
            {
              label: 'Match any rule (OR)',
              value: 'any',
            },
          ],
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Tags for organizing audiences',
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
      name: 'contactCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of contacts in this audience',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this audience is active and can be used',
      },
    },
    {
      name: 'syncStatus',
      type: 'group',
      admin: {
        description: 'Resend sync status',
      },
      fields: [
        {
          name: 'lastSyncedAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'syncError',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'statistics',
      type: 'group',
      admin: {
        description: 'Audience engagement statistics',
      },
      fields: [
        {
          name: 'avgOpenRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Average open rate percentage',
          },
        },
        {
          name: 'avgClickRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Average click rate percentage',
          },
        },
        {
          name: 'lastCampaignDate',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create' || operation === 'update') {
          // TODO: Sync with Resend Audiences API
          // This will be implemented in the API routes
        }
        return doc;
      },
    ],
  },
};

export default EmailAudiences;
