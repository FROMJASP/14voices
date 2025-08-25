// Client-side configuration helper
export function getClientServerUrl(): string {
  // CRITICAL FIX: Handle Coolify environment variables properly
  const envUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // In production, use the actual domain
  if (typeof window !== 'undefined') {
    // If we have a proper environment URL, use it
    if (envUrl && envUrl !== 'http://localhost:3000' && !envUrl.includes('fake')) {
      return envUrl;
    }
    // Fallback to current origin
    return window.location.origin;
  }

  // During SSR, use the configured URL or fallback
  if (envUrl && envUrl !== 'http://localhost:3000' && !envUrl.includes('fake')) {
    return envUrl;
  }

  return 'http://localhost:3000';
}

// Helper to ensure API calls use the correct base URL
export function getApiUrl(path: string): string {
  const baseUrl = getClientServerUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
