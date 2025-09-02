import { NextRequest, NextResponse } from 'next/server';
import configPromise from '@payload-config';
import { getPayload } from 'payload';

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const locale = searchParams.get('locale') || 'en';

    // Fetch FAQ settings
    const settings = await payload.findGlobal({
      slug: 'faq-settings',
      locale: locale as 'nl' | 'en' | 'all',
      depth: 1,
    });

    const where: any = {
      published: {
        equals: true,
      },
    };

    if (categorySlug && categorySlug !== 'all') {
      where.category = {
        equals: categorySlug,
      };
    }

    const result = await payload.find({
      collection: 'faq',
      where,
      sort: 'order',
      locale: locale as 'nl' | 'en' | 'all',
      depth: 1,
      limit: settings?.settings?.itemsToShow || 10,
    });

    return NextResponse.json({
      settings: {
        enabled: settings?.settings?.enabled ?? true,
        title: settings?.settings?.title,
        description: settings?.settings?.description,
        showCategories: settings?.settings?.showCategories ?? false,
        itemsToShow: settings?.settings?.itemsToShow || 10,
      },
      items: result.docs,
    });
  } catch (error) {
    console.error('Error fetching FAQ items:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQ items' }, { status: 500 });
  }
}
