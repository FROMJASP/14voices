import { NextRequest, NextResponse } from 'next/server';

const CSRF_HEADER = 'x-csrf-token';
const CSRF_COOKIE = 'csrf-token';

// Use dedicated CSRF_SECRET environment variable for better security separation
const CSRF_SECRET = process.env.CSRF_SECRET;

if (!CSRF_SECRET) {
  console.warn(
    '[SECURITY] CSRF_SECRET not found, falling back to PAYLOAD_SECRET. ' +
      'It is recommended to use a dedicated CSRF_SECRET for better security.'
  );
}

// TypeScript assertion to ensure SECRET is defined
const SECRET = CSRF_SECRET || process.env.PAYLOAD_SECRET;

if (!SECRET) {
  throw new Error('CSRF_SECRET or PAYLOAD_SECRET environment variable is required');
}

// Type assertion to tell TypeScript that SECRET is defined after the check
const VERIFIED_SECRET = SECRET as string;

/**
 * Generate a random token using Web Crypto API (edge compatible)
 */
async function generateRandomToken(): Promise<string> {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Create HMAC signature using Web Crypto API (edge compatible)
 */
async function createHmacSignature(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(VERIFIED_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );
  
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a CSRF token (edge compatible)
 */
export async function generateCSRFToken(): Promise<string> {
  const token = await generateRandomToken();
  const timestamp = Date.now();
  const signature = await createHmacSignature(`${token}.${timestamp}`);
  
  return `${token}.${timestamp}.${signature}`;
}

/**
 * Verify a CSRF token (edge compatible)
 */
export async function verifyCSRFToken(token: string): Promise<boolean> {
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
    const expectedSignature = await createHmacSignature(`${tokenPart}.${timestamp}`);
    
    // Timing-safe comparison
    if (signature.length !== expectedSignature.length) {
      return false;
    }
    
    let mismatch = 0;
    for (let i = 0; i < signature.length; i++) {
      mismatch |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }
    
    return mismatch === 0;
  } catch {
    return false;
  }
}

/**
 * CSRF protection middleware (edge compatible)
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
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }
    
    // Verify token validity
    const isValid = await verifyCSRFToken(headerToken);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired CSRF token' }, { status: 403 });
    }
    
    return handler(req, context);
  };
}