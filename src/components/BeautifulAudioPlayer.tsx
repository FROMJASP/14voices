'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeautifulAudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  duration?: string;
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
  preload?: 'none' | 'metadata' | 'auto';
}

export function BeautifulAudioPlayer({
  src,
  title,
  artist,
  variant = 'default',
  className = '',
  preload = 'metadata',
}: BeautifulAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isHovering, setIsHovering] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const whilePlaying = useCallback(() => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  }, [isDragging]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

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

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('durationchange', setAudioData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('durationchange', setAudioData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [whilePlaying, isDragging]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, trackDuration));
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = Number(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, trackDuration, handleMouseMove, handleMouseUp]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = trackDuration > 0 ? (currentTime / trackDuration) * 100 : 0;

  if (!src) {
    return (
      <div className={`text-gray-400 dark:text-gray-600 ${className}`}>No audio available</div>
    );
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className="relative inline-block">
        <audio ref={audioRef} src={src} preload={preload} />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayPause}
          disabled={isLoading}
          className={`group relative p-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg hover:shadow-xl transition-all ${className} ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
            className="relative"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </motion.div>
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gray-900 dark:bg-white opacity-20"
              animate={{ scale: [1, 1.2], opacity: [0.3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 ${className}`}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
      >
        <audio ref={audioRef} src={src} preload={preload} />

        {/* Background gradient animation */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            background: isPlaying
              ? [
                  'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                  'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                ]
              : 'linear-gradient(45deg, #f3f4f6, #e5e7eb)',
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        />

        <div className="relative p-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlayPause}
              disabled={isLoading}
              className={`relative p-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm hover:shadow-md transition-all ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isPlaying ? 'pause' : 'play'}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {title && (
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {title}
                </h4>
                {artist && <p className="text-xs text-gray-500 dark:text-gray-400">{artist}</p>}
              </div>
            )}

            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 tabular-nums">
              {formatTime(currentTime)} / {formatTime(trackDuration)}
            </div>
          </div>

          {/* Progress bar */}
          <motion.div className="mt-3" animate={{ opacity: isHovering ? 1 : 0.8 }}>
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
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 dark:bg-white rounded-full shadow-lg border-2 border-white dark:border-gray-900 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                style={{ left: `calc(${progressPercent}% - 6px)` }}
                whileHover={{ scale: 1.2 }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 ${className}`}
    >
      <audio ref={audioRef} src={src} preload={preload} />

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -inset-40 opacity-20"
          animate={{
            rotate: isPlaying ? 360 : 0,
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div className="h-full w-full bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 dark:from-gray-300 dark:via-gray-200 dark:to-gray-100 blur-3xl" />
        </motion.div>
      </div>

      <div className="relative">
        {/* Track info */}
        {(title || artist) && (
          <div className="text-center mb-8">
            {title && (
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
            )}
            {artist && <p className="text-gray-600 dark:text-gray-400">{artist}</p>}
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-8">
          <div
            ref={progressBarRef}
            className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer group"
            onMouseDown={handleMouseDown}
          >
            <motion.div
              className="absolute inset-y-0 left-0 bg-gray-900 dark:bg-white rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
            <motion.div
              className="absolute -top-1 w-5 h-5 bg-gray-900 dark:bg-white rounded-full shadow-lg border-2 border-white dark:border-gray-900 z-10"
              style={{ left: `calc(${progressPercent}% - 10px)` }}
              animate={{ scale: isDragging ? 1.2 : 1 }}
            />
          </div>

          <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(trackDuration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => skipTime(-10)}
            className="p-3 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            aria-label="Skip back 10 seconds"
          >
            <SkipBack size={24} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlayPause}
            disabled={isLoading}
            className={`p-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg hover:shadow-xl transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isPlaying ? 'pause' : 'play'}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-0.5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => skipTime(10)}
            className="p-3 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            aria-label="Skip forward 10 seconds"
          >
            <SkipForward size={24} />
          </motion.button>
        </div>

        {/* Volume control */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: showVolume ? 1 : 0.5 }}
          onHoverStart={() => setShowVolume(true)}
          onHoverEnd={() => setShowVolume(false)}
        >
          <Volume2 size={20} className="text-gray-600 dark:text-gray-400" />
          <motion.input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
            animate={{ width: showVolume ? 128 : 96 }}
            style={{
              background: `linear-gradient(to right, #111827 0%, #111827 ${volume * 100}%, ${showVolume ? '#e5e7eb' : '#374151'} ${volume * 100}%, ${showVolume ? '#e5e7eb' : '#374151'} 100%)`,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
