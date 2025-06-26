import type { CollectionConfig, Access } from 'payload'

const Invoices: CollectionConfig = {
  slug: 'invoices',
  labels: {
    singular: 'Invoice',
    plural: 'Invoices',
  },
  admin: {
    useAsTitle: 'invoiceNumber',
    group: 'Media',
    description: 'Invoice documents with restricted access',
  },
  access: {
    read: (({ req: { user } }) => {
      if (!user) return false
      
      // Admins can read all invoices
      if (user.role === 'admin') return true
      
      // Users can read invoices where they are the client or provider
      return {
        or: [
          { client: { equals: user.id } },
          { provider: { equals: user.id } },
        ],
      }
    }) as Access,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique invoice number (e.g., INV-2024-001)',
      },
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        description: 'Client who receives the invoice',
      },
    },
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        description: 'Service provider (voiceover artist)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sent', value: 'sent' },
        { label: 'Viewed', value: 'viewed' },
        { label: 'Paid', value: 'paid' },
        { label: 'Overdue', value: 'overdue' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Invoice amount in cents',
      },
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'USD',
      options: [
        { label: 'US Dollar', value: 'USD' },
        { label: 'Euro', value: 'EUR' },
        { label: 'British Pound', value: 'GBP' },
        { label: 'Canadian Dollar', value: 'CAD' },
        { label: 'Australian Dollar', value: 'AUD' },
      ],
    },
    {
      name: 'issueDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'dueDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'paidDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        condition: (data) => data?.status === 'paid',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes (not shown on invoice)',
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
            { label: 'Sent', value: 'sent' },
          ],
          required: true,
        },
      ],
      admin: {
        description: 'Audit trail of invoice access',
        readOnly: true,
      },
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
    staticDir: 'media/invoices',
    filesRequiredOnCreate: false,
    mimeTypes: ['application/pdf'],
    disableLocalStorage: true, // Force blob storage for security
    adminThumbnail: () => `/admin/assets/pdf-icon.svg`,
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation === 'create' && args.req?.file) {
          const file = args.req.file
          
          // Enforce file size limit
          if (file.size > 5000000) {
            throw new Error('Invoice files must be less than 5MB')
          }
        }
        
        // Auto-generate invoice number if not provided
        if (operation === 'create' && !args.data?.invoiceNumber) {
          const year = new Date().getFullYear()
          const count = await args.req.payload.count({
            collection: 'invoices',
            where: {
              invoiceNumber: {
                contains: `INV-${year}`,
              },
            },
          })
          args.data.invoiceNumber = `INV-${year}-${String(count + 1).padStart(3, '0')}`
        }
        
        return args
      },
    ],
    afterRead: [
      async ({ doc, req }) => {
        // Update status to 'viewed' if it was 'sent' and not admin
        if (req.user && doc.id && req.user.role !== 'admin' && doc.status === 'sent') {
          await req.payload.update({
            collection: 'invoices',
            id: doc.id,
            data: { status: 'viewed' },
          })
        }
        
        return doc
      },
    ],
  },
}

export default Invoices