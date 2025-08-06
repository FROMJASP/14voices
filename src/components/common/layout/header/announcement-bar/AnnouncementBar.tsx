'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Instrument_Serif } from 'next/font/google';
import DOMPurify from 'isomorphic-dompurify';
import type { AnnouncementBarProps } from './AnnouncementBar.types';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

const STORAGE_KEY = 'announcement-bar-dismissed';
const RESET_PARAM = 'resetAnnouncementBar';

export function AnnouncementBar({ data, className = '' }: AnnouncementBarProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle dismissal state and URL reset parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get(RESET_PARAM) === 'true') {
      localStorage.removeItem(STORAGE_KEY);
      setIsDismissed(false);
      return;
    }

    if (!data.dismissible) {
      localStorage.removeItem(STORAGE_KEY);
      setIsDismissed(false);
      return;
    }

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, [data.dismissible]);

  // Check if content overflows for mobile animation
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
  }, [data.message]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleBannerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Special handling for homepage voiceover grid scrolling
    if (window.location.pathname === '/' && data.linkType !== 'custom') {
      e.preventDefault();
      const voiceoverGrid = document.getElementById('voiceover-grid');
      if (voiceoverGrid) {
        const rect = voiceoverGrid.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = rect.top + scrollTop - 200;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  if (!data.enabled || isDismissed) {
    return null;
  }

  const renderContent = () => {
    const processedMessage = data.message.replace(
      /\*\*(.*?)\*\*/g,
      '<span class="text-primary font-medium italic dark:group-hover:text-primary">$1</span>'
    );

    const sanitizedHTML = DOMPurify.sanitize(processedMessage, {
      ALLOWED_TAGS: ['span'],
      ALLOWED_ATTR: ['class'],
    });

    return <span dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
  };

  const bannerStyles = {
    gradient: 'bg-gradient-to-r from-[#f5f0e8] to-[#fcf9f5] dark:from-[#141414] dark:to-[#1a1a1a]',
    solid: 'bg-[#f5f0e8] dark:bg-[#141414]',
    subtle: 'bg-[#fcf9f5]/50 dark:bg-[#141414]/50',
  };

  const defaultLink = data.linkType === 'custom' && data.linkUrl ? data.linkUrl : '/voiceovers';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden ${instrumentSerif.variable} ${className}`}
      >
        <a
          href={defaultLink}
          onClick={handleBannerClick}
          className="group block py-3 px-4 text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          {/* Background layers */}
          <div
            className={`absolute inset-0 ${bannerStyles[data.style || 'gradient']} transition-opacity duration-300`}
          />
          <div className="absolute inset-0 bg-[#212121] dark:bg-[#fafafa] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content */}
          <div ref={containerRef} className="relative overflow-hidden">
            <motion.div
              ref={contentRef}
              className="inline-flex whitespace-nowrap"
              animate={shouldAnimate ? { x: ['0%', '-100%'] } : { x: 0 }}
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
                <p
                  className="inline-block pr-8 font-instrument-serif text-lg md:text-xl lg:text-2xl text-title transition-colors duration-300 group-hover:text-[#e5e5e5] dark:group-hover:text-[#000000]"
                  aria-hidden="true"
                >
                  {renderContent()}
                </p>
              )}
            </motion.div>
          </div>
        </a>

        {data.dismissible && (
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
