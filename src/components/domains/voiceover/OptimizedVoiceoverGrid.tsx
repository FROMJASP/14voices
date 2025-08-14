'use client';

import React, { useState, useMemo, lazy, Suspense } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Filter, Grid3X3, Grid2X2 } from 'lucide-react';
import type { TransformedVoiceover } from '@/types/voiceover';
import './custom-card.css';

// Lazy load heavy components
const AnimatedPlayer = lazy(() => 
  import('./AnimatedPlayer').then(module => ({ default: module.AnimatedPlayer }))
);

const VirtualizedGrid = lazy(() =>
  import('./VirtualizedGrid').then(module => ({ default: module.VirtualizedGrid }))
);

interface OptimizedVoiceoverGridProps {
  voiceovers: TransformedVoiceover[];
  enableVirtualization?: boolean;
  initialPageSize?: number;
}

export function OptimizedVoiceoverGrid({ 
  voiceovers, 
  enableVirtualization = true,
  initialPageSize = 12
}: OptimizedVoiceoverGridProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [gridSize, setGridSize] = useState<'large' | 'small'>('large');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Memoized tag extraction with performance optimization
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (let i = 0; i < voiceovers.length; i++) {
      const tags = voiceovers[i].tags;
      for (let j = 0; j < tags.length; j++) {
        tagSet.add(tags[j]);
      }
    }
    return Array.from(tagSet).sort();
  }, [voiceovers]);

  // Optimized filtering with early return
  const filteredVoiceovers = useMemo(() => {
    if (selectedTags.length === 0) return voiceovers;
    
    return voiceovers.filter(voiceover => {
      for (let i = 0; i < selectedTags.length; i++) {
        if (voiceover.tags.includes(selectedTags[i])) {
          return true;
        }
      }
      return false;
    });
  }, [voiceovers, selectedTags]);

  // Paginated results for initial load performance
  const paginatedVoiceovers = useMemo(() => {
    const startIndex = (currentPage - 1) * initialPageSize;
    return filteredVoiceovers.slice(0, startIndex + initialPageSize);
  }, [filteredVoiceovers, currentPage, initialPageSize]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      setCurrentPage(1); // Reset pagination when filtering
      return newTags;
    });
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const hasMore = paginatedVoiceovers.length < filteredVoiceovers.length;

  return (
    <div className="w-full">
      {/* Optimized filter controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters || selectedTags.length > 0
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border'
            }`}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {selectedTags.length > 0 && (
              <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                {selectedTags.length}
              </span>
            )}
          </button>

          <div className="hidden md:flex items-center gap-1 border border-border rounded-lg p-1">
            <button
              onClick={() => setGridSize('large')}
              className={`p-1.5 rounded transition-colors ${
                gridSize === 'large' ? 'bg-muted' : ''
              }`}
              title="Large grid"
              aria-pressed={gridSize === 'large'}
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridSize('small')}
              className={`p-1.5 rounded transition-colors ${
                gridSize === 'small' ? 'bg-muted' : ''
              }`}
              title="Small grid"
              aria-pressed={gridSize === 'small'}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {filteredVoiceovers.length} stemmen
        </p>
      </div>

      {/* Filter panel with lazy rendering */}
      {showFilters && (
        <div id="filter-panel" className="mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border'
                }`}
                aria-pressed={selectedTags.includes(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-muted-foreground hover:text-foreground"
            >
              Wis alle filters
            </button>
          )}
        </div>
      )}

      {/* Conditional rendering: virtualized or standard grid */}
      {enableVirtualization && filteredVoiceovers.length > 50 ? (
        <Suspense fallback={<GridSkeleton gridSize={gridSize} />}>
          <VirtualizedGrid 
            voiceovers={filteredVoiceovers} 
            gridSize={gridSize}
          />
        </Suspense>
      ) : (
        <>
          <div className={`grid gap-6 ${
            gridSize === 'large' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          }`}>
            {paginatedVoiceovers.map(voiceover => (
              <OptimizedVoiceoverCard
                key={voiceover.id}
                voiceover={voiceover}
                size={gridSize}
              />
            ))}
          </div>

          {/* Load more button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Meer stemmen laden
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {filteredVoiceovers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Geen stemacteurs gevonden met de geselecteerde filters.
          </p>
          <button
            onClick={clearFilters}
            className="text-primary hover:underline"
          >
            Wis filters
          </button>
        </div>
      )}
    </div>
  );
}

// Optimized card component with lazy audio loading
function OptimizedVoiceoverCard({ 
  voiceover, 
  size
}: { 
  voiceover: TransformedVoiceover;
  size: 'large' | 'small';
}) {
  const router = useRouter();
  const [showPlayer, setShowPlayer] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const firstName = voiceover.name.split(' ')[0];
  const hasDemos = voiceover.demos && voiceover.demos.length > 0;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('[role="button"]') ||
      showPlayer
    ) {
      return;
    }
    router.push(`/voiceovers/${voiceover.slug}`);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPlayer(true);
  };

  return (
    <div className="group">
      <div 
        className="block cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="custom-card-wrapper">
          <div className="custom-card">
            {/* Availability indicator */}
            {voiceover.beschikbaar && (
              <div className="custom-card-availability-section">
                <svg className="custom-card-trapezoid" viewBox="0 0 180 30" preserveAspectRatio="none">
                  <path
                    d="M 0,0 L 180,0 L 153,30 L 27,30 Z"
                    fill="var(--background)"
                    stroke="none"
                  />
                  <line x1="0" y1="0" x2="27" y2="30" stroke="var(--border)" strokeWidth="1" />
                  <line x1="180" y1="0" x2="153" y2="30" stroke="var(--border)" strokeWidth="1" />
                  <line x1="27" y1="29.5" x2="153" y2="29.5" stroke="var(--border)" strokeWidth="1.5" />
                </svg>
                <div className="custom-card-availability">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-foreground">
                    {voiceover.availabilityText || 'Nu beschikbaar'}
                  </span>
                </div>
              </div>
            )}
            
            {/* Optimized image container */}
            <div className="relative aspect-[3/4]">
              {voiceover.profilePhoto?.url ? (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-muted animate-pulse" />
                  )}
                  <Image
                    src={voiceover.profilePhoto.url}
                    alt={firstName}
                    fill
                    className={`object-cover transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    sizes={size === 'large' 
                      ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw' 
                      : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw'
                    }
                    priority={false}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                  />
                </>
              ) : (
                <div className="absolute inset-0 bg-muted" />
              )}
            </div>

            {/* Play button */}
            {!showPlayer && hasDemos && (
              <div className="custom-card-play-section group/play">
                <svg className="custom-card-trapezoid" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M 30,0 Q 22,0 20,15 L 15,100 L 85,100 L 80,15 Q 78,0 70,0 Z"
                    fill="var(--background)"
                    stroke="none"
                  />
                  <path
                    d="M 30,0 Q 22,0 20,15 L 15,100 M 70,0 Q 78,0 80,15 L 85,100 M 30,1 L 70,1"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="2"
                  />
                </svg>
                <button
                  onClick={handlePlayClick}
                  className="custom-card-play-button"
                  aria-label={`Play demo for ${firstName}`}
                >
                  <div className="custom-card-play-wrapper">
                    <div className="custom-card-play-icon w-7 h-7 rounded-full border border-border bg-surface flex items-center justify-center transition-all hover:bg-muted">
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none"
                        style={{ marginLeft: '2px' }}
                      >
                        <path 
                          d="M9 6v12l9-6z" 
                          fill="currentColor" 
                          className="text-foreground"
                        />
                      </svg>
                    </div>
                    <span className="custom-card-play-text text-sm font-medium text-foreground">
                      Luisteren
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Lazy load animated player */}
            {showPlayer && hasDemos && (
              <Suspense fallback={<div className="absolute inset-0 bg-black/20 animate-pulse" />}>
                <AnimatedPlayer 
                  voiceover={voiceover}
                  onClose={() => setShowPlayer(false)}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="mt-3 px-1">
        <h3 
          className="font-medium text-foreground text-base mb-1 hover:underline cursor-pointer"
          onClick={() => router.push(`/voiceovers/${voiceover.slug}`)}
        >
          {firstName}
        </h3>
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground">
          {voiceover.tags.slice(0, 3).map((tag, index) => (
            <React.Fragment key={tag}>
              {index > 0 && <span className="w-1 h-1 bg-muted-foreground/40 rounded-full" />}
              <span>{tag}</span>
            </React.Fragment>
          ))}
          {voiceover.tags.length > 3 && (
            <>
              <span className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
              <span>+{voiceover.tags.length - 3}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading skeleton
function GridSkeleton({ gridSize }: { gridSize: 'large' | 'small' }) {
  const itemCount = gridSize === 'large' ? 8 : 12;
  
  return (
    <div className={`grid gap-6 ${
      gridSize === 'large' 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
    }`}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}