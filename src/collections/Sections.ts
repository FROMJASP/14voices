import type { CollectionConfig } from 'payload'
import { pageEditorConfig } from '../fields/lexical/pageEditorConfig'

const Sections: CollectionConfig = {
  slug: 'sections',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'style', 'updatedAt'],
    group: 'Site Builder',
    preview: (doc) => {
      if (doc?.slug) {
        return `${process.env.NEXT_PUBLIC_SERVER_URL}/preview/section/${doc.id}`
      }
      return null
    },
  },
  access: {
    read: () => true,
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
        description: 'Internal name for this section',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of what this section displays',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'hero',
      options: [
        { label: 'Hero', value: 'hero' },
        { label: 'Features', value: 'features' },
        { label: 'Content', value: 'content' },
        { label: 'Gallery', value: 'gallery' },
        { label: 'Testimonials', value: 'testimonials' },
        { label: 'Pricing', value: 'pricing' },
        { label: 'Team', value: 'team' },
        { label: 'FAQ', value: 'faq' },
        { label: 'Contact', value: 'contact' },
        { label: 'CTA', value: 'cta' },
        { label: 'Stats', value: 'stats' },
        { label: 'Process', value: 'process' },
        { label: 'Portfolio', value: 'portfolio' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'style',
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Alternative', value: 'alternative' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Bold', value: 'bold' },
        { label: 'Dark', value: 'dark' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Visual style variant',
      },
    },
    {
      name: 'configuration',
      type: 'group',
      fields: [
        {
          name: 'backgroundType',
          type: 'select',
          defaultValue: 'color',
          options: [
            { label: 'Color', value: 'color' },
            { label: 'Gradient', value: 'gradient' },
            { label: 'Image', value: 'image' },
            { label: 'Pattern', value: 'pattern' },
          ],
        },
        {
          name: 'backgroundColor',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.backgroundType === 'color',
            description: 'Hex color or CSS color name',
          },
        },
        {
          name: 'backgroundGradient',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.backgroundType === 'gradient',
            description: 'CSS gradient (e.g., linear-gradient(to right, #ff0000, #00ff00))',
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
          name: 'backgroundPattern',
          type: 'select',
          options: [
            { label: 'Dots', value: 'dots' },
            { label: 'Grid', value: 'grid' },
            { label: 'Waves', value: 'waves' },
            { label: 'Circles', value: 'circles' },
          ],
          admin: {
            condition: (data, siblingData) => siblingData?.backgroundType === 'pattern',
          },
        },
        {
          name: 'padding',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
            { label: 'Extra Large', value: 'xlarge' },
          ],
        },
        {
          name: 'containerWidth',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Wide', value: 'wide' },
            { label: 'Full Width', value: 'full' },
            { label: 'Narrow', value: 'narrow' },
          ],
        },
      ],
    },
    {
      name: 'content',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          admin: {
            description: 'Main heading for this section',
          },
        },
        {
          name: 'subheading',
          type: 'textarea',
          admin: {
            description: 'Supporting text below the heading',
          },
        },
        {
          name: 'alignment',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
      ],
    },
    {
      name: 'components',
      type: 'array',
      label: 'Section Components',
      admin: {
        description: 'Add and configure components for this section',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Text Block', value: 'textBlock' },
            { label: 'Image', value: 'image' },
            { label: 'Button Group', value: 'buttonGroup' },
            { label: 'Feature List', value: 'featureList' },
            { label: 'Card Grid', value: 'cardGrid' },
            { label: 'Testimonial Slider', value: 'testimonialSlider' },
            { label: 'Video Embed', value: 'videoEmbed' },
            { label: 'Icon Grid', value: 'iconGrid' },
            { label: 'Accordion', value: 'accordion' },
            { label: 'Tabs', value: 'tabs' },
            { label: 'Timeline', value: 'timeline' },
            { label: 'Stats Counter', value: 'statsCounter' },
            { label: 'Logo Carousel', value: 'logoCarousel' },
            { label: 'Map', value: 'map' },
            { label: 'Form', value: 'form' },
          ],
        },
        // Text Block
        {
          name: 'textBlock',
          type: 'group',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'textBlock',
          },
          fields: [
            {
              name: 'content',
              type: 'richText',
              editor: pageEditorConfig,
            },
            {
              name: 'columns',
              type: 'select',
              defaultValue: '1',
              options: [
                { label: '1 Column', value: '1' },
                { label: '2 Columns', value: '2' },
                { label: '3 Columns', value: '3' },
              ],
            },
          ],
        },
        // Button Group
        {
          name: 'buttonGroup',
          type: 'group',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'buttonGroup',
          },
          fields: [
            {
              name: 'buttons',
              type: 'array',
              minRows: 1,
              maxRows: 3,
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
                    { label: 'Text', value: 'text' },
                  ],
                },
                {
                  name: 'icon',
                  type: 'select',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Arrow Right', value: 'arrow-right' },
                    { label: 'Download', value: 'download' },
                    { label: 'External', value: 'external' },
                    { label: 'Play', value: 'play' },
                  ],
                },
              ],
            },
            {
              name: 'alignment',
              type: 'select',
              defaultValue: 'center',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
                { label: 'Justify', value: 'justify' },
              ],
            },
          ],
        },
        // Feature List
        {
          name: 'featureList',
          type: 'group',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'featureList',
          },
          fields: [
            {
              name: 'features',
              type: 'array',
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  options: [
                    { label: 'Check', value: 'check' },
                    { label: 'Star', value: 'star' },
                    { label: 'Heart', value: 'heart' },
                    { label: 'Lightning', value: 'lightning' },
                    { label: 'Shield', value: 'shield' },
                    { label: 'Clock', value: 'clock' },
                    { label: 'Globe', value: 'globe' },
                    { label: 'Cog', value: 'cog' },
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
            {
              name: 'iconStyle',
              type: 'select',
              defaultValue: 'circle',
              options: [
                { label: 'Circle', value: 'circle' },
                { label: 'Square', value: 'square' },
                { label: 'None', value: 'none' },
              ],
            },
          ],
        },
        // Card Grid
        {
          name: 'cardGrid',
          type: 'group',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'cardGrid',
          },
          fields: [
            {
              name: 'cards',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'link',
                  type: 'text',
                },
                {
                  name: 'linkText',
                  type: 'text',
                  defaultValue: 'Learn More',
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
            {
              name: 'cardStyle',
              type: 'select',
              defaultValue: 'shadow',
              options: [
                { label: 'Shadow', value: 'shadow' },
                { label: 'Border', value: 'border' },
                { label: 'None', value: 'none' },
              ],
            },
          ],
        },
      ],
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
    {
      name: 'customClasses',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Custom CSS classes',
      },
    },
  ],
}

export default Sections