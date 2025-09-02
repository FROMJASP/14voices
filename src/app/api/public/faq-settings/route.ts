import { NextRequest, NextResponse } from 'next/server';
import configPromise from '@payload-config';
import { getPayload } from 'payload';

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const settings = await payload.findGlobal({
      slug: 'faq-settings',
      locale: locale as 'nl' | 'en' | 'all',
      depth: 1,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching FAQ settings:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQ settings' }, { status: 500 });
  }
}
