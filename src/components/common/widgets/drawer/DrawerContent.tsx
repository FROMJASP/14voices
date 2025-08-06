'use client';

import React from 'react';

interface DrawerContentProps {
  /**
   * Content to display in the drawer
   */
  children?: React.ReactNode;
  /**
   * Fallback content when no children provided
   */
  fallback?: React.ReactNode;
  /**
   * Custom class names for the content container
   */
  className?: string;
}

/**
 * Scrollable content area for drawers
 * Handles proper scrolling behavior and touch scrolling on iOS
 */
export const DrawerContent = React.memo<DrawerContentProps>(
  ({ children, fallback, className = '' }) => {
    const defaultFallback = (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No content to display</p>
      </div>
    );

    return (
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden overscroll-contain min-h-0 -webkit-overflow-scrolling-touch ${className}`}
      >
        <div className="min-h-full">{children || fallback || defaultFallback}</div>
      </div>
    );
  }
);

DrawerContent.displayName = 'DrawerContent';
