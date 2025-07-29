import { NextRequest } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { z } from 'zod';
import { idSchema } from '@/lib/validation/schemas';

// Parameter validation schema
const paramsSchema = z.object({
  id: idSchema,
});

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  // Validate parameters
  const validationResult = paramsSchema.safeParse(params);
  if (!validationResult.success) {
    return Response.json(
      { error: 'Invalid layout ID', details: validationResult.error.errors },
      { status: 400 }
    );
  }

  try {
    const payload = await getPayload({ config: configPromise });

    const layout = await payload.findByID({
      collection: 'layouts',
      id: params.id,
      depth: 1,
    });

    return Response.json(layout);
  } catch {
    return Response.json({ error: 'Layout not found' }, { status: 404 });
  }
}
