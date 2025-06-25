import type { CollectionConfig } from 'payload'

const VoiceoverDemos: CollectionConfig = {
  slug: 'voiceover-demos',
  labels: {
    singular: 'Voiceover Demo',
    plural: 'Voiceover Demos',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Media',
    description: 'Audio demo samples from voiceover artists',
  },
  access: {
    read: () => true, // Public access for demos
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Demo Title',
      admin: {
        description: 'Descriptive title (e.g., "Commercial Demo Reel 2024")',
      },
    },
    {
      name: 'voiceoverArtist',
      type: 'relationship',
      relationTo: 'voiceovers',
      required: true,
      hasMany: false,
      admin: {
        description: 'The voiceover artist this demo belongs to',
      },
    },
    {
      name: 'demoType',
      type: 'select',
      required: true,
      options: [
        { label: 'Commercial', value: 'commercial' },
        { label: 'Narration', value: 'narration' },
        { label: 'Character/Animation', value: 'character' },
        { label: 'Audiobook', value: 'audiobook' },
        { label: 'Corporate/Training', value: 'corporate' },
        { label: 'Video Game', value: 'video-game' },
        { label: 'Promo', value: 'promo' },
        { label: 'IVR/Phone', value: 'ivr' },
        { label: 'Documentary', value: 'documentary' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Category of voice work demonstrated',
      },
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        description: 'Duration in seconds (auto-calculated on upload)',
        readOnly: true,
      },
    },
    {
      name: 'language',
      type: 'select',
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
      name: 'accent',
      type: 'text',
      admin: {
        description: 'Specific accent if applicable (e.g., "British RP", "Southern US")',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      minRows: 0,
      maxRows: 10,
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
      admin: {
        description: 'Keywords for better searchability (e.g., "energetic", "smooth", "authoritative")',
      },
    },
    {
      name: 'isPrimary',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as primary demo for this category',
      },
    },
    {
      name: 'transcript',
      type: 'textarea',
      admin: {
        description: 'Optional transcript of the demo content',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order in which demos appear (lower numbers first)',
      },
    },
  ],
  upload: {
    staticDir: 'media/voiceover-demos',
    filesRequiredOnCreate: true,
    mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/aac', 'audio/ogg'],
    adminThumbnail: () => `/admin/assets/audio-file-icon.svg`,
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation === 'create' && args.req?.file) {
          const file = args.req.file
          
          // Enforce file size limit
          if (file.size > 10000000) {
            throw new Error('Demo files must be less than 10MB')
          }
          
          // Could add duration extraction here using ffprobe or similar
        }
        
        return args
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // If marking as primary, unset other primary demos for this artist and type
        if ((operation === 'create' || operation === 'update') && doc.isPrimary && doc.voiceoverArtist && doc.demoType) {
          await req.payload.update({
            collection: 'voiceover-demos',
            where: {
              and: [
                { voiceoverArtist: { equals: doc.voiceoverArtist } },
                { demoType: { equals: doc.demoType } },
                { id: { not_equals: doc.id } },
                { isPrimary: { equals: true } },
              ],
            },
            data: { isPrimary: false },
          })
        }
        
        return doc
      },
    ],
  },
}

export default VoiceoverDemos