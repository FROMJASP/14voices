/**
 * Generate nonce for edge runtime (middleware)
 * This version uses Web Crypto API which is available in Edge Runtime
 */
export function generateEdgeNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}
