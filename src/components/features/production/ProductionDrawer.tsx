'use client';

import React from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { DrawerBackdrop } from '@/components/common/widgets/drawer/DrawerBackdrop';
import { DrawerHeader } from '@/components/common/widgets/drawer/DrawerHeader';
import { DrawerContent } from '@/components/common/widgets/drawer/DrawerContent';
import { useDrawerAccessibility } from '@/components/common/widgets/drawer/hooks/useDrawerAccessibility';
import { useDrawerBodyScroll } from '@/components/common/widgets/drawer/hooks/useDrawerBodyScroll';
import { useDrawerHistory } from '@/components/common/widgets/drawer/hooks/useDrawerHistory';

interface ProductionDrawerOptimizedProps {
  /**
   * Whether the drawer is open
   */
  isOpen: boolean;
  /**
   * Handler for closing the drawer
   */
  onClose: () => void;
  /**
   * Slug of the production being displayed
   */
  productionSlug: string | null;
  /**
   * Content to display in the drawer
   */
  children: React.ReactNode;
  /**
   * Custom class names for the drawer container
   */
  className?: string;
}

/**
 * Optimized production drawer component
 * Provides accessible, animated drawer with proper focus management and history handling
 */
export const ProductionDrawerOptimized = React.memo<ProductionDrawerOptimizedProps>(
  ({ isOpen, onClose, productionSlug, children, className = '' }) => {
    // For drag gesture
    const y = useMotionValue(0);
    const opacity = useTransform(y, [0, 300], [1, 0]);

    // Custom hooks for drawer functionality
    const { closeButtonRef } = useDrawerAccessibility({ isOpen, onClose });
    useDrawerBodyScroll({ isOpen });
    useDrawerHistory({ isOpen, productionSlug, onClose });

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // If dragged down more than 100px or with velocity, close
      if (info.offset.y > 100 || info.velocity.y > 500) {
        onClose();
      } else {
        // Snap back to position
        y.set(0);
      }
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <DrawerBackdrop onClick={onClose} />

            {/* Drawer */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="drawer-title"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 400,
                mass: 0.8,
              }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{ y, opacity }}
              className={`fixed inset-x-0 bottom-0 top-20 bg-white dark:bg-background rounded-t-2xl shadow-2xl z-[95] flex flex-col ${className}`}
            >
              <DrawerHeader
                ref={closeButtonRef}
                title={`Production Order: ${productionSlug}`}
                onClose={onClose}
              />

              <DrawerContent>{children}</DrawerContent>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);

ProductionDrawerOptimized.displayName = 'ProductionDrawerOptimized';
