import { getPayload } from 'payload';
import configPromise from '../payload.config';

async function clearBlogLayout() {
  try {
    const payload = await getPayload({ config: configPromise });

    // Find the blog page
    const blogPages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'blog',
        },
      },
      limit: 1,
    });

    if (blogPages.docs.length === 0) {
      console.log('Blog page not found');
      return;
    }

    const blogPage = blogPages.docs[0];
    console.log('Found blog page:', blogPage.id);
    console.log('Current layout:', (blogPage as any).layout);

    // Clear the layout field
    const updated = await payload.update({
      collection: 'pages',
      id: blogPage.id,
      data: {
        layout: [],
      } as any,
    });

    console.log('Blog page layout cleared successfully');
    console.log('Updated layout:', (updated as any).layout);
  } catch (error) {
    console.error('Error clearing blog layout:', error);
  } finally {
    process.exit(0);
  }
}

clearBlogLayout();
