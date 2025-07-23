'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Check } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { VoiceoverCard } from './VoiceoverCard';
import { motion } from 'motion/react';

import HeroSection from './HeroSection';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

// Sample voice data
const sampleVoices = [
  {
    id: '1',
    name: 'Gina',
    slug: 'gina',
    profilePhoto: null,
    tags: ['Warm', 'Vriendelijk'],
    beschikbaar: true,
    availabilityText: 'Direct beschikbaar',
    demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }],
  },
  {
    id: '2',
    name: 'Sophie',
    slug: 'sophie',
    profilePhoto: null,
    tags: ['Helder', 'Professioneel'],
    beschikbaar: true,
    availabilityText: 'Direct beschikbaar',
    demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }],
  },
  {
    id: '3',
    name: 'Mark',
    slug: 'mark',
    profilePhoto: null,
    tags: ['Autoriteit', 'Zakelijk'],
    beschikbaar: true,
    availabilityText: 'Direct beschikbaar',
    demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }],
  },
  {
    id: '4',
    name: 'Lisa',
    slug: 'lisa',
    profilePhoto: null,
    tags: ['Jong', 'Energiek'],
    beschikbaar: true,
    availabilityText: 'Direct beschikbaar',
    demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }],
  },
  {
    id: '5',
    name: 'Tom',
    slug: 'tom',
    profilePhoto: null,
    tags: ['Warm', 'Betrouwbaar'],
    beschikbaar: true,
    availabilityText: 'Direct beschikbaar',
    demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }],
  },
  {
    id: '6',
    name: 'Eva',
    slug: 'eva',
    profilePhoto: null,
    tags: ['Urban', 'Modern'],
    beschikbaar: true,
    availabilityText: 'Direct beschikbaar',
    demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }],
  },
  {
    id: '7',
    name: 'Jan',
    slug: 'jan',
    profilePhoto: null,
    tags: ['Autoriteit', 'Ervaren'],
    beschikbaar: true,
    availabilityText: 'Direct beschikbaar',
    demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }],
  },
  {
    id: '8',
    name: 'Nina',
    slug: 'nina',
    profilePhoto: null,
    tags: ['Helder', 'Vriendelijk'],
    beschikbaar: true,
    availabilityText: 'Direct beschikbaar',
    demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }],
  },
];

// Extended style tags
const allStyles = [
  'Warm',
  'Vriendelijk',
  'Helder',
  'Professioneel',
  'Autoriteit',
  'Zakelijk',
  'Jong',
  'Energiek',
  'Urban',
  'Modern',
  'Betrouwbaar',
  'Ervaren',
  'Speels',
  'Serieus',
  'Natuurlijk',
  'Karaktervol',
  'Diep',
  'Licht',
];

export function HomepageVoiceover() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Alle stijlen']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
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
      const newStyles = selectedStyles.filter((s) => s !== 'Alle stijlen');
      if (selectedStyles.includes(style)) {
        const filtered = newStyles.filter((s) => s !== style);
        setSelectedStyles(filtered.length === 0 ? ['Alle stijlen'] : filtered);
      } else {
        setSelectedStyles([...newStyles, style]);
      }
    }
  };

  const removeStyle = (style: string) => {
    const filtered = selectedStyles.filter((s) => s !== style);
    setSelectedStyles(filtered.length === 0 ? ['Alle stijlen'] : filtered);
  };

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta`}>
      {/* New Hero Section */}
      <HeroSection />

      {/* Voiceover Section */}
      <motion.div
        id="voiceover-section"
        className="relative bg-white dark:bg-gray-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        {/* Menu Bar with Search */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-900">
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
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showStyleDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Style Dropdown */}
                {showStyleDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-medium text-gray-900 dark:text-white">Filter op stijl</p>
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
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {sampleVoices.map((voice) => (
              <motion.div
                key={voice.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                <VoiceoverCard voice={voice} isSelected={false} onSelect={() => {}} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
