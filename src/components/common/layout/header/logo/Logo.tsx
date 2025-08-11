'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Instrument_Serif } from 'next/font/google';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

export interface LogoSettings {
  logoType?: 'text' | 'image';
  logoText?: string;
  logoImage?: {
    url?: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  logoImageDark?: {
    url?: string;
    alt?: string;
    width?: number;
    height?: number;
  };
}

interface LogoProps {
  settings?: LogoSettings;
  className?: string;
}

export function Logo({
  settings = {
    logoType: 'text',
    logoText: 'FourteenVoices',
  },
  className = '',
}: LogoProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Link href="/" className={`group flex-shrink-0 ${className}`}>
        <div className="w-40 h-8 bg-muted rounded animate-pulse" />
      </Link>
    );
  }

  const isImage = settings.logoType === 'image';
  const isDark = theme === 'dark';

  // Determine which image to use
  const logoImage =
    isDark && settings.logoImageDark?.url ? settings.logoImageDark : settings.logoImage;

  return (
    <Link href="/" className={`group flex-shrink-0 ${className}`}>
      {isImage && logoImage?.url ? (
        <Image
          src={logoImage.url}
          alt={logoImage.alt || 'Logo'}
          width={logoImage.width || 160}
          height={logoImage.height || 32}
          className="h-8 w-auto object-contain"
          priority
        />
      ) : (
        <span
          className={`${instrumentSerif.variable}`}
          style={{
            fontFamily: 'var(--font-instrument-serif), "Instrument Serif", serif',
            fontSize: '32px',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}
        >
          {settings.logoText || 'FourteenVoices'}
        </span>
      )}
    </Link>
  );
}
