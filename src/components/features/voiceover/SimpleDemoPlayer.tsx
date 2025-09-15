'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Download, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceoverDemo } from '@/types/voiceover';

interface SimpleDemoPlayerProps {
  demos: VoiceoverDemo[];
  artistName: string;
  onDownload?: (audioUrl: string, title: string) => void;
  className?: string;
}

export function SimpleDemoPlayer({
  demos,
  artistName,
  onDownload,
  className = '',
}: SimpleDemoPlayerProps) {
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const currentDemo = demos[currentDemoIndex];

  // Cleanup on unmount
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Reset when demo changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setProgress(0);

    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  }, [currentDemoIndex]);

  const handlePlayPause = () => {
    if (!currentDemo) return;

    // Expand the player when playing
    if (!isExpanded && !isPlaying) {
      setIsExpanded(true);
    }

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      // Stop all other audio elements
      document.querySelectorAll('audio').forEach((audio) => audio.pause());

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

          // Auto-play next if available
          if (currentDemoIndex < demos.length - 1) {
            setTimeout(() => {
              setCurrentDemoIndex((prev) => prev + 1);
            }, 500);
          }
        });
      }

      audioRef.current.play();
      setIsPlaying(true);

      // Update progress
      progressInterval.current = setInterval(() => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
          const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(currentProgress);
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 100);
    }
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

  const goToPrevious = () => {
    if (currentDemoIndex > 0) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setCurrentDemoIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentDemoIndex < demos.length - 1) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setCurrentDemoIndex((prev) => prev + 1);
    }
  };

  const handleDownload = () => {
    if (onDownload && currentDemo) {
      onDownload(currentDemo.audioFile.url, currentDemo.title);
    }
  };

  const selectDemo = (index: number) => {
    if (index !== currentDemoIndex) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setCurrentDemoIndex(index);
      setShowDropdown(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!demos.length) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        <p className="text-sm">Geen demo&apos;s beschikbaar</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-2xl border border-border overflow-hidden ${className}`}
    >
      <motion.div
        animate={{
          height: isExpanded ? 'auto' : 'auto',
          padding: isExpanded ? '24px' : '16px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Collapsed State */}
        {!isExpanded && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              {/* Play Button */}
              <button
                onClick={handlePlayPause}
                className="w-12 h-12 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:scale-105 flex-shrink-0"
              >
                <Play className="w-5 h-5 ml-0.5" />
              </button>

              {/* Demo Info */}
              <div className="min-w-0">
                <h3 className="font-medium text-foreground truncate">{currentDemo.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {artistName} • {demos.length} demo{demos.length > 1 ? "'s" : ''}
                </p>
              </div>
            </div>

            {/* Expand hint */}
            <p className="text-xs text-muted-foreground hidden sm:block">Klik om af te spelen</p>
          </div>
        )}

        {/* Expanded State */}
        {isExpanded && (
          <>
            {/* Demo Title */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <AnimatePresence mode="wait">
                      <motion.h3
                        key={currentDemo.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="text-lg font-semibold text-foreground"
                      >
                        {currentDemo.title}
                      </motion.h3>
                    </AnimatePresence>

                    {/* Dropdown for demo selection */}
                    {demos.length > 1 && (
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={() => setShowDropdown(!showDropdown)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <span>
                            {currentDemoIndex + 1} / {demos.length}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                          />
                        </button>

                        <AnimatePresence>
                          {showDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50"
                            >
                              {demos.map((demo, index) => (
                                <button
                                  key={demo.id}
                                  onClick={() => selectDemo(index)}
                                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                                    index === currentDemoIndex ? 'bg-muted/30' : ''
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-sm">{demo.title}</span>
                                    {index === currentDemoIndex && isPlaying && (
                                      <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="flex items-center gap-1"
                                      >
                                        <div className="w-1 h-3 bg-primary rounded-full" />
                                        <div className="w-1 h-4 bg-primary rounded-full" />
                                        <div className="w-1 h-2 bg-primary rounded-full" />
                                      </motion.div>
                                    )}
                                  </div>
                                  {demo.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {demo.description}
                                    </p>
                                  )}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{artistName}</p>
                </div>

                {/* Collapse button */}
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    if (audioRef.current) {
                      audioRef.current.pause();
                    }
                    setIsPlaying(false);
                    if (progressInterval.current) {
                      clearInterval(progressInterval.current);
                    }
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Sluiten"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Player Controls */}
            <div className="space-y-4">
              {/* Progress Bar */}
              <div
                className="relative h-2 bg-muted rounded-full cursor-pointer group"
                onClick={handleProgressClick}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${progress}% - 8px)` }}
                />
              </div>

              {/* Time Display */}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-4">
                {/* Previous - only show if multiple demos */}
                {demos.length > 1 && (
                  <button
                    onClick={goToPrevious}
                    disabled={currentDemoIndex === 0}
                    className={`p-2 rounded-full transition-all ${
                      currentDemoIndex === 0
                        ? 'text-muted-foreground/50 cursor-not-allowed'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    title="Vorige demo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                {/* Play/Pause */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayPause}
                  className="w-14 h-14 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isPlaying ? 'pause' : 'play'}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-0.5" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>

                {/* Next - only show if multiple demos */}
                {demos.length > 1 && (
                  <button
                    onClick={goToNext}
                    disabled={currentDemoIndex === demos.length - 1}
                    className={`p-2 rounded-full transition-all ${
                      currentDemoIndex === demos.length - 1
                        ? 'text-muted-foreground/50 cursor-not-allowed'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    title="Volgende demo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}

                {/* Download */}
                {onDownload && (
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all ml-4"
                    title="Download demo"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Demo Description */}
            {currentDemo.description && (
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentDemo.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border"
                >
                  {currentDemo.description}
                </motion.p>
              </AnimatePresence>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
