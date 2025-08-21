'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Lazy-loaded animation enhancements for the hero section
 * Only loads after the critical content is rendered
 */
export function HeroAnimations() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Delay animation loading to prioritize critical rendering
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) return null;

  return (
    <>
      {/* Subtle background animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-50 to-yellow-50 dark:from-green-950/20 dark:to-yellow-950/20 rounded-full blur-3xl opacity-30" />
      </motion.div>

      {/* Floating particles for premium feel */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
          style={{
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.5,
          }}
        />
      ))}
    </>
  );
}
