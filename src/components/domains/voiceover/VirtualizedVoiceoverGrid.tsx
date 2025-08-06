'use client';

import React, { useMemo, useCallback, useRef, useEffect, useState, memo } from 'react';
import { VoiceoverCardVirtualized } from './VoiceoverCard';
import type { TransformedVoiceover } from '@/types/voiceover';

interface VirtualizedVoiceoverGridProps {
  voiceovers: (TransformedVoiceover & {
    tags: string[];
    color: string;
    beschikbaar: boolean;
    availabilityText: string;
  })[];
  selectedVoiceover: any;
  onVoiceoverSelect: (voice: any) => void;
  currentlyPlayingId: string | null;
  onPlayingChange: (id: string | null) => void;
  itemHeight?: number;
  overscanCount?: number;
  threshold?: number; // Threshold for enabling virtualization
}

// Hook for intersection observer to track visibility
const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    const target = targetRef.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [callback, options]);

  return targetRef;
};

// Custom hook for virtualized scrolling
const useVirtualization = ({
  items,
  itemHeight = 600,
  containerHeight = 800,
  overscanCount = 3,
}: {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  overscanCount: number;
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const itemsPerRow = 3; // lg:grid-cols-3
    const rowCount = Math.ceil(items.length / itemsPerRow);
    const totalHeight = rowCount * itemHeight;

    const startRow = Math.floor(scrollTop / itemHeight);
    const endRow = Math.min(rowCount - 1, Math.ceil((scrollTop + containerHeight) / itemHeight));

    const startIndex = Math.max(0, (startRow - overscanCount) * itemsPerRow);
    const endIndex = Math.min(items.length - 1, (endRow + overscanCount + 1) * itemsPerRow - 1);

    return {
      startIndex,
      endIndex,
      totalHeight,
      offsetY: Math.max(0, startRow - overscanCount) * itemHeight,
    };
  }, [scrollTop, items.length, itemHeight, containerHeight, overscanCount]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    scrollElementRef,
    visibleRange,
    handleScroll,
  };
};

// Memoized virtualized item component
const VirtualizedItem = memo(
  ({
    voice,
    index,
    selectedVoiceover,
    onVoiceoverSelect,
    currentlyPlayingId,
    onPlayingChange,
    style,
  }: {
    voice: any;
    index: number;
    selectedVoiceover: any;
    onVoiceoverSelect: (voice: any) => void;
    currentlyPlayingId: string | null;
    onPlayingChange: (id: string | null) => void;
    style?: React.CSSProperties;
  }) => {
    const [isVisible, setIsVisible] = useState(false);

    const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        setIsVisible(entry.isIntersecting);
      });
    }, []);

    const targetRef = useIntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '50px',
    });

    return (
      <div
        ref={targetRef}
        style={{
          ...style,
          animation: `fadeInUp 0.6s ease-out forwards`,
          animationDelay: `${index * 100}ms`,
          opacity: 0,
        }}
        className="transition-all duration-500 ease-out"
      >
        {isVisible && (
          <VoiceoverCardVirtualized
            voice={{
              ...voice,
              tags: voice.tags || [],
              beschikbaar: true,
              availabilityText: 'Direct beschikbaar',
              demos:
                voice.demos?.map((demo: any) => ({
                  id: demo.id,
                  title: demo.title,
                  url: demo.audioFile.url,
                  duration: demo.duration || '0:30',
                })) || [],
              profilePhoto: voice.profilePhoto?.url || null,
            }}
            isSelected={selectedVoiceover?.id === voice.id}
            onSelect={() => onVoiceoverSelect(voice)}
            currentlyPlayingId={currentlyPlayingId}
            onPlayingChange={onPlayingChange}
          />
        )}
      </div>
    );
  }
);

VirtualizedItem.displayName = 'VirtualizedItem';

// Non-virtualized grid for smaller lists
const SimpleGrid = memo(
  ({
    voiceovers,
    selectedVoiceover,
    onVoiceoverSelect,
    currentlyPlayingId,
    onPlayingChange,
  }: {
    voiceovers: any[];
    selectedVoiceover: any;
    onVoiceoverSelect: (voice: any) => void;
    currentlyPlayingId: string | null;
    onPlayingChange: (id: string | null) => void;
  }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      {voiceovers.map((voice, index) => (
        <VirtualizedItem
          key={voice.id}
          voice={voice}
          index={index}
          selectedVoiceover={selectedVoiceover}
          onVoiceoverSelect={onVoiceoverSelect}
          currentlyPlayingId={currentlyPlayingId}
          onPlayingChange={onPlayingChange}
        />
      ))}
    </div>
  )
);

SimpleGrid.displayName = 'SimpleGrid';

// Virtualized grid for large lists
const VirtualizedGrid = memo(
  ({
    voiceovers,
    selectedVoiceover,
    onVoiceoverSelect,
    currentlyPlayingId,
    onPlayingChange,
    itemHeight = 600,
    overscanCount = 3,
  }: {
    voiceovers: any[];
    selectedVoiceover: any;
    onVoiceoverSelect: (voice: any) => void;
    currentlyPlayingId: string | null;
    onPlayingChange: (id: string | null) => void;
    itemHeight?: number;
    overscanCount?: number;
  }) => {
    const [containerHeight, setContainerHeight] = useState(800);

    const { scrollElementRef, visibleRange, handleScroll } = useVirtualization({
      items: voiceovers,
      itemHeight,
      containerHeight,
      overscanCount,
    });

    // Update container height on window resize
    useEffect(() => {
      const updateContainerHeight = () => {
        if (scrollElementRef.current) {
          setContainerHeight(window.innerHeight - scrollElementRef.current.offsetTop);
        }
      };

      updateContainerHeight();
      window.addEventListener('resize', updateContainerHeight);
      return () => window.removeEventListener('resize', updateContainerHeight);
    }, [scrollElementRef]);

    // Calculate visible items
    const visibleItems = useMemo(() => {
      return voiceovers.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
    }, [voiceovers, visibleRange.startIndex, visibleRange.endIndex]);

    return (
      <div
        ref={scrollElementRef}
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: visibleRange.totalHeight, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${visibleRange.offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 px-4 sm:px-6 lg:px-8">
              {visibleItems.map((voice, index) => {
                const actualIndex = visibleRange.startIndex + index;
                return (
                  <VirtualizedItem
                    key={voice.id}
                    voice={voice}
                    index={actualIndex}
                    selectedVoiceover={selectedVoiceover}
                    onVoiceoverSelect={onVoiceoverSelect}
                    currentlyPlayingId={currentlyPlayingId}
                    onPlayingChange={onPlayingChange}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VirtualizedGrid.displayName = 'VirtualizedGrid';

export const VirtualizedVoiceoverGrid = memo(function VirtualizedVoiceoverGrid({
  voiceovers,
  selectedVoiceover,
  onVoiceoverSelect,
  currentlyPlayingId,
  onPlayingChange,
  itemHeight = 600,
  overscanCount = 3,
  threshold = 50, // Enable virtualization for lists with 50+ items
}: VirtualizedVoiceoverGridProps) {
  // Decide whether to use virtualization based on list size
  const shouldVirtualize = voiceovers.length >= threshold;

  if (shouldVirtualize) {
    return (
      <VirtualizedGrid
        voiceovers={voiceovers}
        selectedVoiceover={selectedVoiceover}
        onVoiceoverSelect={onVoiceoverSelect}
        currentlyPlayingId={currentlyPlayingId}
        onPlayingChange={onPlayingChange}
        itemHeight={itemHeight}
        overscanCount={overscanCount}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SimpleGrid
        voiceovers={voiceovers}
        selectedVoiceover={selectedVoiceover}
        onVoiceoverSelect={onVoiceoverSelect}
        currentlyPlayingId={currentlyPlayingId}
        onPlayingChange={onPlayingChange}
      />
    </div>
  );
});

VirtualizedVoiceoverGrid.displayName = 'VirtualizedVoiceoverGrid';
