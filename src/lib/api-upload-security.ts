import { NextRequest, NextResponse } from 'next/server';
import { validateFile, getAllowedMimeTypes } from '@/lib/file-security';

/**
 * Secure file upload handler for Next.js API routes
 */
export async function handleSecureFileUpload(
  request: NextRequest,
  options: {
    allowedTypes?: string[];
    maxSize?: number;
    context?: 'media' | 'avatar' | 'document' | 'audio';
  } = {}
): Promise<{
  valid: boolean;
  file?: {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    size: number;
  };
  error?: string;
  response?: NextResponse;
}> {
  try {
    // Get form data from request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return {
        valid: false,
        error: 'No file provided',
        response: NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        ),
      };
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine allowed types
    const allowedTypes = options.allowedTypes || 
      (options.context ? getAllowedMimeTypes(options.context) : getAllowedMimeTypes('media'));

    // Validate the file
    const validation = await validateFile(buffer, file.name, file.type, {
      allowedTypes,
      maxSize: options.maxSize,
      skipThreatScan: false,
    });

    if (!validation.valid) {
      console.error('[API Upload Security] File validation failed:', {
        filename: file.name,
        error: validation.error,
        metadata: validation.metadata,
      });

      return {
        valid: false,
        error: validation.error,
        response: NextResponse.json(
          { 
            error: validation.error || 'File validation failed',
            details: validation.metadata,
          },
          { status: 400 }
        ),
      };
    }

    // Return validated file data
    return {
      valid: true,
      file: {
        buffer,
        filename: validation.metadata?.sanitizedFilename || file.name,
        mimeType: validation.metadata?.actualType || file.type,
        size: file.size,
      },
    };
  } catch (error) {
    console.error('[API Upload Security] Error processing upload:', error);
    return {
      valid: false,
      error: 'Upload processing error',
      response: NextResponse.json(
        { error: 'Upload processing error' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Middleware to validate multipart form uploads
 */
export function createUploadValidationMiddleware(options: {
  allowedTypes?: string[];
  maxSize?: number;
  context?: 'media' | 'avatar' | 'document' | 'audio';
}) {
  return async (req: NextRequest) => {
    const result = await handleSecureFileUpload(req, options);
    if (!result.valid && result.response) {
      return result.response;
    }
    return result;
  };
}