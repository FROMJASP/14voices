import { NextResponse } from 'next/server';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';

export const GET = async () => {
  try {
    const payload = await getPayloadHMR({ config: configPromise });

    const extraServices = await payload.find({
      collection: 'extra-services',
      where: {
        status: {
          equals: 'active',
        },
      },
      sort: 'sortOrder',
      limit: 100,
      depth: 1, // To include relationships
      locale: 'nl', // Default to Dutch locale
    });

    return NextResponse.json(extraServices);
  } catch (error) {
    console.error('Error fetching extra services:', error);
    return NextResponse.json({ error: 'Failed to fetch extra services' }, { status: 500 });
  }
};
