'use client';

import React from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { VoiceoverCard } from './VoiceoverCard';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

// Sample voice data for mockups
const sampleVoice = {
  id: '1',
  name: 'Gina',
  slug: 'gina',
  profilePhoto: null,
  tags: ['Warm', 'Vriendelijk'],
  beschikbaar: true,
  availabilityText: 'Direct beschikbaar',
  demos: [
    { id: '1', title: 'Commercial', url: '#', duration: '0:30' },
    { id: '2', title: 'Documentaire', url: '#', duration: '0:45' },
  ],
};

export function VoiceoverSectionResponsiveMockups() {
  return (
    <div className={`space-y-32 p-4 md:p-8 bg-gray-50 ${plusJakarta.variable} font-plus-jakarta`}>
      
      {/* Mockup 1: Clean Separation with Proper Spacing */}
      <div className="space-y-0">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 1: Clean Separation</h3>
        
        <div className="bg-[#fcf9f5] dark:bg-gray-900">
          {/* Header Section */}
          <div className="py-12 md:py-20">
            <div className="max-w-5xl mx-auto px-4 md:px-6">
              <div className="text-center mb-8 md:mb-14">
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] mb-6 md:mb-8">
                  <span className="block text-gray-900 dark:text-white">Vind jouw</span>
                  <span className="block text-gray-700 dark:text-gray-300 mt-2">ideale stem</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                  14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm dark:shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input type="text" placeholder="Zoek op naam of stijl..." 
                      className="w-full pl-14 pr-5 py-4 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-gray-600 transition-colors text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
                  </div>
                  <button className="px-6 md:px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold flex items-center justify-center gap-3">
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filter Panel - With Animation and Proper Spacing */}
          <div className="overflow-hidden">
            <div className="bg-white dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700 py-6 md:py-8 mb-8 md:mb-12">
              <div className="max-w-5xl mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filter op stijl</h3>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <button className="px-4 md:px-5 py-2 md:py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm md:text-base">
                    Alle stemmen
                  </button>
                  <button className="px-4 md:px-5 py-2 md:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm md:text-base">
                    Autoriteit
                  </button>
                  <button className="px-4 md:px-5 py-2 md:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm md:text-base">
                    Helder
                  </button>
                  <button className="px-4 md:px-5 py-2 md:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm md:text-base">
                    Warm & Donker
                  </button>
                </div>
                <div className="flex gap-8 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">14</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Stemmen</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Categorieën</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Voiceovers Grid - Clear Section */}
          <div className="py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <VoiceoverCard 
                    key={i}
                    voice={{ ...sampleVoice, id: String(i), name: ['Gina', 'Sophie', 'Mark', 'Lisa', 'Tom', 'Eva', 'Jan', 'Nina'][i] }}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup 2: Floating Filter Panel */}
      <div className="space-y-0">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 2: Floating Filter Panel</h3>
        
        <div className="bg-[#fcf9f5] dark:bg-gray-900 min-h-screen">
          {/* Header */}
          <div className="py-12 md:py-20">
            <div className="max-w-5xl mx-auto px-4 md:px-6">
              <div className="text-center mb-8 md:mb-14">
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] mb-6 md:mb-8">
                  <span className="block">Vind jouw</span>
                  <span className="block text-gray-700 dark:text-gray-300 mt-2">ideale stem</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Zoek op naam of stijl..." className="w-full pl-14 pr-5 py-4 bg-gray-50 dark:bg-gray-700 rounded-xl" />
                  </div>
                  <button className="px-6 md:px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold">
                    <SlidersHorizontal className="w-5 h-5 inline mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Filter Panel */}
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 z-10 px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Filter op stijl</h3>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button className="px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl">Alle</button>
                    <button className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100">Autoriteit</button>
                    <button className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100">Helder</button>
                    <button className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100">Warm</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Voiceovers with Padding for Floating Panel */}
            <div className="pt-32 md:pt-40 pb-12">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {[...Array(8)].map((_, i) => (
                    <VoiceoverCard 
                      key={i}
                      voice={{ ...sampleVoice, id: String(i), name: ['Gina', 'Sophie', 'Mark', 'Lisa', 'Tom', 'Eva', 'Jan', 'Nina'][i] }}
                      isSelected={false}
                      onSelect={() => {}}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup 3: Subtle Section Division */}
      <div className="space-y-0">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 3: Subtle Section Division</h3>
        
        <div className="bg-gradient-to-b from-[#fcf9f5] to-white dark:from-gray-900 dark:to-gray-950">
          {/* Header */}
          <div className="py-12 md:py-20">
            <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] mb-6">
                Vind jouw ideale stem
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
              
              <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Zoek op naam of stijl..." 
                    className="w-full pl-14 pr-5 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700" />
                </div>
                <button className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold shadow-sm">
                  <SlidersHorizontal className="w-5 h-5 inline mr-2" />
                  Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Filter Section with Subtle Background */}
          <div className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm py-6 mb-12">
            <div className="max-w-5xl mx-auto px-4 md:px-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">Filter op stijl</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Selecteer een of meerdere categorieën</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm">Alle</button>
                  <button className="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-100">Autoriteit</button>
                  <button className="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-100">Helder</button>
                  <button className="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-100">Warm</button>
                  <button className="p-2 ml-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Voiceovers */}
          <div className="pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">Toon 8 van 14 stemmen</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <VoiceoverCard 
                    key={i}
                    voice={{ ...sampleVoice, id: String(i), name: ['Gina', 'Sophie', 'Mark', 'Lisa', 'Tom', 'Eva', 'Jan', 'Nina'][i] }}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup 4: Sticky Filter Bar */}
      <div className="space-y-0">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 4: Sticky Filter Bar</h3>
        
        <div className="bg-[#fcf9f5] dark:bg-gray-900">
          {/* Header */}
          <div className="py-12 md:py-20">
            <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] mb-6">
                Vind jouw ideale stem
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>
          </div>
          
          {/* Sticky Search & Filter Bar */}
          <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 max-w-md relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Zoek..." className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  <button className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg whitespace-nowrap">Alle</button>
                  <button className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg whitespace-nowrap hover:bg-gray-200">Autoriteit</button>
                  <button className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg whitespace-nowrap hover:bg-gray-200">Helder</button>
                  <button className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg whitespace-nowrap hover:bg-gray-200">Warm</button>
                  <button className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Active Filters */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Actieve filters:</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm flex items-center gap-2">
                    Warm
                    <button className="hover:opacity-70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Voiceovers with Padding */}
          <div className="py-12 md:py-16 bg-gradient-to-b from-transparent to-white dark:to-gray-950">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-semibold">Resultaten</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">8 stemmen gevonden</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <VoiceoverCard 
                    key={i}
                    voice={{ ...sampleVoice, id: String(i), name: ['Gina', 'Sophie', 'Mark', 'Lisa', 'Tom', 'Eva', 'Jan', 'Nina'][i] }}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup 5: Inline Compact Filters */}
      <div className="space-y-0">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 5: Inline Compact Filters</h3>
        
        <div className="bg-[#fcf9f5] dark:bg-gray-900 min-h-screen">
          {/* Header with Inline Filters */}
          <div className="py-12 md:py-20 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="text-center mb-8">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.85] mb-4">
                  Vind jouw ideale stem
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                  14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
                </p>
              </div>
              
              {/* Inline Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Zoek op naam of stijl..." 
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">Filter:</span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm">Alle</button>
                    <button className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-sm">Autoriteit</button>
                    <button className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-sm">Helder</button>
                    <button className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-sm">
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Clean Voiceover Grid */}
          <div className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <VoiceoverCard 
                    key={i}
                    voice={{ ...sampleVoice, id: String(i), name: ['Gina', 'Sophie', 'Mark', 'Lisa', 'Tom', 'Eva', 'Jan', 'Nina'][i] }}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                ))}
              </div>
              
              {/* Load More */}
              <div className="text-center mt-12">
                <button className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold">
                  Toon meer stemmen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}