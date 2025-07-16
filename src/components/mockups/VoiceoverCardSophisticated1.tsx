// Sophisticated Design 1: Elegant Portrait with Floating Controls
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
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

export function VoiceoverCardSophisticated1({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300">
        {/* Portrait Image - 3:4 ratio for better grid display */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
          {voice.profilePhoto ? (
            <Image
              src={voice.profilePhoto}
              alt={voice.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Floating Player Controls */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4"
              >
                <div className="bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                    </motion.button>

                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                        {voice.demos[activeDemo].title}
                      </div>
                      <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-gray-900 dark:bg-white rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-plus-jakarta text-3xl font-bold text-white mb-2">{voice.name}</h3>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md text-xs font-medium ${
                voice.beschikbaar
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${voice.beschikbaar ? 'bg-green-400' : 'bg-red-400'}`}
              />
              {voice.beschikbaar ? 'Beschikbaar' : voice.availabilityText}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {voice.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-xs"
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
                className={`flex-1 py-1.5 text-xs font-medium transition-all ${
                  activeDemo === index
                    ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {demo.title}
              </button>
            ))}
          </div>

          {/* Book Button */}
          <motion.button
            whileHover={{ scale: voice.beschikbaar ? 1.02 : 1 }}
            whileTap={{ scale: voice.beschikbaar ? 0.98 : 1 }}
            onClick={onSelect}
            disabled={!voice.beschikbaar}
            className={`w-full py-3 rounded-md font-medium text-sm transition-all ${
              !voice.beschikbaar
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : isSelected
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100'
            }`}
          >
            {!voice.beschikbaar ? 'Niet beschikbaar' : isSelected ? 'Geboekt ✓' : 'Boeken'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
