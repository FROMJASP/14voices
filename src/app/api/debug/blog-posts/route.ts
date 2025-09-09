import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { NextResponse } from 'next/server';

export async function GET() {
  const startTime = Date.now();
  const logs: string[] = [];

  try {
    logs.push(`[${Date.now() - startTime}ms] Starting debug blog posts API`);

    // Step 1: Get payload instance
    const payload = await getPayload({ config: configPromise });
    logs.push(`[${Date.now() - startTime}ms] Payload instance created`);

    // Step 2: Try a simple count first
    const count = await payload.count({
      collection: 'blog-posts',
    });
    logs.push(
      `[${Date.now() - startTime}ms] Count query completed: ${count.totalDocs} total posts`
    );

    // Step 3: Try fetching without depth
    const simpleQuery = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          {
            status: {
              equals: 'published',
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
      limit: 1,
      depth: 0, // No relationships
    });
    logs.push(
      `[${Date.now() - startTime}ms] Simple query completed: ${simpleQuery.docs.length} published posts found`
    );

    // Step 4: Try with depth 1
    const depth1Query = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          {
            status: {
              equals: 'published',
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
      limit: 1,
      depth: 1,
    });
    logs.push(`[${Date.now() - startTime}ms] Depth 1 query completed`);

    // Step 5: Try with depth 2 (original query)
    const depth2Query = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          {
            status: {
              equals: 'published',
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
      limit: 1,
      depth: 2,
    });
    logs.push(`[${Date.now() - startTime}ms] Depth 2 query completed`);

    // Step 6: Check for posts with different _status values
    const draftStatusQuery = await payload.find({
      collection: 'blog-posts',
      where: {
        _status: {
          equals: 'draft',
        },
      },
      limit: 5,
      depth: 0,
    });
    logs.push(
      `[${Date.now() - startTime}ms] Draft status query completed: ${draftStatusQuery.docs.length} draft posts found`
    );

    // Step 7: Check all posts regardless of status
    const allPostsQuery = await payload.find({
      collection: 'blog-posts',
      limit: 5,
      depth: 0,
    });
    logs.push(
      `[${Date.now() - startTime}ms] All posts query completed: ${allPostsQuery.docs.length} posts found`
    );

    return NextResponse.json({
      success: true,
      logs,
      results: {
        totalPosts: count.totalDocs,
        simpleQuery: simpleQuery.docs.length,
        depth1Query: depth1Query.docs.length,
        depth2Query: depth2Query.docs.length,
        draftPosts: draftStatusQuery.docs.length,
        allPosts: allPostsQuery.docs.length,
        samplePost: simpleQuery.docs[0] || null,
        sampleAllPosts: allPostsQuery.docs.map(post => ({
          id: post.id,
          title: post.title,
          status: post.status,
          _status: post._status,
        })),
      },
    });
  } catch (error) {
    logs.push(
      `[${Date.now() - startTime}ms] ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`
    );

    return NextResponse.json(
      {
        success: false,
        logs,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
