'use client';

import React, { useState } from 'react';
import { VoiceoverCardGlassmorphicV3Improved1 } from '@/components/mockups/VoiceoverCardGlassmorphicV3Improved1';
import { VoiceoverCardGlassmorphicV3Improved2 } from '@/components/mockups/VoiceoverCardGlassmorphicV3Improved2';
import { VoiceoverCardGlassmorphicV3Improved3 } from '@/components/mockups/VoiceoverCardGlassmorphicV3Improved3';
import { VoiceoverCardGlassmorphicV3Improved4 } from '@/components/mockups/VoiceoverCardGlassmorphicV3Improved4';
import { VoiceoverCardGlassmorphicV3Improved5 } from '@/components/mockups/VoiceoverCardGlassmorphicV3Improved5';

const mockVoice = {
  id: '1',
  name: 'Gina',
  profilePhoto:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1200&fit=crop',
  tags: ['Helder', 'Vriendelijk & Vrolijk', 'Warm & Donker'],
  beschikbaar: true,
  availabilityText: '15 januari',
  demos: [
    { id: '1', url: '#', title: 'Demo Reel', duration: '1:31' },
    { id: '2', url: '#', title: 'Commercial', duration: '0:45' },
    { id: '3', url: '#', title: 'Narration', duration: '2:15' },
  ],
};

const unavailableVoice = {
  ...mockVoice,
  name: 'Sophie',
  profilePhoto:
    'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&h=1200&fit=crop',
  beschikbaar: false,
  availabilityText: '20 januari',
};

export default function VoiceoverCardGlassmorphicImprovedMockups() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [currentDesign, setCurrentDesign] = useState(1);
  const [showUnavailable, setShowUnavailable] = useState(false);

  const designs = [
    {
      id: 1,
      name: 'Elegant Minimal',
      description: 'Smooth animations with horizontal scrolling tags',
      component: VoiceoverCardGlassmorphicV3Improved1,
    },
    {
      id: 2,
      name: 'Floating Glass',
      description: 'Stacked tags with prominent play button',
      component: VoiceoverCardGlassmorphicV3Improved2,
    },
    {
      id: 3,
      name: 'Side Tags',
      description: 'Vertical tags with circular progress ring',
      component: VoiceoverCardGlassmorphicV3Improved3,
    },
    {
      id: 4,
      name: 'Gradient Glass',
      description: 'Tag carousel with gradient effects',
      component: VoiceoverCardGlassmorphicV3Improved4,
    },
    {
      id: 5,
      name: 'Minimal Elegant',
      description: 'Fade tags with integrated play controls',
      component: VoiceoverCardGlassmorphicV3Improved5,
    },
  ];

  const CurrentCard = designs[currentDesign - 1].component;
  const voiceData = showUnavailable ? unavailableVoice : mockVoice;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Improved Glassmorphic V3 Cards
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
          5 beautifully designed variations with all requested improvements
        </p>

        {/* Design Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {designs.map((design) => (
            <button
              key={design.id}
              onClick={() => setCurrentDesign(design.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentDesign === design.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Design {design.id}
            </button>
          ))}
        </div>

        {/* Toggle Available/Unavailable */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowUnavailable(!showUnavailable)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Show {showUnavailable ? 'Available' : 'Unavailable'} Voice
          </button>
        </div>

        {/* Current Design Info */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {designs[currentDesign - 1].name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {designs[currentDesign - 1].description}
          </p>
        </div>

        {/* Single Card Display */}
        <div className="max-w-sm mx-auto mb-16">
          <CurrentCard
            voice={voiceData}
            isSelected={
              selectedCard === `${currentDesign}-${showUnavailable ? 'unavailable' : 'available'}`
            }
            onSelect={() =>
              setSelectedCard(`${currentDesign}-${showUnavailable ? 'unavailable' : 'available'}`)
            }
          />
        </div>

        {/* Improvements Checklist */}
        <div className="max-w-2xl mx-auto mb-16 bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ✅ All Improvements Implemented:
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>✓ Better typography for voiceover name (larger, bolder)</li>
            <li>
              ✓ {'"Geboekt"'} changed to {'"Geselecteerd"'} when clicked
            </li>
            <li>✓ Tag spacing fixed with animations (scroll, carousel, fade, stack)</li>
            <li>✓ Play button looks like real play button & expands + plays on click</li>
            <li>✓ Status dot is bigger with better visibility</li>
            <li>
              ✓ {'"Bezet"'} renamed to {'"Vanaf [date]"'} with better contrast
            </li>
            <li>✓ 5 unique beautiful design implementations</li>
          </ul>
        </div>

        {/* Grid Preview */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Grid Display Preview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[1, 2, 3, 4].map((index) => (
              <CurrentCard
                key={index}
                voice={{
                  ...mockVoice,
                  id: `grid-${index}`,
                  name: ['Gina', 'Thomas', 'Lisa', 'Mark'][index - 1],
                  profilePhoto: [
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop',
                    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop',
                    'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&h=800&fit=crop',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
                  ][index - 1],
                  beschikbaar: index !== 3,
                  availabilityText: index === 3 ? '25 januari' : undefined,
                }}
                isSelected={selectedCard === `grid-${currentDesign}-${index}`}
                onSelect={() => setSelectedCard(`grid-${currentDesign}-${index}`)}
              />
            ))}
          </div>
        </div>

        {/* All Designs Preview */}
        <div className="mt-24">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            All Improved Designs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {designs.map((design) => {
              const CardComponent = design.component;
              return (
                <div key={design.id}>
                  <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Design {design.id}: {design.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {design.description}
                  </p>
                  <div className="max-w-sm">
                    <CardComponent
                      voice={mockVoice}
                      isSelected={selectedCard === `preview-${design.id}`}
                      onSelect={() => setSelectedCard(`preview-${design.id}`)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
