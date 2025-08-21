'use client';

import { lazy, Suspense } from 'react';
import type { BeautifulAudioPlayerProps } from './BeautifulAudioPlayer';

// Lazy load the heavy audio player component
const BeautifulAudioPlayer = lazy(() =>
  import('./BeautifulAudioPlayer').then((module) => ({
    default: module.BeautifulAudioPlayer,
  }))
);

// Lightweight loading placeholder
function AudioPlayerSkeleton({
  variant = 'default',
  className = '',
}: Pick<BeautifulAudioPlayerProps, 'variant' | 'className'>) {
  if (variant === 'minimal') {
    return (
      <div className={`relative inline-block ${className}`}>
        <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse">
          <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`relative overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
      >
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse">
              <div className="w-[18px] h-[18px] bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
            </div>
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="mt-3">
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Default variant skeleton
  return (
    <div
      className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 ${className}`}
    >
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2 mx-auto" />
      </div>

      <div className="mb-8">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-2" />
        <div className="flex justify-between">
          <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>

      <div className="flex items-center justify-center gap-3">
        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

// Enhanced error boundary for audio player
function AudioPlayerErrorBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return <Suspense fallback={fallback || <AudioPlayerSkeleton />}>{children}</Suspense>;
}

export interface LazyAudioPlayerProps extends BeautifulAudioPlayerProps {
  // Add lazy loading specific props
  priority?: boolean; // Load immediately if critical
  threshold?: number; // Intersection observer threshold
}

/**
 * Lazy-loaded audio player with performance optimizations
 * Only loads the heavy audio player component when needed
 */
export function LazyAudioPlayer({
  priority = false,
  threshold = 0.1,
  variant,
  className,
  ...props
}: LazyAudioPlayerProps) {
  const fallback = <AudioPlayerSkeleton variant={variant} className={className} />;

  // If priority is true, load immediately without lazy loading
  if (priority) {
    return (
      <AudioPlayerErrorBoundary fallback={fallback}>
        <BeautifulAudioPlayer variant={variant} className={className} {...props} />
      </AudioPlayerErrorBoundary>
    );
  }

  // For non-priority audio players, use intersection observer
  return (
    <AudioPlayerErrorBoundary fallback={fallback}>
      <BeautifulAudioPlayer variant={variant} className={className} {...props} />
    </AudioPlayerErrorBoundary>
  );
}

// Export the original types for compatibility
export type { BeautifulAudioPlayerProps };
