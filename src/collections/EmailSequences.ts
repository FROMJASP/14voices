import { CollectionConfig } from 'payload';

export const EmailSequences: CollectionConfig = {
  slug: 'email-sequences',
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
        description: 'Sequence name (e.g., "New User Onboarding")',
      },
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique key for programmatic triggers (e.g., "user-onboarding")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'What this sequence does and when it triggers',
      },
    },
    {
      name: 'triggerEvent',
      type: 'select',
      required: true,
      options: [
        { label: 'User Registration', value: 'user_registered' },
        { label: 'First Purchase', value: 'first_purchase' },
        { label: 'Booking Created', value: 'booking_created' },
        { label: 'Script Uploaded', value: 'script_uploaded' },
        { label: 'Custom Event', value: 'custom' },
      ],
    },
    {
      name: 'emails',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'template',
          type: 'relationship',
          relationTo: 'email-templates',
          required: true,
        },
        {
          name: 'delayValue',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Delay before sending this email',
          },
        },
        {
          name: 'delayUnit',
          type: 'select',
          required: true,
          defaultValue: 'hours',
          options: [
            { label: 'Minutes', value: 'minutes' },
            { label: 'Hours', value: 'hours' },
            { label: 'Days', value: 'days' },
            { label: 'Weeks', value: 'weeks' },
          ],
        },
        {
          name: 'condition',
          type: 'code',
          admin: {
            language: 'javascript',
            description: 'Optional JS condition to evaluate before sending (return true to send)',
          },
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this sequence is active',
      },
    },
    {
      name: 'stopOnReply',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Stop sequence if user replies to any email',
      },
    },
    {
      name: 'stopOnUnsubscribe',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Stop sequence if user unsubscribes',
      },
    },
  ],
};

export default EmailSequences;
