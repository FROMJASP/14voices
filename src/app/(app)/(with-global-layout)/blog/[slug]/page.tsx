import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { notFound } from 'next/navigation';
import type { BlogPost, Page } from '@/payload-types';
import PageRenderer from '@/components/common/widgets/PageRenderer';
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

export default async function BlogPostPage({
  params,
  searchParams,
}: Props & { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  let payload;
  try {
    payload = await getPayload({ config: configPromise });
  } catch (error) {
    console.error('Error initializing payload:', error);
    notFound();
  }

  try {
    const { slug } = await params;
    const headersList = await headers();
    const isLivePreview = headersList.get('x-payload-live-preview') === 'true';

    // Check if this is a preview request
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const isPreviewParam = resolvedSearchParams?.preview === 'true';
    let post: BlogPost | null = null;
    let isTemplatePreview = false;

    // Special handling for template preview
    if (slug === '__template-preview__') {
      isTemplatePreview = true;
      // Try to get the most recent published blog post
      const { docs: recentPosts } = await payload.find({
        collection: 'blog-posts',
        where: {
          status: {
            equals: 'published',
          },
        },
        sort: '-publishedDate',
        depth: 2,
        limit: 1,
      });

      post = recentPosts[0] as BlogPost;

      // If no posts exist, show instructions
      if (!post) {
        return (
          <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                  <svg
                    className="mx-auto h-16 w-16 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-4">Geen Blogberichten Gevonden</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Om de blog post template te kunnen previewen, moet je eerst minimaal één
                  blogbericht publiceren.
                </p>
                <div className="bg-muted/50 rounded-lg p-6 text-left">
                  <h2 className="font-semibold mb-2">Zo maak je je eerste blogbericht:</h2>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Ga naar &quot;Blogberichten&quot; in het menu</li>
                    <li>Klik op &quot;Nieuw Blogbericht&quot;</li>
                    <li>Vul de titel, inhoud en andere velden in</li>
                    <li>Zet de status op &quot;Gepubliceerd&quot;</li>
                    <li>Klik op &quot;Opslaan&quot;</li>
                    <li>Kom terug naar deze pagina om de template te previewen</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        );
      }
    } else {
      // Normal blog post fetching
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

      post = posts[0] as BlogPost;
    }

    if (!post) {
      notFound();
    }

    // Try to fetch the blog post template page if it exists
    let templatePage: Page | null = null;
    try {
      const { docs: templatePages } = await payload.find({
        collection: 'pages',
        where: {
          slug: {
            equals: 'blog-post',
          },
        },
        depth: 2,
        limit: 1,
        // Always use draft mode for template preview to get latest changes
        ...(isTemplatePreview || isLivePreview || isPreviewParam ? { draft: true } : {}),
      });
      templatePage = templatePages[0] as Page;
    } catch (error) {
      console.log('Blog post template page not found, using default layout');
    }

    // Always use default layout for blog posts
    // The blog-post page in Pages collection is just for template configuration
    const defaultLayout = [
      {
        blockType: 'blog-post',
        showShareButtons: true,
        showAuthor: true,
      } as any,
    ];

    // If template page exists and has layout configured, use its settings
    const layout =
      templatePage && (templatePage as any).layout?.length > 0
        ? (templatePage as any).layout
        : defaultLayout;

    // Create a page object with the blog post data and layout
    const pageWithBlogData: any = {
      id: templatePage?.id || 1,
      title: post.title,
      slug: 'blog-post', // Always use blog-post slug for block rendering
      layout: layout,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      // Pass through SEO fields from the blog post, not the template
      meta: post.meta,
      openGraph: post.openGraph,
    };

    return <PageRenderer page={pageWithBlogData} blogPost={post} />;
  } catch (error) {
    console.error('Error loading blog post:', error);
    // Log more details in production
    if (process.env.NODE_ENV === 'production') {
      const { slug } = await params;
      console.error('Blog post fetch error details:', {
        slug,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
    notFound();
  }
}

export async function generateStaticParams() {
  // Skip during build with fake database
  if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
    return [];
  }

  try {
    const payload = await getPayload({ config: configPromise });

    // Generate params for the most recent blog posts
    const { docs: posts } = await payload.find({
      collection: 'blog-posts',
      where: {
        status: {
          equals: 'published',
        },
      },
      limit: 50, // Generate static params for first 50 posts
      sort: '-publishedDate',
      select: {
        slug: true,
      },
    });

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for blog posts:', error);
    return [];
  }
}

// Enable ISR for blog posts
export const revalidate = 60; // 1 minute for better production updates
export const dynamicParams = true; // Allow dynamic params for posts not in generateStaticParams
export const maxDuration = 30; // 30 seconds timeout for production
