'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DrawerBackdropProps {
  /**
   * Handler for backdrop click
   */
  onClick: () => void;
  /**
   * Custom class names
   */
  className?: string;
}

/**
 * Reusable backdrop component for drawers and modals
 * Provides consistent backdrop styling and animations
 */
export const DrawerBackdrop = React.memo<DrawerBackdropProps>(({
  onClick,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] ${className}`}
      onClick={onClick}
      aria-hidden="true"
    />
  );
});

DrawerBackdrop.displayName = 'DrawerBackdrop';