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
}

export function BlogSection1({
  title = 'Latest Blog Posts',
  description,
  showCategories = true,
  postsLimit = 8,
}: BlogSection1Props) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    // Check if we're in live preview mode
    const checkPreviewMode = () => {
      try {
        // In live preview, we're in an iframe
        setIsPreview(window.self !== window.top);
      } catch {
        setIsPreview(false);
      }
    };

    checkPreviewMode();

    const fetchData = async () => {
      // Skip fetching in preview mode to avoid CORS issues
      if (window.self !== window.top) {
        setLoading(false);
        return;
      }

      try {
        // Fetch blog posts with category relationship
        const postsResponse = await fetch(
          `/api/blog-posts?limit=${postsLimit}&depth=2&where[status][equals]=published&sort=-publishedDate`
        );
        const postsData = await postsResponse.json();
        setPosts(postsData.docs || []);

        if (showCategories) {
          // Fetch categories
          const categoriesResponse = await fetch('/api/categories?limit=100');
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData.docs || []);
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postsLimit, showCategories]);

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

  if (loading && !isPreview) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show placeholder in preview mode
  if (isPreview && posts.length === 0) {
    return (
      <div className="w-full">
        {(title || description) && (
          <div className="mb-8 text-center">
            {title && <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>}
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        )}
        <div className="max-w-[var(--breakpoint-xl)] mx-auto py-10 lg:py-16 px-6 xl:px-0">
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              Blog posts will appear here when viewing the live site.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              (Preview mode detected - API calls disabled)
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

      <div className="max-w-[var(--breakpoint-xl)] mx-auto py-10 lg:py-16 px-6 xl:px-0 flex flex-col lg:flex-row items-start gap-12">
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

                      <h3 className="mt-4 text-2xl font-semibold tracking-tight">{post.title}</h3>
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
  );
}
