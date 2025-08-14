'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { TransformedVoiceover } from '@/types/voiceover';

interface VirtualizedGridProps {
  voiceovers: TransformedVoiceover[];
  gridSize: 'large' | 'small';
  itemHeight?: number;
  containerHeight?: number;
}

interface VirtualItem {
  index: number;
  top: number;
  height: number;
}

export function VirtualizedGrid({ 
  voiceovers, 
  gridSize,
  itemHeight = 400, // Height of each card including margins
  containerHeight = 800 // Visible container height
}: VirtualizedGridProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate columns based on grid size and container width
  const columns = useMemo(() => {
    if (containerWidth < 640) return 1; // Mobile
    if (containerWidth < 1024) return 2; // Tablet
    if (gridSize === 'large') {
      if (containerWidth < 1280) return 3; // Desktop
      return 4; // Large desktop
    } else {
      if (containerWidth < 1280) return 4; // Desktop
      return 5; // Large desktop
    }
  }, [containerWidth, gridSize]);

  // Calculate rows and total height
  const totalRows = Math.ceil(voiceovers.length / columns);
  const totalHeight = totalRows * itemHeight;

  // Calculate visible items
  const visibleItems = useMemo(() => {
    const startRow = Math.floor(scrollTop / itemHeight);
    const endRow = Math.min(
      totalRows,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + 1
    );

    const items: VirtualItem[] = [];
    
    for (let row = startRow; row < endRow; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index >= voiceovers.length) break;
        
        items.push({
          index,
          top: row * itemHeight,
          height: itemHeight,
        });
      }
    }
    
    return items;
  }, [scrollTop, containerHeight, itemHeight, columns, totalRows, voiceovers.length]);

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Handle resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {/* Virtual container with total height */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Rendered items */}
        <div
          className={`grid gap-6 absolute w-full ${
            gridSize === 'large' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          }`}
          style={{
            transform: `translateY(${Math.floor(scrollTop / itemHeight) * itemHeight}px)`,
          }}
        >
          {visibleItems.map((item) => (
            <VirtualizedVoiceoverCard
              key={voiceovers[item.index].id}
              voiceover={voiceovers[item.index]}
              size={gridSize}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Simplified card component for virtualization
function VirtualizedVoiceoverCard({
  voiceover,
}: {
  voiceover: TransformedVoiceover;
  size?: 'large' | 'small';
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const firstName = voiceover.name.split(' ')[0];

  return (
    <div className="group">
      <div className="custom-card-wrapper">
        <div className="custom-card">
          {/* Availability */}
          {voiceover.beschikbaar && (
            <div className="custom-card-availability-section">
              <div className="custom-card-availability">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-foreground">
                  {voiceover.availabilityText || 'Nu beschikbaar'}
                </span>
              </div>
            </div>
          )}
          
          {/* Image with intersection observer for lazy loading */}
          <div className="relative aspect-[3/4]">
            {voiceover.profilePhoto?.url ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-muted animate-pulse" />
                )}
                <img
                  src={voiceover.profilePhoto.url}
                  alt={firstName}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                />
              </>
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}
          </div>

          {/* Simple play indicator */}
          {voiceover.demos && voiceover.demos.length > 0 && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center justify-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6v12l9-6z" fill="currentColor" />
                </svg>
                <span className="text-xs font-medium">Demo beschikbaar</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card info */}
      <div className="mt-3 px-1">
        <h3 className="font-medium text-foreground text-base mb-1">
          {firstName}
        </h3>
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground">
          {voiceover.tags.slice(0, 2).map((tag, index) => (
            <React.Fragment key={tag}>
              {index > 0 && <span className="w-1 h-1 bg-muted-foreground/40 rounded-full" />}
              <span>{tag}</span>
            </React.Fragment>
          ))}
          {voiceover.tags.length > 2 && (
            <>
              <span className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
              <span>+{voiceover.tags.length - 2}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}