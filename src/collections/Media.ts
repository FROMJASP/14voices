import type { CollectionConfig } from 'payload';

const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        condition: (data, { req }) => {
          if (req?.data?.mimeType) {
            return req.data.mimeType.startsWith('image/');
          }
          return true;
        },
        description: 'Alternative text for images (required for accessibility)',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        condition: (data, { req }) => {
          if (req?.data?.mimeType) {
            return req.data.mimeType.startsWith('audio/');
          }
          return false;
        },
        description: 'Optional caption for audio files',
      },
    },
  ],
  upload: {
    staticDir: 'media',
    filesRequiredOnCreate: false,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'audio/*'],
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation === 'create' && args.req?.file) {
          const file = args.req.file;
          const mimeType = file.mimetype;

          // Check specific file size limits based on type
          if (mimeType.startsWith('audio/') && file.size > 5000000) {
            throw new Error('Audio files must be less than 5MB');
          }
          if (mimeType.startsWith('image/') && file.size > 10000000) {
            throw new Error('Image files must be less than 10MB');
          }
        }

        return args;
      },
    ],
  },
};

export default Media;
