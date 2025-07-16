// Glassmorphic V3 Improved 4: Gradient Glass with Tag Carousel
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Clock } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';

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
    profilePhoto?: string | null;
    tags: string[];
    beschikbaar: boolean;
    availabilityText?: string;
    demos: Demo[];
  };
  isSelected: boolean;
  onSelect: () => void;
}

export function VoiceoverCardGlassmorphicV3Improved4({
  voice,
  isSelected,
  onSelect,
}: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentTagIndex, setCurrentTagIndex] = useState(0);

  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Carousel for tags
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagIndex((prev) => (prev + 1) % voice.tags.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [voice.tags.length]);

  const handlePlayClick = () => {
    if (!showPlayer) {
      setShowPlayer(true);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      className={`${plusJakarta.variable} font-plus-jakarta group`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl">
        {/* Full Image */}
        {voice.profilePhoto ? (
          <Image
            src={voice.profilePhoto}
            alt={voice.name}
            fill
            className="absolute inset-0 object-cover filter grayscale"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-600 to-gray-800" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/90" />

        {/* Animated Status Dot */}
        <div className="absolute top-4 right-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-4 h-4 rounded-full ${
              voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'
            } shadow-lg`}
          />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Name and Tag Carousel */}
          <div className="px-5 pb-4">
            <h1 className="font-plus-jakarta text-[4rem] leading-[0.85] font-extrabold text-white mb-3">
              {voice.name}
            </h1>

            {/* Tag Carousel */}
            <div className="h-6 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTagIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute text-white/70 text-sm"
                >
                  {voice.tags[currentTagIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Gradient Glass Bar */}
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border-t border-white/20">
            <div className="p-4 flex items-center justify-between">
              {/* Play Button with Label */}
              <motion.button
                onClick={handlePlayClick}
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                    {isPlaying ? (
                      <Pause size={20} className="text-white" />
                    ) : (
                      <Play size={20} className="text-white ml-0.5" />
                    )}
                  </div>
                  {/* Pulse Effect */}
                  {isPlaying && (
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                  )}
                </div>
                <span className="text-white text-sm font-medium">
                  {showPlayer ? voice.demos[activeDemo].title : 'Demo afspelen'}
                </span>
              </motion.button>

              {/* Book Button with Better Contrast */}
              <motion.button
                whileHover={{ scale: voice.beschikbaar ? 1.05 : 1 }}
                whileTap={{ scale: voice.beschikbaar ? 0.95 : 1 }}
                onClick={onSelect}
                disabled={!voice.beschikbaar}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  !voice.beschikbaar
                    ? 'bg-gray-900/80 text-white border border-white/20 backdrop-blur-sm'
                    : isSelected
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                      : 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                }`}
              >
                {!voice.beschikbaar ? (
                  <span className="flex items-center gap-2">
                    <Clock size={14} />
                    Vanaf {voice.availabilityText || '15 jan'}
                  </span>
                ) : isSelected ? (
                  'Geselecteerd ✓'
                ) : (
                  'Boeken'
                )}
              </motion.button>
            </div>

            {/* Expandable Player Section */}
            <AnimatePresence>
              {showPlayer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/10"
                >
                  <div className="p-4 space-y-3">
                    {/* Demo Pills */}
                    <div className="flex gap-1.5">
                      {voice.demos.map((demo, index) => (
                        <button
                          key={demo.id}
                          onClick={() => {
                            setActiveDemo(index);
                            setProgress(0);
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeDemo === index
                              ? 'bg-gradient-to-r from-white/20 to-white/10 text-white'
                              : 'text-white/50 hover:text-white/80'
                          }`}
                        >
                          {demo.title}
                        </button>
                      ))}
                    </div>

                    {/* Gradient Progress Bar */}
                    <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/80 to-white rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
                        style={{ left: `calc(${progress}% - 6px)` }}
                      />
                    </div>

                    {/* Duration */}
                    <div className="text-center text-xs text-white/50">
                      {voice.demos[activeDemo].duration}
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
