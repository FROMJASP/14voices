'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, ChevronLeft, ChevronRight, Download, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TransformedVoiceover } from '@/types/voiceover';
import './custom-card.css';

interface VoiceoverPlayerCardProps {
  voiceover: TransformedVoiceover;
  onBooking?: (voiceover: TransformedVoiceover) => void;
}

export function VoiceoverPlayerCard({ voiceover }: Omit<VoiceoverPlayerCardProps, 'onBooking'>) {
  const firstName = voiceover.name.split(' ')[0];
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const hasDemos = voiceover.demos && voiceover.demos.length > 0;
  const currentDemo = hasDemos ? voiceover.demos[currentDemoIndex] : null;

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

  const handlePlayPause = () => {
    if (!hasDemos) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else if (currentDemo) {
      // Stop all other audio elements and close other players
      document.querySelectorAll('audio').forEach((audio) => audio.pause());
      // Dispatch custom event to close other players
      window.dispatchEvent(new CustomEvent('voiceover-play', { detail: { id: voiceover.id } }));

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
        });
      }

      audioRef.current.play();
      setIsPlaying(true);

      // Update progress and time
      progressInterval.current = setInterval(() => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
          const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(currentProgress);
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 100);
    }
  };

  // Listen for other voiceovers playing
  useEffect(() => {
    const handleOtherPlay = (event: CustomEvent) => {
      if (event.detail.id !== voiceover.id && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
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

  const handleDemoChange = (direction: 'prev' | 'next') => {
    const newIndex =
      direction === 'next'
        ? Math.min(currentDemoIndex + 1, voiceover.demos.length - 1)
        : Math.max(currentDemoIndex - 1, 0);

    if (newIndex !== currentDemoIndex) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
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

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const handleDownload = () => {
    if (currentDemo) {
      const link = document.createElement('a');
      link.href = currentDemo.audioFile.url;
      link.download = `${firstName}_${currentDemo.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!hasDemos) {
    return (
      <div className="custom-card-wrapper">
        <div className="custom-card">
          <div className="p-6 text-center">
            <p className="text-muted-foreground">Geen demo&apos;s beschikbaar</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="custom-card-wrapper"
    >
      <div className="custom-card">
        {/* Availability section inside card with trapezoid shape */}
        {voiceover.beschikbaar && (
          <div className="custom-card-availability-section">
            <svg className="custom-card-trapezoid" viewBox="0 0 180 30" preserveAspectRatio="none">
              {/* Fill without stroke */}
              <path d="M 0,0 L 180,0 L 153,30 L 27,30 Z" fill="var(--background)" stroke="none" />
              {/* Only side and bottom borders */}
              <line x1="0" y1="0" x2="27" y2="30" stroke="var(--border)" strokeWidth="1" />
              <line x1="180" y1="0" x2="153" y2="30" stroke="var(--border)" strokeWidth="1" />
              <line x1="27" y1="29.5" x2="153" y2="29.5" stroke="var(--border)" strokeWidth="1.5" />
            </svg>
            <div className="custom-card-availability">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-foreground">
                {voiceover.availabilityText || 'Nu beschikbaar'}
              </span>
            </div>
          </div>
        )}

        {/* Content wrapper with rounded corners */}
        <div className="overflow-hidden rounded-[1rem]">
          {/* Image container with player overlay */}
          <div className="relative aspect-[4/5]">
            {/* Background image */}
            {voiceover.profilePhoto?.url ? (
              <Image
                src={voiceover.profilePhoto.url}
                alt={firstName}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}

            {/* Player overlay */}
            <div className="absolute inset-0 bg-background/60 dark:bg-black/60 backdrop-blur-sm flex flex-col justify-between p-4">
              {/* Top section with name and close button */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{firstName}</h3>
                  {/* Style tags */}
                  {voiceover.styleTags && voiceover.styleTags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap text-xs text-foreground mt-1">
                      {voiceover.styleTags.map((tagObj, index) => (
                        <React.Fragment key={tagObj.tag}>
                          {index > 0 && <span className="w-1 h-1 bg-foreground rounded-full" />}
                          <span>{tagObj.tag.charAt(0).toUpperCase() + tagObj.tag.slice(1)}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // Optional close functionality
                  }}
                  className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center transition-colors opacity-0 pointer-events-none"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>

              {/* Profile picture */}
              <div className="flex justify-center mb-4">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-foreground/10">
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

              {/* Center section with player controls */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full"
              >
                {/* Player controls */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  {/* Previous */}
                  {voiceover.demos.length > 1 && (
                    <button
                      onClick={() => handleDemoChange('prev')}
                      className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center transition-colors hover:bg-foreground/20"
                    >
                      <ChevronLeft className="w-5 h-5 text-foreground" />
                    </button>
                  )}

                  {/* Play/Pause */}
                  <button
                    onClick={handlePlayPause}
                    className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center transition-transform hover:scale-105"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-background" />
                    ) : (
                      <Play className="w-6 h-6 text-background ml-0.5" />
                    )}
                  </button>

                  {/* Next */}
                  {voiceover.demos.length > 1 && (
                    <button
                      onClick={() => handleDemoChange('next')}
                      className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center transition-colors hover:bg-foreground/20"
                    >
                      <ChevronRight className="w-5 h-5 text-foreground" />
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-2">
                  <div
                    className="relative h-1 bg-foreground/20 rounded-full cursor-pointer"
                    onClick={handleProgressClick}
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
                <div className="flex items-center justify-between text-foreground/80 text-xs px-4">
                  <span>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-full transition-colors hover:bg-foreground/10"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Demo info */}
                <div className="text-center mt-3">
                  <span className="text-xs text-foreground/60">
                    {currentDemo?.title}
                    {voiceover.demos.length > 1 && (
                      <span className="ml-2">
                        ({currentDemoIndex + 1}/{voiceover.demos.length})
                      </span>
                    )}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
