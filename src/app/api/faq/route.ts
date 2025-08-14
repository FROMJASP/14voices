import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { headers } from 'next/headers';
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

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });
    
    // Check if this is an admin request
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    const isAdminRequest = authHeader?.startsWith('JWT ');
    
    // Parse query params
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'order';
    
    // Get site settings for FAQ configuration
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    });

    // @ts-expect-error - FAQ settings will be available after schema regeneration
    const faqSettings: FAQSettings = siteSettings?.faq || {
      enabled: true,
      title: 'Veelgestelde vragen',
      description: 'Vind snel antwoorden op de meest gestelde vragen over onze voice-over diensten.',
      itemsToShow: 10,
    };

    // For frontend requests, check if FAQ is enabled
    if (!isAdminRequest && !faqSettings.enabled) {
      return NextResponse.json({
        settings: { ...faqSettings, enabled: false },
        items: [],
      });
    }

    // Build where clause - only filter by published for non-admin requests
    const whereClause: any = {};
    if (!isAdminRequest) {
      whereClause.published = { equals: true };
    }

    // Fetch FAQ items from the database
    const { docs: faqItems } = await payload.find({
      collection: 'faq' as any, // Type assertion until types are generated
      where: whereClause,
      sort,
      limit: isAdminRequest ? limit : (faqSettings.itemsToShow || 10),
    });

    // Return appropriate response based on request type
    if (isAdminRequest) {
      // Admin panel expects standard Payload response
      return NextResponse.json({
        docs: faqItems as FAQType[],
        totalDocs: faqItems.length,
        limit,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      });
    } else {
      // Frontend expects custom response
      return NextResponse.json({
        settings: faqSettings,
        items: faqItems as FAQType[],
      });
    }
  } catch (error) {
    console.error('Failed to fetch FAQ data:', error);
    
    // Return default data on error
    return NextResponse.json({
      settings: {
        enabled: true,
        title: 'Veelgestelde vragen',
        description: 'Vind snel antwoorden op de meest gestelde vragen over onze voice-over diensten.',
      },
      items: [],
      docs: [], // For admin compatibility
    });
  }
}