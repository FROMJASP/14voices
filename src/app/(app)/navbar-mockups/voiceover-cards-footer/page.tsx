'use client';

import React, { useState } from 'react';
import { VoiceoverCardFooterStyle1 } from '@/components/mockups/VoiceoverCardFooterStyle1';
import { VoiceoverCardFooterStyle2 } from '@/components/mockups/VoiceoverCardFooterStyle2';
import { VoiceoverCardFooterStyle3 } from '@/components/mockups/VoiceoverCardFooterStyle3';
import { VoiceoverCardFooterStyle4 } from '@/components/mockups/VoiceoverCardFooterStyle4';
import { VoiceoverCardFooterStyle5 } from '@/components/mockups/VoiceoverCardFooterStyle5';

const mockVoice = {
  id: '1',
  name: 'Gina',
  profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop',
  tags: ['Helder', 'Vriendelijk & Vrolijk', 'Warm & Donker'],
  beschikbaar: true,
  availabilityText: 'Tot 15 december',
  demos: [
    { id: '1', url: '#', title: 'Demo Reel', duration: '1:31' },
    { id: '2', url: '#', title: 'Commercial', duration: '0:45' },
    { id: '3', url: '#', title: 'Narration', duration: '2:15' },
  ],
};

const unavailableVoice = {
  ...mockVoice,
  name: 'Sophie',
  profilePhoto: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&h=800&fit=crop',
  beschikbaar: false,
  availabilityText: 'Tot 15 januari',
};

export default function VoiceoverCardFooterMockups() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [currentDesign, setCurrentDesign] = useState(1);
  const [showUnavailable, setShowUnavailable] = useState(false);

  const designs = [
    {
      id: 1,
      name: 'Clean with Full Photo',
      description: 'Large photo with footer-style black button and clean layout',
      component: VoiceoverCardFooterStyle1,
    },
    {
      id: 2,
      name: 'Newsletter Layout',
      description: 'Side-by-side layout inspired by footer newsletter section',
      component: VoiceoverCardFooterStyle2,
    },
    {
      id: 3,
      name: 'Minimal Border Style',
      description: 'Strong borders and uppercase text like footer links',
      component: VoiceoverCardFooterStyle3,
    },
    {
      id: 4,
      name: 'Round Photo Clean',
      description: 'Centered design with round photo and clean typography',
      component: VoiceoverCardFooterStyle4,
    },
    {
      id: 5,
      name: 'Full Width Hero',
      description: 'Full-width photo with overlay text like a hero section',
      component: VoiceoverCardFooterStyle5,
    },
  ];

  const CurrentCard = designs[currentDesign - 1].component;
  const voiceData = showUnavailable ? unavailableVoice : mockVoice;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Footer-Inspired Voiceover Cards
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
          Clean designs inspired by your footer aesthetic with prominent photos
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

        {/* Card Display */}
        <div className="max-w-2xl mx-auto mb-16">
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

        {/* Key Features */}
        <div className="max-w-2xl mx-auto mb-16 bg-[#fcf9f5] dark:bg-gray-900 p-8 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Footer-Inspired Elements:
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>• Clean typography using Plus Jakarta Sans</li>
            <li>• Black/white button styling with hover states</li>
            <li>• Minimal color palette (#fcf9f5 background)</li>
            <li>• Clear photo presentation</li>
            <li>• Border and spacing patterns from footer</li>
            <li>• Arrow icons and transitions</li>
          </ul>
        </div>

        {/* All Designs Preview */}
        <div className="mt-24">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            All Footer-Inspired Designs
          </h3>
          <div className="space-y-12">
            {designs.map((design) => {
              const CardComponent = design.component;
              return (
                <div key={design.id}>
                  <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {design.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {design.description}
                  </p>
                  <CardComponent
                    voice={mockVoice}
                    isSelected={selectedCard === `preview-${design.id}`}
                    onSelect={() => setSelectedCard(`preview-${design.id}`)}
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
