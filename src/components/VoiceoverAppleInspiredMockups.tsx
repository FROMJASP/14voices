'use client';

import React, { useState } from 'react';
import { Search, Check, X, Sparkles, Star, Zap, Music2, Mic2 } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { VoiceoverCard } from './VoiceoverCard';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

// Sample voice data
const sampleVoices = [
  { id: '1', name: 'Gina', slug: 'gina', profilePhoto: null, tags: ['Warm', 'Vriendelijk'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '2', name: 'Sophie', slug: 'sophie', profilePhoto: null, tags: ['Helder', 'Professioneel'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '3', name: 'Mark', slug: 'mark', profilePhoto: null, tags: ['Autoriteit', 'Zakelijk'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '4', name: 'Lisa', slug: 'lisa', profilePhoto: null, tags: ['Jong', 'Energiek'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '5', name: 'Tom', slug: 'tom', profilePhoto: null, tags: ['Warm', 'Betrouwbaar'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '6', name: 'Eva', slug: 'eva', profilePhoto: null, tags: ['Urban', 'Modern'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '7', name: 'Jan', slug: 'jan', profilePhoto: null, tags: ['Autoriteit', 'Ervaren'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '8', name: 'Nina', slug: 'nina', profilePhoto: null, tags: ['Helder', 'Vriendelijk'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
];

// Extended style tags
const allStyles = [
  'Warm', 'Vriendelijk', 'Helder', 'Professioneel', 'Autoriteit', 'Zakelijk', 
  'Jong', 'Energiek', 'Urban', 'Modern', 'Betrouwbaar', 'Ervaren',
  'Speels', 'Serieus', 'Natuurlijk', 'Karaktervol', 'Diep', 'Licht'
];

export function VoiceoverAppleInspiredMockups() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  return (
    <div className={`space-y-24 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 ${plusJakarta.variable} font-plus-jakarta`}>
      
      {/* Version 1: Gradient Mesh Background */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 1: Gradient Mesh Background</h3>
        
        <div className="bg-[#fbfbfd] dark:bg-gray-950 min-h-screen relative overflow-hidden">
          {/* Gradient Mesh */}
          <div className="absolute inset-0 opacity-40 dark:opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#18f109]/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#efd243]/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#ffbc70]/20 to-transparent rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center py-20">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Vind jouw ideale stem
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                14 professionele stemacteurs • Direct beschikbaar • Voor elk project
              </p>
            </div>

            {/* Search */}
            <div className="max-w-2xl mx-auto px-8 mb-16">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Zoek op naam, stijl of projecttype..."
                  className="w-full px-6 py-4 text-lg bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 focus:border-[#18f109] dark:focus:border-[#18f109] focus:outline-none focus:ring-4 focus:ring-[#18f109]/10 transition-all"
                />
                <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
            </div>

            {/* Multi-Select Styles */}
            <div className="max-w-6xl mx-auto px-8 mb-16">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Filter op stijl</h3>
                  {selectedStyles.length > 0 && (
                    <button 
                      onClick={() => setSelectedStyles([])}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      Wis alle ({selectedStyles.length})
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSelectedStyles([])}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                      selectedStyles.length === 0
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Alle stijlen
                  </button>
                  {allStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all relative ${
                        selectedStyles.includes(style)
                          ? 'bg-[#18f109] text-black pr-10'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {style}
                      {selectedStyles.includes(style) && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Voice Grid */}
            <div className="max-w-7xl mx-auto px-8 pb-20">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sampleVoices.map((voice) => (
                  <VoiceoverCard
                    key={voice.id}
                    voice={voice}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version 2: Split Screen Design */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 2: Split Screen Design</h3>
        
        <div className="bg-white dark:bg-gray-950 min-h-screen">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Side - Hero */}
            <div className="lg:w-1/2 bg-gradient-to-br from-[#fcf9f5] to-[#fafafa] dark:from-gray-900 dark:to-gray-800 p-12 lg:p-20 flex flex-col justify-center">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-[#18f109] rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Live & Direct beschikbaar</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                  Vind jouw<br />ideale stem
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  Van commercials tot documentaires. Van zakelijk tot speels. Altijd de perfecte match.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#efd243]" />
                    <span className="text-gray-700 dark:text-gray-300">4.9/5 rating</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#18f109]" />
                    <span className="text-gray-700 dark:text-gray-300">Direct leverbaar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Interface */}
            <div className="lg:w-1/2 p-8 lg:p-12 overflow-y-auto">
              {/* Search */}
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Zoek stemmen..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-[#18f109] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Style Tags */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">FILTER OP STIJL</h3>
                <div className="flex flex-wrap gap-2">
                  {allStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedStyles.includes(style)
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {sampleVoices.map((voice) => (
                  <VoiceoverCard
                    key={voice.id}
                    voice={voice}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version 3: Floating Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 3: Floating Cards Design</h3>
        
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 min-h-screen">
          {/* Animated Background Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#18f109]/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#efd243]/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <Mic2 className="w-8 h-8 text-[#18f109]" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">14 Voices Studio</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                Vind jouw ideale stem
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Authentieke stemmen voor authentieke verhalen
              </p>
            </div>

            {/* Search & Filters Container */}
            <div className="max-w-5xl mx-auto px-8 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Zoek op naam..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18f109]"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Geselecteerd:</span>
                    <div className="flex gap-2">
                      {selectedStyles.length > 0 ? (
                        selectedStyles.map(style => (
                          <span key={style} className="px-3 py-1 bg-[#18f109] text-black rounded-full text-sm font-medium flex items-center gap-1">
                            {style}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => toggleStyle(style)} />
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Alle stijlen</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {allStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        selectedStyles.includes(style)
                          ? 'bg-[#18f109] text-black'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Voice Grid with Floating Effect */}
            <div className="max-w-7xl mx-auto px-8 pb-20">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sampleVoices.map((voice, index) => (
                  <div
                    key={voice.id}
                    className="transform hover:-translate-y-2 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
                      <VoiceoverCard
                        voice={voice}
                        isSelected={false}
                        onSelect={() => {}}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version 4: Minimal with Accent Bar */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 4: Minimal with Accent Bar</h3>
        
        <div className="bg-white dark:bg-gray-950 min-h-screen">
          {/* Top Accent Bar */}
          <div className="h-1 bg-gradient-to-r from-[#18f109] via-[#efd243] to-[#ffbc70]" />
          
          <div className="max-w-7xl mx-auto px-8 py-12">
            {/* Header */}
            <div className="mb-16">
              <h1 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-3">
                Vind jouw ideale stem
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Elk verhaal verdient de juiste verteller
              </p>
            </div>

            {/* Search and Filter Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-12">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Zoek stemmen..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800 focus:border-[#18f109] outline-none transition-colors"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Stijlen:</span>
                <div className="flex gap-1">
                  {selectedStyles.length === 0 ? (
                    <span className="px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded text-sm">Alle</span>
                  ) : (
                    selectedStyles.map(style => (
                      <span key={style} className="px-3 py-1 bg-[#18f109] text-black rounded text-sm">
                        {style}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Style Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
              {allStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStyles.includes(style)
                      ? 'border-[#18f109] bg-[#18f109]/10 text-gray-900 dark:text-white'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <span className="block text-sm font-medium">{style}</span>
                </button>
              ))}
            </div>

            {/* Voice Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleVoices.map((voice) => (
                <VoiceoverCard
                  key={voice.id}
                  voice={voice}
                  isSelected={false}
                  onSelect={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Version 5: Sidebar Layout */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 5: Sidebar Layout</h3>
        
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-80 bg-white dark:bg-gray-900 h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 p-8 overflow-y-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Vind jouw ideale stem
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Perfecte casting begint hier
                </p>
              </div>

              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Zoek..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#18f109]"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Filter op stijl
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedStyles([])}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedStyles.length === 0
                        ? 'bg-[#18f109] text-black font-medium'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Alle stijlen
                  </button>
                  {allStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                        selectedStyles.includes(style)
                          ? 'bg-gray-100 dark:bg-gray-800 font-medium'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {style}
                      {selectedStyles.includes(style) && (
                        <Check className="w-4 h-4 text-[#18f109]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Beschikbare stemmen
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedStyles.length > 0 
                    ? `Gefilterd op: ${selectedStyles.join(', ')}`
                    : 'Alle 14 stemmen worden getoond'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sampleVoices.map((voice) => (
                  <VoiceoverCard
                    key={voice.id}
                    voice={voice}
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
  );
}

<style jsx>{`
  .animation-delay-2000 {
    animation-delay: 2s;
  }
`}</style>