'use client';

import React, { useState } from 'react';
import { Search, Star, Zap, Menu, X, Check, Filter, ChevronDown, Mic, Music, Sparkles } from 'lucide-react';
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

export function VoiceoverGridLayoutMockups() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  return (
    <div className={`space-y-24 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 ${plusJakarta.variable} font-plus-jakarta`}>
      
      {/* Version 1: Split Screen with Gradient Transition */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 1: Split Screen with Gradient Transition</h3>
        
        <div className="bg-gradient-to-r from-[#fcf9f5] to-white dark:from-gray-950 dark:to-gray-900 min-h-screen">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Left Side - Hero & Filters */}
            <div className={`
              fixed lg:static inset-y-0 left-0 z-40 
              w-80 lg:w-[400px] lg:h-auto
              bg-gradient-to-b from-[#fcf9f5] to-[#fafafa] dark:from-gray-900 dark:to-gray-800
              transform transition-transform duration-300 ease-in-out
              ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              p-8 lg:p-12 overflow-y-auto lg:overflow-visible
              shadow-2xl lg:shadow-none
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
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-[#18f109] focus:outline-none transition-all"
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
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {style}
                      {selectedStyles.includes(style) && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Voice Grid */}
            <div className="flex-1 p-8 lg:p-12 ml-0 lg:ml-0">
              <div className="lg:hidden mb-6">
                <h2 className="text-2xl font-bold">Alle stemmen</h2>
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

      {/* Version 2: Floating Sidebar with Backdrop */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 2: Floating Sidebar with Backdrop</h3>
        
        <div className="bg-white dark:bg-gray-950 min-h-screen relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative z-10 flex">
            {/* Floating Sidebar */}
            <div className={`
              fixed lg:static top-8 left-8 lg:top-0 lg:left-0 z-40 
              w-80 lg:w-96 h-[calc(100vh-4rem)] lg:h-auto
              bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl
              transform transition-all duration-300 ease-in-out
              ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)] lg:translate-x-0'}
              rounded-2xl lg:rounded-none shadow-2xl lg:shadow-none
              flex flex-col
              lg:overflow-visible lg:backdrop-blur-none lg:bg-white dark:lg:bg-gray-900
            `}>
              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden absolute -right-14 top-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Sidebar Content */}
              <div className="p-8 overflow-y-auto flex-1">
                {/* Hero Content */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-[#18f109]" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Live & Direct beschikbaar</span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                    Vind jouw ideale stem
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Van commercials tot documentaires. Van zakelijk tot speels. Altijd de perfecte match.
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Star className="w-5 h-5 text-[#efd243]" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">4.9/5 rating</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">500+ tevreden klanten</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Zap className="w-5 h-5 text-[#18f109]" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Direct leverbaar</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Binnen 24 uur geleverd</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search & Filters */}
                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Zoek..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#18f109]"
                    />
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Stijl filters
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {allStyles.map((style) => (
                        <button
                          key={style}
                          onClick={() => toggleStyle(style)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 pl-0 lg:pl-[28rem] p-8 lg:pr-12 lg:py-12">
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

      {/* Version 3: Full Width with Sticky Header */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 3: Full Width with Sticky Header</h3>
        
        <div className="bg-[#fcf9f5] dark:bg-gray-950 min-h-screen">
          {/* Sticky Header */}
          <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left Side - Hero Content */}
                <div className="flex items-center gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-[#18f109] rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Live & Direct beschikbaar</span>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      Vind jouw ideale stem
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Van commercials tot documentaires
                    </p>
                  </div>
                  <div className="hidden lg:flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-[#efd243]" />
                      <span className="font-medium">4.9/5</span>
                    </div>
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-[#18f109]" />
                      <span className="font-medium">Direct</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Search & Filter Toggle */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Zoek stemmen..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#18f109]"
                    />
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm font-medium">Filters</span>
                  </button>
                </div>
              </div>

              {/* Expandable Filter Section */}
              {mobileMenuOpen && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedStyles([])}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedStyles.length === 0
                          ? 'bg-[#18f109] text-black'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      Alle stijlen
                    </button>
                    {allStyles.map((style) => (
                      <button
                        key={style}
                        onClick={() => toggleStyle(style)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedStyles.includes(style)
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Voice Grid */}
          <div className="max-w-7xl mx-auto p-6 lg:p-12">
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

      {/* Version 4: Split Screen with Stats & Grid Below */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 4: Split Screen with Stats & Grid Below</h3>
        
        <div className="bg-white dark:bg-gray-950">
          {/* Split Screen Section */}
          <div className="flex flex-col lg:flex-row lg:h-[600px]">
            {/* Left Half - Hero & Filters */}
            <div className="lg:w-1/2 bg-gradient-to-br from-[#fcf9f5] via-[#fafafa] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8 lg:p-16 flex items-center">
              <div className="w-full max-w-xl mx-auto">
                {/* Hero Content */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-3 h-3 bg-[#18f109] rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Live & Direct beschikbaar
                    </span>
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                    Vind jouw<br />ideale stem
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                    Van commercials tot documentaires. Van zakelijk tot speels. Altijd de perfecte match.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                      <Star className="w-8 h-8 text-[#efd243] mb-3" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">4.9/5</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Klantbeoordeling</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                      <Zap className="w-8 h-8 text-[#18f109] mb-3" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">24u</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Direct leverbaar</p>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Filter op stijl
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {allStyles.slice(0, 9).map((style) => (
                      <button
                        key={style}
                        onClick={() => toggleStyle(style)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          selectedStyles.includes(style)
                            ? 'bg-[#18f109] text-black shadow-lg'
                            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Half - Stats & Features */}
            <div className="lg:w-1/2 bg-gradient-to-br from-[#18f109]/10 via-[#efd243]/10 to-[#fcf9f5] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8 lg:p-16 flex items-center">
              <div className="w-full max-w-xl mx-auto">
                {/* Search Bar */}
                <div className="mb-12">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Zoek op naam, stijl of project..."
                      className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-[#18f109] text-lg"
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-12">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl">
                    <Mic className="w-8 h-8 text-[#18f109] mb-3" />
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">250+</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Professionele stemmen</p>
                  </div>
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl">
                    <Music className="w-8 h-8 text-[#efd243] mb-3" />
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">15+</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Talen beschikbaar</p>
                  </div>
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl">
                    <Sparkles className="w-8 h-8 text-[#ebaa3a] mb-3" />
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">10k+</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Projecten voltooid</p>
                  </div>
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl">
                    <Check className="w-8 h-8 text-[#18f109] mb-3" />
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">98%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Klanttevredenheid</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <button className="w-full p-4 bg-[#18f109] text-black rounded-xl font-semibold hover:bg-[#18f109]/90 transition-colors">
                    Start direct een project
                  </button>
                  <button className="w-full p-4 bg-white dark:bg-gray-800 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
                    Bekijk populaire stemmen
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Grid Section */}
          <div className="bg-gray-50 dark:bg-gray-900 p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Beschikbare stemmen</h2>
                <p className="text-gray-600 dark:text-gray-400">Ontdek onze professionele voice-overs</p>
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

      {/* Version 5: Minimal with Top Bar */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 dark:text-gray-400">VERSION 5: Minimal with Top Bar</h3>
        
        <div className="bg-[#fcf9f5] dark:bg-gray-950 min-h-screen">
          {/* Top Bar */}
          <div className="bg-white dark:bg-gray-900 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid lg:grid-cols-3 gap-6 items-center">
                {/* Hero Content */}
                <div className="lg:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Music className="w-5 h-5 text-[#18f109]" />
                        <span className="text-sm font-medium text-[#18f109]">Live & Direct beschikbaar</span>
                      </div>
                      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                        Vind jouw ideale stem
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Van commercials tot documentaires. Altijd de perfecte match.
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Star className="w-5 h-5 text-[#efd243]" />
                          <span className="text-xl font-bold">4.9</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">rating</p>
                      </div>
                      <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Zap className="w-5 h-5 text-[#18f109]" />
                          <span className="text-xl font-bold">24u</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">levertijd</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Zoek stemmen..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18f109]"
                  />
                </div>
              </div>

              {/* Filter Pills */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Stijlen:</span>
                  <div className="flex flex-wrap gap-2 flex-1">
                    {allStyles.map((style) => (
                      <button
                        key={style}
                        onClick={() => toggleStyle(style)}
                        className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                          selectedStyles.includes(style)
                            ? 'bg-[#18f109] text-black font-medium'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Grid */}
          <div className="max-w-7xl mx-auto p-6 lg:p-12">
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
  );
}