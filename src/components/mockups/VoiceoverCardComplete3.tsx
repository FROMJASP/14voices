// Complete Mockup 3: Side-by-Side Layout
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ChevronRight, Mic, Clock } from 'lucide-react';
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

export function VoiceoverCardComplete3({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Move to next demo
            if (activeDemo < voice.demos.length - 1) {
              setActiveDemo(activeDemo + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 0.5;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying, activeDemo, voice.demos.length]);

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta`}>
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Profile Info */}
          <div className="md:w-2/5 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            {/* Profile Image */}
            <div className="w-32 h-32 mx-auto md:mx-0 rounded-2xl overflow-hidden mb-4 shadow-lg">
              {voice.profilePhoto ? (
                <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">{voice.name[0]}</span>
                </div>
              )}
            </div>

            {/* Name and Status */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{voice.name}</h3>

            <div className="flex items-center gap-2 mb-4">
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  voice.beschikbaar
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'}`}
                />
                {voice.beschikbaar ? 'Beschikbaar' : voice.availabilityText || 'Niet beschikbaar'}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1 mb-6">
              {voice.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <ChevronRight className="w-3 h-3" />
                  {tag}
                </div>
              ))}
            </div>

            {/* Book Button */}
            <motion.button
              whileHover={{ scale: voice.beschikbaar ? 1.05 : 1 }}
              whileTap={{ scale: voice.beschikbaar ? 0.95 : 1 }}
              onClick={onSelect}
              disabled={!voice.beschikbaar}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                !voice.beschikbaar
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : isSelected
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100'
              }`}
            >
              {!voice.beschikbaar ? 'Niet beschikbaar' : isSelected ? '✓ Geboekt' : 'Boeken'}
            </motion.button>
          </div>

          {/* Right Side - Audio Player */}
          <div className="md:w-3/5 p-6">
            <div className="h-full flex flex-col">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Demo&apos;s
              </h4>

              {/* Demo List with Players */}
              <div className="space-y-3 flex-1">
                {voice.demos.map((demo, index) => {
                  const isActive = activeDemo === index;
                  const demoProgress = isActive ? progress : 0;

                  return (
                    <motion.div
                      key={demo.id}
                      className={`p-4 rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gray-100 dark:bg-gray-700 shadow-sm'
                          : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => {
                        setActiveDemo(index);
                        setProgress(0);
                        setIsPlaying(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {/* Play Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isActive) {
                              setIsPlaying(!isPlaying);
                            } else {
                              setActiveDemo(index);
                              setProgress(0);
                              setIsPlaying(true);
                            }
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {isActive && isPlaying ? (
                            <Pause size={16} />
                          ) : (
                            <Play size={16} className="ml-0.5" />
                          )}
                        </motion.button>

                        {/* Demo Info and Progress */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`font-medium text-sm ${
                                isActive
                                  ? 'text-gray-900 dark:text-white'
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              {demo.title}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {demo.duration}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="relative h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <motion.div
                              className={`absolute inset-y-0 left-0 rounded-full ${
                                isActive
                                  ? 'bg-gray-900 dark:bg-white'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                              style={{ width: `${demoProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
