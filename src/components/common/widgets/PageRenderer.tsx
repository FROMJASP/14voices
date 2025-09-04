'use client';

import React, { useEffect } from 'react';
import type { Page } from '@/payload-types';
import { PageHeroSection } from './PageHeroSection';
import { HeroSection } from '@/components/features/homepage/HeroSection';
import { HeroVariant2 } from '@/components/features/homepage/HeroVariant2';
import { transformHeroDataForHomepage } from '@/lib/homepage-utils';
import { useRouter } from 'next/navigation';
import { SsgoiTransition } from '@ssgoi/react';
import { VoiceoverSection } from '@/components/features/homepage/VoiceoverSection';
import { transformVoiceoverData } from '@/lib/voiceover-utils';
import type { PayloadVoiceover } from '@/types/voiceover';
import LinkToBlogSection from '@/components/features/homepage/LinkToBlogSection';
import { useLivePreview } from '@payloadcms/live-preview-react';

// Helper function to extract plain text from rich text
function extractPlainText(richText: any): string {
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
}

// Define section type union for all possible section types
type PageSection = {
  type:
    | 'richText'
    | 'twoColumn'
    | 'cta'
    | 'contact'
    | 'pricing'
    | 'testimonials'
    | 'faq'
    | 'gallery';
  // Rich Text Section
  richTextContent?: unknown;
  // Two Column Section
  leftColumn?: unknown;
  rightColumn?: unknown;
  columnRatio?: '50-50' | '60-40' | '40-60' | '70-30' | '30-70';
  // CTA Section
  ctaHeading?: string;
  ctaText?: string;
  ctaButtons?: Array<{
    id?: string | null;
    text: string;
    link: string;
    style?: 'primary' | 'secondary' | 'outline' | null;
  }>;
  ctaBackgroundColor?: 'white' | 'gray' | 'primary' | 'dark';
  // Contact Section
  contactHeading?: string;
  contactSubheading?: string;
  showContactForm?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  // Pricing Section
  pricingHeading?: string;
  pricingSubheading?: string;
  pricingPlans?: Array<{
    id?: string | null;
    name: string;
    price: string;
    description?: string | null;
    features?: Array<{ id?: string | null; feature: string }> | null;
    highlighted?: boolean | null;
    buttonText?: string | null;
    buttonLink?: string | null;
  }>;
  // Testimonials Section
  testimonialsHeading?: string;
  testimonialsSubheading?: string;
  // FAQ Section
  faqHeading?: string;
  faqSubheading?: string;
  faqs?: Array<{
    question: string;
    answer?: unknown;
  }>;
  // Gallery Section
  galleryHeading?: string;
};

interface PageRendererProps {
  page: Page & {
    content?: unknown;
    sections?: PageSection[];
    linkToBlog?: any;
    pageBlocks?: Array<{
      blockType: 'hero' | 'voiceover' | 'linkToBlog';
      enabled: boolean;
    }>;
  };
  voiceovers?: any[] | null;
  brandColor?: string;
}

export function PageRenderer({
  page: initialPage,
  voiceovers: initialVoiceovers,
  brandColor = '#6366f1',
}: PageRendererProps): React.ReactElement {
  const router = useRouter();

  // Check if we're in the Payload admin iframe
  const isInIframe = typeof window !== 'undefined' && window.parent !== window;

  // Use Payload's live preview hook for real-time updates
  const { data: livePreviewData } = useLivePreview<typeof initialPage>({
    initialData: initialPage,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    depth: 2,
  });

  // Use live preview data if available, otherwise use initial data
  const page =
    isInIframe && livePreviewData ? (livePreviewData as typeof initialPage) : initialPage;

  // Debug logging for live preview
  useEffect(() => {
    if (isInIframe && livePreviewData) {
      console.log('Live preview data updated:', {
        hero: livePreviewData.hero,
        voiceover: livePreviewData.voiceover,
        linkToBlog: livePreviewData.linkToBlog,
      });
    }
  }, [livePreviewData, isInIframe]);

  // Preserve voiceovers from props - they shouldn't be affected by live preview
  const voiceovers = initialVoiceovers;

  // Listen for save events
  useEffect(() => {
    if (!isInIframe) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'payload-live-preview' && event.data?.action === 'saved') {
        router.refresh();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router, isInIframe]);

  // Check if this is the homepage
  const isHomepage = page.slug === 'home';

  // Transform the data with live updates - must be called unconditionally
  const heroSettings = React.useMemo(() => {
    // Check for hero data
    const hero = page.hero as any;
    const isHeroVariant1 = hero?.layout === 'variant1';
    const isHomeOrBlog = page.slug === 'home' || page.slug === 'blog';
    return isHomeOrBlog && isHeroVariant1 ? transformHeroDataForHomepage(page) : null;
  }, [page]);

  // Transform voiceovers data if needed
  const transformedVoiceovers = React.useMemo(() => {
    if (!voiceovers || voiceovers.length === 0) return [];

    // Check if voiceovers are already transformed (have tags array)
    if (voiceovers[0].tags && Array.isArray(voiceovers[0].tags)) {
      return voiceovers;
    }

    // Transform Payload voiceovers to the expected format
    return voiceovers.map((voiceover, index) =>
      transformVoiceoverData(voiceover as PayloadVoiceover, index)
    );
  }, [voiceovers]);

  // For homepage or blog page with hero blocks
  const hero = page.hero as any;
  const voiceover = page.voiceover;
  const linkToBlog = page.linkToBlog;

  if (isHomepage || page.slug === 'blog') {
    // Get pageBlocks array or use default order
    const blocksArray = page.pageBlocks || [
      { blockType: 'hero', enabled: true, heroVariant: 'variant1' },
      { blockType: 'voiceover', enabled: true, voiceoverVariant: 'variant1' },
      { blockType: 'linkToBlog', enabled: true, contentVariant: 'variant1' },
    ];

    return (
      <SsgoiTransition id={`/${page.slug || ''}`}>
        <div className="homepage-preview">
          {/* Render blocks based on pageBlocks array order and enabled state */}
          {blocksArray.map((blockItem, index) => {
            if (!blockItem.enabled) return null;

            // Create component based on block type and variant
            switch (blockItem.blockType) {
              case 'hero': {
                const variant =
                  ('heroVariant' in blockItem ? blockItem.heroVariant : undefined) ||
                  hero?.layout ||
                  'variant1';
                if (variant === 'variant1' && heroSettings) {
                  return (
                    <div key={`hero-${index}-${variant}`}>
                      <HeroSection heroSettings={heroSettings} />
                    </div>
                  );
                } else if (variant === 'variant2') {
                  return (
                    <div key={`hero-${index}-${variant}`}>
                      <HeroVariant2
                        badge={hero?.badge?.enabled !== false ? hero?.badge : null}
                        title={
                          hero?.titleRichText ? extractPlainText(hero.titleRichText) : hero?.title
                        }
                        subtitle={
                          hero?.subtitleRichText
                            ? extractPlainText(hero.subtitleRichText)
                            : hero?.subtitle
                        }
                        primaryButton={
                          hero?.primaryButton?.enabled !== false ? hero?.primaryButton : null
                        }
                        secondaryButton={
                          hero?.secondaryButton?.enabled !== false ? hero?.secondaryButton : null
                        }
                        brandColor={brandColor}
                      />
                    </div>
                  );
                }
                return null;
              }
              case 'voiceover': {
                return (
                  <div key={`voiceover-${index}`}>
                    <VoiceoverSection
                      initialVoiceovers={transformedVoiceovers}
                      title={voiceover?.title || 'Onze Stemacteurs'}
                    />
                  </div>
                );
              }
              case 'linkToBlog': {
                if (!linkToBlog) return null;
                return (
                  <div key={`content-${index}`}>
                    <LinkToBlogSection data={linkToBlog} />
                  </div>
                );
              }
              default:
                return null;
            }
          })}

          {/* Optionally render other homepage sections if needed for preview */}
          {page.sections && page.sections.length > 0 && (
            <div className="sections-container">{/* Render sections... */}</div>
          )}
        </div>
      </SsgoiTransition>
    );
  }

  return (
    <SsgoiTransition id={`/${page.slug || ''}`}>
      <article className="page-content bg-background text-foreground">
        {/* Render hero section if present */}
        {page.hero && page.hero.type && page.hero.type !== 'none' && (
          <PageHeroSection hero={page.hero} />
        )}

        {page.content ? (
          <div className="prose prose-lg mx-auto max-w-4xl px-4 py-8">
            {/* Render rich text content here */}
            <div>{/* Rich text will be rendered by Payload's lexical renderer */}</div>
          </div>
        ) : null}
        {page.sections && page.sections.length > 0 && (
          <div className="sections-container">
            {page.sections.map((section, index) => {
              switch (section.type) {
                case 'richText':
                  return (
                    <section key={index} className="py-12">
                      <div className="prose prose-lg mx-auto max-w-4xl px-4">
                        {/* Rich text content */}
                        <div>{/* section.richTextContent */}</div>
                      </div>
                    </section>
                  );

                case 'twoColumn':
                  const columnClasses = {
                    '50-50': 'grid-cols-1 md:grid-cols-2',
                    '60-40': 'grid-cols-1 md:grid-cols-[1.5fr_1fr]',
                    '40-60': 'grid-cols-1 md:grid-cols-[1fr_1.5fr]',
                    '70-30': 'grid-cols-1 md:grid-cols-[2.333fr_1fr]',
                    '30-70': 'grid-cols-1 md:grid-cols-[1fr_2.333fr]',
                  };
                  return (
                    <section key={index} className="py-12">
                      <div
                        className={`container mx-auto px-4 grid gap-8 ${columnClasses[(section.columnRatio as keyof typeof columnClasses) || '50-50']}`}
                      >
                        <div className="prose prose-lg">{/* section.leftColumn */}</div>
                        <div className="prose prose-lg">{/* section.rightColumn */}</div>
                      </div>
                    </section>
                  );

                case 'cta':
                  const bgClasses = {
                    white: 'bg-white',
                    gray: 'bg-gray-50',
                    primary: 'bg-primary text-white',
                    dark: 'bg-gray-900 text-white',
                  };
                  return (
                    <section
                      key={index}
                      className={`py-16 ${bgClasses[(section.ctaBackgroundColor as keyof typeof bgClasses) || 'gray']}`}
                    >
                      <div className="container mx-auto px-4 text-center">
                        {section.ctaHeading && (
                          <h2 className="text-3xl font-bold mb-4">{section.ctaHeading}</h2>
                        )}
                        {section.ctaText && (
                          <p className="text-xl mb-8 max-w-2xl mx-auto">{section.ctaText}</p>
                        )}
                        {section.ctaButtons && section.ctaButtons.length > 0 && (
                          <div className="flex flex-wrap gap-4 justify-center">
                            {section.ctaButtons.map((button, btnIndex) => (
                              <a
                                key={btnIndex}
                                href={button.link}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                  button.style === 'primary'
                                    ? 'bg-primary text-white hover:bg-primary/90'
                                    : button.style === 'secondary'
                                      ? 'bg-secondary text-white hover:bg-secondary/90'
                                      : 'border-2 border-current hover:bg-current hover:text-white'
                                }`}
                              >
                                {button.text}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </section>
                  );

                case 'contact':
                  return (
                    <section key={index} className="py-16 bg-gray-50">
                      <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                          {section.contactHeading && (
                            <h2 className="text-3xl font-bold mb-4 text-center">
                              {section.contactHeading}
                            </h2>
                          )}
                          {section.contactSubheading && (
                            <p className="text-xl mb-12 text-center text-muted-foreground">
                              {section.contactSubheading}
                            </p>
                          )}
                          <div className="grid md:grid-cols-2 gap-8">
                            <div>
                              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                              {section.contactEmail && (
                                <p className="mb-2">
                                  <strong>Email:</strong>{' '}
                                  <a
                                    href={`mailto:${section.contactEmail}`}
                                    className="text-primary hover:underline"
                                  >
                                    {section.contactEmail}
                                  </a>
                                </p>
                              )}
                              {section.contactPhone && (
                                <p className="mb-2">
                                  <strong>Phone:</strong>{' '}
                                  <a
                                    href={`tel:${section.contactPhone}`}
                                    className="text-primary hover:underline"
                                  >
                                    {section.contactPhone}
                                  </a>
                                </p>
                              )}
                            </div>
                            {section.showContactForm && (
                              <div>
                                <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
                                {/* Contact form would go here */}
                                <p className="text-muted-foreground">Contact form coming soon...</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>
                  );

                case 'pricing':
                  return (
                    <section key={index} className="py-16">
                      <div className="container mx-auto px-4">
                        {section.pricingHeading && (
                          <h2 className="text-3xl font-bold mb-4 text-center">
                            {section.pricingHeading}
                          </h2>
                        )}
                        {section.pricingSubheading && (
                          <p className="text-xl mb-12 text-center text-muted-foreground">
                            {section.pricingSubheading}
                          </p>
                        )}
                        {section.pricingPlans && section.pricingPlans.length > 0 && (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {section.pricingPlans.map((plan, planIndex) => (
                              <div
                                key={planIndex}
                                className={`border rounded-lg p-8 ${
                                  plan.highlighted
                                    ? 'border-primary shadow-lg scale-105'
                                    : 'border-border'
                                }`}
                              >
                                {plan.highlighted && (
                                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Popular
                                  </span>
                                )}
                                <h3 className="text-2xl font-bold mt-4">{plan.name}</h3>
                                <p className="text-3xl font-bold mt-2 mb-4">{plan.price}</p>
                                {plan.description && (
                                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                                )}
                                {plan.features && plan.features.length > 0 && (
                                  <ul className="mb-8 space-y-2">
                                    {plan.features.map((feature, featureIndex) => (
                                      <li key={featureIndex} className="flex items-center">
                                        <svg
                                          className="w-5 h-5 text-green-500 mr-2"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        {feature.feature}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                {plan.buttonLink && plan.buttonText && (
                                  <a
                                    href={plan.buttonLink}
                                    className={`block text-center py-3 px-6 rounded-lg font-medium transition-colors ${
                                      plan.highlighted
                                        ? 'bg-primary text-white hover:bg-primary/90'
                                        : 'bg-muted text-foreground hover:bg-muted/80'
                                    }`}
                                  >
                                    {plan.buttonText}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </section>
                  );

                case 'testimonials':
                  return (
                    <section key={index} className="py-16 bg-surface">
                      <div className="container mx-auto px-4">
                        {section.testimonialsHeading && (
                          <h2 className="text-3xl font-bold mb-4 text-center">
                            {section.testimonialsHeading}
                          </h2>
                        )}
                        {section.testimonialsSubheading && (
                          <p className="text-xl mb-12 text-center text-muted-foreground">
                            {section.testimonialsSubheading}
                          </p>
                        )}
                        {/* Testimonials would be fetched and rendered here based on source */}
                        <div className="text-center text-muted-foreground">
                          <p>Testimonials coming soon...</p>
                        </div>
                      </div>
                    </section>
                  );

                case 'faq':
                  return (
                    <section key={index} className="py-16">
                      <div className="container mx-auto px-4 max-w-3xl">
                        {section.faqHeading && (
                          <h2 className="text-3xl font-bold mb-4 text-center">
                            {section.faqHeading}
                          </h2>
                        )}
                        {section.faqSubheading && (
                          <p className="text-xl mb-12 text-center text-muted-foreground">
                            {section.faqSubheading}
                          </p>
                        )}
                        {section.faqs && section.faqs.length > 0 && (
                          <div className="space-y-4">
                            {section.faqs.map(
                              (faq: { question: string; answer?: unknown }, faqIndex: number) => (
                                <details
                                  key={faqIndex}
                                  className="border border-border rounded-lg p-4"
                                >
                                  <summary className="font-semibold cursor-pointer">
                                    {faq.question}
                                  </summary>
                                  <div className="mt-4 prose prose-sm">
                                    {/* faq.answer - rich text */}
                                  </div>
                                </details>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </section>
                  );

                case 'gallery':
                  return (
                    <section key={index} className="py-16">
                      <div className="container mx-auto px-4">
                        {section.galleryHeading && (
                          <h2 className="text-3xl font-bold mb-12 text-center">
                            {section.galleryHeading}
                          </h2>
                        )}
                        {/* Gallery images would be rendered here */}
                        <div className="text-center text-muted-foreground">
                          <p>Gallery coming soon...</p>
                        </div>
                      </div>
                    </section>
                  );

                default:
                  return null;
              }
            })}
          </div>
        )}
      </article>
    </SsgoiTransition>
  );
}
