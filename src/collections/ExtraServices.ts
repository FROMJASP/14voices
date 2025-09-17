import type { CollectionConfig } from 'payload';

const ExtraServices: CollectionConfig = {
  slug: 'extra-services',
  labels: {
    singular: {
      en: 'Extra Service',
      nl: 'Extra Dienst',
    },
    plural: {
      en: 'Extra Services',
      nl: 'Extra Diensten',
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'basePrice', 'productions', 'status', 'updatedAt'],
    group: {
      en: 'Manage Services',
      nl: 'Beheer Diensten',
    },
  },
  access: {
    read: () => true, // Public can read for pricing calculations
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: {
        en: 'Name',
        nl: 'Naam',
      },
      admin: {
        description: {
          en: 'The name of the extra service',
          nl: 'De naam van de extra dienst',
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      label: {
        en: 'Slug',
        nl: 'Slug',
      },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Unique identifier',
          nl: 'Unieke identifier',
        },
      },
    },
    {
      name: 'basePrice',
      type: 'number',
      required: true,
      min: 0,
      label: {
        en: 'Base Price',
        nl: 'Basisprijs',
      },
      admin: {
        description: {
          en: 'Standard price in euros (excl. VAT)',
          nl: "Standaard prijs in euro's (excl. BTW)",
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: {
        en: 'Description',
        nl: 'Beschrijving',
      },
      admin: {
        description: {
          en: 'Description of this service',
          nl: 'Beschrijving van deze dienst',
        },
      },
    },
    {
      name: 'infoText',
      type: 'textarea',
      localized: true,
      label: {
        en: 'Info Text',
        nl: 'Info Tekst',
      },
      admin: {
        description: {
          en: 'Extended explanation shown for more info',
          nl: 'Uitgebreide uitleg die getoond wordt bij meer info',
        },
      },
    },
    {
      name: 'productions',
      type: 'relationship',
      relationTo: 'productions',
      hasMany: true,
      required: true,
      label: {
        en: 'Productions',
        nl: 'Producties',
      },
      admin: {
        description: {
          en: 'Which productions is this service available for',
          nl: 'Voor welke producties is deze dienst beschikbaar',
        },
      },
    },
    {
      name: 'productionPriceOverrides',
      type: 'array',
      label: {
        en: 'Production Price Overrides',
        nl: 'Productie Prijs Uitzonderingen',
      },
      admin: {
        description: {
          en: 'Different prices per production type',
          nl: 'Afwijkende prijzen per productiesoort',
        },
      },
      fields: [
        {
          name: 'production',
          type: 'relationship',
          relationTo: 'productions',
          required: true,
          label: {
            en: 'Production',
            nl: 'Productie',
          },
          admin: {
            width: '50%',
          },
          // Ensure proper cascade behavior
          hooks: {
            beforeChange: [
              async ({ value, req }) => {
                // Validate that the production exists
                if (value && req.payload) {
                  try {
                    await req.payload.findByID({
                      collection: 'productions',
                      id: value,
                    });
                  } catch (error) {
                    throw new Error('Invalid production ID');
                  }
                }
                return value;
              },
            ],
          },
        },
        {
          name: 'overridePrice',
          type: 'number',
          required: true,
          min: 0,
          label: {
            en: 'Override Price',
            nl: 'Afwijkende Prijs',
          },
          admin: {
            width: '50%',
            description: {
              en: 'Price for this specific production',
              nl: 'Prijs voor deze specifieke productie',
            },
          },
        },
      ],
    },
    {
      name: 'dependencies',
      type: 'relationship',
      relationTo: 'extra-services',
      hasMany: true,
      label: {
        en: 'Dependencies',
        nl: 'Afhankelijkheden',
      },
      admin: {
        description: {
          en: 'Other services that must be selected first',
          nl: 'Andere diensten die eerst geselecteerd moeten zijn',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      required: true,
      label: {
        en: 'Status',
        nl: 'Status',
      },
      options: [
        {
          label: {
            en: 'Active',
            nl: 'Actief',
          },
          value: 'active',
        },
        {
          label: {
            en: 'Inactive',
            nl: 'Inactief',
          },
          value: 'inactive',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: {
        en: 'Sort Order',
        nl: 'Sorteer Volgorde',
      },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Order in lists (low to high)',
          nl: 'Volgorde in lijsten (laag naar hoog)',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.slug && data.name) {
          // Auto-generate slug from name
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
        return data;
      },
    ],
  },
};

export default ExtraServices;
