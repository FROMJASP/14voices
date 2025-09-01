import type { CollectionConfig } from 'payload';
import type { TextFieldSingleValidation } from 'payload';
import { getCollectionLabels } from '../i18n';

const labels = getCollectionLabels('voiceovers');

const Voiceovers: CollectionConfig = {
  slug: 'voiceovers',
  labels: {
    singular: labels.singular,
    plural: labels.plural,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'availability', 'styleTags', 'demos', 'group'],
    listSearchableFields: ['name', 'description'],
    group: 'Content',
    pagination: {
      defaultLimit: 10,
      limits: [10, 25, 50, 100],
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
                en: 'First Name',
                nl: 'Voornaam',
              },
              admin: {
                description: {
                  en: 'Only the first name of the voiceover',
                  nl: 'Alleen de voornaam van de voice-over',
                },
                width: '25%',
                components: {
                  Cell: './components/admin/cells/NameCell#NameCell',
                },
              },
              validate: (async (value, { req, id }) => {
                if (!value) return 'Name is required';

                const firstName = value.split(' ')[0].toLowerCase();

                // Check for existing voiceovers with the same first name
                const existingVoiceovers = await req.payload.find({
                  collection: 'voiceovers',
                  where: {
                    id: {
                      not_equals: id || '0', // Exclude current record when updating
                    },
                  },
                  limit: 1000,
                });

                const duplicateFirstNames = existingVoiceovers.docs.filter((vo: any) => {
                  const existingFirstName = vo.name?.split(' ')[0].toLowerCase();
                  return existingFirstName === firstName;
                });

                if (duplicateFirstNames.length > 0) {
                  const duplicateNames = duplicateFirstNames.map((vo: any) => vo.name).join(', ');
                  return `WARNING: Another voiceover with the same first name "${firstName}" already exists: ${duplicateNames}. This will cause URL conflicts! Please use a different first name or add a middle initial/nickname.`;
                }

                return true;
              }) as TextFieldSingleValidation,
            },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: {
          en: "Every voiceover has its own page and this the URL that will be automatically generated based on the first name of the voiceover. E.g. 'peter' becomes 14voices.com/peter",
          nl: "Iedere voice-over heeft zijn/haar eigen pagina en dit is de URL die automatisch gegeneerd wordt op basis van de voornaam. 'Peter' wordt bijvoorbeeld 14voices.com/peter",
        },
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.name) {
              // Extract first name only
              const firstName = data.name.split(' ')[0];
              return firstName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
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
        en: 'Bio',
        nl: 'Bio',
      },
      admin: {
        description: {
          en: "Optional bio shown on the voiceover's page",
          nl: 'Optionele bio getoond op de pagina van de voice-over',
        },
      },
    },
    {
      name: 'profilePhoto',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Profile Photo',
        nl: 'Profielfoto',
      },
      admin: {
        description: {
          en: 'Profile photo of the voiceover',
          nl: 'Foto van de voiceover',
        },
        disableListColumn: true,
      },
      validate: (value: unknown, { data }: { data?: Record<string, unknown> }) => {
        if (data?.status === 'active' && !value) {
          return 'A profile photo is required for active voiceovers';
        }
        return true;
      },
    },
    {
      name: 'additionalPhotos',
      type: 'array',
      label: {
        en: 'Additional Photos',
        nl: "Extra foto's",
      },
      admin: {
        description: {
          en: 'Additional profile photos',
          nl: "Extra profielfoto's",
        },
      },
      labels: {
        singular: {
          en: 'Additional Photo',
          nl: 'Extra foto',
        },
        plural: {
          en: 'Additional Photos',
          nl: "Extra foto's",
        },
      },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional caption for this photo',
          },
        },
      ],
    },
    {
      name: 'styleTags',
      type: 'array',
      required: true,
      minRows: 3,
      admin: {
        description: {
          en: 'Select at least 3 style tags',
          nl: 'Selecteer minstens 3 style tags',
        },
        components: {
          Cell: './components/admin/cells/StyleTagsCell#StyleTagsCell',
        },
      },
      fields: [
        {
          name: 'tag',
          type: 'select',
          required: true,
          hasMany: false,
          options: [
            { label: 'Autoriteit', value: 'autoriteit' },
            { label: 'Jeugdig & Fris', value: 'jeugdig-fris' },
            { label: 'Kwaliteit', value: 'kwaliteit' },
            { label: 'Stoer', value: 'stoer' },
            { label: 'Warm & Donker', value: 'warm-donker' },
            { label: 'Zakelijk', value: 'zakelijk' },
            { label: 'Eigentijds', value: 'eigentijds' },
            { label: 'Gezellig & Genieten', value: 'gezellig-genieten' },
            { label: 'Helder', value: 'helder' },
            { label: 'Naturel', value: 'naturel' },
            { label: 'Urban', value: 'urban' },
            { label: 'Vernieuwend', value: 'vernieuwend' },
            { label: 'Vriendelijk & Vrolijk', value: 'vriendelijk-vrolijk' },
            { label: 'Custom', value: 'custom' },
          ],
        },
        {
          name: 'customTag',
          type: 'text',
          admin: {
            condition: (_data, siblingData) => siblingData?.tag === 'custom',
            description: 'Enter your custom tag',
          },
        },
      ],
    },
    {
      name: 'fullDemoReel',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Full demo reel audio file',
        width: '20%',
      },
      validate: (value: unknown, { data }: { data?: Record<string, unknown> }) => {
        const hasAnyDemo = value || data?.commercialsDemo || data?.narrativeDemo;
        if (data?.status === 'active' && !hasAnyDemo) {
          return 'At least one audio demo is required for active voiceovers';
        }
        return true;
      },
    },
    {
      name: 'commercialsDemo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Commercials demo audio file',
        width: '20%',
      },
    },
    {
      name: 'narrativeDemo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Narrative demo audio file',
        width: '20%',
      },
    },
    {
      name: 'demos',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Cell: './components/admin/cells/AudioDemoCell#AudioDemoCell',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Active (Main Page)', value: 'active' },
        { label: 'Draft (Not Ready)', value: 'draft' },
        { label: 'More Voices (uit het archief)', value: 'more-voices' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        description: {
          en: "Controls where this voiceover appears on the website. More Voices (uit het archief) = Deze voiceover wordt getoond in de 'uit het archief' sectie onder de 14 stemmen die in het groot worden getoond",
          nl: "Met de status bepaal je of de voice-over wel of niet wordt getoond op de website. Voice-overs die tot een eerdere lichting behoren en nog steeds op de website willen staan, kun je als 'More voices (uit het archief)' invullen. Zij worden dan op een andere plek dan de voorkant van de website getoond.",
        },
        width: '15%',
        components: {
          Cell: './components/admin/cells/StatusCell#StatusCell',
        },
      },
    },
    {
      name: 'group',
      type: 'relationship',
      relationTo: 'groups',
      required: true,
      label: {
        en: 'Group',
        nl: 'Groep',
      },
      admin: {
        description: {
          en: 'The group/cohort this voiceover belongs to',
          nl: 'De groep/lichting waar deze voice-over toe behoort',
        },
        width: '20%',
      },
    },
    {
      type: 'group',
      name: 'availability',
      label: {
        en: 'Availability',
        nl: 'Beschikbaarheid',
      },
      admin: {
        components: {
          Cell: './components/admin/cells/AvailabilityCell#AvailabilityCell',
        },
      },
      fields: [
        {
          name: 'availabilityWarning',
          type: 'ui',
          admin: {
            condition: (data) => data?.status === 'draft' || data?.status === 'archived',
            components: {
              Field: {
                path: './components/admin/fields/WarningMessage#WarningMessage',
                clientProps: {
                  message: {
                    en: 'Change the status in order to set the availability',
                    nl: 'Pas de status aan om de beschikbaarheid in te vullen.',
                  },
                },
              },
            },
          },
        },
        {
          name: 'isAvailable',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Is Available',
            nl: 'Is beschikbaar',
          },
          admin: {
            description: {
              en: 'Is this voiceover currently available for bookings?',
              nl: 'Is deze voice-over beschikbaar om geboekt te worden? Zo niet, uncheck dan deze box zodat bezoekers weten dat deze stem tijdelijk niet geboekt kan worden.',
            },
            condition: (data) => {
              if (data?.status === 'draft' || data?.status === 'archived') {
                return false;
              }
              return true;
            },
            readOnly: false,
          },
        },
        {
          name: 'unavailableFrom',
          type: 'date',
          admin: {
            condition: (data) => !data?.availability?.isAvailable,
            description: 'Start date of unavailability (e.g., vacation start)',
          },
        },
        {
          name: 'unavailableUntil',
          type: 'date',
          admin: {
            condition: (data) => !data?.availability?.isAvailable,
            description: 'End date of unavailability (auto-reactivates after this date)',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Force isAvailable to false when status is draft or archived
        if (data?.status === 'draft' || data?.status === 'archived') {
          if (!data.availability) {
            data.availability = {};
          }
          data.availability.isAvailable = false;
        }

        // Auto-reactivate based on availability dates
        if (
          data?.availability?.unavailableUntil &&
          data?.status !== 'draft' &&
          data?.status !== 'archived'
        ) {
          const today = new Date();
          const unavailableUntil = new Date(data.availability.unavailableUntil);
          if (today > unavailableUntil) {
            data.availability.isAvailable = true;
            data.availability.unavailableFrom = null;
            data.availability.unavailableUntil = null;
          }
        }
        return data;
      },
    ],
  },
};

export default Voiceovers;
