import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

// Mime type mapping
const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
};

export async function GET(_request: NextRequest, { params }: { params: { path: string[] } }) {
  // Only serve files in development or when MinIO/S3 is not configured
  if (process.env.NODE_ENV === 'production' && process.env.S3_ACCESS_KEY) {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const filePath = params.path.join('/');
    const fullPath = path.join(process.cwd(), 'public', 'uploads', filePath);

    // Security: Ensure the path doesn't escape the uploads directory
    const normalizedPath = path.normalize(fullPath);
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!normalizedPath.startsWith(uploadsDir)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if file exists
    const fileStats = await stat(normalizedPath);

    if (!fileStats.isFile()) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(normalizedPath);

    // Determine content type
    const ext = path.extname(normalizedPath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileStats.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('[Uploads] Error serving file:', error);
    return new NextResponse('Not Found', { status: 404 });
  }
}
