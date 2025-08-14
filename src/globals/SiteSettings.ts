import type { GlobalConfig } from 'payload';

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
                description:
                  'Upload a custom favicon (recommended: 32x32px SVG or PNG). If no favicon is uploaded, a default dark "14" icon will be used.',
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
          label: 'Branding',
          fields: [
            {
              name: 'branding',
              type: 'group',
              fields: [
                {
                  name: 'logoType',
                  type: 'select',
                  defaultValue: 'text',
                  options: [
                    { label: 'Text Logo', value: 'text' },
                    { label: 'Image Logo', value: 'image' },
                  ],
                  admin: {
                    description: 'Choose between text logo or image logo',
                  },
                },
                {
                  name: 'logoText',
                  type: 'text',
                  defaultValue: 'FourteenVoices',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.logoType === 'text',
                    description: 'Text to display as logo',
                  },
                },
                {
                  name: 'logoImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.logoType === 'image',
                    description:
                      'Image to use as logo (recommended: SVG or PNG with transparent background)',
                  },
                },
                {
                  name: 'logoImageDark',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.logoType === 'image',
                    description:
                      'Optional: Different logo for dark mode (if not provided, same logo will be used)',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Navigation',
          fields: [
            {
              name: 'navigation',
              type: 'group',
              fields: [
                {
                  name: 'mainMenuItems',
                  type: 'array',
                  label: 'Main Menu Items',
                  admin: {
                    description: 'Navigation items to display in the main menu',
                    initCollapsed: false,
                  },
                  defaultValue: [
                    { label: 'Voice-overs', url: '#voiceovers', hasDropdown: true },
                    { label: 'Prijzen', url: '/prijzen', hasDropdown: false },
                  ],
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Display text for the menu item',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'URL path (e.g., /voiceovers) or anchor (#voiceovers)',
                      },
                    },
                    {
                      name: 'hasDropdown',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description:
                          'Show dropdown arrow (dropdown content can be configured later)',
                      },
                    },
                    {
                      name: 'openInNewTab',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description: 'Open link in a new tab/window',
                      },
                    },
                  ],
                },
                {
                  name: 'loginText',
                  type: 'text',
                  defaultValue: 'Login',
                  admin: {
                    description: 'Text for the login link',
                  },
                },
                {
                  name: 'loginUrl',
                  type: 'text',
                  defaultValue: '/login',
                  admin: {
                    description: 'URL for the login link',
                  },
                },
                {
                  name: 'ctaButtonText',
                  type: 'text',
                  defaultValue: 'Mijn omgeving',
                  admin: {
                    description: 'Text for the call-to-action button',
                  },
                },
                {
                  name: 'ctaButtonUrl',
                  type: 'text',
                  defaultValue: '/dashboard',
                  admin: {
                    description: 'URL for the call-to-action button',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Top Bar',
          fields: [
            {
              name: 'topBar',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Enable Top Bar',
                  admin: {
                    description: 'Show the top bar with contact details and quick links',
                  },
                },
                {
                  name: 'whatsappNumber',
                  type: 'text',
                  defaultValue: '+31 6 12345678',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description:
                      'WhatsApp number for contact (include country code). Default: +31 6 12345678',
                  },
                },
                {
                  name: 'whatsappTooltip',
                  type: 'group',
                  label: 'WhatsApp Tooltip',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true && siblingData?.whatsappNumber,
                    description: 'Configure the tooltip that appears when hovering over the WhatsApp number',
                  },
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Enable Tooltip',
                      admin: {
                        description: 'Show a tooltip when hovering over the WhatsApp number',
                      },
                    },
                    {
                      name: 'title',
                      type: 'text',
                      defaultValue: 'Stuur ons een WhatsApp',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.enabled === true,
                        description: 'Title text for the tooltip. Default: "Stuur ons een WhatsApp"',
                      },
                    },
                    {
                      name: 'message',
                      type: 'textarea',
                      defaultValue: 'We zijn vaak in de studio aan het werk. Stuur ons eerst een WhatsApp-bericht, dan kunnen we je zo snel mogelijk terugbellen.',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.enabled === true,
                        description: 'Message text for the tooltip. Default: "We zijn vaak in de studio aan het werk. Stuur ons eerst een WhatsApp-bericht, dan kunnen we je zo snel mogelijk terugbellen."',
                      },
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.enabled === true,
                        description: 'Optional image to show in the tooltip (recommended: 80x80px)',
                      },
                    },
                  ],
                },
                {
                  name: 'email',
                  type: 'email',
                  defaultValue: 'casting@14voices.com',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description: 'Primary contact email address. Default: casting@14voices.com',
                  },
                },
                {
                  name: 'quickLinks',
                  type: 'array',
                  label: 'Quick Links',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description: 'Navigation links to display in the top bar. Default links: "Veelgestelde vragen" (/veelgestelde-vragen) and "Blog" (/blog)',
                    initCollapsed: false,
                  },
                  defaultValue: [
                    { label: 'Veelgestelde vragen', url: '/veelgestelde-vragen' },
                    { label: 'Blog', url: '/blog' },
                  ],
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Display text for the link',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'URL path (e.g., /veelgestelde-vragen) or external URL',
                      },
                    },
                    {
                      name: 'openInNewTab',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description: 'Open link in a new tab/window',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            {
              name: 'faq',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Enable FAQ Section',
                  admin: {
                    description: 'Show the FAQ section on the homepage',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'Veelgestelde vragen',
                  label: 'Section Title',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description: 'Title displayed above the FAQ section',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  defaultValue: 'Vind snel antwoorden op de meest gestelde vragen over onze voice-over diensten.',
                  label: 'Section Description',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description: 'Optional description text below the title',
                  },
                },
                {
                  name: 'showCategories',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Show Category Filter',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description: 'Allow visitors to filter FAQ items by category',
                  },
                },
                {
                  name: 'itemsToShow',
                  type: 'number',
                  defaultValue: 10,
                  min: 1,
                  max: 50,
                  label: 'Items to Display',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description: 'Maximum number of FAQ items to display (1-50)',
                  },
                },
                {
                  name: 'manageFAQs',
                  type: 'ui',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    components: {
                      Field: '@/components/admin/ui/FAQManageField#FAQManageField'
                    },
                  },
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
                    description:
                      '⚠️ WARNING: Disabling this will remove search functionality from your entire website. Visitors will not be able to search for content.',
                    condition: (_data, siblingData) => {
                      if (
                        siblingData?.enableSearch === false &&
                        siblingData?.enableSearch !== undefined
                      ) {
                        return confirm(
                          'Are you absolutely sure you want to disable site search? This will remove all search functionality from your website.'
                        );
                      }
                      return true;
                    },
                  },
                },
                {
                  name: 'enableBlog',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Enable Blog',
                  admin: {
                    description:
                      '⚠️ WARNING: Disabling this will hide all blog posts and the blog section from your website. This affects SEO and content visibility.',
                    condition: (_data, siblingData) => {
                      if (
                        siblingData?.enableBlog === false &&
                        siblingData?.enableBlog !== undefined
                      ) {
                        return confirm(
                          'Are you absolutely sure you want to disable the blog? This will hide all blog content from your website.'
                        );
                      }
                      return true;
                    },
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
                  defaultValue: 'We zijn zo terug!',
                  label: 'Title',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.maintenanceMode === true,
                    description: 'Main heading for the maintenance page',
                  },
                },
                {
                  name: 'maintenanceMessage',
                  type: 'textarea',
                  defaultValue:
                    'We voeren momenteel gepland onderhoud uit. We zijn zo weer online.',
                  label: 'Message',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.maintenanceMode === true,
                    description: 'Main message to show during maintenance',
                  },
                },
                {
                  name: 'maintenanceContactLabel',
                  type: 'text',
                  defaultValue: 'Contact nodig?',
                  label: 'Contact Label',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.maintenanceMode === true,
                    description: 'Label above contact email',
                  },
                },
                {
                  name: 'showContactEmail',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Show Contact Email',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.maintenanceMode === true,
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
};
