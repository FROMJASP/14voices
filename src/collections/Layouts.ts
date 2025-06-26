import type { CollectionConfig } from 'payload'

const Layouts: CollectionConfig = {
  slug: 'layouts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'isDefault', 'updatedAt'],
    group: 'Site Builder',
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
                  defaultValue: 'standard',
                  options: [
                    { label: 'Standard', value: 'standard' },
                    { label: 'Minimal', value: 'minimal' },
                    { label: 'Centered', value: 'centered' },
                    { label: 'Split', value: 'split' },
                    { label: 'Hidden', value: 'hidden' },
                  ],
                },
                {
                  name: 'showLogo',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'showSocial',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'showNewsletter',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'newsletterHeading',
                  type: 'text',
                  defaultValue: 'Subscribe to our newsletter',
                  admin: {
                    condition: (data, siblingData) => siblingData?.showNewsletter === true,
                  },
                },
                {
                  name: 'newsletterText',
                  type: 'textarea',
                  defaultValue: 'Get the latest updates and news delivered to your inbox.',
                  admin: {
                    condition: (data, siblingData) => siblingData?.showNewsletter === true,
                  },
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
                {
                  name: 'showBackToTop',
                  type: 'checkbox',
                  defaultValue: true,
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