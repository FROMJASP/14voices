'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingTextProps {
  text: string[];
  duration?: number;
  className?: string;
}

export function RotatingText({ text, duration = 3000, className = '' }: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dimensions, setDimensions] = useState<{ [key: string]: number }>({});
  const measureRef = useRef<HTMLSpanElement>(null);

  const measureTextWidths = useCallback(() => {
    if (measureRef.current) {
      const widths: { [key: string]: number } = {};
      const span = measureRef.current;
      
      text.forEach((word) => {
        span.textContent = word;
        const width = span.getBoundingClientRect().width;
        widths[word] = Math.ceil(width);
      });
      
      setDimensions(widths);
    }
  }, [text]);

  useEffect(() => {
    // Measure on mount and when dependencies change
    measureTextWidths();
  }, [measureTextWidths, className]);

  useEffect(() => {
    // Add resize listener with debounce
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(measureTextWidths, 150);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [measureTextWidths]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % text.length);
    }, duration);

    return () => clearInterval(interval);
  }, [text.length, duration]);

  const currentWord = text[currentIndex];
  const currentWidth = dimensions[currentWord] || 100;
  
  // Add small padding for better visual balance
  const displayWidth = currentWidth + 5;

  return (
    <>
      {/* Hidden span for measuring text width */}
      <span
        ref={measureRef}
        className={className}
        style={{ 
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          top: '-9999px',
          left: '-9999px'
        }}
        aria-hidden="true"
      />
      
      <motion.span 
        className={`inline-block ${className}`}
        animate={{ width: displayWidth }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="inline-block whitespace-nowrap"
          >
            {currentWord}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}