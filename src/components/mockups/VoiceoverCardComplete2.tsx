// Complete Mockup 2: Compact Professional Design
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';
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

export function VoiceoverCardComplete2({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  React.useEffect(() => {
    if (isPlaying && !isDragging) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isDragging]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setProgress(percentage);
  };

  const nextDemo = () => {
    setActiveDemo((prev) => (prev + 1) % voice.demos.length);
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta`}>
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {/* Header Row */}
          <div className="flex items-start gap-4 mb-4">
            {/* Profile Image */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
              {voice.profilePhoto ? (
                <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                  {voice.name[0]}
                </div>
              )}
            </div>

            {/* Name and Status */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{voice.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-2 h-2 rounded-full ${voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'}`}
                />
                <span
                  className={`text-sm ${voice.beschikbaar ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                >
                  {voice.beschikbaar ? 'Beschikbaar' : voice.availabilityText || 'Niet beschikbaar'}
                </span>
              </div>
            </div>

            {/* Book Button */}
            <motion.button
              whileHover={{ scale: voice.beschikbaar ? 1.05 : 1 }}
              whileTap={{ scale: voice.beschikbaar ? 0.95 : 1 }}
              onClick={onSelect}
              disabled={!voice.beschikbaar}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
                !voice.beschikbaar
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : isSelected
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100'
              }`}
            >
              {!voice.beschikbaar ? 'Bezet' : isSelected ? 'Geboekt ✓' : 'Boeken'}
            </motion.button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {voice.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Integrated Audio Player */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
            {/* Currently Playing */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {voice.demos[activeDemo].title}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {voice.demos[activeDemo].duration}
              </span>
            </div>

            {/* Progress Bar */}
            <div
              className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 cursor-pointer"
              onClick={handleProgressClick}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
            >
              <motion.div
                className="absolute inset-y-0 left-0 bg-gray-900 dark:bg-white rounded-full"
                style={{ width: `${progress}%` }}
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 dark:bg-white rounded-full shadow-md"
                style={{ left: `calc(${progress}% - 6px)` }}
                whileHover={{ scale: 1.2 }}
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              {/* Play Controls */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center"
                >
                  <AnimatePresence mode="wait">
                    {isPlaying ? (
                      <motion.div
                        key="pause"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Pause size={16} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Play size={16} className="ml-0.5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <button
                  onClick={nextDemo}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <SkipForward size={16} />
                </button>
              </div>

              {/* Demo Pills */}
              <div className="flex items-center gap-1">
                {voice.demos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveDemo(index);
                      setProgress(0);
                      setIsPlaying(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeDemo === index
                        ? 'w-6 bg-gray-900 dark:bg-white'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
