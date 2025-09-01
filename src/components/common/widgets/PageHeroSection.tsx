import React from 'react';
import type { Page } from '@/payload-types';

interface PageHeroSectionProps {
  hero: NonNullable<Page['hero']>;
}

export function PageHeroSection({ hero }: PageHeroSectionProps) {
  if (!hero || hero.type === 'none') {
    return null;
  }

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background based on hero type */}
      {hero.type === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary" />
      )}
      {hero.type === 'simple' && <div className="absolute inset-0 bg-gray-100" />}
      {hero.type === 'homepage' && <div className="absolute inset-0 bg-white" />}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Process Steps for homepage hero */}
        {hero.type === 'homepage' && hero.processSteps && hero.processSteps.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {hero.processSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </span>
                <span>{step.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        {(hero.title || (hero as any).titleRichText) && (
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 max-w-4xl mx-auto">
              {/* Rich text content would be rendered here */}
              {hero.title || 'Page Title'}
            </h1>
          </div>
        )}

        {/* Subtitle */}
        {hero.subtitle && hero.type !== 'homepage' && (
          <p className="text-xl text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            {hero.subtitle}
          </p>
        )}

        {/* Description for homepage */}
        {hero.type === 'homepage' && (hero.description || (hero as any).descriptionRichText) && (
          <div className="text-center mb-8">
            <div className="text-xl text-gray-600 max-w-2xl mx-auto">
              {/* Rich text content would be rendered here */}
              {hero.description || 'Page description'}
            </div>
          </div>
        )}

        {/* CTA Buttons for homepage */}
        {hero.type === 'homepage' && (
          <div className="flex flex-wrap gap-4 justify-center">
            {hero.primaryButton && hero.primaryButton.text && (
              <a
                href={hero.primaryButton.url || '#'}
                className="px-6 py-3 rounded-lg font-medium transition-colors bg-primary text-white hover:bg-primary/90"
              >
                {hero.primaryButton.text}
              </a>
            )}
            {hero.secondaryButton && hero.secondaryButton.text && (
              <a
                href={hero.secondaryButton.url || '#'}
                className="px-6 py-3 rounded-lg font-medium transition-colors border-2 border-gray-300 hover:border-gray-400"
              >
                {hero.secondaryButton.text}
              </a>
            )}
          </div>
        )}

        {/* CTA for other hero types */}
        {hero.type !== 'homepage' && hero.cta && hero.cta.text && (
          <div className="flex justify-center mt-8">
            <a
              href={hero.cta.link || '#'}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                hero.cta.style === 'primary'
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : hero.cta.style === 'secondary'
                    ? 'bg-secondary text-white hover:bg-secondary/90'
                    : 'border-2 border-gray-300 hover:border-gray-400'
              }`}
            >
              {hero.cta.text}
            </a>
          </div>
        )}

        {/* Stats for homepage */}
        {hero.type === 'homepage' && hero.stats && hero.stats.length > 0 && (
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {hero.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
