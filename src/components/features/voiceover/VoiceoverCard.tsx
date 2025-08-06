// Modern Voiceover Card Component - Theme-based design with expandable demos
'use client';

import React, { useState, useRef, memo, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Download, Calendar, CheckCircle2 } from 'lucide-react';
import { Bricolage_Grotesque } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import './VoiceoverCard.css';

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

interface Demo {
  id: string;
  title: string;
  audioFile: { url: string };
  duration: string;
}

interface VoiceoverCardProps {
  voice: {
    id: string;
    name: string;
    slug: string;
    profilePhoto?: string | null;
    tags: string[];
    beschikbaar: boolean;
    availabilityText?: string;
    demos: Demo[];
  };
  isSelected: boolean;
  onSelect: () => void;
  currentlyPlayingId?: string | null;
  onPlayingChange?: (voiceId: string | null) => void;
  variant?: 'default' | 'optimized' | 'virtualized';
  disableAnimations?: boolean;
  lazyLoadImage?: boolean;
}

// Helper function to get first name only
function getFirstName(fullName: string): string {
  return fullName.split(' ')[0];
}

// Base component implementation
function VoiceoverCardBase({
  voice,
  isSelected,
  onSelect,
  currentlyPlayingId,
  onPlayingChange,
  variant = 'default',
  disableAnimations = false,
  lazyLoadImage = false,
}: VoiceoverCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [showDemos, setShowDemos] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const isPlaying = currentlyPlayingId === voice.id || localIsPlaying;

  // Get first name only
  const firstName = useMemo(() => getFirstName(voice.name), [voice.name]);

  // Update progress
  const updateProgress = useCallback(() => {
    if (audioRef.current && isPlaying) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  }, [isPlaying]);

  // Play/pause functionality
  const togglePlay = useCallback(
    (demoIndex?: number) => {
      if (!voice.demos.length) return;

      const targetIndex = demoIndex !== undefined ? demoIndex : currentDemoIndex;

      if (isPlaying && currentDemoIndex === targetIndex) {
        // Pause current
        audioRef.current?.pause();
        if (onPlayingChange) {
          onPlayingChange(null);
        } else {
          setLocalIsPlaying(false);
        }
      } else {
        // Stop any other playing audio
        const allAudios = document.querySelectorAll('audio');
        allAudios.forEach((audio) => audio.pause());

        // Switch demo if different
        if (targetIndex !== currentDemoIndex) {
          setCurrentDemoIndex(targetIndex);
        }

        // Create new audio element for the selected demo
        if (audioRef.current) {
          audioRef.current.pause();
        }

        audioRef.current = new Audio(voice.demos[targetIndex].audioFile.url);
        audioRef.current.addEventListener('loadedmetadata', () => {
          setDuration(audioRef.current?.duration || 0);
        });
        audioRef.current.addEventListener('ended', () => {
          if (onPlayingChange) {
            onPlayingChange(null);
          } else {
            setLocalIsPlaying(false);
          }
          setProgress(0);
        });

        audioRef.current.play();
        if (onPlayingChange) {
          onPlayingChange(voice.id);
        } else {
          setLocalIsPlaying(true);
        }
        setShowDemos(true); // Show demos when playing
      }
    },
    [isPlaying, currentDemoIndex, voice.demos, voice.id, onPlayingChange]
  );

  // Toggle demo panel
  const toggleDemoPanel = useCallback(() => {
    if (!showDemos && voice.demos.length > 0) {
      setShowDemos(true);
      // Start playing immediately when opening the panel
      togglePlay();
    } else {
      setShowDemos(false);
      if (isPlaying) {
        audioRef.current?.pause();
        if (onPlayingChange) {
          onPlayingChange(null);
        } else {
          setLocalIsPlaying(false);
        }
      }
    }
  }, [showDemos, voice.demos.length, isPlaying, onPlayingChange, togglePlay]);

  // Handle demo selection
  const selectDemo = useCallback(
    (index: number) => {
      if (index !== currentDemoIndex) {
        togglePlay(index);
      }
    },
    [currentDemoIndex, togglePlay]
  );

  // Handle download
  const handleDownload = useCallback(
    (demo: Demo, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const link = document.createElement('a');
      link.href = demo.audioFile.url;
      link.download = `${firstName}_${demo.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [firstName]
  );

  // Handle progress click
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newTime = (percentage / 100) * audioRef.current.duration;

    audioRef.current.currentTime = newTime;
    setProgress(percentage);
  }, []);

  // Format time
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Update progress animation
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, updateProgress]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle external playing changes
  useEffect(() => {
    if (currentlyPlayingId && currentlyPlayingId !== voice.id && audioRef.current) {
      audioRef.current.pause();
      setLocalIsPlaying(false);
      setShowDemos(false);
      setProgress(0);
    }
  }, [currentlyPlayingId, voice.id]);

  const MotionComponent = disableAnimations || variant === 'virtualized' ? 'div' : motion.div;

  return (
    <MotionComponent
      className={`voiceover-card group relative bg-card rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${bricolageGrotesque.variable}`}
      {...(MotionComponent === motion.div && !disableAnimations
        ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            whileHover: { y: -2 },
            transition: { duration: 0.3 },
          }
        : {})}
    >
      {/* Aspect ratio container for portrait layout */}
      <div className="relative aspect-[3/4] h-full flex flex-col">
        {/* Background Image - absolute positioned */}
        <div className="absolute inset-0">
          {voice.profilePhoto ? (
            <Image
              src={voice.profilePhoto}
              alt={firstName}
              fill
              className={`object-cover object-center transition-all duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={!lazyLoadImage}
              loading={lazyLoadImage ? 'lazy' : undefined}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="text-6xl font-bold text-muted-foreground/30">
                {firstName.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        {/* Content - flex container */}
        <div className="relative z-10 flex flex-col flex-1">
          {/* Main content area */}
          <div className="flex-1 flex flex-col justify-between p-5">
            {/* Top section */}
            <div className="flex justify-between items-start">
              {/* Status badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm text-xs font-medium ${
                  voice.beschikbaar
                    ? 'bg-primary/20 border border-primary/30 text-white'
                    : 'bg-accent/60 border border-accent text-white'
                }`}
              >
                {voice.beschikbaar ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Beschikbaar</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{voice.availabilityText || 'Niet beschikbaar'}</span>
                  </>
                )}
              </div>
            </div>

            {/* Bottom section */}
            <div className="space-y-4">
              {/* Name */}
              <h3 className="text-5xl md:text-6xl font-black text-white font-bricolage">
                {firstName}
              </h3>

              {/* Tags - all with equal styling */}
              <div className="flex flex-wrap gap-2">
                {voice.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                {/* Play/Pause button - only show when demo panel is closed */}
                {voice.demos.length > 0 && !showDemos && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDemoPanel();
                    }}
                    className="p-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 shadow-md focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                    aria-label="Play demo"
                  >
                    <Play className="w-5 h-5 translate-x-0.5" />
                  </button>
                )}

                {/* Boeken button */}
                <Link
                  href={`/voiceovers/${voice.slug}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                  }}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-center shadow-md hover:shadow-lg"
                >
                  Boeken
                </Link>
              </div>
            </div>
          </div>

          {/* Expandable demo section - part of the flex layout */}
          <AnimatePresence>
            {showDemos && voice.demos.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="bg-black/90 backdrop-blur-lg p-4 border-t border-white/10">
                  {/* Current demo info with controls */}
                  <div className="flex items-center gap-3 mb-3">
                    {/* Play/Pause button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                      }}
                      className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isPlaying ? 'pause' : 'play'}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 translate-x-0.5" />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </button>

                    {/* Demo info and progress */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white">
                          {voice.demos[currentDemoIndex]?.title}
                        </p>
                        <button
                          onClick={(e) => handleDownload(voice.demos[currentDemoIndex], e)}
                          className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                          aria-label={`Download ${voice.demos[currentDemoIndex]?.title}`}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div
                          ref={progressRef}
                          className="relative h-1.5 bg-white/20 rounded-full cursor-pointer"
                          onClick={handleProgressClick}
                        >
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-primary rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-white/60">
                          <span>{formatTime((progress / 100) * duration)}</span>
                          <span>
                            {voice.demos[currentDemoIndex]?.duration || formatTime(duration)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Demo selection */}
                  {voice.demos.length > 1 && (
                    <div className="flex gap-2">
                      {voice.demos.map((demo, index) => (
                        <button
                          key={demo.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectDemo(index);
                          }}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                            currentDemoIndex === index
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {demo.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionComponent>
  );
}

// Export variations
export const VoiceoverCard = VoiceoverCardBase;

export const VoiceoverCardMemoized = memo(VoiceoverCardBase, (prevProps, nextProps) => {
  return (
    prevProps.voice.id === nextProps.voice.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.currentlyPlayingId === nextProps.currentlyPlayingId &&
    prevProps.variant === nextProps.variant
  );
});

export const VoiceoverCardOptimized = memo(function VoiceoverCardOptimized(
  props: VoiceoverCardProps
) {
  return (
    <VoiceoverCardBase
      {...props}
      variant="optimized"
      disableAnimations={false}
      lazyLoadImage={true}
    />
  );
});

export const VoiceoverCardVirtualized = memo(function VoiceoverCardVirtualized(
  props: VoiceoverCardProps
) {
  return (
    <VoiceoverCardBase
      {...props}
      variant="virtualized"
      disableAnimations={true}
      lazyLoadImage={true}
    />
  );
});

// Default export for backward compatibility
export default VoiceoverCard;
