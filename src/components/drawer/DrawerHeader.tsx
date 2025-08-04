'use client';

import React, { forwardRef } from 'react';
import { X } from 'lucide-react';

interface DrawerHeaderProps {
  /**
   * Title for screen readers
   */
  title: string;
  /**
   * Handler for close button click
   */
  onClose: () => void;
  /**
   * Whether to show the drag handle
   */
  showDragHandle?: boolean;
  /**
   * Custom class names
   */
  className?: string;
}

/**
 * Reusable drawer header component with close button and drag handle
 */
export const DrawerHeader = React.memo(forwardRef<HTMLButtonElement, DrawerHeaderProps>(({
  title,
  onClose,
  showDragHandle = true,
  className = '',
}, ref) => {
  return (
    <>
      {/* Drag handle indicator */}
      {showDragHandle && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full cursor-grab active:cursor-grabbing z-10" />
      )}
      
      {/* Header with close button */}
      <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 ${className}`}>
        <h2 id="drawer-title" className="sr-only">
          {title}
        </h2>
        
        {/* Close button */}
        <button
          ref={ref}
          onClick={onClose}
          className="ml-auto p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}));

DrawerHeader.displayName = 'DrawerHeader';