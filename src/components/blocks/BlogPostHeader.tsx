'use client';

import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, User } from 'lucide-react';
import Image from 'next/image';

interface BlogPostHeaderProps {
  title?: string;
  subtitle?: string;
  bannerImage?: any;
  author?: any;
  category?: any;
  publishedDate?: string;
  readingTime?: number;
  blogPost?: any; // Injected blog post data
}

export function BlogPostHeader({
  title,
  subtitle,
  bannerImage,
  author,
  category,
  publishedDate,
  readingTime,
  blogPost,
}: BlogPostHeaderProps) {
  // Use injected blog post data if available
  const post = blogPost || {
    title,
    subtitle,
    bannerImage,
    author,
    category,
    publishedDate,
    readingTime,
  };

  const getMediaUrl = (media: any) => {
    if (!media) return null;
    if (typeof media === 'string') return null;
    return media.url || null;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const imageUrl = getMediaUrl(post.bannerImage);
  const authorName = typeof post.author === 'object' ? post.author?.name : 'Anoniem';
  const categoryData = typeof post.category === 'object' ? post.category : null;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] mb-8">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title || 'Blog post banner'}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
          <div className="max-w-[var(--breakpoint-xl)] mx-auto">
            {categoryData && (
              <Badge className="mb-4 bg-primary text-primary-foreground">{categoryData.name}</Badge>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="text-lg md:text-xl text-muted-foreground mb-4">{post.subtitle}</p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {authorName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{authorName}</span>
                </div>
              )}
              {post.publishedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.publishedDate)}</span>
                </div>
              )}
              {post.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} min leestijd</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
