import type { CollectionConfig, Access } from 'payload';

const Scripts: CollectionConfig = {
  slug: 'scripts',
  labels: {
    singular: 'Script',
    plural: 'Scripts',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Orders',
    description: 'Scripts uploaded by clients for voiceover work',
  },
  access: {
    read: (({ req: { user } }) => {
      if (!user) return false;

      // Admins can read all scripts
      if (user.role === 'admin') return true;

      // Users can read scripts they own or are assigned to
      return {
        or: [{ uploadedBy: { equals: user.id } }, { assignedVoiceover: { equals: user.id } }],
      };
    }) as Access,
    create: ({ req: { user } }) => Boolean(user),
    update: (({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;

      // Only owner can update their scripts
      return { uploadedBy: { equals: user.id } };
    }) as Access,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Script Title',
      admin: {
        description: 'Title of the script or project',
      },
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        description: 'Client who uploaded the script',
        condition: ({ req: { user } }) => user?.role === 'admin',
      },
      defaultValue: ({ user }) => user?.id,
    },
    {
      name: 'assignedVoiceover',
      type: 'relationship',
      relationTo: 'voiceovers',
      hasMany: false,
      admin: {
        description: 'Voiceover artist assigned to read this script',
      },
    },
    {
      name: 'scriptType',
      type: 'select',
      required: true,
      defaultValue: 'commercial',
      options: [
        { label: 'Commercial', value: 'commercial' },
        { label: 'Narration', value: 'narration' },
        { label: 'E-Learning', value: 'elearning' },
        { label: 'Audiobook', value: 'audiobook' },
        { label: 'Video Game', value: 'videogame' },
        { label: 'Animation', value: 'animation' },
        { label: 'Corporate', value: 'corporate' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'language',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' },
        { label: 'German', value: 'de' },
        { label: 'Italian', value: 'it' },
        { label: 'Portuguese', value: 'pt' },
        { label: 'Dutch', value: 'nl' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'wordCount',
      type: 'number',
      admin: {
        description: 'Estimated word count (auto-calculated when possible)',
        readOnly: true,
      },
    },
    {
      name: 'estimatedDuration',
      type: 'number',
      admin: {
        description: 'Estimated reading duration in minutes',
      },
    },
    {
      name: 'confidentialityLevel',
      type: 'select',
      required: true,
      defaultValue: 'standard',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Standard', value: 'standard' },
        { label: 'Confidential', value: 'confidential' },
        { label: 'Highly Confidential', value: 'highly-confidential' },
      ],
      admin: {
        description: 'Security level of the script content',
      },
    },
    {
      name: 'instructions',
      type: 'textarea',
      admin: {
        description: 'Special instructions for the voiceover artist',
      },
    },
    {
      name: 'originalFilename',
      type: 'text',
      admin: {
        description: 'Original filename before security hashing',
        readOnly: true,
      },
    },
    {
      name: 'deadline',
      type: 'date',
      admin: {
        description: 'When the script reading needs to be completed',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'accessLog',
      type: 'array',
      access: {
        read: ({ req: { user } }) => user?.role === 'admin',
        create: () => false,
        update: () => false,
      },
      fields: [
        {
          name: 'accessedBy',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'accessedAt',
          type: 'date',
          required: true,
        },
        {
          name: 'action',
          type: 'select',
          options: [
            { label: 'Viewed', value: 'viewed' },
            { label: 'Downloaded', value: 'downloaded' },
          ],
          required: true,
        },
      ],
      admin: {
        description: 'Audit log of who accessed this script',
        readOnly: true,
      },
    },
  ],
  upload: {
    staticDir: 'media/scripts',
    filesRequiredOnCreate: true,
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-word',
      'text/plain',
      'text/rtf',
      'application/rtf',
      'application/vnd.apple.pages',
    ],
    // Storage handled by MinIO adapter or local storage
    disableLocalStorage: process.env.NODE_ENV === 'production' && !!process.env.S3_ACCESS_KEY,
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation === 'create' && args.req?.file) {
          const file = args.req.file;

          // Enforce file size limit based on type
          const maxSize = file.mimetype === 'application/pdf' ? 25000000 : 10000000; // 25MB for PDF, 10MB for others
          if (file.size > maxSize) {
            throw new Error(`Scripts must be less than ${maxSize / 1000000}MB`);
          }
        }

        return args;
      },
    ],
  },
};

export default Scripts;
