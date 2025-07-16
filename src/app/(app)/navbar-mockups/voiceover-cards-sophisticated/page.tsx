'use client';

import React, { useState } from 'react';
import { VoiceoverCardSophisticated1 } from '@/components/mockups/VoiceoverCardSophisticated1';
import { VoiceoverCardSophisticated2 } from '@/components/mockups/VoiceoverCardSophisticated2';
import { VoiceoverCardSophisticated3 } from '@/components/mockups/VoiceoverCardSophisticated3';
import { VoiceoverCardSophisticated4 } from '@/components/mockups/VoiceoverCardSophisticated4';
import { VoiceoverCardSophisticated5 } from '@/components/mockups/VoiceoverCardSophisticated5';

const mockVoice = {
  id: '1',
  name: 'Gina',
  profilePhoto:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1200&fit=crop',
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
  profilePhoto:
    'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&h=1200&fit=crop',
  beschikbaar: false,
  availabilityText: 'Tot 15 januari',
};

export default function VoiceoverCardSophisticatedMockups() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [currentDesign, setCurrentDesign] = useState(1);
  const [showUnavailable, setShowUnavailable] = useState(false);

  const designs = [
    {
      id: 1,
      name: 'Elegant Portrait',
      description: 'Floating controls with elegant gradient overlays on hover',
      component: VoiceoverCardSophisticated1,
    },
    {
      id: 2,
      name: 'Cinematic Split',
      description: 'Split view design with expandable demo player',
      component: VoiceoverCardSophisticated2,
    },
    {
      id: 3,
      name: 'Glassmorphic',
      description: 'Modern glassmorphism with backdrop blur effects',
      component: VoiceoverCardSophisticated3,
    },
    {
      id: 4,
      name: 'Editorial Magazine',
      description: 'Magazine-style layout with grayscale hover effects',
      component: VoiceoverCardSophisticated4,
    },
    {
      id: 5,
      name: 'Luxury Minimal',
      description: 'Golden ratio proportions with premium aesthetics',
      component: VoiceoverCardSophisticated5,
    },
  ];

  const CurrentCard = designs[currentDesign - 1].component;
  const voiceData = showUnavailable ? unavailableVoice : mockVoice;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Sophisticated Voiceover Cards
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
          Premium designs optimized for grid display with portrait aspect ratio
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
                  availabilityText: index === 3 ? 'Tot 20 januari' : undefined,
                }}
                isSelected={selectedCard === `grid-${currentDesign}-${index}`}
                onSelect={() => setSelectedCard(`grid-${currentDesign}-${index}`)}
              />
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="max-w-2xl mx-auto mb-16 bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sophisticated Design Elements:
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>• Portrait aspect ratio (3:4) optimized for grid layouts</li>
            <li>• Premium hover effects and smooth transitions</li>
            <li>• Integrated audio players with visual feedback</li>
            <li>• Clear photo visibility with artistic treatments</li>
            <li>• All required elements seamlessly integrated</li>
            <li>• Responsive design that scales beautifully</li>
          </ul>
        </div>

        {/* All Designs Preview */}
        <div className="mt-24">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            All Sophisticated Designs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
