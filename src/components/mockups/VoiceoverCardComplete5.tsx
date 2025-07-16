// Complete Mockup 5: Minimal List Style
'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square } from 'lucide-react';
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

export function VoiceoverCardComplete5({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [expandedDemo, setExpandedDemo] = useState<number | null>(null);
  const [playingDemo, setPlayingDemo] = useState<number | null>(null);
  const [progress, setProgress] = useState<{ [key: number]: number }>({});
  const progressRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  React.useEffect(() => {
    if (playingDemo !== null) {
      const interval = setInterval(() => {
        setProgress((prev) => ({
          ...prev,
          [playingDemo]: Math.min((prev[playingDemo] || 0) + 1, 100),
        }));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [playingDemo]);

  const handleProgressClick = (demoIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setProgress((prev) => ({ ...prev, [demoIndex]: percentage }));
  };

  const togglePlay = (index: number) => {
    if (playingDemo === index) {
      setPlayingDemo(null);
    } else {
      setPlayingDemo(index);
      if (!progress[index]) {
        setProgress((prev) => ({ ...prev, [index]: 0 }));
      }
    }
  };

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta`}>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Main Row */}
        <div className="p-4 flex items-center gap-4">
          {/* Profile Image */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            {voice.profilePhoto ? (
              <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-lg font-bold">
                {voice.name[0]}
              </div>
            )}
          </div>

          {/* Name and Tags */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {voice.name}
              </h3>
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'}`}
              />
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {voice.tags.map((tag, index) => (
                <React.Fragment key={tag}>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{tag}</span>
                  {index < voice.tags.length - 1 && (
                    <span className="text-gray-400 dark:text-gray-600">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Book Button */}
          <motion.button
            whileHover={{ scale: voice.beschikbaar ? 1.05 : 1 }}
            whileTap={{ scale: voice.beschikbaar ? 0.95 : 1 }}
            onClick={onSelect}
            disabled={!voice.beschikbaar}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-all ${
              !voice.beschikbaar
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : isSelected
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100'
            }`}
          >
            {!voice.beschikbaar ? 'Bezet' : isSelected ? 'Geboekt' : 'Boeken'}
          </motion.button>
        </div>

        {/* Demos Section */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          {voice.demos.map((demo, index) => {
            const isExpanded = expandedDemo === index;
            const isPlaying = playingDemo === index;
            const demoProgress = progress[index] || 0;

            return (
              <div
                key={demo.id}
                className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                {/* Demo Header */}
                <div
                  className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => setExpandedDemo(isExpanded ? null : index)}
                >
                  {/* Play/Pause Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay(index);
                    }}
                    className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                  </motion.button>

                  {/* Demo Title */}
                  <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {demo.title}
                  </span>

                  {/* Duration */}
                  <span className="text-xs text-gray-500 dark:text-gray-400">{demo.duration}</span>

                  {/* Expand Indicator */}
                  <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} className="text-gray-400">
                    <Square size={12} />
                  </motion.div>
                </div>

                {/* Expanded Player */}
                <motion.div
                  initial={false}
                  animate={{ height: isExpanded ? 'auto' : 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-3">
                    {/* Progress Bar */}
                    <div
                      ref={(el) => {
                        if (el) progressRefs.current[index] = el;
                      }}
                      className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
                      onClick={(e) => handleProgressClick(index, e)}
                    >
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gray-900 dark:bg-white rounded-full"
                        style={{ width: `${demoProgress}%` }}
                      />
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 dark:bg-white rounded-full shadow-md"
                        style={{ left: `calc(${demoProgress}% - 6px)` }}
                      />
                    </div>

                    {/* Time Display */}
                    <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>0:00</span>
                      <span>{demo.duration}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
