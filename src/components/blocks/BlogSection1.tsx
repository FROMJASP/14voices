'use client';

import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
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
  const [isPreview, setIsPreview] = useState(false);
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
          setError('Request timed out. Please refresh the page.');
          setPosts([]);
          setCategories([]);
        }
      }, 10000); // 10 second timeout

      try {
        // Check if we're in preview/iframe mode
        let inIframe = false;
        try {
          inIframe = window.self !== window.top;
        } catch {
          inIframe = true; // Assume iframe if check fails
        }

        // For live preview, we need to detect if we're in Payload admin iframe
        const isPayloadPreview = inIframe && window.location.pathname.includes('/admin');

        if (isPayloadPreview) {
          // In Payload preview, still try to fetch data but with different approach
          setIsPreview(true);
        }

        // Build the full URL for the API call
        const baseUrl = inIframe ? window.location.origin : '';

        const postsUrl = `${baseUrl}/api/public/blog-posts?limit=${postsLimit}&depth=2&sort=-publishedDate`;

        // Fetch blog posts with category relationship from public API
        const postsResponse = await fetch(postsUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store', // Ensure fresh data
        });

        if (!postsResponse.ok) {
          console.error('Failed to fetch posts:', postsResponse.status, postsResponse.statusText);
          const errorText = await postsResponse.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
        }

        const postsData = await postsResponse.json();
        // Posts data received

        if (isCancelled) return;

        const fetchedPosts = postsData.docs || [];
        // Setting posts
        setPosts(fetchedPosts);

        if (showCategories) {
          try {
            // Fetch categories from public API
            const categoriesUrl = `${baseUrl}/api/public/categories?limit=100`;
            const categoriesResponse = await fetch(categoriesUrl, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            // Categories response received
            if (categoriesResponse.ok) {
              const categoriesData = await categoriesResponse.json();

              if (isCancelled) return;

              const fetchedCategories = categoriesData.docs || [];

              // Skip fetching all posts for category counts in build/preview mode
              // This was causing build timeouts
              const allPostsUrl = `${baseUrl}/api/public/blog-posts?limit=100&depth=1`;
              const allPostsResponse = await fetch(allPostsUrl);

              if (allPostsResponse.ok) {
                const allPostsData = await allPostsResponse.json();

                if (isCancelled) return;

                const allPosts = allPostsData.docs || [];

                // Calculate post counts for each category
                const categoriesWithCounts = fetchedCategories.map((category: any) => {
                  const postCount = allPosts.filter((post: any) => {
                    // Check if post has this category
                    if (typeof post.category === 'object' && post.category?.id === category.id) {
                      return true;
                    }
                    if (typeof post.category === 'string' && post.category === category.id) {
                      return true;
                    }
                    return false;
                  }).length;

                  return {
                    ...category,
                    postsCount: postCount,
                  };
                });

                setCategories(categoriesWithCounts);
              }
            }
          } catch (categoryError) {
            console.error('Error fetching categories:', categoryError);
            // Continue without categories
            if (!isCancelled) {
              setCategories([]);
            }
          }
        }

        // If we successfully fetched data, we're not in a restricted preview
        if (!isCancelled) {
          setIsPreview(false);
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);

        if (isCancelled) return;

        // Set empty data but stop loading
        setPosts([]);
        setCategories([]);
        setError('Unable to load blog posts. Please try again later.');

        // If fetch failed and we're in an iframe, we're likely in a restricted preview
        try {
          if (window.self !== window.top) {
            setIsPreview(true);
          }
        } catch {
          // Unable to check iframe status
        }
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
    return media.url || null;
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
          <div className="max-w-[var(--breakpoint-xl)] mx-auto px-6 xl:px-0">
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
  if (!loading && posts.length === 0) {
    return (
      <div className="w-full">
        <div
          style={{
            paddingTop: paddingMap[paddingTop],
            paddingBottom: paddingMap[paddingBottom],
          }}
        >
          <div className="max-w-[var(--breakpoint-xl)] mx-auto px-6 xl:px-0">
            {(title || description) && (
              <div className="mb-8">
                {title && <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>}
                {description && <p className="text-muted-foreground">{description}</p>}
              </div>
            )}
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <p className="text-muted-foreground">No blog posts available yet.</p>
              {isPreview && (
                <p className="text-sm text-muted-foreground mt-2">
                  Create some blog posts in the Blog Posts collection to see them here.
                </p>
              )}
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
        <div className="max-w-[var(--breakpoint-xl)] mx-auto px-6 xl:px-0">
          {(title || description) && (
            <div className="mb-8">
              {title && <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>}
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
          )}

          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="flex-1">
              <div className="space-y-12">
                {posts.map((post) => {
                  const category =
                    typeof (post as any).category === 'object' ? (post as any).category : null;
                  const imageUrl = getMediaUrl(post.bannerImage);

                  return (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="flex flex-col sm:flex-row sm:items-center shadow-none overflow-hidden rounded-md border-none py-0 hover:bg-muted/50 transition-colors cursor-pointer">
                        {imageUrl && (
                          <div
                            className="shrink-0 aspect-video grow sm:w-56 sm:aspect-square bg-muted rounded-lg bg-cover bg-center"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                          />
                        )}
                        {!imageUrl && (
                          <div className="shrink-0 aspect-video grow sm:w-56 sm:aspect-square bg-muted rounded-lg" />
                        )}
                        <CardContent className="px-0 sm:px-6 py-0 flex flex-col">
                          {category && (
                            <div className="flex items-center gap-6">
                              <Badge className="bg-primary/5 text-primary hover:bg-primary/5 shadow-none">
                                {category.name}
                              </Badge>
                            </div>
                          )}

                          <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="mt-2 text-muted-foreground line-clamp-3 text-ellipsis">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="mt-4 flex items-center gap-6 text-muted-foreground text-sm font-medium">
                            {post.readingTime && (
                              <div className="flex items-center gap-2">
                                <ClockIcon className="h-4 w-4" /> {post.readingTime} min read
                              </div>
                            )}
                            {post.publishedDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> {formatDate(post.publishedDate)}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>

            {showCategories && categories.length > 0 && (
              <aside className="sticky top-8 shrink-0 lg:max-w-sm w-full">
                <h3 className="text-xl font-semibold tracking-tight">Categories</h3>
                <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
                  {categories.map((category) => {
                    const Icon = iconMap[category.icon] || Cpu;
                    return (
                      <Link
                        key={category.id}
                        href={`/blog?category=${category.slug}`}
                        className="flex items-center justify-between gap-2 bg-muted p-3 rounded-md bg-opacity-15 dark:bg-opacity-25 hover:bg-opacity-25 dark:hover:bg-opacity-35 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Badge className="px-1.5 rounded-full bg-foreground/7 text-foreground">
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
