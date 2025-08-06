'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { RichText } from '@/components/RichText';
// Section type is not exported from payload-types
import type { ContentSectionData, TwoColumnBlockData, RichTextContent } from '@/types/blocks';
import { SectionRenderer } from '@/components/renderers';

interface Section {
  id?: string;
  name?: string;
  [key: string]: any;
}

interface UnifiedSectionProps {
  // Can handle different types of section data
  data?: ContentSectionData | TwoColumnBlockData | null;
  section?: string | Section;

  // Layout options
  layout?: 'centered' | 'left' | 'right' | 'twoColumn' | 'twoColumnBlock';
  columnRatio?: '50-50' | '60-40' | '40-60' | '70-30' | '30-70';
  mediaPosition?: 'left' | 'right';

  // Styling
  backgroundColor?: 'white' | 'gray' | 'primary' | 'dark';
  spacing?: 'small' | 'medium' | 'large';
  className?: string;

  // Content
  content?: unknown;
  leftColumn?: unknown;
  rightColumn?: unknown;
  media?: unknown;

  // Features
  blockType?: 'section' | 'content' | 'twoColumn';
  showTitle?: boolean;
  showDescription?: boolean;
}

const bgClasses = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  primary: 'bg-blue-50',
  dark: 'bg-gray-900',
};

const spacingClasses = {
  small: 'py-12 md:py-16',
  medium: 'py-16 md:py-20',
  large: 'py-20 md:py-32',
};

const alignmentClasses = {
  centered: 'mx-auto text-center',
  left: 'mr-auto',
  right: 'ml-auto',
};

const ratioClasses = {
  '50-50': 'md:grid-cols-2',
  '60-40': 'md:grid-cols-[3fr_2fr]',
  '40-60': 'md:grid-cols-[2fr_3fr]',
  '70-30': 'md:grid-cols-[7fr_3fr]',
  '30-70': 'md:grid-cols-[3fr_7fr]',
};

export function UnifiedSection(props: UnifiedSectionProps) {
  const [sectionData, setSectionData] = useState<Section | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle section block type - fetch section data
  useEffect(() => {
    if (props.blockType === 'section' && props.section) {
      setLoading(true);
      async function fetchSection() {
        if (typeof props.section === 'string') {
          try {
            const response = await fetch(`/api/sections/${props.section}`);
            if (response.ok) {
              const data = await response.json();
              setSectionData(data);
            }
          } catch (error) {
            console.error('Failed to fetch section:', error);
          }
        } else {
          setSectionData(props.section || null);
        }
        setLoading(false);
      }
      fetchSection();
    }
  }, [props.section, props.blockType]);

  // Section block type - render fetched section
  if (props.blockType === 'section') {
    if (loading) {
      return (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      );
    }
    if (!sectionData) return null;
    return <SectionRenderer section={sectionData} />;
  }

  // Extract data from various sources
  const data = props.data || props;
  const backgroundColor =
    (data as Record<string, unknown>).backgroundColor || props.backgroundColor || 'white';
  const spacing = props.spacing || 'medium';
  const layout = (data as Record<string, unknown>).layout || props.layout || 'centered';

  // Two column block with rich text
  if (props.blockType === 'twoColumn' || props.leftColumn || props.rightColumn) {
    const columnRatio =
      (data as Record<string, unknown>).columnRatio || props.columnRatio || '50-50';

    return (
      <section
        className={`unified-section ${spacingClasses[spacing]} ${bgClasses[backgroundColor as keyof typeof bgClasses]} ${props.className || ''}`}
      >
        <div className="container mx-auto px-4">
          <div
            className={`grid gap-8 md:gap-12 ${ratioClasses[columnRatio as keyof typeof ratioClasses]}`}
          >
            <div className="prose prose-lg">
              <RichText
                content={
                  (props.leftColumn || (data as Record<string, unknown>).leftColumn) as
                    | RichTextContent
                    | null
                    | undefined
                }
              />
            </div>
            <div className="prose prose-lg">
              <RichText
                content={
                  (props.rightColumn || (data as Record<string, unknown>).rightColumn) as
                    | RichTextContent
                    | null
                    | undefined
                }
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Two column with media
  if (layout === 'twoColumn' && ((data as Record<string, unknown>).media || props.media)) {
    const media = (data as Record<string, unknown>).media || props.media;
    const mediaPosition =
      (data as Record<string, unknown>).mediaPosition || props.mediaPosition || 'right';

    return (
      <section
        className={`unified-section ${spacingClasses[spacing]} ${bgClasses[backgroundColor as keyof typeof bgClasses]} ${props.className || ''}`}
      >
        <div className="container mx-auto px-4">
          <div
            className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${
              mediaPosition === 'left' ? '' : 'md:[&>*:first-child]:order-2'
            }`}
          >
            <div className="relative aspect-video md:aspect-square rounded-lg overflow-hidden">
              {media && typeof media === 'object' && 'url' in media ? (
                <Image
                  src={(media as { url: string; alt?: string }).url}
                  alt={(media as { url: string; alt?: string }).alt || ''}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="prose prose-lg max-w-none">
              <RichText
                content={
                  ((data as Record<string, unknown>).content || props.content) as
                    | RichTextContent
                    | null
                    | undefined
                }
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Standard content section
  return (
    <section
      className={`unified-section ${spacingClasses[spacing]} ${bgClasses[backgroundColor as keyof typeof bgClasses]} ${props.className || ''}`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`prose prose-lg max-w-4xl ${alignmentClasses[layout as keyof typeof alignmentClasses]}`}
        >
          <RichText
            content={
              ((data as Record<string, unknown>).content || props.content) as
                | RichTextContent
                | null
                | undefined
            }
          />
        </div>
      </div>
    </section>
  );
}
