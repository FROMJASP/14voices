import type { CollectionConfig } from 'payload'

const Layouts: CollectionConfig = {
  slug: 'layouts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'isDefault', 'updatedAt'],
    group: 'Site Builder',
    livePreview: {
      url: ({ data }) => {
        // Preview the layout with sample content
        return `${process.env.NEXT_PUBLIC_SERVER_URL}/layouts/${data.id}/preview`
      },
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal name for this layout',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Full Width', value: 'fullwidth' },
        { label: 'Boxed', value: 'boxed' },
        { label: 'Landing', value: 'landing' },
        { label: 'Minimal', value: 'minimal' },
      ],
      admin: {
        description: 'Layout type determines the overall structure',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Set as default layout for new pages',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header',
          fields: [
            {
              name: 'header',
              type: 'group',
              fields: [
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'standard',
                  options: [
                    { label: 'Standard', value: 'standard' },
                    { label: 'Centered', value: 'centered' },
                    { label: 'Split', value: 'split' },
                    { label: 'Transparent', value: 'transparent' },
                    { label: 'Sticky', value: 'sticky' },
                    { label: 'Hidden', value: 'hidden' },
                  ],
                },
                {
                  name: 'showLogo',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'showSearch',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'showCTA',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'ctaButton',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.showCTA === true,
                  },
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      defaultValue: 'Get Started',
                    },
                    {
                      name: 'link',
                      type: 'text',
                      defaultValue: '/contact',
                    },
                    {
                      name: 'style',
                      type: 'select',
                      defaultValue: 'primary',
                      options: [
                        { label: 'Primary', value: 'primary' },
                        { label: 'Secondary', value: 'secondary' },
                        { label: 'Outline', value: 'outline' },
                      ],
                    },
                  ],
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  admin: {
                    description: 'Hex color or CSS color name',
                  },
                },
                {
                  name: 'textColor',
                  type: 'text',
                  admin: {
                    description: 'Hex color or CSS color name',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footer',
              type: 'group',
              fields: [
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'multi-column',
                  options: [
                    { label: 'Multi-Column', value: 'multi-column' },
                    { label: 'Centered', value: 'centered' },
                    { label: 'Minimal', value: 'minimal' },
                    { label: 'Split', value: 'split' },
                    { label: 'Hidden', value: 'hidden' },
                  ],
                  admin: {
                    description: 'Choose the footer layout style',
                  },
                },
                {
                  name: 'showLogo',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Show Logo in Footer',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'Brief description or tagline for the footer',
                  },
                },
                {
                  name: 'copyrightText',
                  type: 'text',
                  defaultValue: '© {year} {siteName}. All rights reserved.',
                  admin: {
                    description: 'Use {year} for current year and {siteName} for site name',
                  },
                },
                {
                  type: 'collapsible',
                  label: 'Navigation Columns',
                  fields: [
                    {
                      name: 'navigationColumns',
                      type: 'array',
                      minRows: 0,
                      maxRows: 4,
                      admin: {
                        description: 'Add up to 4 navigation columns',
                      },
                      fields: [
                        {
                          name: 'title',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'links',
                          type: 'array',
                          fields: [
                            {
                              name: 'label',
                              type: 'text',
                              required: true,
                            },
                            {
                              name: 'linkType',
                              type: 'select',
                              defaultValue: 'internal',
                              options: [
                                { label: 'Internal Link', value: 'internal' },
                                { label: 'External Link', value: 'external' },
                              ],
                            },
                            {
                              name: 'page',
                              type: 'relationship',
                              relationTo: 'pages',
                              admin: {
                                condition: (data, siblingData) => siblingData?.linkType === 'internal',
                              },
                            },
                            {
                              name: 'url',
                              type: 'text',
                              admin: {
                                condition: (data, siblingData) => siblingData?.linkType === 'external',
                                description: 'External URL',
                              },
                            },
                            {
                              name: 'openInNewTab',
                              type: 'checkbox',
                              defaultValue: false,
                              label: 'Open in new tab',
                              admin: {
                                condition: (data, siblingData) => siblingData?.linkType === 'external',
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Contact & Social',
                  fields: [
                    {
                      name: 'showContactInfo',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Show Contact Information',
                    },
                    {
                      name: 'contactDisplay',
                      type: 'group',
                      admin: {
                        condition: (data, siblingData) => siblingData?.showContactInfo === true,
                      },
                      fields: [
                        {
                          name: 'showEmail',
                          type: 'checkbox',
                          defaultValue: true,
                          label: 'Show Email',
                        },
                        {
                          name: 'showPhone',
                          type: 'checkbox',
                          defaultValue: true,
                          label: 'Show Phone',
                        },
                        {
                          name: 'showAddress',
                          type: 'checkbox',
                          defaultValue: true,
                          label: 'Show Address',
                        },
                        {
                          name: 'showHours',
                          type: 'checkbox',
                          defaultValue: false,
                          label: 'Show Business Hours',
                        },
                      ],
                    },
                    {
                      name: 'showSocialLinks',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Show Social Media Links',
                    },
                    {
                      name: 'socialDisplay',
                      type: 'group',
                      admin: {
                        condition: (data, siblingData) => siblingData?.showSocialLinks === true,
                      },
                      fields: [
                        {
                          name: 'style',
                          type: 'select',
                          defaultValue: 'icons',
                          options: [
                            { label: 'Icons Only', value: 'icons' },
                            { label: 'Icons with Labels', value: 'icons-labels' },
                            { label: 'Labels Only', value: 'labels' },
                          ],
                        },
                        {
                          name: 'size',
                          type: 'select',
                          defaultValue: 'medium',
                          options: [
                            { label: 'Small', value: 'small' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'Large', value: 'large' },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Newsletter',
                  fields: [
                    {
                      name: 'newsletter',
                      type: 'group',
                      fields: [
                        {
                          name: 'enabled',
                          type: 'checkbox',
                          defaultValue: false,
                          label: 'Enable Newsletter Signup',
                        },
                        {
                          name: 'title',
                          type: 'text',
                          defaultValue: 'Subscribe to Our Newsletter',
                          admin: {
                            condition: (data, siblingData) => siblingData?.enabled === true,
                          },
                        },
                        {
                          name: 'description',
                          type: 'textarea',
                          admin: {
                            condition: (data, siblingData) => siblingData?.enabled === true,
                            description: 'Brief description for the newsletter signup',
                          },
                        },
                        {
                          name: 'placeholder',
                          type: 'text',
                          defaultValue: 'Enter your email address',
                          admin: {
                            condition: (data, siblingData) => siblingData?.enabled === true,
                          },
                        },
                        {
                          name: 'buttonText',
                          type: 'text',
                          defaultValue: 'Subscribe',
                          admin: {
                            condition: (data, siblingData) => siblingData?.enabled === true,
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Legal Links',
                  fields: [
                    {
                      name: 'legalLinks',
                      type: 'array',
                      admin: {
                        description: 'Privacy Policy, Terms of Service, etc.',
                      },
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'page',
                          type: 'relationship',
                          relationTo: 'pages',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Styling',
                  fields: [
                    {
                      name: 'backgroundColor',
                      type: 'text',
                      defaultValue: '#1a1a1a',
                      admin: {
                        description: 'Background color (hex, rgb, or CSS color name)',
                      },
                    },
                    {
                      name: 'textColor',
                      type: 'text',
                      defaultValue: '#ffffff',
                      admin: {
                        description: 'Text color (hex, rgb, or CSS color name)',
                      },
                    },
                    {
                      name: 'linkColor',
                      type: 'text',
                      defaultValue: '#e0e0e0',
                      admin: {
                        description: 'Link color (hex, rgb, or CSS color name)',
                      },
                    },
                    {
                      name: 'linkHoverColor',
                      type: 'text',
                      defaultValue: '#ffffff',
                      admin: {
                        description: 'Link hover color (hex, rgb, or CSS color name)',
                      },
                    },
                    {
                      name: 'borderTop',
                      type: 'checkbox',
                      defaultValue: false,
                      label: 'Show Top Border',
                    },
                    {
                      name: 'borderColor',
                      type: 'text',
                      defaultValue: '#333333',
                      admin: {
                        condition: (data, siblingData) => siblingData?.borderTop === true,
                        description: 'Border color (hex, rgb, or CSS color name)',
                      },
                    },
                    {
                      name: 'padding',
                      type: 'select',
                      defaultValue: 'medium',
                      options: [
                        { label: 'Small', value: 'small' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Large', value: 'large' },
                      ],
                    },
                  ],
                },
                {
                  name: 'showBackToTop',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Show "Back to Top" Button',
                },
                {
                  name: 'footerBlocks',
                  type: 'relationship',
                  relationTo: 'blocks',
                  hasMany: true,
                  admin: {
                    description: 'Select reusable footer blocks to include',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Sidebar',
          fields: [
            {
              name: 'sidebar',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'position',
                  type: 'select',
                  defaultValue: 'right',
                  options: [
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' },
                  ],
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'width',
                  type: 'select',
                  defaultValue: 'medium',
                  options: [
                    { label: 'Narrow (250px)', value: 'narrow' },
                    { label: 'Medium (300px)', value: 'medium' },
                    { label: 'Wide (350px)', value: 'wide' },
                  ],
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'sticky',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                    description: 'Make sidebar sticky on scroll',
                  },
                },
                {
                  name: 'widgets',
                  type: 'array',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Search', value: 'search' },
                        { label: 'Recent Posts', value: 'recentPosts' },
                        { label: 'Categories', value: 'categories' },
                        { label: 'Tags', value: 'tags' },
                        { label: 'Newsletter', value: 'newsletter' },
                        { label: 'Social Links', value: 'social' },
                        { label: 'Custom HTML', value: 'custom' },
                        { label: 'Navigation', value: 'navigation' },
                      ],
                    },
                    {
                      name: 'title',
                      type: 'text',
                    },
                    {
                      name: 'customContent',
                      type: 'textarea',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'custom',
                        description: 'HTML content for custom widget',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Advanced',
          fields: [
            {
              name: 'containerWidth',
              type: 'select',
              defaultValue: 'standard',
              options: [
                { label: 'Standard (1280px)', value: 'standard' },
                { label: 'Wide (1536px)', value: 'wide' },
                { label: 'Full Width', value: 'full' },
                { label: 'Narrow (1024px)', value: 'narrow' },
              ],
            },
            {
              name: 'spacing',
              type: 'group',
              fields: [
                {
                  name: 'headerPadding',
                  type: 'select',
                  defaultValue: 'medium',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Small', value: 'small' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Large', value: 'large' },
                  ],
                },
                {
                  name: 'contentPadding',
                  type: 'select',
                  defaultValue: 'medium',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Small', value: 'small' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Large', value: 'large' },
                  ],
                },
                {
                  name: 'footerPadding',
                  type: 'select',
                  defaultValue: 'medium',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Small', value: 'small' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Large', value: 'large' },
                  ],
                },
              ],
            },
            {
              name: 'customCSS',
              type: 'textarea',
              admin: {
                description: 'Custom CSS for this layout',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Ensure only one default layout
        if (data.isDefault && operation === 'create') {
          await req.payload.update({
            collection: 'layouts',
            where: {
              isDefault: {
                equals: true,
              },
            },
            data: {
              isDefault: false,
            },
          })
        }
        return data
      },
    ],
  },
}

export default Layouts