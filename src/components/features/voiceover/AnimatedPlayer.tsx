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
  gridSize?: 'large' | 'small';
}

export function AnimatedPlayer({
  voiceover,
  onClose,
  autoPlay = true,
  gridSize = 'large',
}: AnimatedPlayerProps) {
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
      className={`absolute inset-0 bg-background/60 dark:bg-black/60 backdrop-blur-sm flex flex-col rounded-[1rem] overflow-hidden ${
        gridSize === 'small' ? 'p-2.5' : 'p-4 sm:p-2.5 md:p-3 lg:p-4'
      }`}
      onClick={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div
        className={`flex items-start justify-between ${
          gridSize === 'small' ? 'mb-2' : 'mb-2 sm:mb-3'
        }`}
      >
        <h3
          className={`font-semibold text-foreground ${
            gridSize === 'small'
              ? 'text-sm mt-5 lg:text-base'
              : 'text-lg mt-8 sm:text-base sm:mt-6 [@media(min-width:768px)_and_(max-width:1023px)]:text-xl [@media(min-width:768px)_and_(max-width:1023px)]:mt-7 lg:text-lg lg:mt-6'
          }`}
        >
          {firstName}
        </h3>
        <button
          onClick={onClose}
          className={`rounded-full bg-foreground/10 flex items-center justify-center transition-colors hover:bg-foreground/20 ${
            gridSize === 'small' ? 'w-6 h-6' : 'w-8 h-8 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8'
          }`}
          aria-label="Close player"
        >
          <X
            className={`text-foreground ${
              gridSize === 'small'
                ? 'w-3 h-3'
                : 'w-4 h-4 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4'
            }`}
          />
        </button>
      </div>

      {/* Profile picture - clickable to navigate to voiceover page */}
      <div
        className={`flex-1 flex items-center justify-center min-h-0 ${
          gridSize === 'small'
            ? '-mt-3 sm:-mt-4 md:-mt-5 lg:-mt-6 xl:-mt-8' // Small grid: move up more for better centering
            : '-mt-2 [@media(max-width:639px)]:-mt-0 sm:-mt-1 [@media(min-width:768px)_and_(max-width:1023px)]:-mt-2 lg:-mt-5 xl:-mt-4' // Large grid: adjusted for bigger image at xl
        }`}
      >
        <button
          onClick={handleChooseClick}
          className={`relative overflow-hidden bg-foreground/10 cursor-pointer transition-transform hover:scale-105 ${
            gridSize === 'small'
              ? 'w-14 h-14 rounded-lg sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24' // Small grid: starts smaller, scales up with viewport
              : 'w-40 h-40 rounded-2xl sm:w-24 sm:h-24 sm:rounded-xl md:w-32 md:h-32 md:rounded-2xl lg:w-28 lg:h-28 lg:rounded-2xl xl:w-36 xl:h-36 xl:rounded-2xl' // Large grid: progressively bigger, largest for 4-card layout
          }`}
          aria-label={`View ${firstName}'s profile`}
        >
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
        </button>
      </div>

      {/* Player controls */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full flex-shrink-0"
      >
        {/* Playback controls */}
        <div
          className={`flex items-center justify-center ${
            gridSize === 'small'
              ? 'gap-2 mb-2'
              : 'gap-4 sm:gap-2 md:gap-3 lg:gap-3.5 mb-4 sm:mb-2 md:mb-3 lg:mb-3.5'
          }`}
        >
          {/* Previous */}
          {voiceover.demos.length > 1 && (
            <button
              onClick={() => handleDemoChange('prev')}
              disabled={currentDemoIndex === 0}
              className={`rounded-full bg-foreground/10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground/20 ${
                gridSize === 'small'
                  ? 'w-6 h-6 lg:w-7 lg:h-7'
                  : 'w-10 h-10 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-9 lg:h-9'
              }`}
              aria-label="Previous demo"
            >
              <ChevronLeft
                className={`text-foreground ${
                  gridSize === 'small'
                    ? 'w-3 h-3'
                    : 'w-5 h-5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]'
                }`}
              />
            </button>
          )}

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            disabled={isLoading}
            className={`rounded-full bg-foreground flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50 ${
              gridSize === 'small'
                ? 'w-8 h-8 lg:w-10 lg:h-10'
                : 'w-14 h-14 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12'
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <div
                className={`border-2 border-background border-t-transparent rounded-full animate-spin ${
                  gridSize === 'small'
                    ? 'w-3 h-3'
                    : 'w-6 h-6 sm:w-3.5 sm:h-3.5 md:w-[18px] md:h-[18px] lg:w-5 lg:h-5'
                }`}
              />
            ) : isPlaying ? (
              <Pause
                className={`text-background ${
                  gridSize === 'small'
                    ? 'w-3 h-3'
                    : 'w-6 h-6 sm:w-3.5 sm:h-3.5 md:w-[18px] md:h-[18px] lg:w-5 lg:h-5'
                }`}
              />
            ) : (
              <Play
                className={`text-background ml-0.5 ${
                  gridSize === 'small'
                    ? 'w-3 h-3'
                    : 'w-6 h-6 sm:w-3.5 sm:h-3.5 md:w-[18px] md:h-[18px] lg:w-5 lg:h-5'
                }`}
              />
            )}
          </button>

          {/* Next */}
          {voiceover.demos.length > 1 && (
            <button
              onClick={() => handleDemoChange('next')}
              disabled={currentDemoIndex === voiceover.demos.length - 1}
              className={`rounded-full bg-foreground/10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground/20 ${
                gridSize === 'small'
                  ? 'w-6 h-6 lg:w-7 lg:h-7'
                  : 'w-10 h-10 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-9 lg:h-9'
              }`}
              aria-label="Next demo"
            >
              <ChevronRight
                className={`text-foreground ${
                  gridSize === 'small'
                    ? 'w-3 h-3'
                    : 'w-5 h-5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]'
                }`}
              />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div
          className={
            gridSize === 'small'
              ? 'mb-1 px-2'
              : 'mb-2 sm:mb-1 md:mb-1.5 lg:mb-2 px-4 sm:px-2.5 md:px-3 lg:px-3.5'
          }
        >
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
        <div
          className={`flex items-center justify-between text-foreground/80 ${
            gridSize === 'small'
              ? 'text-[10px] px-2'
              : 'text-sm sm:text-xs [@media(min-width:768px)_and_(max-width:1023px)]:text-sm lg:text-xs px-4 sm:px-2.5 md:px-3 lg:px-3.5'
          }`}
        >
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-full transition-colors hover:bg-foreground/10"
            aria-label="Download audio"
          >
            <Download
              className={
                gridSize === 'small'
                  ? 'w-2.5 h-2.5'
                  : 'w-3.5 h-3.5 sm:w-3 sm:h-3 [@media(min-width:768px)_and_(max-width:1023px)]:w-4 [@media(min-width:768px)_and_(max-width:1023px)]:h-4 lg:w-3.5 lg:h-3.5'
              }
            />
          </button>
        </div>

        {/* Demo info */}
        <div className={gridSize === 'small' ? 'text-center mt-1 mb-2' : 'text-center mt-1 mb-3'}>
          <span
            className={`text-foreground/60 line-clamp-1 ${
              gridSize === 'small' ? 'text-[10px]' : 'text-sm sm:text-[10px] md:text-xs lg:text-xs'
            }`}
          >
            {currentDemo?.title}
            {voiceover.demos.length > 1 && (
              <span className="ml-1">
                ({currentDemoIndex + 1}/{voiceover.demos.length})
              </span>
            )}
          </span>
        </div>

        {/* Choose button - moved to bottom */}
        <div
          className={
            gridSize === 'small'
              ? 'mt-2'
              : 'mt-6 [@media(min-width:640px)]:mt-3 [@media(min-width:768px)_and_(max-width:1023px)]:mt-8 lg:mt-4'
          }
        >
          <button
            onClick={handleChooseClick}
            className={`w-full bg-foreground text-background font-medium transition-all duration-200 hover:bg-foreground/90 hover:scale-[1.02] hover:shadow-lg ${
              gridSize === 'small'
                ? 'py-1.5 text-xs rounded-lg lg:py-2 lg:text-sm'
                : 'py-3 sm:py-2.5 sm:text-sm [@media(min-width:768px)_and_(max-width:1023px)]:py-5 [@media(min-width:768px)_and_(max-width:1023px)]:text-lg lg:py-3 lg:text-base text-base rounded-xl sm:rounded-lg [@media(min-width:768px)_and_(max-width:1023px)]:rounded-2xl'
            }`}
          >
            Kies {firstName}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
