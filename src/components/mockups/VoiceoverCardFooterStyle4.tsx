// Footer-Inspired Design 4: Round Photo with Clean Layout
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ChevronRight } from 'lucide-react';
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

export function VoiceoverCardFooterStyle4({ voice, isSelected, onSelect }: VoiceoverCardProps) {
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
    <div className={`${plusJakarta.variable} font-plus-jakarta`}>
      <div className="relative bg-[#fcf9f5] dark:bg-gray-950 p-8 rounded-lg">
        {/* Top Section with Photo */}
        <div className="text-center mb-8">
          {/* Large Round Photo */}
          <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-gray-200 dark:ring-gray-800">
            {voice.profilePhoto ? (
              <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
            )}
          </div>

          {/* Name and Status */}
          <h2 className="font-plus-jakarta text-4xl font-semibold mb-2 text-gray-900 dark:text-white">
            {voice.name}
          </h2>

          <div
            className={`inline-flex items-center gap-2 text-sm font-medium ${
              voice.beschikbaar
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'}`}
            />
            {voice.beschikbaar
              ? 'Beschikbaar voor projecten'
              : voice.availabilityText || 'Momenteel niet beschikbaar'}
          </div>
        </div>

        {/* Tags - Centered */}
        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {voice.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Audio Section */}
        <div className="max-w-md mx-auto space-y-4 mb-8">
          {/* Demo Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {voice.demos.map((demo, index) => (
              <button
                key={demo.id}
                onClick={() => {
                  setActiveDemo(index);
                  setProgress(0);
                  setIsPlaying(false);
                }}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeDemo === index
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {demo.title}
              </button>
            ))}
          </div>

          {/* Player */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center shadow-lg"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </motion.button>

              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {voice.demos[activeDemo].title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {voice.demos[activeDemo].duration}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-white rounded-full"
                style={{ width: `${progress}%` }}
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-900 dark:bg-white rounded-full shadow-lg ring-2 ring-white dark:ring-gray-900"
                style={{ left: `calc(${progress}% - 10px)` }}
              />
            </div>
          </div>
        </div>

        {/* Book Button */}
        <div className="max-w-sm mx-auto">
          <motion.button
            whileHover={{ scale: voice.beschikbaar ? 1.02 : 1 }}
            whileTap={{ scale: voice.beschikbaar ? 0.98 : 1 }}
            onClick={onSelect}
            disabled={!voice.beschikbaar}
            className={`w-full py-4 rounded-full font-semibold transition-all group ${
              !voice.beschikbaar
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isSelected
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {!voice.beschikbaar ? (
                'Niet beschikbaar'
              ) : isSelected ? (
                <>
                  <span>✓</span>
                  <span>Stem geboekt</span>
                </>
              ) : (
                <>
                  <span>Boek {voice.name}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
