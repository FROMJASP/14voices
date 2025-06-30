import type { CollectionConfig } from 'payload'
import { pageEditorConfig } from '../fields/lexical/pageEditorConfig'

const Blocks: CollectionConfig = {
  slug: 'blocks',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'blockType', 'category', 'updatedAt'],
    group: 'Site Builder',
  },
  access: {
    read: () => {
      // Everyone can read blocks (needed for frontend)
      return true
    },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal name for this block',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'content',
      options: [
        { label: 'Hero Sections', value: 'hero' },
        { label: 'Content', value: 'content' },
        { label: 'Features', value: 'features' },
        { label: 'CTAs', value: 'cta' },
        { label: 'Testimonials', value: 'testimonials' },
        { label: 'Media', value: 'media' },
        { label: 'Forms', value: 'forms' },
        { label: 'Navigation', value: 'navigation' },
        { label: 'Footer', value: 'footer' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'blockType',
      type: 'select',
      required: true,
      admin: {
        description: 'Choose the type of block to create',
      },
      options: [
        { label: 'Hero Banner', value: 'heroBanner' },
        { label: 'Feature Grid', value: 'featureGrid' },
        { label: 'Content Section', value: 'contentSection' },
        { label: 'Call to Action', value: 'callToAction' },
        { label: 'Testimonial Carousel', value: 'testimonialCarousel' },
        { label: 'Image Gallery', value: 'imageGallery' },
        { label: 'Video Section', value: 'videoSection' },
        { label: 'Contact Form', value: 'contactForm' },
        { label: 'Newsletter Signup', value: 'newsletterSignup' },
        { label: 'FAQ Accordion', value: 'faqAccordion' },
        { label: 'Stats Counter', value: 'statsCounter' },
        { label: 'Pricing Table', value: 'pricingTable' },
        { label: 'Logo Cloud', value: 'logoCloud' },
        { label: 'Timeline', value: 'timeline' },
        { label: 'Testimonials Display', value: 'testimonialsDisplay' },
      ],
    },
    // Hero Banner
    {
      name: 'heroBanner',
      type: 'group',
      admin: {
        condition: (data) => data.blockType === 'heroBanner',
      },
      fields: [
        {
          name: 'headline',
          type: 'text',
          required: true,
        },
        {
          name: 'subheadline',
          type: 'textarea',
        },
        {
          name: 'backgroundType',
          type: 'select',
          defaultValue: 'color',
          options: [
            { label: 'Color', value: 'color' },
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
            { label: 'Gradient', value: 'gradient' },
          ],
        },
        {
          name: 'backgroundColor',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.backgroundType === 'color',
            description: 'Hex color code',
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.backgroundType === 'image',
          },
        },
        {
          name: 'backgroundVideo',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.backgroundType === 'video',
            description: 'YouTube or Vimeo URL',
          },
        },
        {
          name: 'buttons',
          type: 'array',
          maxRows: 2,
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
          name: 'height',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small (50vh)', value: 'small' },
            { label: 'Medium (70vh)', value: 'medium' },
            { label: 'Large (90vh)', value: 'large' },
            { label: 'Full Screen', value: 'full' },
          ],
        },
      ],
    },
    // Feature Grid
    {
      name: 'featureGrid',
      type: 'group',
      admin: {
        condition: (data) => data.blockType === 'featureGrid',
      },
      fields: [
        {
          name: 'headline',
          type: 'text',
        },
        {
          name: 'subheadline',
          type: 'textarea',
        },
        {
          name: 'features',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'icon',
              type: 'select',
              options: [
                { label: 'Microphone', value: 'microphone' },
                { label: 'Headphones', value: 'headphones' },
                { label: 'Play', value: 'play' },
                { label: 'Star', value: 'star' },
                { label: 'Heart', value: 'heart' },
                { label: 'Check', value: 'check' },
                { label: 'Lightning', value: 'lightning' },
                { label: 'Shield', value: 'shield' },
              ],
            },
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
            },
          ],
        },
        {
          name: 'columns',
          type: 'select',
          defaultValue: '3',
          options: [
            { label: '2 Columns', value: '2' },
            { label: '3 Columns', value: '3' },
            { label: '4 Columns', value: '4' },
          ],
        },
      ],
    },
    // Content Section
    {
      name: 'contentSection',
      type: 'group',
      admin: {
        condition: (data) => data.blockType === 'contentSection',
      },
      fields: [
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'centered',
          options: [
            { label: 'Centered', value: 'centered' },
            { label: 'Left Aligned', value: 'left' },
            { label: 'Right Aligned', value: 'right' },
            { label: 'Two Column', value: 'twoColumn' },
          ],
        },
        {
          name: 'content',
          type: 'richText',
          editor: pageEditorConfig,
          required: true,
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.layout === 'twoColumn',
          },
        },
        {
          name: 'mediaPosition',
          type: 'select',
          defaultValue: 'right',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            condition: (data, siblingData) => siblingData?.layout === 'twoColumn',
          },
        },
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'white',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Gray', value: 'gray' },
            { label: 'Primary', value: 'primary' },
          ],
        },
      ],
    },
    // Call to Action
    {
      name: 'callToAction',
      type: 'group',
      admin: {
        condition: (data) => data.blockType === 'callToAction',
      },
      fields: [
        {
          name: 'headline',
          type: 'text',
          required: true,
        },
        {
          name: 'subheadline',
          type: 'textarea',
        },
        {
          name: 'buttons',
          type: 'array',
          maxRows: 2,
          minRows: 1,
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
          name: 'style',
          type: 'select',
          defaultValue: 'centered',
          options: [
            { label: 'Centered', value: 'centered' },
            { label: 'Left Aligned', value: 'left' },
            { label: 'Split', value: 'split' },
          ],
        },
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Gray', value: 'gray' },
            { label: 'Primary', value: 'primary' },
            { label: 'Dark', value: 'dark' },
          ],
        },
      ],
    },
    // FAQ Accordion
    {
      name: 'faqAccordion',
      type: 'group',
      admin: {
        condition: (data) => data.blockType === 'faqAccordion',
      },
      fields: [
        {
          name: 'headline',
          type: 'text',
        },
        {
          name: 'subheadline',
          type: 'textarea',
        },
        {
          name: 'faqs',
          type: 'array',
          required: true,
          minRows: 1,
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
      ],
    },
    // Testimonials Display
    {
      name: 'testimonialsDisplay',
      type: 'group',
      admin: {
        condition: (data) => data.blockType === 'testimonialsDisplay',
      },
      fields: [
        {
          name: 'headline',
          type: 'text',
        },
        {
          name: 'subheadline',
          type: 'textarea',
        },
        {
          name: 'displayType',
          type: 'select',
          defaultValue: 'carousel',
          options: [
            { label: 'Carousel', value: 'carousel' },
            { label: 'Grid', value: 'grid' },
            { label: 'List', value: 'list' },
            { label: 'Masonry', value: 'masonry' },
          ],
        },
        {
          name: 'source',
          type: 'select',
          defaultValue: 'featured',
          options: [
            { label: 'Featured Only', value: 'featured' },
            { label: 'Latest', value: 'latest' },
            { label: 'Selected', value: 'selected' },
            { label: 'By Tag', value: 'byTag' },
          ],
        },
        {
          name: 'selectedTestimonials',
          type: 'relationship',
          relationTo: 'testimonials',
          hasMany: true,
          admin: {
            condition: (data, siblingData) => siblingData?.source === 'selected',
          },
        },
        {
          name: 'tag',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.source === 'byTag',
            description: 'Filter by tag',
          },
        },
        {
          name: 'limit',
          type: 'number',
          defaultValue: 6,
          min: 1,
          max: 20,
        },
        {
          name: 'showRating',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'showAvatar',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    // Common fields for all blocks
    {
      name: 'customClasses',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Custom CSS classes for styling',
      },
    },
    {
      name: 'visibility',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'showOnDesktop',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'showOnTablet',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'showOnMobile',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}

export default Blocks