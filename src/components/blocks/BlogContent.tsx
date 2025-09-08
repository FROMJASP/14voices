import React from 'react';

interface BlogContentProps {
  content?: any;
  blogPost?: any;
}

export function BlogContent({ content, blogPost }: BlogContentProps) {
  const postContent = blogPost?.content || content;

  if (!postContent) {
    return null;
  }

  // Function to render Lexical content
  const renderLexicalContent = (node: any): React.ReactNode => {
    if (!node) return null;

    // Handle text nodes
    if (node.type === 'text') {
      let text: React.ReactNode = node.text || '';

      // Apply formatting
      if (node.format & 1) text = <strong key={node.text}>{text}</strong>; // Bold
      if (node.format & 2) text = <em key={node.text}>{text}</em>; // Italic
      if (node.format & 8) text = <u key={node.text}>{text}</u>; // Underline
      if (node.format & 16) text = <s key={node.text}>{text}</s>; // Strikethrough
      if (node.format & 64) text = <code key={node.text}>{text}</code>; // Code

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
        return <p>{children}</p>;
      case 'heading':
        const Tag = node.tag as keyof React.JSX.IntrinsicElements;
        return <Tag>{children}</Tag>;
      case 'list':
        return node.listType === 'bullet' ? <ul>{children}</ul> : <ol>{children}</ol>;
      case 'listitem':
        return <li>{children}</li>;
      case 'quote':
        return <blockquote>{children}</blockquote>;
      case 'link':
        return (
          <a
            href={node.fields?.url}
            target={node.fields?.newTab ? '_blank' : undefined}
            rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        );
      case 'linebreak':
        return <br />;
      default:
        return <div>{children}</div>;
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-[var(--breakpoint-md)] mx-auto px-6 xl:px-0 py-8">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {renderLexicalContent(postContent.root)}
        </article>
      </div>
    </div>
  );
}
