import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroAnimations } from './HeroAnimations';
import type { HomepageSettings } from '@/lib/homepage-settings';

interface HeroSectionProps {
  heroSettings: HomepageSettings;
  priority?: boolean;
}

const parseTitle = (title: string) => {
  const words = title.split(' ');

  if (words.length < 6) {
    return {
      part1: title,
      part2: '',
      part3: '',
    };
  }

  return {
    part1: 'Vind de stem',
    part2: 'die jouw merk',
    part3: 'laat spreken.',
  };
};

const getImageUrl = (heroImage: any): string => {
  if (typeof heroImage === 'string') {
    return heroImage;
  }
  if (heroImage && typeof heroImage === 'object' && heroImage.url) {
    return heroImage.url;
  }
  return '/header-image.png';
};

/**
 * Optimized Hero Section - Server Component with lazy-loaded animations
 * Improves Core Web Vitals by reducing initial JavaScript bundle
 */
export const OptimizedHeroSection: React.FC<HeroSectionProps> = ({
  heroSettings,
  priority = true,
}) => {
  const { hero } = heroSettings;
  const titleParts = parseTitle(hero.title);
  const imageUrl = getImageUrl(hero.heroImage);

  return (
    <section className="hero bg-background px-6 py-10">
      <div className="hero-container max-w-[1280px] mx-auto px-4 lg:px-[60px] py-8 lg:py-[60px] relative">
        <div className="hero-content grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[60px] items-center relative z-10">
          {/* Left Content */}
          <div className="hero-text">
            {/* Process Steps - Reduced margin on mobile */}
            {hero.processSteps && hero.processSteps.length > 0 && (
              <div className="hero-tag mb-3 md:mb-6">
                <div className="process-steps flex flex-wrap items-center gap-4">
                  {hero.processSteps.map((step, index) => (
                    <React.Fragment key={index}>
                      <span
                        className="step text-[13px] font-medium"
                        style={{ color: 'var(--text-secondary)', fontWeight: '500' }}
                      >
                        {step.text}
                      </span>
                      {index < hero.processSteps!.length - 1 && (
                        <span style={{ color: 'var(--text-muted)' }}>→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Hero Title - SEO optimized with proper heading structure */}
            <h1
              className="hero-title"
              style={{
                fontFamily: '"Bricolage Grotesque", var(--font-bricolage), sans-serif',
                fontSize: 'clamp(3rem, 6vw, 3.5rem)',
                lineHeight: '1.1',
                marginBottom: '20px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              {titleParts.part1 && (
                <span className="block title-main" style={{ color: 'var(--text-primary)' }}>
                  {titleParts.part1}
                </span>
              )}
              {titleParts.part2 && (
                <span className="block title-main" style={{ color: 'var(--text-primary)' }}>
                  {titleParts.part2}
                </span>
              )}
              {titleParts.part3 && (
                <span className="block title-accent" style={{ color: 'var(--primary)' }}>
                  {titleParts.part3}
                </span>
              )}
            </h1>

            {/* Hero Description */}
            <p
              className="hero-description text-base leading-[1.7] mb-8 max-w-[440px]"
              style={{ color: 'var(--text-secondary)' }}
            >
              {hero.description}
            </p>

            {/* CTA Buttons - Performance optimized */}
            <div className="hero-actions flex flex-row gap-3 mb-8 flex-wrap sm:flex-nowrap">
              <Link
                href={hero.primaryButton.url}
                className="flex-1 sm:flex-none"
                style={{
                  backgroundColor: 'var(--foreground)',
                  color: 'var(--background)',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border: 'none',
                  minWidth: 'fit-content',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                prefetch={false} // Don't prefetch unless critical
              >
                {hero.primaryButton.text}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>

              <Link
                href={hero.secondaryButton.url}
                className="flex-1 sm:flex-none"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  minWidth: 'fit-content',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                prefetch={false}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                {hero.secondaryButton.text}
              </Link>
            </div>

            {/* Stats - Always horizontal with smaller font if needed on mobile */}
            {hero.stats && hero.stats.length > 0 && (
              <div
                className="hero-stats flex flex-row justify-between sm:justify-start mt-8 md:mt-12"
                style={{ gap: 'clamp(16px, 4vw, 32px)' }}
              >
                {hero.stats.map((stat, index) => (
                  <div key={index} className="stat-item text-left flex-1 sm:flex-none">
                    <div
                      className="stat-number leading-none mb-[6px]"
                      style={{
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-bricolage)',
                        fontWeight: '800',
                        fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                      }}
                    >
                      {stat.number}
                    </div>
                    <div
                      className="stat-label"
                      style={{
                        color: 'var(--text-secondary)',
                        fontWeight: '500',
                        fontSize: 'clamp(0.7rem, 2vw, 0.813rem)',
                        lineHeight: '1.3',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Content - Image (Hidden on mobile, shown on md+) */}
          <div className="hero-image relative hidden md:block">
            <div
              className="image-wrapper relative mx-auto md:ml-auto max-w-[320px] md:max-w-[380px] lg:max-w-[420px] aspect-[4/5] overflow-hidden border-2"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              }}
            >
              {/* Gradient overlay */}
              <div className="image-gradient absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10 pointer-events-none" />

              {/* Hero Image - Optimized for performance */}
              <Image
                src={imageUrl}
                alt="Professional voice-over artist"
                fill
                className="object-cover"
                priority={priority}
                quality={85} // Slightly reduce quality for faster loading
                sizes="(max-width: 767px) 0px, (max-width: 1023px) 50vw, 420px" // More precise sizing
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lazy-loaded animations for enhanced experience */}
      <HeroAnimations />
    </section>
  );
};

// Named export for better tree-shaking
export { OptimizedHeroSection as HeroSection };
