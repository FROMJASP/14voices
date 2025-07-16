'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { User, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getTagColor } from '@/lib/voiceover-utils';
import { useVoiceover, scrollToPriceCalculator } from '@/contexts/VoiceoverContext';
import { BeautifulAudioPlayer } from './BeautifulAudioPlayer';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700'],
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

interface VoiceoverDetailClientProps {
  voiceover: VoiceoverData;
}

export function VoiceoverDetailClient({ voiceover }: VoiceoverDetailClientProps) {
  const { selectedVoiceover, setSelectedVoiceover } = useVoiceover();

  const handleSelectVoiceover = () => {
    setSelectedVoiceover({
      id: voiceover.id,
      name: voiceover.name,
      profilePhoto: voiceover.profilePhoto || undefined,
      styleTags: voiceover.tags,
    });
    scrollToPriceCalculator();
  };

  const isSelected = selectedVoiceover?.id === voiceover.id;

  return (
    <section
      className={`py-20 bg-[#fcf9f5] dark:bg-gray-900 text-gray-900 dark:text-white ${plusJakarta.variable}`}
    >
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/#voiceovers"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-plus-jakarta">Terug naar overzicht</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Profile */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden mb-8">
              <div className={`absolute inset-0 bg-gradient-to-br ${voiceover.color} opacity-80`} />
              {voiceover.profilePhoto ? (
                <Image
                  src={voiceover.profilePhoto}
                  alt={voiceover.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <User className="w-48 h-48 text-white/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Availability Badge */}
              {!voiceover.beschikbaar && (
                <div className="absolute top-6 left-6 px-4 py-2 bg-red-500/90 backdrop-blur rounded-full">
                  <span className="font-plus-jakarta text-sm font-semibold text-white">
                    {voiceover.availabilityText}
                  </span>
                </div>
              )}
            </div>

            {/* Name and Status */}
            <h1 className="font-plus-jakarta text-5xl font-bold mb-4">{voiceover.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-3 h-3 rounded-full ${voiceover.beschikbaar ? 'bg-green-400' : 'bg-red-400'}`}
              />
              <span className="font-plus-jakarta text-lg text-gray-700 dark:text-gray-300">
                {voiceover.beschikbaar ? 'Beschikbaar voor projecten' : voiceover.availabilityText}
              </span>
            </div>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-8">
              {voiceover.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-4 py-2 rounded-full text-sm font-plus-jakarta transition-all bg-gradient-to-r ${getTagColor(tag)} text-white`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            {voiceover.description && (
              <p className="font-plus-jakarta text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                {voiceover.description}
              </p>
            )}

            {/* Select Button */}
            <motion.button
              whileHover={{ scale: voiceover.beschikbaar ? 1.02 : 1 }}
              whileTap={{ scale: voiceover.beschikbaar ? 0.98 : 1 }}
              onClick={handleSelectVoiceover}
              disabled={!voiceover.beschikbaar}
              className={`w-full lg:w-auto px-8 py-4 rounded-xl font-plus-jakarta font-semibold text-lg transition-all flex items-center justify-center gap-3 shadow-md ${
                !voiceover.beschikbaar
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isSelected
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100'
              }`}
            >
              {isSelected && <Check className="w-5 h-5" />}
              {!voiceover.beschikbaar
                ? 'Niet beschikbaar'
                : isSelected
                  ? 'Geselecteerd'
                  : `Selecteer ${voiceover.name}`}
            </motion.button>
          </div>

          {/* Right Column - Demos */}
          <div>
            <h2 className="font-plus-jakarta text-3xl font-bold mb-8">Demo&apos;s</h2>

            <div className="space-y-4">
              {voiceover.demos.length > 0 ? (
                voiceover.demos.map((demo, index) => (
                  <motion.div
                    key={demo.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BeautifulAudioPlayer
                      src={demo.url}
                      title={demo.title}
                      duration={demo.duration}
                      variant="default"
                    />
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-12">
                  Nog geen demo&apos;s beschikbaar
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
