'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HoverTooltipProps {
  text?: string;
  enabled?: boolean;
  className?: string;
}

export function HoverTooltip({
  text = 'Klik voor meer info',
  enabled = true,
  className = '',
}: HoverTooltipProps) {
  const [localPosition, setLocalPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setLocalPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Only render on desktop (check happens on client only)
  if (!enabled || !isMounted) return null;

  // Use CSS to hide on mobile instead of JS check to avoid hydration issues
  const isMobileClass = 'hidden md:block';

  return (
    <>
      <div
        ref={containerRef}
        className={`absolute inset-0 z-10 ${isMobileClass}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onMouseMove={handleMouseMove}
        style={{ cursor: 'pointer' }}
      />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`pointer-events-none absolute z-50 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg whitespace-nowrap ${isMobileClass} ${className}`}
            style={{
              left: localPosition.x + 10,
              top: localPosition.y + 10,
              boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
            }}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
