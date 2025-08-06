'use client';

import React from 'react';
import Link from 'next/link';

interface PriceCalculatorFooterProps {
  /**
   * Custom contact link text
   */
  contactText?: string;
  /**
   * Custom contact link URL
   */
  contactUrl?: string;
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * Footer component for the price calculator section
 * Provides a link to contact for custom quotes
 */
export const PriceCalculatorFooter = React.memo<PriceCalculatorFooterProps>(
  ({ contactText = 'Neem contact op', contactUrl = '/contact', className = '' }) => {
    return (
      <>
        {/* Contact for custom quote */}
        <div className={`text-center mt-12 ${className}`}>
          <p className="text-sm text-muted-foreground">
            Heb je vragen over de prijzen?{' '}
            <Link href={contactUrl} className="text-primary font-medium hover:underline">
              {contactText}
            </Link>{' '}
            voor een persoonlijke offerte.
          </p>
        </div>

        {/* Add extra spacing for mobile fixed bottom bar */}
        <div className="h-24 md:hidden" />
      </>
    );
  }
);

PriceCalculatorFooter.displayName = 'PriceCalculatorFooter';
