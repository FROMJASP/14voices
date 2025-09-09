import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Test DB API: Starting...');

    // Just try to get payload instance
    const payload = await getPayload({ config: configPromise });
    console.log('Test DB API: Payload instance created');

    // Try a simple count query
    const count = await payload.count({
      collection: 'blog-posts',
    });

    console.log('Test DB API: Blog posts count:', count);

    return NextResponse.json({
      success: true,
      blogPostsCount: count.totalDocs,
      message: 'Database connection successful',
    });
  } catch (error) {
    console.error('Test DB API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
