'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { HomepageSettings } from '@/lib/homepage-settings';

interface HeroSectionProps {
  heroSettings: HomepageSettings;
}

const fadeInUpDelayed = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerChild = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export const HeroSection: React.FC<HeroSectionProps> = ({ heroSettings }) => {
  const { hero } = heroSettings;

  // Parse title into specific parts for proper display
  // Expected format: "Vind de stem die jouw merk laat spreken."
  const parseTitle = (title: string) => {
    if (!title) {
      return {
        part1: '',
        part2: '',
        part3: '',
      };
    }

    // Split by words and group them according to mockup
    const words = title.split(' ').filter((word) => word.length > 0);

    // Default structure if title format is different
    if (words.length < 6) {
      return {
        part1: title,
        part2: '',
        part3: '',
      };
    }

    // Dynamic parsing based on word count
    const firstThreeWords = words.slice(0, 3).join(' ');
    const middleWords = words.slice(3, 6).join(' ');
    const remainingWords = words.slice(6).join(' ');

    return {
      part1: firstThreeWords,
      part2: middleWords,
      part3: remainingWords,
    };
  };

  const titleParts = parseTitle(hero.title);

  // Handle image URL extraction - should already be resolved by transformHeroDataForHomepage
  const imageUrl = hero.heroImage || '/header-image.png';

  return (
    <section className="hero bg-background px-6 py-10">
      <div className="hero-container max-w-[1280px] mx-auto px-4 lg:px-[60px] py-8 lg:py-[60px] relative">
        <div className="hero-content grid grid-cols-1 min-[811px]:grid-cols-2 gap-6 sm:gap-8 md:gap-[60px] items-center relative z-10">
          {/* Left Content */}
          <motion.div
            className="hero-text"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Process Steps - Reduced margin on mobile */}
            {hero.processSteps && hero.processSteps.length > 0 && (
              <motion.div className="hero-tag mb-3 md:mb-6" variants={staggerChild}>
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
              </motion.div>
            )}

            {/* Hero Title - Bigger on mobile */}
            <motion.h1
              className="hero-title"
              style={{
                fontFamily: '"Bricolage Grotesque", var(--font-bricolage), sans-serif',
                fontSize: 'clamp(3rem, 6vw, 3.5rem)', // Increased minimum from 2.5rem to 3rem
                lineHeight: '1.1',
                marginBottom: '20px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
              variants={staggerChild}
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
            </motion.h1>

            {/* Hero Description */}
            <motion.p
              className="hero-description text-base leading-[1.7] mb-8 max-w-[440px]"
              style={{ color: 'var(--text-secondary)' }}
              variants={staggerChild}
            >
              {hero.description}
            </motion.p>

            {/* CTA Buttons - Side by side on mobile, responsive flex */}
            <motion.div
              className="hero-actions flex flex-row gap-3 mb-8 flex-wrap sm:flex-nowrap"
              variants={staggerChild}
            >
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
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                {hero.secondaryButton.text}
              </Link>
            </motion.div>

            {/* Stats - Always horizontal with smaller font if needed on mobile */}
            {hero.stats && hero.stats.length > 0 && (
              <motion.div
                className="hero-stats flex flex-row justify-between sm:justify-start mt-8 md:mt-12"
                style={{ gap: 'clamp(16px, 4vw, 32px)' }}
                variants={staggerChild}
              >
                {hero.stats.map((stat, index) => (
                  <div key={index} className="stat-item text-left flex-1 sm:flex-none">
                    <div
                      className="stat-number leading-none mb-[6px]"
                      style={{
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-bricolage)',
                        fontWeight: '800',
                        fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', // Responsive font size
                      }}
                    >
                      {stat.number}
                    </div>
                    <div
                      className="stat-label"
                      style={{
                        color: 'var(--text-secondary)',
                        fontWeight: '500',
                        fontSize: 'clamp(0.7rem, 2vw, 0.813rem)', // Responsive font size
                        lineHeight: '1.3',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Right Content - Image (Hidden below 810px, shown above) */}
          <motion.div
            className="hero-image relative hidden min-[811px]:block"
            initial="initial"
            animate="animate"
            variants={fadeInUpDelayed}
          >
            <div
              className="image-wrapper relative mx-auto sm:ml-auto max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] aspect-[4/5] overflow-hidden border-2 border-border"
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              }}
            >
              {/* Gradient overlay */}
              <div className="image-gradient absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10 pointer-events-none" />

              {/* Hero Image */}
              <Image
                src={imageUrl}
                alt="Professional voice-over artist"
                fill
                className="object-cover scale-100"
                style={{ transformOrigin: 'center' }}
                priority
                sizes="(max-width: 639px) 0px, (max-width: 767px) 280px, (max-width: 1023px) 380px, 420px"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
