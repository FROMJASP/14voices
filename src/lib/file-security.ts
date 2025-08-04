import crypto from 'crypto';
import path from 'path';

/**
 * File type signatures (magic numbers) for validation
 */
const FILE_SIGNATURES: Record<string, { offset: number; bytes: number[] }[]> = {
  'image/jpeg': [
    { offset: 0, bytes: [0xFF, 0xD8, 0xFF] }
  ],
  'image/png': [
    { offset: 0, bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] }
  ],
  'image/gif': [
    { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] }, // GIF87a
    { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] }  // GIF89a
  ],
  'image/webp': [
    { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF
    { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] }  // WEBP
  ],
  'application/pdf': [
    { offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] } // %PDF
  ],
  'audio/mpeg': [
    { offset: 0, bytes: [0x49, 0x44, 0x33] }, // ID3
    { offset: 0, bytes: [0xFF, 0xFB] },      // MPEG-1 Layer 3
    { offset: 0, bytes: [0xFF, 0xF3] },      // MPEG-2 Layer 3
    { offset: 0, bytes: [0xFF, 0xF2] }       // MPEG-2.5 Layer 3
  ],
  'audio/wav': [
    { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF
    { offset: 8, bytes: [0x57, 0x41, 0x56, 0x45] }  // WAVE
  ]
};

/**
 * Validate file content matches declared MIME type
 */
export async function validateFileContent(
  buffer: Buffer,
  declaredMimeType: string
): Promise<{ valid: boolean; actualType?: string; error?: string }> {
  // Check file signatures
  const signatures = FILE_SIGNATURES[declaredMimeType];
  
  if (!signatures) {
    return {
      valid: false,
      error: `Unsupported file type: ${declaredMimeType}`
    };
  }

  // Check if buffer matches any valid signature
  const isValid = signatures.some(sig => {
    if (buffer.length < sig.offset + sig.bytes.length) {
      return false;
    }
    
    return sig.bytes.every((byte, index) => 
      buffer[sig.offset + index] === byte
    );
  });

  if (!isValid) {
    return {
      valid: false,
      error: 'File content does not match declared type'
    };
  }

  return { valid: true, actualType: declaredMimeType };
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
  const userHash = crypto
    .createHash('sha256')
    .update(userId)
    .digest('hex')
    .substring(0, 8);
  
  const sanitizedFilename = sanitizeFilename(filename);
  
  return `${category}/${year}/${month}/${userHash}/${sanitizedFilename}`;
}

/**
 * Check file size limits by type
 */
export function checkFileSize(
  size: number,
  mimeType: string
): { valid: boolean; error?: string } {
  const limits = {
    'image/': 10 * 1024 * 1024,    // 10MB for images
    'audio/': 50 * 1024 * 1024,    // 50MB for audio
    'video/': 100 * 1024 * 1024,   // 100MB for video
    'application/pdf': 25 * 1024 * 1024, // 25MB for PDFs
    'default': 5 * 1024 * 1024     // 5MB default
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
      error: `File size ${(size / 1024 / 1024).toFixed(2)}MB exceeds limit of ${(limit / 1024 / 1024).toFixed(2)}MB`
    };
  }

  return { valid: true };
}

/**
 * Scan file for potential threats (basic implementation)
 */
export async function scanFileForThreats(
  buffer: Buffer,
  filename: string
): Promise<{ safe: boolean; threats?: string[] }> {
  const threats: string[] = [];

  // Check for embedded executables
  const executableSignatures = [
    [0x4D, 0x5A], // MZ (DOS/Windows executable)
    [0x7F, 0x45, 0x4C, 0x46], // ELF (Linux executable)
    [0xCF, 0xFA, 0xED, 0xFE], // Mach-O (macOS executable)
    [0xCA, 0xFE, 0xBA, 0xBE], // Mach-O fat binary
  ];

  for (const sig of executableSignatures) {
    if (buffer.length >= sig.length) {
      const match = sig.every((byte, index) => buffer[index] === byte);
      if (match) {
        threats.push('Embedded executable detected');
        break;
      }
    }
  }

  // Check for suspicious strings in certain file types
  const suspiciousPatterns = [
    /<script/gi,
    /javascript:/gi,
    /eval\s*\(/gi,
    /document\.write/gi,
    /\.exe/gi,
    /\.dll/gi,
    /\.bat/gi,
    /\.cmd/gi,
    /\.scr/gi,
    /\.vbs/gi,
    /\.js/gi
  ];

  // Only scan text-like files
  if (filename.match(/\.(txt|html|htm|svg|xml|json)$/i)) {
    const content = buffer.toString('utf8', 0, Math.min(buffer.length, 10000));
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        threats.push(`Suspicious pattern detected: ${pattern.source}`);
      }
    }
  }

  return {
    safe: threats.length === 0,
    threats: threats.length > 0 ? threats : undefined
  };
}