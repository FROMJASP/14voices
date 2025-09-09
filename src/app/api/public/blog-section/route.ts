import { NextRequest, NextResponse } from 'next/server';
import { getCachedPayload } from '@/lib/payload-cached';

const getCachedBlogSectionData = async (limit: number, includeCategories: boolean) => {
  const startTime = Date.now();

  try {
    // Use cached payload instance
    const payload = await getCachedPayload();
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
    const limit = parseInt(searchParams.get('limit') || '8');
    const includeCategories = searchParams.get('categories') !== 'false';

    console.log('[Blog Section API] Fetching data with:', { limit, includeCategories });

    // Increase timeout to 15 seconds to account for initial payload instance creation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 15000); // 15 second timeout
    });

    // Fetch data with timeout
    const dataPromise = getCachedBlogSectionData(limit, includeCategories);

    const data = await Promise.race([dataPromise, timeoutPromise]).catch((error) => {
      if (error.message === 'Request timeout') {
        console.error('[Blog Section API] Request timed out after 15 seconds');
        // Return empty data on timeout
        return {
          posts: [],
          categories: [],
          totalPosts: 0,
        };
      }
      throw error;
    });

    console.log(`[Blog Section API] Data fetched in ${Date.now() - startTime}ms`);

    const response = NextResponse.json({
      success: true,
      data: data as any,
      timestamp: new Date().toISOString(),
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    // Add cache headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

    return response;
  } catch (error) {
    console.error('[Blog Section API] Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const response = NextResponse.json(
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

    // Add CORS headers even for error responses
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  }
}
