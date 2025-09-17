import type { CollectionConfig } from 'payload';

const Productions: CollectionConfig = {
  slug: 'productions',
  labels: {
    singular: {
      en: 'Production',
      nl: 'Productie',
    },
    plural: {
      en: 'Productions',
      nl: 'Producties',
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'basePrice', 'pricingType', 'status', 'updatedAt'],
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
      localized: false, // Temporarily disable localization
      label: {
        en: 'Name',
        nl: 'Naam',
      },
      admin: {
        description: {
          en: 'The name of the production type',
          nl: 'De naam van de productiesoort',
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
          en: 'Base price in euros (excl. VAT)',
          nl: "Basisprijs in euro's (excl. BTW)",
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: false, // Temporarily disable localization
      label: {
        en: 'Description',
        nl: 'Beschrijving',
      },
      admin: {
        description: {
          en: 'Short description of this production type',
          nl: 'Korte beschrijving van deze productiesoort',
        },
      },
    },
    {
      name: 'videoUrl',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Video URL',
        nl: 'Video URL',
      },
      admin: {
        description: {
          en: 'Preview video for this production type',
          nl: 'Preview video voor deze productiesoort',
        },
      },
    },
    {
      name: 'buyoutDuration',
      type: 'text',
      defaultValue: '12 maanden',
      localized: false, // Temporarily disable localization
      label: {
        en: 'Buyout Duration',
        nl: 'Buyout Duur',
      },
      admin: {
        description: {
          en: 'How long the recordings can be used (use "infinity" for unlimited)',
          nl: 'Hoe lang mogen de opnames gebruikt worden (gebruik "oneindig" voor onbeperkt)',
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            en: 'Pricing Configuration',
            nl: 'Prijsconfiguratie',
          },
          fields: [
            {
              name: 'pricingType',
              type: 'select',
              required: true,
              defaultValue: 'wordBased',
              label: {
                en: 'Pricing Type',
                nl: 'Prijstype',
              },
              options: [
                {
                  label: {
                    en: 'Word Based',
                    nl: 'Op basis van woorden',
                  },
                  value: 'wordBased',
                },
                {
                  label: {
                    en: 'Version Based',
                    nl: 'Op basis van versies',
                  },
                  value: 'versionBased',
                },
              ],
              admin: {
                description: {
                  en: 'How is the price calculated?',
                  nl: 'Hoe wordt de prijs berekend?',
                },
              },
            },
            {
              name: 'requiresRegion',
              type: 'checkbox',
              defaultValue: false,
              label: {
                en: 'Requires Region',
                nl: 'Regio Vereist',
              },
              admin: {
                condition: (_, siblingData) => siblingData?.pricingType === 'versionBased',
                description: {
                  en: 'Ask for regional/national selection',
                  nl: 'Vraag om regionaal/nationaal selectie',
                },
              },
            },
            {
              name: 'wordPricingTiers',
              type: 'array',
              label: {
                en: 'Word Pricing Tiers',
                nl: 'Woordprijsstaffels',
              },
              admin: {
                condition: (_, siblingData) => siblingData?.pricingType === 'wordBased',
                description: {
                  en: 'Pricing tiers for different word counts',
                  nl: 'Prijsstaffels voor verschillende woordaantallen',
                },
              },
              fields: [
                {
                  name: 'minWords',
                  type: 'number',
                  required: true,
                  min: 0,
                  label: {
                    en: 'Minimum Words',
                    nl: 'Minimum Woorden',
                  },
                  admin: {
                    width: '30%',
                    description: {
                      en: 'Minimum words',
                      nl: 'Minimum woorden',
                    },
                  },
                },
                {
                  name: 'maxWords',
                  type: 'number',
                  required: true,
                  min: 0,
                  label: {
                    en: 'Maximum Words',
                    nl: 'Maximum Woorden',
                  },
                  admin: {
                    width: '30%',
                    description: {
                      en: 'Maximum words (0 = unlimited)',
                      nl: 'Maximum woorden (0 = onbeperkt)',
                    },
                  },
                },
                {
                  name: 'additionalPrice',
                  type: 'number',
                  required: true,
                  min: 0,
                  label: {
                    en: 'Additional Price',
                    nl: 'Extra Prijs',
                  },
                  admin: {
                    width: '40%',
                    description: {
                      en: 'Additional price in euros',
                      nl: "Extra prijs in euro's",
                    },
                  },
                },
              ],
            },
            {
              name: 'wordPricingFormula',
              type: 'group',
              label: {
                en: 'Word Pricing Formula',
                nl: 'Woordprijsformule',
              },
              admin: {
                condition: (_, siblingData) => siblingData?.pricingType === 'wordBased',
                description: {
                  en: 'Formula for price calculation above highest tier',
                  nl: 'Formule voor prijsberekening boven hoogste staffel',
                },
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Enabled',
                    nl: 'Ingeschakeld',
                  },
                  admin: {
                    description: {
                      en: 'Use formula for large word counts',
                      nl: 'Gebruik formule voor grote aantallen woorden',
                    },
                  },
                },
                {
                  name: 'pricePerWord',
                  type: 'number',
                  min: 0,
                  defaultValue: 0.35,
                  label: {
                    en: 'Price Per Word',
                    nl: 'Prijs Per Woord',
                  },
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled === true,
                    description: {
                      en: 'Price per word above highest tier',
                      nl: 'Prijs per woord boven hoogste staffel',
                    },
                  },
                },
                {
                  name: 'explanation',
                  type: 'textarea',
                  localized: true,
                  label: {
                    en: 'Explanation',
                    nl: 'Uitleg',
                  },
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled === true,
                    description: {
                      en: 'Explanation for customers about price calculation',
                      nl: 'Uitleg voor klanten over prijsberekening',
                    },
                  },
                },
              ],
            },
            {
              name: 'versionPricing',
              type: 'array',
              label: {
                en: 'Version Pricing',
                nl: 'Versie Prijzen',
              },
              admin: {
                condition: (_, siblingData) => siblingData?.pricingType === 'versionBased',
                description: {
                  en: 'Prices per number of versions',
                  nl: 'Prijzen per aantal versies',
                },
              },
              fields: [
                {
                  name: 'versionCount',
                  type: 'number',
                  required: true,
                  min: 1,
                  label: {
                    en: 'Version Count',
                    nl: 'Aantal Versies',
                  },
                  admin: {
                    width: '25%',
                    description: {
                      en: 'Number of versions',
                      nl: 'Aantal versies',
                    },
                  },
                },
                {
                  name: 'regionalPrice',
                  type: 'number',
                  required: true,
                  min: 0,
                  label: {
                    en: 'Regional Price',
                    nl: 'Regionale Prijs',
                  },
                  admin: {
                    width: '35%',
                    condition: (_, siblingData) => siblingData?.requiresRegion === true,
                    description: {
                      en: 'Regional price',
                      nl: 'Regionale prijs',
                    },
                  },
                },
                {
                  name: 'nationalPrice',
                  type: 'number',
                  required: true,
                  min: 0,
                  label: {
                    en: 'National Price',
                    nl: 'Nationale Prijs',
                  },
                  admin: {
                    width: '35%',
                    condition: (_, siblingData) => siblingData?.requiresRegion === true,
                    description: {
                      en: 'National price',
                      nl: 'Nationale prijs',
                    },
                  },
                },
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  min: 0,
                  label: {
                    en: 'Price',
                    nl: 'Prijs',
                  },
                  admin: {
                    width: '35%',
                    condition: (_, siblingData) => siblingData?.requiresRegion === false,
                    description: {
                      en: 'Price',
                      nl: 'Prijs',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: {
            en: 'Form Configuration',
            nl: 'Formulier Configuratie',
          },
          fields: [
            {
              name: 'formSettings',
              type: 'group',
              label: {
                en: 'Form Settings',
                nl: 'Formulier Instellingen',
              },
              fields: [
                {
                  name: 'scriptPlaceholder',
                  type: 'textarea',
                  localized: true,
                  defaultValue:
                    'Plak of schrijf hier het script dat {voiceoverName} zal inspreken...',
                  label: {
                    en: 'Script Placeholder',
                    nl: 'Script Placeholder',
                  },
                  admin: {
                    description: {
                      en: 'Placeholder text for the script field',
                      nl: 'Placeholder tekst voor het script veld',
                    },
                  },
                },
                {
                  name: 'instructionsPlaceholder',
                  type: 'textarea',
                  localized: true,
                  defaultValue:
                    'Heb je wensen voor de tone-of-voice of zijn er specifieke dingen zoals de uitspraak van een woord waar {voiceoverName} op moet letten?',
                  label: {
                    en: 'Instructions Placeholder',
                    nl: 'Instructies Placeholder',
                  },
                  admin: {
                    description: {
                      en: 'Placeholder text for the instructions field',
                      nl: 'Placeholder tekst voor het instructies veld',
                    },
                  },
                },
                {
                  name: 'maxRecordingMinutes',
                  type: 'number',
                  defaultValue: 3,
                  min: 1,
                  max: 10,
                  label: {
                    en: 'Max Recording Minutes',
                    nl: 'Max Opnametijd Minuten',
                  },
                  admin: {
                    description: {
                      en: 'Maximum recording time for instructions in minutes',
                      nl: 'Maximum opnametijd voor instructies in minuten',
                    },
                  },
                },
                {
                  name: 'showVideoLinkField',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Show Video Link Field',
                    nl: 'Toon Video Link Veld',
                  },
                  admin: {
                    description: {
                      en: 'Show optional video link field',
                      nl: 'Toon optioneel video link veld',
                    },
                  },
                },
                {
                  name: 'videoLinkPlaceholder',
                  type: 'text',
                  localized: true,
                  defaultValue: 'Link naar referentievideo (optioneel)',
                  label: {
                    en: 'Video Link Placeholder',
                    nl: 'Video Link Placeholder',
                  },
                  admin: {
                    condition: (_, siblingData) => siblingData?.showVideoLinkField === true,
                    description: {
                      en: 'Placeholder for video link field',
                      nl: 'Placeholder voor video link veld',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
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
        {
          label: {
            en: 'Hidden',
            nl: 'Verborgen',
          },
          value: 'hidden',
        },
      ],
      admin: {
        position: 'sidebar',
        description: {
          en: 'Status of this production type',
          nl: 'Status van deze productiesoort',
        },
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

export default Productions;
