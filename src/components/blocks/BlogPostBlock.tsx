'use client';

import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Facebook, Linkedin } from 'lucide-react';
import type { BlogPost, Media, CustomAuthor } from '@/payload-types';

// Function to render Lexical content
const renderLexicalContent = (node: any): React.ReactNode => {
  if (!node) return null;

  // Handle text nodes
  if (node.type === 'text') {
    let text: React.ReactNode = node.text;

    if (node.format) {
      if (node.format & 1) text = <strong>{text}</strong>;
      if (node.format & 2) text = <em>{text}</em>;
      if (node.format & 8) text = <u>{text}</u>;
      if (node.format & 16) text = <s>{text}</s>;
      if (node.format & 32) text = <code>{text}</code>;
    }

    return text;
  }

  // Handle element nodes
  const children = node.children?.map((child: any, index: number) => (
    <React.Fragment key={index}>{renderLexicalContent(child)}</React.Fragment>
  ));

  switch (node.type) {
    case 'root':
    case 'paragraph':
      return <p className="mb-4">{children}</p>;
    case 'heading':
      const level = node.tag || '2';
      const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const headingClasses = {
        h1: 'text-4xl mb-4 mt-6 font-bold',
        h2: 'text-3xl mb-4 mt-6 font-bold',
        h3: 'text-2xl mb-4 mt-6 font-bold',
        h4: 'text-xl mb-4 mt-6 font-bold',
        h5: 'text-lg mb-4 mt-6 font-bold',
        h6: 'text-base mb-4 mt-6 font-bold',
      };
      return React.createElement(HeadingTag, { className: headingClasses[HeadingTag] }, children);
    case 'list':
      const ListTag = node.tag === 'ol' ? 'ol' : 'ul';
      return <ListTag className="mb-4 ml-6 list-disc">{children}</ListTag>;
    case 'listitem':
      return <li>{children}</li>;
    case 'quote':
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4">{children}</blockquote>
      );
    case 'link':
      return (
        <a
          href={node.fields?.linkType === 'custom' ? node.fields?.url : '#'}
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    default:
      return children;
  }
};

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

  // Memoized function to render Lexical content
  const renderLexicalContent = useMemo(() => {
    const renderNode = (node: any): React.ReactNode => {
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
        <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
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
    return renderNode;
  }, []); // No dependencies needed since it's a pure function

  // Get author info (either regular user or custom author)
  const authorInfo = useMemo(() => {
    if (!blogPost) return null;

    // Check if it's a custom author
    if (blogPost.authorType === 'custom' && blogPost.customAuthor) {
      const customAuthor =
        typeof blogPost.customAuthor === 'object' ? (blogPost.customAuthor as CustomAuthor) : null;

      if (customAuthor) {
        return {
          type: 'custom',
          name: customAuthor.name,
          displayPrefix: customAuthor.displayPrefix || 'Via',
          url: customAuthor.url,
          style: {
            color: customAuthor.style?.color || '#28ade6',
            fontWeight: customAuthor.style?.fontWeight || 'medium',
            underline: customAuthor.style?.underline !== false,
          },
        };
      }
    }

    // Regular user author
    if (blogPost.author && typeof blogPost.author === 'object' && 'name' in blogPost.author) {
      return {
        type: 'user',
        name: blogPost.author.name || blogPost.author.email || '',
      };
    }

    return null;
  }, [blogPost?.author, blogPost?.customAuthor, blogPost?.authorType]);

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
    // In admin preview mode, show a placeholder
    const isInIframe = typeof window !== 'undefined' && window.parent !== window;
    if (isInIframe) {
      return (
        <div className="px-4 py-24 mx-auto max-w-7xl">
          <div className="w-full mx-auto mb-10 text-left md:w-3/4 lg:w-1/2">
            <div className="pb-6 mb-6 border-b border-border">
              <h1 className="mb-3 text-3xl font-bold text-foreground md:leading-tight md:text-4xl">
                Voorbeeld Blog Titel
              </h1>
              <div className="text-base text-muted-foreground flex items-center gap-2">
                <time>1 januari 2024</time>
                {showAuthor && (
                  <>
                    <span>—</span>
                    <span>Geschreven door Auteur Naam</span>
                  </>
                )}
              </div>
            </div>

            {showShareButtons && (
              <div className="flex items-center mb-6 space-x-2">
                <p className="text-muted-foreground">Deel dit artikel</p>
                <span className="text-muted-foreground/50">[Deel knoppen]</span>
              </div>
            )}

            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Banner afbeelding</p>
            </div>
          </div>

          <div className="w-full mx-auto md:w-3/4 lg:w-1/2">
            <div className="text-foreground space-y-4">
              <p>
                Dit is een voorbeeld van hoe je blogpost er uit zal zien. De werkelijke inhoud wordt
                getoond wanneer een bezoeker naar een specifieke blogpost navigeert.
              </p>
              <p>
                Je kunt de instellingen voor dit blok aanpassen in de Pagina Layout sectie
                hieronder, zoals het tonen/verbergen van deel knoppen en auteur informatie.
              </p>
            </div>
          </div>
        </div>
      );
    }

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
            {showAuthor && authorInfo && (
              <>
                <span>—</span>
                {authorInfo.type === 'custom' ? (
                  <span>
                    {authorInfo.displayPrefix}{' '}
                    <a
                      href={authorInfo.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: authorInfo.style?.color || undefined,
                        fontWeight:
                          authorInfo.style?.fontWeight === 'medium'
                            ? 500
                            : authorInfo.style?.fontWeight === 'semibold'
                              ? 600
                              : authorInfo.style?.fontWeight === 'bold'
                                ? 700
                                : 400,
                        textDecoration: authorInfo.style?.underline ? 'underline' : 'none',
                      }}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {authorInfo.name}
                    </a>
                  </span>
                ) : (
                  <span>Geschreven door {authorInfo.name}</span>
                )}
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
