import type { CollectionConfig } from 'payload';
import { formatSlug } from '../utilities/formatSlug';
import { pageEditorConfig } from '../fields/lexical/pageEditorConfig';

const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    listSearchableFields: ['title', 'slug'],
    group: 'Content',
    livePreview: {
      url: ({ data }) => `${process.env.NEXT_PUBLIC_SERVER_URL}/${data.slug}`,
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
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Page title displayed in browser tabs and search results',
              },
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              required: true,
              admin: {
                position: 'sidebar',
                description: 'URL path for this page (e.g., "about-us")',
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
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  defaultValue: 'none',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Simple', value: 'simple' },
                    { label: 'With Image', value: 'image' },
                    { label: 'Video Background', value: 'video' },
                    { label: 'Gradient', value: 'gradient' },
                  ],
                },
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type !== 'none',
                  },
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type !== 'none',
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'image',
                  },
                },
                {
                  name: 'videoUrl',
                  type: 'text',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'video',
                    description: 'YouTube or Vimeo URL',
                  },
                },
                {
                  name: 'cta',
                  type: 'group',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type !== 'none',
                  },
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                    },
                    {
                      name: 'link',
                      type: 'text',
                    },
                    {
                      name: 'style',
                      type: 'select',
                      defaultValue: 'primary',
                      options: [
                        { label: 'Primary', value: 'primary' },
                        { label: 'Secondary', value: 'secondary' },
                        { label: 'Outline', value: 'outline' },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'content',
              type: 'richText',
              editor: pageEditorConfig,
              admin: {
                description: 'Main page content',
              },
            },
            {
              name: 'sections',
              type: 'array',
              label: 'Page Sections',
              admin: {
                description: 'Add content sections to build your page',
              },
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Rich Text', value: 'richText' },
                    { label: 'Two Column Layout', value: 'twoColumn' },
                    { label: 'Call to Action', value: 'cta' },
                    { label: 'Contact Section', value: 'contact' },
                    { label: 'Pricing Table', value: 'pricing' },
                    { label: 'Testimonials', value: 'testimonials' },
                    { label: 'FAQ', value: 'faq' },
                    { label: 'Image Gallery', value: 'gallery' },
                  ],
                },
                // Rich Text Section
                {
                  name: 'richTextContent',
                  type: 'richText',
                  editor: pageEditorConfig,
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'richText',
                  },
                },
                // Two Column Section
                {
                  name: 'leftColumn',
                  type: 'richText',
                  editor: pageEditorConfig,
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'twoColumn',
                  },
                },
                {
                  name: 'rightColumn',
                  type: 'richText',
                  editor: pageEditorConfig,
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'twoColumn',
                  },
                },
                {
                  name: 'columnRatio',
                  type: 'select',
                  defaultValue: '50-50',
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
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'cta',
                  },
                },
                {
                  name: 'ctaText',
                  type: 'textarea',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'cta',
                  },
                },
                {
                  name: 'ctaButtons',
                  type: 'array',
                  maxRows: 2,
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'cta',
                  },
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'link',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'style',
                      type: 'select',
                      defaultValue: 'primary',
                      options: [
                        { label: 'Primary', value: 'primary' },
                        { label: 'Secondary', value: 'secondary' },
                        { label: 'Outline', value: 'outline' },
                      ],
                    },
                  ],
                },
                {
                  name: 'ctaBackgroundColor',
                  type: 'select',
                  defaultValue: 'gray',
                  options: [
                    { label: 'White', value: 'white' },
                    { label: 'Gray', value: 'gray' },
                    { label: 'Primary', value: 'primary' },
                    { label: 'Dark', value: 'dark' },
                  ],
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'cta',
                  },
                },
                // Contact Section
                {
                  name: 'contactHeading',
                  type: 'text',
                  defaultValue: 'Get in Touch',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'contact',
                  },
                },
                {
                  name: 'contactSubheading',
                  type: 'textarea',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'contact',
                  },
                },
                {
                  name: 'showContactForm',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'contact',
                  },
                },
                {
                  name: 'contactEmail',
                  type: 'text',
                  defaultValue: 'casting@14voices.com',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'contact',
                  },
                },
                {
                  name: 'contactPhone',
                  type: 'text',
                  defaultValue: '020-2614825',
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
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'Override page title for SEO (60 chars max)',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'Meta description for search engines (160 chars max)',
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
          label: 'Settings',
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
    beforeChange: [
      ({ data, operation }) => {
        // Ensure home page slug stays as 'home'
        if (data.slug === 'home' && operation === 'update') {
          data.slug = 'home';
        }
        return data;
      },
    ],
  },
};

export default Pages;
