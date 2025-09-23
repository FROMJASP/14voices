import { NextRequest, NextResponse } from 'next/server';
import { withPublicAuth } from '@/lib/auth-middleware';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { formSubmitSchema } from '@/lib/validation/schemas';
import { validateRequest, getClientId, checkRateLimit, securityHeaders } from '@/lib/api-security';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
async function POSTHandler(_req: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientId(_req);
    const rateLimitResult = checkRateLimit(clientId, 10, 60000); // 10 submissions per minute

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { message: 'Too many submissions. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            ...securityHeaders,
          },
        }
      );
    }

    // Validate request
    const validatedData = await validateRequest(_req, formSubmitSchema);
    const { formId, data } = validatedData;

    const payload = await getPayload({ config: configPromise });

    // Additional validation for form data
    if (typeof data !== 'object' || Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: 'Form data cannot be empty' },
        { status: 400, headers: securityHeaders }
      );
    }

    // Sanitize form data - remove any potential XSS
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key.slice(0, 100), // Limit key length
        typeof value === 'string' ? value.slice(0, 10000) : value, // Limit string values
      ])
    );

    // Verify the form exists
    const form = await payload.findByID({
      collection: 'forms',
      id: formId,
    });

    if (!form) {
      return NextResponse.json({ message: 'Form not found' }, { status: 404 });
    }

    // Create form submission with sanitized data
    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        form: parseInt(formId, 10),
        data: sanitizedData,
        submittedAt: new Date().toISOString(),
        status: 'new',
        ipAddress: clientId, // Store for abuse prevention
        userAgent: _req.headers.get('user-agent') || 'unknown',
      },
    });

    // Check if form has redirect settings
    const redirectUrl =
      form.settings && typeof form.settings === 'object' && 'redirectUrl' in form.settings
        ? ((form.settings as Record<string, unknown>).redirectUrl as string | undefined)
        : undefined;

    return NextResponse.json(
      {
        success: true,
        submission: submission.id,
        redirectUrl,
      },
      {
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          ...securityHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Form submission error:', error);

    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { message: 'Invalid form data', errors: (error as Error & { errors?: unknown }).errors },
        { status: 400, headers: securityHeaders }
      );
    }

    return NextResponse.json(
      { message: 'Failed to submit form' },
      { status: 500, headers: securityHeaders }
    );
  }
}

export const POST = withPublicAuth(POSTHandler, { rateLimit: 'formSubmission' });
