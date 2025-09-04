import { NextResponse } from 'next/server';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@/payload.config';

export async function GET() {
  try {
    const payload = await getPayloadHMR({ config: configPromise });

    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 0,
    });

    return NextResponse.json(siteSettings);
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 });
  }
}
