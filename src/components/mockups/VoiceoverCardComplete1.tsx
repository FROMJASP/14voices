// Complete Mockup 1: Clean Modern Card with Full Audio Controls
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, User } from 'lucide-react';
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

export function VoiceoverCardComplete1({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulate progress for demo
  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta`}>
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header with Image and Info */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 relative">
            {voice.profilePhoto ? (
              <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-24 h-24 text-white/30" />
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Name and Availability */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-3xl font-bold text-white mb-2">{voice.name}</h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${voice.beschikbaar ? 'bg-green-400' : 'bg-red-400'}`}
                />
                <span className="text-white/90 text-sm">
                  {voice.beschikbaar ? 'Beschikbaar' : voice.availabilityText || 'Niet beschikbaar'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {voice.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Demo Selector */}
          <div className="mb-4">
            <div className="flex gap-2 mb-3">
              {voice.demos.map((demo, index) => (
                <button
                  key={demo.id}
                  onClick={() => {
                    setActiveDemo(index);
                    setIsPlaying(false);
                    setProgress(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeDemo === index
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {demo.title}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Player */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Play/Pause Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </motion.button>

              {/* Progress and Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {voice.demos[activeDemo].title}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    0:00 / {voice.demos[activeDemo].duration}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gray-900 dark:bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                  {/* Playhead */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 dark:bg-white rounded-full shadow-lg"
                    style={{ left: `calc(${progress}% - 8px)` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Book Button */}
          <motion.button
            whileHover={{ scale: voice.beschikbaar ? 1.02 : 1 }}
            whileTap={{ scale: voice.beschikbaar ? 0.98 : 1 }}
            onClick={onSelect}
            disabled={!voice.beschikbaar}
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
              !voice.beschikbaar
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : isSelected
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100'
            }`}
          >
            {!voice.beschikbaar ? 'Niet beschikbaar' : isSelected ? '✓ Geboekt' : 'Boeken'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
