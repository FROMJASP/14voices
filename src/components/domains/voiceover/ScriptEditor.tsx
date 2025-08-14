'use client';

import { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/Label';
import { FileText } from 'lucide-react';

interface ScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onWordCountChange?: (count: number) => void;
  placeholder?: string;
}

export function ScriptEditor({ 
  value, 
  onChange, 
  onWordCountChange,
  placeholder = "Voer hier je script in..."
}: ScriptEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate word count
  useEffect(() => {
    const text = value.trim();
    if (text === '') {
      setWordCount(0);
      onWordCountChange?.(0);
    } else {
      // Split by whitespace and filter out empty strings
      const words = text.split(/\s+/).filter(word => word.length > 0);
      const count = words.length;
      setWordCount(count);
      onWordCountChange?.(count);
    }
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
          Script
        </Label>
        <span className="text-sm text-muted-foreground">
          {wordCount} {wordCount === 1 ? 'woord' : 'woorden'}
        </span>
      </div>
      
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="script"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          style={{ 
            lineHeight: '1.6',
            fontFamily: 'inherit'
          }}
        />
        
      </div>
      
      <p className="text-xs text-muted-foreground">
        Tip: Je kunt je script hier direct typen of plakken. Het aantal woorden wordt automatisch bijgewerkt.
      </p>
    </div>
  );
}