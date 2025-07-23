'use client';

import React, { useState } from 'react';
import { Search, Star, Zap, ChevronLeft, ChevronRight, Menu, X, Check, Sparkles, Music, Mic } from 'lucide-react';
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

export function VoiceoverSwipeMockups() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % sampleVoices.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + sampleVoices.length) % sampleVoices.length);
  };

  return (
    <div className={`space-y-24 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 ${plusJakarta.variable} font-plus-jakarta`}>
      
      {/* Version 1: Classic Card Stack */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 1: Classic Card Stack</h3>
        
        <div className="bg-gradient-to-br from-[#fcf9f5] to-white dark:from-gray-950 dark:to-gray-900 min-h-screen">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <div className={`
              fixed lg:static inset-y-0 left-0 z-40 
              w-80 bg-white dark:bg-gray-900 
              transform transition-transform duration-300 ease-in-out
              ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              lg:w-96 p-8 lg:p-12 overflow-y-auto lg:overflow-visible
              border-r border-gray-200 dark:border-gray-800
              lg:h-auto
            `}>
              {/* Hero Content */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-[#18f109] rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Live & Direct beschikbaar</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
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

              {/* Style Filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">FILTER OP STIJL</h3>
                <div className="space-y-2">
                  {allStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${
                        selectedStyles.includes(style)
                          ? 'bg-[#18f109] text-black'
                          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {style}
                      {selectedStyles.includes(style) && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Stack Area */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
              <div className="relative w-full max-w-md mx-auto">
                {/* Background Cards */}
                <div className="absolute inset-0 transform rotate-3 scale-95">
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                </div>
                <div className="absolute inset-0 transform -rotate-3 scale-95">
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-2xl" />
                </div>

                {/* Main Card */}
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                  <VoiceoverCard
                    voice={sampleVoices[currentIndex]}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                  
                  {/* Swipe Navigation */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <button
                      onClick={prevCard}
                      className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextCard}
                      className="p-3 bg-[#18f109] text-black rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Card Counter */}
                <div className="text-center mt-6 text-gray-600 dark:text-gray-400">
                  {currentIndex + 1} van {sampleVoices.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version 2: 3D Carousel */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 2: 3D Carousel</h3>
        
        <div className="bg-white dark:bg-gray-950 min-h-screen">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Sidebar - Same as Version 1 but with gradient */}
            <div className={`
              fixed lg:static inset-y-0 left-0 z-40 
              w-80 lg:w-96 lg:h-auto
              bg-gradient-to-b from-[#fcf9f5] to-white dark:from-gray-900 dark:to-gray-800
              transform transition-transform duration-300 ease-in-out
              ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              p-8 lg:p-12 overflow-y-auto lg:overflow-visible
            `}>
              {/* Hero Content - Same as Version 1 */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-[#18f109] rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Live & Direct beschikbaar</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
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

              {/* Pill Style Filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">STIJLEN</h3>
                <div className="flex flex-wrap gap-2">
                  {allStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedStyles.includes(style)
                          ? 'bg-[#18f109] text-black'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3D Carousel Area */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
              <div className="relative w-full max-w-4xl mx-auto perspective-1000">
                <div className="flex items-center justify-center gap-4">
                  {/* Previous Card */}
                  <div className="transform -translate-x-16 scale-75 opacity-50 rotate-y-25">
                    <div className="w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
                      <VoiceoverCard
                        voice={sampleVoices[(currentIndex - 1 + sampleVoices.length) % sampleVoices.length]}
                        isSelected={false}
                        onSelect={() => {}}
                      />
                    </div>
                  </div>

                  {/* Current Card */}
                  <div className="transform scale-100 z-10">
                    <div className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
                      <VoiceoverCard
                        voice={sampleVoices[currentIndex]}
                        isSelected={false}
                        onSelect={() => {}}
                      />
                    </div>
                  </div>

                  {/* Next Card */}
                  <div className="transform translate-x-16 scale-75 opacity-50 -rotate-y-25">
                    <div className="w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
                      <VoiceoverCard
                        voice={sampleVoices[(currentIndex + 1) % sampleVoices.length]}
                        isSelected={false}
                        onSelect={() => {}}
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-2 mt-8">
                  {sampleVoices.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? 'w-8 bg-[#18f109]'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version 3: Tinder-Style Swipe */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 3: Tinder-Style Swipe</h3>
        
        <div className="bg-gradient-to-br from-[#fcf9f5] via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Compact Sidebar */}
            <div className={`
              fixed lg:relative inset-y-0 left-0 z-40 
              w-80 lg:w-[420px] 
              bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
              transform transition-transform duration-300 ease-in-out
              ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              p-6 lg:p-10 overflow-y-auto
              border-r border-gray-200/50 dark:border-gray-800/50
            `}>
              {/* Compact Hero */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#18f109]" />
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Live beschikbaar</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  Vind jouw ideale stem
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Swipe voor de perfecte match
                </p>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-[#efd243]" />
                      <span className="font-bold">4.9</span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Rating</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap className="w-4 h-4 text-[#18f109]" />
                      <span className="font-bold">Direct</span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Leverbaar</span>
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Zoek stemmen..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18f109]"
                />
              </div>

              {/* Selected Styles */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Actieve filters ({selectedStyles.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStyles.map((style) => (
                    <span
                      key={style}
                      className="px-3 py-1.5 bg-[#18f109] text-black rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {style}
                      <button onClick={() => toggleStyle(style)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Style Grid */}
              <div className="grid grid-cols-2 gap-2">
                {allStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedStyles.includes(style)
                        ? 'bg-gray-200 dark:bg-gray-700 opacity-50'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Swipe Area */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
              <div className="relative w-full max-w-sm mx-auto">
                {/* Swipe Hint */}
                <div className="absolute -top-12 left-0 right-0 flex justify-between px-8 text-sm">
                  <span className="text-red-500 dark:text-red-400">← Nee</span>
                  <span className="text-green-500 dark:text-green-400">Ja →</span>
                </div>

                {/* Card Stack */}
                <div className="relative h-[500px]">
                  {sampleVoices.slice(currentIndex, currentIndex + 3).map((voice, index) => (
                    <div
                      key={voice.id}
                      className={`absolute inset-0 transform transition-all duration-300 ${
                        index === 0 ? 'z-30' : index === 1 ? 'z-20 scale-95 translate-y-4' : 'z-10 scale-90 translate-y-8'
                      }`}
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden h-full">
                        <VoiceoverCard
                          voice={voice}
                          isSelected={false}
                          onSelect={() => {}}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={prevCard}
                    className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
                  >
                    <X className="w-6 h-6 text-red-500" />
                  </button>
                  <button
                    onClick={() => {}}
                    className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
                  >
                    <Star className="w-6 h-6 text-yellow-500" />
                  </button>
                  <button
                    onClick={nextCard}
                    className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
                  >
                    <Check className="w-6 h-6 text-green-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version 4: Grid Preview with Focus */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 4: Grid Preview with Focus</h3>
        
        <div className="bg-white dark:bg-gray-950 min-h-screen">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Info Panel */}
            <div className={`
              fixed lg:relative inset-y-0 left-0 z-40 
              w-80 lg:w-[480px] 
              bg-gradient-to-b from-[#fcf9f5] to-white dark:from-gray-900 dark:to-gray-800
              transform transition-transform duration-300 ease-in-out
              ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              p-8 lg:p-12 overflow-y-auto
            `}>
              {/* Hero with Background Pattern */}
              <div className="relative mb-12">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#18f109] rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#efd243] rounded-full blur-3xl" />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    <Music className="w-5 h-5 text-[#18f109]" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Live & Direct beschikbaar</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                    Vind jouw<br />ideale stem
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Van commercials tot documentaires. Van zakelijk tot speels. Altijd de perfecte match.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <Star className="w-4 h-4 text-[#efd243]" />
                      <span className="text-sm font-medium">4.9/5 rating</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <Zap className="w-4 h-4 text-[#18f109]" />
                      <span className="text-sm font-medium">Direct leverbaar</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Voice Details */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
                <h3 className="font-semibold mb-4">Geselecteerde stem</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Naam</span>
                    <span className="font-medium">{sampleVoices[currentIndex].name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Stijlen</span>
                    <div className="flex gap-2">
                      {sampleVoices[currentIndex].tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className="text-[#18f109] font-medium">Beschikbaar</span>
                  </div>
                </div>
              </div>

              {/* Style Filter Tags */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">FILTER STIJLEN</h3>
                <div className="flex flex-wrap gap-2">
                  {allStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedStyles.includes(style)
                          ? 'bg-[#18f109] text-black'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid with Focus */}
            <div className="flex-1 p-8 lg:p-12 bg-gray-50 dark:bg-gray-900">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {sampleVoices.map((voice, index) => (
                  <div
                    key={voice.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`cursor-pointer transform transition-all duration-300 ${
                      index === currentIndex
                        ? 'scale-110 z-10 col-span-2 row-span-2'
                        : 'hover:scale-105'
                    }`}
                  >
                    <div className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg ${
                      index === currentIndex ? 'ring-4 ring-[#18f109]' : ''
                    }`}>
                      <VoiceoverCard
                        voice={voice}
                        isSelected={index === currentIndex}
                        onSelect={() => setCurrentIndex(index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version 5: Horizontal Scroll */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 5: Horizontal Scroll</h3>
        
        <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 min-h-screen">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Fixed Sidebar */}
            <div className={`
              fixed lg:sticky top-0 left-0 z-40 h-screen
              w-80 lg:w-[400px] 
              bg-white dark:bg-gray-900
              transform transition-transform duration-300 ease-in-out
              ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              flex flex-col
              shadow-2xl lg:shadow-none
            `}>
              {/* Hero Section */}
              <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Mic className="w-5 h-5 text-[#18f109]" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Live & Direct beschikbaar</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                    Vind jouw<br />ideale stem
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Van commercials tot documentaires. Van zakelijk tot speels. Altijd de perfecte match.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#efd243]/20 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-[#efd243]" />
                      </div>
                      <div>
                        <p className="font-semibold">4.9/5 rating</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Van 500+ klanten</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#18f109]/20 rounded-full flex items-center justify-center">
                        <Zap className="w-6 h-6 text-[#18f109]" />
                      </div>
                      <div>
                        <p className="font-semibold">Direct leverbaar</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Binnen 24 uur</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters as Tabs */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">STIJL CATEGORIEËN</h3>
                  <div className="space-y-1">
                    {allStyles.slice(0, 8).map((style) => (
                      <button
                        key={style}
                        onClick={() => toggleStyle(style)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${
                          selectedStyles.includes(style)
                            ? 'bg-[#18f109] text-black'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span>{style}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${
                          selectedStyles.includes(style) ? 'rotate-90' : 'group-hover:translate-x-1'
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal Scroll Area */}
            <div className="flex-1 flex items-center">
              <div className="w-full">
                <div className="px-8 lg:px-12 py-8">
                  <h2 className="text-2xl font-bold mb-6">Alle stemmen</h2>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-8 px-8 lg:px-12 scrollbar-hide">
                  {sampleVoices.map((voice, index) => (
                    <div
                      key={voice.id}
                      className="flex-shrink-0 w-80 transform transition-all hover:scale-105"
                      onClick={() => setCurrentIndex(index)}
                    >
                      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${
                        index === currentIndex ? 'ring-4 ring-[#18f109]' : ''
                      }`}>
                        <VoiceoverCard
                          voice={voice}
                          isSelected={index === currentIndex}
                          onSelect={() => setCurrentIndex(index)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

<style jsx>{`
  .perspective-1000 {
    perspective: 1000px;
  }
  .rotate-y-25 {
    transform: rotateY(25deg);
  }
  .-rotate-y-25 {
    transform: rotateY(-25deg);
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`}</style>