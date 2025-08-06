'use client';

import { useEffect } from 'react';

interface UseDrawerHistoryProps {
  /**
   * Whether the drawer is open
   */
  isOpen: boolean;
  /**
   * Slug for the production/content being displayed
   */
  productionSlug: string | null;
  /**
   * Handler for closing the drawer
   */
  onClose: () => void;
}

/**
 * Custom hook for managing browser history with drawer state
 * Updates URL when drawer opens/closes and handles back button
 */
export function useDrawerHistory({ isOpen, productionSlug, onClose }: UseDrawerHistoryProps) {
  // Update URL when drawer opens/closes
  useEffect(() => {
    if (isOpen && productionSlug) {
      // Update URL without navigation
      const newUrl = `/order/${productionSlug}`;
      if (window.location.pathname !== newUrl) {
        window.history.pushState({ drawer: true }, '', newUrl);
      }
    } else if (!isOpen && window.location.pathname !== '/') {
      // Go back to home without navigation
      window.history.pushState({ drawer: false }, '', '/');
    }
  }, [isOpen, productionSlug]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onClose]);
}
