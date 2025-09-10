'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Label } from '@/components/ui/Label';
import { FileText } from 'lucide-react';

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
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate word count
  useEffect(() => {
    const words = value.trim() === '' ? 0 : value.trim().split(/\s+/).length;
    setWordCount(words);
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
      <div className="flex items-center justify-between">
        <Label
          htmlFor="script"
          className="text-sm font-medium text-foreground flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          3. Script (alleen tekst voor voice-over)
        </Label>
        <span className="text-sm text-muted-foreground">
          {wordCount} {wordCount === 1 ? 'woord' : 'woorden'}
        </span>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          id="script"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all resize-none"
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
