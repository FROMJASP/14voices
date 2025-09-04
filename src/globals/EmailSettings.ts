import { GlobalConfig } from 'payload';

export const EmailSettings: GlobalConfig = {
  slug: 'email-settings',
  label: 'Email Settings',
  admin: {
    group: {
      en: 'Email System',
      nl: 'Email Systeem',
    },
  },
  fields: [
    {
      name: 'dashboard',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/EmailAnalytics',
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General Settings',
          fields: [
            {
              name: 'defaultFromName',
              type: 'text',
              required: true,
              defaultValue: '14voices',
              admin: {
                description: 'Default sender name for emails',
              },
            },
            {
              name: 'defaultFromEmail',
              type: 'email',
              required: true,
              defaultValue: 'noreply@14voices.com',
              admin: {
                description: 'Default sender email address',
              },
            },
            {
              name: 'defaultReplyTo',
              type: 'email',
              admin: {
                description: 'Default reply-to email address',
              },
            },
            {
              name: 'testEmailRecipient',
              type: 'email',
              admin: {
                description: 'Email address to send test emails to (defaults to admin email)',
              },
            },
          ],
        },
        {
          label: 'Company Information',
          fields: [
            {
              name: 'companyName',
              type: 'text',
              defaultValue: '14voices',
            },
            {
              name: 'companyAddress',
              type: 'textarea',
              admin: {
                description: 'Company address for email footers',
              },
            },
            {
              name: 'companyWebsite',
              type: 'text',
              defaultValue: 'https://14voices.com',
            },
            {
              name: 'companyPhone',
              type: 'text',
            },
            {
              name: 'companySocial',
              type: 'group',
              fields: [
                {
                  name: 'twitter',
                  type: 'text',
                  admin: {
                    description: 'Twitter/X handle (without @)',
                  },
                },
                {
                  name: 'linkedin',
                  type: 'text',
                  admin: {
                    description: 'LinkedIn company page URL',
                  },
                },
                {
                  name: 'facebook',
                  type: 'text',
                  admin: {
                    description: 'Facebook page URL',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Unsubscribe Settings',
          fields: [
            {
              name: 'unsubscribeUrl',
              type: 'text',
              defaultValue: '/unsubscribe',
              admin: {
                description: 'URL for unsubscribe page',
              },
            },
            {
              name: 'unsubscribeText',
              type: 'textarea',
              defaultValue:
                'You received this email because you signed up for 14voices. If you no longer wish to receive emails from us, you can unsubscribe at any time.',
            },
          ],
        },
        {
          label: 'Email Processing',
          fields: [
            {
              name: 'batchSize',
              type: 'number',
              defaultValue: 50,
              min: 10,
              max: 100,
              admin: {
                description: 'Number of emails to process per batch',
              },
            },
            {
              name: 'retryAttempts',
              type: 'number',
              defaultValue: 3,
              min: 1,
              max: 5,
              admin: {
                description: 'Number of retry attempts for failed emails',
              },
            },
            {
              name: 'retryDelay',
              type: 'number',
              defaultValue: 300,
              admin: {
                description: 'Delay in seconds between retry attempts',
              },
            },
          ],
        },
      ],
    },
  ],
};
