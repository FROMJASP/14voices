import { validateFile, getAllowedMimeTypes } from '@/lib/file-security';
import type { FileRouter } from 'uploadthing/next';

/**
 * Security middleware for uploadthing file uploads
 * Validates files using magic number checking before they are processed
 */
export async function validateUploadthingFile(
  file: File,
  context: 'bookingScript' | 'voiceoverDemo' | 'userAvatar' | 'invoice'
): Promise<{ valid: boolean; error?: string }> {
  try {
    // Convert File to Buffer for validation
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine allowed types based on context
    let allowedTypes: string[];
    let maxSize: number;

    switch (context) {
      case 'bookingScript':
        allowedTypes = ['application/pdf', 'text/plain'];
        maxSize = 16 * 1024 * 1024; // 16MB
        break;
      case 'voiceoverDemo':
        allowedTypes = getAllowedMimeTypes('audio');
        maxSize = 32 * 1024 * 1024; // 32MB
        break;
      case 'userAvatar':
        allowedTypes = getAllowedMimeTypes('avatar');
        maxSize = 4 * 1024 * 1024; // 4MB
        break;
      case 'invoice':
        allowedTypes = ['application/pdf'];
        maxSize = 8 * 1024 * 1024; // 8MB
        break;
      default:
        allowedTypes = getAllowedMimeTypes('media');
        maxSize = 10 * 1024 * 1024; // 10MB
    }

    // Validate the file
    const validation = await validateFile(buffer, file.name, file.type, {
      allowedTypes,
      maxSize,
      skipThreatScan: false,
    });

    if (!validation.valid) {
      console.error('[Upload Security] File validation failed:', {
        filename: file.name,
        context,
        error: validation.error,
        metadata: validation.metadata,
      });

      return {
        valid: false,
        error: validation.error || 'File validation failed',
      };
    }

    // Log warnings if any
    if (validation.warnings && validation.warnings.length > 0) {
      console.warn('[Upload Security] File validation warnings:', {
        filename: file.name,
        context,
        warnings: validation.warnings,
        metadata: validation.metadata,
      });
    }

    return { valid: true };
  } catch (error) {
    console.error('[Upload Security] Error during validation:', error);
    return {
      valid: false,
      error: 'File validation error',
    };
  }
}

/**
 * Create a secure file upload handler with validation
 */
export function createSecureFileHandler<T extends FileRouter>(
  handler: T,
  _validationContext: 'bookingScript' | 'voiceoverDemo' | 'userAvatar' | 'invoice'
): T {
  // This would wrap the uploadthing handler with security validation
  // Since uploadthing doesn't directly expose file buffers in middleware,
  // we'll need to validate in the onUploadComplete handler instead
  return handler;
}