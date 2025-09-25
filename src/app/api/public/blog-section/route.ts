import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { applyCorsHeaders, handleCorsPreflightRequest } from '@/lib/cors';
import { validateLimit } from '@/lib/query-validation';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
// Increase timeout for production
export const maxDuration = 30; // 30 seconds timeout
const getCachedBlogSectionData = async (limit: number, includeCategories: boolean) => {
  const startTime = Date.now();

  try {
    // Get payload instance
    const payload = await getPayload({ config: configPromise });
    console.log(`[Blog Section] Got payload instance in ${Date.now() - startTime}ms`);

    // Fetch posts
    const postsPromise = payload.find({
      collection: 'blog-posts',
      where: {
        status: {
          equals: 'published',
        },
      },
      limit,
      depth: 1,
      sort: '-publishedDate',
      context: {
        skipCategoryCount: true, // Prevent circular dependency
      },
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
      },
    });

    // Fetch categories if needed
    const categoriesPromise = includeCategories
      ? payload.find({
          collection: 'categories' as any,
          limit: 100,
          depth: 0,
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        })
      : Promise.resolve(null);

    // Execute in parallel
    const [postsResult, categoriesResult] = await Promise.all([postsPromise, categoriesPromise]);

    const posts = postsResult.docs;
    let categories: Array<{
      id: string;
      name: string;
      slug: string;
      icon?: string;
      postsCount: number;
    }> = [];

    if (categoriesResult) {
      // Calculate post counts for categories
      categories = categoriesResult.docs.map((category: any) => {
        const postCount = posts.filter((post: any) => {
          if (typeof post.category === 'object' && post.category?.id === category.id) {
            return true;
          }
          if (typeof post.category === 'string' && post.category === category.id) {
            return true;
          }
          return false;
        }).length;

        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          postsCount: postCount,
        };
      });
    }

    const result = {
      posts,
      categories,
      totalPosts: postsResult.totalDocs,
    };

    console.log(`[Blog Section] Data fetched in ${Date.now() - startTime}ms`);
    return result;
  } catch (error) {
    console.error('[Blog Section API] Error fetching data:', error);
    if (error instanceof Error) {
      console.error('[Blog Section API] Stack:', error.stack);
    }
    throw error;
  }
};

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflightRequest(request) || new NextResponse(null, { status: 200 });
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = validateLimit(searchParams.get('limit'), 8, 20);
    const includeCategories = searchParams.get('categories') !== 'false';

    console.log('[Blog Section API] Fetching data with:', { limit, includeCategories });

    // Increase timeout to 25 seconds for production environments
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 25000); // 25 second timeout
    });

    // Fetch data with timeout
    const dataPromise = getCachedBlogSectionData(limit, includeCategories);

    const data = await Promise.race([dataPromise, timeoutPromise]).catch((error) => {
      if (error.message === 'Request timeout') {
        console.error('[Blog Section API] Request timed out after 25 seconds');
        // Return empty data on timeout but don't throw
        return {
          posts: [],
          categories: [],
          totalPosts: 0,
        };
      }
      // Log the actual error for debugging
      console.error('[Blog Section API] Data fetch error:', error);
      // Return empty data on any error to prevent 500
      return {
        posts: [],
        categories: [],
        totalPosts: 0,
      };
    });

    console.log(`[Blog Section API] Data fetched in ${Date.now() - startTime}ms`);

    let response = NextResponse.json({
      success: true,
      data: data as any,
      timestamp: new Date().toISOString(),
    });

    // Apply CORS headers based on allowed origins
    response = applyCorsHeaders(request, response);

    // Add cache headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

    return response;
  } catch (error) {
    console.error('[Blog Section API] Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    let response = NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog section data',
        message: errorMessage,
        data: {
          posts: [],
          categories: [],
          totalPosts: 0,
        },
      },
      { status: 500 }
    );

    // Apply CORS headers even for error responses
    response = applyCorsHeaders(request, response);

    return response;
  }
}
