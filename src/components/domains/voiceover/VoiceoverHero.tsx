'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Download, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/common/ui';
import { cn } from '@/lib/utils';
import { VoiceoverDemo } from '@/types/voiceover';

interface VoiceoverHeroProps {
  name: string;
  profilePhoto?: {
    url: string;
    alt?: string;
  };
  bio?: string;
  cohort?: {
    name: string;
    color: string;
  };
  styleTags?: Array<{
    tag?: string;
    customTag?: string;
  }>;
  demos: VoiceoverDemo[];
  onDownload?: (audioUrl: string, title: string) => void;
  className?: string;
}

const formatTime = (seconds: number = 0) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const CustomSlider = ({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) => {
  return (
    <motion.div
      className={cn('relative w-full h-1 bg-white/20 rounded-full cursor-pointer', className)}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        onChange(Math.min(Math.max(percentage, 0), 100));
      }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full bg-white rounded-full"
        style={{ width: `${value}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </motion.div>
  );
};

export function VoiceoverHero({
  name,
  profilePhoto,
  bio,
  cohort,
  styleTags,
  demos,
  onDownload,
  className = '',
}: VoiceoverHeroProps) {
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const currentDemo = demos[currentDemoIndex];
  const firstName = name.split(' ')[0];

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

  const togglePlay = () => {
    if (!currentDemo) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      // Stop all other audio elements
      document.querySelectorAll('audio').forEach((audio) => audio.pause());

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
              setCurrentDemoIndex((prev) => prev + 1);
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

  const handleSeek = (value: number) => {
    if (!audioRef.current || !audioRef.current.duration) return;

    const time = (value / 100) * audioRef.current.duration;
    if (isFinite(time)) {
      audioRef.current.currentTime = time;
      setProgress(value);
      setCurrentTime(time);
    }
  };

  const goToPrevious = () => {
    if (currentDemoIndex > 0) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setCurrentDemoIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentDemoIndex < demos.length - 1) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setCurrentDemoIndex((prev) => prev + 1);
    }
  };

  const handleDownload = () => {
    if (onDownload && currentDemo) {
      onDownload(currentDemo.audioFile.url, currentDemo.title);
    }
  };

  if (!demos.length) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          'relative flex flex-col mx-auto rounded-3xl overflow-hidden',
          'bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95',
          'dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-700/95',
          'shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-sm',
          'p-4 w-full max-w-[340px]',
          className
        )}
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(10px)' }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
          delay: 0.1,
          type: 'spring',
        }}
        layout
      >
        <motion.div
          className="flex flex-col relative"
          layout
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Profile Photo Section */}
          <motion.div className="relative rounded-2xl overflow-hidden h-[220px] w-full bg-gradient-to-br from-gray-700/50 to-gray-800/50">
            {profilePhoto ? (
              <Image
                src={profilePhoto.url}
                alt={profilePhoto.alt || `Profile photo of ${firstName}`}
                fill
                className="object-cover"
                sizes="340px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-24 h-24 text-gray-600 dark:text-gray-400" />
              </div>
            )}

            {/* Overlay gradient for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Download button - positioned on the photo */}
            {onDownload && (
              <motion.button
                onClick={handleDownload}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Download demo"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>

          <motion.div className="flex flex-col w-full gap-y-3 mt-4">
            {/* Name and Cohort */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">{firstName}</h2>
              {cohort && (
                <Badge
                  variant="outline"
                  className="text-xs border-current"
                  style={{
                    borderColor: cohort.color,
                    color: cohort.color,
                    backgroundColor: `${cohort.color}20`,
                  }}
                >
                  {cohort.name}
                </Badge>
              )}
            </div>

            {/* Bio */}
            {bio && (
              <p className="text-xs text-gray-300 dark:text-gray-700 text-center leading-relaxed px-2">
                {bio}
              </p>
            )}

            {/* Style Tags */}
            {styleTags && styleTags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 px-2">
                {styleTags.map((tagObj, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <Tag className="w-2.5 h-2.5 mr-1" />
                    {tagObj.customTag || tagObj.tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Demo Title */}
            <div className="text-center mt-2">
              <h3 className="text-white font-medium text-sm">{currentDemo.title}</h3>
              {demos.length > 1 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Track {currentDemoIndex + 1} of {demos.length}
                </span>
              )}
            </div>

            {/* Progress Slider */}
            <motion.div className="flex flex-col gap-y-1 px-2">
              <CustomSlider value={progress} onChange={handleSeek} className="w-full" />
              <div className="flex items-center justify-between">
                <span className="text-white text-xs tabular-nums">{formatTime(currentTime)}</span>
                <span className="text-white text-xs tabular-nums">{formatTime(duration)}</span>
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div className="flex items-center justify-center w-full">
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-2xl p-2">
                {/* Previous */}
                {demos.length > 1 && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToPrevious}
                      disabled={currentDemoIndex === 0}
                      className={cn(
                        'text-white hover:bg-white/20 hover:text-white h-8 w-8 rounded-full',
                        currentDemoIndex === 0 && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}

                {/* Play/Pause */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={togglePlay}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 hover:text-white h-9 w-9 rounded-full flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-6 w-6" style={{ marginLeft: '2px' }} />
                    )}
                  </Button>
                </motion.div>

                {/* Next */}
                {demos.length > 1 && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToNext}
                      disabled={currentDemoIndex === demos.length - 1}
                      className={cn(
                        'text-white hover:bg-white/20 hover:text-white h-8 w-8 rounded-full',
                        currentDemoIndex === demos.length - 1 && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
