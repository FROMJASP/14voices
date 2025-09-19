'use client';

import React, { useEffect, useMemo } from 'react';
import type { Page } from '@/payload-types';
import { transformHeroDataForHomepage } from '@/lib/homepage-utils';
import { useRouter } from 'next/navigation';
import { transformVoiceoverData } from '@/lib/voiceover-utils';
import type { PayloadVoiceover } from '@/types/voiceover';
import { makeMediaUrlRelative } from '@/lib/media-utils';
// import { useLivePreview } from '@payloadcms/live-preview-react';

// Core components (always loaded)
import { HeroSection } from '@/components/features/homepage/HeroSection';
import { HeroVariant2 } from '@/components/features/homepage/HeroVariant2';
import { VoiceoverSection } from '@/components/features/homepage/VoiceoverSection';
import LinkToBlogSection from '@/components/features/homepage/LinkToBlogSection';
import ContentSection from '@/components/features/content/ContentSection';

// Dynamic imports for blog components (code splitting)
import dynamic from 'next/dynamic';

const BlogSection1 = dynamic(() => import('@/components/blocks/BlogSection1').then(mod => ({ default: mod.BlogSection1 })), {
  loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg" />,
  ssr: true
});

const BlogPostHeader = dynamic(() => import('@/components/blocks/BlogPostHeader').then(mod => ({ default: mod.BlogPostHeader })), {
  loading: () => <div className="animate-pulse h-48 bg-muted rounded-lg" />,
  ssr: true
});

const BlogContent = dynamic(() => import('@/components/blocks/BlogContent').then(mod => ({ default: mod.BlogContent })), {
  loading: () => <div className="animate-pulse h-64 bg-muted rounded-lg" />,
  ssr: true
});

const BlogPostBlock = dynamic(() => import('@/components/blocks/BlogPostBlock').then(mod => ({ default: mod.BlogPostBlock })), {
  loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg" />,
  ssr: true
});

const PriceCalculator = dynamic(() => import('@/components/blocks/PriceCalculator').then(mod => ({ default: mod.PriceCalculator })), {
  loading: () => <div className="animate-pulse h-64 bg-muted rounded-lg" />,
  ssr: true
});

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
    // Find hero block in layout
    const heroBlock = currentPage.layout?.find(
      (block) => block.blockType === 'hero-v1' || block.blockType === 'hero-v2'
    );

    const isHeroVariant1 = heroBlock?.blockType === 'hero-v1';
    const isHomeOrBlog = pageMetadata.isHomepage || pageMetadata.isBlog;

    if (isHomeOrBlog && isHeroVariant1) {
      return transformHeroDataForHomepage(currentPage);
    }
    return null;
  }, [currentPage.layout, pageMetadata.isHomepage, pageMetadata.isBlog, currentPage]);

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
    () =>
      function BlockRenderer(block: any, index: number) {
        // Skip disabled blocks
        if (block.blockType === 'content-v1' && block.enabled === false) return null;

        const blockKey = `${block.blockType}-${index}`;

        switch (block.blockType) {
          case 'hero-v1': {
            // Extract image URL similar to ContentSection
            let heroImageUrl: string | null = null;
            if (block.image) {
              if (typeof block.image === 'object') {
                if (block.image.url) {
                  heroImageUrl = makeMediaUrlRelative(block.image.url);
                } else if (block.image.filename) {
                  heroImageUrl = makeMediaUrlRelative(`/media/${block.image.filename}`);
                }
              }
            }

            // Extract text from rich text fields
            const titleText = block.title
              ? typeof block.title === 'string'
                ? block.title
                : extractPlainText(block.title)
              : '';

            const descriptionText = block.description
              ? typeof block.description === 'string'
                ? block.description
                : extractPlainText(block.description)
              : '';

            // Create hero settings directly from block data
            const heroSettings = {
              hero: {
                title: titleText,
                subtitle: block.subtitle || '',
                description: descriptionText,
                heroImage: heroImageUrl,
                processSteps: block.processSteps || [],
                stats: block.stats || [],
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

            return (
              <div key={blockKey}>
                <HeroSection heroSettings={heroSettings} />
              </div>
            );
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

          case 'price-calculator': {
            return (
              <div key={blockKey}>
                <PriceCalculator {...block} />
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
          ? layoutBlocks.map((block: any, index: number) => {
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

  // For other pages, render content if available
  if (currentPage.content) {
    return (
      <div className="prose prose-lg max-w-none">
        {/* Content will be rendered by the page itself */}
      </div>
    );
  }

  // Default fallback - empty fragment
  return <></>;
}
