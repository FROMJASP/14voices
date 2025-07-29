'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface PreviewCardProps {
  children: React.ReactNode;
  delay?: number;
  closeDelay?: number;
}

export interface PreviewCardContentProps {
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  className?: string;
}

interface PreviewCardTriggerProps {
  render: React.ReactElement;
}

const PreviewCardContext = React.createContext<{
  isOpen: boolean;
  openCard: () => void;
  closeCard: () => void;
  cancelClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  isMobile: boolean;
}>({
  isOpen: false,
  openCard: () => {},
  closeCard: () => {},
  cancelClose: () => {},
  triggerRef: { current: null },
  isMobile: false,
});

export function PreviewCard({ children, delay = 0, closeDelay = 300 }: PreviewCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const openTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const closeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const openCard = () => {
    // Cancel any pending close
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = undefined;
    }

    // Open immediately or with delay
    if (delay === 0) {
      setIsOpen(true);
    } else {
      openTimeoutRef.current = setTimeout(() => {
        setIsOpen(true);
      }, delay);
    }
  };

  const closeCard = () => {
    // Cancel any pending open
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = undefined;
    }

    // Close with delay
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, closeDelay);
  };

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = undefined;
    }
  };

  return (
    <PreviewCardContext.Provider
      value={{
        isOpen,
        openCard,
        closeCard,
        cancelClose,
        triggerRef,
        isMobile,
      }}
    >
      {children}
    </PreviewCardContext.Provider>
  );
}

export function PreviewCardTrigger({ render }: PreviewCardTriggerProps) {
  const { openCard, closeCard, triggerRef, isMobile, isOpen } =
    React.useContext(PreviewCardContext);

  const handleMouseEnter = () => {
    if (!isMobile) {
      openCard();
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      closeCard();
    }
  };

  const handleMouseMove = () => {
    // Keep the preview open during mouse movement
    if (!isMobile && isOpen) {
      openCard();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      openCard();
    }
  };

  return React.cloneElement(render, {
    ref: triggerRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseMove: handleMouseMove,
    onClick: handleClick,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
}

export function PreviewCardContent({
  children,
  side = 'bottom',
  sideOffset = 10,
  align = 'center',
  alignOffset = 0,
  className = '',
}: PreviewCardContentProps) {
  const { isOpen, closeCard, cancelClose, triggerRef, isMobile } =
    React.useContext(PreviewCardContext);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current || !contentRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      // Don't skip even if dimensions are temporarily 0 during scroll
      const { innerWidth, innerHeight } = window;

      let top = 0;
      let left = 0;

      // Calculate position based on side
      switch (side) {
        case 'top':
          top = triggerRect.top - contentRect.height - sideOffset;
          break;
        case 'bottom':
          top = triggerRect.bottom + sideOffset;
          break;
        case 'left':
          left = triggerRect.left - contentRect.width - sideOffset;
          break;
        case 'right':
          left = triggerRect.right + sideOffset;
          break;
      }

      // Calculate alignment
      if (side === 'top' || side === 'bottom') {
        switch (align) {
          case 'start':
            left = triggerRect.left + alignOffset;
            break;
          case 'end':
            left = triggerRect.right - contentRect.width - alignOffset;
            break;
          case 'center':
            left = triggerRect.left + (triggerRect.width - contentRect.width) / 2 + alignOffset;
            break;
        }
      } else {
        switch (align) {
          case 'start':
            top = triggerRect.top + alignOffset;
            break;
          case 'end':
            top = triggerRect.bottom - contentRect.height - alignOffset;
            break;
          case 'center':
            top = triggerRect.top + (triggerRect.height - contentRect.height) / 2 + alignOffset;
            break;
        }
      }

      // Ensure the preview card stays within viewport
      const padding = 10;
      top = Math.max(padding, Math.min(top, innerHeight - contentRect.height - padding));
      left = Math.max(padding, Math.min(left, innerWidth - contentRect.width - padding));

      setPosition({ top, left });
    };

    // Initial position update
    updatePosition();

    // Update position with RAF for smooth updates
    let rafId: number;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', handleScroll, true);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, side, sideOffset, align, alignOffset, triggerRef]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      cancelClose();
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      closeCard();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => closeCard()}
              className="fixed inset-0 bg-black/20 z-[9998]"
            />
          )}
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              zIndex: 9999,
            }}
            className={`bg-background border border-border rounded-xl shadow-2xl ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
