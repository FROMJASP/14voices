'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Star, Zap, Shield, ChevronDown, X, Check, ArrowDown, Info, Mic, Radio, Music, Headphones, Activity, Waves } from 'lucide-react';
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

export function VoiceoverArtisticVariations() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Alle stijlen']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStyleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleStyle = (style: string) => {
    if (style === 'Alle stijlen') {
      setSelectedStyles(['Alle stijlen']);
    } else {
      const newStyles = selectedStyles.filter(s => s !== 'Alle stijlen');
      if (selectedStyles.includes(style)) {
        const filtered = newStyles.filter(s => s !== style);
        setSelectedStyles(filtered.length === 0 ? ['Alle stijlen'] : filtered);
      } else {
        setSelectedStyles([...newStyles, style]);
      }
    }
  };

  const removeStyle = (style: string) => {
    const filtered = selectedStyles.filter(s => s !== style);
    setSelectedStyles(filtered.length === 0 ? ['Alle stijlen'] : filtered);
  };

  // Variation selector
  const variations = [
    { id: 1, name: 'Sound Waves' },
    { id: 2, name: 'Studio Vibes' },
    { id: 3, name: 'Radio Broadcast' },
    { id: 4, name: 'Audio Spectrum' },
    { id: 5, name: 'Minimal Dots' }
  ];

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta`}>
      {/* Variation Selector */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Selecteer variant:</span>
            {variations.map((variation) => (
              <button
                key={variation.id}
                onClick={() => setSelectedVariation(variation.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedVariation === variation.id
                    ? 'bg-[#18f109] text-black'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {variation.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Variation 1: Sound Waves */}
      {selectedVariation === 1 && (
        <div className="min-h-screen bg-gradient-to-b from-[#fcf9f5] to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
          {/* Animated Sound Wave Background */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5">
            <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
              <path
                className="animate-pulse"
                d="M0,300 Q150,200 300,300 T600,300 T900,300 T1200,300"
                stroke="#18f109"
                strokeWidth="2"
                fill="none"
              />
              <path
                className="animate-pulse delay-100"
                d="M0,320 Q150,250 300,320 T600,320 T900,320 T1200,320"
                stroke="#efd243"
                strokeWidth="2"
                fill="none"
              />
              <path
                className="animate-pulse delay-200"
                d="M0,280 Q150,350 300,280 T600,280 T900,280 T1200,280"
                stroke="#ebaa3a"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          {/* Floating Audio Elements */}
          <div className="hidden lg:block">
            <div className="absolute left-20 top-40 animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-[#18f109]/20 blur-2xl" />
                <Mic className="w-24 h-24 text-[#18f109] relative" />
              </div>
            </div>
            <div className="absolute right-20 top-60 animate-float-delayed">
              <div className="relative">
                <div className="absolute inset-0 bg-[#efd243]/20 blur-2xl" />
                <Headphones className="w-20 h-20 text-[#efd243] relative" />
              </div>
            </div>
            <div className="absolute left-32 bottom-40 animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-[#ebaa3a]/20 blur-2xl" />
                <Music className="w-16 h-16 text-[#ebaa3a] relative" />
              </div>
            </div>
            <div className="absolute right-40 bottom-60 animate-float-delayed">
              <div className="relative">
                <div className="absolute inset-0 bg-[#18f109]/20 blur-2xl" />
                <Activity className="w-20 h-20 text-[#18f109] relative" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-16">
            {/* Process Steps */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-8 h-8 bg-[#18f109] text-black rounded-full flex items-center justify-center font-semibold">1</span>
                <span>Boek je stem</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-700" />
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-semibold">2</span>
                <span>Upload script</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-700" />
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-semibold">3</span>
                <span>Ontvang audio</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl lg:text-7xl font-bold text-center text-gray-900 dark:text-white mb-6">
              De perfecte stem<br />
              voor elk verhaal
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
              Van commercials tot documentaires. Direct beschikbaar, professioneel opgenomen.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#18f109]" />
                <span className="font-semibold">&lt;48u levering</span>
              </div>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
              <a 
                href="https://www.feedbackcompany.com/nl-nl/reviews/fourteen-voices/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#efd243] transition-colors"
              >
                <Star className="w-5 h-5 text-[#efd243]" />
                <span className="font-semibold">9.1/10 beoordeeld</span>
              </a>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#ebaa3a]" />
                <span className="font-semibold">100% garantie</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <button 
                onClick={() => document.getElementById('voiceover-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-[#18f109] text-black rounded-xl font-semibold hover:bg-[#18f109]/90 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                Bekijk stemmen
                <ArrowDown className="w-4 h-4" />
              </button>
              <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2">
                Over ons
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Menu Bar */}
          <div className="sticky top-[73px] z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
              <div className="flex items-center gap-6 py-4" ref={dropdownRef}>
                {/* Search Field */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Zoek op naam of project type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-[#18f109] focus:ring-1 focus:ring-[#18f109] transition-all"
                  />
                </div>

                {/* Style Filter Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowStyleDropdown(!showStyleDropdown)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all ${
                      !selectedStyles.includes('Alle stijlen') && selectedStyles.length > 0
                        ? 'bg-[#18f109] text-black border-[#18f109] hover:bg-[#18f109]/90'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="font-medium">
                      {selectedStyles.includes('Alle stijlen') 
                        ? 'Alle stijlen' 
                        : `${selectedStyles.length} stijl(en)`}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showStyleDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Style Dropdown */}
                  {showStyleDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <p className="font-medium text-gray-900 dark:text-white">
                            Filter op stijl
                          </p>
                          {!selectedStyles.includes('Alle stijlen') && selectedStyles.length > 0 && (
                            <button
                              onClick={() => setSelectedStyles(['Alle stijlen'])}
                              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              Wis alles
                            </button>
                          )}
                        </div>
                        <div className="space-y-1 max-h-80 overflow-y-auto">
                          <button
                            onClick={() => toggleStyle('Alle stijlen')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                              selectedStyles.includes('Alle stijlen')
                                ? 'bg-[#18f109] text-black'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <span>Alle stijlen</span>
                            {selectedStyles.includes('Alle stijlen') && <Check className="w-4 h-4" />}
                          </button>
                          <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
                          {allStyles.map((style) => (
                            <button
                              key={style}
                              onClick={() => toggleStyle(style)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                                selectedStyles.includes(style)
                                  ? 'bg-[#18f109] text-black'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              <span>{style}</span>
                              {selectedStyles.includes(style) && <Check className="w-4 h-4" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Filters Bar */}
              {!selectedStyles.includes('Alle stijlen') && selectedStyles.length > 0 && (
                <div className="flex items-center gap-2 pb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Actieve filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedStyles.map((style) => (
                      <span
                        key={style}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                      >
                        {style}
                        <button
                          onClick={() => removeStyle(style)}
                          className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Voice Grid */}
          <div id="voiceover-grid" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {sampleVoices.map((voice) => (
                <VoiceoverCard
                  key={voice.id}
                  voice={voice}
                  isSelected={false}
                  onSelect={() => {}}
                  className="h-full"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Variation 2: Studio Vibes */}
      {selectedVariation === 2 && (
        <div className="min-h-screen bg-[#fcf9f5] dark:bg-gray-950 relative">
          {/* Studio Equipment Pattern Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(24,241,9,0.1) 35px, rgba(24,241,9,0.1) 70px),
                              repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(239,210,67,0.1) 35px, rgba(239,210,67,0.1) 70px)`
            }} />
          </div>

          {/* Floating Studio Elements */}
          <div className="hidden lg:block">
            <div className="absolute left-10 top-32">
              <div className="bg-black/80 dark:bg-white/80 p-6 rounded-xl transform -rotate-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-500 rounded-full animate-pulse" />
                  <div>
                    <p className="text-white dark:text-black font-bold">ON AIR</p>
                    <p className="text-white/60 dark:text-black/60 text-sm">Recording</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute right-20 top-48">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-2 h-16 ${i < 3 ? 'bg-[#18f109]' : i < 4 ? 'bg-[#efd243]' : 'bg-gray-300'} rounded-full`} />
                  ))}
                </div>
                <p className="text-xs text-center">Audio Level</p>
              </div>
            </div>
            <div className="absolute left-40 bottom-32">
              <div className="bg-gradient-to-r from-[#18f109] to-[#efd243] p-1 rounded-full">
                <div className="bg-[#fcf9f5] dark:bg-gray-950 p-4 rounded-full">
                  <Radio className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Content continues with same structure as Variation 1 */}
          {/* ... Rest of the content ... */}
        </div>
      )}

      {/* Variation 3: Radio Broadcast */}
      {selectedVariation === 3 && (
        <div className="min-h-screen bg-gradient-to-br from-[#fcf9f5] via-white to-[#fcf9f5] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative">
          {/* Radio Waves Background */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: `${200 + i * 200}px`,
                  height: `${200 + i * 200}px`,
                  border: '2px solid',
                  borderColor: i % 2 === 0 ? '#18f109' : '#efd243',
                  borderRadius: '50%',
                  opacity: 0.1 - i * 0.02,
                  animation: `pulse ${3 + i}s ease-in-out infinite`
                }}
              />
            ))}
          </div>

          {/* Vintage Radio Elements */}
          <div className="hidden xl:block">
            <div className="absolute left-20 top-40">
              <div className="relative">
                <div className="absolute inset-0 bg-[#ebaa3a]/20 blur-3xl" />
                <div className="relative bg-gradient-to-b from-[#8B4513] to-[#654321] p-8 rounded-lg shadow-2xl">
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-1 bg-[#D4A574] rounded-full" />
                    ))}
                  </div>
                  <div className="w-32 h-32 bg-[#2F1B14] rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-[#1a0f08] rounded-full flex items-center justify-center">
                      <Mic className="w-12 h-12 text-[#D4A574]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content continues with same structure */}
          {/* ... */}
        </div>
      )}

      {/* Variation 4: Audio Spectrum */}
      {selectedVariation === 4 && (
        <div className="min-h-screen bg-gradient-to-b from-white via-[#fcf9f5] to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
          {/* Animated Spectrum Background */}
          <div className="absolute inset-0 flex items-end justify-center opacity-10">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="w-2 mx-0.5 bg-gradient-to-t from-[#18f109] to-[#efd243] rounded-t-full"
                style={{
                  height: `${Math.random() * 200 + 50}px`,
                  animation: `spectrum ${Math.random() * 2 + 1}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* Floating Frequency Display */}
          <div className="hidden lg:block">
            <div className="absolute right-10 top-20">
              <div className="bg-black text-[#18f109] p-4 rounded-lg font-mono">
                <p className="text-xs mb-2">FREQUENCY ANALYZER</p>
                <div className="grid grid-cols-8 gap-1">
                  {[...Array(32)].map((_, i) => (
                    <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-[#18f109]' : 'bg-[#18f109]/30'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content continues with same structure */}
          {/* ... */}
        </div>
      )}

      {/* Variation 5: Minimal Dots */}
      {selectedVariation === 5 && (
        <div className="min-h-screen bg-[#fcf9f5] dark:bg-gray-950 relative">
          {/* Dot Pattern Background */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle, #18f109 1px, transparent 1px),
                                radial-gradient(circle, #efd243 1px, transparent 1px)`,
                backgroundSize: '50px 50px, 50px 50px',
                backgroundPosition: '0 0, 25px 25px'
              }}
            />
          </div>

          {/* Minimal Floating Elements */}
          <div className="hidden lg:block">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + (i % 3) * 30}%`,
                  top: `${20 + Math.floor(i / 3) * 40}%`,
                  animation: `float ${4 + i}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`
                }}
              >
                <div className={`w-4 h-4 rounded-full ${i % 3 === 0 ? 'bg-[#18f109]' : i % 3 === 1 ? 'bg-[#efd243]' : 'bg-[#ebaa3a]'}`} />
              </div>
            ))}
          </div>

          {/* Content continues with same structure */}
          {/* ... */}
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.05); opacity: 0.15; }
        }
        @keyframes spectrum {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 1s;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}