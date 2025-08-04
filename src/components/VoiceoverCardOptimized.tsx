// Optimized Voiceover Card Component with React.memo and performance improvements
'use client';

import React, { useState, useRef, memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import type { SpringOptions } from 'framer-motion';
import { Play, Pause, Calendar, User, Zap } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import './VoiceoverCard.css';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface Demo {
  id: string;
  title: string;
  url: string;
  duration: string;
}

interface VoiceoverCardProps {
  voice: {
    id: string;
    name: string;
    slug: string;
    profilePhoto?: string | null;
    tags: string[];
    beschikbaar: boolean;
    availabilityText?: string;
    demos: Demo[];
  };
  isSelected: boolean;
  onSelect: () => void;
  currentlyPlayingId?: string | null;
  onPlayingChange?: (voiceId: string | null) => void;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

// Memoized audio progress component
const AudioProgress = memo(({ 
  progress, 
  onProgressClick, 
  onMouseDown, 
  onMouseMove, 
  onMouseUp 
}: {
  progress: number;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
}) => (
  <div
    className="relative h-2 bg-white/20 rounded-full cursor-pointer"
    onClick={onProgressClick}
    onMouseDown={onMouseDown}
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseUp}
  >
    <motion.div
      className="absolute inset-y-0 left-0 bg-white rounded-full pointer-events-none"
      style={{ width: `${progress}%` }}
    />
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg hover:scale-125 transition-transform pointer-events-none"
      style={{ left: `calc(${progress}% - 8px)` }}
    />
  </div>
));

AudioProgress.displayName = 'AudioProgress';

// Memoized demo buttons component
const DemoButtons = memo(({ 
  demos, 
  activeDemo, 
  onDemoChange 
}: {
  demos: Demo[];
  activeDemo: number;
  onDemoChange: (index: number) => void;
}) => (
  <div className="flex gap-2 mb-3">
    {demos.map((demo, index) => (
      <button
        key={demo.id}
        onClick={() => onDemoChange(index)}
        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
          activeDemo === index
            ? 'bg-white/20 text-white'
            : 'text-white/70 hover:text-white/90'
        }`}
      >
        {demo.title}
      </button>
    ))}
  </div>
));

DemoButtons.displayName = 'DemoButtons';

// Memoized time display component
const TimeDisplay = memo(({ 
  currentTime, 
  duration 
}: {
  currentTime: string;
  duration: string;
}) => (
  <div className="flex justify-between text-xs text-white/80 mt-2">
    <span>{currentTime}</span>
    <span>{duration}</span>
  </div>
));

TimeDisplay.displayName = 'TimeDisplay';

// Custom hook for audio management - memoized
const useAudioPlayer = (demos: Demo[], activeDemo: number, _voiceId: string, onPlayingChange?: (id: string | null) => void) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Memoize audio initialization
  const initializeAudio = useCallback(() => {
    if (demos.length > 0 && demos[activeDemo]) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(demos[activeDemo].url);
      audioRef.current.addEventListener('loadedmetadata', () => {
        // Audio loaded
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
        onPlayingChange?.(null);
      });
    }
  }, [demos, activeDemo, onPlayingChange]);

  // Initialize audio when demo changes
  React.useEffect(() => {
    initializeAudio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeAudio]);

  // Memoized progress update function
  const updateProgress = useCallback(() => {
    if (audioRef.current && isPlaying && !isDragging) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  }, [isPlaying, isDragging]);

  // Update progress when playing
  React.useEffect(() => {
    if (isPlaying && !isDragging) {
      animationRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isDragging, updateProgress]);

  return {
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    showPlayer,
    setShowPlayer,
    isDragging,
    setIsDragging,
    audioRef,
    progressRef,
  };
};

export const VoiceoverCardOptimized = memo(function VoiceoverCard({
  voice,
  isSelected,
  onSelect,
  currentlyPlayingId,
  onPlayingChange,
}: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    showPlayer,
    setShowPlayer,
    isDragging,
    setIsDragging,
    audioRef,
    progressRef,
  } = useAudioPlayer(voice.demos, activeDemo, voice.id, onPlayingChange);

  // Tilt effect motion values - create outside useMemo to follow hook rules
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, springValues);
  const rotateY = useSpring(rotateYValue, springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0, springValues);
  
  const motionValues = useMemo(() => ({
    x,
    y,
    rotateX,
    rotateY,
    scale,
    opacity,
  }), [x, y, rotateX, rotateY, scale, opacity]);

  // Check mobile - memoized
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle when another card starts playing - memoized
  const handleOtherCardPlaying = useCallback(() => {
    if (currentlyPlayingId && currentlyPlayingId !== voice.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setProgress(0);
        setShowPlayer(false);
      }
    }
  }, [currentlyPlayingId, voice.id, audioRef, setIsPlaying, setProgress, setShowPlayer]);

  React.useEffect(() => {
    handleOtherCardPlaying();
  }, [handleOtherCardPlaying]);

  // Memoized event handlers
  const handlePlayClick = useCallback(() => {
    if (!audioRef.current) return;

    setShowPlayer(!showPlayer);
    if (!showPlayer) {
      onPlayingChange?.(voice.id);
      setTimeout(() => {
        audioRef.current?.play();
        setIsPlaying(true);
      }, 300);
    } else {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        onPlayingChange?.(null);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        onPlayingChange?.(voice.id);
      }
    }
  }, [audioRef, showPlayer, setShowPlayer, onPlayingChange, voice.id, isPlaying, setIsPlaying]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setProgress(percentage);

    const newTime = (percentage / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  }, [audioRef, progressRef, setProgress]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  }, [setIsDragging, handleProgressClick]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleProgressClick(e);
    }
  }, [isDragging, handleProgressClick]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  const handleDemoChange = useCallback((index: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = voice.demos[index].url;
      setIsPlaying(false);
      setProgress(0);
    }
    setActiveDemo(index);
  }, [audioRef, voice.demos, setIsPlaying, setProgress]);

  // Memoized tilt effect handlers
  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -8;
    const rotationY = (offsetX / (rect.width / 2)) * 8;

    motionValues.rotateX.set(rotationX);
    motionValues.rotateY.set(rotationY);
    motionValues.x.set(e.clientX - rect.left);
    motionValues.y.set(e.clientY - rect.top);
  }, [isMobile, motionValues]);

  const handleCardMouseEnter = useCallback(() => {
    if (isMobile) return;
    motionValues.scale.set(1.02);
    motionValues.opacity.set(1);
  }, [isMobile, motionValues]);

  const handleCardMouseLeave = useCallback(() => {
    if (isMobile) return;
    motionValues.scale.set(1);
    motionValues.rotateX.set(0);
    motionValues.rotateY.set(0);
    motionValues.opacity.set(0);
  }, [isMobile, motionValues]);

  // Memoized current time calculation
  const currentTimeDisplay = useMemo(() => {
    if (!audioRef.current) return '0:00';
    const currentTime = (progress / 100) * audioRef.current.duration;
    return `${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}`;
  }, [progress, audioRef]);

  return (
    <div
      className={`${plusJakarta.variable} font-plus-jakarta group h-full tilted-card-figure`}
      ref={cardRef}
      onMouseMove={handleCardMouseMove}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
    >
      <motion.div
        className="tilted-card-inner w-full h-full"
        style={{
          rotateX: motionValues.rotateX,
          rotateY: motionValues.rotateY,
          scale: motionValues.scale,
        }}
      >
        <div className="relative aspect-[3/4.2] rounded-2xl overflow-hidden shadow-xl bg-black h-full flex flex-col">
          {/* Profile Link */}
          <Link href={`/voiceovers/${voice.slug}`} className="absolute inset-0 z-10">
            {/* Full Image */}
            {voice.profilePhoto ? (
              <Image
                src={voice.profilePhoto}
                alt={voice.name}
                fill
                className="object-cover filter grayscale brightness-95 group-hover:brightness-105 transition-all duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-muted to-muted-foreground flex items-center justify-center">
                <User className="w-24 h-24 text-white/20" />
              </div>
            )}

            {/* Soft Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </Link>

          {/* Availability Info - Top Right */}
          {!voice.beschikbaar && (
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20 z-20">
              <div className="flex items-center gap-2 text-xs text-white">
                <Calendar size={12} />
                <span>Beschikbaar vanaf {voice.availabilityText || '15 jan'}</span>
              </div>
            </div>
          )}

          {/* Fast Delivery Badge - Only for Available */}
          {voice.beschikbaar && (
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20 z-20">
              <div className="flex items-center gap-1.5 text-xs text-white">
                <Zap size={12} className="text-green-400" />
                <span>Binnen 48 uur</span>
              </div>
            </div>
          )}

          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col">
            {/* Name and Tags */}
            <div className="px-6 pb-4 mt-auto">
              {/* Pills Style Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {voice.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/90 border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="font-plus-jakarta text-7xl font-black text-white leading-[0.85]">
                {voice.name}
              </h1>
            </div>

            {/* Glass Control Bar */}
            <div className="bg-black/40 backdrop-blur-xl border-t border-white/10">
              <div className="p-5">
                <div className="flex items-center justify-between gap-4">
                  {/* Circular Play Button */}
                  <motion.button
                    onClick={handlePlayClick}
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      {showPlayer && isPlaying ? (
                        <Pause size={24} className="text-white" />
                      ) : (
                        <Play size={24} className="text-white ml-0.5" />
                      )}
                    </div>
                  </motion.button>

                  {/* Demo Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {voice.demos[activeDemo]?.title || 'Demo'}
                    </p>
                    {!isSelected && (
                      <p className="text-white/70 text-xs">Klik om demo te beluisteren</p>
                    )}
                  </div>

                  {/* Book Button - Only for Available */}
                  {voice.beschikbaar && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelect();
                      }}
                      className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex-shrink-0 ${
                        isSelected
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-foreground hover:bg-accent'
                      }`}
                    >
                      {isSelected ? 'Ga verder' : 'Boeken'}
                    </motion.button>
                  )}
                </div>

                {/* Expandable Player */}
                <AnimatePresence>
                  {showPlayer && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 pt-3 border-t border-white/10"
                    >
                      {/* Demo Buttons */}
                      <DemoButtons
                        demos={voice.demos}
                        activeDemo={activeDemo}
                        onDemoChange={handleDemoChange}
                      />

                      {/* Interactive Progress Bar */}
                      <div ref={progressRef}>
                        <AudioProgress
                          progress={progress}
                          onProgressClick={handleProgressClick}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                        />
                      </div>

                      {/* Time Display */}
                      <TimeDisplay
                        currentTime={currentTimeDisplay}
                        duration={voice.demos[activeDemo]?.duration || '0:00'}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tooltip Caption */}
      {!isMobile && (
        <motion.div
          className="tilted-card-caption"
          style={{
            x: motionValues.x,
            y: motionValues.y,
            opacity: motionValues.opacity,
          }}
        >
          Klik voor meer info
        </motion.div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return (
    prevProps.voice.id === nextProps.voice.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.currentlyPlayingId === nextProps.currentlyPlayingId &&
    prevProps.voice.name === nextProps.voice.name &&
    prevProps.voice.slug === nextProps.voice.slug &&
    prevProps.voice.profilePhoto === nextProps.voice.profilePhoto &&
    prevProps.voice.beschikbaar === nextProps.voice.beschikbaar &&
    JSON.stringify(prevProps.voice.tags) === JSON.stringify(nextProps.voice.tags) &&
    JSON.stringify(prevProps.voice.demos) === JSON.stringify(nextProps.voice.demos)
  );
});

VoiceoverCardOptimized.displayName = 'VoiceoverCard';