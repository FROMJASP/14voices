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
        const categories =
          post.categories
            ?.map((c: any) => c.category)
            .filter(Boolean)
            .join(', ') || 'none';
        console.log(`- ${post.title} (slug: ${post.slug}, categories: ${categories})`);
      });

    // Categories are embedded in blog posts, not a separate collection
    console.log('\n=== Checking Categories ===\n');

    // Extract unique categories from blog posts
    const categorySet = new Set<string>();
    blogPosts.docs.forEach((post: any) => {
      if (post.categories && Array.isArray(post.categories)) {
        post.categories.forEach((catItem: any) => {
          if (catItem.category) {
            categorySet.add(catItem.category);
          }
        });
      }
    });

    console.log(`Unique categories found: ${categorySet.size}`);
    categorySet.forEach((cat) => {
      console.log(`- ${cat}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkBlogPosts();
