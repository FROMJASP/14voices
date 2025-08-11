'use client';

import { useEffect, useRef, useCallback } from 'react';

interface ScrollLockOptions {
  /**
   * Whether to restore scroll position when unlocking
   * @default true
   */
  restoreScrollPosition?: boolean;
  /**
   * Additional class to add to body when locked
   * @default undefined
   */
  bodyClass?: string;
}

/**
 * Robust scroll lock hook that prevents scrolling on all devices
 * including iOS bounce scrolling and touch events
 */
export function useScrollLock(isLocked: boolean, options: ScrollLockOptions = {}) {
  const { restoreScrollPosition = true, bodyClass } = options;
  const scrollPosition = useRef<number>(0);
  const isClient = typeof window !== 'undefined';

  // Prevent touch events that cause scrolling
  const preventTouchMove = useCallback((e: TouchEvent) => {
    // Allow touch events on scrollable content inside modal
    const target = e.target as HTMLElement;
    if (target?.closest?.('[data-scroll-lock-ignore]')) {
      return;
    }
    e.preventDefault();
  }, []);

  // Prevent wheel events
  const preventWheel = useCallback((e: WheelEvent) => {
    const target = e.target as HTMLElement;
    if (target?.closest?.('[data-scroll-lock-ignore]')) {
      return;
    }
    e.preventDefault();
  }, []);

  // Prevent keyboard scrolling (arrow keys, space, etc.)
  const preventKeyboardScroll = useCallback((e: KeyboardEvent) => {
    const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // space, page up/down, end, home, arrow keys
    if (scrollKeys.includes(e.keyCode)) {
      const target = e.target as HTMLElement;
      if (target?.closest?.('[data-scroll-lock-ignore]')) {
        return;
      }
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const body = document.body;
    const html = document.documentElement;

    if (isLocked) {
      // Save current scroll position
      scrollPosition.current = window.pageYOffset || document.documentElement.scrollTop;

      // Apply styles to prevent scrolling
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Store original styles
      const originalBodyStyle = body.style.cssText;
      const originalHtmlStyle = html.style.cssText;

      // Apply scroll lock styles
      body.style.cssText = `
        ${originalBodyStyle}
        position: fixed !important;
        top: -${scrollPosition.current}px !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overflow: hidden !important;
        padding-right: ${scrollBarWidth}px !important;
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior: none !important;
      `;

      html.style.cssText = `
        ${originalHtmlStyle}
        overflow: hidden !important;
        position: fixed !important;
        width: 100% !important;
        height: 100% !important;
        overscroll-behavior: none !important;
      `;

      // Add body class if provided
      if (bodyClass) {
        body.classList.add(bodyClass);
      }

      // Add event listeners to prevent scrolling
      document.addEventListener('touchmove', preventTouchMove, { passive: false });
      document.addEventListener('wheel', preventWheel, { passive: false });
      document.addEventListener('keydown', preventKeyboardScroll, { passive: false });

      // Store original styles for cleanup
      (body as any)._originalBodyStyle = originalBodyStyle;
      (html as any)._originalHtmlStyle = originalHtmlStyle;
    } else {
      // Remove scroll lock
      const originalBodyStyle = (body as any)._originalBodyStyle || '';
      const originalHtmlStyle = (html as any)._originalHtmlStyle || '';

      // Restore original styles
      body.style.cssText = originalBodyStyle;
      html.style.cssText = originalHtmlStyle;

      // Remove body class if provided
      if (bodyClass) {
        body.classList.remove(bodyClass);
      }

      // Remove event listeners
      document.removeEventListener('touchmove', preventTouchMove);
      document.removeEventListener('wheel', preventWheel);
      document.removeEventListener('keydown', preventKeyboardScroll);

      // Restore scroll position
      if (restoreScrollPosition) {
        window.scrollTo(0, scrollPosition.current);
      }

      // Clean up stored styles
      delete (body as any)._originalBodyStyle;
      delete (html as any)._originalHtmlStyle;
    }

    // Cleanup on unmount
    return () => {
      if (isLocked) {
        const originalBodyStyle = (body as any)._originalBodyStyle || '';
        const originalHtmlStyle = (html as any)._originalHtmlStyle || '';

        body.style.cssText = originalBodyStyle;
        html.style.cssText = originalHtmlStyle;

        if (bodyClass) {
          body.classList.remove(bodyClass);
        }

        document.removeEventListener('touchmove', preventTouchMove);
        document.removeEventListener('wheel', preventWheel);
        document.removeEventListener('keydown', preventKeyboardScroll);

        if (restoreScrollPosition) {
          window.scrollTo(0, scrollPosition.current);
        }

        delete (body as any)._originalBodyStyle;
        delete (html as any)._originalHtmlStyle;
      }
    };
  }, [
    isLocked,
    isClient,
    bodyClass,
    restoreScrollPosition,
    preventTouchMove,
    preventWheel,
    preventKeyboardScroll,
  ]);
}
