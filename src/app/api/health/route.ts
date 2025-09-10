import { NextResponse } from 'next/server';
import { getCachedPayload } from '@/lib/payload-cached';

export async function GET() {
  const startTime = Date.now();

  try {
    // Test 1: Can we get payload instance?
    const payloadStartTime = Date.now();
    const payload = await getCachedPayload();
    const payloadTime = Date.now() - payloadStartTime;

    // Test 2: Can we query a simple collection?
    const queryStartTime = Date.now();
    const testQuery = await payload.find({
      collection: 'users',
      limit: 1,
      depth: 0,
    });
    const queryTime = Date.now() - queryStartTime;

    // Test 3: Check if blog-posts collection exists
    const blogPostsStartTime = Date.now();
    const blogPostsQuery = await payload.find({
      collection: 'blog-posts',
      limit: 1,
      depth: 0,
      where: {
        status: {
          equals: 'published',
        },
      },
    });
    const blogPostsTime = Date.now() - blogPostsStartTime;

    const totalTime = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timings: {
        totalTime: `${totalTime}ms`,
        payloadInit: `${payloadTime}ms`,
        usersQuery: `${queryTime}ms`,
        blogPostsQuery: `${blogPostsTime}ms`,
      },
      collections: {
        users: {
          found: testQuery.totalDocs,
          time: `${queryTime}ms`,
        },
        blogPosts: {
          found: blogPostsQuery.totalDocs,
          publishedCount: blogPostsQuery.totalDocs,
          time: `${blogPostsTime}ms`,
        },
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
      },
    });
  } catch (error) {
    console.error('[Health Check] Error:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasDbUrl: !!process.env.DATABASE_URL,
          serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
        },
      },
      { status: 500 }
    );
  }
}
