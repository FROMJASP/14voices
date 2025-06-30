import type { CollectionConfig } from 'payload'

const Navigation: CollectionConfig = {
  slug: 'navigation',
  labels: {
    singular: 'Navigation',
    plural: 'Navigation',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Site Builder',
    description: 'Manage site-wide navigation menus',
    defaultColumns: ['id', 'updatedAt'],
    hideAPIURL: true,
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: () => false, // Prevent deletion of navigation
  },
  // Singleton pattern - only allow one navigation record
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation === 'create') {
          const { count } = await args.req.payload.count({
            collection: 'navigation',
          })
          if (count > 0) {
            throw new Error('Only one navigation configuration is allowed')
          }
        }
        return args
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Main Navigation',
          fields: [
            {
              name: 'mainMenu',
              type: 'array',
              label: 'Main Menu Items',
              admin: {
                initCollapsed: false,
                // RowLabel component would go here
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'type',
                  type: 'select',
                  defaultValue: 'page',
                  options: [
                    { label: 'Page', value: 'page' },
                    { label: 'Custom Link', value: 'custom' },
                    { label: 'Dropdown', value: 'dropdown' },
                  ],
                  required: true,
                },
                {
                  name: 'page',
                  type: 'relationship',
                  relationTo: 'pages',
                  admin: {
                    condition: (data, siblingData) => siblingData?.type === 'page',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.type === 'custom',
                    description: 'Enter full URL including https://',
                  },
                },
                {
                  name: 'newTab',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    condition: (data, siblingData) => siblingData?.type === 'custom',
                    description: 'Open link in new tab',
                  },
                },
                {
                  name: 'subItems',
                  type: 'array',
                  label: 'Dropdown Items',
                  admin: {
                    condition: (data, siblingData) => siblingData?.type === 'dropdown',
                    // RowLabel component would go here
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'type',
                      type: 'select',
                      defaultValue: 'page',
                      options: [
                        { label: 'Page', value: 'page' },
                        { label: 'Custom Link', value: 'custom' },
                      ],
                      required: true,
                    },
                    {
                      name: 'page',
                      type: 'relationship',
                      relationTo: 'pages',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'page',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'custom',
                      },
                    },
                    {
                      name: 'description',
                      type: 'text',
                      admin: {
                        description: 'Optional description shown in mega menu',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Footer Navigation',
          fields: [
            {
              name: 'footerColumns',
              type: 'array',
              label: 'Footer Columns',
              maxRows: 4,
              admin: {
                // RowLabel component would go here
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
                      name: 'type',
                      type: 'select',
                      defaultValue: 'page',
                      options: [
                        { label: 'Page', value: 'page' },
                        { label: 'Custom Link', value: 'custom' },
                      ],
                      required: true,
                    },
                    {
                      name: 'page',
                      type: 'relationship',
                      relationTo: 'pages',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'page',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'custom',
                      },
                    },
                    {
                      name: 'newTab',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                  ],
                },
              ],
            },
            {
              name: 'footerBottom',
              type: 'group',
              label: 'Footer Bottom Section',
              fields: [
                {
                  name: 'copyrightText',
                  type: 'text',
                  defaultValue: `© ${new Date().getFullYear()} 14voices. All rights reserved.`,
                },
                {
                  name: 'legalLinks',
                  type: 'array',
                  label: 'Legal Links',
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
          ],
        },
        {
          label: 'Mobile Navigation',
          fields: [
            {
              name: 'mobileMenu',
              type: 'group',
              fields: [
                {
                  name: 'showSearch',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Show Search in Mobile Menu',
                },
                {
                  name: 'showSocial',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Show Social Links in Mobile Menu',
                },
                {
                  name: 'additionalLinks',
                  type: 'array',
                  label: 'Additional Mobile-Only Links',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'type',
                      type: 'select',
                      defaultValue: 'page',
                      options: [
                        { label: 'Page', value: 'page' },
                        { label: 'Custom Link', value: 'custom' },
                      ],
                      required: true,
                    },
                    {
                      name: 'page',
                      type: 'relationship',
                      relationTo: 'pages',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'page',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'custom',
                      },
                    },
                    {
                      name: 'icon',
                      type: 'select',
                      options: [
                        { label: 'Phone', value: 'phone' },
                        { label: 'Email', value: 'email' },
                        { label: 'Location', value: 'location' },
                        { label: 'User', value: 'user' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default Navigation