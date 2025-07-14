'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const dismissed = localStorage.getItem('banner-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

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
        '<span class="text-primary italic dark:group-hover:text-primary">$1</span>'
      );
      return <span dangerouslySetInnerHTML={{ __html: processedMessage }} />;
    }
    return defaultMessage;
  };

  const bannerStyles = {
    gradient:
      'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 hover:bg-gray-900 dark:hover:bg-gray-50',
    solid: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-900 dark:hover:bg-gray-100',
    subtle: 'bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-900 dark:hover:bg-gray-50',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden ${instrumentSerif.variable}`}
      >
        <a
          href={banner.linkType === 'custom' && banner.linkUrl ? banner.linkUrl : '/voiceovers'}
          className="group block py-3 px-4 text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          {/* Background layers */}
          <div
            className={`absolute inset-0 ${bannerStyles[banner.style || 'gradient']} transition-opacity duration-300`}
          />
          <div className="absolute inset-0 bg-[#212121] dark:bg-[#fafafa] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content */}
          <p className="relative font-instrument-serif text-base md:text-lg lg:text-xl text-foreground/80 transition-colors duration-300 group-hover:text-[#e5e5e5] dark:group-hover:text-[#000000]">
            {renderContent()}
          </p>
        </a>

        {banner.dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
