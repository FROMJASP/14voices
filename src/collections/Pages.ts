import type { CollectionConfig } from 'payload';
import { formatSlug } from '../utilities/formatSlug';
import { pageEditorConfig } from '../fields/lexical/pageEditorConfig';
import { heroDescriptionConfig } from '../fields/lexical/heroDescriptionConfig';
import { heroTitleConfig } from '../fields/lexical/heroTitleConfig';
import { getCollectionLabels } from '../i18n';

const labels = getCollectionLabels('pages');

const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: labels.singular,
    plural: labels.plural,
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'title', 'status', 'updatedAt'],
    listSearchableFields: ['title', 'slug'],
    group: 'Website',
    livePreview: {
      url: ({ data }) => {
        const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || '';
        // For home page, use root URL
        const path = data.slug === 'home' ? '' : data.slug;
        // Pass the proper parameters for live preview
        return `${baseURL}/${path}`;
      },
    },
    components: {
      beforeListTable: ['/components/admin/views/PagesList#PagesList'],
      edit: {
        SaveButton: '/components/admin/SaveDraftControls#SaveDraftControls',
      },
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin' || user?.role === 'editor') return true;

      // Public can only see published pages
      return {
        _or: [
          {
            status: {
              equals: 'published',
            },
          },
          {
            status: {
              exists: false,
            },
          },
        ],
      };
    },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => {
      // Only admins can delete pages
      if (user?.role !== 'admin') return false;

      // Prevent deletion of home page
      return {
        slug: {
          not_equals: 'home',
        },
      };
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 300000, // 5 minutes - only autosave every 5 minutes instead of on every change
      },
    },
    maxPerDoc: 20, // Limit the number of versions per document
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            en: 'Content',
            nl: 'Inhoud',
          },
          fields: [
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              required: true,
              label: {
                en: 'Slug',
                nl: 'URL-pad',
              },
              admin: {
                description: {
                  en: 'URL path for this page (e.g., "about-us")',
                  nl: 'URL-pad voor deze pagina (bijv. "over-ons")',
                },
                components: {
                  Cell: '/components/admin/cells/PageSlugCell#PageSlugCell',
                },
              },
              validate: (value: unknown) => {
                if (!value) return 'Slug is required';
                if (typeof value !== 'string') return 'Slug must be a string';
                // Prevent reserved routes
                const reserved = ['api', 'admin', '_next', 'payload'];
                if (reserved.includes(value)) {
                  return `"${value}" is a reserved route`;
                }
                return true;
              },
              hooks: {
                beforeValidate: [formatSlug('title')],
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              label: {
                en: 'Title',
                nl: 'Titel',
              },
              admin: {
                description: {
                  en: 'Page title displayed in browser tabs and search results',
                  nl: 'Paginatitel weergegeven in browsertabbladen en zoekresultaten',
                },
                components: {
                  Cell: '/components/admin/cells/PageTitleCell#PageTitleCell',
                },
              },
            },
            {
              name: 'pageBlocks',
              type: 'array',
              label: {
                en: 'Page Blocks',
                nl: 'Pagina Blokken',
              },
              labels: {
                singular: {
                  en: 'Block',
                  nl: 'Blok',
                },
                plural: {
                  en: 'Blocks',
                  nl: 'Blokken',
                },
              },
              admin: {
                condition: (data) => data.slug === 'home',
                description: {
                  en: 'Add blocks to build your page. Drag to reorder.',
                  nl: 'Voeg blokken toe om je pagina te bouwen. Sleep om te herschikken.',
                },
                initCollapsed: false,
                isSortable: true,
                components: {
                  RowLabel: '/components/admin/cells/BlockLabel#BlockLabel',
                },
              },
              fields: [
                {
                  name: 'blockType',
                  type: 'select',
                  required: true,
                  label: {
                    en: 'Block Type',
                    nl: 'Blok Type',
                  },
                  options: [
                    { label: { en: 'Hero', nl: 'Hero' }, value: 'hero' },
                    { label: { en: 'Products', nl: 'Producten' }, value: 'voiceover' },
                    { label: { en: 'Blog', nl: 'Blog' }, value: 'linkToBlog' },
                  ],
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Visible',
                    nl: 'Zichtbaar',
                  },
                },
              ],
              defaultValue: [
                { blockType: 'hero', enabled: true },
                { blockType: 'voiceover', enabled: true },
                { blockType: 'linkToBlog', enabled: true },
              ],
            },
            {
              name: 'editBlocksTitle',
              type: 'ui',
              admin: {
                condition: (data) => data.slug === 'home',
                components: {
                  Field: '/components/admin/fields/EditBlocksTitle#EditBlocksTitle',
                },
              },
            },
            {
              type: 'collapsible',
              label: 'Hero',
              admin: {
                condition: (data) => data.slug === 'home',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'hero',
                  type: 'group',
                  fields: [
                    {
                      name: 'layout',
                      type: 'select',
                      defaultValue: 'variant1',
                      label: {
                        en: 'Hero Layout',
                        nl: 'Hero Layout',
                      },
                      options: [
                        {
                          label: { en: 'Hero variant 1', nl: 'Hero variant 1' },
                          value: 'variant1',
                        },
                        // More layout variants can be added here in the future
                        // { label: { en: 'Hero variant 2', nl: 'Hero variant 2' }, value: 'variant2' },
                      ],
                      admin: {
                        description: {
                          en: 'Choose the layout style for the hero section',
                          nl: 'Kies de layout stijl voor de hero sectie',
                        },
                      },
                    },
                    // Legacy type field - hidden but maintained for backwards compatibility
                    {
                      name: 'type',
                      type: 'text',
                      defaultValue: 'homepage',
                      admin: {
                        hidden: true,
                      },
                    },
                    // Homepage-specific fields
                    {
                      name: 'processSteps',
                      type: 'array',
                      label: {
                        en: 'Process Steps',
                        nl: 'Processtappen',
                      },
                      admin: {
                        condition: (_data, siblingData) =>
                          siblingData?.layout === 'variant1' || siblingData?.type === 'homepage',
                        description: {
                          en: 'The small process steps displayed at the top of the hero',
                          nl: 'De kleine processtappen die bovenaan de hero worden weergegeven',
                        },
                        initCollapsed: false,
                      },
                      defaultValue: [
                        { text: '1. Kies de stem' },
                        { text: '2. Upload script' },
                        { text: '3. Ontvang audio' },
                      ],
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          required: true,
                          label: {
                            en: 'Text',
                            nl: 'Tekst',
                          },
                          admin: {
                            description: {
                              en: 'Text for this step (e.g., "1. Choose the voice")',
                              nl: 'Tekst voor deze stap (bijv. "1. Kies de stem")',
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'title',
                      type: 'textarea',
                      label: {
                        en: 'Hero Title (Legacy)',
                        nl: 'Hero Titel (Oud)',
                      },
                      admin: {
                        condition: (_data, siblingData) => siblingData?.type !== 'none',
                        description: {
                          en: 'Legacy plain text title - will be migrated to rich text',
                          nl: 'Oude platte tekst titel - wordt gemigreerd naar rich text',
                        },
                        rows: 3,
                        hidden: true,
                      },
                    },
                    {
                      name: 'titleRichText',
                      type: 'richText',
                      editor: heroTitleConfig,
                      label: {
                        en: 'Hero Title',
                        nl: 'Hero Titel',
                      },
                      admin: {
                        condition: (_data, siblingData) => siblingData?.type !== 'none',
                        description: {
                          en: 'Hero title with formatting. Use the <code> button to highlight text in brand color.',
                          nl: 'Hero titel met opmaak. Gebruik de <code> knop om tekst in merkkleur te markeren.',
                        },
                      },
                    },
                    {
                      name: 'subtitle',
                      type: 'text',
                      label: {
                        en: 'Subtitle',
                        nl: 'Ondertitel',
                      },
                      admin: {
                        condition: (_data, siblingData) =>
                          siblingData?.type !== 'none' && siblingData?.type !== 'homepage',
                      },
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: {
                        en: 'Description (Legacy)',
                        nl: 'Beschrijving (Oud)',
                      },
                      admin: {
                        condition: (_data, siblingData) =>
                          siblingData?.layout === 'variant1' || siblingData?.type === 'homepage',
                        description: {
                          en: 'Legacy plain text description - will be migrated to rich text',
                          nl: 'Oude platte tekst beschrijving - wordt gemigreerd naar rich text',
                        },
                        rows: 4,
                        hidden: true,
                      },
                    },
                    {
                      name: 'descriptionRichText',
                      type: 'richText',
                      editor: heroDescriptionConfig,
                      label: {
                        en: 'Description',
                        nl: 'Beschrijving',
                      },
                      admin: {
                        condition: (_data, siblingData) =>
                          siblingData?.layout === 'variant1' || siblingData?.type === 'homepage',
                        description: {
                          en: 'Hero description with formatting. Use the <code> button to highlight text in brand color. You can also use bold, italic, and links.',
                          nl: 'Hero beschrijving met opmaak. Gebruik de <code> knop om tekst in merkkleur te markeren. Je kunt ook vet, cursief en links gebruiken.',
                        },
                      },
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      label: {
                        en: 'Image',
                        nl: 'Afbeelding',
                      },
                      admin: {
                        condition: (_data, siblingData) => siblingData?.type === 'image',
                      },
                    },
                    {
                      name: 'heroImage',
                      type: 'upload',
                      relationTo: 'media',
                      label: {
                        en: 'Hero Image',
                        nl: 'Hero Afbeelding',
                      },
                      admin: {
                        condition: (_data, siblingData) =>
                          siblingData?.layout === 'variant1' || siblingData?.type === 'homepage',
                        description: {
                          en: 'Main image displayed in the oval-shaped container on the right (recommended: high-quality portrait photo, minimum 400x500px)',
                          nl: 'Hoofdafbeelding weergegeven in de ovaalvormige container rechts (aanbevolen: hoogwaardige portretfoto, minimaal 400x500px)',
                        },
                      },
                    },
                    {
                      name: 'videoUrl',
                      type: 'text',
                      label: {
                        en: 'Video URL',
                        nl: 'Video URL',
                      },
                      admin: {
                        condition: (_data, siblingData) => siblingData?.type === 'video',
                        description: {
                          en: 'YouTube or Vimeo URL',
                          nl: 'YouTube of Vimeo URL',
                        },
                      },
                    },
                    // Homepage buttons
                    {
                      name: 'primaryButton',
                      type: 'group',
                      label: {
                        en: 'Primary Button',
                        nl: 'Primaire Knop',
                      },
                      admin: {
                        condition: (_data, siblingData) =>
                          siblingData?.layout === 'variant1' || siblingData?.type === 'homepage',
                      },
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          required: true,
                          defaultValue: 'Ontdek stemmen',
                          label: {
                            en: 'Button Text',
                            nl: 'Knop Tekst',
                          },
                          admin: {
                            description: {
                              en: 'Text for the primary call-to-action button',
                              nl: 'Tekst voor de primaire call-to-action knop',
                            },
                          },
                        },
                        {
                          name: 'url',
                          type: 'text',
                          required: true,
                          defaultValue: '#voiceovers',
                          label: {
                            en: 'Button URL',
                            nl: 'Knop URL',
                          },
                          admin: {
                            description: {
                              en: 'URL for the primary button (e.g., #voiceovers, /voiceovers)',
                              nl: 'URL voor de primaire knop (bijv. #voiceovers, /voiceovers)',
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'secondaryButton',
                      type: 'group',
                      label: {
                        en: 'Secondary Button',
                        nl: 'Secundaire Knop',
                      },
                      admin: {
                        condition: (_data, siblingData) =>
                          siblingData?.layout === 'variant1' || siblingData?.type === 'homepage',
                      },
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          required: true,
                          defaultValue: 'Hoe wij werken',
                          label: {
                            en: 'Button Text',
                            nl: 'Knop Tekst',
                          },
                          admin: {
                            description: {
                              en: 'Text for the secondary button',
                              nl: 'Tekst voor de secundaire knop',
                            },
                          },
                        },
                        {
                          name: 'url',
                          type: 'text',
                          required: true,
                          defaultValue: '/hoe-het-werkt',
                          label: {
                            en: 'Button URL',
                            nl: 'Knop URL',
                          },
                          admin: {
                            description: {
                              en: 'URL for the secondary button',
                              nl: 'URL voor de secundaire knop',
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'cta',
                      type: 'group',
                      label: {
                        en: 'Call to Action',
                        nl: 'Call to Action',
                      },
                      admin: {
                        condition: (_data, siblingData) =>
                          siblingData?.type !== 'none' && siblingData?.type !== 'homepage',
                      },
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          label: {
                            en: 'Text',
                            nl: 'Tekst',
                          },
                        },
                        {
                          name: 'link',
                          type: 'text',
                          label: {
                            en: 'Link',
                            nl: 'Link',
                          },
                        },
                        {
                          name: 'style',
                          type: 'select',
                          defaultValue: 'primary',
                          label: {
                            en: 'Style',
                            nl: 'Stijl',
                          },
                          options: [
                            { label: { en: 'Primary', nl: 'Primair' }, value: 'primary' },
                            { label: { en: 'Secondary', nl: 'Secundair' }, value: 'secondary' },
                            { label: { en: 'Outline', nl: 'Omlijnd' }, value: 'outline' },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'heroImageURL',
                      type: 'text',
                      virtual: true,
                      admin: {
                        hidden: true,
                      },
                      hooks: {
                        afterRead: [
                          async ({ siblingData, req }) => {
                            // Only process if we have a heroImage
                            if (!siblingData?.heroImage) return null;

                            // If heroImage is just an ID string, fetch the media
                            if (typeof siblingData.heroImage === 'string') {
                              try {
                                const media = await req.payload.findByID({
                                  collection: 'media',
                                  id: siblingData.heroImage,
                                  depth: 0,
                                });

                                if (media?.url) {
                                  return media.url;
                                } else if (media?.filename) {
                                  const publicUrl = process.env.S3_PUBLIC_URL;
                                  if (publicUrl) {
                                    return `${publicUrl}/media/${media.filename}`;
                                  }
                                  return `/media/${media.filename}`;
                                }
                              } catch (error) {
                                console.error('Error fetching hero image media:', error);
                              }
                            }
                            // If heroImage is already populated as an object
                            else if (typeof siblingData.heroImage === 'object') {
                              const heroImageObj = siblingData.heroImage as any;

                              if (heroImageObj.url) {
                                return heroImageObj.url;
                              } else if (heroImageObj.filename) {
                                const publicUrl = process.env.S3_PUBLIC_URL;
                                if (publicUrl) {
                                  return `${publicUrl}/media/${heroImageObj.filename}`;
                                }
                                return `/media/${heroImageObj.filename}`;
                              }
                            }

                            return null;
                          },
                        ],
                      },
                    },
                    // Homepage stats
                    {
                      name: 'stats',
                      type: 'array',
                      label: {
                        en: 'Statistics',
                        nl: 'Statistieken',
                      },
                      admin: {
                        condition: (_data, siblingData) =>
                          siblingData?.layout === 'variant1' || siblingData?.type === 'homepage',
                        description: {
                          en: 'Statistics displayed below the buttons',
                          nl: 'Statistieken weergegeven onder de knoppen',
                        },
                        initCollapsed: true,
                      },
                      defaultValue: [
                        { number: '14', label: 'Stemacteurs' },
                        { number: '<48u', label: 'Snelle levering' },
                        { number: '9.1/10', label: 'Klantbeoordeling' },
                      ],
                      fields: [
                        {
                          name: 'number',
                          type: 'text',
                          required: true,
                          label: {
                            en: 'Number',
                            nl: 'Getal',
                          },
                          admin: {
                            description: {
                              en: 'The statistic number/value (e.g., "14", "<48u", "9.1/10")',
                              nl: 'Het statistiek getal/waarde (bijv. "14", "<48u", "9.1/10")',
                            },
                          },
                        },
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                          label: {
                            en: 'Label',
                            nl: 'Label',
                          },
                          admin: {
                            description: {
                              en: 'The statistic label (e.g., "Voice actors", "Fast delivery")',
                              nl: 'Het statistiek label (bijv. "Stemacteurs", "Snelle levering")',
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
              type: 'collapsible',
              label: 'Products',
              admin: {
                condition: (data) => data.slug === 'home',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'voiceover',
                  type: 'group',
                  admin: {
                    description: {
                      en: 'Settings for the voice-over section on the homepage',
                      nl: 'Instellingen voor de voice-over sectie op de homepage',
                    },
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      defaultValue: 'Onze Stemacteurs',
                      label: {
                        en: 'Title',
                        nl: 'Titel',
                      },
                      admin: {
                        description: {
                          en: 'The title displayed above the voice actors grid',
                          nl: 'De titel die boven het stemacteurs grid wordt weergegeven',
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Blog',
              admin: {
                condition: (data) => data.slug === 'home',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'linkToBlog',
                  type: 'group',
                  admin: {
                    description: {
                      en: 'Settings for the link-to-blog section on the homepage',
                      nl: 'Instellingen voor de link-to-blog sectie op de homepage',
                    },
                  },
                  fields: [
                    {
                      name: 'layout',
                      type: 'select',
                      defaultValue: 'variant1',
                      label: {
                        en: 'Section Layout',
                        nl: 'Sectie Layout',
                      },
                      options: [
                        {
                          label: { en: 'Link-to-Blog variant 1', nl: 'Link-to-Blog variant 1' },
                          value: 'variant1',
                        },
                        // More layout variants can be added here in the future
                        // { label: { en: 'Link-to-Blog variant 2', nl: 'Link-to-Blog variant 2' }, value: 'variant2' },
                      ],
                      admin: {
                        description: {
                          en: 'Choose the layout style for this section',
                          nl: 'Kies de layout stijl voor deze sectie',
                        },
                      },
                    },
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                      label: {
                        en: 'Enable Section',
                        nl: 'Sectie Inschakelen',
                      },
                      admin: {
                        description: {
                          en: 'Show or hide this section on the homepage',
                          nl: 'Toon of verberg deze sectie op de homepage',
                        },
                      },
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                      label: {
                        en: 'Section Image',
                        nl: 'Sectie Afbeelding',
                      },
                      admin: {
                        description: {
                          en: 'Main image for the section (recommended: high-quality landscape photo)',
                          nl: 'Hoofdafbeelding voor de sectie (aanbevolen: hoogwaardige landschapsfoto)',
                        },
                      },
                    },
                    {
                      name: 'imageGrayscale',
                      type: 'checkbox',
                      defaultValue: true,
                      label: {
                        en: 'Apply Grayscale Filter',
                        nl: 'Grijstinten Filter Toepassen',
                      },
                      admin: {
                        description: {
                          en: 'Apply a grayscale filter to the image',
                          nl: 'Pas een grijstinten filter toe op de afbeelding',
                        },
                      },
                    },
                    {
                      name: 'heading',
                      type: 'textarea',
                      required: true,
                      defaultValue:
                        'The Lyra ecosystem brings together our models, products and platforms.',
                      label: {
                        en: 'Heading',
                        nl: 'Koptekst',
                      },
                      admin: {
                        rows: 2,
                        description: {
                          en: 'Main heading text for the section',
                          nl: 'Hoofdkoptekst voor de sectie',
                        },
                      },
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      required: true,
                      defaultValue:
                        'Lyra is evolving to be more than just the models. It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate.',
                      label: {
                        en: 'Description',
                        nl: 'Beschrijving',
                      },
                      admin: {
                        rows: 3,
                        description: {
                          en: 'Supporting description text',
                          nl: 'Ondersteunende beschrijvingstekst',
                        },
                      },
                    },
                    {
                      name: 'button',
                      type: 'group',
                      label: {
                        en: 'Button Settings',
                        nl: 'Knop Instellingen',
                      },
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          required: true,
                          defaultValue: 'Learn More',
                          label: {
                            en: 'Button Text',
                            nl: 'Knop Tekst',
                          },
                        },
                        {
                          name: 'url',
                          type: 'text',
                          required: true,
                          defaultValue: '/blog',
                          label: {
                            en: 'Button URL',
                            nl: 'Knop URL',
                          },
                          admin: {
                            description: {
                              en: 'URL to navigate to when button is clicked (e.g., /blog, /about)',
                              nl: 'URL om naar te navigeren wanneer op de knop wordt geklikt (bijv. /blog, /over-ons)',
                            },
                          },
                        },
                        {
                          name: 'variant',
                          type: 'select',
                          defaultValue: 'secondary',
                          label: {
                            en: 'Button Style',
                            nl: 'Knop Stijl',
                          },
                          options: [
                            { label: { en: 'Primary', nl: 'Primair' }, value: 'default' },
                            { label: { en: 'Secondary', nl: 'Secundair' }, value: 'secondary' },
                            { label: { en: 'Outline', nl: 'Omlijnd' }, value: 'outline' },
                            { label: { en: 'Ghost', nl: 'Transparant' }, value: 'ghost' },
                            { label: { en: 'Link', nl: 'Link' }, value: 'link' },
                          ],
                          admin: {
                            description: {
                              en: 'Visual style of the button',
                              nl: 'Visuele stijl van de knop',
                            },
                          },
                        },
                        {
                          name: 'showIcon',
                          type: 'checkbox',
                          defaultValue: true,
                          label: {
                            en: 'Show Arrow Icon',
                            nl: 'Pijlicoon Tonen',
                          },
                          admin: {
                            description: {
                              en: 'Display a chevron arrow icon after the button text',
                              nl: 'Toon een pijlicoon na de knoptekst',
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'spacing',
                      type: 'group',
                      label: {
                        en: 'Spacing',
                        nl: 'Ruimte',
                      },
                      fields: [
                        {
                          name: 'top',
                          type: 'select',
                          defaultValue: 'md',
                          label: {
                            en: 'Top',
                            nl: 'Boven',
                          },
                          options: [
                            { label: { en: 'Small', nl: 'Klein' }, value: 'sm' },
                            { label: { en: 'Medium', nl: 'Medium' }, value: 'md' },
                            { label: { en: 'Large', nl: 'Groot' }, value: 'lg' },
                          ],
                        },
                        {
                          name: 'bottom',
                          type: 'select',
                          defaultValue: 'md',
                          label: {
                            en: 'Bottom',
                            nl: 'Onder',
                          },
                          options: [
                            { label: { en: 'Small', nl: 'Klein' }, value: 'sm' },
                            { label: { en: 'Medium', nl: 'Medium' }, value: 'md' },
                            { label: { en: 'Large', nl: 'Groot' }, value: 'lg' },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'imageURL',
                      type: 'text',
                      virtual: true,
                      admin: {
                        hidden: true,
                      },
                      hooks: {
                        afterRead: [
                          async ({ siblingData, req }) => {
                            // Only process if we have an image
                            if (!siblingData?.image) return null;

                            // If image is just an ID string, fetch the media
                            if (typeof siblingData.image === 'string') {
                              try {
                                const media = await req.payload.findByID({
                                  collection: 'media',
                                  id: siblingData.image,
                                  depth: 0,
                                });

                                if (media?.url) {
                                  return media.url;
                                } else if (media?.filename) {
                                  const publicUrl = process.env.S3_PUBLIC_URL;
                                  if (publicUrl) {
                                    return `${publicUrl}/media/${media.filename}`;
                                  }
                                  return `/media/${media.filename}`;
                                }
                              } catch (error) {
                                console.error('Error fetching link-to-blog image media:', error);
                              }
                            }
                            // If image is already populated as an object
                            else if (typeof siblingData.image === 'object') {
                              const imageObj = siblingData.image as any;

                              if (imageObj.url) {
                                return imageObj.url;
                              } else if (imageObj.filename) {
                                const publicUrl = process.env.S3_PUBLIC_URL;
                                if (publicUrl) {
                                  return `${publicUrl}/media/${imageObj.filename}`;
                                }
                                return `/media/${imageObj.filename}`;
                              }
                            }

                            return null;
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'content',
              type: 'richText',
              editor: pageEditorConfig,
              label: {
                en: 'Content',
                nl: 'Inhoud',
              },
              admin: {
                description: {
                  en: 'Main page content',
                  nl: 'Hoofdinhoud van de pagina',
                },
                condition: (data) => {
                  // Hide content field for homepage since it uses a custom layout
                  return data.slug !== 'home';
                },
              },
            },
            {
              name: 'sections',
              type: 'array',
              label: {
                en: 'Page Sections',
                nl: 'Pagina Secties',
              },
              admin: {
                description: {
                  en: 'Add content sections to build your page',
                  nl: 'Voeg inhoudssecties toe om je pagina op te bouwen',
                },
                condition: (data) => {
                  // Hide sections field for homepage since it uses a custom layout
                  return data.slug !== 'home';
                },
              },
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  label: {
                    en: 'Section Type',
                    nl: 'Sectie Type',
                  },
                  options: [
                    { label: { en: 'Rich Text', nl: 'Rijke Tekst' }, value: 'richText' },
                    {
                      label: { en: 'Two Column Layout', nl: 'Twee Kolommen Layout' },
                      value: 'twoColumn',
                    },
                    { label: { en: 'Call to Action', nl: 'Call to Action' }, value: 'cta' },
                    { label: { en: 'Contact Section', nl: 'Contact Sectie' }, value: 'contact' },
                    { label: { en: 'Pricing Table', nl: 'Prijstabel' }, value: 'pricing' },
                    { label: { en: 'Testimonials', nl: 'Getuigenissen' }, value: 'testimonials' },
                    { label: { en: 'FAQ', nl: 'Veelgestelde Vragen' }, value: 'faq' },
                    { label: { en: 'Image Gallery', nl: 'Afbeeldingengalerij' }, value: 'gallery' },
                  ],
                },
                // Rich Text Section
                {
                  name: 'richTextContent',
                  type: 'richText',
                  editor: pageEditorConfig,
                  label: {
                    en: 'Content',
                    nl: 'Inhoud',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'richText',
                  },
                },
                // Two Column Section
                {
                  name: 'leftColumn',
                  type: 'richText',
                  editor: pageEditorConfig,
                  label: {
                    en: 'Left Column',
                    nl: 'Linker Kolom',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'twoColumn',
                  },
                },
                {
                  name: 'rightColumn',
                  type: 'richText',
                  editor: pageEditorConfig,
                  label: {
                    en: 'Right Column',
                    nl: 'Rechter Kolom',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'twoColumn',
                  },
                },
                {
                  name: 'columnRatio',
                  type: 'select',
                  defaultValue: '50-50',
                  label: {
                    en: 'Column Ratio',
                    nl: 'Kolom Verhouding',
                  },
                  options: [
                    { label: '50/50', value: '50-50' },
                    { label: '60/40', value: '60-40' },
                    { label: '40/60', value: '40-60' },
                    { label: '70/30', value: '70-30' },
                    { label: '30/70', value: '30-70' },
                  ],
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'twoColumn',
                  },
                },
                // CTA Section
                {
                  name: 'ctaHeading',
                  type: 'text',
                  label: {
                    en: 'Heading',
                    nl: 'Kop',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'cta',
                  },
                },
                {
                  name: 'ctaText',
                  type: 'textarea',
                  label: {
                    en: 'Text',
                    nl: 'Tekst',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'cta',
                  },
                },
                {
                  name: 'ctaButtons',
                  type: 'array',
                  maxRows: 2,
                  label: {
                    en: 'Buttons',
                    nl: 'Knoppen',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'cta',
                  },
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                      label: {
                        en: 'Button Text',
                        nl: 'Knop Tekst',
                      },
                    },
                    {
                      name: 'link',
                      type: 'text',
                      required: true,
                      label: {
                        en: 'Link',
                        nl: 'Link',
                      },
                    },
                    {
                      name: 'style',
                      type: 'select',
                      defaultValue: 'primary',
                      label: {
                        en: 'Style',
                        nl: 'Stijl',
                      },
                      options: [
                        { label: { en: 'Primary', nl: 'Primair' }, value: 'primary' },
                        { label: { en: 'Secondary', nl: 'Secundair' }, value: 'secondary' },
                        { label: { en: 'Outline', nl: 'Omlijnd' }, value: 'outline' },
                      ],
                    },
                  ],
                },
                {
                  name: 'ctaBackgroundColor',
                  type: 'select',
                  defaultValue: 'gray',
                  label: {
                    en: 'Background Color',
                    nl: 'Achtergrondkleur',
                  },
                  options: [
                    { label: { en: 'White', nl: 'Wit' }, value: 'white' },
                    { label: { en: 'Gray', nl: 'Grijs' }, value: 'gray' },
                    { label: { en: 'Primary', nl: 'Primair' }, value: 'primary' },
                    { label: { en: 'Dark', nl: 'Donker' }, value: 'dark' },
                  ],
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'cta',
                  },
                },
                // Contact Section
                {
                  name: 'contactHeading',
                  type: 'text',
                  defaultValue: 'Neem Contact Op',
                  label: {
                    en: 'Heading',
                    nl: 'Kop',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'contact',
                  },
                },
                {
                  name: 'contactSubheading',
                  type: 'textarea',
                  label: {
                    en: 'Subheading',
                    nl: 'Onderkop',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'contact',
                  },
                },
                {
                  name: 'showContactForm',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Show Contact Form',
                    nl: 'Toon Contactformulier',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'contact',
                  },
                },
                {
                  name: 'contactEmail',
                  type: 'text',
                  defaultValue: 'casting@14voices.com',
                  label: {
                    en: 'Contact Email',
                    nl: 'Contact E-mail',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'contact',
                  },
                },
                {
                  name: 'contactPhone',
                  type: 'text',
                  defaultValue: '020-2614825',
                  label: {
                    en: 'Contact Phone',
                    nl: 'Contact Telefoon',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'contact',
                  },
                },
                // Pricing Section
                {
                  name: 'pricingHeading',
                  type: 'text',
                  defaultValue: 'Our Pricing Plans',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'pricing',
                  },
                },
                {
                  name: 'pricingSubheading',
                  type: 'textarea',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'pricing',
                  },
                },
                {
                  name: 'pricingPlans',
                  type: 'array',
                  minRows: 1,
                  maxRows: 4,
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'pricing',
                  },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'price',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                    },
                    {
                      name: 'features',
                      type: 'array',
                      fields: [
                        {
                          name: 'feature',
                          type: 'text',
                          required: true,
                        },
                      ],
                    },
                    {
                      name: 'highlighted',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                    {
                      name: 'buttonText',
                      type: 'text',
                      defaultValue: 'Get Started',
                    },
                    {
                      name: 'buttonLink',
                      type: 'text',
                      defaultValue: '/contact',
                    },
                  ],
                },
                // Testimonials Section
                {
                  name: 'testimonialsHeading',
                  type: 'text',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'testimonials',
                  },
                },
                {
                  name: 'testimonialsSubheading',
                  type: 'textarea',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'testimonials',
                  },
                },
                {
                  name: 'testimonialsSource',
                  type: 'select',
                  defaultValue: 'featured',
                  options: [
                    { label: 'Featured Only', value: 'featured' },
                    { label: 'Latest', value: 'latest' },
                    { label: 'Selected', value: 'selected' },
                  ],
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'testimonials',
                  },
                },
                {
                  name: 'selectedTestimonials',
                  type: 'relationship',
                  relationTo: 'testimonials',
                  hasMany: true,
                  admin: {
                    condition: (_data, siblingData) =>
                      siblingData?.type === 'testimonials' &&
                      siblingData?.testimonialsSource === 'selected',
                  },
                },
                {
                  name: 'testimonialsLimit',
                  type: 'number',
                  defaultValue: 6,
                  min: 1,
                  max: 20,
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'testimonials',
                  },
                },
                // FAQ Section
                {
                  name: 'faqHeading',
                  type: 'text',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'faq',
                  },
                },
                {
                  name: 'faqSubheading',
                  type: 'textarea',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'faq',
                  },
                },
                {
                  name: 'faqs',
                  type: 'array',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'faq',
                  },
                  fields: [
                    {
                      name: 'question',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'answer',
                      type: 'richText',
                      editor: pageEditorConfig,
                      required: true,
                    },
                  ],
                },
                // Gallery Section
                {
                  name: 'galleryHeading',
                  type: 'text',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'gallery',
                  },
                },
                {
                  name: 'galleryImages',
                  type: 'upload',
                  relationTo: 'media',
                  hasMany: true,
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'gallery',
                  },
                },
                {
                  name: 'galleryLayout',
                  type: 'select',
                  defaultValue: 'grid',
                  options: [
                    { label: 'Grid', value: 'grid' },
                    { label: 'Masonry', value: 'masonry' },
                    { label: 'Carousel', value: 'carousel' },
                  ],
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'gallery',
                  },
                },
              ],
            },
          ],
        },
        {
          label: {
            en: 'SEO',
            nl: 'SEO',
          },
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: {
                en: 'Meta Information',
                nl: 'Meta Informatie',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: {
                    en: 'Meta Title',
                    nl: 'Meta Titel',
                  },
                  admin: {
                    description: {
                      en: 'Override page title for SEO (60 chars max)',
                      nl: 'Overschrijf paginatitel voor SEO (max. 60 tekens)',
                    },
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: {
                    en: 'Meta Description',
                    nl: 'Meta Beschrijving',
                  },
                  admin: {
                    description: {
                      en: 'Meta description for search engines (160 chars max)',
                      nl: 'Meta beschrijving voor zoekmachines (max. 160 tekens)',
                    },
                  },
                },
                {
                  name: 'keywords',
                  type: 'array',
                  admin: {
                    description: 'SEO keywords for this page',
                  },
                  fields: [
                    {
                      name: 'keyword',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Social media preview image',
                  },
                },
                {
                  name: 'noIndex',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Prevent search engines from indexing this page',
                  },
                },
              ],
            },
            {
              name: 'openGraph',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'OG title for social sharing',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'OG description for social sharing',
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  defaultValue: 'website',
                  options: [
                    { label: 'Website', value: 'website' },
                    { label: 'Article', value: 'article' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: {
            en: 'Settings',
            nl: 'Instellingen',
          },
          fields: [
            {
              name: 'parent',
              type: 'relationship',
              relationTo: 'pages',
              admin: {
                description: 'Set a parent page to create a hierarchy',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_equals: id,
                  },
                };
              },
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              required: true,
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Archived', value: 'archived' },
              ],
              admin: {
                position: 'sidebar',
                description: 'Page visibility status',
              },
            },
            {
              name: 'publishedDate',
              type: 'date',
              admin: {
                position: 'sidebar',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                description: 'Schedule page publication',
                components: {
                  Cell: '/components/admin/cells/DateCell#DateCell',
                },
              },
              defaultValue: () => new Date().toISOString(),
            },
            {
              name: 'showInNav',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                position: 'sidebar',
                description: 'Include in navigation menus',
              },
            },
            {
              name: 'navOrder',
              type: 'number',
              defaultValue: 0,
              admin: {
                position: 'sidebar',
                description: 'Order in navigation (lower numbers appear first)',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterRead: [
      ({ doc }) => {
        // Add a flag to indicate if this is the home page
        if (doc.slug === 'home') {
          doc._isProtected = true;
        }
        return doc;
      },
    ],
    beforeChange: [
      ({ data, operation }) => {
        // Ensure home page slug stays as 'home'
        if (data.slug === 'home' && operation === 'update') {
          data.slug = 'home';
        }

        // Initialize pageBlocks if not present for homepage
        if (data.slug === 'home' && (!data.pageBlocks || data.pageBlocks.length === 0)) {
          data.pageBlocks = [
            { blockType: 'hero', enabled: true },
            { blockType: 'voiceover', enabled: true },
            { blockType: 'linkToBlog', enabled: true },
          ];
        }

        // Migrate hero type to layout field if needed
        if (data.hero) {
          // Migrate type field to layout field
          if (data.hero.type === 'homepage' && !data.hero.layout) {
            data.hero.layout = 'variant1';
          }
        }

        // Migrate plain text to rich text if needed
        if (data.hero) {
          // Migrate description
          if (data.hero.description && !data.hero.descriptionRichText) {
            data.hero.descriptionRichText = {
              root: {
                children: [
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: data.hero.description,
                        type: 'text',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'paragraph',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'root',
                version: 1,
              },
            };
          }

          // Migrate title
          if (data.hero.title && !data.hero.titleRichText) {
            data.hero.titleRichText = {
              root: {
                children: [
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: data.hero.title,
                        type: 'text',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'paragraph',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'root',
                version: 1,
              },
            };
          }
        }

        return data;
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        // Get the document to check if it's the home page
        const page = await req.payload.findByID({
          collection: 'pages',
          id,
        });

        if (page.slug === 'home') {
          throw new Error(
            'The home page cannot be deleted. It is a required page for the website.'
          );
        }

        // For other pages, add a warning message (this will show in the UI)
        req.payload.logger.warn(
          `Page "${page.title}" (${page.slug}) is being deleted by user ${req.user?.email}`
        );
      },
    ],
  },
};

export default Pages;
