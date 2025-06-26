import type { CollectionConfig } from 'payload'
import { beforeUploadHook } from '../hooks/secureFilename'

const UserAvatars: CollectionConfig = {
  slug: 'user-avatars',
  labels: {
    singular: 'User Avatar',
    plural: 'User Avatars',
  },
  admin: {
    useAsTitle: 'alt',
    group: 'Media',
    description: 'Profile avatars for registered users',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      
      // Admins can see all avatars
      if (user.role === 'admin') return true
      
      // Users can only see their own avatar
      return { user: { equals: user.id } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      
      // Users can only update their own avatar
      return { user: { equals: user.id } }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      defaultValue: 'User avatar',
      admin: {
        description: 'Alt text for accessibility',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      hasMany: false,
      admin: {
        description: 'The user this avatar belongs to',
        condition: ({ req: { user } }) => user?.role === 'admin',
      },
      defaultValue: ({ user }) => user?.id,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this avatar is currently active',
      },
    },
    {
      name: 'uploadedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'originalFilename',
      type: 'text',
      admin: {
        description: 'Original filename',
        readOnly: true,
      },
    },
  ],
  upload: {
    staticDir: 'media/user-avatars',
    filesRequiredOnCreate: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 50,
        height: 50,
        position: 'centre',
        fit: 'cover',
      },
      {
        name: 'small',
        width: 100,
        height: 100,
        position: 'centre',
        fit: 'cover',
      },
      {
        name: 'medium',
        width: 200,
        height: 200,
        position: 'centre',
        fit: 'cover',
      },
      {
        name: 'large',
        width: 400,
        height: 400,
        position: 'centre',
        fit: 'cover',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
    formatOptions: {
      format: 'webp',
      options: {
        quality: 85,
      },
    },
  },
  hooks: {
    beforeOperation: [
      beforeUploadHook,
      async ({ args, operation, req }) => {
        // Ensure users can only create/update their own avatar
        if ((operation === 'create' || operation === 'update') && req.user?.role !== 'admin' && req.user) {
          args.data = {
            ...args.data,
            user: req.user.id,
          }
        }
        
        if (operation === 'create' && args.req?.file) {
          const file = args.req.file
          
          // Enforce file size limit
          if (file.size > 2000000) {
            throw new Error('Avatar images must be less than 2MB')
          }
        }
        
        return args
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Deactivate previous avatars when a new one is uploaded
        if (operation === 'create' && doc.isActive && doc.user) {
          await req.payload.update({
            collection: 'user-avatars',
            where: {
              and: [
                { user: { equals: doc.user } },
                { id: { not_equals: doc.id } },
                { isActive: { equals: true } },
              ],
            },
            data: { isActive: false },
          })
        }
        
        return doc
      },
    ],
  },
}

export default UserAvatars