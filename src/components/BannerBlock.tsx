'use client';

import { X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instrument_Serif } from 'next/font/google';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

interface BannerData {
  enabled?: boolean;
  message?: string;
  linkType?: 'none' | 'custom' | 'page';
  linkUrl?: string;
  linkText?: string;
  dismissible?: boolean;
  style?: 'gradient' | 'solid' | 'subtle';
}

interface BannerBlockProps {
  banner: BannerData;
}

export function BannerBlock({ banner }: BannerBlockProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check URL parameter to reset banner
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('resetBanner') === 'true') {
      localStorage.removeItem('banner-dismissed');
      setIsDismissed(false);
      return;
    }
    
    // Reset banner state if dismissible setting changes from true to false
    if (!banner.dismissible) {
      localStorage.removeItem('banner-dismissed');
      setIsDismissed(false);
      return;
    }
    
    const dismissed = localStorage.getItem('banner-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, [banner.dismissible]);

  // Check if text overflows on mobile
  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current && containerRef.current) {
        const contentWidth = contentRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;
        setShouldAnimate(contentWidth > containerWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [banner.message]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('banner-dismissed', 'true');
  };

  if (!banner.enabled || isDismissed) {
    return null;
  }

  const defaultMessage =
    '🚀 **14 Nieuwe Stemmen**. Beluister hier wat ze voor jou kunnen betekenen!';

  const renderContent = () => {
    if (banner.message && typeof banner.message === 'string') {
      const processedMessage = banner.message.replace(
        /\*\*(.*?)\*\*/g,
        '<span class="text-primary font-medium italic dark:group-hover:text-primary">$1</span>'
      );
      return <span dangerouslySetInnerHTML={{ __html: processedMessage }} />;
    }
    return defaultMessage;
  };

  const bannerStyles = {
    gradient: 'bg-gradient-to-r from-[#f5f0e8] to-[#fcf9f5] dark:from-[#141414] dark:to-[#1a1a1a]',
    solid: 'bg-[#f5f0e8] dark:bg-[#141414]',
    subtle: 'bg-[#fcf9f5]/50 dark:bg-[#141414]/50',
  };

  const handleBannerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If on homepage and no custom link, scroll to voiceover grid
    if (window.location.pathname === '/' && !(banner.linkType === 'custom' && banner.linkUrl)) {
      e.preventDefault();
      const voiceoverGrid = document.getElementById('voiceover-grid');
      if (voiceoverGrid) {
        // Get the element's position and account for sticky header
        const rect = voiceoverGrid.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        // Offset by 200px to show the style tags above the grid
        const targetPosition = rect.top + scrollTop - 200;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
    // Otherwise, let the default link behavior happen
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden ${instrumentSerif.variable} border-0 shadow-none`}
      >
        <a
          href={banner.linkType === 'custom' && banner.linkUrl ? banner.linkUrl : '/voiceovers'}
          onClick={handleBannerClick}
          className="group block py-3 px-4 text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          {/* Background layers */}
          <div
            className={`absolute inset-0 ${bannerStyles[banner.style || 'gradient']} transition-opacity duration-300`}
          />
          <div className="absolute inset-0 bg-[#212121] dark:bg-[#fafafa] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content */}
          <div ref={containerRef} className="relative overflow-hidden">
            <motion.div
              ref={contentRef}
              className="inline-flex whitespace-nowrap"
              animate={
                shouldAnimate
                  ? {
                      x: ['0%', '-100%'],
                    }
                  : {
                      x: 0,
                    }
              }
              transition={
                shouldAnimate
                  ? {
                      x: {
                        duration: 40,
                        repeat: Infinity,
                        ease: 'linear',
                      },
                    }
                  : {}
              }
            >
              <p className="inline-block pr-8 font-instrument-serif text-lg md:text-xl lg:text-2xl text-title transition-colors duration-300 group-hover:text-[#e5e5e5] dark:group-hover:text-[#000000]">
                {renderContent()}
              </p>
              {shouldAnimate && (
                <p className="inline-block pr-8 font-instrument-serif text-lg md:text-xl lg:text-2xl text-title transition-colors duration-300 group-hover:text-[#e5e5e5] dark:group-hover:text-[#000000]" aria-hidden="true">
                  {renderContent()}
                </p>
              )}
            </motion.div>
          </div>
        </a>

        {banner.dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
