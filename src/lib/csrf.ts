import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CSRF_HEADER = 'x-csrf-token';
const CSRF_COOKIE = 'csrf-token';
const CSRF_SECRET = process.env.CSRF_SECRET || process.env.PAYLOAD_SECRET;

if (!CSRF_SECRET) {
  throw new Error('CSRF_SECRET or PAYLOAD_SECRET environment variable is required');
}

// TypeScript assertion to ensure CSRF_SECRET is defined
const SECRET = CSRF_SECRET as string;

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now();
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${token}.${timestamp}`)
    .digest('hex');
  
  return `${token}.${timestamp}.${signature}`;
}

/**
 * Verify a CSRF token
 */
export function verifyCSRFToken(token: string): boolean {
  try {
    const [tokenPart, timestamp, signature] = token.split('.');
    
    if (!tokenPart || !timestamp || !signature) {
      return false;
    }
    
    // Check token age (24 hours)
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > 24 * 60 * 60 * 1000) {
      return false;
    }
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(`${tokenPart}.${timestamp}`)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * CSRF protection middleware
 */
export function withCSRFProtection(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    // Skip CSRF for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return handler(req, context);
    }
    
    // Get token from header or body
    const headerToken = req.headers.get(CSRF_HEADER);
    const cookieToken = req.cookies.get(CSRF_COOKIE)?.value;
    
    // Verify token
    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
    
    if (!verifyCSRFToken(headerToken)) {
      return NextResponse.json(
        { error: 'Invalid or expired CSRF token' },
        { status: 403 }
      );
    }
    
    return handler(req, context);
  };
}

/**
 * Add CSRF token to response
 */
export function addCSRFToken(response: NextResponse): NextResponse {
  const token = generateCSRFToken();
  
  response.cookies.set(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 24 * 60 * 60, // 24 hours
  });
  
  response.headers.set(CSRF_HEADER, token);
  
  return response;
}