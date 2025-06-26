import { CollectionConfig } from 'payload'

export const EmailComponents: CollectionConfig = {
  slug: 'email-components',
  admin: {
    useAsTitle: 'name',
    group: 'Email System',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Component name (e.g., "Default Footer", "Holiday Header")',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Header', value: 'header' },
        { label: 'Footer', value: 'footer' },
        { label: 'Signature', value: 'signature' },
        { label: 'CTA Button', value: 'cta' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Component content - can include variables like {{companyAddress}}',
      },
    },
    {
      name: 'plainTextContent',
      type: 'textarea',
      admin: {
        description: 'Plain text version for text-only emails',
      },
    },
    {
      name: 'variables',
      type: 'array',
      admin: {
        description: 'Variables used in this component',
      },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'defaultValue',
          type: 'text',
        },
      ],
    },
  ],
}

export default EmailComponents