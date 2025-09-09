import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';

// Don't cache the payload instance - it might be causing issues
const getCachedPayload = async () => {
  return await getPayload({ config: configPromise });
};

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
    const depth = parseInt(searchParams.get('depth') || '1'); // Back to depth 1 for category population
    const sort = searchParams.get('sort') || '-publishedDate';

    console.log('[Blog Posts API] Starting query with:', { limit, depth, sort });

    // Get payload instance with caching
    console.log('[Blog Posts API] Getting payload instance...');
    const payload = await getCachedPayload();
    console.log(`[Blog Posts API] Payload instance ready in ${Date.now() - startTime}ms`);

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Query timeout')), 5000); // 5 second timeout
    });

    // Race between query and timeout
    const queryPromise = payload.find({
      collection: 'blog-posts',
      where: {
        status: {
          equals: 'published',
        },
      },
      limit,
      depth,
      sort,
      context: {
        skipCategoryCount: true, // Prevent circular dependency
      },
      // Optimize query by selecting only needed fields
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        bannerImage: true,
        category: true,
        publishedDate: true,
        readingTime: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const result = await Promise.race([queryPromise, timeoutPromise]).catch((error) => {
      if (error.message === 'Query timeout') {
        console.error('[Blog Posts API] Query timed out after 5 seconds');
        // Return empty result on timeout
        return {
          docs: [],
          totalDocs: 0,
          totalPages: 0,
          page: 1,
          pagingCounter: 1,
          hasPrevPage: false,
          hasNextPage: false,
          prevPage: null,
          nextPage: null,
        };
      }
      throw error;
    });

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
    } = result as any;

    console.log(`[Blog Posts API] Query completed in ${Date.now() - startTime}ms. Found ${docs.length} posts`);

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
    
    // Add cache headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

    return response;
  } catch (error) {
    console.error('[Blog Posts API] Error:', error);
    
    // Return a more informative error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: 'Failed to fetch blog posts',
        message: errorMessage,
        docs: [],
        totalDocs: 0,
      }, 
      { status: 500 }
    );
  }
}
