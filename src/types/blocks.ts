export interface RichTextContent {
  root: {
    children: Array<{
      type: string;
      tag?: string;
      text?: string;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      code?: boolean;
      children?: Array<{
        type: string;
        tag?: string;
        text?: string;
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        code?: boolean;
        children?: Array<unknown>;
        fields?: Record<string, unknown>;
        listType?: string;
      }>;
      fields?: Record<string, unknown>;
      listType?: string;
    }>;
  };
}

export interface Button {
  text: string;
  link: string;
  style: 'primary' | 'secondary' | 'outline';
}

export interface MediaItem {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface HeroBannerData {
  headline?: string;
  subheadline?: string;
  backgroundType: 'color' | 'gradient' | 'image' | 'video';
  backgroundColor?: string;
  backgroundImage?: MediaItem;
  backgroundVideo?: string;
  buttons?: Button[];
  height: 'small' | 'medium' | 'large' | 'full';
}

export interface Feature {
  icon?: string;
  title: string;
  description: string;
  link?: string;
}

export interface FeatureGridData {
  headline?: string;
  subheadline?: string;
  features: Feature[];
  columns: '2' | '3' | '4';
}

export interface ContentSectionData {
  layout: 'centered' | 'left' | 'right' | 'twoColumn';
  content: RichTextContent;
  media?: MediaItem;
  mediaPosition?: 'left' | 'right';
  backgroundColor: 'white' | 'gray' | 'primary';
}

export interface CallToActionData {
  headline?: string;
  subheadline?: string;
  buttons?: Button[];
  style: 'centered' | 'left' | 'split';
  backgroundColor: 'white' | 'gray' | 'primary' | 'dark';
}

export interface FAQ {
  question: string;
  answer: RichTextContent;
}

export interface FAQAccordionData {
  headline?: string;
  subheadline?: string;
  faqs: FAQ[];
}

export interface RichTextBlockData {
  content: RichTextContent;
  blockType: 'richText';
}

export interface TwoColumnBlockData {
  leftColumn: RichTextContent;
  rightColumn: RichTextContent;
  columnRatio: '50-50' | '60-40' | '40-60' | '70-30' | '30-70';
  blockType: 'twoColumn';
}

export interface CTABlockData {
  heading?: string;
  text?: string;
  buttons?: Button[];
  backgroundColor: 'white' | 'gray' | 'primary' | 'dark';
  blockType: 'cta';
}
