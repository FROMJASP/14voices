// Improved Voiceover Card Component based on Design 3 V1
'use client';

import React, { useState, useRef } from 'react';
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

export function VoiceoverCard({ voice, isSelected, onSelect, currentlyPlayingId, onPlayingChange }: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Tilt effect motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0, springValues);

  // Initialize audio
  React.useEffect(() => {
    if (voice.demos.length > 0) {
      audioRef.current = new Audio(voice.demos[activeDemo].url);
      audioRef.current.addEventListener('loadedmetadata', () => {
        // Audio loaded
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
        onPlayingChange?.(null);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeDemo, voice.demos, onPlayingChange]);

  // Handle when another card starts playing
  React.useEffect(() => {
    if (currentlyPlayingId && currentlyPlayingId !== voice.id) {
      // Another card is playing, stop this one
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setProgress(0);
        setShowPlayer(false);
      }
    }
  }, [currentlyPlayingId, voice.id]);

  // Update progress smoothly
  React.useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current && isPlaying && !isDragging) {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(currentProgress);
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    };

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
  }, [isPlaying, isDragging]);

  const handlePlayClick = () => {
    if (!audioRef.current) return;

    setShowPlayer(!showPlayer);
    if (!showPlayer) {
      // When opening player, start playing
      onPlayingChange?.(voice.id);
      setTimeout(() => {
        audioRef.current?.play();
        setIsPlaying(true);
      }, 300);
    } else {
      // Toggle play/pause when player is already open
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
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const rect = progressRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setProgress(percentage);

      const newTime = (percentage / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleProgressClick(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDemoChange = (index: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = voice.demos[index].url;
      setIsPlaying(false);
      setProgress(0);
    }
    setActiveDemo(index);
  };

  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Tilt effect handlers
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -8; // Subtle tilt
    const rotationY = (offsetX / (rect.width / 2)) * 8;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const handleCardMouseEnter = () => {
    if (isMobile) return;
    scale.set(1.02); // Subtle scale
    opacity.set(1); // Show caption
  };

  const handleCardMouseLeave = () => {
    if (isMobile) return;
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    opacity.set(0); // Hide caption
  };

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
          rotateX,
          rotateY,
          scale,
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

                {/* Demo Info - Now with better spacing */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {voice.demos[activeDemo].title}
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

              {/* Expandable Player with Fixed Progress */}
              <AnimatePresence>
                {showPlayer && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pt-3 border-t border-white/10"
                  >
                    {/* Demo Buttons */}
                    <div className="flex gap-2 mb-3">
                      {voice.demos.map((demo, index) => (
                        <button
                          key={demo.id}
                          onClick={() => handleDemoChange(index)}
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

                    {/* Interactive Progress Bar */}
                    <div
                      ref={progressRef}
                      className="relative h-2 bg-white/20 rounded-full cursor-pointer"
                      onClick={handleProgressClick}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
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

                    {/* Time Display */}
                    <div className="flex justify-between text-xs text-white/80 mt-2">
                      <span>
                        {audioRef.current
                          ? `${Math.floor(((progress / 100) * audioRef.current.duration) / 60)}:${String(Math.floor(((progress / 100) * audioRef.current.duration) % 60)).padStart(2, '0')}`
                          : '0:00'}
                      </span>
                      <span>{voice.demos[activeDemo].duration}</span>
                    </div>
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
            x,
            y,
            opacity,
          }}
        >
          Klik voor meer info
        </motion.div>
      )}
    </div>
  );
}
