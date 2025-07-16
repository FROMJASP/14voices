// Mockup 3: Minimalist Business Card Design
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Circle, CheckCircle } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface VoiceoverCardProps {
  voice: {
    id: string;
    name: string;
    profilePhoto?: string | null;
    tags: string[];
    beschikbaar: boolean;
    demos: Array<{ url: string; title: string }>;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export function VoiceoverCard3({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={`${plusJakarta.variable} font-plus-jakarta`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative bg-white dark:bg-gray-900 rounded-sm shadow-sm hover:shadow-lg transition-all p-8 border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Small Profile Image */}
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
              {voice.profilePhoto ? (
                <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{voice.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Professional Voice Artist
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              voice.beschikbaar
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}
          >
            {voice.beschikbaar ? 'Available' : 'Busy'}
          </div>
        </div>

        {/* Minimalist Audio Visualizer */}
        <div className="flex items-center justify-center gap-1 my-8 h-16">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-gray-300 dark:bg-gray-600 rounded-full"
              animate={{
                height: isHovered ? Math.random() * 48 + 16 : 24,
              }}
              transition={{
                duration: 0.3,
                delay: i * 0.02,
                repeat: isHovered ? Infinity : 0,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>

        {/* Tags - Simple Text */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Specialties: {voice.tags.join(' • ')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
            Listen to Demos
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onSelect}
            disabled={!voice.beschikbaar}
            className={`flex-1 py-2.5 rounded font-medium text-sm transition-all flex items-center justify-center gap-2 ${
              !voice.beschikbaar
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : isSelected
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
            }`}
          >
            {isSelected ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Selected
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                Select
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
