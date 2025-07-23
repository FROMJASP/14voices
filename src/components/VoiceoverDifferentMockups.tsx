'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, X, Sparkles, Zap, Star, Music, Mic, HeadphonesIcon, Radio } from 'lucide-react';
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

export function VoiceoverDifferentMockups() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={`space-y-24 p-4 md:p-8 bg-gray-50 ${plusJakarta.variable} font-plus-jakarta`}>
      
      {/* Version 1: Spotify-Inspired Dark Mode */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 1: Spotify-Inspired Dark Mode</h3>
        
        <div className="bg-black min-h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
                Ontdek stemmen
              </h1>
              <p className="text-gray-400 text-lg">
                Vind de perfecte stem voor jouw project
              </p>
            </div>

            {/* Search and Quick Styles */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Zoek op naam of project type..."
                    className="w-full pl-12 pr-4 py-3 bg-[#121212] text-white placeholder-gray-500 rounded-full border border-gray-800 focus:border-[#1db954] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              
              {/* Style Pills */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-400 mr-2">Stijlen:</span>
                {allStyles.slice(0, 8).map((style) => (
                  <button
                    key={style}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedStyles.includes(style)
                        ? 'bg-[#1db954] text-black'
                        : 'bg-[#232323] text-white hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {style}
                  </button>
                ))}
                <button className="px-4 py-2 rounded-full text-sm font-medium bg-[#232323] text-white hover:bg-[#2a2a2a] flex items-center gap-2">
                  Meer stijlen
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Voice Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleVoices.map((voice) => (
                <div key={voice.id} className="bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-colors group">
                  <div className="bg-white rounded-lg overflow-hidden">
                    <VoiceoverCard
                      voice={voice}
                      isSelected={false}
                      onSelect={() => {}}
                    />
                  </div>
                  <button className="mt-4 w-full py-2 bg-[#1db954] text-black rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Selecteer stem
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Version 2: Magazine Editorial Layout */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 2: Magazine Editorial Layout</h3>
        
        <div className="bg-white min-h-screen">
          {/* Magazine Header */}
          <div className="border-b-4 border-black p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-6xl font-serif">STEMMEN</h1>
                  <p className="text-sm uppercase tracking-widest mt-2">Editie 2024 • 14 Professionals</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">UITGAVE</p>
                  <p className="text-3xl font-bold">№14</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-8">
            {/* Editorial Search */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-gray-600">Zoek een stem</label>
                <input
                  type="text"
                  placeholder="Typ hier..."
                  className="w-full mt-2 pb-2 text-2xl border-b-2 border-gray-300 focus:border-black outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-600">Filter op stijl</label>
                <select className="w-full mt-2 pb-2 text-lg border-b-2 border-gray-300 focus:border-black outline-none">
                  <option>Alle stijlen</option>
                  {allStyles.map(style => (
                    <option key={style}>{style}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Style Tags as Editorial Categories */}
            <div className="mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {allStyles.map((style, index) => (
                  <div key={style} className="text-center p-4 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer">
                    <p className="text-xs uppercase tracking-widest">{`0${index + 1}`}</p>
                    <p className="font-serif text-lg mt-1">{style}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Voice Grid Editorial Style */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sampleVoices.map((voice, index) => (
                <div key={voice.id}>
                  <p className="text-xs uppercase tracking-widest mb-2">Voice {`0${index + 1}`}</p>
                  <VoiceoverCard
                    voice={voice}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Version 3: Apple-Inspired Minimal */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 3: Apple-Inspired Minimal</h3>
        
        <div className="bg-[#fbfbfd] min-h-screen">
          {/* Centered Header */}
          <div className="text-center py-20">
            <h1 className="text-5xl md:text-7xl font-medium tracking-tight">
              Stemmen
            </h1>
            <p className="text-xl text-gray-600 mt-4">
              Professioneel. Betrouwbaar. Beschikbaar.
            </p>
          </div>

          {/* Centered Search */}
          <div className="max-w-2xl mx-auto px-8 mb-16">
            <div className="relative">
              <input
                type="text"
                placeholder="Zoek stemmen"
                className="w-full px-6 py-4 text-lg bg-white rounded-2xl shadow-sm border border-gray-200 focus:border-gray-400 focus:outline-none transition-all"
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Style Selector */}
          <div className="max-w-6xl mx-auto px-8 mb-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
              <div className="flex overflow-x-auto scrollbar-hide gap-2">
                <button className="px-6 py-3 bg-black text-white rounded-xl whitespace-nowrap">
                  Alle stijlen
                </button>
                {allStyles.map((style) => (
                  <button
                    key={style}
                    className="px-6 py-3 hover:bg-gray-100 rounded-xl whitespace-nowrap transition-colors"
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Voice Grid */}
          <div className="max-w-6xl mx-auto px-8 pb-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleVoices.map((voice) => (
                <div key={voice.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <VoiceoverCard
                    voice={voice}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Version 4: Retro Radio Station */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 4: Retro Radio Station</h3>
        
        <div className="bg-gradient-to-br from-orange-100 via-yellow-50 to-red-50 min-h-screen p-8">
          <div className="max-w-7xl mx-auto">
            {/* Radio Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-4 mb-6">
                <Radio className="w-12 h-12 text-red-600" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  STEM FM 14.0
                </h1>
                <Radio className="w-12 h-12 text-orange-600" />
              </div>
              <p className="text-lg text-gray-700">
                ♪ Tune in voor de beste stemmen ♪
              </p>
            </div>

            {/* Retro Controls */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 mb-8 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-white text-sm font-bold mb-2 block">STATION ZOEKER</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tune in op een stem..."
                      className="w-full px-4 py-3 bg-white/90 rounded-lg text-gray-900 placeholder-gray-600"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-red-600 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <button className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-300 transition-colors">
                    SCAN
                  </button>
                  <button className="px-6 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                    AUTO
                  </button>
                </div>
              </div>
            </div>

            {/* Style Frequency Dial */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
              <h3 className="font-bold text-gray-700 mb-4">STIJL FREQUENTIES</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {allStyles.map((style, index) => (
                  <button
                    key={style}
                    className="text-center p-3 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all"
                  >
                    <p className="text-xs text-gray-500">{`${88 + index * 2}.${index % 2 === 0 ? '0' : '5'} FM`}</p>
                    <p className="font-bold text-sm mt-1">{style}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Grid with Retro Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleVoices.map((voice, index) => (
                <div key={voice.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-white">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 text-white text-center">
                    <p className="text-xs font-bold">ON AIR • LIVE</p>
                  </div>
                  <VoiceoverCard
                    voice={voice}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Version 5: Netflix-Style Browse */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 5: Netflix-Style Browse</h3>
        
        <div className="bg-[#141414] min-h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Netflix Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Stemmen
              </h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Titels, mensen, genres"
                    className="pl-10 pr-4 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-500 focus:border-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Genre Selector */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">Stemmen</h2>
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-600 rounded text-sm text-white hover:border-white transition-colors">
                  Genres
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {allStyles.slice(0, 6).map((style) => (
                  <button
                    key={style}
                    className="px-4 py-1.5 bg-[#2d2d2d] text-gray-300 rounded-full text-sm whitespace-nowrap hover:bg-[#3d3d3d] transition-colors"
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-8">
              {/* Trending Now */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-600" />
                  Populair nu
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sampleVoices.slice(0, 4).map((voice, index) => (
                    <div key={voice.id} className="relative group">
                      <div className="absolute -left-2 -top-2 z-10 bg-red-600 text-white text-4xl font-bold w-12 h-12 flex items-center justify-center rounded">
                        {index + 1}
                      </div>
                      <div className="bg-[#181818] rounded overflow-hidden group-hover:scale-105 transition-transform">
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

              {/* Recently Added */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Recent toegevoegd
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sampleVoices.slice(4).map((voice) => (
                    <div key={voice.id} className="bg-[#181818] rounded overflow-hidden hover:scale-105 transition-transform">
                      <VoiceoverCard
                        voice={voice}
                        isSelected={false}
                        onSelect={() => {}}
                      />
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