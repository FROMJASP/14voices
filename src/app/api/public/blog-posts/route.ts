import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const depth = parseInt(searchParams.get('depth') || '1');
    const sort = searchParams.get('sort') || '-publishedDate';

    const payload = await getPayload({ config: configPromise });

    const {
      docs,
      totalDocs,
      totalPages,
      page,
      pagingCounter,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = await payload.find({
      collection: 'blog-posts',
      where: {
        status: {
          equals: 'published',
        },
      },
      limit,
      depth,
      sort,
    });

    const response = NextResponse.json({
      docs,
      totalDocs,
      totalPages,
      page,
      pagingCounter,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
