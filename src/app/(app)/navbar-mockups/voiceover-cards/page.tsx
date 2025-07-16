'use client';

import React, { useState } from 'react';
import { VoiceoverCard1 } from '@/components/mockups/VoiceoverCard1';
import { VoiceoverCard2 } from '@/components/mockups/VoiceoverCard2';
import { VoiceoverCard3 } from '@/components/mockups/VoiceoverCard3';
import { VoiceoverCard4 } from '@/components/mockups/VoiceoverCard4';
import { VoiceoverCard5 } from '@/components/mockups/VoiceoverCard5';

const mockVoice = {
  id: '1',
  name: 'Gina',
  profilePhoto: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop',
  tags: ['Helder', 'Vriendelijk & Vrolijk', 'Warm & Donker'],
  beschikbaar: true,
  demos: [
    { url: '#', title: 'Demo Reel' },
    { url: '#', title: 'Commercial' },
    { url: '#', title: 'Narration' },
  ],
};

export default function VoiceoverCardMockups() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [currentDesign, setCurrentDesign] = useState(1);

  const designs = [
    {
      id: 1,
      name: 'Spotify-inspired Dark Theme',
      description: 'Music streaming app aesthetic with play button overlay',
      component: VoiceoverCard1,
    },
    {
      id: 2,
      name: 'Glassmorphism',
      description: 'Modern glass effect with backdrop blur and gradients',
      component: VoiceoverCard2,
    },
    {
      id: 3,
      name: 'Minimalist Business',
      description: 'Clean, professional design with audio visualizer',
      component: VoiceoverCard3,
    },
    {
      id: 4,
      name: 'Instagram Stories',
      description: 'Social media inspired vertical layout with interactions',
      component: VoiceoverCard4,
    },
    {
      id: 5,
      name: 'Bento Box',
      description: 'Modular grid layout with different info sections',
      component: VoiceoverCard5,
    },
  ];

  const CurrentCard = designs[currentDesign - 1].component;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Voiceover Card Design Mockups
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
          Choose your preferred design style
        </p>

        {/* Design Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
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

        {/* Current Design Info */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {designs[currentDesign - 1].name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {designs[currentDesign - 1].description}
          </p>
        </div>

        {/* Card Display */}
        <div className="max-w-md mx-auto mb-16">
          <CurrentCard
            voice={mockVoice}
            isSelected={selectedCard === `${currentDesign}-1`}
            onSelect={() => setSelectedCard(`${currentDesign}-1`)}
          />
        </div>

        {/* Grid View - All Designs */}
        <div className="mt-24">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            All Designs Side by Side
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designs.map((design) => {
              const CardComponent = design.component;
              return (
                <div key={design.id}>
                  <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                    {design.name}
                  </h4>
                  <CardComponent
                    voice={mockVoice}
                    isSelected={selectedCard === `grid-${design.id}`}
                    onSelect={() => setSelectedCard(`grid-${design.id}`)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
