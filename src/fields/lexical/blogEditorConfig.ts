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
      fields: ({ defaultFields }) => {
        // Filter out any existing newTab field to avoid duplicates
        const filteredFields = defaultFields.filter((field: any) => field.name !== 'newTab');
        return [
          ...filteredFields,
          {
            name: 'rel',
            type: 'select',
            hasMany: true,
            label: {
              en: 'Rel',
              nl: 'Rel',
            },
            options: [
              {
                label: {
                  en: 'No Opener - Prevents the new page from accessing the window.opener property',
                  nl: 'No Opener - Voorkomt dat de nieuwe pagina toegang heeft tot de window.opener eigenschap',
                },
                value: 'noopener',
              },
              {
                label: {
                  en: 'No Referrer - Prevents the browser from sending referrer information',
                  nl: 'No Referrer - Voorkomt dat de browser referrer informatie verstuurt',
                },
                value: 'noreferrer',
              },
              {
                label: {
                  en: 'No Follow - Tells search engines not to follow this link',
                  nl: 'No Follow - Vertelt zoekmachines deze link niet te volgen',
                },
                value: 'nofollow',
              },
            ],
            admin: {
              description: {
                en: 'Link relationship attributes for SEO and security',
                nl: 'Link relatie attributen voor SEO en beveiliging',
              },
            },
          },
          {
            name: 'newTab',
            type: 'checkbox',
            label: {
              en: 'Open in new tab',
              nl: 'Open in nieuw tabblad',
            },
            admin: {
              description: {
                en: 'Opens the link in a new browser tab',
                nl: 'Opent de link in een nieuw browsertabblad',
              },
            },
          },
        ];
      },
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
