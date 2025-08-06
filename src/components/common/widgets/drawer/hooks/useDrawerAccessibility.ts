'use client';

import { useEffect, useRef } from 'react';

interface UseDrawerAccessibilityProps {
  /**
   * Whether the drawer is open
   */
  isOpen: boolean;
  /**
   * Handler for closing the drawer
   */
  onClose: () => void;
}

/**
 * Custom hook for managing drawer accessibility features
 * Handles focus management, escape key, and focus trapping
 */
export function useDrawerAccessibility({ isOpen, onClose }: UseDrawerAccessibilityProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus management
  useEffect(() => {
    if (!isOpen) return;

    // Store current focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus management - focus close button
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    // Cleanup - return focus to previous element
    return () => {
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  // Handle escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }

      // Focus trap
      if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusableInDrawer = Array.from(focusableElements).filter((el) =>
          el.closest('[role="dialog"]')
        );

        if (focusableInDrawer.length === 0) return;

        const firstElement = focusableInDrawer[0] as HTMLElement;
        const lastElement = focusableInDrawer[focusableInDrawer.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return {
    closeButtonRef,
  };
}
