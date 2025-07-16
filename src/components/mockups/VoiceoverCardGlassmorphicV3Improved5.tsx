// Glassmorphic V3 Improved 5: Minimal Elegant with Fade Tags
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, PauseCircle, CalendarDays } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
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
    profilePhoto?: string | null;
    tags: string[];
    beschikbaar: boolean;
    availabilityText?: string;
    demos: Demo[];
  };
  isSelected: boolean;
  onSelect: () => void;
}

export function VoiceoverCardGlassmorphicV3Improved5({
  voice,
  isSelected,
  onSelect,
}: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [hoveredTag, setHoveredTag] = useState<number | null>(null);

  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handlePlayClick = () => {
    if (!showPlayer) {
      setShowPlayer(true);
      setTimeout(() => setIsPlaying(true), 200);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const formatDate = (dateStr: string) => {
    // Simple date formatting
    return dateStr || '15 januari';
  };

  return (
    <motion.div
      className={`${plusJakarta.variable} font-plus-jakarta group`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl bg-gray-900">
        {/* Full Image with Subtle Filter */}
        {voice.profilePhoto ? (
          <Image
            src={voice.profilePhoto}
            alt={voice.name}
            fill
            className="absolute inset-0 object-cover filter grayscale-[80%] contrast-125"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
        )}

        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Status Indicator - Elegant */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              voice.beschikbaar ? 'bg-green-500' : 'bg-amber-500'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                voice.beschikbaar ? 'bg-green-500' : 'bg-amber-500'
              } animate-pulse`}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Typography Section */}
          <div className="px-5 pb-4">
            {/* Name with Perfect Typography */}
            <h1 className="font-plus-jakarta text-[3.5rem] leading-[0.9] font-extrabold text-white tracking-tight">
              {voice.name}
            </h1>

            {/* Fade Tags */}
            <div className="mt-3 flex items-center gap-2 h-7 overflow-hidden">
              {voice.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: hoveredTag === index ? 1 : 0.6 }}
                  onHoverStart={() => setHoveredTag(index)}
                  onHoverEnd={() => setHoveredTag(null)}
                  className="text-sm text-white cursor-default transition-opacity"
                >
                  {tag}
                  {index < voice.tags.length - 1 && <span className="ml-2">·</span>}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Minimal Glass Bar */}
          <div className="bg-white/5 backdrop-blur-2xl border-t border-white/10">
            <div className="px-5 py-3 flex items-center justify-between">
              {/* Integrated Play Button */}
              <motion.button
                onClick={handlePlayClick}
                className="flex items-center gap-3"
                whileHover={{ x: 2 }}
              >
                <motion.div whileTap={{ scale: 0.9 }}>
                  {isPlaying ? (
                    <PauseCircle size={40} className="text-white" strokeWidth={1.5} />
                  ) : (
                    <PlayCircle size={40} className="text-white" strokeWidth={1.5} />
                  )}
                </motion.div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">
                    {showPlayer ? voice.demos[activeDemo].title : 'Beluister demo'}
                  </p>
                  {showPlayer && (
                    <p className="text-white/50 text-xs">{voice.demos[activeDemo].duration}</p>
                  )}
                </div>
              </motion.button>

              {/* Elegant Book Button */}
              <motion.button
                whileHover={{ scale: voice.beschikbaar ? 1.03 : 1 }}
                whileTap={{ scale: voice.beschikbaar ? 0.97 : 1 }}
                onClick={onSelect}
                disabled={!voice.beschikbaar}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  !voice.beschikbaar
                    ? 'bg-white/10 text-white backdrop-blur-sm border border-white/20'
                    : isSelected
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm'
                }`}
              >
                {!voice.beschikbaar ? (
                  <span className="flex items-center gap-2">
                    <CalendarDays size={14} />
                    Vanaf {formatDate(voice.availabilityText || '15 jan')}
                  </span>
                ) : isSelected ? (
                  <span className="font-semibold">Geselecteerd ✓</span>
                ) : (
                  'Boeken'
                )}
              </motion.button>
            </div>

            {/* Elegant Expandable Player */}
            <AnimatePresence>
              {showPlayer && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pt-2 space-y-3 border-t border-white/5">
                    {/* Demo Selector - Dots */}
                    <div className="flex justify-center gap-3">
                      {voice.demos.map((demo, index) => (
                        <button
                          key={demo.id}
                          onClick={() => {
                            setActiveDemo(index);
                            setProgress(0);
                          }}
                          className="group/demo flex flex-col items-center gap-1"
                        >
                          <div
                            className={`w-2 h-2 rounded-full transition-all ${
                              activeDemo === index
                                ? 'w-8 bg-white'
                                : 'bg-white/30 group-hover/demo:bg-white/50'
                            }`}
                          />
                          <span
                            className={`text-[10px] transition-opacity ${
                              activeDemo === index ? 'text-white/70' : 'text-white/0'
                            }`}
                          >
                            {demo.title}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Minimal Progress */}
                    <div className="relative h-0.5 bg-white/10 rounded-full mx-8">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-white/70 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
