import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: '14voices',
              admin: {
                description: 'The name of your website',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              admin: {
                description: 'A short tagline or description',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Site logo for header',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Favicon (16x16 or 32x32 px)',
              },
            },
            {
              name: 'siteUrl',
              type: 'text',
              required: true,
              admin: {
                description: 'Full site URL (e.g., https://14voices.com)',
              },
            },
            {
              name: 'language',
              type: 'select',
              defaultValue: 'en',
              options: [
                { label: 'English', value: 'en' },
                { label: 'Spanish', value: 'es' },
                { label: 'French', value: 'fr' },
                { label: 'German', value: 'de' },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contact',
              type: 'group',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  admin: {
                    description: 'Primary contact email',
                  },
                },
                {
                  name: 'phone',
                  type: 'text',
                  admin: {
                    description: 'Primary contact phone',
                  },
                },
                {
                  name: 'address',
                  type: 'group',
                  fields: [
                    {
                      name: 'street',
                      type: 'text',
                    },
                    {
                      name: 'city',
                      type: 'text',
                    },
                    {
                      name: 'state',
                      type: 'text',
                    },
                    {
                      name: 'zip',
                      type: 'text',
                    },
                    {
                      name: 'country',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'hours',
                  type: 'textarea',
                  admin: {
                    description: 'Business hours (one per line)',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Social Media',
          fields: [
            {
              name: 'socialLinks',
              type: 'group',
              fields: [
                {
                  name: 'facebook',
                  type: 'text',
                  admin: {
                    description: 'Facebook page URL',
                  },
                },
                {
                  name: 'twitter',
                  type: 'text',
                  admin: {
                    description: 'Twitter/X profile URL',
                  },
                },
                {
                  name: 'instagram',
                  type: 'text',
                  admin: {
                    description: 'Instagram profile URL',
                  },
                },
                {
                  name: 'linkedin',
                  type: 'text',
                  admin: {
                    description: 'LinkedIn profile URL',
                  },
                },
                {
                  name: 'youtube',
                  type: 'text',
                  admin: {
                    description: 'YouTube channel URL',
                  },
                },
                {
                  name: 'tiktok',
                  type: 'text',
                  admin: {
                    description: 'TikTok profile URL',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'defaultSeo',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'Default page title template (e.g., %s | 14voices)',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'Default meta description',
                  },
                },
                {
                  name: 'keywords',
                  type: 'array',
                  admin: {
                    description: 'Default keywords',
                  },
                  fields: [
                    {
                      name: 'keyword',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Default social sharing image',
                  },
                },
              ],
            },
            {
              name: 'openGraph',
              type: 'group',
              fields: [
                {
                  name: 'siteName',
                  type: 'text',
                  admin: {
                    description: 'OG site name',
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  defaultValue: 'website',
                  options: [
                    { label: 'Website', value: 'website' },
                    { label: 'Article', value: 'article' },
                  ],
                },
              ],
            },
            {
              name: 'twitterCard',
              type: 'group',
              fields: [
                {
                  name: 'cardType',
                  type: 'select',
                  defaultValue: 'summary_large_image',
                  options: [
                    { label: 'Summary', value: 'summary' },
                    { label: 'Summary Large Image', value: 'summary_large_image' },
                  ],
                },
                {
                  name: 'handle',
                  type: 'text',
                  admin: {
                    description: 'Twitter handle (e.g., @14voices)',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            {
              name: 'analytics',
              type: 'group',
              fields: [
                {
                  name: 'googleAnalyticsId',
                  type: 'text',
                  admin: {
                    description: 'Google Analytics 4 Measurement ID (e.g., G-XXXXXXXXXX)',
                  },
                },
                {
                  name: 'googleTagManagerId',
                  type: 'text',
                  admin: {
                    description: 'Google Tag Manager ID (e.g., GTM-XXXXXX)',
                  },
                },
                {
                  name: 'facebookPixelId',
                  type: 'text',
                  admin: {
                    description: 'Facebook Pixel ID',
                  },
                },
                {
                  name: 'customScripts',
                  type: 'group',
                  fields: [
                    {
                      name: 'headScripts',
                      type: 'textarea',
                      admin: {
                        description: 'Scripts to inject in <head>',
                      },
                    },
                    {
                      name: 'bodyScripts',
                      type: 'textarea',
                      admin: {
                        description: 'Scripts to inject before </body>',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Features',
          fields: [
            {
              name: 'features',
              type: 'group',
              fields: [
                {
                  name: 'enableSearch',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Enable Site Search',
                  admin: {
                    components: {
                      Field: './components/admin/CriticalFeatureField#CriticalFeatureField',
                    },
                  },
                  custom: {
                    warningMessage: 'Disabling this will remove search functionality from your entire website. Visitors will not be able to search for content.',
                  },
                },
                {
                  name: 'enableBlog',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Enable Blog',
                  admin: {
                    components: {
                      Field: './components/admin/CriticalFeatureField#CriticalFeatureField',
                    },
                  },
                  custom: {
                    warningMessage: 'Disabling this will hide all blog posts and the blog section from your website. This affects SEO and content visibility.',
                  },
                },
                {
                  name: 'maintenanceMode',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Enable Maintenance Mode',
                },
                {
                  name: 'maintenanceTitle',
                  type: 'text',
                  defaultValue: "We zijn zo terug!",
                  label: 'Title',
                  admin: {
                    condition: (data, siblingData) => siblingData?.maintenanceMode === true,
                    description: 'Main heading for the maintenance page',
                  },
                },
                {
                  name: 'maintenanceMessage',
                  type: 'textarea',
                  defaultValue: "We voeren momenteel gepland onderhoud uit. We zijn zo weer online.",
                  label: 'Message',
                  admin: {
                    condition: (data, siblingData) => siblingData?.maintenanceMode === true,
                    description: 'Main message to show during maintenance',
                  },
                },
                {
                  name: 'maintenanceContactLabel',
                  type: 'text',
                  defaultValue: 'Contact nodig?',
                  label: 'Contact Label',
                  admin: {
                    condition: (data, siblingData) => siblingData?.maintenanceMode === true,
                    description: 'Label above contact email',
                  },
                },
                {
                  name: 'showContactEmail',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Show Contact Email',
                  admin: {
                    condition: (data, siblingData) => siblingData?.maintenanceMode === true,
                  },
                },
                {
                  name: 'maintenancePreview',
                  type: 'ui',
                  admin: {
                    components: {
                      Field: './components/admin/MaintenanceModePreview#MaintenanceModePreview',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}