'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Star,
  Zap,
  Shield,
  Sparkles,
  Crown,
  Heart,
  Users,
  Smile,
  Briefcase,
  Mic,
  Flame,
  Sun,
  Leaf,
  Rocket,
  Mountain,
} from 'lucide-react';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import { VoiceoverCard } from './VoiceoverCard';
import { RotatingText } from './RotatingText';
import { useVoiceover } from '@/contexts/VoiceoverContext';
import type { TransformedVoiceover } from '@/types/voiceover';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

interface VoiceoverSearchFieldDesignProps {
  voiceovers: (TransformedVoiceover & {
    tags: string[];
    color: string;
    beschikbaar: boolean;
    availabilityText: string;
  })[];
}

// Icon mapping for style tags
const styleIcons: Record<string, React.ElementType> = {
  Autoriteit: Crown,
  Helder: Sun,
  'Jeugdig & Fris': Sparkles,
  Kwaliteit: Shield,
  Urban: Flame,
  'Vriendelijk & Vrolijk': Smile,
  'Warm & Donker': Heart,
  Zakelijk: Briefcase,
  Eigentijds: Star,
  'Gezellig & Genieten': Users,
  Naturel: Leaf,
  Vernieuwend: Rocket,
  Stoer: Mountain,
};

export function VoiceoverSearchFieldDesign({ voiceovers }: VoiceoverSearchFieldDesignProps) {
  const { selectedVoiceover, setSelectedVoiceover } = useVoiceover();
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

  // Randomize voiceovers on initial load
  const randomizedVoiceovers = useMemo(() => {
    const shuffled = [...voiceovers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [voiceovers]);

  // Extract all unique style tags from voiceovers
  const allStyles = useMemo(() => {
    const tags = new Set<string>();
    voiceovers.forEach((voice) => {
      voice.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [voiceovers]);
  // Add floating animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes float-delayed {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slide {
        0% { transform: translate(0, 0); }
        100% { transform: translate(8rem, 8rem); }
      }
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-float {
        animation: float 4s ease-in-out infinite;
      }
      .animate-float-delayed {
        animation: float-delayed 4s ease-in-out infinite;
        animation-delay: 1s;
      }
      .animate-fadeInUp {
        animation: fadeInUp 1s ease-out forwards;
      }
      .animate-slideInUp {
        animation: slideInUp 0.5s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Alle stijlen']);

  // Filter voiceovers based on selected styles
  const filteredVoiceovers = useMemo(() => {
    return randomizedVoiceovers.filter((voice) => {
      // Filter by selected styles
      if (!selectedStyles.includes('Alle stijlen') && selectedStyles.length > 0) {
        const hasSelectedStyle =
          voice.styleTags?.some(({ tag, customTag }) =>
            selectedStyles.includes(customTag || tag)
          ) || false;
        if (!hasSelectedStyle) return false;
      }

      return true;
    });
  }, [randomizedVoiceovers, selectedStyles]);

  // Handle voiceover selection for booking
  const handleVoiceoverSelect = (voice: TransformedVoiceover) => {
    setSelectedVoiceover({
      id: voice.id,
      name: voice.name,
      profilePhoto: voice.profilePhoto?.url,
      styleTags: voice.styleTags?.map(({ tag, customTag }) => customTag || tag) || [],
    });
    // Scroll to price calculator section
    const priceSection = document.getElementById('price-calculator');
    if (priceSection) {
      priceSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen bg-white dark:bg-background ${plusJakarta.variable} ${instrumentSerif.variable} font-plus-jakarta`}
    >
      <div className="relative">
        {/* Background Pattern - Minimal and clean */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          {/* Very subtle accent grid only */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#18f10903_1px,transparent_1px),linear-gradient(to_bottom,#18f10903_1px,transparent_1px)] bg-[size:8rem_8rem] animate-[slide_20s_linear_infinite] [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%)]" />
        </div>

        {/* Floating Elements - SVG Illustrations */}
        <div className="hidden xl:block z-10 relative">
          {/* Left Side - Podcast SVG */}
          <div className="absolute left-16 top-48 animate-float">
            <Image
              src="/undraw_podcast.svg"
              alt="Podcast illustration"
              width={320}
              height={320}
              className="w-80 h-80 opacity-100 dark:opacity-90 brightness-90 contrast-110"
            />
          </div>

          {/* Right Side - Listening SVG */}
          <div className="absolute right-16 top-48 animate-float-delayed">
            <Image
              src="/undraw_listening.svg"
              alt="Listening illustration"
              width={256}
              height={256}
              className="w-64 h-64 opacity-100 dark:opacity-90 brightness-90 contrast-110"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 lg:pt-20 pb-4 sm:pb-8 lg:pb-16 relative z-20">
          {/* Process Steps */}
          <div className="flex items-center justify-center gap-4 mb-4 sm:mb-8 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-8 h-8 bg-[#18f109] text-black rounded-full flex items-center justify-center font-semibold">
                1
              </span>
              <span className="text-title font-medium">Boek je stem</span>
            </div>
            <div className="w-8 h-0.5 bg-border" />
            <div className="flex items-center gap-2 text-sm">
              <span className="w-8 h-8 bg-white dark:bg-card border border-border rounded-full flex items-center justify-center font-semibold text-normal">
                2
              </span>
              <span className="text-normal">Upload script</span>
            </div>
            <div className="hidden sm:block w-8 h-0.5 bg-border" />
            <div className="flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
              <span className="w-8 h-8 bg-white dark:bg-card border border-border rounded-full flex items-center justify-center font-semibold text-normal">
                3
              </span>
              <span className="text-normal">Ontvang audio</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center mb-4 sm:mb-8 animate-fadeInUp">
            <span className="block font-instrument-serif text-7xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal text-title leading-[0.9] tracking-tight">
              De{' '}
              <span className="text-[#18f109] italic hover:text-[#18f109]/80 transition-colors duration-300">
                ideale
              </span>{' '}
              stem
            </span>
            <span className="block font-plus-jakarta text-3xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-title mt-2 sm:mt-4 tracking-normal leading-tight text-center">
              voor jouw{' '}
              <RotatingText
                text={[
                  'project',
                  'commercial',
                  'bedrijfsvideo',
                  'audio tour',
                  'serie of film',
                  'verhaal',
                  'instructievideo',
                ]}
                duration={3000}
              />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-lg lg:text-xl text-center text-normal mb-6 sm:mb-10 lg:mb-12 max-w-2xl mx-auto leading-relaxed tracking-normal">
            Op zoek naar een professioneel voice-over? Vind een Nederlandse stemacteur die jouw merk{' '}
            <span className="font-medium text-title">laat spreken</span>!
          </p>

          {/* Stats from V1 */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 lg:gap-8 mb-4 sm:mb-8 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Zap className="w-5 h-5 sm:w-5 sm:h-5 text-[#18f109]" />
              <span className="text-sm sm:text-base font-semibold whitespace-nowrap text-normal">
                &lt;48u levering
              </span>
            </div>
            <div className="w-px h-5 bg-border" />
            <a
              href="https://www.feedbackcompany.com/nl-nl/reviews/fourteen-voices/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#efd243] transition-colors"
            >
              <Star className="w-5 h-5 sm:w-5 sm:h-5 text-[#efd243]" />
              <span className="text-sm sm:text-base font-semibold whitespace-nowrap text-normal">
                9.1/10 beoordeeld
              </span>
            </a>
            <div className="w-px h-5 bg-border" />
            <div className="flex items-center gap-1.5">
              <Shield className="w-5 h-5 sm:w-5 sm:h-5 text-[#ebaa3a]" />
              <span className="text-sm sm:text-base font-semibold whitespace-nowrap text-normal">
                100% garantie
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="sticky top-0 z-40 bg-[#fcf9f5] dark:bg-[#1a1a1a] border-b border-border">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="flex items-center gap-2 py-4 md:justify-center">
              {/* All Styles Tab */}
              <button
                onClick={() => setSelectedStyles(['Alle stijlen'])}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-out whitespace-nowrap transform hover:scale-105 active:scale-95 cursor-pointer animate-slideInUp ${
                  selectedStyles.includes('Alle stijlen')
                    ? 'bg-[#18f109] text-black shadow-md hover:shadow-lg hover:bg-[#18f109]/90 scale-105'
                    : 'bg-card border border-border hover:bg-accent hover:border-accent text-normal hover:shadow-sm'
                }`}
                style={{ animationDelay: '0ms' }}
              >
                Alle stijlen
              </button>

              {/* Style Tabs */}
              {allStyles.map((style, index) => {
                const Icon = styleIcons[style] || Mic;
                return (
                  <button
                    key={style}
                    onClick={() => {
                      if (selectedStyles.includes('Alle stijlen')) {
                        setSelectedStyles([style]);
                      } else if (selectedStyles.includes(style)) {
                        const filtered = selectedStyles.filter((s) => s !== style);
                        setSelectedStyles(filtered.length === 0 ? ['Alle stijlen'] : filtered);
                      } else {
                        setSelectedStyles([...selectedStyles, style]);
                      }
                    }}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-out whitespace-nowrap transform hover:scale-105 active:scale-95 cursor-pointer animate-slideInUp flex items-center gap-2 ${
                      selectedStyles.includes(style)
                        ? 'bg-[#18f109] text-black shadow-md hover:shadow-lg hover:bg-[#18f109]/90 scale-105'
                        : 'bg-card border border-border hover:bg-accent hover:border-accent text-normal hover:shadow-sm'
                    }`}
                    style={{
                      animationDelay: `${(index + 1) * 50}ms`,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {style}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Voice Grid */}
      <div id="voiceover-grid" className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredVoiceovers.map((voice, index) => (
              <div
                key={voice.id}
                className="transition-all duration-500 ease-out"
                style={{
                  animation: `fadeInUp 0.6s ease-out forwards`,
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                }}
              >
                <VoiceoverCard
                  voice={{
                    ...voice,
                    tags: voice.tags || [],
                    beschikbaar: true,
                    availabilityText: 'Direct beschikbaar',
                    demos:
                      voice.demos?.map((demo) => ({
                        id: demo.id,
                        title: demo.title,
                        url: demo.audioFile.url,
                        duration: demo.duration || '0:30',
                      })) || [],
                    profilePhoto: voice.profilePhoto?.url || null,
                  }}
                  isSelected={selectedVoiceover?.id === voice.id}
                  onSelect={() => handleVoiceoverSelect(voice)}
                  currentlyPlayingId={currentlyPlayingId}
                  onPlayingChange={setCurrentlyPlayingId}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
