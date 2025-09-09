import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

// Create cached payload instance getter
const getCachedPayload = unstable_cache(
  async () => {
    return await getPayload({ config: configPromise });
  },
  ['payload-instance'],
  {
    revalidate: 300, // Cache for 5 minutes
  }
);

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
    const limit = parseInt(searchParams.get('limit') || '100');
    const depth = parseInt(searchParams.get('depth') || '0'); // Reduce depth to avoid timeouts

    const payload = await getCachedPayload();

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Query timeout')), 3000); // 3 second timeout for categories
    });

    // Race between query and timeout
    const queryPromise = payload.find({
      collection: 'categories' as any,
      limit,
      depth,
      // Only select needed fields
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        description: true,
      },
    });

    const result = await Promise.race([queryPromise, timeoutPromise]).catch((error) => {
      if (error.message === 'Query timeout') {
        console.error('[Categories API] Query timed out after 3 seconds');
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
    response.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');

    return response;
  } catch (error) {
    console.error('[Categories API] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        message: errorMessage,
        docs: [],
        totalDocs: 0,
      }, 
      { status: 500 }
    );
  }
}
