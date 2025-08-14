"use client";

import React, { useState, useEffect } from 'react';
import { FAQSectionClient } from './FAQSection.client';
// TODO: Replace with generated types after running bun payload generate:types
interface FAQ {
  id: string | number;
  question: string;
  answer: any; // Rich text field
  category: string;
  order: number;
  published: boolean;
}
import { LoadingSpinner } from '@/components/common/ui';

interface FAQSettings {
  enabled?: boolean;
  title?: string;
  description?: string;
  showCategories?: boolean;
  itemsToShow?: number;
}

interface FAQData {
  settings: FAQSettings;
  items: FAQ[];
}

export function FAQSectionClientWrapper() {
  const [faqData, setFaqData] = useState<FAQData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFAQData() {
      try {
        const response = await fetch('/api/faq');
        
        if (!response.ok) {
          throw new Error('Failed to fetch FAQ data');
        }

        const data = await response.json();
        setFaqData(data);
      } catch (err) {
        console.error('Error fetching FAQ data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Set fallback data
        setFaqData({
          settings: {
            enabled: true,
            title: 'Veelgestelde vragen',
            description: 'Vind snel antwoorden op de meest gestelde vragen over onze voice-over diensten.',
          },
          items: [],
        });
      } finally {
        setLoading(false);
      }
    }

    fetchFAQData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-2 text-text-secondary">FAQ laden...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error && (!faqData || faqData.items.length === 0)) {
    return null; // Don't render if there's an error and no fallback data
  }

  if (!faqData || !faqData.settings.enabled) {
    return null; // FAQ is disabled
  }

  return <FAQSectionClient settings={faqData.settings} items={faqData.items} />;
}