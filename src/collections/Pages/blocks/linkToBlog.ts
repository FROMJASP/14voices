import type { Field } from 'payload';

export const linkToBlogBlock: Field = {
  type: 'collapsible',
  label: 'Content',
  admin: {
    condition: (data) => data.slug === 'home' || data.slug === 'blog',
    initCollapsed: true,
    description: {
      en: 'Differently designed variants you can use to highlight something',
      nl: 'Verschillend ontworpen varianten waarmee je iets kunt uitlichten',
    },
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
          label: {
            en: 'Variant',
            nl: 'Variant',
          },
          defaultValue: 'variant1',
          options: [
            {
              label: { en: 'Content variant 1', nl: 'Content variant 1' },
              value: 'variant1',
            },
          ],
          admin: {
            hidden: true, // Always hide since controlled in Layout
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
          required: false,
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
          defaultValue: 'The Lyra ecosystem brings together our models, products and platforms.',
          label: {
            en: 'Heading',
            nl: 'Koptekst',
          },
          admin: {
            rows: 2,
            description: {
              en: 'Main heading for the section',
              nl: 'Hoofdkop voor de sectie',
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
            rows: 4,
            description: {
              en: 'Description text for the section',
              nl: 'Beschrijvingstekst voor de sectie',
            },
          },
        },
        {
          name: 'button',
          type: 'group',
          label: {
            en: 'Section Button',
            nl: 'Sectie Knop',
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
              name: 'linkType',
              type: 'radio',
              defaultValue: 'manual',
              label: {
                en: 'Link Type',
                nl: 'Link Type',
              },
              options: [
                {
                  label: { en: 'Manual URL', nl: 'Handmatige URL' },
                  value: 'manual',
                },
                {
                  label: { en: 'Blog Post', nl: 'Blog Post' },
                  value: 'blogPost',
                },
              ],
            },
            {
              name: 'url',
              type: 'text',
              defaultValue: '/blog',
              label: {
                en: 'URL',
                nl: 'URL',
              },
              admin: {
                condition: (_data, siblingData) =>
                  siblingData?.linkType === 'manual' || !siblingData?.linkType,
              },
            },
            {
              name: 'blogPost',
              type: 'relationship',
              relationTo: 'blog-posts',
              label: {
                en: 'Blog Post',
                nl: 'Blog Post',
              },
              admin: {
                condition: (_data, siblingData) => siblingData?.linkType === 'blogPost',
              },
              filterOptions: () => {
                return {
                  status: {
                    equals: 'published',
                  },
                };
              },
              validate: (value: unknown, { siblingData }: any) => {
                if (siblingData?.linkType === 'blogPost' && !value) {
                  return 'Blog Post is required when Blog Post link type is selected';
                }
                return true;
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
            },
            {
              name: 'showIcon',
              type: 'checkbox',
              defaultValue: true,
              label: {
                en: 'Show Arrow Icon',
                nl: 'Pijlicoon Tonen',
              },
            },
          ],
        },
        {
          name: 'spacing',
          type: 'group',
          label: {
            en: 'Section Spacing',
            nl: 'Sectie Tussenruimte',
          },
          fields: [
            {
              name: 'top',
              type: 'select',
              defaultValue: 'md',
              options: [
                { label: { en: 'None', nl: 'Geen' }, value: 'none' },
                { label: { en: 'Small', nl: 'Klein' }, value: 'sm' },
                { label: { en: 'Medium', nl: 'Gemiddeld' }, value: 'md' },
                { label: { en: 'Large', nl: 'Groot' }, value: 'lg' },
              ],
            },
            {
              name: 'bottom',
              type: 'select',
              defaultValue: 'md',
              options: [
                { label: { en: 'None', nl: 'Geen' }, value: 'none' },
                { label: { en: 'Small', nl: 'Klein' }, value: 'sm' },
                { label: { en: 'Medium', nl: 'Gemiddeld' }, value: 'md' },
                { label: { en: 'Large', nl: 'Groot' }, value: 'lg' },
              ],
            },
          ],
        },
        // Virtual field for resolved URL
        {
          name: 'resolvedUrl',
          type: 'text',
          virtual: true,
          admin: {
            hidden: true,
          },
          hooks: {
            afterRead: [
              async ({ siblingData, req }) => {
                // If manual URL is selected, return the URL
                if (siblingData?.button?.linkType === 'manual' || !siblingData?.button?.linkType) {
                  return siblingData?.button?.url || '/blog';
                }

                // If blog post is selected, fetch the blog post slug
                if (siblingData?.button?.linkType === 'blogPost' && siblingData?.button?.blogPost) {
                  try {
                    const blogPostId =
                      typeof siblingData.button.blogPost === 'string'
                        ? siblingData.button.blogPost
                        : siblingData.button.blogPost?.id;

                    if (blogPostId) {
                      const blogPost = await req.payload.findByID({
                        collection: 'blog-posts',
                        id: blogPostId,
                        depth: 0,
                      });

                      if (blogPost && blogPost.slug) {
                        return `/blog/${blogPost.slug}`;
                      }
                    }
                  } catch (error) {
                    console.error('Error fetching blog post:', error);
                  }
                }

                return '/blog';
              },
            ],
          },
        },
        // Virtual field for resolved image URL
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
                    }
                  } catch (error) {
                    console.error('Error fetching linkToBlog image media:', error);
                  }
                }
                // If image is already populated as an object
                else if (typeof siblingData.image === 'object') {
                  const imageObj = siblingData.image as any;

                  if (imageObj.url) {
                    return imageObj.url;
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
};
