import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  ParagraphFeature,
  InlineCodeFeature,
  HeadingFeature,
  UnderlineFeature,
  StrikethroughFeature,
} from '@payloadcms/richtext-lexical';

export const heroTitleConfig = lexicalEditor({
  features: () => [
    HeadingFeature({
      enabledHeadingSizes: ['h1', 'h2'],
    }),
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    // We'll use InlineCode for brand color - it shows as <code> button
    InlineCodeFeature(),
  ],
});
