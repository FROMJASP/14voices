import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  ChecklistFeature,
  HeadingFeature,
  IndentFeature,
  InlineCodeFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
  UploadFeature,
  BlocksFeature,
  lexicalEditor,
  StrikethroughFeature,
  UnderlineFeature,
  SuperscriptFeature,
  SubscriptFeature,
  HorizontalRuleFeature,
} from '@payloadcms/richtext-lexical';

export const blogEditorConfig = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
    BlockquoteFeature(),
    UploadFeature({
      collections: {
        media: {
          fields: [
            {
              name: 'caption',
              type: 'text',
              admin: {
                description: 'Caption for the image',
              },
            },
            {
              name: 'alt',
              type: 'text',
              required: true,
              admin: {
                description: 'Alt text for accessibility',
              },
            },
          ],
        },
      },
    }),
    ChecklistFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    IndentFeature(),
    AlignFeature(),
    InlineCodeFeature(),
    SuperscriptFeature(),
    SubscriptFeature(),
    StrikethroughFeature(),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),
    LinkFeature({
      fields: [
        {
          name: 'rel',
          type: 'select',
          hasMany: true,
          options: ['noopener', 'noreferrer', 'nofollow'],
          admin: {
            description: 'Link relationship attributes',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
        },
      ],
    }),
    HorizontalRuleFeature(),
    BlocksFeature({
      blocks: [
        {
          slug: 'codeBlock',
          fields: [
            {
              name: 'language',
              type: 'select',
              defaultValue: 'javascript',
              options: [
                { label: 'JavaScript', value: 'javascript' },
                { label: 'TypeScript', value: 'typescript' },
                { label: 'Python', value: 'python' },
                { label: 'HTML', value: 'html' },
                { label: 'CSS', value: 'css' },
                { label: 'JSON', value: 'json' },
                { label: 'Markdown', value: 'markdown' },
                { label: 'Bash', value: 'bash' },
              ],
            },
            {
              name: 'code',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Paste your code here',
              },
            },
          ],
        },
        {
          slug: 'callout',
          fields: [
            {
              name: 'type',
              type: 'select',
              defaultValue: 'info',
              options: [
                { label: 'Info', value: 'info' },
                { label: 'Warning', value: 'warning' },
                { label: 'Success', value: 'success' },
                { label: 'Danger', value: 'danger' },
              ],
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
          ],
        },
        {
          slug: 'embed',
          fields: [
            {
              name: 'embedType',
              type: 'select',
              defaultValue: 'youtube',
              options: [
                { label: 'YouTube', value: 'youtube' },
                { label: 'Vimeo', value: 'vimeo' },
                { label: 'Twitter/X', value: 'twitter' },
                { label: 'CodePen', value: 'codepen' },
                { label: 'Custom iframe', value: 'iframe' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: {
                description: 'URL of the content to embed',
              },
            },
            {
              name: 'caption',
              type: 'text',
              admin: {
                description: 'Optional caption',
              },
            },
          ],
        },
      ],
    }),
  ],
});
