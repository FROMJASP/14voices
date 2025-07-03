'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnouncementBannerProps {
  enabled?: boolean;
  message: string;
  linkText?: string;
  linkUrl?: string;
  dismissible?: boolean;
  style?: 'gradient' | 'solid' | 'subtle';
}

export function AnnouncementBanner({
  enabled = true,
  message,
  linkText,
  linkUrl,
  dismissible = true,
  style = 'gradient',
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('announcement-banner-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('announcement-banner-dismissed', 'true');
    setIsDismissed(true);
  };

  if (!enabled || isDismissed) return null;

  const styleClasses = {
    gradient: 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white',
    solid: 'bg-purple-600 text-white',
    subtle:
      'bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-100 border-b border-purple-200 dark:border-purple-800',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn('relative overflow-hidden', styleClasses[style])}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-3 text-sm font-medium">
              <div className="flex items-center gap-2">
                {style === 'gradient' && (
                  <span className="inline-flex h-2 w-2 rounded-full bg-white/80 animate-pulse" />
                )}
                <span>{message}</span>
                {linkText && linkUrl && (
                  <>
                    <span className="mx-2 opacity-50">•</span>
                    <Link
                      href={linkUrl}
                      className={cn(
                        'inline-flex items-center gap-1 font-semibold underline-offset-4 hover:underline',
                        style === 'subtle' ? 'text-purple-700 dark:text-purple-300' : 'text-white'
                      )}
                    >
                      {linkText}
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </>
                )}
              </div>
              {dismissible && (
                <button
                  onClick={handleDismiss}
                  className={cn(
                    'absolute right-4 p-1 rounded-full transition-colors',
                    style === 'subtle'
                      ? 'hover:bg-purple-200 dark:hover:bg-purple-800'
                      : 'hover:bg-white/20'
                  )}
                  aria-label="Dismiss banner"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          {style === 'gradient' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: 'linear',
                repeatDelay: 3,
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
