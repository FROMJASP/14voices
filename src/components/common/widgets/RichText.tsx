'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { RichTextContent } from '@/types/blocks';

interface RichTextProps {
  content: RichTextContent | null | undefined;
  className?: string;
}

interface RichTextNode {
  type: string;
  tag?: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  children?: RichTextNode[];
  fields?: Record<string, unknown>;
  listType?: string;
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) return null;

  const renderNode = (node: RichTextNode): React.ReactNode => {
    if (node.type === 'text') {
      let text: React.ReactNode = node.text;
      if (node.bold) text = <strong>{text}</strong>;
      if (node.italic) text = <em>{text}</em>;
      if (node.underline) text = <u>{text}</u>;
      if (node.code) text = <code>{text}</code>;
      return text;
    }

    const children = node.children?.map((child, i) => (
      <React.Fragment key={i}>{renderNode(child as RichTextNode)}</React.Fragment>
    ));

    switch (node.type) {
      case 'paragraph':
        return <p>{children}</p>;

      case 'heading':
        const HeadingTag = (node.tag || 'h1') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        return React.createElement(HeadingTag, {}, children);

      case 'list':
        if (node.listType === 'number') {
          return <ol>{children}</ol>;
        }
        return <ul>{children}</ul>;

      case 'listitem':
        return <li>{children}</li>;

      case 'link':
        return (
          <Link
            href={(node.fields?.url as string) || '#'}
            target={node.fields?.newTab ? '_blank' : undefined}
          >
            {children}
          </Link>
        );

      case 'quote':
        return <blockquote>{children}</blockquote>;

      case 'horizontalrule':
        return <hr />;

      case 'block':
        return renderBlock(node.fields || {});

      default:
        return children;
    }
  };

  const renderBlock = (fields: Record<string, unknown>) => {
    const blockType = fields.blockType as string;

    switch (blockType) {
      case 'mediaBlock':
        const media = fields.media as
          | { url: string; alt?: string; width?: number; height?: number }
          | undefined;
        const alignment = fields.alignment as string | undefined;
        const caption = fields.caption as string | undefined;

        if (!media) return null;

        return (
          <figure
            className={`my-8 ${alignment === 'full' ? 'mx-0' : alignment === 'center' ? 'mx-auto' : ''}`}
          >
            <Image
              src={media.url}
              alt={media.alt || ''}
              width={media.width || 800}
              height={media.height || 600}
              className={`${alignment === 'full' ? 'w-full' : ''}`}
            />
            {caption && (
              <figcaption className="text-sm text-gray-600 mt-2 text-center">{caption}</figcaption>
            )}
          </figure>
        );

      case 'embedBlock': {
        const embedUrl = fields.embedUrl as string | undefined;
        const embedCaption = fields.caption as string | undefined;

        if (!embedUrl) return null;

        return (
          <div className="my-8 aspect-video">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
            {embedCaption && (
              <p className="text-sm text-gray-600 mt-2 text-center">{embedCaption}</p>
            )}
          </div>
        );
      }

      case 'buttonBlock': {
        const buttonUrl = fields.url as string | undefined;
        const buttonText = fields.text as string | undefined;
        const buttonStyle = fields.style as string | undefined;
        const buttonAlignment = fields.alignment as string | undefined;

        if (!buttonUrl || !buttonText) return null;

        const buttonClasses = {
          primary: 'bg-blue-600 text-white hover:bg-blue-700',
          secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
          outline: 'border-2 border-gray-300 hover:bg-gray-100',
          text: 'text-blue-600 hover:underline',
        };

        const alignmentClass =
          buttonAlignment === 'center'
            ? 'text-center'
            : buttonAlignment === 'right'
              ? 'text-right'
              : 'text-left';

        return (
          <div className={`my-6 ${alignmentClass}`}>
            <Link
              href={buttonUrl}
              className={`inline-block px-6 py-2 rounded-lg font-medium transition-colors ${buttonClasses[buttonStyle as keyof typeof buttonClasses] || buttonClasses.primary}`}
            >
              {buttonText}
            </Link>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {content.root?.children?.map((node, i) => (
        <React.Fragment key={i}>{renderNode(node as RichTextNode)}</React.Fragment>
      ))}
    </div>
  );
}
