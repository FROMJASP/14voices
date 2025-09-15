import { randomBytes } from 'crypto';

/**
 * Generate a CSP nonce for server-side rendering
 */
export function generateNonce(): string {
  return randomBytes(16).toString('base64');
}

/**
 * Generate nonce for edge runtime (middleware)
 */
export function generateEdgeNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}
