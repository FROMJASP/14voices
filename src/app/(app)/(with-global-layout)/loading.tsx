import { LoadingSpinner } from '@/components/common/ui';
import { Mic } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Header skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 lg:pt-20">
        {/* Process steps skeleton */}
        <div className="flex items-center justify-center gap-4 mb-4 sm:mb-8">
          <div className="animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
          <div className="animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
          <div className="animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        {/* Title skeleton */}
        <div className="text-center mb-8 animate-pulse">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4 max-w-md mx-auto"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded max-w-lg mx-auto"></div>
        </div>

        {/* Subtitle skeleton */}
        <div className="animate-pulse mb-10">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded max-w-2xl mx-auto mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded max-w-xl mx-auto"></div>
        </div>

        {/* Stats skeleton */}
        <div className="flex items-center justify-center gap-6 mb-8 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="sticky top-0 z-40 bg-[#fcf9f5] dark:bg-[#1a1a1a] border-b border-border">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 animate-pulse">
            <div className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-full w-24 h-10"></div>
            <div className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-full w-20 h-10"></div>
            <div className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-full w-28 h-10"></div>
            <div className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-full w-22 h-10"></div>
          </div>
        </div>
      </div>

      {/* Loading content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Mic className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50 animate-pulse" />
          <h3 className="text-xl font-semibold text-foreground mb-4">Stemmen laden...</h3>
          <p className="text-muted-foreground mb-8">
            We laden de beschikbare voice-over stemmen voor je.
          </p>
          <LoadingSpinner size="large" text="" />
        </div>
      </div>
    </div>
  );
}
