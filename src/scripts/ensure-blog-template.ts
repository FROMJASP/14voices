import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function ensureBlogTemplate() {
  const payload = await getPayload({ config: configPromise });

  try {
    // Check if blog-post page exists
    const { docs: existingPages } = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'blog-post',
        },
      },
      limit: 1,
    });

    if (existingPages.length === 0) {
      console.log('Creating blog-post template page...');

      // Create the blog-post template page
      await payload.create({
        collection: 'pages',
        data: {
          title: 'Blog Post Template',
          slug: 'blog-post',
          status: 'published',
          layout: [
            {
              blockType: 'blog-post',
              showShareButtons: true,
              showAuthor: true,
            },
          ] as any,
          meta: {
            title: 'Blog Post',
            description: 'Template for blog posts',
          },
        },
      });

      console.log('✅ Blog-post template page created successfully');
    } else {
      console.log('✅ Blog-post template page already exists');

      const templatePage = existingPages[0] as any;

      // Check if it has the blog-post block in layout
      if (!templatePage.layout || templatePage.layout.length === 0) {
        console.log('Adding blog-post block to template...');

        await payload.update({
          collection: 'pages',
          id: templatePage.id,
          data: {
            layout: [
              {
                blockType: 'blog-post',
                showShareButtons: true,
                showAuthor: true,
              },
            ] as any,
          },
        });

        console.log('✅ Blog-post block added to template');
      }
    }
  } catch (error) {
    console.error('Error ensuring blog template:', error);
  }

  process.exit(0);
}

ensureBlogTemplate();
