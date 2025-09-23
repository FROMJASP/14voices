import { NextResponse } from 'next/server';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export const GET = async () => {
  try {
    const payload = await getPayloadHMR({ config: configPromise });

    const productions = await payload.find({
      collection: 'productions',
      where: {
        status: {
          equals: 'active',
        },
      },
      sort: 'sortOrder',
      limit: 100,
      locale: 'nl', // Default to Dutch locale
      depth: 2, // Ensure we get all nested data
    });

    // Log the first production to debug
    if (productions.docs && productions.docs.length > 0) {
      console.log('First production from API:', JSON.stringify(productions.docs[0], null, 2));
    }

    return NextResponse.json(productions, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error fetching productions:', error);
    return NextResponse.json({ error: 'Failed to fetch productions' }, { status: 500 });
  }
};
