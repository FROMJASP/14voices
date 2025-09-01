import {
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  InlineCodeFeature,
} from '@payloadcms/richtext-lexical';

export const heroDescriptionConfig = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    // We'll use InlineCode for brand color - it shows as <code> button
    InlineCodeFeature(),
    LinkFeature({
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
          label: {
            en: 'URL',
            nl: 'URL',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: {
            en: 'Open in new tab',
            nl: 'Open in nieuw tabblad',
          },
        },
      ],
    }),
  ],
});
