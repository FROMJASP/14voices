import type { CollectionConfig } from 'payload'

const Voiceovers: CollectionConfig = {
  slug: 'voiceovers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['group', 'name', 'status', 'availability', 'styleTags', 'demos'],
    listSearchableFields: ['name', 'description'],
    group: 'Content',
    pagination: {
      defaultLimit: 10,
      limits: [10, 25, 50, 100],
    },
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
      localized: true,
      admin: {
        description: 'The name of the voiceover artist',
        width: '25%',
        components: {
          Cell: './components/admin/cells/NameCell#NameCell',
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Optional description or bio',
      },
    },
    {
      name: 'profilePhoto',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Primary profile photo for this voiceover artist',
        disableListColumn: true,
      },
      validate: (value: unknown, { data }: { data?: Record<string, unknown> }) => {
        if (data?.status === 'active' && !value) {
          return 'A profile photo is required for active voiceovers'
        }
        return true
      },
    },
    {
      name: 'additionalPhotos',
      type: 'array',
      admin: {
        description: 'Additional profile photos',
      },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional caption for this photo',
          },
        },
      ],
    },
    {
      name: 'styleTags',
      type: 'array',
      required: true,
      minRows: 3,
      admin: {
        description: 'Select at least 3 style tags',
        components: {
          Cell: './components/admin/cells/StyleTagsCell#StyleTagsCell',
        },
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
      name: 'fullDemoReel',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Full demo reel audio file',
        width: '20%',
      },
      validate: (value: unknown, { data }: { data?: Record<string, unknown> }) => {
        const hasAnyDemo = value || data?.commercialsDemo || data?.narrativeDemo
        if (data?.status === 'active' && !hasAnyDemo) {
          return 'At least one audio demo is required for active voiceovers'
        }
        return true
      },
    },
    {
      name: 'commercialsDemo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Commercials demo audio file',
        width: '20%',
      },
    },
    {
      name: 'narrativeDemo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Narrative demo audio file',
        width: '20%',
      },
    },
    {
      name: 'demos',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Cell: './components/admin/cells/AudioDemoCell#AudioDemoCell',
        },
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
        width: '15%',
        components: {
          Cell: './components/admin/cells/StatusCell#StatusCell',
        },
      },
    },
    {
      name: 'group',
      type: 'relationship',
      relationTo: 'groups',
      hasMany: false,
      admin: {
        description: 'Optional group/batch this voiceover belongs to',
        width: '20%',
        components: {
          Cell: './components/admin/cells/GroupCell#GroupCell',
        },
      },
    },
    {
      type: 'group',
      name: 'availability',
      label: 'Availability',
      admin: {
        components: {
          Cell: './components/admin/cells/AvailabilityCell#AvailabilityCell',
        },
      },
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
    afterRead: [
      async ({ doc, req }) => {
        // Always populate group if it's just an ID
        if (doc.group && typeof doc.group === 'string') {
          try {
            const group = await req.payload.findByID({
              collection: 'groups',
              id: doc.group,
              depth: 0
            })
            doc.group = group
          } catch {
            // Group might be deleted, leave as is
          }
        }
        return doc
      },
    ],
  },
}

export default Voiceovers