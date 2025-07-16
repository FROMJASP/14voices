// Design 3 Improved V2: Floating Tag Cloud with Modern Progress
'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, PauseCircle, CalendarClock } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700', '800'],
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

export function VoiceoverCardDesign3ImprovedV2({
  voice,
  isSelected,
  onSelect,
}: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isPlaying && !isDragging) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isDragging]);

  const handlePlayClick = () => {
    if (!showPlayer) {
      setShowPlayer(true);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = progressRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setProgress(Math.max(0, Math.min(100, percentage)));
    }
  };

  return (
    <motion.div
      className={`${plusJakarta.variable} font-plus-jakarta group`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[3/4.5] rounded-xl overflow-hidden shadow-2xl bg-gray-900">
        {/* Full Image */}
        {voice.profilePhoto ? (
          <Image
            src={voice.profilePhoto}
            alt={voice.name}
            fill
            className="absolute inset-0 object-cover filter grayscale contrast-110"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Availability Badge - Top */}
        {!voice.beschikbaar && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-4 left-4 right-4"
          >
            <div className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center justify-center gap-2 shadow-lg">
              <CalendarClock size={16} className="text-white" />
              <span className="text-white text-sm font-medium">
                Beschikbaar op: {voice.availabilityText || '15 januari'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Green Dot for Available */}
        {voice.beschikbaar && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-4 right-4 w-4 h-4 rounded-full bg-green-500 shadow-lg"
          />
        )}

        {/* Floating Tag Cloud */}
        <div className="absolute top-20 left-6 right-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {voice.tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-xs text-white border border-white/30 shadow-lg"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Name */}
          <div className="px-6 pb-4">
            <h1 className="font-plus-jakarta text-[4rem] leading-[0.85] font-extrabold text-white drop-shadow-2xl">
              {voice.name}
            </h1>
          </div>

          {/* Modern Glass Control */}
          <div className="bg-white/10 backdrop-blur-2xl border-t border-white/20">
            <div className="p-5">
              <div className="flex items-center justify-between">
                {/* Modern Play Button */}
                <motion.button
                  onClick={handlePlayClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3"
                >
                  {isPlaying ? (
                    <PauseCircle size={48} className="text-white" strokeWidth={1.5} />
                  ) : (
                    <PlayCircle size={48} className="text-white" strokeWidth={1.5} />
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">
                      {showPlayer ? voice.demos[activeDemo].title : 'Play Demo'}
                    </p>
                    <p className="text-white/60 text-xs">{voice.demos[activeDemo].duration}</p>
                  </div>
                </motion.button>

                {/* Action Button */}
                {voice.beschikbaar && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSelect}
                    className={`px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-lg ${
                      isSelected
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {isSelected ? 'Ga verder →' : 'Boeken'}
                  </motion.button>
                )}
              </div>

              {/* Expandable Advanced Player */}
              <AnimatePresence>
                {showPlayer && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    {/* Demo Selector Tabs */}
                    <div className="flex bg-white/5 rounded-lg p-1 mb-4">
                      {voice.demos.map((demo, index) => (
                        <button
                          key={demo.id}
                          onClick={() => {
                            setActiveDemo(index);
                            setProgress(0);
                          }}
                          className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${
                            activeDemo === index
                              ? 'bg-white/20 text-white shadow-sm'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
                          {demo.title}
                        </button>
                      ))}
                    </div>

                    {/* Advanced Progress Bar */}
                    <div className="space-y-2">
                      <div
                        ref={progressRef}
                        className="relative h-3 bg-white/10 rounded-full cursor-pointer overflow-hidden"
                        onClick={handleProgressChange}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseMove={(e) => isDragging && handleProgressChange(e)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                      >
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/80 to-white rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-xl hover:scale-110 transition-transform cursor-grab active:cursor-grabbing"
                          style={{ left: `calc(${progress}% - 10px)` }}
                          whileHover={{ scale: 1.2 }}
                        />
                      </div>

                      {/* Time Labels */}
                      <div className="flex justify-between text-xs text-white/70">
                        <span>0:00</span>
                        <span>{voice.demos[activeDemo].duration}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
