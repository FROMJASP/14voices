'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ArrowLeft, Play, Pause, Calendar, Check, ChevronRight, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useVoiceover, scrollToPriceCalculator } from '@/contexts/VoiceoverContext';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface VoiceoverData {
  id: string;
  name: string;
  slug: string;
  tags: string[];
  color: string;
  beschikbaar: boolean;
  availabilityText: string;
  demos: Array<{
    id: string;
    title: string;
    url: string;
    duration: string;
  }>;
  profilePhoto?: string | null;
  description?: string;
  cohort?: {
    name: string;
    color: string;
  } | null;
}

interface VoiceoverDetailClientNewProps {
  voiceover: VoiceoverData;
}

export function VoiceoverDetailClientNew({ voiceover }: VoiceoverDetailClientNewProps) {
  const { selectedVoiceover, setSelectedVoiceover } = useVoiceover();
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const isSelected = selectedVoiceover?.id === voiceover.id;

  // Initialize audio
  React.useEffect(() => {
    if (voiceover.demos.length > 0) {
      audioRef.current = new Audio(voiceover.demos[activeDemo].url);
      audioRef.current.addEventListener('loadedmetadata', () => {
        // Audio loaded
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeDemo, voiceover.demos]);

  // Update progress smoothly
  React.useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current && isPlaying && !isDragging) {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(currentProgress);
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    };

    if (isPlaying && !isDragging) {
      animationRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isDragging]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const rect = progressRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setProgress(percentage);

      const newTime = (percentage / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleProgressClick(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDemoChange = (index: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = voiceover.demos[index].url;
      setIsPlaying(false);
      setProgress(0);
    }
    setActiveDemo(index);
  };

  const handleSelectVoiceover = () => {
    setSelectedVoiceover({
      id: voiceover.id,
      name: voiceover.name,
      profilePhoto: voiceover.profilePhoto || undefined,
      styleTags: voiceover.tags,
    });
    scrollToPriceCalculator();
  };

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta`}>
      {/* Hero Section with Full Image Background */}
      <section className="relative min-h-[calc(100vh-4rem)] bg-black overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {voiceover.profilePhoto ? (
            <>
              <Image
                src={voiceover.profilePhoto}
                alt={voiceover.name}
                fill
                className="object-cover filter grayscale brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <User className="w-96 h-96 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="relative z-20 container mx-auto px-4 pt-8">
          <Link
            href="/#voiceovers"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Terug naar overzicht</span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 flex items-end min-h-[calc(100vh-4rem)] pb-20">
          <div className="grid lg:grid-cols-2 gap-12 w-full items-end">
            {/* Left Column - Info */}
            <div>
              {/* Availability Badge */}
              {!voiceover.beschikbaar && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 bg-amber-600/90 backdrop-blur-sm rounded-full px-5 py-2.5 mb-6"
                >
                  <Calendar size={16} className="text-white" />
                  <span className="text-white font-medium">
                    Beschikbaar vanaf {voiceover.availabilityText}
                  </span>
                </motion.div>
              )}

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-6"
              >
                {voiceover.name}
              </motion.h1>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                {voiceover.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 border border-white/20 font-medium text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              {/* Description */}
              {voiceover.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-white/80 leading-relaxed mb-8 max-w-2xl"
                >
                  {voiceover.description}
                </motion.p>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{ scale: voiceover.beschikbaar ? 1.05 : 1 }}
                  whileTap={{ scale: voiceover.beschikbaar ? 0.95 : 1 }}
                  onClick={handleSelectVoiceover}
                  disabled={!voiceover.beschikbaar}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center gap-3 ${
                    !voiceover.beschikbaar
                      ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed backdrop-blur-sm'
                      : isSelected
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                        : 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                  }`}
                >
                  {isSelected && <Check className="w-5 h-5" />}
                  {!voiceover.beschikbaar
                    ? 'Niet beschikbaar'
                    : isSelected
                      ? 'Ga verder'
                      : 'Selecteer voor project'}
                  {voiceover.beschikbaar && (
                    <ChevronRight
                      className={`w-5 h-5 transition-transform ${isSelected ? 'translate-x-1' : ''}`}
                    />
                  )}
                </motion.button>

                {voiceover.beschikbaar && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-white/70 text-sm">Direct beschikbaar</span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Audio Player */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Demo&apos;s beluisteren</h2>

                {/* Demo Selector */}
                <div className="grid grid-cols-3 gap-2 mb-8">
                  {voiceover.demos.map((demo, index) => (
                    <button
                      key={demo.id}
                      onClick={() => handleDemoChange(index)}
                      className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                        activeDemo === index
                          ? 'bg-white text-gray-900'
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {demo.title}
                    </button>
                  ))}
                </div>

                {/* Current Demo Info */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {voiceover.demos[activeDemo]?.title || 'Demo'}
                    </h3>
                    <p className="text-white/50 text-sm">
                      Duur: {voiceover.demos[activeDemo]?.duration || '0:00'}
                    </p>
                  </div>

                  {/* Play Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePlayPause}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    {isPlaying ? (
                      <Pause size={24} className="text-gray-900" />
                    ) : (
                      <Play size={24} className="text-gray-900 ml-1" />
                    )}
                  </motion.button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div
                    ref={progressRef}
                    className="relative h-2 bg-white/20 rounded-full cursor-pointer group"
                    onClick={handleProgressClick}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-white rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                      style={{ left: `calc(${progress}% - 10px)` }}
                    />
                  </div>

                  {/* Time Display */}
                  <div className="flex justify-between text-sm text-white/60">
                    <span>
                      {audioRef.current
                        ? `${Math.floor(((progress / 100) * audioRef.current.duration) / 60)}:${String(Math.floor(((progress / 100) * audioRef.current.duration) % 60)).padStart(2, '0')}`
                        : '0:00'}
                    </span>
                    <span>{voiceover.demos[activeDemo]?.duration || '0:00'}</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-white/60 text-sm">
                    {voiceover.demos.length} demo&apos;s beschikbaar • Direct te boeken
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="bg-[#fcf9f5] dark:bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Waarom {voiceover.name} kiezen?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
              {voiceover.name} brengt jouw project tot leven met een unieke stem die perfect past
              bij jouw merk. Van commercials tot documentaires, {voiceover.name} heeft de ervaring
              en het talent om jouw boodschap krachtig over te brengen.
            </p>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white dark:text-gray-900" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Professionele kwaliteit</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Studio-opnames van de hoogste kwaliteit
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white dark:text-gray-900" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Snelle levering</h3>
                <p className="text-gray-600 dark:text-gray-400">Binnen 24-48 uur geleverd</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChevronRight className="w-8 h-8 text-white dark:text-gray-900" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Flexibele aanpassing</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Revisies mogelijk voor het perfecte resultaat
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
