import {
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
  StrikethroughFeature,
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
      fields: ({ defaultFields }) => {
        // Filter out any existing newTab field to avoid duplicates
        const filteredFields = defaultFields.filter((field: any) => field.name !== 'newTab');
        return [
          ...filteredFields,
          {
            name: 'newTab',
            type: 'checkbox',
            label: {
              en: 'Open in new tab',
              nl: 'Open in nieuw tabblad',
            },
          },
        ];
      },
    }),
  ],
});
