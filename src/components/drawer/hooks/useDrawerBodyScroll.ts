'use client';

import { useEffect } from 'react';

interface UseDrawerBodyScrollProps {
  /**
   * Whether the drawer is open
   */
  isOpen: boolean;
}

/**
 * Custom hook for managing body scroll lock when drawer is open
 * Includes iOS support and proper scroll position restoration
 */
export function useDrawerBodyScroll({ isOpen }: UseDrawerBodyScrollProps) {
  // Enhanced body scroll lock with iOS support
  useEffect(() => {
    if (!isOpen) return;
    
    // Save current scroll position
    const scrollY = window.scrollY;
    
    // Apply scroll lock
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    // Cleanup
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);
}