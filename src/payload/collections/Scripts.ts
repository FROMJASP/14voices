import type { CollectionConfig, Access } from 'payload'
import { authenticated } from '@/access/authenticated'
import { isAdmin } from '@/access/isAdmin'

export const Scripts: CollectionConfig = {
  slug: 'scripts',
  labels: {
    singular: 'Script',
    plural: 'Scripts',
  },
  admin: {
    useAsTitle: 'fileName',
    group: 'Bookings',
    defaultColumns: ['fileName', 'booking', 'uploadedBy', 'createdAt'],
  },
  access: {
    create: authenticated,
    read: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      
      // Users can read scripts for their bookings
      return {
        uploadedBy: {
          equals: user.id,
        },
      }
    }) as Access,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'File Upload', value: 'file' },
        { label: 'Text Content', value: 'text' },
      ],
    },
    {
      name: 'fileName',
      type: 'text',
      admin: {
        condition: (data) => data?.type === 'file',
      },
    },
    {
      name: 'fileUrl',
      type: 'text',
      admin: {
        condition: (data) => data?.type === 'file',
        readOnly: true,
      },
    },
    {
      name: 'fileKey',
      type: 'text',
      admin: {
        condition: (data) => data?.type === 'file',
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'fileSize',
      type: 'number',
      admin: {
        condition: (data) => data?.type === 'file',
        readOnly: true,
      },
    },
    {
      name: 'textContent',
      type: 'textarea',
      admin: {
        condition: (data) => data?.type === 'text',
      },
    },
    {
      name: 'sharedWithVoiceovers',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Allow assigned voiceovers to view this script',
      },
    },
  ],
  timestamps: true,
}