// Client-side configuration helper
export function getClientServerUrl(): string {
  // In production, use the actual domain
  if (typeof window !== 'undefined') {
    // Use the current origin if no public server URL is set
    return process.env.NEXT_PUBLIC_SERVER_URL || window.location.origin;
  }

  // During SSR, use the configured URL
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
}

// Helper to ensure API calls use the correct base URL
export function getApiUrl(path: string): string {
  const baseUrl = getClientServerUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
