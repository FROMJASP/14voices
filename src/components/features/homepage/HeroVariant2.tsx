'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedGridPattern from '@/components/ui/animated-grid-pattern';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ButtonIcon } from '@/components/ui/ButtonIcon';
import { cn } from '@/lib/utils';
import './HeroVariant2.css';

interface HeroVariant2Props {
  badge?: {
    text: string;
    color?: string;
    colorDark?: string;
    textColor?: string;
    textColorDark?: string;
    lightingEffect?: string;
    lightingIntensity?: string;
  } | null;
  title?: string;
  subtitle?: string;
  primaryButton?: {
    text: string;
    url: string;
    backgroundColor?: string;
    backgroundColorDark?: string;
    textColor?: string;
    textColorDark?: string;
    icon?: string;
  } | null;
  secondaryButton?: {
    text: string;
    url: string;
    backgroundColor?: string;
    backgroundColorDark?: string;
    borderColor?: string;
    borderColorDark?: string;
    textColor?: string;
    textColorDark?: string;
    icon?: string;
  } | null;
  brandColor?: string;
  paddingTop?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
  paddingBottom?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
}

const paddingMap = {
  none: '0',
  small: '2rem',
  medium: '4rem',
  large: '6rem',
  xlarge: '8rem',
};

export function HeroVariant2({
  badge,
  title = 'Professional Voice-Overs',
  subtitle = 'Transform your content with professional voice-overs. Quick delivery, exceptional quality.',
  primaryButton,
  secondaryButton,
  brandColor = '#6366f1',
  paddingTop = 'medium',
  paddingBottom = 'medium',
}: HeroVariant2Props) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Use min-h-screen only when no padding is applied, otherwise use auto height
  const sectionClass =
    paddingTop === 'none' && paddingBottom === 'none'
      ? 'relative min-h-screen flex items-center justify-center px-6 overflow-hidden'
      : 'relative flex items-center justify-center px-6 overflow-hidden py-16';

  return (
    <div
      style={{
        paddingTop: paddingMap[paddingTop],
        paddingBottom: paddingMap[paddingBottom],
      }}
    >
      <section className={sectionClass}>
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
            'inset-x-0 h-full skew-y-12'
          )}
        />

        <motion.div
          className="relative z-10 text-center max-w-2xl"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          {badge && (
            <motion.div variants={fadeInUp}>
              {badge.color || badge.colorDark ? (
                <span
                  className={cn(
                    'inline-flex items-center justify-center rounded-full border-none px-2 py-1 text-xs font-medium w-fit whitespace-nowrap relative overflow-hidden hero-badge',
                    badge.lightingEffect === 'pulse' && 'badge-pulse',
                    badge.lightingEffect && `badge-${badge.lightingEffect}`
                  )}
                  style={
                    {
                      // Use CSS custom properties for light/dark mode support
                      '--badge-bg-light': badge.color || brandColor,
                      '--badge-bg-dark': badge.colorDark || badge.color || brandColor,
                      '--badge-text-light': badge.textColor || 'white',
                      '--badge-text-dark': badge.textColorDark || badge.textColor || 'white',
                      '--badge-intensity':
                        badge.lightingIntensity === 'subtle'
                          ? '0.2'
                          : badge.lightingIntensity === 'strong'
                            ? '0.6'
                            : '0.4',
                    } as React.CSSProperties
                  }
                >
                  {badge.text}
                  {badge.lightingEffect === 'diagonal' && (
                    <span
                      className="badge-shimmer"
                      style={{
                        background: `linear-gradient(135deg, transparent 30%, rgba(255,255,255,${
                          badge.lightingIntensity === 'subtle'
                            ? '0.3'
                            : badge.lightingIntensity === 'strong'
                              ? '0.6'
                              : '0.5'
                        }) 50%, transparent 70%)`,
                      }}
                    />
                  )}
                </span>
              ) : (
                <Badge
                  className="rounded-full py-1 border-none relative overflow-hidden hero-badge"
                  style={
                    {
                      '--badge-bg-light': brandColor,
                      '--badge-bg-dark': brandColor,
                      '--badge-text-light': 'white',
                      '--badge-text-dark': 'white',
                    } as React.CSSProperties
                  }
                >
                  {badge.text}
                  <span
                    className="badge-shimmer"
                    style={{
                      background: `linear-gradient(135deg, transparent 30%, rgba(255,255,255,${
                        badge.lightingIntensity === 'subtle'
                          ? '0.3'
                          : badge.lightingIntensity === 'strong'
                            ? '0.6'
                            : '0.5'
                      }) 50%, transparent 70%)`,
                    }}
                  />
                </Badge>
              )}
            </motion.div>
          )}

          {title && (
            <motion.h1
              className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight"
              variants={fadeInUp}
            >
              {title}
            </motion.h1>
          )}

          {subtitle && (
            <motion.p className="mt-6 text-[17px] md:text-lg" variants={fadeInUp}>
              {subtitle}
            </motion.p>
          )}

          <motion.div className="mt-12 flex items-center justify-center gap-4" variants={fadeInUp}>
            {primaryButton && (
              <Button
                size="lg"
                className="rounded-full text-base hero-custom-button"
                style={
                  {
                    '--btn-bg-light': primaryButton.backgroundColor || brandColor,
                    '--btn-bg-dark':
                      primaryButton.backgroundColorDark ||
                      primaryButton.backgroundColor ||
                      brandColor,
                    '--btn-text-light': primaryButton.textColor || 'white',
                    '--btn-text-dark':
                      primaryButton.textColorDark || primaryButton.textColor || 'white',
                  } as React.CSSProperties
                }
                asChild
              >
                <Link href={primaryButton.url}>
                  {primaryButton.text}
                  {primaryButton.icon && primaryButton.icon !== 'none' && (
                    <ButtonIcon icon={primaryButton.icon} />
                  )}
                </Link>
              </Button>
            )}

            {secondaryButton && (
              <Button
                variant="outline"
                size="lg"
                className="rounded-full text-base shadow-none hero-custom-button-outline"
                style={
                  {
                    '--btn-bg-light': secondaryButton.backgroundColor || 'transparent',
                    '--btn-bg-dark':
                      secondaryButton.backgroundColorDark ||
                      secondaryButton.backgroundColor ||
                      'transparent',
                    '--btn-border-light': secondaryButton.borderColor || brandColor,
                    '--btn-border-dark':
                      secondaryButton.borderColorDark || secondaryButton.borderColor || brandColor,
                    '--btn-text-light': secondaryButton.textColor || brandColor,
                    '--btn-text-dark':
                      secondaryButton.textColorDark || secondaryButton.textColor || brandColor,
                  } as React.CSSProperties
                }
                asChild
              >
                <Link href={secondaryButton.url}>
                  {secondaryButton.icon && secondaryButton.icon !== 'none' && (
                    <ButtonIcon icon={secondaryButton.icon} />
                  )}
                  {secondaryButton.text}
                </Link>
              </Button>
            )}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
