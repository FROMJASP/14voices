import type { CollectionConfig } from 'payload';
import { getCollectionLabels } from '../i18n';

const labels = getCollectionLabels('groups');

const Groups: CollectionConfig = {
  slug: 'groups',
  labels: {
    singular: labels.singular,
    plural: labels.plural,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'voiceoverCount', 'isActive'],
    group: 'Beheer Stemmen',
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
        en: 'Group Name',
        nl: 'Groepsnaam',
      },
      admin: {
        description: {
          en: 'Name of the cohort (e.g., "November 2025", "Summer Voices")',
          nl: 'Naam van de lichting (bijv. "November 2025", "Zomerstemmen")',
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: {
        en: 'URL Slug',
        nl: 'URL Slug',
      },
      admin: {
        description: {
          en: 'URL-friendly version (e.g., "nov-2025")',
          nl: 'URL-vriendelijke versie (bijv. "nov-2025")',
        },
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
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
        en: 'Description',
        nl: 'Beschrijving',
      },
      admin: {
        description: {
          en: 'Optional description of this cohort',
          nl: 'Optionele beschrijving van deze lichting',
        },
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: {
        en: 'Is Active',
        nl: 'Is Actief',
      },
      admin: {
        description: {
          en: 'Whether this cohort is currently active',
          nl: 'Of deze lichting momenteel actief is',
        },
      },
    },
    {
      name: 'voiceoverCount',
      type: 'number',
      virtual: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      label: {
        en: 'Voiceovers in Group',
        nl: 'Voice-overs in Groep',
      },
    },
    {
      name: 'voiceovers',
      type: 'ui',
      admin: {
        components: {
          Field: './components/admin/fields/GroupVoiceoversField#GroupVoiceoversField',
        },
      },
      label: {
        en: 'Voiceovers in this Group',
        nl: 'Voice-overs in deze Groep',
      },
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        try {
          // Only count voiceovers if we're not in a list view
          // This prevents circular queries when listing groups
          if (req.context?.preventCircularQuery) {
            doc.voiceoverCount = 0;
            return doc;
          }

          // Count voiceovers in this group
          const voiceovers = await req.payload.find({
            collection: 'voiceovers',
            where: {
              group: {
                equals: doc.id,
              },
            },
            limit: 0,
            depth: 0, // Don't populate relationships
          });

          doc.voiceoverCount = voiceovers.totalDocs;
        } catch (error) {
          console.error('Error counting voiceovers for group:', error);
          doc.voiceoverCount = 0;
        }

        return doc;
      },
    ],
  },
};

export default Groups;
