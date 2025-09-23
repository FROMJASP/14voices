import { NextRequest, NextResponse } from 'next/server';
import { addCSRFToken } from '@/lib/csrf';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
/**
 * GET /api/csrf
 * Returns a CSRF token for the client to use in subsequent requests
 */
export async function GET(_request: NextRequest) {
  const response = NextResponse.json({
    message: 'CSRF token generated',
    // The actual token is set in cookies and headers
  });

  // Add CSRF token to response (sets both cookie and header)
  return addCSRFToken(response);
}
