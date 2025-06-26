import type { CollectionConfig } from 'payload'
import { afterUserCreate } from '@/hooks/email-triggers'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user }, id }) => {
      // Allow users to update their own profile
      if (user?.id === id) return true
      // Allow admins to update any user
      return user?.role === 'admin'
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'emailPreferences',
      type: 'group',
      fields: [
        {
          name: 'unsubscribed',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'User has unsubscribed from all emails',
          },
        },
        {
          name: 'marketing',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Receive marketing emails',
          },
        },
        {
          name: 'transactional',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Receive transactional emails (bookings, invoices)',
          },
        },
        {
          name: 'updates',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Receive product updates and announcements',
          },
        },
      ],
    },
  ],
  hooks: {
    afterCreate: [afterUserCreate],
  },
}

export default Users