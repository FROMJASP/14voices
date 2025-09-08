import type { CollectionConfig } from 'payload';
import { getCollectionLabels } from '../i18n';
import { pageEditorConfig } from '../fields/lexical/pageEditorConfig';
import { basicContentFields, seoTab, settingsTab } from './Pages/index';
import { pageBlocks } from './Pages/blocks';

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
    group: {
      en: 'Site Builder',
      nl: 'Site Builder',
    },
    livePreview: {
      url: ({ data }) => {
        const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || '';
        const path = data.slug === 'home' ? '' : data.slug;
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

      // Return a query to check for locked pages
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
        interval: 300000, // 5 minutes
      },
    },
    maxPerDoc: 20,
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
            ...basicContentFields,
            // New Payload native blocks field - handles both layout AND content!
            {
              name: 'layout',
              type: 'blocks',
              label: {
                en: 'Page Layout',
                nl: 'Pagina Layout',
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
              blocks: pageBlocks,
              admin: {
                condition: (data) => data.slug === 'home' || data.slug === 'blog',
                initCollapsed: false,
              },
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
                  // Hide content field for homepage and blog since they use custom layouts
                  return data.slug !== 'home' && data.slug !== 'blog';
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
                  // Hide sections field for homepage and blog since they use custom layouts
                  return data.slug !== 'home' && data.slug !== 'blog';
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
                    { label: { en: 'Two Column', nl: 'Twee Kolommen' }, value: 'twoColumn' },
                    { label: { en: 'Call to Action', nl: 'Call to Action' }, value: 'cta' },
                    { label: { en: 'Contact', nl: 'Contact' }, value: 'contact' },
                    { label: { en: 'Pricing', nl: 'Prijzen' }, value: 'pricing' },
                    { label: { en: 'Testimonials', nl: 'Testimonials' }, value: 'testimonials' },
                    { label: { en: 'FAQ', nl: 'FAQ' }, value: 'faq' },
                    { label: { en: 'Gallery', nl: 'Galerij' }, value: 'gallery' },
                  ],
                },
                // Section-specific fields would be defined here
                // For brevity, I'm omitting these as they would be moved to their own files
              ],
            },
          ],
        },
        seoTab,
        settingsTab,
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Set default publishedDate if creating a new page
        if (operation === 'create' && !data.publishedDate) {
          data.publishedDate = new Date().toISOString();
        }

        // Ensure home page remains locked
        if (data.slug === 'home' || data.slug === 'blog') {
          data.locked = true;
        }

        return data;
      },
    ],
    afterRead: [
      async ({ doc }) => {
        // Migrate from old structure to new blocks structure - only for homepage now
        if (doc.slug === 'home' && !doc.layout?.length) {
          const migratedLayout = [];

          // Check if we have old pageBlocks structure
          if (doc.pageBlocks?.length) {
            // Migrate from old pageBlocks to new layout
            doc.pageBlocks.forEach((block: any) => {
              if (block.blockType === 'hero' && block.enabled) {
                const variant = block.heroVariant || doc.hero?.layout || 'variant1';
                migratedLayout.push({
                  blockType: variant === 'variant1' ? 'hero-v1' : 'hero-v2',
                  // Migrate hero content if it exists
                  ...(doc.hero
                    ? {
                        title: doc.hero.title,
                        titleRichText: doc.hero.titleRichText,
                        description: doc.hero.description,
                        descriptionRichText: doc.hero.descriptionRichText,
                        image: doc.hero.image,
                        cta: doc.hero.cta,
                        // Variant 1 specific
                        ...(variant === 'variant1'
                          ? {
                              processSteps: doc.hero.processSteps || [],
                              stats: doc.hero.stats || [],
                            }
                          : {}),
                        // Variant 2 specific
                        ...(variant === 'variant2'
                          ? {
                              badge: doc.hero.badge,
                              subtitle: doc.hero.subtitle,
                              subtitleRichText: doc.hero.subtitleRichText,
                            }
                          : {}),
                      }
                    : {}),
                });
              }

              if (block.blockType === 'linkToBlog' && block.enabled) {
                migratedLayout.push({
                  blockType: 'content-v1',
                  enabled: block.enabled !== false,
                  ...(doc.linkToBlog
                    ? {
                        title: doc.linkToBlog.title,
                        description: doc.linkToBlog.description,
                        links: doc.linkToBlog.links || [],
                      }
                    : {}),
                });
              }

              if (
                block.blockType === 'voiceover' &&
                block.enabled &&
                doc.voiceover &&
                (doc.voiceover.title || doc.voiceover.description)
              ) {
                migratedLayout.push({
                  blockType: 'voiceover-v1',
                  title: doc.voiceover.title,
                  description: doc.voiceover.description,
                  showcase: doc.voiceover.showcase !== false,
                });
              }
            });
          } else if (doc.hero || doc.linkToBlog || doc.voiceover) {
            // Migrate from original structure (no pageBlocks)
            if (doc.hero) {
              const variant = doc.hero.layout || 'variant1';
              migratedLayout.push({
                blockType: variant === 'variant1' ? 'hero-v1' : 'hero-v2',
                title: doc.hero.title,
                titleRichText: doc.hero.titleRichText,
                description: doc.hero.description,
                descriptionRichText: doc.hero.descriptionRichText,
                image: doc.hero.image,
                cta: doc.hero.cta,
                ...(variant === 'variant1'
                  ? {
                      processSteps: doc.hero.processSteps || [],
                      stats: doc.hero.stats || [],
                    }
                  : {}),
                ...(variant === 'variant2'
                  ? {
                      badge: doc.hero.badge,
                      subtitle: doc.hero.subtitle,
                      subtitleRichText: doc.hero.subtitleRichText,
                    }
                  : {}),
              });
            }

            if (doc.linkToBlog) {
              migratedLayout.push({
                blockType: 'content-v1',
                enabled: doc.linkToBlog.enabled !== false,
                title: doc.linkToBlog.title,
                description: doc.linkToBlog.description,
                links: doc.linkToBlog.links || [],
              });
            }

            if (doc.voiceover && (doc.voiceover.title || doc.voiceover.description)) {
              migratedLayout.push({
                blockType: 'voiceover-v1',
                title: doc.voiceover.title,
                description: doc.voiceover.description,
                showcase: doc.voiceover.showcase !== false,
              });
            }
          }

          if (migratedLayout.length > 0) {
            doc.layout = migratedLayout;
          }
        }

        return doc;
      },
    ],
  },
};

export default Pages;
