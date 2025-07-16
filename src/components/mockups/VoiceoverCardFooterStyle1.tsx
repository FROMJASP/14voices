// Footer-Inspired Design 1: Clean with Full Photo
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ArrowRight } from 'lucide-react';
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

export function VoiceoverCardFooterStyle1({ voice, isSelected, onSelect }: VoiceoverCardProps) {
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
      <div className="relative bg-[#fcf9f5] dark:bg-gray-950 rounded-2xl overflow-hidden shadow-lg">
        {/* Large Profile Photo */}
        <div className="aspect-[4/3] relative overflow-hidden">
          {voice.profilePhoto ? (
            <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
          )}

          {/* Availability Badge */}
          <div
            className={`absolute top-4 left-4 px-3 py-1.5 rounded-full backdrop-blur-md text-sm font-medium ${
              voice.beschikbaar ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
            }`}
          >
            {voice.beschikbaar ? '• Beschikbaar' : voice.availabilityText || 'Niet beschikbaar'}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Name and Tags */}
          <h3 className="font-plus-jakarta text-3xl font-semibold mb-3 text-gray-900 dark:text-white">
            {voice.name}
          </h3>

          <div className="flex flex-wrap gap-2 mb-6">
            {voice.tags.map((tag) => (
              <span key={tag} className="text-sm text-gray-600 dark:text-gray-400">
                {tag} {voice.tags.indexOf(tag) < voice.tags.length - 1 && '•'}
              </span>
            ))}
          </div>

          {/* Demos */}
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              {voice.demos.map((demo, index) => (
                <button
                  key={demo.id}
                  onClick={() => {
                    setActiveDemo(index);
                    setProgress(0);
                    setIsPlaying(false);
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    activeDemo === index
                      ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {demo.title}
                </button>
              ))}
            </div>

            {/* Audio Player */}
            <div className="bg-white dark:bg-gray-900 rounded-full p-1 flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center flex-shrink-0"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </motion.button>

              <div className="flex-1 pr-4">
                <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gray-900 dark:bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                  <motion.div
                    className="absolute -top-1.5 w-4 h-4 bg-gray-900 dark:bg-white rounded-full shadow-lg"
                    style={{ left: `calc(${progress}% - 8px)` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{voice.demos[activeDemo].title}</span>
                  <span>{voice.demos[activeDemo].duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Book Button - Footer Style */}
          <motion.button
            whileHover={{ scale: voice.beschikbaar ? 1.02 : 1 }}
            whileTap={{ scale: voice.beschikbaar ? 0.98 : 1 }}
            onClick={onSelect}
            disabled={!voice.beschikbaar}
            className={`w-full relative overflow-hidden rounded-full text-base font-semibold transition-all ${
              !voice.beschikbaar
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed py-4'
                : isSelected
                  ? 'bg-green-600 text-white py-4'
                  : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 group'
            }`}
          >
            {!voice.beschikbaar ? (
              'Niet beschikbaar'
            ) : isSelected ? (
              '✓ Geboekt'
            ) : (
              <div className="relative py-4 px-6 flex items-center justify-between">
                <span>Boek {voice.name}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
