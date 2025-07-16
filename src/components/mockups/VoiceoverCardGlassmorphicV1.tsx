// Glassmorphic Variation 1: Large Typography with Bottom Glass Panel
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700'],
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

export function VoiceoverCardGlassmorphicV1({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setProgress(percentage);
  };

  return (
    <motion.div
      className={`${plusJakarta.variable} font-plus-jakarta group`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-xl">
        {/* Black and White Background Image */}
        {voice.profilePhoto ? (
          <Image
            src={voice.profilePhoto}
            alt={voice.name}
            fill
            className="absolute inset-0 object-cover filter grayscale contrast-125"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-600 to-gray-800" />
        )}

        {/* Subtle gradient for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

        {/* Large Typography Overlay - Like Design 4 */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 px-6">
          <h1 className="font-plus-jakarta text-7xl font-bold leading-none text-white mix-blend-difference">
            {voice.name}
          </h1>
        </div>

        {/* Availability Dot - Top Right */}
        <div className="absolute top-4 right-4">
          <div
            className={`w-3 h-3 rounded-full ${
              voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'
            } shadow-lg`}
          />
        </div>

        {/* Bottom Glass Panel */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {voice.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-white/10 backdrop-blur-sm text-white/80 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Demo Selector */}
            <div className="flex gap-1 mb-3">
              {voice.demos.map((demo, index) => (
                <button
                  key={demo.id}
                  onClick={() => {
                    setActiveDemo(index);
                    setProgress(0);
                    setIsPlaying(false);
                  }}
                  className={`flex-1 py-1 text-xs font-medium transition-all rounded ${
                    activeDemo === index
                      ? 'bg-white/20 text-white'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  {demo.title}
                </button>
              ))}
            </div>

            {/* Player Controls */}
            <div className="flex items-center gap-3 mb-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </motion.button>

              <div className="flex-1">
                <div
                  className="relative h-1 bg-white/20 rounded-full cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
                    style={{ left: `calc(${progress}% - 6px)` }}
                  />
                </div>
              </div>

              <span className="text-xs text-white/60">{voice.demos[activeDemo].duration}</span>
            </div>

            {/* Book Button */}
            <motion.button
              whileHover={{ scale: voice.beschikbaar ? 1.02 : 1 }}
              whileTap={{ scale: voice.beschikbaar ? 0.98 : 1 }}
              onClick={onSelect}
              disabled={!voice.beschikbaar}
              className={`w-full py-2 rounded-md font-medium text-xs transition-all ${
                !voice.beschikbaar
                  ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                  : isSelected
                    ? 'bg-green-500/80 text-white'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              {!voice.beschikbaar
                ? 'Niet beschikbaar'
                : isSelected
                  ? 'Geboekt ✓'
                  : 'Boek deze stem'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
