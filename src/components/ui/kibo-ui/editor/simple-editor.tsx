'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';
import './editor.css';

export type { Editor, JSONContent } from '@tiptap/react';

export interface SimpleEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

const SimpleEditorContent = ({
  content,
  onChange,
  className,
  editable = true,
  placeholder: _placeholder,
}: SimpleEditorProps) => {
  const { editor } = useCurrentEditor();
  const [isInitialized, setIsInitialized] = useState(false);
  // Removed unused isEmpty state

  useEffect(() => {
    if (editor && content && !isInitialized && editor.isEmpty) {
      const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['p', 'br'],
        ALLOWED_ATTR: ['class'],
        KEEP_CONTENT: true,
      });
      editor.commands.setContent(sanitizedContent);
      setIsInitialized(true);
    }
  }, [editor, content, isInitialized]);

  useEffect(() => {
    if (editor && isInitialized && content !== undefined) {
      const currentHtml = editor.getHTML();
      if (currentHtml !== content) {
        const sanitizedContent = DOMPurify.sanitize(content, {
          ALLOWED_TAGS: ['p', 'br'],
          ALLOWED_ATTR: ['class'],
          KEEP_CONTENT: true,
        });
        editor.commands.setContent(sanitizedContent);
      }
    }
  }, [editor, content, isInitialized]);

  useEffect(() => {
    if (editor && onChange) {
      const updateHandler = () => {
        const html = editor.getHTML();
        // Removed unused text and setIsEmpty call

        const sanitizedHtml = DOMPurify.sanitize(html, {
          ALLOWED_TAGS: ['p', 'br'],
          ALLOWED_ATTR: ['class'],
          KEEP_CONTENT: true,
        });
        onChange(sanitizedHtml);
      };

      editor.on('update', updateHandler);
      return () => {
        editor.off('update', updateHandler);
      };
    }
    return undefined;
  }, [editor, onChange]);

  // Removed empty check - no longer needed

  return (
    <div className={cn('simple-editor-container', !editable && 'editor-disabled', className)}>
      {/* Editor content will be rendered here by TipTap */}
    </div>
  );
};

export const SimpleEditor: React.FC<SimpleEditorProps> = ({
  content = '',
  onChange,
  placeholder = 'Start typing...',
  className,
  editable = true,
}) => {
  const extensions = [
    StarterKit.configure({
      // Disable all formatting except basic paragraph handling
      bold: false,
      italic: false,
      strike: false,
      code: false,
      codeBlock: false,
      blockquote: false,
      horizontalRule: false,
      heading: false,
      bulletList: false,
      orderedList: false,
      listItem: false,
      paragraph: {
        HTMLAttributes: {
          class: 'text-foreground',
        },
      },
      hardBreak: {
        HTMLAttributes: {
          class: 'break-line',
        },
      },
    }),
    Typography,
    Placeholder.configure({
      placeholder,
      emptyEditorClass: 'is-editor-empty',
      showOnlyWhenEditable: true,
      showOnlyCurrent: true,
      // considerAnyAsEmpty: true, // Not a valid option
    }),
  ];

  return (
    <EditorProvider
      extensions={extensions}
      content={content}
      editable={editable}
      immediatelyRender={false}
      editorProps={{
        attributes: {
          class: 'max-w-none focus:outline-none text-sm',
          'data-placeholder': placeholder,
        },
        handleKeyDown: () => {
          // Allow normal text editing behavior
          return false;
        },
      }}
    >
      <SimpleEditorContent
        content={content}
        onChange={onChange}
        className={className}
        editable={editable}
        placeholder={placeholder}
      />
    </EditorProvider>
  );
};
