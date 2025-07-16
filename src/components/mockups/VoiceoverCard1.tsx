// Mockup 1: Spotify-inspired Card Design
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, MoreVertical } from 'lucide-react';
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

export function VoiceoverCard1({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <motion.div
      className={`${plusJakarta.variable} font-plus-jakarta group relative`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 hover:bg-gray-800 dark:hover:bg-gray-900 transition-all cursor-pointer">
        {/* Album Cover Style Image */}
        <div className="relative aspect-square mb-4 rounded-md overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600">
          {voice.profilePhoto ? (
            <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/20 text-6xl font-bold">{voice.name[0]}</span>
            </div>
          )}

          {/* Play Button Overlay */}
          <motion.button
            className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-black" />
            ) : (
              <Play className="w-5 h-5 text-black ml-0.5" />
            )}
          </motion.button>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className="font-semibold text-white text-base truncate">{voice.name}</h3>
          <p className="text-sm text-gray-400">Voice Artist • {voice.demos.length} demos</p>
        </div>

        {/* More Options */}
        <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Select Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSelect}
        disabled={!voice.beschikbaar}
        className={`w-full mt-3 py-2.5 rounded-full font-medium text-sm transition-all ${
          !voice.beschikbaar
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : isSelected
              ? 'bg-green-500 text-black'
              : 'bg-white text-black hover:bg-gray-200'
        }`}
      >
        {!voice.beschikbaar ? 'Niet beschikbaar' : isSelected ? 'Geselecteerd' : 'Selecteren'}
      </motion.button>
    </motion.div>
  );
}
