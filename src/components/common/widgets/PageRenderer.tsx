'use client';

import React, { useEffect, useMemo } from 'react';
import type { Page } from '@/payload-types';
import { transformHeroDataForHomepage } from '@/lib/homepage-utils';
import { useRouter } from 'next/navigation';
import { transformVoiceoverData } from '@/lib/voiceover-utils';
import type { PayloadVoiceover } from '@/types/voiceover';
// import { useLivePreview } from '@payloadcms/live-preview-react';

// Static imports for all components
import { PageHeroSection } from './PageHeroSection';
import { HeroSection } from '@/components/features/homepage/HeroSection';
import { HeroVariant2 } from '@/components/features/homepage/HeroVariant2';
import { VoiceoverSection } from '@/components/features/homepage/VoiceoverSection';
import LinkToBlogSection from '@/components/features/homepage/LinkToBlogSection';
import ContentSection from '@/components/features/content/ContentSection';
import { BlogSection1 } from '@/components/blocks/BlogSection1';
import { BlogPostHeader } from '@/components/blocks/BlogPostHeader';
import { BlogContent } from '@/components/blocks/BlogContent';
import { BlogPostBlock } from '@/components/blocks/BlogPostBlock';

// Memoized helper function to extract plain text from rich text
const extractPlainText = (richText: any): string => {
  if (!richText?.root?.children) return '';

  const extractText = (children: any[]): string => {
    return children
      .map((child) => {
        if (child.type === 'text') {
          return child.text || '';
        } else if (child.children) {
          return extractText(child.children);
        }
        return '';
      })
      .join('');
  };

  return extractText(richText.root.children);
};

// Define section type union for all possible section types
type PageSection = {
  type:
    | 'richText'
    | 'twoColumn'
    | 'cta'
    | 'contact'
    | 'pricing'
    | 'testimonials'
    | 'features'
    | 'gallery'
    | 'stats';
  content?: any;
  // Add other possible properties based on your section types
};

interface PageRendererProps {
  page: Page;
  voiceovers?: PayloadVoiceover[];
  brandColor?: string;
  blogPost?: any;
}

export default function PageRenderer({
  page,
  voiceovers,
  brandColor,
  blogPost,
}: PageRendererProps) {
  const router = useRouter();
  const isInIframe = typeof window !== 'undefined' && window.parent !== window;
  
  console.log('PageRenderer initialized with page:', {
    slug: page?.slug,
    hasLayout: Array.isArray((page as any)?.layout),
    layoutLength: Array.isArray((page as any)?.layout) ? (page as any).layout.length : 0,
    status: page?.status
  });

  // Temporarily disable live preview to fix re-render issue
  // const { data: liveData } = useLivePreview({
  //   initialData: page,
  //   serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  //   depth: 2,
  // });

  // Use page directly for now
  const currentPage = page as Page;

  // Memoize page metadata
  const pageMetadata = useMemo(
    () => ({
      isHomepage: currentPage.slug === 'home',
      isBlog: currentPage.slug === 'blog',
      isBlogPost: currentPage.slug === 'blog-post',
      hasNewLayout: Array.isArray((currentPage as any).layout),
    }),
    [currentPage.slug, currentPage]
  );

  // Handle live preview refresh messages
  useEffect(() => {
    if (!isInIframe) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'payload-live-preview:refresh') {
        router.refresh();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router, isInIframe]);

  // Memoize hero transformation
  const heroSettings = useMemo(() => {
    const hero = currentPage.hero as any;
    const isHeroVariant1 = hero?.layout === 'variant1';
    const isHomeOrBlog = pageMetadata.isHomepage || pageMetadata.isBlog;

    if (isHomeOrBlog && isHeroVariant1) {
      return transformHeroDataForHomepage(currentPage);
    }
    return null;
  }, [currentPage.hero, pageMetadata.isHomepage, pageMetadata.isBlog, currentPage]);

  // Memoize voiceover transformation
  const transformedVoiceovers = useMemo(() => {
    if (!voiceovers || voiceovers.length === 0) return [];

    // Transform Payload voiceovers
    return voiceovers.map((voiceover, index) =>
      transformVoiceoverData(voiceover as PayloadVoiceover, index)
    );
  }, [voiceovers]);

  // Memoized block renderer
  const renderBlock = useMemo(
    () => (block: any, index: number) => {
      // Skip disabled blocks
      if (block.blockType === 'content-v1' && block.enabled === false) return null;

      const blockKey = `${block.blockType}-${index}`;

      switch (block.blockType) {
        case 'hero-v1': {
          // Hero variant 1 is critical, so not lazy loaded
          const heroData = {
            hero: {
              layout: 'variant1',
              titleRichText: block.title,
              descriptionRichText: block.description,
              processSteps: block.processSteps,
              stats: block.stats,
              heroImage: block.image,
              primaryButton: block.cta?.primaryLabel
                ? {
                    text: block.cta.primaryLabel,
                    url: block.cta.primaryUrl || '#',
                  }
                : null,
              secondaryButton: block.cta?.secondaryLabel
                ? {
                    text: block.cta.secondaryLabel,
                    url: block.cta.secondaryUrl || '#',
                  }
                : null,
            },
          };
          const transformedData = transformHeroDataForHomepage(heroData as any);
          if (transformedData) {
            return (
              <div key={blockKey}>
                <HeroSection heroSettings={transformedData} />
              </div>
            );
          }
          return null;
        }

        case 'hero-v2': {
          return (
            <div key={blockKey}>
                <HeroVariant2
                  badge={block.badge?.enabled !== false ? block.badge : null}
                  title={extractPlainText(block.title)}
                  subtitle={extractPlainText(block.subtitle)}
                  primaryButton={
                    block.cta?.primaryLabel
                      ? {
                          text: block.cta.primaryLabel,
                          url: block.cta.primaryUrl || '#',
                        }
                      : null
                  }
                  secondaryButton={
                    block.cta?.secondaryLabel
                      ? {
                          text: block.cta.secondaryLabel,
                          url: block.cta.secondaryUrl || '#',
                        }
                      : null
                  }
                  brandColor={brandColor}
                  paddingTop={block.paddingTop || 'medium'}
                  paddingBottom={block.paddingBottom || 'medium'}
                />
            </div>
          );
        }

        case 'voiceover-v1': {
          return (
            <div key={blockKey}>
                <VoiceoverSection
                  initialVoiceovers={transformedVoiceovers}
                  title={block.title || undefined}
                />
            </div>
          );
        }

        case 'content-v1': {
          return (
            <div key={blockKey}>
                <ContentSection data={block} />
            </div>
          );
        }

        case 'blog-section-1': {
          return (
            <div key={blockKey}>
                <BlogSection1
                  title={block.title}
                  description={block.description}
                  showCategories={block.showCategories !== false}
                  postsLimit={block.postsLimit || 8}
                  paddingTop={block.paddingTop || 'medium'}
                  paddingBottom={block.paddingBottom || 'medium'}
                />
            </div>
          );
        }

        case 'blog-post-header': {
          return (
            <div key={blockKey}>
                <BlogPostHeader
                  title={block.title}
                  subtitle={block.subtitle}
                  bannerImage={block.bannerImage}
                  author={block.author}
                  category={block.category}
                  publishedDate={block.publishedDate}
                  readingTime={block.readingTime}
                  blogPost={blogPost}
                />
            </div>
          );
        }

        case 'blog-post-content': {
          return (
            <div key={blockKey}>
                <BlogContent content={block.content} blogPost={blogPost} />
            </div>
          );
        }

        case 'blog-post': {
          return (
            <div key={blockKey}>
                <BlogPostBlock
                  showShareButtons={block.showShareButtons}
                  showAuthor={block.showAuthor}
                  blogPost={blogPost}
                />
            </div>
          );
        }

        default:
          console.warn(`Unknown block type: ${block.blockType}`);
          return null;
      }
    },
    [transformedVoiceovers, brandColor, blogPost]
  );

  // For pages with new block layout
  if (pageMetadata.hasNewLayout) {
    const layoutBlocks = (currentPage as any).layout;
    
    console.log('PageRenderer - Rendering page with layout blocks:', {
      slug: currentPage.slug,
      layoutLength: layoutBlocks?.length,
      blocks: layoutBlocks?.map((b: any) => ({ type: b.blockType, id: b.id }))
    });

    return (
      <div className="homepage-preview">
        {layoutBlocks.length > 0
          ? layoutBlocks.map((block: any, index: number) => {
              console.log(`Rendering block ${index}:`, block.blockType, block);
              return renderBlock(block, index);
            })
          : null}
      </div>
    );
  }

  // Legacy page structure (for backwards compatibility)
  if (pageMetadata.isHomepage && heroSettings) {
    return (
      <>
        <HeroSection
          key={`hero-${currentPage.id}-${currentPage.updatedAt}`}
          heroSettings={heroSettings}
        />
          <VoiceoverSection initialVoiceovers={transformedVoiceovers} title={undefined} />
          <LinkToBlogSection data={{ enabled: true }} />
      </>
    );
  }

  // For other pages, try hero variant 2
  const hero = currentPage.hero as any;
  if (hero?.layout === 'variant2') {
    return (
      <>
        <PageHeroSection hero={hero} />
        {currentPage.sections && currentPage.sections.length > 0 && (
          <div className="sections-container">
            {/* @ts-expect-error - section rendering not implemented */}
            {(currentPage.sections as PageSection[]).map((section, index) => (
              <div key={`section-${index}`} className="section-wrapper">
                {/* Add section rendering logic here based on section.type */}
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  // Default fallback
  return <PageHeroSection hero={currentPage.hero || { type: 'none' }} />;
}
