import { getPayload } from 'payload';
import configPromise from '../payload.config';

async function checkBlogPosts() {
  try {
    const payload = await getPayload({ config: configPromise });

    console.log('\n=== Checking Blog Posts ===\n');

    // Get all blog posts
    const blogPosts = await payload.find({
      collection: 'blog-posts',
      limit: 100,
    });

    console.log(`Total blog posts: ${blogPosts.totalDocs}`);
    console.log(
      `Published posts: ${blogPosts.docs.filter((p: any) => p.status === 'published').length}`
    );
    console.log(`Draft posts: ${blogPosts.docs.filter((p: any) => p.status === 'draft').length}`);

    console.log('\n--- Published Posts ---');
    blogPosts.docs
      .filter((p: any) => p.status === 'published')
      .forEach((post: any) => {
        console.log(
          `- ${post.title} (slug: ${post.slug}, category: ${post.category?.name || 'none'})`
        );
      });

    // Check categories too
    console.log('\n=== Checking Categories ===\n');

    const categories = await payload.find({
      collection: 'categories',
      limit: 100,
    });

    console.log(`Total categories: ${categories.totalDocs}`);
    categories.docs.forEach((cat: any) => {
      console.log(`- ${cat.name} (slug: ${cat.slug})`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkBlogPosts();
