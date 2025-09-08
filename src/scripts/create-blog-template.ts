import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function createBlogTemplate() {
  const payload = await getPayload({ config: configPromise });

  try {
    // Check if blog-post-template page already exists
    const { docs: existingPages } = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'blog-post-template',
        },
      },
      limit: 1,
    });

    if (existingPages.length > 0) {
      console.log('✅ Blog post template page already exists');
      return;
    }

    // Create the blog post template page
    const templatePage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Blog Post Template',
        slug: 'blog-post-template',
        layout: [
          {
            blockType: 'blog-post-header',
          },
          {
            blockType: 'blog-post-content',
          },
        ],
      },
    });

    console.log('✅ Created blog post template page:', templatePage.id);
    console.log('\nNOTE: This template page controls how ALL blog posts are displayed.');
    console.log('You can edit it in the admin panel under Pages > Blog Post Template');
    console.log('Add any blocks you want to appear on every blog post page.');
  } catch (error) {
    console.error('❌ Error creating blog template:', error);
  }

  process.exit(0);
}

createBlogTemplate();
