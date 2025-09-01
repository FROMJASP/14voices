import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { FAQSectionClient } from './FAQSection.client';
// TODO: Replace with generated types after running bun payload generate:types
interface FAQType {
  id: string | number;
  question: string;
  answer: any; // Rich text field
  category: string;
  order: number;
  published: boolean;
}

interface FAQSettings {
  enabled?: boolean;
  title?: string;
  description?: string;
  showCategories?: boolean;
  itemsToShow?: number;
}

async function getFAQData() {
  try {
    const payload = await getPayload({ config: configPromise });
    
    // Get FAQ settings from the dedicated FAQ settings global
    const faqSettingsGlobal = await payload.findGlobal({
      slug: 'faq-settings',
    });

    // @ts-expect-error - FAQ settings will be available after schema regeneration
    const faqSettings: FAQSettings = faqSettingsGlobal?.settings || {
      enabled: true,
      title: 'Veelgestelde vragen',
      description: 'Vind snel antwoorden op de meest gestelde vragen over onze voice-over diensten.',
      itemsToShow: 10,
    };

    if (!faqSettings.enabled) {
      return null;
    }

    // Fetch published FAQ items from the database
    const { docs: faqItems } = await payload.find({
      collection: 'faq' as any, // Type assertion until types are generated
      where: {
        published: {
          equals: true,
        },
      },
      sort: 'order',
      limit: faqSettings.itemsToShow || 10,
    });

    return {
      settings: faqSettings,
      items: faqItems as FAQType[],
    };
  } catch (error) {
    console.error('Failed to fetch FAQ data:', error);
    // Return default data on error
    return {
      settings: {
        enabled: true,
        title: 'Veelgestelde vragen',
        description: 'Vind snel antwoorden op de meest gestelde vragen over onze voice-over diensten.',
      },
      items: [],
    };
  }
}

export async function FAQSection() {
  const faqData = await getFAQData();

  if (!faqData || !faqData.settings.enabled) {
    return null;
  }

  return <FAQSectionClient settings={faqData.settings} items={faqData.items} />;
}