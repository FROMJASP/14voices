'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceoverDemo } from '@/types/voiceover';

interface SmartAudioPlayerProps {
  demos: VoiceoverDemo[];
  artistName: string;
  onDownload?: (audioUrl: string, title: string) => void;
  className?: string;
}

export function SmartAudioPlayer({
  demos,
  artistName,
  onDownload,
  className = '',
}: SmartAudioPlayerProps) {
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const currentDemo = demos[currentDemoIndex];

  const whilePlaying = useCallback(() => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  }, [isDragging]);

  // Reset playback when demo changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setTrackDuration(0);
    setIsLoading(true);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [currentDemoIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentDemo) return;

    const setAudioData = () => {
      setTrackDuration(audio.duration);
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      animationRef.current = requestAnimationFrame(whilePlaying);
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Auto-play next demo if available
      if (currentDemoIndex < demos.length - 1) {
        setTimeout(() => {
          setCurrentDemoIndex((prev) => prev + 1);
        }, 500);
      }
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('durationchange', setAudioData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('durationchange', setAudioData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [whilePlaying, isDragging, currentDemo, currentDemoIndex, demos.length]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * trackDuration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressChange(e);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const progressBar = progressBarRef.current;
        if (!progressBar) return;

        const rect = progressBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = percent * trackDuration;

        setCurrentTime(newTime);
      }
    },
    [isDragging, trackDuration]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (isDragging && audioRef.current) {
        const progressBar = progressBarRef.current;
        if (!progressBar) return;

        const rect = progressBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = percent * trackDuration;

        audioRef.current.currentTime = newTime;
        setIsDragging(false);
      }
    },
    [isDragging, trackDuration]
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    return undefined;
  }, [isDragging, trackDuration, handleMouseMove, handleMouseUp]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const goToPrevious = () => {
    if (currentDemoIndex > 0) {
      setCurrentDemoIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentDemoIndex < demos.length - 1) {
      setCurrentDemoIndex((prev) => prev + 1);
    }
  };

  const handleDownload = () => {
    if (onDownload && currentDemo) {
      onDownload(currentDemo.audioFile.url, currentDemo.title);
    }
  };

  const progressPercent = trackDuration > 0 ? (currentTime / trackDuration) * 100 : 0;

  if (!demos.length) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
        <p className="text-sm">Geen demo&apos;s beschikbaar</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden ${className}`}
    >
      <audio
        ref={audioRef}
        src={currentDemo.audioFile.url}
        preload="metadata"
        key={currentDemo.id}
      />

      {/* Demo Title and Counter */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.h4
                key={currentDemo.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-medium text-gray-900 dark:text-white text-sm truncate"
              >
                {currentDemo.title}
              </motion.h4>
            </AnimatePresence>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{artistName}</p>
          </div>
          {demos.length > 1 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium tabular-nums">
              {currentDemoIndex + 1} van {demos.length}
            </div>
          )}
        </div>
      </div>

      {/* Player Controls */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrevious}
            disabled={currentDemoIndex === 0}
            className={`p-1.5 rounded-lg transition-colors ${
              currentDemoIndex === 0
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label="Previous demo"
          >
            <ChevronLeft size={16} />
          </motion.button>

          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlayPause}
            disabled={isLoading}
            className={`p-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm hover:shadow-md transition-all flex-shrink-0 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isPlaying ? 'pause' : 'play'}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Progress Bar */}
          <div className="flex-1 px-2">
            <div
              ref={progressBarRef}
              className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer group"
              onMouseDown={handleMouseDown}
            >
              <motion.div
                className="absolute inset-y-0 left-0 bg-gray-900 dark:bg-white rounded-full"
                style={{ width: `${progressPercent}%` }}
                layoutId="progress"
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 dark:bg-white rounded-full shadow-sm border-2 border-white dark:border-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progressPercent}% - 6px)` }}
                whileHover={{ scale: 1.1 }}
              />
            </div>
          </div>

          {/* Time Display */}
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 tabular-nums min-w-[60px] text-right">
            {formatTime(currentTime)} / {formatTime(trackDuration)}
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNext}
            disabled={currentDemoIndex === demos.length - 1}
            className={`p-1.5 rounded-lg transition-colors ${
              currentDemoIndex === demos.length - 1
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label="Next demo"
          >
            <ChevronRight size={16} />
          </motion.button>

          {/* Download Button */}
          {onDownload && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Download demo"
              aria-label="Download current demo"
            >
              <Download size={14} />
            </motion.button>
          )}
        </div>

        {/* Demo Description */}
        {currentDemo.description && (
          <AnimatePresence mode="wait">
            <motion.p
              key={currentDemo.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed"
            >
              {currentDemo.description}
            </motion.p>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
