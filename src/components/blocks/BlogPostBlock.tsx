'use client';

import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Facebook, Linkedin } from 'lucide-react';
import type { BlogPost, Media } from '@/payload-types';
// Removed unused import

interface BlogPostBlockProps {
  showShareButtons?: boolean;
  showAuthor?: boolean;
  blogPost?: BlogPost;
}

const ShareButton: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
}> = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-muted-foreground hover:text-foreground transition-colors"
    aria-label={label}
  >
    {icon}
  </a>
);

export function BlogPostBlock({
  showShareButtons = true,
  showAuthor = true,
  blogPost,
}: BlogPostBlockProps) {
  // Get the current URL for sharing
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = blogPost?.title || '';

  // Function to render Lexical content
  const renderLexicalContent = (node: any): React.ReactNode => {
    if (!node) return null;

    // Handle text nodes
    if (node.type === 'text') {
      let text: React.ReactNode = node.text || '';

      // Apply formatting with proper nesting
      const formats = [];
      if (node.format & 1) formats.push('strong'); // Bold
      if (node.format & 2) formats.push('em'); // Italic
      if (node.format & 8) formats.push('u'); // Underline
      if (node.format & 16) formats.push('s'); // Strikethrough
      if (node.format & 64) formats.push('code'); // Code

      // Apply formats in order
      formats.forEach((format) => {
        switch (format) {
          case 'strong':
            text = <strong>{text}</strong>;
            break;
          case 'em':
            text = <em>{text}</em>;
            break;
          case 'u':
            text = <u>{text}</u>;
            break;
          case 's':
            text = <s>{text}</s>;
            break;
          case 'code':
            text = <code className="px-1 py-0.5 bg-muted rounded text-sm">{text}</code>;
            break;
        }
      });

      return text;
    }

    // Handle element nodes
    const children = node.children?.map((child: any, index: number) => (
      <React.Fragment key={index}>{renderLexicalContent(child)}</React.Fragment>
    ));

    switch (node.type) {
      case 'root':
        return <>{children}</>;
      case 'paragraph':
        return <p className="mb-4">{children}</p>;
      case 'heading':
        const Tag = node.tag as keyof React.JSX.IntrinsicElements;
        const headingClasses = {
          h1: 'text-3xl font-bold mb-4 mt-8',
          h2: 'text-2xl font-bold mb-3 mt-6',
          h3: 'text-xl font-bold mb-2 mt-4',
          h4: 'text-lg font-bold mb-2 mt-3',
          h5: 'text-base font-bold mb-1 mt-2',
          h6: 'text-sm font-bold mb-1 mt-2',
        };
        return (
          <Tag className={headingClasses[node.tag as keyof typeof headingClasses] || ''}>
            {children}
          </Tag>
        );
      case 'list':
        return node.listType === 'bullet' ? (
          <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
        ) : (
          <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
        );
      case 'listitem':
        return <li>{children}</li>;
      case 'quote':
        return (
          <blockquote className="border-l-4 border-muted-foreground/30 pl-4 my-4 italic">
            {children}
          </blockquote>
        );
      case 'link':
        return (
          <a
            href={node.fields?.url}
            target={node.fields?.newTab ? '_blank' : undefined}
            rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
            className="text-primary underline hover:no-underline"
          >
            {children}
          </a>
        );
      case 'linebreak':
        return <br />;
      default:
        return <div className="mb-4">{children}</div>;
    }
  };

  // Get the author's name
  const authorName = useMemo(() => {
    if (!blogPost?.author) return '';
    if (typeof blogPost.author === 'object' && 'name' in blogPost.author) {
      return blogPost.author.name || blogPost.author.email || '';
    }
    return '';
  }, [blogPost?.author]);

  // Get the banner image URL
  const bannerImageUrl = useMemo(() => {
    if (!blogPost?.bannerImage) return '';
    if (typeof blogPost.bannerImage === 'object' && 'url' in blogPost.bannerImage) {
      return (blogPost.bannerImage as Media).url || '';
    }
    return '';
  }, [blogPost?.bannerImage]);

  // Format the date
  const formattedDate = useMemo(() => {
    if (!blogPost?.publishedDate) return '';
    try {
      return format(new Date(blogPost.publishedDate), 'd MMMM yyyy', { locale: nl });
    } catch {
      return '';
    }
  }, [blogPost?.publishedDate]);

  if (!blogPost) {
    return (
      <div className="px-4 py-24 mx-auto max-w-7xl">
        <p className="text-center text-muted-foreground">Blog post niet gevonden</p>
      </div>
    );
  }

  return (
    <article
      className="px-4 py-24 mx-auto max-w-7xl"
      itemID="#"
      itemScope
      itemType="http://schema.org/BlogPosting"
    >
      <div className="w-full mx-auto mb-10 text-left md:w-3/4 lg:w-1/2">
        <div className="pb-6 mb-6 border-b border-border">
          <h1
            className="mb-3 text-3xl font-bold text-foreground md:leading-tight md:text-4xl"
            itemProp="headline"
            title={blogPost.title || undefined}
          >
            {blogPost.title}
          </h1>
          <div className="text-base text-muted-foreground flex items-center gap-2">
            {formattedDate && (
              <time dateTime={blogPost.publishedDate || undefined}>{formattedDate}</time>
            )}
            {showAuthor && authorName && (
              <>
                <span>—</span>
                <span>Geschreven door {authorName}</span>
              </>
            )}
          </div>
        </div>

        {showShareButtons && (
          <div className="flex items-center mb-6 space-x-2">
            <p className="text-muted-foreground">Deel dit artikel</p>

            <ShareButton
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              icon={<Facebook className="flex-none w-5 h-5" fill="currentColor" />}
              label="Deel op Facebook"
            />

            <ShareButton
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="flex-none"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              }
              label="Deel op X"
            />

            <ShareButton
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              icon={<Linkedin className="flex-none w-5 h-5" fill="currentColor" />}
              label="Deel op LinkedIn"
            />
          </div>
        )}

        {bannerImageUrl && (
          <img
            src={bannerImageUrl}
            className="object-cover w-full h-64 bg-center rounded-lg"
            alt={blogPost.title}
            itemProp="image"
          />
        )}
      </div>

      <div className="w-full mx-auto md:w-3/4 lg:w-1/2">
        {blogPost.content && (
          <div itemProp="articleBody" className="text-foreground">
            {renderLexicalContent(blogPost.content.root)}
          </div>
        )}
      </div>
    </article>
  );
}
