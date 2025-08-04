'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instrument_Serif } from 'next/font/google';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

interface PriceCalculatorHeaderProps {
  /**
   * Main heading text
   */
  title?: string;
  /**
   * Description text below the title
   */
  description?: string;
  /**
   * Optional custom class names
   */
  className?: string;
}

/**
 * Header component for the price calculator section
 * Provides consistent typography and animation for the calculator intro
 */
export const PriceCalculatorHeader = React.memo<PriceCalculatorHeaderProps>(({
  title = 'Transparante prijzen voor elke productie',
  description = 'Bereken direct de kosten voor jouw project. Geen verborgen kosten, altijd transparant.',
  className = '',
}) => {
  return (
    <div className={`max-w-3xl mx-auto text-center mb-16 ${className}`}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`${instrumentSerif.className} text-4xl md:text-5xl lg:text-6xl mb-6`}
      >
        {title.split(' elke productie')[0]}{' '}
        <span className="text-primary italic">elke productie</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-lg md:text-xl text-muted-foreground leading-relaxed"
      >
        {description}
      </motion.p>
    </div>
  );
});

PriceCalculatorHeader.displayName = 'PriceCalculatorHeader';