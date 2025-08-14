# File Upload Security Implementation

This document describes the comprehensive file upload security system implemented for the 14voices platform.

## Overview

The file security system provides multiple layers of protection against malicious file uploads:

1. **Magic Number Validation** - Validates file content matches declared MIME type
2. **File Size Limits** - Enforces size restrictions based on file type
3. **Threat Scanning** - Detects embedded executables and malicious patterns
4. **Filename Sanitization** - Prevents path traversal attacks
5. **Type Allowlisting** - Only permits specific file types per context

## Key Components

### Core Security Module (`/src/lib/file-security.ts`)

The main security module provides:

- `validateFile()` - Comprehensive file validation combining all security checks
- `validateFileContent()` - Magic number validation against declared MIME type
- `detectFileType()` - Automatic file type detection based on magic numbers
- `scanFileForThreats()` - Scans for embedded executables and malicious patterns
- `sanitizeFilename()` - Removes dangerous characters from filenames
- `checkFileSize()` - Enforces size limits by file type

### Magic Number Support

The system validates the following file types using magic numbers:

**Images:**
- JPEG (all variants: JFIF, EXIF, Canon, Samsung, SPIFF)
- PNG
- GIF (87a and 89a)
- WebP

**Audio:**
- MP3/MPEG (with ID3v2, MPEG-1/2/2.5 Layer 3)
- WAV
- M4A/MP4 Audio
- OGG
- WebM
- FLAC

**Documents:**
- PDF

### Integration Points

#### 1. Payload CMS Media Collection

The Media collection (`/src/collections/Media.ts`) uses the validation in its `beforeChange` hook:

```typescript
const validation = await validateUploadedFile(file, {
  allowedTypes: getAllowedMimeTypes('media'),
  maxSize: 100 * 1024 * 1024, // 100MB
});
```

Files that fail validation are rejected with detailed error messages.

#### 2. API Routes

For custom API routes, use the helper functions:

```typescript
import { handleSecureFileUpload } from '@/lib/api-upload-security';

export async function POST(request: NextRequest) {
  const result = await handleSecureFileUpload(request, {
    context: 'avatar',
    maxSize: 4 * 1024 * 1024, // 4MB
  });
  
  if (!result.valid) {
    return result.response; // Pre-formatted error response
  }
  
  // Process result.file
}
```

#### 3. Uploadthing Integration

The uploadthing routes can be enhanced with validation:

```typescript
import { validateUploadthingFile } from '@/lib/upload-security-middleware';

// In your uploadthing route handler
.middleware(async ({ files }) => {
  for (const file of files) {
    const validation = await validateUploadthingFile(file, 'userAvatar');
    if (!validation.valid) {
      throw new UploadThingError(validation.error);
    }
  }
})
```

## Security Features

### 1. Polyglot File Detection

Detects files that are valid in multiple formats (e.g., JPEG containing ZIP):

```typescript
// Detects JPEG files with embedded ZIP archives
if (buffer[i] === 0x50 && buffer[i + 1] === 0x4b && 
    buffer[i + 2] === 0x03 && buffer[i + 3] === 0x04) {
  threats.push('JPEG file contains embedded ZIP archive');
}
```

### 2. SVG Security

Special handling for SVG files to prevent XSS:
- Detects `<script>` tags
- Detects `<foreignObject>` elements
- Detects event handlers (`onload`, `onclick`, etc.)
- Detects potentially malicious `<use>` elements

### 3. Executable Detection

Identifies embedded executables by their signatures:
- Windows (MZ header)
- Linux (ELF)
- macOS (Mach-O)

### 4. Threat Severity Levels

Threats are classified into three severity levels:
- **High**: Blocks upload (executables, scripts in SVG)
- **Medium**: Logs warning (iframes, event handlers)
- **Low**: Logs info (references to executable files)

## File Size Limits

Default limits by file type:
- **Images**: 10MB
- **Audio**: 50MB
- **Video**: 100MB
- **PDF**: 25MB
- **Others**: 5MB

## Usage Examples

### Basic File Validation

```typescript
const validation = await validateFile(
  buffer,
  'document.pdf',
  'application/pdf',
  {
    maxSize: 25 * 1024 * 1024,
    allowedTypes: ['application/pdf'],
  }
);

if (!validation.valid) {
  throw new Error(validation.error);
}
```

### Context-Based Validation

```typescript
// For avatar uploads
const validation = await validateFile(buffer, filename, mimeType, {
  allowedTypes: getAllowedMimeTypes('avatar'),
  maxSize: 4 * 1024 * 1024,
});

// For audio uploads
const validation = await validateFile(buffer, filename, mimeType, {
  allowedTypes: getAllowedMimeTypes('audio'),
  maxSize: 50 * 1024 * 1024,
});
```

## Testing

Comprehensive unit tests are provided in `/src/lib/__tests__/file-security.test.ts`:

```bash
bun test file-security
```

Tests cover:
- Magic number validation for all supported types
- File type detection
- Threat scanning scenarios
- Filename sanitization
- Size limit enforcement
- Integration scenarios

## Security Best Practices

1. **Always validate on the server** - Never trust client-side validation
2. **Check magic numbers** - Don't rely on file extensions or MIME types alone
3. **Scan for threats** - Especially important for user-generated content
4. **Sanitize filenames** - Prevent path traversal and special character attacks
5. **Use allowlists** - Only permit specific file types needed for each context
6. **Log security events** - Track validation failures for security monitoring
7. **Set appropriate limits** - Balance user needs with security concerns

## Error Handling

The system provides detailed error messages for debugging while keeping user-facing errors generic:

```typescript
// Detailed logging for developers
console.error('[Media Security] File validation failed:', {
  filename: file.name,
  error: validation.error,
  metadata: validation.metadata,
});

// Generic error for users
throw new Error('File validation failed');
```

## Future Enhancements

Potential improvements for consideration:

1. **Virus Scanning** - Integration with ClamAV or similar
2. **Image Processing** - Strip EXIF data, resize images
3. **Content Analysis** - ML-based content moderation
4. **Rate Limiting** - Prevent upload abuse
5. **Quarantine System** - Hold suspicious files for manual review