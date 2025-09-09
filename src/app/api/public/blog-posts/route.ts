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
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    // Reduce default depth to 0 to avoid timeout issues
    const depth = parseInt(searchParams.get('depth') || '0');
    const sort = searchParams.get('sort') || '-publishedDate';

    console.log('[Blog Posts API] Starting query with:', { limit, depth, sort });

    // Add timeout check
    console.log('[Blog Posts API] Getting payload instance...');
    const payload = await getPayload({ config: configPromise });
    console.log(`[Blog Posts API] Payload instance created in ${Date.now() - startTime}ms`);

    // First get the posts without deep population to avoid timeout
    const {
      docs: rawDocs,
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
      depth: 0, // Don't populate relationships initially
      sort,
    });

    console.log(`[Blog Posts API] Query completed. Found ${rawDocs.length} posts`);

    // Manually populate only the category field if needed
    const docs = await Promise.all(
      rawDocs.map(async (post) => {
        try {
          if (post.category && typeof post.category === 'string') {
            const category = await payload.findByID({
              collection: 'categories',
              id: post.category,
              depth: 0,
            });
            return { ...post, category };
          }
          return post;
        } catch (err) {
          console.error(`[Blog Posts API] Error populating category for post ${post.id}:`, err);
          return post;
        }
      })
    );

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
