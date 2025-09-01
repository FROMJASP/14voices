import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET() {
  try {
    const payload = await getPayload({ config });

    // Get FAQ settings from HomepageSettings global
    const homepageSettings = await payload.findGlobal({
      slug: 'homepage-settings',
      depth: 0,
    });

    // Get FAQ items
    const faqs = await payload.find({
      collection: 'faq',
      where: {
        published: {
          equals: true,
        },
      },
      sort: 'order',
      limit: 100,
    });

    const faqSettings = homepageSettings?.faqSection || {};

    return NextResponse.json({
      settings: {
        enabled: faqSettings.enabled ?? false,
        title: faqSettings.title || 'Veelgestelde vragen',
        description:
          faqSettings.description ||
          'Vind snel antwoorden op de meest gestelde vragen over onze voice-over diensten.',
        showCategories: faqSettings.showCategories ?? false,
        itemsToShow: faqSettings.itemsToShow || 10,
      },
      items: faqs.docs || [],
    });
  } catch (error) {
    console.error('Error fetching FAQ data:', error);

    // Return a valid response even on error
    return NextResponse.json({
      settings: {
        enabled: false,
        title: 'Veelgestelde vragen',
        description:
          'Vind snel antwoorden op de meest gestelde vragen over onze voice-over diensten.',
        showCategories: false,
        itemsToShow: 10,
      },
      items: [],
    });
  }
}
