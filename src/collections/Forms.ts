import type { CollectionConfig } from 'payload';

const Forms: CollectionConfig = {
  slug: 'forms',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'submissions', 'status', 'updatedAt'],
    group: 'Edit Forms',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin' || user?.role === 'editor') return true;
      // Public can read forms for submission
      return {
        status: {
          equals: 'active',
        },
      };
    },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal form name',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Unique identifier for this form',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Form description shown to users',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      required: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Fields',
          fields: [
            {
              name: 'fields',
              type: 'array',
              required: true,
              minRows: 1,
              admin: {
                // RowLabel component would go here
              },
              fields: [
                {
                  name: 'fieldType',
                  type: 'select',
                  required: true,
                  defaultValue: 'text',
                  options: [
                    { label: 'Text', value: 'text' },
                    { label: 'Email', value: 'email' },
                    { label: 'Phone', value: 'tel' },
                    { label: 'Number', value: 'number' },
                    { label: 'Textarea', value: 'textarea' },
                    { label: 'Select', value: 'select' },
                    { label: 'Radio', value: 'radio' },
                    { label: 'Checkbox', value: 'checkbox' },
                    { label: 'Checkbox Group', value: 'checkboxGroup' },
                    { label: 'Date', value: 'date' },
                    { label: 'Time', value: 'time' },
                    { label: 'File Upload', value: 'file' },
                    { label: 'Hidden', value: 'hidden' },
                    { label: 'Heading', value: 'heading' },
                    { label: 'Paragraph', value: 'paragraph' },
                  ],
                },
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Field name (no spaces, used in code)',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  admin: {
                    condition: (_data, siblingData) =>
                      siblingData?.fieldType !== 'hidden' &&
                      siblingData?.fieldType !== 'heading' &&
                      siblingData?.fieldType !== 'paragraph',
                    description: 'Label shown to users',
                  },
                },
                {
                  name: 'placeholder',
                  type: 'text',
                  admin: {
                    condition: (_data, siblingData) =>
                      ['text', 'email', 'tel', 'number', 'textarea'].includes(
                        siblingData?.fieldType
                      ),
                  },
                },
                {
                  name: 'helpText',
                  type: 'text',
                  admin: {
                    condition: (_data, siblingData) =>
                      siblingData?.fieldType !== 'heading' &&
                      siblingData?.fieldType !== 'paragraph',
                    description: 'Help text shown below the field',
                  },
                },
                {
                  name: 'required',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    condition: (_data, siblingData) =>
                      siblingData?.fieldType !== 'hidden' &&
                      siblingData?.fieldType !== 'heading' &&
                      siblingData?.fieldType !== 'paragraph',
                  },
                },
                {
                  name: 'validation',
                  type: 'group',
                  admin: {
                    condition: (_data, siblingData) =>
                      ['text', 'email', 'tel', 'number', 'textarea'].includes(
                        siblingData?.fieldType
                      ),
                  },
                  fields: [
                    {
                      name: 'minLength',
                      type: 'number',
                      admin: {
                        condition: (_data, siblingData) =>
                          ['text', 'textarea'].includes(siblingData?.fieldType),
                      },
                    },
                    {
                      name: 'maxLength',
                      type: 'number',
                      admin: {
                        condition: (_data, siblingData) =>
                          ['text', 'textarea'].includes(siblingData?.fieldType),
                      },
                    },
                    {
                      name: 'min',
                      type: 'number',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.fieldType === 'number',
                      },
                    },
                    {
                      name: 'max',
                      type: 'number',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.fieldType === 'number',
                      },
                    },
                    {
                      name: 'pattern',
                      type: 'text',
                      admin: {
                        description: 'Regular expression pattern',
                      },
                    },
                    {
                      name: 'customError',
                      type: 'text',
                      admin: {
                        description: 'Custom validation error message',
                      },
                    },
                  ],
                },
                {
                  name: 'options',
                  type: 'array',
                  admin: {
                    condition: (_data, siblingData) =>
                      ['select', 'radio', 'checkboxGroup'].includes(siblingData?.fieldType),
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'defaultValue',
                  type: 'text',
                  admin: {
                    condition: (_data, siblingData) =>
                      siblingData?.fieldType !== 'file' &&
                      siblingData?.fieldType !== 'heading' &&
                      siblingData?.fieldType !== 'paragraph',
                  },
                },
                {
                  name: 'content',
                  type: 'textarea',
                  admin: {
                    condition: (_data, siblingData) =>
                      siblingData?.fieldType === 'heading' ||
                      siblingData?.fieldType === 'paragraph',
                    description: 'Content for heading or paragraph',
                  },
                },
                {
                  name: 'width',
                  type: 'select',
                  defaultValue: 'full',
                  options: [
                    { label: 'Full Width', value: 'full' },
                    { label: 'Half Width', value: 'half' },
                    { label: 'Third Width', value: 'third' },
                    { label: 'Two Thirds', value: 'two-thirds' },
                  ],
                },
                {
                  name: 'conditionalLogic',
                  type: 'group',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                    {
                      name: 'showIf',
                      type: 'select',
                      options: [
                        { label: 'All conditions met', value: 'all' },
                        { label: 'Any condition met', value: 'any' },
                      ],
                      defaultValue: 'all',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.enabled === true,
                      },
                    },
                    {
                      name: 'conditions',
                      type: 'array',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.enabled === true,
                      },
                      fields: [
                        {
                          name: 'field',
                          type: 'text',
                          admin: {
                            description: 'Field name to check',
                          },
                        },
                        {
                          name: 'operator',
                          type: 'select',
                          options: [
                            { label: 'Equals', value: 'equals' },
                            { label: 'Not Equals', value: 'not_equals' },
                            { label: 'Contains', value: 'contains' },
                            { label: 'Is Empty', value: 'is_empty' },
                            { label: 'Is Not Empty', value: 'is_not_empty' },
                          ],
                        },
                        {
                          name: 'value',
                          type: 'text',
                          admin: {
                            condition: (_data, siblingData) =>
                              !['is_empty', 'is_not_empty'].includes(siblingData?.operator),
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'settings',
              type: 'group',
              fields: [
                {
                  name: 'submitButton',
                  type: 'group',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      defaultValue: 'Submit',
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
                    {
                      name: 'position',
                      type: 'select',
                      defaultValue: 'left',
                      options: [
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                      ],
                    },
                  ],
                },
                {
                  name: 'successMessage',
                  type: 'textarea',
                  defaultValue: 'Thank you for your submission!',
                  admin: {
                    description: 'Message shown after successful submission',
                  },
                },
                {
                  name: 'errorMessage',
                  type: 'textarea',
                  defaultValue: 'There was an error submitting the form. Please try again.',
                  admin: {
                    description: 'Message shown if submission fails',
                  },
                },
                {
                  name: 'redirectUrl',
                  type: 'text',
                  admin: {
                    description: 'Optional URL to redirect to after submission',
                  },
                },
                {
                  name: 'requireLogin',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Require user to be logged in to submit',
                  },
                },
                {
                  name: 'enableRecaptcha',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Enable Google reCAPTCHA',
                  },
                },
                {
                  name: 'saveSubmissions',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Save form submissions to database',
                  },
                },
                {
                  name: 'emailNotifications',
                  type: 'group',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                    {
                      name: 'sendTo',
                      type: 'array',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.enabled === true,
                      },
                      fields: [
                        {
                          name: 'email',
                          type: 'email',
                          required: true,
                        },
                      ],
                    },
                    {
                      name: 'subject',
                      type: 'text',
                      defaultValue: 'New form submission',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.enabled === true,
                      },
                    },
                    {
                      name: 'replyTo',
                      type: 'text',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.enabled === true,
                        description: 'Field name containing email address for reply-to',
                      },
                    },
                  ],
                },
                {
                  name: 'autoResponder',
                  type: 'group',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                    {
                      name: 'emailField',
                      type: 'text',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.enabled === true,
                        description: 'Field name containing recipient email',
                      },
                    },
                    {
                      name: 'subject',
                      type: 'text',
                      defaultValue: 'Thank you for contacting us',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.enabled === true,
                      },
                    },
                    {
                      name: 'message',
                      type: 'textarea',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.enabled === true,
                        description: 'Email message. Use {{fieldname}} to include form values.',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Style',
          fields: [
            {
              name: 'style',
              type: 'group',
              fields: [
                {
                  name: 'layout',
                  type: 'select',
                  defaultValue: 'stacked',
                  options: [
                    { label: 'Stacked', value: 'stacked' },
                    { label: 'Inline', value: 'inline' },
                    { label: 'Floating Labels', value: 'floating' },
                  ],
                },
                {
                  name: 'theme',
                  type: 'select',
                  defaultValue: 'default',
                  options: [
                    { label: 'Default', value: 'default' },
                    { label: 'Minimal', value: 'minimal' },
                    { label: 'Modern', value: 'modern' },
                    { label: 'Classic', value: 'classic' },
                  ],
                },
                {
                  name: 'fieldSpacing',
                  type: 'select',
                  defaultValue: 'medium',
                  options: [
                    { label: 'Compact', value: 'compact' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Large', value: 'large' },
                  ],
                },
                {
                  name: 'customCSS',
                  type: 'textarea',
                  admin: {
                    description: 'Custom CSS for this form',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'submissions',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Total number of submissions',
      },
    },
  ],
  endpoints: [
    {
      path: '/submit',
      method: 'post',
      handler: async (req) => {
        const body = req.json ? await req.json() : {};
        const { formId, data } = body;

        if (!formId || !data) {
          return Response.json({ error: 'Missing form ID or data' }, { status: 400 });
        }

        try {
          // Get form configuration
          const form = await req.payload.findByID({
            collection: 'forms',
            id: formId,
          });

          if (!form || form.status !== 'active') {
            return Response.json({ error: 'Form not found or inactive' }, { status: 404 });
          }

          // Validate required fields
          const errors: Record<string, string> = {};
          for (const field of form.fields) {
            if (field.required && !data[field.name]) {
              errors[field.name] = `${field.label || field.name} is required`;
            }
          }

          if (Object.keys(errors).length > 0) {
            return Response.json({ errors }, { status: 400 });
          }

          // Save submission if enabled
          if (form.settings?.saveSubmissions) {
            await req.payload.create({
              collection: 'form-submissions',
              data: {
                form: formId,
                data,
                submittedAt: new Date().toISOString(),
              },
            });

            // Increment submission count
            await req.payload.update({
              collection: 'forms',
              id: formId,
              data: {
                submissions: (form.submissions || 0) + 1,
              },
            });
          }

          // Send email notifications if enabled
          if (form.settings?.emailNotifications?.enabled) {
            // Email notification logic here
          }

          return Response.json({
            success: true,
            message: form.settings?.successMessage || 'Form submitted successfully',
            redirectUrl: form.settings?.redirectUrl,
          });
        } catch (error) {
          console.error('Form submission error:', error);
          return Response.json(
            {
              error: 'Failed to submit form',
              message: 'An error occurred',
            },
            { status: 500 }
          );
        }
      },
    },
  ],
};

export default Forms;
