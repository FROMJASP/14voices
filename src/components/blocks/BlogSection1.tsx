'use client';

import { Badge } from '@/components/ui/Badge';
import { makeMediaUrlRelative } from '@/lib/media-utils';
import {
  BadgeDollarSign,
  Bike,
  BookHeart,
  BriefcaseBusiness,
  Calendar,
  ClockIcon,
  Cpu,
  FlaskRound,
  HeartPulse,
  Scale,
  GraduationCap,
  Music,
  Utensils,
  Plane,
  Palette,
  Gamepad2,
  Camera,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { BlogPost } from '@/payload-types';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  postsCount?: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  cpu: Cpu,
  briefcase: BriefcaseBusiness,
  dollar: BadgeDollarSign,
  health: HeartPulse,
  lifestyle: BookHeart,
  politics: Scale,
  science: FlaskRound,
  sports: Bike,
  education: GraduationCap,
  entertainment: Music,
  food: Utensils,
  travel: Plane,
  art: Palette,
  gaming: Gamepad2,
  photography: Camera,
};

interface BlogSection1Props {
  title?: string;
  description?: string;
  showCategories?: boolean;
  postsLimit?: number;
  paddingTop?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
  paddingBottom?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
}

const paddingMap = {
  none: '0',
  small: '2rem',
  medium: '4rem',
  large: '6rem',
  xlarge: '8rem',
};

export function BlogSection1({
  title = 'Latest Blog Posts',
  description,
  showCategories = true,
  postsLimit = 8,
  paddingTop = 'medium',
  paddingBottom = 'medium',
}: BlogSection1Props) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      // Starting fetch...
      setLoading(true);
      setError(null);

      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (!isCancelled) {
          setLoading(false);
          // Don't set error on timeout, just show empty state
          setPosts([]);
          setCategories([]);
        }
      }, 30000); // 30 second timeout for production environments

      try {
        // Check if we're in preview/iframe mode
        let inIframe = false;
        try {
          inIframe = window.self !== window.top;
        } catch {
          inIframe = true; // Assume iframe if check fails
        }

        // Build the full URL for the API call
        const baseUrl = inIframe ? window.location.origin : '';

        // Use the optimized blog-section endpoint
        const url = `${baseUrl}/api/public/blog-section?limit=${postsLimit}&categories=${showCategories}`;

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
          // Use cache in production for better performance
          cache: inIframe ? 'no-store' : 'default',
          // Add timeout for the fetch itself
          signal: AbortSignal.timeout(28000), // 28 second timeout
        });

        if (isCancelled) return;

        if (!response.ok) {
          console.error('Blog section response not ok:', response.status);
          const errorData = await response.json().catch(() => ({}));

          // Check if we got partial data even with an error
          if (errorData.data) {
            setPosts(errorData.data.posts || []);
            setCategories(errorData.data.categories || []);
            // Don't throw error if we have data
            return;
          }

          // Only throw if we have no data at all
          throw new Error(errorData.message || `Failed to fetch blog data: ${response.status}`);
        }

        const responseData = await response.json();

        if (!responseData.success) {
          // Use any partial data if available
          if (responseData.data) {
            setPosts(responseData.data.posts || []);
            setCategories(responseData.data.categories || []);
          }
          throw new Error(responseData.message || 'Failed to fetch blog data');
        }

        const { posts: fetchedPosts = [], categories: fetchedCategories = [] } = responseData.data;

        setPosts(fetchedPosts);
        if (showCategories) {
          setCategories(fetchedCategories);
        }

        // Data fetched successfully
      } catch (error) {
        console.error('Error fetching blog data:', error);

        if (isCancelled) return;

        // Set empty data but stop loading
        setPosts([]);
        setCategories([]);

        // Provide more specific error messages
        // In production, don't show errors to users, just show empty state
        if (process.env.NODE_ENV === 'development') {
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              setError('The request timed out. The blog posts API might be experiencing issues.');
            } else if (error.message.includes('fetch')) {
              setError(
                'Unable to connect to the blog posts API. Please check if the server is running.'
              );
            } else {
              setError(`Error loading blog posts: ${error.message}`);
            }
          } else {
            setError('Unable to load blog posts. Please try again later.');
          }
        }

        // Error has been set above
      } finally {
        clearTimeout(timeoutId); // Clear the timeout
        if (!isCancelled) {
          // Fetch complete, setting loading to false
          setLoading(false);
        } else {
          // Fetch was cancelled
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [postsLimit, showCategories]); // Re-run when props change

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMediaUrl = (media: any) => {
    if (!media) return null;
    if (typeof media === 'string') return null;

    let url: string | null = null;
    if (media.url) {
      url = makeMediaUrlRelative(media.url);
    } else if (media.filename) {
      url = makeMediaUrlRelative(`/media/${media.filename}`);
    }

    return url;
  };

  if (loading) {
    return (
      <div className="w-full">
        <div
          style={{
            paddingTop: paddingMap[paddingTop],
            paddingBottom: paddingMap[paddingBottom],
          }}
        >
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="w-full">
        <div
          style={{
            paddingTop: paddingMap[paddingTop],
            paddingBottom: paddingMap[paddingBottom],
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(title || description) && (
              <div className="mb-8">
                {title && <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>}
                {description && <p className="text-muted-foreground">{description}</p>}
              </div>
            )}
            <div className="bg-destructive/10 rounded-lg p-8 text-center">
              <p className="text-destructive">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show placeholder only if there are no posts and it's NOT loading
  if (!loading && posts.length === 0 && !error) {
    return (
      <div className="w-full">
        <div
          style={{
            paddingTop: paddingMap[paddingTop],
            paddingBottom: paddingMap[paddingBottom],
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(title || description) && (
              <div className="mb-8">
                {title && <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>}
                {description && <p className="text-muted-foreground">{description}</p>}
              </div>
            )}
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">No blog posts available yet.</p>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>To add blog posts:</p>
                <ol className="list-decimal list-inside text-left max-w-md mx-auto">
                  <li>Go to the Payload Admin panel</li>
                  <li>Navigate to &quot;Blog Posts&quot; collection</li>
                  <li>Create a new blog post</li>
                  <li>Make sure to set the status to &quot;Published&quot;</li>
                  <li>Save and refresh this page</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        style={{
          paddingTop: paddingMap[paddingTop],
          paddingBottom: paddingMap[paddingBottom],
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(title || description) && (
            <div className="mb-6 sm:mb-8">
              {title && (
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{title}</h2>
              )}
              {description && (
                <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
              )}
            </div>
          )}

          <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
            <div className="flex-1 w-full lg:max-w-3xl">
              <div className="space-y-8 md:space-y-12">
                {posts.map((post) => {
                  const category =
                    typeof (post as any).category === 'object' ? (post as any).category : null;
                  const imageUrl = getMediaUrl(post.bannerImage);

                  return (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <div className="group flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 p-3 sm:p-4 -m-3 sm:-m-4 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                        {imageUrl && (
                          <div
                            className="shrink-0 w-full sm:w-48 md:w-56 aspect-video sm:aspect-square bg-muted rounded-lg bg-cover bg-center"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                          />
                        )}
                        {!imageUrl && (
                          <div className="shrink-0 w-full sm:w-48 md:w-56 aspect-video sm:aspect-square bg-muted rounded-lg" />
                        )}
                        <div className="flex-1 min-w-0 py-2 sm:py-0">
                          {category && (
                            <div className="flex items-center gap-4 mb-3">
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/15 shadow-none text-xs">
                                {category.name}
                              </Badge>
                            </div>
                          )}

                          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="mt-2 text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-3">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-muted-foreground text-xs sm:text-sm font-medium">
                            {post.readingTime && (
                              <div className="flex items-center gap-1.5">
                                <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span>{post.readingTime} min read</span>
                              </div>
                            )}
                            {post.publishedDate && (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span>{formatDate(post.publishedDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {showCategories && categories.length > 0 && (
              <aside className="w-full lg:sticky lg:top-8 lg:shrink-0 lg:w-72 xl:w-80">
                <h3 className="text-lg sm:text-xl font-semibold tracking-tight mb-4">Categories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {categories.map((category) => {
                    const Icon = iconMap[category.icon] || Cpu;
                    return (
                      <Link
                        key={category.id}
                        href={`/blog?category=${category.slug}`}
                        className="flex items-center justify-between gap-2 bg-muted/40 hover:bg-muted/60 p-3 rounded-lg transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="font-medium text-sm sm:text-base truncate">
                            {category.name}
                          </span>
                        </div>
                        <Badge className="shrink-0 px-1.5 sm:px-2 text-xs rounded-full bg-foreground/10 text-foreground">
                          {category.postsCount || 0}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
