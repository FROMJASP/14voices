'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  Filter,
  Grid3X3,
  Grid2X2,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TransformedVoiceover } from '@/types/voiceover';
import './custom-card.css';

interface MobileFirstVoiceoverGridProps {
  voiceovers: TransformedVoiceover[];
}

export function MobileFirstVoiceoverGrid({ voiceovers }: MobileFirstVoiceoverGridProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [gridSize, setGridSize] = useState<'large' | 'small'>('large');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    voiceovers.forEach((v) => v.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [voiceovers]);

  // Filter voiceovers
  const filteredVoiceovers = useMemo(() => {
    if (selectedTags.length === 0) return voiceovers;
    return voiceovers.filter((v) => selectedTags.some((tag) => v.tags.includes(tag)));
  }, [voiceovers, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => setSelectedTags([]);

  return (
    <div className="w-full">
      {/* Simple inline controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters || selectedTags.length > 0
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {selectedTags.length > 0 && (
              <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                {selectedTags.length}
              </span>
            )}
          </button>

          {/* Grid size toggle - desktop only */}
          <div className="hidden md:flex items-center gap-1 border border-border rounded-lg p-1">
            <button
              onClick={() => setGridSize('large')}
              className={`p-1.5 rounded ${
                gridSize === 'large' ? 'bg-muted' : ''
              } transition-colors`}
              title="Large grid"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridSize('small')}
              className={`p-1.5 rounded ${
                gridSize === 'small' ? 'bg-muted' : ''
              } transition-colors`}
              title="Small grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{filteredVoiceovers.length} stemmen</p>
      </div>

      {/* Filter tags */}
      {showFilters && (
        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <button onClick={clearFilters} className="mt-3 text-sm text-muted-foreground">
              Wis alle filters
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      <div
        className={`grid gap-6 ${
          gridSize === 'large'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
        }`}
      >
        {filteredVoiceovers.map((voiceover) => (
          <VoiceoverCard key={voiceover.id} voiceover={voiceover} size={gridSize} />
        ))}
      </div>

      {/* Empty state */}
      {filteredVoiceovers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Geen stemacteurs gevonden met de geselecteerde filters.
          </p>
          <button onClick={clearFilters} className="text-primary">
            Wis filters
          </button>
        </div>
      )}
    </div>
  );
}

// Mobile-first card component with overlay design
function VoiceoverCard({
  voiceover,
  size,
}: {
  voiceover: TransformedVoiceover;
  size: 'large' | 'small';
}) {
  const router = useRouter();
  const firstName = voiceover.name.split(' ')[0];
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const hasDemos = voiceover.demos && voiceover.demos.length > 0;
  const currentDemo = hasDemos ? voiceover.demos[currentDemoIndex] : null;

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!hasDemos) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else if (currentDemo) {
      // Stop all other audio elements and close other players
      document.querySelectorAll('audio').forEach((audio) => audio.pause());
      // Dispatch custom event to close other players
      window.dispatchEvent(new CustomEvent('voiceover-play', { detail: { id: voiceover.id } }));

      if (!audioRef.current || audioRef.current.src !== currentDemo.audioFile.url) {
        audioRef.current = new Audio(currentDemo.audioFile.url);
        audioRef.current.addEventListener('loadedmetadata', () => {
          setDuration(audioRef.current?.duration || 0);
        });
        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false);
          setProgress(0);
          setCurrentTime(0);
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
          }
        });
      }

      audioRef.current.play();
      setIsPlaying(true);
      setShowPlayer(true);

      // Update progress and time
      progressInterval.current = setInterval(() => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
          const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(currentProgress);
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 100);
    }
  };

  const handleClosePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset to beginning
    }
    setIsPlaying(false);
    setShowPlayer(false);
    setProgress(0);
    setCurrentTime(0);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  // Listen for other voiceovers playing
  useEffect(() => {
    const handleOtherPlay = (event: CustomEvent) => {
      if (event.detail.id !== voiceover.id && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setShowPlayer(false);
        setProgress(0);
        setCurrentTime(0);
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      }
    };

    window.addEventListener('voiceover-play', handleOtherPlay as EventListener);
    return () => {
      window.removeEventListener('voiceover-play', handleOtherPlay as EventListener);
    };
  }, [voiceover.id]);

  const handleDemoChange = (direction: 'prev' | 'next') => {
    const newIndex =
      direction === 'next'
        ? Math.min(currentDemoIndex + 1, voiceover.demos.length - 1)
        : Math.max(currentDemoIndex - 1, 0);

    if (newIndex !== currentDemoIndex) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setCurrentDemoIndex(newIndex);
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newTime = (percentage / 100) * audioRef.current.duration;

    audioRef.current.currentTime = newTime;
    setProgress(percentage);
    setCurrentTime(newTime);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('[role="button"]') ||
      target.closest('.custom-card-play-button') ||
      showPlayer
    ) {
      return;
    }

    // Navigate to voiceover detail page
    router.push(`/voiceovers/${voiceover.slug}`);
  };

  const handleChooseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/voiceovers/${voiceover.slug}`);
  };

  return (
    <div className="group">
      <div className="block cursor-pointer" onClick={handleCardClick}>
        <div className="custom-card-wrapper">
          {/* Main card */}
          <div className="custom-card">
            {/* Availability section inside card with trapezoid shape */}
            {voiceover.beschikbaar && (
              <div className="custom-card-availability-section">
                <svg
                  className="custom-card-trapezoid"
                  viewBox="0 0 180 30"
                  preserveAspectRatio="none"
                >
                  {/* Fill without stroke */}
                  <path
                    d="M 0,0 L 180,0 L 153,30 L 27,30 Z"
                    fill="var(--background)"
                    stroke="none"
                  />
                  {/* Only side and bottom borders */}
                  <line x1="0" y1="0" x2="27" y2="30" stroke="var(--border)" strokeWidth="1" />
                  <line x1="180" y1="0" x2="153" y2="30" stroke="var(--border)" strokeWidth="1" />
                  <line
                    x1="27"
                    y1="29.5"
                    x2="153"
                    y2="29.5"
                    stroke="var(--border)"
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="custom-card-availability">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-foreground">
                    {voiceover.availabilityText || 'Nu beschikbaar'}
                  </span>
                </div>
              </div>
            )}

            {/* Image container */}
            <div className="relative aspect-[3/4]">
              {voiceover.profilePhoto?.url ? (
                <Image
                  src={voiceover.profilePhoto.url}
                  alt={firstName}
                  fill
                  className="object-cover"
                  sizes={
                    size === 'large'
                      ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                      : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  }
                />
              ) : (
                <div className="absolute inset-0 bg-muted" />
              )}
            </div>

            {/* Bottom play button with trapezoid shape - same technique as availability */}
            {!showPlayer && hasDemos && (
              <div className="custom-card-play-section group/play">
                <svg
                  className="custom-card-trapezoid"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {/* Fill with curved corners and less steep sides */}
                  <path
                    d="M 30,0 Q 22,0 20,15 L 15,100 L 85,100 L 80,15 Q 78,0 70,0 Z"
                    fill="var(--background)"
                    stroke="none"
                  />
                  {/* Border with curves */}
                  <path
                    d="M 30,0 Q 22,0 20,15 L 15,100 M 70,0 Q 78,0 80,15 L 85,100 M 30,1 L 70,1"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="2"
                  />
                </svg>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePlayPause();
                  }}
                  className="custom-card-play-button"
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
                        <path d="M9 6v12l9-6z" fill="currentColor" className="text-foreground" />
                      </svg>
                    </div>
                    <span className="custom-card-play-text text-sm font-medium text-foreground">
                      Luisteren
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Full player overlay - shows when playing */}
            <AnimatePresence>
              {showPlayer && hasDemos && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col justify-between p-4"
                  onClick={(e) => e.preventDefault()}
                >
                  {/* Top section with name and close */}
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold text-white">{firstName}</h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleClosePlayer();
                      }}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Profile picture - positioned higher */}
                  <div className="flex justify-center mb-8">
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-white/10">
                      {voiceover.profilePhoto?.url ? (
                        <Image
                          src={voiceover.profilePhoto.url}
                          alt={firstName}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-muted" />
                      )}
                    </div>
                  </div>

                  {/* Center section with player controls */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="w-full"
                  >
                    {/* Boeken button */}
                    <div className="mb-6">
                      <button
                        onClick={handleChooseClick}
                        className="w-full bg-white text-black rounded-xl py-3 font-medium transition-all duration-200 hover:bg-white/90 hover:scale-[1.02] hover:shadow-lg"
                      >
                        Kies {firstName}
                      </button>
                    </div>

                    {/* Player controls */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                      {/* Previous */}
                      {voiceover.demos.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDemoChange('prev');
                          }}
                          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                      )}

                      {/* Play/Pause */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePlayPause();
                        }}
                        className="w-14 h-14 rounded-full bg-white flex items-center justify-center transition-transform"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-black" />
                        ) : (
                          <Play className="w-6 h-6 text-black ml-0.5" />
                        )}
                      </button>

                      {/* Next */}
                      {voiceover.demos.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDemoChange('next');
                          }}
                          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="mb-2 px-4">
                      <div
                        className="relative h-1 bg-white/20 rounded-full cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProgressClick(e);
                        }}
                      >
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-white rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Time and download */}
                    <div className="flex items-center justify-between text-white/80 text-xs px-4">
                      <span>
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const link = document.createElement('a');
                          link.href = currentDemo!.audioFile.url;
                          link.download = `${firstName}_${currentDemo!.title}.mp3`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="p-1.5 rounded-full transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Demo info */}
                    <div className="text-center mt-3">
                      <span className="text-xs text-white/60">
                        {currentDemo?.title}
                        {voiceover.demos.length > 1 && (
                          <span className="ml-2">
                            ({currentDemoIndex + 1}/{voiceover.demos.length})
                          </span>
                        )}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Name and tags below card */}
      <div className="mt-3 px-1">
        <h3
          className="font-medium text-foreground text-base mb-1 hover:underline cursor-pointer"
          onClick={() => router.push(`/voiceovers/${voiceover.slug}`)}
        >
          {firstName}
        </h3>
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground">
          {voiceover.tags.map((tag, index) => (
            <React.Fragment key={tag}>
              {index > 0 && <span className="w-1 h-1 bg-muted-foreground/40 rounded-full" />}
              <span>{tag}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
