import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { notFound } from 'next/navigation';
import type { BlogPost, Page } from '@/payload-types';
import { PageRenderer } from '@/components/common/widgets/PageRenderer';
import { Metadata } from 'next';
import { headers } from 'next/headers';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });

  try {
    const { docs: posts } = await payload.find({
      collection: 'blog-posts',
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: 'published',
        },
      },
      limit: 1,
    });

    const post = posts[0];
    if (!post) return {};

    const seoTitle = (post.meta as any)?.title || post.title;
    const seoDescription = (post.meta as any)?.description || post.excerpt || '';
    const seoImage = (post.meta as any)?.image || post.bannerImage;

    return {
      title: seoTitle,
      description: seoDescription,
      openGraph: {
        title: (post.openGraph as any)?.title || seoTitle,
        description: (post.openGraph as any)?.description || seoDescription,
        type: (post.openGraph as any)?.type || 'article',
        images: seoImage ? [typeof seoImage === 'string' ? seoImage : seoImage.url] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const headersList = await headers();
  const isLivePreview = headersList.get('x-payload-live-preview') === 'true';
  const payload = await getPayload({ config: configPromise });

  try {
    // Fetch the blog post
    const { docs: posts } = await payload.find({
      collection: 'blog-posts',
      where: {
        slug: {
          equals: slug,
        },
        ...(isLivePreview ? {} : { status: { equals: 'published' } }),
      },
      depth: 2,
      limit: 1,
      ...(isLivePreview ? { draft: true } : {}),
    });

    const post = posts[0] as BlogPost;
    if (!post) {
      notFound();
    }

    // Fetch the blog post template page
    const { docs: templatePages } = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'blog-post-template',
        },
      },
      depth: 2,
      limit: 1,
      ...(isLivePreview ? { draft: true } : {}),
    });

    const templatePage = templatePages[0] as Page;

    // If no template exists, create a default layout
    if (
      !templatePage ||
      !(templatePage as any).layout ||
      (templatePage as any).layout.length === 0
    ) {
      const defaultLayout = [
        {
          blockType: 'blog-post-header',
          title: post.title,
          subtitle: post.subtitle,
          bannerImage: post.bannerImage,
          author: post.author,
          category: (post as any).category,
          publishedDate: post.publishedDate,
          readingTime: post.readingTime,
        } as any,
        {
          blockType: 'blog-post-content',
          content: post.content,
        } as any,
      ];

      const mockPage: any = {
        id: 1,
        title: post.title,
        slug: post.slug!,
        layout: defaultLayout,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };

      return <PageRenderer page={mockPage as any} blogPost={post} />;
    }

    // Use the template page layout with blog post data injected
    const pageWithBlogData: Page = {
      ...templatePage,
      title: post.title,
      slug: post.slug!,
    };

    return <PageRenderer page={pageWithBlogData as any} blogPost={post} />;
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}

export async function generateStaticParams() {
  // Temporarily disable static generation for blog posts
  // to fix build timeout issues
  return [];

  /* Will re-enable after optimizing queries
  const payload = await getPayload({ config: configPromise });

  try {
    const { docs: posts } = await payload.find({
      collection: 'blog-posts',
      where: {
        status: {
          equals: 'published',
        },
      },
      limit: 100,
    });

    return posts
      .filter((post) => post.slug)
      .map((post) => ({
        slug: post.slug!,
      }));
  } catch {
    return [];
  }
  */
}
