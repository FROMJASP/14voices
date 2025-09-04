import type { GlobalConfig } from 'payload';

export const FAQSettings: GlobalConfig = {
  slug: 'faq-settings',
  label: {
    en: 'FAQ Settings',
    nl: 'FAQ Instellingen',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  admin: {
    group: {
      en: 'Site Builder',
      nl: 'Site Builder',
    },
    description: {
      en: 'Configure how the FAQ section appears on the homepage',
      nl: 'Configureer hoe de FAQ sectie op de homepage wordt weergegeven',
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            en: 'Settings',
            nl: 'Instellingen',
          },
          fields: [
            {
              name: 'settings',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Enable FAQ Section',
                    nl: 'FAQ Sectie Tonen',
                  },
                  admin: {
                    description: {
                      en: 'Show the FAQ section on the homepage',
                      nl: 'Toon de FAQ sectie op de homepage',
                    },
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'Veelgestelde vragen',
                  label: {
                    en: 'Section Title',
                    nl: 'Sectie Titel',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description: {
                      en: 'Title displayed above the FAQ section',
                      nl: 'Titel die boven de FAQ sectie wordt weergegeven',
                    },
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  defaultValue:
                    'Vind snel antwoorden op de meest gestelde vragen over onze voice-over diensten.',
                  label: {
                    en: 'Section Description',
                    nl: 'Sectie Beschrijving',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description: {
                      en: 'Optional description text below the title',
                      nl: 'Optionele beschrijvingstekst onder de titel',
                    },
                  },
                },
                {
                  name: 'itemsToShow',
                  type: 'number',
                  defaultValue: 10,
                  min: 1,
                  max: 50,
                  label: {
                    en: 'Items to Display',
                    nl: 'Aantal te Tonen Items',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description: {
                      en: 'Maximum number of FAQ items to display on the homepage (1-50)',
                      nl: 'Maximaal aantal FAQ items om weer te geven op de homepage (1-50)',
                    },
                  },
                },
                {
                  name: 'showCategories',
                  type: 'checkbox',
                  defaultValue: false,
                  label: {
                    en: 'Show Category Filter',
                    nl: 'Categorie Filter Tonen',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description: {
                      en: 'Allow visitors to filter FAQ items by category',
                      nl: 'Sta bezoekers toe om FAQ items te filteren op categorie',
                    },
                  },
                },
                {
                  name: 'expandFirst',
                  type: 'checkbox',
                  defaultValue: false,
                  label: {
                    en: 'Expand First Item',
                    nl: 'Eerste Item Automatisch Uitklappen',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description: {
                      en: 'Automatically expand the first FAQ item when the section loads',
                      nl: 'Klap automatisch het eerste FAQ item uit wanneer de sectie wordt geladen',
                    },
                  },
                },
                {
                  name: 'multipleOpen',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Allow Multiple Open',
                    nl: 'Meerdere Items Tegelijk Open',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description: {
                      en: 'Allow multiple FAQ items to be expanded at the same time',
                      nl: 'Sta toe dat meerdere FAQ items tegelijk zijn uitgeklapt',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: {
            en: 'Categories',
            nl: 'Categorieën',
          },
          fields: [
            {
              name: 'categories',
              type: 'array',
              label: {
                en: 'FAQ Categories',
                nl: 'FAQ Categorieën',
              },
              admin: {
                description: {
                  en: 'Define categories for organizing FAQ items. Drag to reorder.',
                  nl: 'Definieer categorieën voor het organiseren van FAQ items. Sleep om de volgorde te wijzigen.',
                },
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: {
                    en: 'Category Name',
                    nl: 'Categorie Naam',
                  },
                  admin: {
                    description: {
                      en: 'Display name for the category',
                      nl: 'Weergavenaam voor de categorie',
                    },
                  },
                },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                  label: {
                    en: 'Slug',
                    nl: 'Slug',
                  },
                  admin: {
                    description: {
                      en: 'URL-friendly identifier (auto-generated from name)',
                      nl: 'URL-vriendelijke identifier (automatisch gegenereerd van naam)',
                    },
                  },
                  hooks: {
                    beforeValidate: [
                      ({ value, data }) => {
                        if (!value && data?.name) {
                          return data.name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-|-$/g, '');
                        }
                        return value;
                      },
                    ],
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: {
                    en: 'Description',
                    nl: 'Beschrijving',
                  },
                  admin: {
                    description: {
                      en: 'Optional description of what types of questions belong in this category',
                      nl: 'Optionele beschrijving van welke soorten vragen bij deze categorie horen',
                    },
                  },
                },
                {
                  name: 'published',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Published',
                    nl: 'Gepubliceerd',
                  },
                  admin: {
                    description: {
                      en: 'Whether this category is visible on the website',
                      nl: 'Of deze categorie zichtbaar is op de website',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
