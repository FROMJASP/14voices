import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  ParagraphFeature,
  InlineCodeFeature,
} from '@payloadcms/richtext-lexical';

export const heroTitleConfig = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    // We'll use InlineCode for brand color - it shows as <code> button
    InlineCodeFeature(),
  ],
});
