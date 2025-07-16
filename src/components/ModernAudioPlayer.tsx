'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface ModernAudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  duration?: string;
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
  preload?: 'none' | 'metadata' | 'auto';
}

export function ModernAudioPlayer({
  src,
  title,
  artist,
  variant = 'default',
  className = '',
  preload = 'metadata',
}: ModernAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Smooth animation for playhead
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

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handlePause);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [whilePlaying]);

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
    return <div className={`text-gray-400 ${className}`}>No audio available</div>;
  }

  // Minimal variant - just play button
  if (variant === 'minimal') {
    return (
      <button
        onClick={togglePlayPause}
        disabled={isLoading}
        className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all ${className} ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        <audio ref={audioRef} src={src} preload={preload} />
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`bg-gray-50 rounded-lg p-3 ${className}`}>
        <audio ref={audioRef} src={src} preload={preload} />

        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={togglePlayPause}
            disabled={isLoading}
            className={`p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>

          {title && (
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{title}</h4>
              {artist && <p className="text-xs text-gray-500">{artist}</p>}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span className="text-gray-400">/</span>
            <span>{formatTime(trackDuration)}</span>
          </div>

          <div
            ref={progressBarRef}
            className="relative h-1.5 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
            onMouseDown={handleMouseDown}
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-none"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-none"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <audio ref={audioRef} src={src} preload={preload} />

      {/* Track info */}
      {(title || artist) && (
        <div className="text-center mb-6">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {artist && <p className="text-sm text-gray-500">{artist}</p>}
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-6">
        <div
          ref={progressBarRef}
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer mb-2"
          onMouseDown={handleMouseDown}
        >
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-none"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-blue-500 transition-none"
            style={{ left: `calc(${progressPercent}% - 8px)` }}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(trackDuration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => skipTime(-10)}
          className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
          aria-label="Skip back 10 seconds"
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className={`p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
        </button>

        <button
          onClick={() => skipTime(10)}
          className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
          aria-label="Skip forward 10 seconds"
        >
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
}
