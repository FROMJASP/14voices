import type { CollectionConfig } from 'payload'

const Voiceovers: CollectionConfig = {
  slug: 'voiceovers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'profilePhotos', 'status', 'styleTags', 'availability'],
    listSearchableFields: ['name', 'description'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the voiceover artist',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description or bio',
      },
    },
    {
      name: 'profilePhotos',
      type: 'relationship',
      relationTo: 'voiceover-photos',
      hasMany: true,
      admin: {
        description: 'Profile photos for this voiceover artist',
      },
      validate: (value: unknown, { data }: { data?: Record<string, unknown> }) => {
        if (data?.status === 'active' && (!value || !Array.isArray(value) || value.length === 0)) {
          return 'At least one profile photo is required for active voiceovers'
        }
        return true
      },
    },
    {
      name: 'styleTags',
      type: 'array',
      required: true,
      minRows: 3,
      admin: {
        description: 'Select at least 3 style tags',
      },
      fields: [
        {
          name: 'tag',
          type: 'select',
          required: true,
          hasMany: false,
          options: [
            { label: 'Autoriteit', value: 'autoriteit' },
            { label: 'Jeugdig & Fris', value: 'jeugdig-fris' },
            { label: 'Kwaliteit', value: 'kwaliteit' },
            { label: 'Stoer', value: 'stoer' },
            { label: 'Warm & Donker', value: 'warm-donker' },
            { label: 'Zakelijk', value: 'zakelijk' },
            { label: 'Custom', value: 'custom' },
          ],
        },
        {
          name: 'customTag',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.tag === 'custom',
            description: 'Enter your custom tag',
          },
        },
      ],
    },
    {
      name: 'audioDemos',
      type: 'relationship',
      relationTo: 'voiceover-demos',
      hasMany: true,
      admin: {
        description: 'Audio demo samples for this voiceover artist',
      },
      validate: (value: unknown, { data }: { data?: Record<string, unknown> }) => {
        if (data?.status === 'active' && (!value || !Array.isArray(value) || value.length === 0)) {
          return 'At least one audio demo is required for active voiceovers'
        }
        return true
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Active (Main Page)', value: 'active' },
        { label: 'Draft (Not Ready)', value: 'draft' },
        { label: 'More Voices', value: 'more-voices' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        description: 'Controls where this voiceover appears on the website',
      },
    },
    {
      type: 'group',
      name: 'availability',
      label: 'Availability Settings',
      admin: {},
      fields: [
        {
          name: 'isAvailable',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Is this voiceover currently available for bookings?',
          },
        },
        {
          name: 'unavailableFrom',
          type: 'date',
          admin: {
            condition: (data) => !data?.availability?.isAvailable,
            description: 'Start date of unavailability (e.g., vacation start)',
          },
        },
        {
          name: 'unavailableUntil',
          type: 'date',
          admin: {
            condition: (data) => !data?.availability?.isAvailable,
            description: 'End date of unavailability (auto-reactivates after this date)',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-reactivate based on availability dates
        if (data?.availability?.unavailableUntil) {
          const today = new Date()
          const unavailableUntil = new Date(data.availability.unavailableUntil)
          if (today > unavailableUntil) {
            data.availability.isAvailable = true
            data.availability.unavailableFrom = null
            data.availability.unavailableUntil = null
          }
        }
        return data
      },
    ],
  },
}

export default Voiceovers