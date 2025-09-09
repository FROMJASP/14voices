import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function testBlogQuery() {
  console.log('Starting blog query test...');
  const startTime = Date.now();

  try {
    // Get payload instance
    console.log('Getting payload instance...');
    const payload = await getPayload({ config: configPromise });
    console.log(`Payload instance ready in ${Date.now() - startTime}ms`);

    // Test 1: Simple count query
    console.log('\nTest 1: Counting blog posts...');
    const countStart = Date.now();
    const countResult = await payload.count({
      collection: 'blog-posts',
      where: {
        status: {
          equals: 'published',
        },
      },
    });
    console.log(
      `Count result: ${countResult.totalDocs} published posts (${Date.now() - countStart}ms)`
    );

    // Test 2: Minimal fields query
    console.log('\nTest 2: Fetching minimal fields...');
    const minimalStart = Date.now();
    const minimalResult = await payload.find({
      collection: 'blog-posts',
      where: {
        status: {
          equals: 'published',
        },
      },
      limit: 1,
      depth: 0,
      select: {
        id: true,
        title: true,
        status: true,
      },
    });
    console.log(
      `Minimal query: Found ${minimalResult.docs.length} docs (${Date.now() - minimalStart}ms)`
    );
    console.log('First doc:', minimalResult.docs[0]);

    // Test 3: Query with category relationship
    console.log('\nTest 3: Fetching with category...');
    const categoryStart = Date.now();
    const categoryResult = await payload.find({
      collection: 'blog-posts',
      where: {
        status: {
          equals: 'published',
        },
      },
      limit: 1,
      depth: 1,
      select: {
        id: true,
        title: true,
        categories: true,
        status: true,
      },
    });
    console.log(
      `Category query: Found ${categoryResult.docs.length} docs (${Date.now() - categoryStart}ms)`
    );
    console.log('Categories data:', categoryResult.docs[0]?.categories);

    // Test 4: Full query as used in API
    console.log('\nTest 4: Full API query...');
    const fullStart = Date.now();
    const fullResult = await payload.find({
      collection: 'blog-posts',
      where: {
        status: {
          equals: 'published',
        },
      },
      limit: 8,
      depth: 1,
      sort: '-publishedDate',
      context: {
        skipCategoryCount: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        bannerImage: true,
        categories: true,
        publishedDate: true,
        readingTime: true,
        status: true,
      },
    });
    console.log(`Full query: Found ${fullResult.docs.length} docs (${Date.now() - fullStart}ms)`);

    // Test 5: Check for circular references
    console.log('\nTest 5: Checking data structure...');
    const firstPost = fullResult.docs[0];
    if (firstPost) {
      console.log('Post structure:');
      console.log('- id:', firstPost.id);
      console.log('- title:', firstPost.title);
      console.log('- bannerImage type:', typeof firstPost.bannerImage);
      console.log('- categories type:', typeof firstPost.categories);
    }

    console.log(`\nTotal test time: ${Date.now() - startTime}ms`);
  } catch (error) {
    console.error('Error in blog query test:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    }
  }
}

testBlogQuery();
