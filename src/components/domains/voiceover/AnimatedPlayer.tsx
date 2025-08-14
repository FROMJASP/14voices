'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play, Pause, ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TransformedVoiceover } from '@/types/voiceover';

interface AnimatedPlayerProps {
  voiceover: TransformedVoiceover;
  onClose: () => void;
}

export function AnimatedPlayer({ voiceover, onClose }: AnimatedPlayerProps) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  
  const firstName = voiceover.name.split(' ')[0];
  const currentDemo = voiceover.demos[currentDemoIndex];

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

  // Listen for other players and pause this one
  useEffect(() => {
    const handleOtherPlay = (event: CustomEvent) => {
      if (event.detail.id !== voiceover.id && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      }
    };

    window.addEventListener('voiceover-play', handleOtherPlay as EventListener);
    return () => {
      window.removeEventListener('voiceover-play', handleOtherPlay as EventListener);
    };
  }, [voiceover.id]);

  const handlePlayPause = async () => {
    if (!currentDemo) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      try {
        setIsLoading(true);
        
        // Stop all other audio and notify other players
        document.querySelectorAll('audio').forEach(audio => audio.pause());
        window.dispatchEvent(new CustomEvent('voiceover-play', { detail: { id: voiceover.id } }));

        // Create or update audio element
        if (!audioRef.current || audioRef.current.src !== currentDemo.audioFile.url) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          
          audioRef.current = new Audio();
          audioRef.current.preload = 'metadata';
          
          audioRef.current.addEventListener('loadedmetadata', () => {
            setDuration(audioRef.current?.duration || 0);
            setIsLoading(false);
          });
          
          audioRef.current.addEventListener('ended', () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
            if (progressInterval.current) {
              clearInterval(progressInterval.current);
            }
          });
          
          audioRef.current.addEventListener('error', () => {
            setIsLoading(false);
            console.error('Audio load error');
          });
          
          audioRef.current.src = currentDemo.audioFile.url;
        }
        
        await audioRef.current.play();
        setIsPlaying(true);

        // Update progress
        progressInterval.current = setInterval(() => {
          if (audioRef.current && !isNaN(audioRef.current.duration)) {
            const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(currentProgress);
            setCurrentTime(audioRef.current.currentTime);
          }
        }, 100);
        
      } catch (error) {
        console.error('Audio play error:', error);
        setIsLoading(false);
      }
    }
  };

  const handleDemoChange = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? Math.min(currentDemoIndex + 1, voiceover.demos.length - 1)
      : Math.max(currentDemoIndex - 1, 0);
    
    if (newIndex !== currentDemoIndex) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Reset state
      setCurrentDemoIndex(newIndex);
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      
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
      className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col justify-between p-4"
      onClick={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold text-white">{firstName}</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-white/20"
          aria-label="Close player"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Profile picture */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-white/10">
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
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full"
      >
        {/* Choose button */}
        <div className="mb-6">
          <button
            onClick={handleChooseClick}
            className="w-full bg-white text-black rounded-xl py-3 font-medium transition-all duration-200 hover:bg-white/90 hover:scale-[1.02] hover:shadow-lg"
          >
            Kies {firstName}
          </button>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          {/* Previous */}
          {voiceover.demos.length > 1 && (
            <button
              onClick={() => handleDemoChange('prev')}
              disabled={currentDemoIndex === 0}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
              aria-label="Previous demo"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            disabled={isLoading}
            className="w-14 h-14 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6 text-black" />
            ) : (
              <Play className="w-6 h-6 text-black ml-0.5" />
            )}
          </button>

          {/* Next */}
          {voiceover.demos.length > 1 && (
            <button
              onClick={() => handleDemoChange('next')}
              disabled={currentDemoIndex === voiceover.demos.length - 1}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
              aria-label="Next demo"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-2 px-4">
          <div 
            className="relative h-1 bg-white/20 rounded-full cursor-pointer"
            onClick={handleProgressClick}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div 
              className="absolute inset-y-0 left-0 bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Time and download */}
        <div className="flex items-center justify-between text-white/80 text-xs px-4">
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-full transition-colors hover:bg-white/10"
            aria-label="Download audio"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Demo info */}
        <div className="text-center mt-3">
          <span className="text-xs text-white/60">
            {currentDemo?.title}
            {voiceover.demos.length > 1 && (
              <span className="ml-2">({currentDemoIndex + 1}/{voiceover.demos.length})</span>
            )}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}