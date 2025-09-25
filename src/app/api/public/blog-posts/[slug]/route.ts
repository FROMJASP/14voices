import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { applyCorsHeaders } from '@/lib/cors';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const maxDuration = 30; // 30 seconds timeout

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const payload = await getPayload({ config: configPromise });

    const { docs: posts } = await payload.find({
      collection: 'blog-posts',
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: 'published',
        },
      },
      depth: 2,
      limit: 1,
    });

    if (!posts || posts.length === 0) {
      const response = NextResponse.json(
        {
          success: false,
          error: 'Blog post not found',
        },
        { status: 404 }
      );
      return applyCorsHeaders(request, response);
    }

    const initialResponse = NextResponse.json({
      success: true,
      data: posts[0],
      timestamp: new Date().toISOString(),
    });

    // Apply CORS headers
    const response = applyCorsHeaders(request, initialResponse);

    // Add cache headers for production
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

    return response;
  } catch (error) {
    console.error('[Blog Post API] Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const response = NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog post',
        message: errorMessage,
      },
      { status: 500 }
    );

    return applyCorsHeaders(request, response);
  }
}
