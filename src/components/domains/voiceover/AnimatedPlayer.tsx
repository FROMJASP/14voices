'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play, Pause, ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TransformedVoiceover } from '@/types/voiceover';
import { useAudioStore } from '@/store/audioStore';

interface AnimatedPlayerProps {
  voiceover: TransformedVoiceover;
  onClose: () => void;
  autoPlay?: boolean;
}

export function AnimatedPlayer({ voiceover, onClose, autoPlay = true }: AnimatedPlayerProps) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const { registerAudio, unregisterAudio, pauseOthers, setCurrentlyPlaying } = useAudioStore();

  const firstName = voiceover.name.split(' ')[0];
  const currentDemo = voiceover.demos[currentDemoIndex];
  const playerId = `${voiceover.id}-${currentDemoIndex}`;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        unregisterAudio(playerId);
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      setCurrentlyPlaying(null);
    };
  }, [playerId, unregisterAudio, setCurrentlyPlaying]);

  // Create and load audio on mount
  useEffect(() => {
    if (!currentDemo || !currentDemo.audioFile?.url) {
      return;
    }

    // Create audio element immediately
    const audio = new Audio();
    audio.preload = 'auto'; // Change to 'auto' for better loading

    // Set up event listeners
    const handleCanPlay = () => {
      if (autoPlay && !hasAutoPlayed) {
        setHasAutoPlayed(true);
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            setCurrentlyPlaying(playerId);

            // Start progress tracking
            progressInterval.current = setInterval(() => {
              if (!isNaN(audio.duration)) {
                const currentProgress = (audio.currentTime / audio.duration) * 100;
                setProgress(currentProgress);
                setCurrentTime(audio.currentTime);
              }
            }, 100);
          })
          .catch((error) => {
            console.error('Failed to play audio:', error);
            setIsLoading(false);
          });
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setCurrentlyPlaying(null);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };

    const handleError = (e: Event) => {
      console.error('Audio load error:', e);
      setIsLoading(false);
      setCurrentlyPlaying(null);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Set source and register
    audio.src = currentDemo.audioFile.url;
    audioRef.current = audio;
    registerAudio(playerId, audio);
    pauseOthers(playerId);

    // Load the audio
    audio.load();

    // Cleanup
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, currentDemo, playerId]);

  const handlePlayPause = async () => {
    if (!currentDemo || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentlyPlaying(null);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      try {
        setIsLoading(true);

        // Pause all other audio using the store
        pauseOthers(playerId);
        setCurrentlyPlaying(playerId);

        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);

        // Update progress
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
        progressInterval.current = setInterval(() => {
          if (audioRef.current && !isNaN(audioRef.current.duration)) {
            const currentProgress =
              (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(currentProgress);
            setCurrentTime(audioRef.current.currentTime);
          }
        }, 100);
      } catch (error) {
        console.error('Audio play error:', error);
        setIsLoading(false);
        setCurrentlyPlaying(null);
      }
    }
  };

  const handleDemoChange = (direction: 'prev' | 'next') => {
    const newIndex =
      direction === 'next'
        ? Math.min(currentDemoIndex + 1, voiceover.demos.length - 1)
        : Math.max(currentDemoIndex - 1, 0);

    if (newIndex !== currentDemoIndex) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        unregisterAudio(playerId);
      }

      // Reset state
      setCurrentDemoIndex(newIndex);
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      setCurrentlyPlaying(null);
      setHasAutoPlayed(false); // This will trigger a re-render and new audio creation

      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
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

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    if (!currentDemo) return;

    try {
      const response = await fetch(currentDemo.audioFile.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${firstName}_${currentDemo.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleChooseClick = () => {
    router.push(`/voiceovers/${voiceover.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-background/60 dark:bg-black/60 backdrop-blur-sm flex flex-col justify-between p-2 sm:p-3 lg:p-4 rounded-[1rem]"
      onClick={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-foreground">
          {firstName}
        </h3>
        <button
          onClick={onClose}
          className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-foreground/10 flex items-center justify-center transition-colors hover:bg-foreground/20"
          aria-label="Close player"
        >
          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-foreground" />
        </button>
      </div>

      {/* Profile picture */}
      <div className="flex justify-center mb-3 sm:mb-5 lg:mb-8">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl overflow-hidden bg-foreground/10">
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

      {/* Player controls */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full"
      >
        {/* Choose button */}
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <button
            onClick={handleChooseClick}
            className="w-full bg-foreground text-background rounded-lg sm:rounded-xl py-1.5 sm:py-2 lg:py-3 text-xs sm:text-sm lg:text-base font-medium transition-all duration-200 hover:bg-foreground/90 hover:scale-[1.02] hover:shadow-lg"
          >
            Kies {firstName}
          </button>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 lg:mb-4">
          {/* Previous */}
          {voiceover.demos.length > 1 && (
            <button
              onClick={() => handleDemoChange('prev')}
              disabled={currentDemoIndex === 0}
              className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-foreground/10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground/20"
              aria-label="Previous demo"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-foreground" />
            </button>
          )}

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            disabled={isLoading}
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-full bg-foreground flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-background" />
            ) : (
              <Play className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-background ml-0.5" />
            )}
          </button>

          {/* Next */}
          {voiceover.demos.length > 1 && (
            <button
              onClick={() => handleDemoChange('next')}
              disabled={currentDemoIndex === voiceover.demos.length - 1}
              className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-foreground/10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground/20"
              aria-label="Next demo"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-foreground" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-1 sm:mb-1.5 lg:mb-2 px-2 sm:px-3 lg:px-4">
          <div
            className="relative h-1 bg-foreground/20 rounded-full cursor-pointer"
            onClick={handleProgressClick}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className="absolute inset-y-0 left-0 bg-foreground rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Time and download */}
        <div className="flex items-center justify-between text-foreground/80 text-[10px] sm:text-xs px-2 sm:px-3 lg:px-4">
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-full transition-colors hover:bg-foreground/10"
            aria-label="Download audio"
          >
            <Download className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />
          </button>
        </div>

        {/* Demo info */}
        <div className="text-center mt-1 sm:mt-2 lg:mt-3">
          <span className="text-[10px] sm:text-xs text-foreground/60">
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
  );
}
