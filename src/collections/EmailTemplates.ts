import { CollectionConfig } from 'payload';

export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
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
        description: 'Template name (e.g., "Welcome Email", "Order Confirmation")',
      },
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique key for programmatic access (e.g., "welcome-email")',
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      admin: {
        description: 'Email subject line - supports variables like {{userName}}',
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
      admin: {
        description: 'Override default sender name',
      },
    },
    {
      name: 'fromEmail',
      type: 'text',
      admin: {
        description: 'Override default sender email',
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
      name: 'header',
      type: 'relationship',
      relationTo: 'email-components',
      filterOptions: {
        type: { equals: 'header' },
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Email body content - supports variables and Handlebars syntax',
      },
    },
    {
      name: 'plainTextContent',
      type: 'textarea',
      admin: {
        description: 'Plain text version for text-only email clients',
      },
    },
    {
      name: 'footer',
      type: 'relationship',
      relationTo: 'email-components',
      filterOptions: {
        type: { equals: 'footer' },
      },
    },
    {
      name: 'variables',
      type: 'array',
      admin: {
        description: 'Variables available in this template',
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
          name: 'required',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'defaultValue',
          type: 'text',
        },
      ],
    },
    {
      name: 'testData',
      type: 'json',
      admin: {
        description: 'Test data for preview (JSON format)',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this template is active and can be used',
      },
    },
    {
      name: 'preview',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/EmailPreview',
        },
      },
    },
  ],
};

export default EmailTemplates;
