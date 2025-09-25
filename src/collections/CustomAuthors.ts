import type { CollectionConfig } from 'payload';

const CustomAuthors: CollectionConfig = {
  slug: 'custom-authors',
  labels: {
    singular: {
      en: 'Custom Author',
      nl: 'Aangepaste Auteur',
    },
    plural: {
      en: 'Custom Authors',
      nl: 'Aangepaste Auteurs',
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'displayPrefix', 'url', 'active'],
    group: {
      en: 'Site Builder',
      nl: 'Site Builder',
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        en: 'Name',
        nl: 'Naam',
      },
      admin: {
        description: {
          en: 'The display name of the custom author (e.g., Stemacteren.nl)',
          nl: 'De weergavenaam van de aangepaste auteur (bijv. Stemacteren.nl)',
        },
      },
    },
    {
      name: 'displayPrefix',
      type: 'text',
      required: true,
      defaultValue: 'Via',
      label: {
        en: 'Display Prefix',
        nl: 'Weergave Voorvoegsel',
      },
      admin: {
        description: {
          en: 'Text shown before the author name (e.g., "Via" for "Via Stemacteren.nl")',
          nl: 'Tekst die voor de auteurnaam wordt getoond (bijv. "Via" voor "Via Stemacteren.nl")',
        },
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: {
        en: 'Website URL',
        nl: 'Website URL',
      },
      admin: {
        description: {
          en: 'The URL to open when clicking the author name',
          nl: 'De URL die wordt geopend bij het klikken op de auteurnaam',
        },
      },
      validate: (value: string) => {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      },
    },
    {
      name: 'style',
      type: 'group',
      label: {
        en: 'Style Settings',
        nl: 'Stijl Instellingen',
      },
      fields: [
        {
          name: 'color',
          type: 'text',
          defaultValue: '#28ade6',
          label: {
            en: 'Text Color',
            nl: 'Tekst Kleur',
          },
          admin: {
            description: {
              en: 'Hex color code for the author name (e.g., #28ade6)',
              nl: 'Hex kleurcode voor de auteurnaam (bijv. #28ade6)',
            },
          },
        },
        {
          name: 'fontWeight',
          type: 'select',
          defaultValue: 'medium',
          label: {
            en: 'Font Weight',
            nl: 'Lettertype Gewicht',
          },
          options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Medium', value: 'medium' },
            { label: 'Semibold', value: 'semibold' },
            { label: 'Bold', value: 'bold' },
          ],
        },
        {
          name: 'underline',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Show Underline',
            nl: 'Onderstreping Tonen',
          },
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: {
        en: 'Active',
        nl: 'Actief',
      },
      admin: {
        description: {
          en: 'Whether this custom author is available for selection',
          nl: 'Of deze aangepaste auteur beschikbaar is voor selectie',
        },
      },
    },
  ],
};

export default CustomAuthors;