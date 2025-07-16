// Complete Mockup 4: Tabbed Interface Design
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, User, Calendar, Music } from 'lucide-react';
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

export function VoiceoverCardComplete4({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'demos'>('info');
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setProgress(percentage);
  };

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta`}>
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Header with Profile */}
        <div className="relative h-32 bg-gradient-to-r from-purple-600 to-pink-600">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>

          {/* Profile Image */}
          <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
            {voice.profilePhoto ? (
              <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          {/* Book Button */}
          <motion.button
            whileHover={{ scale: voice.beschikbaar ? 1.05 : 1 }}
            whileTap={{ scale: voice.beschikbaar ? 0.95 : 1 }}
            onClick={onSelect}
            disabled={!voice.beschikbaar}
            className={`absolute bottom-4 right-4 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              !voice.beschikbaar
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isSelected
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
            }`}
          >
            {!voice.beschikbaar ? 'Bezet' : isSelected ? '✓ Geboekt' : 'Boeken'}
          </motion.button>
        </div>

        {/* Name and Status */}
        <div className="px-6 pt-16 pb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{voice.name}</h3>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span
              className={`text-sm font-medium ${
                voice.beschikbaar
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {voice.beschikbaar
                ? 'Direct beschikbaar'
                : voice.availabilityText || 'Niet beschikbaar'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 font-medium text-sm transition-all relative ${
                activeTab === 'info'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Info
              {activeTab === 'info' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('demos')}
              className={`px-4 py-2 font-medium text-sm transition-all relative flex items-center gap-2 ${
                activeTab === 'demos'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Music className="w-4 h-4" />
              Demo&apos;s ({voice.demos.length})
              {activeTab === 'demos' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
                />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'info' ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Stijlen
                </h4>
                <div className="flex flex-wrap gap-2">
                  {voice.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="demos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Demo Selector */}
                <div className="flex gap-2">
                  {voice.demos.map((demo, index) => (
                    <button
                      key={demo.id}
                      onClick={() => {
                        setActiveDemo(index);
                        setProgress(0);
                        setIsPlaying(false);
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        activeDemo === index
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {demo.title}
                    </button>
                  ))}
                </div>

                {/* Audio Player */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center shadow-lg"
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                    </motion.button>

                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {voice.demos[activeDemo].title}
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Duration: {voice.demos[activeDemo].duration}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar with Playhead */}
                  <div
                    className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
                    onClick={handleSeek}
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gray-900 dark:bg-white rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 dark:bg-white rounded-full shadow-lg border-2 border-white dark:border-gray-900"
                      style={{ left: `calc(${progress}% - 8px)` }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0}
                      onDrag={(_, info) => {
                        const rect = (info.point.x / window.innerWidth) * 100;
                        setProgress(Math.max(0, Math.min(100, rect)));
                      }}
                    />
                  </div>

                  {/* Time Display */}
                  <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{Math.floor((progress / 100) * 90)}s</span>
                    <span>{voice.demos[activeDemo].duration}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
