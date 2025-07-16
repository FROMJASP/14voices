// Glassmorphic Variation 2: Side Glass Panel
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

export function VoiceoverCardGlassmorphicV2({ voice, isSelected, onSelect }: VoiceoverCardProps) {
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

  return (
    <motion.div
      className={`${plusJakarta.variable} font-plus-jakarta group`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-xl">
        {/* Full Black and White Image */}
        {voice.profilePhoto ? (
          <Image
            src={voice.profilePhoto}
            alt={voice.name}
            fill
            className="absolute inset-0 object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-600 to-gray-800" />
        )}

        {/* Large Name Typography - Bottom Left */}
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="font-plus-jakarta text-6xl font-bold leading-none text-white drop-shadow-2xl">
            {voice.name}
          </h1>
        </div>

        {/* Status Dot */}
        <motion.div
          animate={{
            scale: voice.beschikbaar ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: voice.beschikbaar ? Infinity : 0,
            repeatType: 'reverse',
          }}
          className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
            voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'
          } shadow-lg`}
        />

        {/* Right Side Glass Panel - Appears on Hover */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-2/3"
          initial={{ x: '100%' }}
          whileHover={{ x: 0 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <div className="h-full bg-black/20 backdrop-blur-md border-l border-white/20 p-4 flex flex-col justify-center">
            {/* Tags */}
            <div className="space-y-1 mb-4">
              {voice.tags.map((tag) => (
                <div key={tag} className="text-white/80 text-xs">
                  • {tag}
                </div>
              ))}
            </div>

            {/* Demos */}
            <div className="space-y-2 mb-4">
              {voice.demos.map((demo, index) => (
                <button
                  key={demo.id}
                  onClick={() => {
                    setActiveDemo(index);
                    setProgress(0);
                    setIsPlaying(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded text-xs transition-all ${
                    activeDemo === index
                      ? 'bg-white/20 text-white'
                      : 'text-white/60 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  {demo.title} • {demo.duration}
                </button>
              ))}
            </div>

            {/* Mini Player */}
            <div className="flex items-center gap-2 mb-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-900"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </motion.button>

              <div className="flex-1">
                <div className="relative h-1 bg-white/20 rounded-full">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Book Button */}
            <motion.button
              whileHover={{ scale: voice.beschikbaar ? 1.05 : 1 }}
              whileTap={{ scale: voice.beschikbaar ? 0.95 : 1 }}
              onClick={onSelect}
              disabled={!voice.beschikbaar}
              className={`w-full py-2 rounded-md font-medium text-xs transition-all ${
                !voice.beschikbaar
                  ? 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                  : isSelected
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              {!voice.beschikbaar ? 'Niet beschikbaar' : isSelected ? 'Geboekt ✓' : 'Boeken'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
