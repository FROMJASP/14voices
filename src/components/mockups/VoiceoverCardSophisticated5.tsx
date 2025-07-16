// Sophisticated Design 5: Luxury Minimal with Golden Ratio
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Mic, Star } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
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

export function VoiceoverCardSophisticated5({ voice, isSelected, onSelect }: VoiceoverCardProps) {
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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
        {/* Golden Ratio Layout - 3:4 aspect */}
        <div className="relative aspect-[3/4]">
          {/* Photo Section - Golden Ratio (approx 61.8%) */}
          <div className="relative h-[62%] overflow-hidden">
            {voice.profilePhoto ? (
              <Image
                src={voice.profilePhoto}
                alt={voice.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" />
            )}

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-gray-900/80 via-transparent to-transparent" />

            {/* Floating Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4"
            >
              <div
                className={`px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-2 ${
                  voice.beschikbaar
                    ? 'bg-white/90 dark:bg-black/90 text-gray-900 dark:text-white'
                    : 'bg-gray-900/90 dark:bg-gray-100/90 text-white dark:text-gray-900'
                }`}
              >
                <Star className="w-3 h-3" />
                <span className="text-xs font-medium">
                  {voice.beschikbaar ? 'Premium' : 'Bezet'}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Content Section - Remaining 38.2% */}
          <div className="absolute bottom-0 left-0 right-0 h-[38%] bg-white dark:bg-gray-900 p-5">
            {/* Name with Elegant Typography */}
            <h3 className="font-plus-jakarta text-2xl font-light text-gray-900 dark:text-white mb-3">
              {voice.name}
            </h3>

            {/* Tags - Minimal Style */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {voice.tags.map((tag, index) => (
                <span key={tag} className="text-xs text-gray-500 dark:text-gray-400">
                  {tag}
                  {index < voice.tags.length - 1 && ','}
                </span>
              ))}
            </div>

            {/* Integrated Player and Controls */}
            <div className="space-y-3">
              {/* Demo Selector - Dots Style */}
              <div className="flex items-center justify-center gap-2">
                {voice.demos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveDemo(index);
                      setProgress(0);
                      setIsPlaying(false);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      activeDemo === index
                        ? 'w-6 bg-gray-900 dark:bg-white'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>

              {/* Minimal Player Bar */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-gray-900 dark:text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-gray-900 dark:text-white ml-0.5" />
                  )}
                </motion.button>

                <div className="flex-1 cursor-pointer" onClick={handleProgressClick}>
                  <div className="relative h-0.5 bg-gray-200 dark:bg-gray-700">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gray-900 dark:bg-white"
                      style={{ width: `${progress}%` }}
                    />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-white rounded-full"
                      style={{ left: `calc(${progress}% - 4px)` }}
                    />
                  </div>
                </div>

                <Mic className="w-3 h-3 text-gray-400" />
              </div>

              {/* Elegant Book Button */}
              <motion.button
                whileHover={{ scale: voice.beschikbaar ? 1.02 : 1 }}
                whileTap={{ scale: voice.beschikbaar ? 0.98 : 1 }}
                onClick={onSelect}
                disabled={!voice.beschikbaar}
                className={`w-full py-2.5 rounded-full text-sm font-light tracking-wide transition-all ${
                  !voice.beschikbaar
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : isSelected
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'border border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900'
                }`}
              >
                {!voice.beschikbaar
                  ? voice.availabilityText
                  : isSelected
                    ? 'Geselecteerd'
                    : 'Selecteer'}
              </motion.button>
            </div>
          </div>

          {/* Luxury Detail Line */}
          <div className="absolute bottom-[38%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}
