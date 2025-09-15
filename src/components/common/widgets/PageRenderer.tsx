'use client';

import React, { useEffect, lazy, Suspense, useMemo } from 'react';
import type { Page } from '@/payload-types';
import { transformHeroDataForHomepage } from '@/lib/homepage-utils';
import { useRouter } from 'next/navigation';
import { transformVoiceoverData } from '@/lib/voiceover-utils';
import type { PayloadVoiceover } from '@/types/voiceover';
import { useLivePreview } from '@payloadcms/live-preview-react';
import { LoadingSpinner } from '@/components/common/ui';

// Static imports for critical above-the-fold components
import { PageHeroSection } from './PageHeroSection';
import { HeroSection } from '@/components/features/homepage/HeroSection';

// Dynamic imports for below-the-fold and conditional components
const HeroVariant2 = lazy(() =>
  import('@/components/features/homepage/HeroVariant2').then((mod) => ({
    default: mod.HeroVariant2,
  }))
);
const VoiceoverSection = lazy(() =>
  import('@/components/features/homepage/VoiceoverSection').then((mod) => ({
    default: mod.VoiceoverSection,
  }))
);
const LinkToBlogSection = lazy(() => import('@/components/features/homepage/LinkToBlogSection'));
const ContentSection = lazy(() => import('@/components/features/content/ContentSection'));
const BlogSection1 = lazy(() =>
  import('@/components/blocks/BlogSection1').then((mod) => ({ default: mod.BlogSection1 }))
);
const BlogPostHeader = lazy(() =>
  import('@/components/blocks/BlogPostHeader').then((mod) => ({ default: mod.BlogPostHeader }))
);
const BlogContent = lazy(() =>
  import('@/components/blocks/BlogContent').then((mod) => ({ default: mod.BlogContent }))
);
const BlogPostBlock = lazy(() =>
  import('@/components/blocks/BlogPostBlock').then((mod) => ({ default: mod.BlogPostBlock }))
);

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

// Component for loading state
const BlockLoading = () => (
  <div className="flex items-center justify-center py-12">
    <LoadingSpinner />
  </div>
);

export default function PageRenderer({
  page,
  voiceovers,
  brandColor,
  blogPost,
}: PageRendererProps) {
  const router = useRouter();
  const isInIframe = typeof window !== 'undefined' && window.parent !== window;

  // Hook for live preview - always called
  const { data: liveData } = useLivePreview({
    initialData: page,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 2,
  });

  // Use live data if available
  const currentPage = (liveData || page) as Page;

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
              <Suspense fallback={<BlockLoading />}>
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
              </Suspense>
            </div>
          );
        }

        case 'voiceover-v1': {
          return (
            <div key={blockKey}>
              <Suspense fallback={<BlockLoading />}>
                <VoiceoverSection
                  initialVoiceovers={transformedVoiceovers}
                  title={block.title || undefined}
                />
              </Suspense>
            </div>
          );
        }

        case 'content-v1': {
          return (
            <div key={blockKey}>
              <Suspense fallback={<BlockLoading />}>
                <ContentSection data={block} />
              </Suspense>
            </div>
          );
        }

        case 'blog-section-1': {
          return (
            <div key={blockKey}>
              <Suspense fallback={<BlockLoading />}>
                <BlogSection1
                  title={block.title}
                  description={block.description}
                  showCategories={block.showCategories !== false}
                  postsLimit={block.postsLimit || 8}
                  paddingTop={block.paddingTop || 'medium'}
                  paddingBottom={block.paddingBottom || 'medium'}
                />
              </Suspense>
            </div>
          );
        }

        case 'blog-post-header': {
          return (
            <div key={blockKey}>
              <Suspense fallback={<BlockLoading />}>
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
              </Suspense>
            </div>
          );
        }

        case 'blog-post-content': {
          return (
            <div key={blockKey}>
              <Suspense fallback={<BlockLoading />}>
                <BlogContent content={block.content} blogPost={blogPost} />
              </Suspense>
            </div>
          );
        }

        case 'blog-post': {
          return (
            <div key={blockKey}>
              <Suspense fallback={<BlockLoading />}>
                <BlogPostBlock
                  showShareButtons={block.showShareButtons}
                  showAuthor={block.showAuthor}
                  blogPost={blogPost}
                />
              </Suspense>
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

    return (
      <div className="homepage-preview">
        {layoutBlocks.length > 0
          ? layoutBlocks.map((block: any, index: number) => renderBlock(block, index))
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
        <Suspense fallback={<BlockLoading />}>
          <VoiceoverSection initialVoiceovers={transformedVoiceovers} title={undefined} />
        </Suspense>
        <Suspense fallback={<BlockLoading />}>
          <LinkToBlogSection data={{ enabled: true }} />
        </Suspense>
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
