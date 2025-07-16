// Voiceover Section Header V4: Glassmorphic with Live Search
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, TrendingUp } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface VoiceoverSectionHeaderV4Props {
  allTags: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function VoiceoverSectionHeaderV4({
  allTags,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: VoiceoverSectionHeaderV4Props) {
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches] = useState(['Warm & Vriendelijk', 'Zakelijk', 'Jong & Energiek']);
  const popularTags = allTags.slice(0, 5);

  useEffect(() => {
    setIsSearching(searchQuery.length > 0);
  }, [searchQuery]);

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta mb-16 relative`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Voice-over collectie
          </span>
        </div>

        <h2 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight mb-4">
          Jouw stem,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            jouw verhaal
          </span>
        </h2>
      </motion.div>

      {/* Glassmorphic Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl mx-auto mb-10"
      >
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Zoek naar stemmen, stijlen of eigenschappen..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-14 pr-5 py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-plus-jakarta text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Populair:</span>
              <div className="flex gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onCategoryChange(tag)}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
              Trending
            </button>
          </div>
        </div>

        {/* Recent Searches */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 px-2"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Recent gezocht:</p>
            <div className="flex gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => onSearchChange(search)}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Horizontal Scrolling Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative"
      >
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#fcf9f5] dark:from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#fcf9f5] dark:from-gray-900 to-transparent z-10 pointer-events-none" />

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 pb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange('Alle')}
              className={`px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                selectedCategory === 'Alle'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50'
              }`}
            >
              ✨ Alle stemmen
            </motion.button>
            {allTags.map((tag, index) => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                onClick={() => onCategoryChange(tag)}
                className={`px-5 py-3 rounded-2xl font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === tag
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                    : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50'
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
