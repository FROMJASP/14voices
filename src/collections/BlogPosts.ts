import type { CollectionConfig, Where } from 'payload';
import { formatSlug } from '../utilities/formatSlug';
import { blogEditorConfig } from '../fields/lexical/blogEditorConfig';

const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: {
    singular: {
      en: 'Blog Post',
      nl: 'Blogbericht',
    },
    plural: {
      en: 'Blog Posts',
      nl: 'Blogberichten',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'author', 'publishedDate', 'views'],
    listSearchableFields: ['title', 'subtitle', 'content'],
    group: {
      en: 'Site Builder',
      nl: 'Site Builder',
    },
    components: {
      beforeListTable: ['./components/admin/views/BlogPostsWithTabs#default'],
    },
    preview: (doc) => {
      if (doc?.slug) {
        return `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/${doc.slug}`;
      }
      return null;
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;

      // If user is logged in, show their posts and published posts
      if (user) {
        const query: Where = {
          or: [
            {
              status: {
                equals: 'published',
              },
            },
            {
              author: {
                equals: user.id,
              },
            },
          ],
        };
        return query;
      }

      // If no user, only show published posts
      return {
        status: {
          equals: 'published',
        },
      };
    },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return {
        author: {
          equals: user?.id,
        },
      };
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  versions: {
    drafts: true,
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
              name: 'title',
              type: 'text',
              required: true,
              label: {
                en: 'Title',
                nl: 'Titel',
              },
              admin: {
                description: {
                  en: 'The main title of your blog post',
                  nl: 'De hoofdtitel van je blogbericht',
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
                description: {
                  en: 'Optional subtitle or tagline',
                  nl: 'Optionele ondertitel of tagline',
                },
              },
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              label: {
                en: 'URL Slug',
                nl: 'URL Slug',
              },
              admin: {
                position: 'sidebar',
                description: {
                  en: 'URL-friendly version of the title',
                  nl: 'URL-vriendelijke versie van de titel',
                },
              },
              hooks: {
                beforeValidate: [formatSlug('title')],
              },
            },
            {
              name: 'bannerImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: {
                en: 'Banner Image',
                nl: 'Banner Afbeelding',
              },
              admin: {
                description: {
                  en: 'Hero image displayed at the top of the post',
                  nl: 'Hero afbeelding die bovenaan het bericht wordt weergegeven',
                },
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: blogEditorConfig,
              label: {
                en: 'Content',
                nl: 'Inhoud',
              },
              admin: {
                description: {
                  en: 'The main content of your blog post',
                  nl: 'De hoofdinhoud van je blogbericht',
                },
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: {
                en: 'Excerpt',
                nl: 'Samenvatting',
              },
              admin: {
                description: {
                  en: 'Short summary for previews and listings (auto-generated if empty)',
                  nl: 'Korte samenvatting voor voorvertoningen en lijsten (automatisch gegenereerd indien leeg)',
                },
              },
              hooks: {
                beforeValidate: [
                  ({ data, value }) => {
                    if (!value && data?.content?.root) {
                      // Recursive function to extract text from any node
                      const extractText = (node: any): string => {
                        let text = '';

                        // If node has direct text, add it
                        if (node.text) {
                          text += node.text;
                        }

                        // If node has children, process them recursively
                        if (node.children && Array.isArray(node.children)) {
                          for (const child of node.children) {
                            text += ' ' + extractText(child);
                          }
                        }

                        return text;
                      };

                      const plainText = extractText(data.content.root).trim();
                      if (plainText.length > 160) {
                        return plainText.substring(0, 160) + '...';
                      }
                      return plainText;
                    }
                    return value;
                  },
                ],
              },
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
              interfaceName: 'Meta',
              label: {
                en: 'Meta Tags',
                nl: 'Meta Tags',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: {
                    en: 'SEO Title',
                    nl: 'SEO Titel',
                  },
                  admin: {
                    description: {
                      en: 'Override the default title for SEO (defaults to post title)',
                      nl: 'Overschrijf de standaardtitel voor SEO (gebruikt standaard de berichttitel)',
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
                      en: 'Meta description for search engines (defaults to excerpt)',
                      nl: 'Meta beschrijving voor zoekmachines (gebruikt standaard de samenvatting)',
                    },
                  },
                },
                {
                  name: 'keywords',
                  type: 'array',
                  label: {
                    en: 'Keywords',
                    nl: 'Trefwoorden',
                  },
                  admin: {
                    description: {
                      en: 'SEO keywords for this post',
                      nl: 'SEO trefwoorden voor dit bericht',
                    },
                  },
                  fields: [
                    {
                      name: 'keyword',
                      type: 'text',
                      label: {
                        en: 'Keyword',
                        nl: 'Trefwoord',
                      },
                    },
                  ],
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: {
                    en: 'Preview Image',
                    nl: 'Voorvertoning Afbeelding',
                  },
                  admin: {
                    description: {
                      en: 'Social media preview image (defaults to banner image)',
                      nl: 'Social media voorvertoning afbeelding (gebruikt standaard de banner afbeelding)',
                    },
                  },
                },
                {
                  name: 'noIndex',
                  type: 'checkbox',
                  defaultValue: false,
                  label: {
                    en: 'No Index',
                    nl: 'Niet Indexeren',
                  },
                  admin: {
                    description: {
                      en: 'Prevent search engines from indexing this page',
                      nl: 'Voorkom dat zoekmachines deze pagina indexeren',
                    },
                  },
                },
              ],
            },
            {
              name: 'openGraph',
              type: 'group',
              label: {
                en: 'Open Graph',
                nl: 'Open Graph',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: {
                    en: 'OG Title',
                    nl: 'OG Titel',
                  },
                  admin: {
                    description: {
                      en: 'OG title for social sharing',
                      nl: 'OG titel voor social media delen',
                    },
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: {
                    en: 'OG Description',
                    nl: 'OG Beschrijving',
                  },
                  admin: {
                    description: {
                      en: 'OG description for social sharing',
                      nl: 'OG beschrijving voor social media delen',
                    },
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  label: {
                    en: 'Type',
                    nl: 'Type',
                  },
                  defaultValue: 'article',
                  options: [
                    { label: { en: 'Article', nl: 'Artikel' }, value: 'article' },
                    { label: { en: 'Website', nl: 'Website' }, value: 'website' },
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
              name: 'author',
              type: 'relationship',
              relationTo: 'users',
              required: true,
              defaultValue: ({ user }) => user?.id,
              label: {
                en: 'Author',
                nl: 'Auteur',
              },
              admin: {
                description: {
                  en: 'The author of this post',
                  nl: 'De auteur van dit bericht',
                },
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories' as any,
              label: {
                en: 'Category',
                nl: 'Categorie',
              },
              admin: {
                description: {
                  en: 'Select a category for this post',
                  nl: 'Selecteer een categorie voor dit bericht',
                },
                components: {
                  Cell: './components/admin/cells/CategoryCell#CategoryCell',
                },
              },
            },
            {
              name: 'tags',
              type: 'array',
              label: {
                en: 'Tags',
                nl: 'Tags',
              },
              admin: {
                description: {
                  en: 'Add tags for better discoverability',
                  nl: 'Voeg tags toe voor betere vindbaarheid',
                },
              },
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  label: {
                    en: 'Tag',
                    nl: 'Tag',
                  },
                },
              ],
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              required: true,
              label: {
                en: 'Status',
                nl: 'Status',
              },
              options: [
                { label: { en: 'Draft', nl: 'Concept' }, value: 'draft' },
                { label: { en: 'Published', nl: 'Gepubliceerd' }, value: 'published' },
                { label: { en: 'Archived', nl: 'Gearchiveerd' }, value: 'archived' },
              ],
              admin: {
                position: 'sidebar',
                description: {
                  en: 'Post visibility status',
                  nl: 'Zichtbaarheidsstatus van bericht',
                },
              },
            },
            {
              name: 'publishedDate',
              type: 'date',
              label: {
                en: 'Published Date',
                nl: 'Publicatiedatum',
              },
              admin: {
                position: 'sidebar',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                description: {
                  en: 'Schedule post publication',
                  nl: 'Plan de publicatie van het bericht',
                },
              },
              defaultValue: () => new Date().toISOString(),
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              label: {
                en: 'Featured',
                nl: 'Uitgelicht',
              },
              admin: {
                position: 'sidebar',
                description: {
                  en: 'Feature this post on the homepage',
                  nl: 'Toon dit bericht uitgelicht op de homepage',
                },
              },
            },
            {
              name: 'enableComments',
              type: 'checkbox',
              defaultValue: true,
              label: {
                en: 'Enable Comments',
                nl: 'Reacties Toestaan',
              },
              admin: {
                position: 'sidebar',
                description: {
                  en: 'Allow comments on this post',
                  nl: 'Sta reacties toe op dit bericht',
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      label: {
        en: 'Views',
        nl: 'Weergaven',
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: {
          en: 'Number of times this post has been viewed',
          nl: 'Aantal keer dat dit bericht is bekeken',
        },
      },
    },
    {
      name: 'wordCount',
      type: 'number',
      virtual: true,
      label: {
        en: 'Word Count',
        nl: 'Aantal Woorden',
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: {
          en: 'Total number of words in the blog post content',
          nl: 'Totaal aantal woorden in de blogpost inhoud',
        },
      },
      hooks: {
        afterRead: [
          ({ data }) => {
            if (data?.content?.root?.children) {
              let totalWords = 0;

              // Recursive function to extract text from any node
              const extractText = (node: any): string => {
                let text = '';

                // If node has direct text, add it
                if (node.text) {
                  text += node.text;
                }

                // If node has children, process them recursively
                if (node.children && Array.isArray(node.children)) {
                  for (const child of node.children) {
                    text += ' ' + extractText(child);
                  }
                }

                return text;
              };

              // Extract all text from the content
              const plainText = extractText(data.content.root);

              // Count words (split by whitespace and filter empty strings)
              totalWords = plainText
                .trim()
                .split(/\s+/)
                .filter((word: string) => word.length > 0).length;

              return totalWords || 0;
            }
            return 0;
          },
        ],
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      label: {
        en: 'Reading Time (minutes)',
        nl: 'Leestijd (minuten)',
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: {
          en: 'Automatically calculated based on content length. Assumes an average reading speed of 200 words per minute. The total word count is divided by 200 to estimate reading time.',
          nl: 'Automatisch berekend op basis van de tekstlengte. Gaat uit van een gemiddelde leessnelheid van 200 woorden per minuut. Het totale aantal woorden wordt gedeeld door 200 om de leestijd te schatten.',
        },
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            if (data?.content?.root?.children) {
              // Recursive function to extract text from any node
              const extractText = (node: any): string => {
                let text = '';

                // If node has direct text, add it
                if (node.text) {
                  text += node.text;
                }

                // If node has children, process them recursively
                if (node.children && Array.isArray(node.children)) {
                  for (const child of node.children) {
                    text += ' ' + extractText(child);
                  }
                }

                return text;
              };

              // Extract all text from the content
              const plainText = extractText(data.content.root);

              // Count words (split by whitespace)
              const wordCount = plainText
                .trim()
                .split(/\s+/)
                .filter((word: string) => word.length > 0).length;

              // Calculate reading time based on 200 words per minute
              const wordsPerMinute = 200;
              const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

              return readingTimeMinutes;
            }
            return value || 0;
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          data.views = 0;
        }

        // When updating and _status is not 'draft' (meaning it's being published)
        // automatically set the status field to 'published' if it's still 'draft'
        if (operation === 'update' && data._status !== 'draft' && data.status === 'draft') {
          console.log('Auto-setting status to published because document is being published');
          data.status = 'published';
        }

        return data;
      },
    ],
  },
  endpoints: [
    {
      path: '/increment-views',
      method: 'post',
      handler: async (req) => {
        const body = req.json ? await req.json() : {};
        const { id } = body;
        if (!id) {
          return Response.json({ error: 'Post ID required' }, { status: 400 });
        }
        try {
          const post = await req.payload.findByID({
            collection: 'blog-posts',
            id,
          });
          if (!post) {
            return Response.json({ error: 'Post not found' }, { status: 404 });
          }
          await req.payload.update({
            collection: 'blog-posts',
            id,
            data: {
              views: (post.views || 0) + 1,
            },
          });
          return Response.json({ success: true });
        } catch {
          return Response.json({ error: 'Failed to increment views' }, { status: 500 });
        }
      },
    },
  ],
};

export default BlogPosts;
