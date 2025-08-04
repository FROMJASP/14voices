// Highly optimized VoiceoverCard with React.memo and performance improvements
'use client';

import React, { useState, useRef, useCallback, useMemo, memo } from 'react';
import { motion, useSpring } from 'framer-motion';
import type { SpringOptions } from 'framer-motion';
import { Play, Pause, User, Zap } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import { usePerformanceTracking } from '@/lib/performance-monitoring';

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

// Memoized spring configuration - prevents recreation on every render
const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

// Memoized tag component to prevent re-renders
const StyleTag = memo(({ tag, index }: { tag: string; index: number }) => (
  <span
    key={`${tag}-${index}`}
    className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-full whitespace-nowrap"
    style={{
      animationDelay: `${index * 100}ms`,
    }}
  >
    {tag}
  </span>
));

StyleTag.displayName = 'StyleTag';

// Memoized demo button component
const DemoButton = memo(({ 
  demo, 
  isPlaying, 
  onPlay, 
  onPause, 
  index 
}: { 
  demo: Demo; 
  isPlaying: boolean; 
  onPlay: () => void; 
  onPause: () => void; 
  index: number;
}) => (
  <button
    onClick={isPlaying ? onPause : onPlay}
    className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group text-left w-full"
    style={{
      animationDelay: `${(index + 3) * 100}ms`,
    }}
  >
    {isPlaying ? (
      <Pause className="w-4 h-4 text-primary flex-shrink-0" />
    ) : (
      <Play className="w-4 h-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
    )}
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
        {demo.title}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {demo.duration}
      </div>
    </div>
  </button>
));

DemoButton.displayName = 'DemoButton';

// Memoized availability indicator
const AvailabilityBadge = memo(({ 
  beschikbaar, 
  availabilityText 
}: { 
  beschikbaar: boolean; 
  availabilityText?: string;
}) => (
  <div className="flex items-center gap-1.5 mb-4">
    <div
      className={`w-2 h-2 rounded-full ${
        beschikbaar ? 'bg-green-500' : 'bg-orange-500'
      }`}
    />
    <span
      className={`text-xs font-medium ${
        beschikbaar ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
      }`}
    >
      {availabilityText || (beschikbaar ? 'Direct beschikbaar' : 'Beperkt beschikbaar')}
    </span>
    {beschikbaar && <Zap className="w-3 h-3 text-green-500" />}
  </div>
));

AvailabilityBadge.displayName = 'AvailabilityBadge';

export const VoiceoverCardMemoized = memo(function VoiceoverCard({
  voice,
  isSelected,
  onSelect,
  currentlyPlayingId,
  onPlayingChange,
}: VoiceoverCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Performance tracking
  usePerformanceTracking('VoiceoverCard');

  // Motion values for smooth animations
  const rotateX = useSpring(0, springValues);
  const rotateY = useSpring(0, springValues);

  // Memoized derived state
  const isCurrentlyPlaying = useMemo(() => 
    currentlyPlayingId === voice.id, 
    [currentlyPlayingId, voice.id]
  );


  const profileImageSrc = useMemo(() => 
    voice.profilePhoto || '/placeholder-avatar.png', 
    [voice.profilePhoto]
  );

  // Memoized event handlers
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;

    rotateY.set(mouseX / 10);
    rotateX.set(-mouseY / 10);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  const handleCardClick = useCallback(() => {
    onSelect();
    setIsExpanded(!isExpanded);
  }, [onSelect, isExpanded]);

  const handlePlayDemo = useCallback((demo: Demo) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Create new audio instance
    const audio = new Audio(demo.url);
    audio.preload = 'none'; // Optimize loading
    
    audio.addEventListener('loadstart', () => {
      onPlayingChange?.(voice.id);
    });

    audio.addEventListener('ended', () => {
      onPlayingChange?.(null);
      setCurrentAudio(null);
    });

    audio.addEventListener('error', () => {
      console.error('Audio playback failed for:', demo.title);
      onPlayingChange?.(null);
      setCurrentAudio(null);
    });

    setCurrentAudio(audio);
    audio.play().catch((error) => {
      console.error('Audio play failed:', error);
      onPlayingChange?.(null);
      setCurrentAudio(null);
    });
  }, [currentAudio, onPlayingChange, voice.id]);

  const handlePauseDemo = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      onPlayingChange?.(null);
    }
  }, [currentAudio, onPlayingChange]);

  // Cleanup audio on unmount
  React.useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  // Memoized style tags
  const styleTags = useMemo(() => 
    voice.tags.slice(0, 3), // Limit to first 3 tags for performance
    [voice.tags]
  );

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta`}>
      <motion.div
        ref={cardRef}
        className={`relative bg-white dark:bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-transparent ${
          isSelected 
            ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-2xl scale-[1.02]' 
            : 'hover:border-border'
        }`}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        whileHover={{ 
          scale: 1.02,
          transition: { type: 'spring', stiffness: 300, damping: 30 }
        }}
        whileTap={{ 
          scale: 0.98,
          transition: { type: 'spring', stiffness: 400, damping: 30 }
        }}
      >
        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center z-10"
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        )}

        {/* Card Content */}
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <Image
                src={profileImageSrc}
                alt={`${voice.name} profile`}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
                loading="lazy"
                sizes="64px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli5GzhvUkpiBdNTjKEsy5Z2o8N3DtMvhLi7jtRwVU9qKCDEAY+iAL8eAFzGZS1YbC0V2x8O2s0EayvqD3nP3SqNDDJWiBJQJnA==]"
              />
              
              {/* Availability indicator on avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-card ${
                  voice.beschikbaar ? 'bg-green-500' : 'bg-orange-500'
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground mb-1 truncate">
                {voice.name}
              </h3>
              <AvailabilityBadge 
                beschikbaar={voice.beschikbaar} 
                availabilityText={voice.availabilityText}
              />
            </div>
          </div>

          {/* Style Tags */}
          {styleTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {styleTags.map((tag, index) => (
                <StyleTag key={`${tag}-${index}`} tag={tag} index={index} />
              ))}
            </div>
          )}

          {/* Demo Buttons */}
          {voice.demos && voice.demos.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                Demo&apos;s beluisteren:
              </h4>
              {voice.demos.slice(0, 2).map((demo, index) => (
                <DemoButton
                  key={demo.id}
                  demo={demo}
                  isPlaying={isCurrentlyPlaying}
                  onPlay={() => handlePlayDemo(demo)}
                  onPause={handlePauseDemo}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* View Profile Link */}
          <div className="mt-4 pt-4 border-t border-border">
            <Link
              href={`/voiceovers/${voice.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <User className="w-4 h-4" />
              Bekijk profiel
            </Link>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ transformStyle: 'preserve-3d' }}
        />
      </motion.div>
    </div>
  );
});

VoiceoverCardMemoized.displayName = 'VoiceoverCardMemoized';