import type { CollectionConfig } from 'payload'

const VoiceoverPhotos: CollectionConfig = {
  slug: 'voiceover-photos',
  labels: {
    singular: 'Voiceover Photo',
    plural: 'Voiceover Photos',
  },
  admin: {
    useAsTitle: 'alt',
    group: 'Media',
    description: 'Profile photos for voiceover artists',
  },
  access: {
    read: () => true, // Public access for profile photos
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
      admin: {
        description: 'Descriptive text for accessibility (e.g., "Headshot of John Doe")',
      },
    },
    {
      name: 'voiceoverArtist',
      type: 'relationship',
      relationTo: 'voiceovers',
      hasMany: false,
      admin: {
        description: 'The voiceover artist this photo belongs to',
      },
    },
    {
      name: 'isPrimary',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as primary profile photo',
      },
    },
    {
      name: 'photoType',
      type: 'select',
      options: [
        { label: 'Headshot', value: 'headshot' },
        { label: 'Full Body', value: 'full-body' },
        { label: 'Action Shot', value: 'action' },
        { label: 'Studio', value: 'studio' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'headshot',
    },
  ],
  upload: {
    staticDir: 'media/voiceover-photos',
    filesRequiredOnCreate: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
        height: 150,
        position: 'centre',
        fit: 'cover',
      },
      {
        name: 'profile',
        width: 400,
        height: 400,
        position: 'centre',
        fit: 'cover',
      },
      {
        name: 'hero',
        width: 1200,
        height: 800,
        position: 'centre',
        fit: 'cover',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    formatOptions: {
      format: 'webp',
      options: {
        quality: 80,
      },
    },
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation === 'create' && args.req?.file) {
          const file = args.req.file
          
          // Enforce file size limit
          if (file.size > 5000000) {
            throw new Error('Profile photos must be less than 5MB')
          }
          
          // Validate aspect ratio if needed
          // This could be expanded with image dimension checks
        }
        
        return args
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // If marking as primary, unset other primary photos for this artist
        if (operation === 'create' || operation === 'update') {
          if (doc.isPrimary && doc.voiceoverArtist) {
            await req.payload.update({
              collection: 'voiceover-photos',
              where: {
                and: [
                  { voiceoverArtist: { equals: doc.voiceoverArtist } },
                  { id: { not_equals: doc.id } },
                  { isPrimary: { equals: true } },
                ],
              },
              data: { isPrimary: false },
            })
          }
        }
        
        return doc
      },
    ],
  },
}

export default VoiceoverPhotos