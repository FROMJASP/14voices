import crypto from 'crypto';
import path from 'path';

/**
 * File type signatures (magic numbers) for validation
 * Enhanced with additional audio formats and more specific JPEG validation
 */
const FILE_SIGNATURES: Record<string, { offset: number; bytes: number[]; description?: string }[]> =
  {
    'image/jpeg': [
      { offset: 0, bytes: [0xff, 0xd8, 0xff, 0xdb], description: 'JPEG raw' },
      { offset: 0, bytes: [0xff, 0xd8, 0xff, 0xe0], description: 'JPEG/JFIF' },
      { offset: 0, bytes: [0xff, 0xd8, 0xff, 0xe1], description: 'JPEG/EXIF' },
      { offset: 0, bytes: [0xff, 0xd8, 0xff, 0xe2], description: 'JPEG/Canon' },
      { offset: 0, bytes: [0xff, 0xd8, 0xff, 0xe3], description: 'JPEG/Samsung' },
      { offset: 0, bytes: [0xff, 0xd8, 0xff, 0xe8], description: 'JPEG/SPIFF' },
    ],
    'image/png': [
      { offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], description: 'PNG' },
    ],
    'image/gif': [
      { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], description: 'GIF87a' },
      { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], description: 'GIF89a' },
    ],
    'image/webp': [
      { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46], description: 'RIFF header' },
      { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50], description: 'WEBP format' },
    ],
    'application/pdf': [
      { offset: 0, bytes: [0x25, 0x50, 0x44, 0x46, 0x2d], description: 'PDF' }, // %PDF-
    ],
    'audio/mpeg': [
      { offset: 0, bytes: [0x49, 0x44, 0x33], description: 'MP3 with ID3v2' },
      { offset: 0, bytes: [0xff, 0xfb], description: 'MPEG-1 Layer 3' },
      { offset: 0, bytes: [0xff, 0xf3], description: 'MPEG-2 Layer 3' },
      { offset: 0, bytes: [0xff, 0xf2], description: 'MPEG-2.5 Layer 3' },
      { offset: 0, bytes: [0xff, 0xfa], description: 'MPEG-1 Layer 3 VBR' },
    ],
    'audio/mp3': [
      // MP3 is essentially the same as audio/mpeg
      { offset: 0, bytes: [0x49, 0x44, 0x33], description: 'MP3 with ID3v2' },
      { offset: 0, bytes: [0xff, 0xfb], description: 'MP3' },
      { offset: 0, bytes: [0xff, 0xf3], description: 'MP3' },
      { offset: 0, bytes: [0xff, 0xf2], description: 'MP3' },
    ],
    'audio/wav': [
      { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46], description: 'RIFF header' },
      { offset: 8, bytes: [0x57, 0x41, 0x56, 0x45], description: 'WAVE format' },
    ],
    'audio/x-wav': [
      // Alternative MIME type for WAV
      { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46], description: 'RIFF header' },
      { offset: 8, bytes: [0x57, 0x41, 0x56, 0x45], description: 'WAVE format' },
    ],
    'audio/mp4': [
      { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70, 0x4d, 0x34, 0x41], description: 'M4A audio' },
      {
        offset: 4,
        bytes: [0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34, 0x32],
        description: 'MP4 audio',
      },
    ],
    'audio/x-m4a': [
      { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70, 0x4d, 0x34, 0x41], description: 'M4A audio' },
    ],
    'audio/ogg': [{ offset: 0, bytes: [0x4f, 0x67, 0x67, 0x53], description: 'OGG container' }],
    'audio/webm': [{ offset: 0, bytes: [0x1a, 0x45, 0xdf, 0xa3], description: 'WebM/Matroska' }],
    'audio/flac': [{ offset: 0, bytes: [0x66, 0x4c, 0x61, 0x43], description: 'FLAC' }],
    'image/svg+xml': [
      // SVG files start with <?xml or <svg
      { offset: 0, bytes: [0x3c, 0x3f, 0x78, 0x6d, 0x6c], description: 'SVG with XML declaration' }, // <?xml
      { offset: 0, bytes: [0x3c, 0x73, 0x76, 0x67], description: 'SVG without declaration' }, // <svg
    ],
    'text/plain': [
      // Text files don't have magic numbers, but we can check for BOM markers
      { offset: 0, bytes: [0xef, 0xbb, 0xbf], description: 'UTF-8 BOM' },
      { offset: 0, bytes: [0xff, 0xfe], description: 'UTF-16 LE BOM' },
      { offset: 0, bytes: [0xfe, 0xff], description: 'UTF-16 BE BOM' },
      // For text files without BOM, we'll accept any ASCII/UTF-8 content
    ],
  };

/**
 * Validate file content matches declared MIME type
 */
export async function validateFileContent(
  buffer: Buffer,
  declaredMimeType: string
): Promise<{ valid: boolean; actualType?: string; error?: string; detectedType?: string }> {
  if (!buffer || buffer.length === 0) {
    return {
      valid: false,
      error: 'Empty file buffer provided',
    };
  }

  // Normalize MIME type (handle variations like audio/mp3 vs audio/mpeg)
  const normalizedMimeType = normalizeMimeType(declaredMimeType);

  // Check file signatures for declared type
  const signatures = FILE_SIGNATURES[normalizedMimeType];

  if (!signatures) {
    // Try to detect the actual file type
    const detected = detectFileType(buffer);
    if (detected) {
      return {
        valid: false,
        error: `Unsupported file type: ${declaredMimeType}. Detected type: ${detected.mimeType}`,
        detectedType: detected.mimeType,
      };
    }

    return {
      valid: false,
      error: `Unsupported file type: ${declaredMimeType}`,
    };
  }

  // Check if buffer matches any valid signature for the declared type
  const matchingSignature = signatures.find((sig) => {
    if (buffer.length < sig.offset + sig.bytes.length) {
      return false;
    }

    return sig.bytes.every((byte, index) => buffer[sig.offset + index] === byte);
  });

  // Special handling for text files
  if (normalizedMimeType === 'text/plain' && !matchingSignature) {
    // For text files, check if content is valid UTF-8 text
    try {
      const text = buffer.toString('utf8');
      // Check for common binary indicators
      const hasBinaryChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/.test(text);
      if (!hasBinaryChars) {
        return {
          valid: true,
          actualType: normalizedMimeType,
          detectedType: normalizedMimeType,
        };
      }
    } catch (e) {
      // Not valid UTF-8
    }
  }

  if (!matchingSignature) {
    // Try to detect what the file actually is
    const detected = detectFileType(buffer);
    if (detected) {
      return {
        valid: false,
        error: `File content does not match declared type. Expected: ${declaredMimeType}, Detected: ${detected.mimeType}`,
        detectedType: detected.mimeType,
      };
    }

    return {
      valid: false,
      error: 'File content does not match declared type',
    };
  }

  return {
    valid: true,
    actualType: normalizedMimeType,
    detectedType: normalizedMimeType,
  };
}

/**
 * Detect file type based on magic numbers
 */
export function detectFileType(buffer: Buffer): { mimeType: string; description: string } | null {
  if (!buffer || buffer.length === 0) {
    return null;
  }

  // Check against all known signatures
  for (const [mimeType, signatures] of Object.entries(FILE_SIGNATURES)) {
    for (const sig of signatures) {
      if (buffer.length >= sig.offset + sig.bytes.length) {
        const match = sig.bytes.every((byte, index) => buffer[sig.offset + index] === byte);
        if (match) {
          return {
            mimeType,
            description: sig.description || mimeType,
          };
        }
      }
    }
  }

  return null;
}

/**
 * Normalize MIME type variations
 */
function normalizeMimeType(mimeType: string): string {
  const normalizations: Record<string, string> = {
    'audio/mp3': 'audio/mpeg',
    'audio/x-mpeg': 'audio/mpeg',
    'audio/x-wav': 'audio/wav',
    'audio/x-m4a': 'audio/mp4',
    'image/jpg': 'image/jpeg',
  };

  return normalizations[mimeType.toLowerCase()] || mimeType.toLowerCase();
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  // Remove any directory components
  const basename = path.basename(filename);

  // Remove special characters, keep only alphanumeric, dash, underscore, and dot
  const sanitized = basename.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Ensure filename doesn't start with a dot (hidden files)
  const finalName = sanitized.startsWith('.') ? `_${sanitized}` : sanitized;

  // Add timestamp to ensure uniqueness
  const timestamp = Date.now();
  const ext = path.extname(finalName);
  const name = path.basename(finalName, ext);

  return `${name}_${timestamp}${ext}`;
}

/**
 * Generate secure file storage path
 */
export function generateSecureFilePath(
  userId: string,
  filename: string,
  category: string = 'uploads'
): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  // Hash user ID for privacy
  const userHash = crypto.createHash('sha256').update(userId).digest('hex').substring(0, 8);

  const sanitizedFilename = sanitizeFilename(filename);

  return `${category}/${year}/${month}/${userHash}/${sanitizedFilename}`;
}

/**
 * Check file size limits by type
 */
export function checkFileSize(size: number, mimeType: string): { valid: boolean; error?: string } {
  const limits = {
    'image/': 10 * 1024 * 1024, // 10MB for images
    'audio/': 50 * 1024 * 1024, // 50MB for audio
    'video/': 100 * 1024 * 1024, // 100MB for video
    'application/pdf': 25 * 1024 * 1024, // 25MB for PDFs
    default: 5 * 1024 * 1024, // 5MB default
  };

  let limit = limits.default;

  for (const [prefix, prefixLimit] of Object.entries(limits)) {
    if (mimeType.startsWith(prefix)) {
      limit = prefixLimit;
      break;
    }
  }

  if (size > limit) {
    return {
      valid: false,
      error: `File size ${(size / 1024 / 1024).toFixed(2)}MB exceeds limit of ${(limit / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  return { valid: true };
}

/**
 * Scan file for potential threats (enhanced implementation)
 */
export async function scanFileForThreats(
  buffer: Buffer,
  filename: string,
  mimeType?: string
): Promise<{ safe: boolean; threats?: string[]; severity?: 'low' | 'medium' | 'high' }> {
  const threats: string[] = [];
  let highSeverityFound = false;

  // Check for embedded executables
  const executableSignatures = [
    { bytes: [0x4d, 0x5a], name: 'DOS/Windows executable' },
    { bytes: [0x7f, 0x45, 0x4c, 0x46], name: 'ELF (Linux executable)' },
    { bytes: [0xcf, 0xfa, 0xed, 0xfe], name: 'Mach-O (macOS executable)' },
    { bytes: [0xca, 0xfe, 0xba, 0xbe], name: 'Mach-O fat binary' },
    { bytes: [0xfe, 0xed, 0xfa, 0xce], name: 'Mach-O (reverse byte order)' },
    { bytes: [0xce, 0xfa, 0xed, 0xfe], name: 'Mach-O (reverse byte order)' },
  ];

  for (const sig of executableSignatures) {
    if (buffer.length >= sig.bytes.length) {
      const match = sig.bytes.every((byte, index) => buffer[index] === byte);
      if (match) {
        threats.push(`Embedded executable detected: ${sig.name}`);
        highSeverityFound = true;
        break;
      }
    }
  }

  // Check for polyglot files (files that are valid in multiple formats)
  if (mimeType?.startsWith('image/')) {
    // Check for JPEG with embedded ZIP
    if (buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
      for (let i = 2; i < Math.min(buffer.length - 4, 10000); i++) {
        if (
          buffer[i] === 0x50 &&
          buffer[i + 1] === 0x4b &&
          buffer[i + 2] === 0x03 &&
          buffer[i + 3] === 0x04
        ) {
          threats.push('JPEG file contains embedded ZIP archive');
          highSeverityFound = true;
          break;
        }
      }
    }
  }

  // Enhanced suspicious pattern detection
  const suspiciousPatterns = [
    { pattern: /<script[^>]*>/gi, threat: 'JavaScript code', severity: 'high' },
    { pattern: /javascript:/gi, threat: 'JavaScript protocol', severity: 'high' },
    { pattern: /eval\s*\(/gi, threat: 'eval() function', severity: 'high' },
    { pattern: /document\.write/gi, threat: 'document.write', severity: 'medium' },
    { pattern: /on\w+\s*=/gi, threat: 'Event handler attributes', severity: 'medium' },
    { pattern: /<iframe/gi, threat: 'iframe element', severity: 'medium' },
    { pattern: /<embed/gi, threat: 'embed element', severity: 'medium' },
    { pattern: /<object/gi, threat: 'object element', severity: 'medium' },
    { pattern: /\.exe\b/gi, threat: 'Executable reference', severity: 'low' },
    { pattern: /\.dll\b/gi, threat: 'DLL reference', severity: 'low' },
    { pattern: /\.bat\b/gi, threat: 'Batch file reference', severity: 'low' },
    { pattern: /powershell/gi, threat: 'PowerShell reference', severity: 'medium' },
  ];

  // Scan text-like files and SVGs
  const textExtensions = /\.(txt|html|htm|svg|xml|json|js|css|md)$/i;
  const isSvg = mimeType === 'image/svg+xml' || filename.toLowerCase().endsWith('.svg');

  if (filename.match(textExtensions) || isSvg) {
    const content = buffer.toString('utf8', 0, Math.min(buffer.length, 50000));

    for (const { pattern, threat, severity } of suspiciousPatterns) {
      if (pattern.test(content)) {
        threats.push(`Suspicious pattern detected: ${threat}`);
        if (severity === 'high') {
          highSeverityFound = true;
        }
      }
    }

    // Additional SVG-specific checks
    if (isSvg) {
      if (/<foreignObject/i.test(content)) {
        threats.push('SVG contains foreignObject element');
        highSeverityFound = true;
      }
      if (/<use[^>]+href=["'][^"']*#/i.test(content)) {
        threats.push('SVG contains potentially malicious use element');
      }
    }
  }

  // Check for null bytes in filenames (can bypass filters)
  if (filename.includes('\0')) {
    threats.push('Null byte in filename');
    highSeverityFound = true;
  }

  // Determine severity
  let severity: 'low' | 'medium' | 'high' = 'low';
  if (highSeverityFound) {
    severity = 'high';
  } else if (threats.length > 2) {
    severity = 'medium';
  }

  return {
    safe: threats.length === 0,
    threats: threats.length > 0 ? threats : undefined,
    severity: threats.length > 0 ? severity : undefined,
  };
}

/**
 * Comprehensive file validation combining all security checks
 */
export async function validateFile(
  buffer: Buffer,
  filename: string,
  declaredMimeType: string,
  options?: {
    maxSize?: number;
    allowedTypes?: string[];
    skipThreatScan?: boolean;
  }
): Promise<{
  valid: boolean;
  error?: string;
  warnings?: string[];
  metadata?: {
    actualType?: string;
    sanitizedFilename?: string;
    fileSize?: number;
    threats?: string[];
    threatSeverity?: 'low' | 'medium' | 'high';
  };
}> {
  const warnings: string[] = [];
  const metadata: any = {
    fileSize: buffer.length,
  };

  // 1. Check file size
  const maxSize = options?.maxSize || 100 * 1024 * 1024; // Default 100MB
  const sizeCheck = checkFileSize(buffer.length, declaredMimeType);
  if (!sizeCheck.valid) {
    return {
      valid: false,
      error: sizeCheck.error,
      metadata,
    };
  }

  if (buffer.length > maxSize) {
    return {
      valid: false,
      error: `File size ${(buffer.length / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${(maxSize / 1024 / 1024).toFixed(2)}MB`,
      metadata,
    };
  }

  // 2. Validate content type
  const contentValidation = await validateFileContent(buffer, declaredMimeType);
  if (!contentValidation.valid) {
    return {
      valid: false,
      error: contentValidation.error,
      metadata: {
        ...metadata,
        actualType: contentValidation.detectedType,
      },
    };
  }

  metadata.actualType = contentValidation.actualType;

  // 3. Check allowed types
  if (options?.allowedTypes && options.allowedTypes.length > 0) {
    const normalizedType = normalizeMimeType(declaredMimeType);
    const isAllowed = options.allowedTypes.some(
      (type) =>
        normalizeMimeType(type) === normalizedType ||
        (type.endsWith('/*') && normalizedType.startsWith(type.slice(0, -2)))
    );

    if (!isAllowed) {
      return {
        valid: false,
        error: `File type ${declaredMimeType} is not allowed. Allowed types: ${options.allowedTypes.join(', ')}`,
        metadata,
      };
    }
  }

  // 4. Sanitize filename
  metadata.sanitizedFilename = sanitizeFilename(filename);
  if (metadata.sanitizedFilename !== filename) {
    warnings.push('Filename was sanitized for security');
  }

  // 5. Scan for threats
  if (!options?.skipThreatScan) {
    const threatScan = await scanFileForThreats(buffer, filename, declaredMimeType);
    if (!threatScan.safe) {
      metadata.threats = threatScan.threats;
      metadata.threatSeverity = threatScan.severity;

      if (threatScan.severity === 'high') {
        return {
          valid: false,
          error: 'File contains high-severity security threats',
          warnings,
          metadata,
        };
      } else {
        warnings.push(
          `File contains ${threatScan.severity} severity threats: ${threatScan.threats?.join(', ')}`
        );
      }
    }
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
    metadata,
  };
}

/**
 * Helper function to validate file from Express/Payload request
 */
export async function validateUploadedFile(
  file: {
    buffer?: Buffer;
    data?: Buffer;
    size: number;
    mimetype: string;
    name: string;
    filename?: string;
  },
  options?: {
    allowedTypes?: string[];
    maxSize?: number;
    skipThreatScan?: boolean;
  }
): Promise<{
  valid: boolean;
  error?: string;
  warnings?: string[];
  metadata?: any;
}> {
  // Get buffer from file object (handles different upload middleware)
  const buffer = file.buffer || file.data;
  const filename = file.filename || file.name;

  if (!buffer) {
    return {
      valid: false,
      error: 'No file buffer provided',
    };
  }

  return validateFile(buffer, filename, file.mimetype, options);
}

/**
 * Get allowed MIME types for a specific context
 */
export function getAllowedMimeTypes(context: 'media' | 'avatar' | 'document' | 'audio'): string[] {
  const allowedTypes: Record<string, string[]> = {
    media: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/x-wav',
      'audio/mp4',
      'audio/x-m4a',
      'audio/ogg',
      'audio/webm',
      'audio/flac',
      'application/pdf',
    ],
    avatar: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    document: [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    audio: [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/x-wav',
      'audio/mp4',
      'audio/x-m4a',
      'audio/ogg',
      'audio/webm',
      'audio/flac',
    ],
  };

  return allowedTypes[context] || allowedTypes.media;
}
