import type { CollectionConfig } from 'payload'

const Team: CollectionConfig = {
  slug: 'team',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'department', 'order', 'status'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Info',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'role',
              type: 'text',
              required: true,
              admin: {
                description: 'Job title or role',
              },
            },
            {
              name: 'department',
              type: 'select',
              options: [
                { label: 'Voice Talent', value: 'voice-talent' },
                { label: 'Production', value: 'production' },
                { label: 'Management', value: 'management' },
                { label: 'Creative', value: 'creative' },
                { label: 'Technical', value: 'technical' },
                { label: 'Marketing', value: 'marketing' },
                { label: 'Support', value: 'support' },
              ],
              admin: {
                description: 'Department or team',
              },
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Professional photo',
              },
            },
            {
              name: 'email',
              type: 'email',
              admin: {
                description: 'Professional email address',
              },
            },
            {
              name: 'phone',
              type: 'text',
              admin: {
                description: 'Professional phone number',
              },
            },
            {
              name: 'order',
              type: 'number',
              defaultValue: 0,
              admin: {
                position: 'sidebar',
                description: 'Display order (lower numbers appear first)',
              },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
                description: 'Feature on homepage',
              },
            },
          ],
        },
        {
          label: 'Profile',
          fields: [
            {
              name: 'bio',
              type: 'textarea',
              admin: {
                description: 'Short biography (2-3 sentences)',
              },
            },
            {
              name: 'fullBio',
              type: 'richText',
              admin: {
                description: 'Full biography for profile page',
              },
            },
            {
              name: 'specialties',
              type: 'array',
              admin: {
                description: 'Areas of expertise',
              },
              fields: [
                {
                  name: 'specialty',
                  type: 'text',
                },
              ],
            },
            {
              name: 'languages',
              type: 'array',
              admin: {
                description: 'Languages spoken',
              },
              fields: [
                {
                  name: 'language',
                  type: 'text',
                },
                {
                  name: 'proficiency',
                  type: 'select',
                  options: [
                    { label: 'Native', value: 'native' },
                    { label: 'Fluent', value: 'fluent' },
                    { label: 'Professional', value: 'professional' },
                    { label: 'Conversational', value: 'conversational' },
                  ],
                },
              ],
            },
            {
              name: 'experience',
              type: 'group',
              fields: [
                {
                  name: 'yearsOfExperience',
                  type: 'number',
                  admin: {
                    description: 'Years in the industry',
                  },
                },
                {
                  name: 'previousCompanies',
                  type: 'array',
                  fields: [
                    {
                      name: 'company',
                      type: 'text',
                    },
                    {
                      name: 'role',
                      type: 'text',
                    },
                    {
                      name: 'duration',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'education',
                  type: 'array',
                  fields: [
                    {
                      name: 'institution',
                      type: 'text',
                    },
                    {
                      name: 'degree',
                      type: 'text',
                    },
                    {
                      name: 'year',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Social & Links',
          fields: [
            {
              name: 'social',
              type: 'group',
              fields: [
                {
                  name: 'linkedin',
                  type: 'text',
                  admin: {
                    description: 'LinkedIn profile URL',
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
                  name: 'website',
                  type: 'text',
                  admin: {
                    description: 'Personal website URL',
                  },
                },
                {
                  name: 'portfolio',
                  type: 'text',
                  admin: {
                    description: 'Portfolio or demo reel URL',
                  },
                },
              ],
            },
            {
              name: 'voiceoverProfile',
              type: 'relationship',
              relationTo: 'voiceovers',
              admin: {
                description: 'Link to voiceover artist profile (if applicable)',
              },
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'media',
              type: 'group',
              fields: [
                {
                  name: 'introVideo',
                  type: 'text',
                  admin: {
                    description: 'Introduction video URL',
                  },
                },
                {
                  name: 'gallery',
                  type: 'array',
                  admin: {
                    description: 'Additional photos',
                  },
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                    },
                    {
                      name: 'caption',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'resume',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Downloadable resume/CV',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'On Leave', value: 'on-leave' },
        { label: 'Inactive', value: 'inactive' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'When they joined the team',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Generate slug from name for profile URLs
        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        }
        return data
      },
    ],
  },
}

export default Team