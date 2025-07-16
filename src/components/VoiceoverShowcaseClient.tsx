'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ChevronRight, User, Check, Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { useVoiceover, scrollToPriceCalculator } from '@/contexts/VoiceoverContext';
import Link from 'next/link';
import { shuffleArray, sortVoiceovers } from '@/lib/voiceover-utils';
import { BeautifulAudioPlayer } from './BeautifulAudioPlayer';
import { VoiceoverCard } from './VoiceoverCard';

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
}

interface VoiceoverShowcaseClientProps {
  activeVoiceovers: VoiceoverData[];
  archiveVoiceovers: VoiceoverData[];
  allTags: string[];
}

export function VoiceoverShowcaseClient({
  activeVoiceovers: initialActive,
  archiveVoiceovers: initialArchive,
  allTags,
}: VoiceoverShowcaseClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVoiceovers, setActiveVoiceovers] = useState<VoiceoverData[]>([]);
  const [archiveVoiceovers, setArchiveVoiceovers] = useState<VoiceoverData[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { selectedVoiceover, setSelectedVoiceover } = useVoiceover();

  // Randomize and sort on mount
  useEffect(() => {
    const shuffled = shuffleArray(initialActive);
    const sorted = sortVoiceovers(shuffled);
    setActiveVoiceovers(sorted);
    setArchiveVoiceovers(shuffleArray(initialArchive));
  }, [initialActive, initialArchive]);

  const filteredVoiceovers = activeVoiceovers.filter((voice) => {
    const matchesCategory =
      selectedCategories.length === 0 || voice.tags.some((tag) => selectedCategories.includes(tag));
    const matchesSearch =
      searchQuery === '' ||
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelectVoiceover = (voice: VoiceoverData) => {
    setSelectedVoiceover({
      id: voice.id,
      name: voice.name,
      profilePhoto: voice.profilePhoto || undefined,
      styleTags: voice.tags,
    });
    scrollToPriceCalculator();
  };

  const activeFiltersCount = selectedCategories.length;

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <section
      id="voiceovers"
      className={`py-20 bg-[#fcf9f5] dark:bg-gray-900 text-gray-900 dark:text-white ${plusJakarta.variable}`}
    >
      <div className="container mx-auto px-4">
        {/* V1 Enhanced Header */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-end mb-16">
            {/* Left: Enhanced Title */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-plus-jakarta text-7xl md:text-8xl font-black leading-[0.85] mb-6"
              >
                <span className="text-gray-900 dark:text-white">Vind jouw</span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-900 dark:from-gray-300 dark:to-white">
                  ideale stem
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed"
              >
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles
                daartussenin.
              </motion.p>
            </div>

            {/* Right: Search & Filter with Better Spacing */}
            <div className="space-y-5">
              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Zoek op naam of stijl..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-gray-900 dark:focus:border-white font-plus-jakarta text-gray-900 dark:text-white placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Enhanced Filter Button */}
              <motion.button
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl font-semibold transition-all duration-300 ${
                  showFilters
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2.5 py-0.5 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm text-xs rounded-full font-medium"
                    >
                      {activeFiltersCount}
                    </motion.span>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: showFilters ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </div>
          </div>

          {/* Expandable Filter Section with Better Design */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-8 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Filter op stijl
                    </h3>
                    <div className="flex items-center gap-2">
                      {selectedCategories.length > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-1"
                        >
                          Wis alles
                        </button>
                      )}
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearAllFilters}
                      className={`px-5 py-3 rounded-xl font-medium transition-all ${
                        selectedCategories.length === 0
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      Alle stemmen
                    </motion.button>
                    {allTags.map((tag, index) => (
                      <motion.button
                        key={tag}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleCategory(tag)}
                        className={`px-5 py-3 rounded-xl font-medium transition-all relative ${
                          selectedCategories.includes(tag)
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {tag}
                        {selectedCategories.includes(tag) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-2.5 h-2.5 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-8">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">14</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Stemmen</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Categorieën</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Featured Voice Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filteredVoiceovers.map((voice, index) => {
            const isSelected = selectedVoiceover?.id === voice.id;

            return (
              <motion.div
                key={voice.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VoiceoverCard
                  voice={voice}
                  isSelected={isSelected}
                  onSelect={() => handleSelectVoiceover(voice)}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Archive Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-plus-jakarta text-2xl font-semibold">Uit het archief</h3>
            <button className="flex items-center gap-2 text-sm font-plus-jakarta text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Bekijk alle stemmen
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontal Scroll List */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {archiveVoiceovers.map((voice) => {
              const isSelected = selectedVoiceover?.id === voice.id;

              return (
                <motion.div
                  key={voice.id}
                  whileHover={{ y: -5 }}
                  className={`flex-shrink-0 w-48 rounded-xl p-4 transition-all shadow-md hover:shadow-lg ${
                    !voice.beschikbaar
                      ? 'opacity-50'
                      : isSelected
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                        : 'bg-white dark:bg-gray-800 border-2 border-transparent'
                  }`}
                >
                  <Link href={`/voiceovers/${voice.slug}`} className="cursor-pointer">
                    <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center relative">
                      {voice.profilePhoto ? (
                        <img
                          src={voice.profilePhoto}
                          alt={voice.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <User className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                      )}
                      {!voice.beschikbaar && (
                        <div className="absolute inset-0 bg-white/70 dark:bg-black/70 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-plus-jakarta font-semibold text-gray-700 dark:text-gray-300">
                            {voice.availabilityText}
                          </span>
                        </div>
                      )}
                    </div>
                    <h4 className="font-plus-jakarta font-semibold mb-1 text-gray-900 dark:text-white">
                      {voice.name}
                    </h4>
                  </Link>

                  {/* Demo Players for Archive */}
                  <div className="space-y-1 mt-2">
                    {voice.demos.map((demo) => (
                      <BeautifulAudioPlayer
                        key={demo.id}
                        src={demo.url}
                        title={demo.title}
                        variant="compact"
                        preload="none"
                        className="scale-90 origin-left"
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {voice.demos.length} demo&apos;s
                    </p>
                    <div
                      className={`w-2 h-2 rounded-full ${voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                  </div>
                  {isSelected && voice.beschikbaar && (
                    <div className="flex items-center gap-1 mt-2">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Geselecteerd
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
