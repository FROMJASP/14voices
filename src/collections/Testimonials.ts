import type { CollectionConfig } from 'payload';

const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'rating', 'featured', 'publishedDate'],
    group: {
      en: 'Site Builder',
      nl: 'Site Builder',
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
          label: 'Content',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Client name',
              },
            },
            {
              name: 'title',
              type: 'text',
              admin: {
                description: 'Job title or role',
              },
            },
            {
              name: 'company',
              type: 'text',
              admin: {
                description: 'Company name',
              },
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Client photo or avatar',
              },
            },
            {
              name: 'testimonial',
              type: 'textarea',
              required: true,
              admin: {
                description: 'The testimonial text',
              },
            },
            {
              name: 'rating',
              type: 'select',
              defaultValue: '5',
              options: [
                { label: '5 Stars', value: '5' },
                { label: '4 Stars', value: '4' },
                { label: '3 Stars', value: '3' },
                { label: '2 Stars', value: '2' },
                { label: '1 Star', value: '1' },
              ],
              admin: {
                description: 'Star rating',
              },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
                description: 'Show in featured testimonials',
              },
            },
            {
              name: 'publishedDate',
              type: 'date',
              defaultValue: () => new Date().toISOString(),
              admin: {
                position: 'sidebar',
                date: {
                  pickerAppearance: 'dayOnly',
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
                  name: 'type',
                  type: 'select',
                  defaultValue: 'none',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Video', value: 'video' },
                    { label: 'Audio', value: 'audio' },
                  ],
                },
                {
                  name: 'videoUrl',
                  type: 'text',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'video',
                    description: 'YouTube or Vimeo URL',
                  },
                },
                {
                  name: 'videoThumbnail',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'video',
                    description: 'Video thumbnail image',
                  },
                },
                {
                  name: 'audioFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'audio',
                    description: 'Audio testimonial file',
                  },
                },
                {
                  name: 'duration',
                  type: 'text',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type !== 'none',
                    description: 'Duration (e.g., 2:30)',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Project Details',
          fields: [
            {
              name: 'project',
              type: 'group',
              fields: [
                {
                  name: 'voiceover',
                  type: 'relationship',
                  relationTo: 'voiceovers',
                  admin: {
                    description: 'Related voiceover artist',
                  },
                },
                {
                  name: 'projectType',
                  type: 'select',
                  options: [
                    { label: 'Commercial', value: 'commercial' },
                    { label: 'Narration', value: 'narration' },
                    { label: 'Character', value: 'character' },
                    { label: 'E-Learning', value: 'elearning' },
                    { label: 'IVR', value: 'ivr' },
                    { label: 'Podcast', value: 'podcast' },
                    { label: 'Audiobook', value: 'audiobook' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                {
                  name: 'projectName',
                  type: 'text',
                  admin: {
                    description: 'Name of the project',
                  },
                },
                {
                  name: 'completedDate',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'monthOnly',
                    },
                    description: 'When the project was completed',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Display Options',
          fields: [
            {
              name: 'display',
              type: 'group',
              fields: [
                {
                  name: 'showCompany',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show company name',
                  },
                },
                {
                  name: 'showTitle',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show job title',
                  },
                },
                {
                  name: 'showAvatar',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show avatar/photo',
                  },
                },
                {
                  name: 'showRating',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show star rating',
                  },
                },
                {
                  name: 'highlightText',
                  type: 'text',
                  admin: {
                    description: 'Text to highlight in the testimonial (will be bolded)',
                  },
                },
                {
                  name: 'tags',
                  type: 'array',
                  admin: {
                    description: 'Tags for filtering',
                  },
                  fields: [
                    {
                      name: 'tag',
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
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate excerpt if highlight text is not provided
        if (!data.display?.highlightText && data.testimonial) {
          const words = data.testimonial.split(' ');
          if (words.length > 15) {
            data.display = {
              ...data.display,
              highlightText: words.slice(0, 15).join(' ') + '...',
            };
          }
        }
        return data;
      },
    ],
  },
};

export default Testimonials;
