'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/Slider';
import { VoiceoverDemo } from '@/types/voiceover';

interface MinimalAudioPlayerProps {
  demos: VoiceoverDemo[];
  artistName: string;
  onDownload?: (audioUrl: string, title: string) => void;
  className?: string;
}

export function MinimalAudioPlayer({
  demos,
  artistName,
  onDownload,
  className = '',
}: MinimalAudioPlayerProps) {
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const currentDemo = demos[currentDemoIndex];

  const whilePlaying = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  }, []);

  // Reset when demo changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [currentDemoIndex]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentDemo) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsExpanded(true);
      animationRef.current = requestAnimationFrame(whilePlaying);
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Auto-advance to next demo
      if (currentDemoIndex < demos.length - 1) {
        setTimeout(() => {
          setCurrentDemoIndex(prev => prev + 1);
        }, 500);
      } else {
        // Collapse when finished
        setTimeout(() => {
          setIsExpanded(false);
        }, 1000);
      }
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [whilePlaying, currentDemo, currentDemoIndex, demos.length]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSliderChange = (values: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const newTime = (values[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const goToPrevious = () => {
    if (currentDemoIndex > 0) {
      setCurrentDemoIndex(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentDemoIndex < demos.length - 1) {
      setCurrentDemoIndex(prev => prev + 1);
    }
  };

  const handleDownload = () => {
    if (onDownload && currentDemo) {
      onDownload(currentDemo.audioFile.url, currentDemo.title);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!demos.length) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <p className="text-sm text-muted-foreground">No demos available</p>
      </div>
    );
  }

  return (
    <div className={`font-sans ${className}`}>
      <audio
        ref={audioRef}
        src={currentDemo.audioFile.url}
        preload="metadata"
        key={currentDemo.id}
      />

      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 'auto'
        }}
        transition={{ 
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="border border-border bg-background"
        style={{
          borderRadius: 0, // No rounded corners
        }}
      >
        {/* Collapsed state - single line */}
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 p-3"
            >
              {/* Play button */}
              <button
                onClick={togglePlayPause}
                disabled={isLoading}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-border hover:bg-muted transition-colors disabled:opacity-50"
                style={{ borderRadius: 0 }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={14} className="text-foreground" />
                ) : (
                  <Play size={14} className="text-foreground ml-0.5" />
                )}
              </button>

              {/* Demo title */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {currentDemo.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {artistName}
                  {demos.length > 1 && (
                    <span className="ml-2">
                      {currentDemoIndex + 1}/{demos.length}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Expanded state - full controls */
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 space-y-4"
            >
              {/* Header with demo info */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">
                    {currentDemo.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {artistName}
                  </div>
                </div>
                {demos.length > 1 && (
                  <div className="text-xs text-muted-foreground font-mono">
                    {currentDemoIndex + 1}/{demos.length}
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <Slider
                  value={[progress]}
                  onValueChange={handleSliderChange}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {/* Previous */}
                  <button
                    onClick={goToPrevious}
                    disabled={currentDemoIndex === 0}
                    className="w-8 h-8 flex items-center justify-center border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ borderRadius: 0 }}
                    aria-label="Previous demo"
                  >
                    <ChevronLeft size={14} className="text-foreground" />
                  </button>

                  {/* Play/Pause */}
                  <button
                    onClick={togglePlayPause}
                    disabled={isLoading}
                    className="w-8 h-8 flex items-center justify-center border border-border hover:bg-muted transition-colors disabled:opacity-50"
                    style={{ borderRadius: 0 }}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause size={14} className="text-foreground" />
                    ) : (
                      <Play size={14} className="text-foreground ml-0.5" />
                    )}
                  </button>

                  {/* Next */}
                  <button
                    onClick={goToNext}
                    disabled={currentDemoIndex === demos.length - 1}
                    className="w-8 h-8 flex items-center justify-center border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ borderRadius: 0 }}
                    aria-label="Next demo"
                  >
                    <ChevronRight size={14} className="text-foreground" />
                  </button>
                </div>

                {/* Download */}
                {onDownload && (
                  <button
                    onClick={handleDownload}
                    className="w-8 h-8 flex items-center justify-center border border-border hover:bg-muted transition-colors"
                    style={{ borderRadius: 0 }}
                    title="Download demo"
                    aria-label="Download current demo"
                  >
                    <Download size={14} className="text-foreground" />
                  </button>
                )}
              </div>

              {/* Collapse on pause */}
              <div className="pt-2">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Collapse
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}