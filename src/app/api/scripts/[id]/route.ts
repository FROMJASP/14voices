import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { getPayload } from '@/utilities/payload';
import { headers } from 'next/headers';
import { z } from 'zod';
import { idSchema } from '@/lib/validation/schemas';
import { BookingService } from '@/domains/booking';

// Parameter validation schema
const paramsSchema = z.object({
  id: idSchema,
});

async function GETHandler(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  // Validate parameters
  const validationResult = paramsSchema.safeParse(resolvedParams);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: 'Invalid script ID', details: validationResult.error.errors },
      { status: 400 }
    );
  }

  const { id } = validationResult.data;

  try {
    const payload = await getPayload();
    const headersList = await headers();

    // Authenticate user
    const { user } = await payload.auth({ headers: headersList });

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Use the domain service
    const bookingService = new BookingService(payload);
    const script = await bookingService.getScript(id, user.id, user.role);

    if (!script) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    // Return formatted script data
    return NextResponse.json({
      id: script.id,
      title: script.title,
      filename: script.filename,
      filesize: script.filesize,
      url: script.url,
      originalFilename: script.originalFilename,
      instructions: script.instructions,
      scriptType: script.scriptType,
      language: script.language,
      deadline: script.deadline,
      assignedVoiceover: script.assignedVoiceover,
      uploadedBy: script.uploadedBy,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Access denied') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    console.error('Error fetching script:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function DELETEHandler(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  // Validate parameters
  const validationResult = paramsSchema.safeParse(resolvedParams);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: 'Invalid script ID', details: validationResult.error.errors },
      { status: 400 }
    );
  }

  const { id } = validationResult.data;

  try {
    const payload = await getPayload();
    const headersList = await headers();

    const { user } = await payload.auth({ headers: headersList });

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Use the domain service
    const bookingService = new BookingService(payload);
    await bookingService.deleteScript(id, user.id, user.role);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Script not found') {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'Access denied') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    console.error('Error deleting script:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = withAuth(GETHandler);
export const DELETE = withAuth(DELETEHandler);
