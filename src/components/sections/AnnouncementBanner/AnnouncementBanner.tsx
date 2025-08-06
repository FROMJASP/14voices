'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Instrument_Serif } from 'next/font/google';
import DOMPurify from 'dompurify';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

interface AnnouncementBannerProps {
  enabled?: boolean;
  message?: string;
  linkText?: string;
  linkUrl?: string;
  dismissible?: boolean;
  style?: 'gradient' | 'solid' | 'subtle';
}

export function AnnouncementBanner({
  enabled = true,
  message,
  linkUrl,
  dismissible = false,
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    if (dismissible) {
      const dismissed = localStorage.getItem('announcement-banner-dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      } else {
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
  }, [dismissible]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('announcement-banner-dismissed', 'true');
    setIsDismissed(true);
  };

  if (!enabled || (dismissible && isDismissed)) return null;

  // Default message if none provided
  const defaultMessage = (
    <>
      <span className="text-sm">🚀</span>{' '}
      <span className="text-primary italic dark:group-hover:text-primary">14 Nieuwe Stemmen</span>.
      Beluister hier wat ze voor jou kunnen betekenen!
    </>
  );

  const renderContent = () => {
    if (message && typeof message === 'string') {
      // Replace any text wrapped in ** with primary color styling
      const processedMessage = message.replace(
        /\*\*(.*?)\*\*/g,
        '<span class="text-primary italic dark:group-hover:text-primary">$1</span>'
      );
      const sanitizedHTML = DOMPurify.sanitize(processedMessage, {
        ALLOWED_TAGS: ['span'],
        ALLOWED_ATTR: ['class'],
      });
      return <span dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
    }
    return defaultMessage;
  };

  return (
    <div className={instrumentSerif.variable}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative overflow-hidden"
          >
            {linkUrl ? (
              <Link href={linkUrl} className="block">
                <div className="group transition-all duration-300 bg-[#fcf9f5] dark:bg-card/50 hover:bg-foreground dark:hover:bg-[#fcf9f5] cursor-pointer">
                  <div className="py-2 px-4 text-center">
                    <p
                      className="text-lg md:text-xl text-foreground group-hover:text-background dark:group-hover:text-black transition-colors duration-300"
                      style={{
                        fontFamily: 'var(--font-instrument-serif)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {renderContent()}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="group transition-all duration-300 bg-[#fcf9f5] dark:bg-card/50 hover:bg-foreground dark:hover:bg-[#fcf9f5] cursor-pointer">
                <div className="py-2 px-4 text-center">
                  <p
                    className="text-lg md:text-xl text-foreground group-hover:text-background dark:group-hover:text-black transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-instrument-serif)', letterSpacing: '0.02em' }}
                  >
                    {renderContent()}
                  </p>
                </div>
              </div>
            )}
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-foreground/60 hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
