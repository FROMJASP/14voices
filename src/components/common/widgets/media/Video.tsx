/**
 * Optimized Video component with lazy loading, intersection observer,
 * and progressive enhancement for better performance
 */

'use client';

import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  width?: number;
  height?: number;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: () => void;
  lazy?: boolean;
  threshold?: number;
  showCustomControls?: boolean;
}

export const OptimizedVideo = memo(function OptimizedVideo({
  src,
  poster,
  className,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  playsInline = true,
  preload = 'none',
  width,
  height,
  onLoadStart,
  onCanPlay,
  onError,
  lazy = true,
  threshold = 0.1,
  showCustomControls = false,
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(!lazy);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasError, setHasError] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, threshold, isInView]);

  // Auto-play when in view (if specified)
  useEffect(() => {
    if (isInView && autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play failed, which is expected in many browsers
        console.log('Auto-play prevented by browser');
      });
    }
  }, [isInView, autoPlay]);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    onLoadStart?.();
  }, [onLoadStart]);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
    onCanPlay?.();
  }, [onCanPlay]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(console.error);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  }, [isMuted]);

  // Error fallback
  if (hasError) {
    return (
      <div
        className={cn('bg-gray-200 dark:bg-gray-800 flex items-center justify-center', className)}
        style={{ width, height }}
      >
        <div className="text-center p-4">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Video failed to load</p>
        </div>
      </div>
    );
  }

  // Loading placeholder
  if (!isInView) {
    return (
      <div
        className={cn(
          'relative bg-gray-200 dark:bg-gray-800 flex items-center justify-center animate-pulse',
          className
        )}
        style={{ width, height }}
      >
        {poster ? (
          <Image
            src={poster}
            alt="Video poster"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="text-center p-4">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-6-4h8m-7 8h6a2 2 0 002-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Loading video...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative group', className)}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls && !showCustomControls}
        playsInline={playsInline}
        preload={preload}
        poster={poster}
        width={width}
        height={height}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        onPlay={handlePlay}
        onPause={handlePause}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Custom controls */}
      {showCustomControls && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-4 flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="text-white hover:text-primary transition-colors p-2"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            <button
              onClick={toggleMute}
              className="text-white hover:text-primary transition-colors p-2"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

OptimizedVideo.displayName = 'OptimizedVideo';

// Specialized component for background videos
export const BackgroundVideo = memo(function BackgroundVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  return (
    <OptimizedVideo
      src={src}
      poster={poster}
      className={cn('absolute inset-0 w-full h-full object-cover', className)}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      lazy={false} // Background videos should load immediately
    />
  );
});

BackgroundVideo.displayName = 'BackgroundVideo';

// Component for demo videos with custom controls
export const DemoVideo = memo(function DemoVideo({
  src,
  poster,
  className,
  title,
}: {
  src: string;
  poster?: string;
  className?: string;
  title?: string;
}) {
  return (
    <div className="relative">
      <OptimizedVideo
        src={src}
        poster={poster}
        className={cn('rounded-lg shadow-lg', className)}
        muted
        playsInline
        preload="metadata"
        showCustomControls
        lazy
        threshold={0.3}
      />
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-medium text-sm">{title}</h3>
        </div>
      )}
    </div>
  );
});

DemoVideo.displayName = 'DemoVideo';
