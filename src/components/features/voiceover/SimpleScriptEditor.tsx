'use client';

import React, { useEffect, useRef } from 'react';
// Removed unused imports

interface SimpleScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onWordCountChange?: (count: number) => void;
  placeholder?: string;
  voiceoverName?: string;
}

export function SimpleScriptEditor({
  value,
  onChange,
  onWordCountChange,
  placeholder = 'Voer hier je script in...',
  // voiceoverName // Currently unused
}: SimpleScriptEditorProps) {
  // Removed unused wordCount state
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate word count
  useEffect(() => {
    const words = value.trim() === '' ? 0 : value.trim().split(/\s+/).length;
    onWordCountChange?.(words);
  }, [value, onWordCountChange]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="script"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[200px] w-full rounded-md bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all resize-none"
          style={{
            userSelect: 'text',
            WebkitUserSelect: 'text',
            MozUserSelect: 'text',
            msUserSelect: 'text',
          }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        <span className="font-semibold">Let op:</span> plaats geen instructies in het script. Je
        kunt instructies het best hieronder doorgeven.
      </p>
    </div>
  );
}
