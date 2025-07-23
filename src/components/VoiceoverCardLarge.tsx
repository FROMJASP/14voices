'use client';

import React from 'react';
import { Play, Star, Clock } from 'lucide-react';

interface Demo {
  id: string;
  title: string;
  url: string;
  duration?: string;
}

interface Voice {
  id: string;
  name: string;
  slug: string;
  profilePhoto?: string | null;
  tags: string[];
  beschikbaar: boolean;
  availabilityText?: string;
  demos?: Demo[];
}

interface VoiceoverCardLargeProps {
  voice: Voice;
  isSelected: boolean;
  onSelect: (id: string) => void;
  className?: string;
}

export function VoiceoverCardLarge({ voice, isSelected, onSelect, className = '' }: VoiceoverCardLargeProps) {
  return (
    <div
      onClick={() => onSelect(voice.id)}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden ${
        isSelected ? 'ring-2 ring-[#18f109]' : ''
      } ${className}`}
    >
      {/* Profile Image */}
      <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
        {voice.profilePhoto ? (
          <img 
            src={voice.profilePhoto} 
            alt={voice.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl lg:text-6xl font-bold text-gray-400 dark:text-gray-500">
              {voice.name.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
          <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-0 hover:scale-100 transition-transform">
            <Play className="w-6 h-6 text-gray-900 ml-1" />
          </button>
        </div>

        {/* Availability Badge */}
        {voice.beschikbaar && (
          <div className="absolute top-3 right-3 px-3 py-1.5 bg-[#18f109] text-black text-sm font-medium rounded-full shadow-sm">
            {voice.availabilityText || 'Beschikbaar'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {voice.name}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {voice.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Demo Info */}
        {voice.demos && voice.demos.length > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#efd243]" />
              <span>4.9</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{voice.demos[0].duration || '0:30'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}