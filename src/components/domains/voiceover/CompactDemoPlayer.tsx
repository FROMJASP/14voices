'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceoverDemo } from '@/types/voiceover';

interface CompactDemoPlayerProps {
  demos: VoiceoverDemo[];
  onDownload?: (audioUrl: string, title: string) => void;
  className?: string;
}

export function CompactDemoPlayer({
  demos,
  onDownload,
  className = '',
}: CompactDemoPlayerProps) {
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  
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

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      // Stop all other audio elements
      document.querySelectorAll('audio').forEach(audio => audio.pause());

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
              setCurrentDemoIndex(prev => prev + 1);
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
      setCurrentDemoIndex(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentDemoIndex < demos.length - 1) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setCurrentDemoIndex(prev => prev + 1);
    }
  };

  const handleDownload = () => {
    if (onDownload && currentDemo) {
      onDownload(currentDemo.audioFile.url, currentDemo.title);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!demos.length) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <div className="space-y-3">
        {/* Demo Title and Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {currentDemo.title}
            </span>
            {demos.length > 1 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {currentDemoIndex + 1}/{demos.length}
              </span>
            )}
          </div>
          
          {/* Download */}
          {onDownload && (
            <button
              onClick={handleDownload}
              className="p-1 rounded text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              title="Download demo"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Play Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Previous */}
          {demos.length > 1 && (
            <button
              onClick={goToPrevious}
              disabled={currentDemoIndex === 0}
              className={`p-1 rounded transition-all ${
                currentDemoIndex === 0
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Vorige demo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-white text-gray-900 dark:text-gray-900 flex items-center justify-center transition-all hover:bg-gray-50 dark:hover:bg-gray-100 hover:scale-105"
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
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Next */}
          {demos.length > 1 && (
            <button
              onClick={goToNext}
              disabled={currentDemoIndex === demos.length - 1}
              className={`p-1 rounded transition-all ${
                currentDemoIndex === demos.length - 1
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Volgende demo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress Bar with Time */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
            {formatTime(currentTime)}
          </span>
          
          <div 
            className="flex-1 relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer group"
            onClick={handleProgressClick}
          >
            <motion.div 
              className="absolute inset-y-0 left-0 bg-gray-900 dark:bg-white rounded-full"
              style={{ width: `${progress}%` }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-gray-900 dark:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 5px)` }}
            />
          </div>
          
          <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}