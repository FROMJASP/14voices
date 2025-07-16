'use client';

import React, { useState } from 'react';
import { VoiceoverCardComplete1 } from '@/components/mockups/VoiceoverCardComplete1';
import { VoiceoverCardComplete2 } from '@/components/mockups/VoiceoverCardComplete2';
import { VoiceoverCardComplete3 } from '@/components/mockups/VoiceoverCardComplete3';
import { VoiceoverCardComplete4 } from '@/components/mockups/VoiceoverCardComplete4';
import { VoiceoverCardComplete5 } from '@/components/mockups/VoiceoverCardComplete5';

const mockVoice = {
  id: '1',
  name: 'Gina',
  profilePhoto: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop',
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
  beschikbaar: false,
  availabilityText: 'Tot 15 januari',
};

export default function VoiceoverCardCompleteMockups() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [currentDesign, setCurrentDesign] = useState(1);
  const [showUnavailable, setShowUnavailable] = useState(false);

  const designs = [
    {
      id: 1,
      name: 'Modern Cover Style',
      description: 'Full-width cover image with integrated player and demo selector',
      component: VoiceoverCardComplete1,
    },
    {
      id: 2,
      name: 'Compact Professional',
      description: 'Horizontal layout with inline controls and progress indicators',
      component: VoiceoverCardComplete2,
    },
    {
      id: 3,
      name: 'Side-by-Side',
      description: 'Split layout with profile info and demo list with individual players',
      component: VoiceoverCardComplete3,
    },
    {
      id: 4,
      name: 'Tabbed Interface',
      description: 'Organized with tabs for info and demos, draggable playhead',
      component: VoiceoverCardComplete4,
    },
    {
      id: 5,
      name: 'Minimal List',
      description: 'Compact expandable list with inline players',
      component: VoiceoverCardComplete5,
    },
  ];

  const CurrentCard = designs[currentDesign - 1].component;
  const voiceData = showUnavailable ? unavailableVoice : mockVoice;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Complete Voiceover Card Designs
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
          All designs include: Play controls, Playhead, 3 Demos, Availability status, Tags, and Book
          button
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

        {/* Feature Checklist */}
        <div className="max-w-2xl mx-auto mb-16">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Required Features Included:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              '✓ Play/Pause Button',
              '✓ Progress Bar with Playhead',
              '✓ 3 Demo Options',
              '✓ Availability Status',
              '✓ Voice Tags',
              '✓ Book Button',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* All Designs Preview */}
        <div className="mt-24">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            All Designs Preview
          </h3>
          <div className="space-y-12">
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
