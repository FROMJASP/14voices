// Mockup 5: Bento Box Design with Audio Waveform
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Award, PlayCircle } from 'lucide-react';
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

export function VoiceoverCard5({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [hoveredSection, setHoveredSection] = React.useState<string | null>(null);

  return (
    <motion.div
      className={`${plusJakarta.variable} font-plus-jakarta`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative grid grid-cols-2 gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-2xl">
        {/* Main Profile Section - Large */}
        <motion.div
          className="col-span-2 relative bg-white dark:bg-gray-800 rounded-xl p-6 overflow-hidden cursor-pointer"
          onHoverStart={() => setHoveredSection('profile')}
          onHoverEnd={() => setHoveredSection(null)}
          whileHover={{ scale: 1.02 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px)`,
              }}
            />
          </div>

          <div className="relative flex items-center gap-4">
            {/* Profile Image */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600 flex-shrink-0">
              {voice.profilePhoto ? (
                <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  {voice.name[0]}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {voice.name}
              </h3>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1 text-sm ${
                    voice.beschikbaar
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  {voice.beschikbaar ? 'Direct beschikbaar' : 'Momenteel bezet'}
                </span>
              </div>
            </div>

            {/* Animated Background Circle */}
            <motion.div
              className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"
              animate={{
                scale: hoveredSection === 'profile' ? 1.2 : 1,
              }}
            />
          </div>
        </motion.div>

        {/* Waveform Visualizer */}
        <motion.div
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onHoverStart={() => setHoveredSection('waveform')}
          onHoverEnd={() => setHoveredSection(null)}
        >
          <div className="flex items-center gap-1">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white/80 rounded-full"
                animate={{
                  height: hoveredSection === 'waveform' ? Math.random() * 24 + 8 : 16,
                }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.03,
                  repeat: hoveredSection === 'waveform' ? Infinity : 0,
                  repeatType: 'reverse',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-xs">Ervaring</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">10+ jaar</p>
        </motion.div>

        {/* Tags Section */}
        <motion.div
          className="col-span-2 bg-white dark:bg-gray-800 rounded-xl p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <PlayCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Stijlen</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {voice.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Action Section */}
        <motion.div
          className="col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 rounded-xl p-1"
          whileHover={{ scale: 1.02 }}
        >
          <button
            onClick={onSelect}
            disabled={!voice.beschikbaar}
            className={`w-full py-4 rounded-lg font-semibold transition-all ${
              !voice.beschikbaar
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : isSelected
                  ? 'bg-green-500 text-white'
                  : 'bg-transparent text-white dark:text-gray-900 hover:bg-white/10 dark:hover:bg-black/5'
            }`}
          >
            {!voice.beschikbaar
              ? 'Niet beschikbaar'
              : isSelected
                ? '✓ Geselecteerd'
                : 'Selecteer deze stem →'}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
