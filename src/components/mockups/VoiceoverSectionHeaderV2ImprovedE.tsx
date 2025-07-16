// Voiceover Section Header V2 Improved E: Floating Panel with Background Animation
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sliders, ChevronDown, X, Sparkles, TrendingUp } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface VoiceoverSectionHeaderV2ImprovedEProps {
  allTags: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function VoiceoverSectionHeaderV2ImprovedE({
  allTags,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: VoiceoverSectionHeaderV2ImprovedEProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const activeFiltersCount = selectedCategory !== 'Alle' ? 1 : 0;
  const trendingTags = ['Warm & Vriendelijk', 'Zakelijk', 'Jong & Energiek'];

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta mb-20 relative`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/3 w-80 h-80 bg-pink-200/30 dark:bg-pink-900/20 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 grid lg:grid-cols-[1.2fr,1fr] gap-8 lg:gap-12 items-start">
        {/* Left: Title and Description */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Voice-over Platform
              </span>
            </div>

            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.85]">
              <span className="text-gray-900 dark:text-white">De stem</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 animate-gradient-x">
                die past
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8"
          >
            Ontdek 24 professionele stemmen voor jouw volgende project. Van commercials tot
            podcasts.
          </motion.p>

          {/* Trending Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <TrendingUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Trending:</span>
            <div className="flex gap-2">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onCategoryChange(tag)}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Search and Filter Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* Search Input with Animation */}
          <div className="relative">
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-md transition-opacity ${
                searchFocused ? 'opacity-30' : 'opacity-0'
              }`}
            />
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Zoek een stem..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="relative w-full pl-14 pr-5 py-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-transparent font-plus-jakarta text-gray-900 dark:text-white placeholder-gray-400 shadow-lg"
              />
            </div>
          </div>

          {/* Filter Button with Floating Badge */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`relative w-full px-6 py-5 rounded-2xl font-semibold flex items-center justify-between transition-all ${
              showFilters
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-600/30'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 shadow-lg'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5" />
              <span>Filter categorieën</span>
            </div>

            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2.5 py-1 bg-white/20 text-xs rounded-full"
                >
                  {activeFiltersCount} actief
                </motion.span>
              )}
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}
              />
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setShowFilters(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Filter stemmen</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onCategoryChange('Alle');
                    setShowFilters(false);
                  }}
                  className={`px-5 py-4 rounded-2xl font-medium transition-all ${
                    selectedCategory === 'Alle'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  ✨ Alle stemmen
                </motion.button>

                {allTags.map((tag, index) => (
                  <motion.button
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onCategoryChange(tag);
                      setShowFilters(false);
                    }}
                    className={`px-5 py-4 rounded-2xl font-medium transition-all ${
                      selectedCategory === tag
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Tip: Gebruik meerdere filters voor betere resultaten</span>
                  <button
                    onClick={() => {
                      onCategoryChange('Alle');
                      setShowFilters(false);
                    }}
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
