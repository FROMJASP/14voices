// Mockup 2: Glassmorphism Design
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Headphones, Star } from 'lucide-react';
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

export function VoiceoverCard2({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  return (
    <motion.div
      className={`${plusJakarta.variable} font-plus-jakarta relative`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        {voice.profilePhoto ? (
          <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Glassmorphic Card */}
      <div className="relative backdrop-blur-md bg-white/10 dark:bg-white/5 rounded-3xl p-6 border border-white/20 shadow-xl min-h-[400px] flex flex-col">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-white/90 text-sm ml-2">5.0</span>
        </div>

        {/* Name and Status */}
        <div className="flex-1">
          <h3 className="text-3xl font-bold text-white mb-2">{voice.name}</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm">{voice.demos.length} demos</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${voice.beschikbaar ? 'bg-green-400' : 'bg-red-400'}`}
              />
              <span className="text-white/70 text-sm">
                {voice.beschikbaar ? 'Available' : 'Busy'}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {voice.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs text-white/90 border border-white/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Play Demo Button */}
        <motion.button
          className="w-full py-3 bg-white/20 backdrop-blur rounded-2xl text-white font-medium hover:bg-white/30 transition-all border border-white/30 mb-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Headphones className="w-4 h-4" />
            Beluister Demo
          </div>
        </motion.button>

        {/* Select Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelect}
          disabled={!voice.beschikbaar}
          className={`w-full py-3 rounded-2xl font-medium transition-all ${
            !voice.beschikbaar
              ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
              : isSelected
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-900 hover:bg-gray-100'
          }`}
        >
          {!voice.beschikbaar
            ? 'Niet beschikbaar'
            : isSelected
              ? '✓ Geselecteerd'
              : 'Selecteer stem'}
        </motion.button>
      </div>
    </motion.div>
  );
}
