import type { CollectionConfig } from 'payload'

const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  labels: {
    singular: 'Project',
    plural: 'Portfolio',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'category', 'featured', 'completedDate', 'status'],
    group: 'Content',
    preview: (doc) => {
      if (doc?.slug) {
        return `${process.env.NEXT_PUBLIC_SERVER_URL}/portfolio/${doc.slug}`
      }
      return null
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
      type: 'tabs',
      tabs: [
        {
          label: 'Project Details',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Project title',
              },
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: {
                position: 'sidebar',
                description: 'URL-friendly version of the title',
              },
            },
            {
              name: 'client',
              type: 'text',
              required: true,
              admin: {
                description: 'Client or company name',
              },
            },
            {
              name: 'category',
              type: 'select',
              required: true,
              options: [
                { label: 'Commercial', value: 'commercial' },
                { label: 'Corporate Narration', value: 'corporate' },
                { label: 'E-Learning', value: 'elearning' },
                { label: 'Audiobook', value: 'audiobook' },
                { label: 'Video Game', value: 'videogame' },
                { label: 'Animation', value: 'animation' },
                { label: 'Documentary', value: 'documentary' },
                { label: 'IVR/Phone System', value: 'ivr' },
                { label: 'Podcast', value: 'podcast' },
                { label: 'Radio', value: 'radio' },
                { label: 'TV', value: 'tv' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Brief project description',
              },
            },
            {
              name: 'fullDescription',
              type: 'richText',
              admin: {
                description: 'Detailed project description',
              },
            },
            {
              name: 'thumbnailImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Project thumbnail for listings',
              },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
                description: 'Feature this project',
              },
            },
            {
              name: 'completedDate',
              type: 'date',
              required: true,
              admin: {
                position: 'sidebar',
                date: {
                  pickerAppearance: 'monthOnly',
                },
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
                  name: 'primaryDemo',
                  type: 'group',
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      defaultValue: 'audio',
                      options: [
                        { label: 'Audio', value: 'audio' },
                        { label: 'Video', value: 'video' },
                      ],
                    },
                    {
                      name: 'audioFile',
                      type: 'upload',
                      relationTo: 'media',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'audio',
                        description: 'Primary audio demo',
                      },
                    },
                    {
                      name: 'videoUrl',
                      type: 'text',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'video',
                        description: 'YouTube or Vimeo URL',
                      },
                    },
                    {
                      name: 'duration',
                      type: 'text',
                      admin: {
                        description: 'Duration (e.g., 2:30)',
                      },
                    },
                  ],
                },
                {
                  name: 'additionalDemos',
                  type: 'array',
                  admin: {
                    description: 'Additional audio/video samples',
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'type',
                      type: 'select',
                      defaultValue: 'audio',
                      options: [
                        { label: 'Audio', value: 'audio' },
                        { label: 'Video', value: 'video' },
                      ],
                    },
                    {
                      name: 'file',
                      type: 'upload',
                      relationTo: 'media',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'audio',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'video',
                      },
                    },
                    {
                      name: 'duration',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'gallery',
                  type: 'array',
                  admin: {
                    description: 'Project images',
                  },
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    {
                      name: 'caption',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'behindTheScenes',
                  type: 'array',
                  admin: {
                    description: 'Behind the scenes content',
                  },
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      options: [
                        { label: 'Image', value: 'image' },
                        { label: 'Video', value: 'video' },
                      ],
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'image',
                      },
                    },
                    {
                      name: 'videoUrl',
                      type: 'text',
                      admin: {
                        condition: (data, siblingData) => siblingData?.type === 'video',
                      },
                    },
                    {
                      name: 'caption',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Team & Credits',
          fields: [
            {
              name: 'credits',
              type: 'group',
              fields: [
                {
                  name: 'voiceArtist',
                  type: 'relationship',
                  relationTo: 'voiceovers',
                  hasMany: true,
                  admin: {
                    description: 'Voice artists on this project',
                  },
                },
                {
                  name: 'teamMembers',
                  type: 'relationship',
                  relationTo: 'team',
                  hasMany: true,
                  admin: {
                    description: 'Team members involved',
                  },
                },
                {
                  name: 'director',
                  type: 'text',
                  admin: {
                    description: 'Director name',
                  },
                },
                {
                  name: 'producer',
                  type: 'text',
                  admin: {
                    description: 'Producer name',
                  },
                },
                {
                  name: 'studio',
                  type: 'text',
                  admin: {
                    description: 'Recording studio',
                  },
                },
                {
                  name: 'additionalCredits',
                  type: 'array',
                  fields: [
                    {
                      name: 'role',
                      type: 'text',
                    },
                    {
                      name: 'name',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Project Info',
          fields: [
            {
              name: 'projectInfo',
              type: 'group',
              fields: [
                {
                  name: 'duration',
                  type: 'text',
                  admin: {
                    description: 'Total project duration',
                  },
                },
                {
                  name: 'languages',
                  type: 'array',
                  fields: [
                    {
                      name: 'language',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'deliverables',
                  type: 'array',
                  admin: {
                    description: 'What was delivered',
                  },
                  fields: [
                    {
                      name: 'item',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'industry',
                  type: 'select',
                  options: [
                    { label: 'Technology', value: 'technology' },
                    { label: 'Healthcare', value: 'healthcare' },
                    { label: 'Finance', value: 'finance' },
                    { label: 'Education', value: 'education' },
                    { label: 'Entertainment', value: 'entertainment' },
                    { label: 'Retail', value: 'retail' },
                    { label: 'Non-profit', value: 'nonprofit' },
                    { label: 'Government', value: 'government' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                {
                  name: 'reach',
                  type: 'text',
                  admin: {
                    description: 'Audience reach (e.g., "National TV", "1M+ listeners")',
                  },
                },
                {
                  name: 'awards',
                  type: 'array',
                  fields: [
                    {
                      name: 'award',
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
          label: 'Case Study',
          fields: [
            {
              name: 'caseStudy',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Create detailed case study',
                  },
                },
                {
                  name: 'challenge',
                  type: 'richText',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                    description: 'The challenge or brief',
                  },
                },
                {
                  name: 'solution',
                  type: 'richText',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                    description: 'How the challenge was addressed',
                  },
                },
                {
                  name: 'results',
                  type: 'richText',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                    description: 'Project outcomes and impact',
                  },
                },
                {
                  name: 'testimonial',
                  type: 'relationship',
                  relationTo: 'testimonials',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                    description: 'Client testimonial for this project',
                  },
                },
                {
                  name: 'metrics',
                  type: 'array',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                    description: 'Success metrics',
                  },
                  fields: [
                    {
                      name: 'metric',
                      type: 'text',
                    },
                    {
                      name: 'value',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'Override the default title for SEO',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'Meta description for search engines',
                  },
                },
                {
                  name: 'keywords',
                  type: 'array',
                  fields: [
                    {
                      name: 'keyword',
                      type: 'text',
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
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedProjects',
      type: 'relationship',
      relationTo: 'portfolio',
      hasMany: true,
      maxRows: 3,
      admin: {
        position: 'sidebar',
        description: 'Show these related projects',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate slug from title
        if (data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        }
        return data
      },
    ],
  },
}

export default Portfolio