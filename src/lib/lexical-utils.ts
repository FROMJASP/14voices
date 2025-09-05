/**
 * Convert plain text to Lexical editor format
 */
export function textToLexical(text: string | null | undefined): any {
  if (!text || typeof text !== 'string') {
    return null;
  }

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              format: 0,
              style: '',
              mode: 'normal',
              detail: 0,
              text: text,
              version: 1,
            },
          ],
        },
      ],
      direction: 'ltr',
    },
  };
}

/**
 * Check if a value is already in Lexical format
 */
export function isLexicalFormat(value: any): boolean {
  return value && typeof value === 'object' && value.root && value.root.children;
}

/**
 * Convert a value to Lexical format if it's plain text
 */
export function ensureLexicalFormat(value: any): any {
  if (isLexicalFormat(value)) {
    return value;
  }
  if (typeof value === 'string') {
    return textToLexical(value);
  }
  return null;
}