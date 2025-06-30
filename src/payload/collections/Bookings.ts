import type { CollectionConfig, Access } from 'payload'
import { authenticated } from '@/access/authenticated'
import { isAdmin } from '@/access/isAdmin'
import { afterBookingCreate } from '@/hooks/email-triggers'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: {
    singular: 'Booking',
    plural: 'Bookings',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Documents',
    defaultColumns: ['title', 'customer', 'voiceover', 'status', 'createdAt'],
  },
  access: {
    create: authenticated,
    read: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      
      // Users can read their own bookings
      return {
        or: [
          { customer: { equals: user.id } },
          { voiceover: { equals: user.id } },
        ],
      }
    }) as Access,
    update: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      
      // Customers can update their own bookings
      return {
        customer: { equals: user.id },
      }
    }) as Access,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Brief description of the booking',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Customer who created the booking',
      },
    },
    {
      name: 'voiceover',
      type: 'relationship',
      relationTo: 'voiceovers',
      admin: {
        description: 'Assigned voiceover artist',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'projectType',
      type: 'select',
      required: true,
      options: [
        { label: 'Commercial', value: 'commercial' },
        { label: 'Narration', value: 'narration' },
        { label: 'E-Learning', value: 'elearning' },
        { label: 'Corporate', value: 'corporate' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'deadline',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'budget',
      type: 'number',
      admin: {
        description: 'Budget in USD',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes or requirements',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [afterBookingCreate],
  },
}