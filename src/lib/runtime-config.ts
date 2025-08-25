/**
 * Runtime configuration utilities for handling dynamic URLs in Coolify deployments
 *
 * This handles the case where NEXT_PUBLIC_SERVER_URL is not available at build time
 * but needs to be determined at runtime based on the actual deployment URL
 */

let runtimeConfig: { NEXT_PUBLIC_SERVER_URL: string } | null = null;

/**
 * Get the server URL, preferring runtime config over build-time env var
 * This is critical for Coolify deployments where the URL is assigned dynamically
 */
export function getServerUrl(): string {
  // If we're on the server, we can access process.env
  if (typeof window === 'undefined') {
    // Check for Coolify-specific environment variables at runtime
    const coolifyUrl = process.env.COOLIFY_URL;
    const coolifyFqdn = process.env.COOLIFY_FQDN;
    const envUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    // Prefer Coolify URLs if available and env URL is localhost
    if ((coolifyUrl || coolifyFqdn) && envUrl === 'http://localhost:3000') {
      return coolifyUrl || coolifyFqdn || envUrl;
    }

    return envUrl || 'http://localhost:3000';
  }

  // On the client, check runtime config first
  if (runtimeConfig) {
    return runtimeConfig.NEXT_PUBLIC_SERVER_URL;
  }

  // Try to load runtime config from public directory
  if (!runtimeConfig && typeof window !== 'undefined') {
    try {
      // This is a synchronous XMLHttpRequest - not ideal but necessary for initialization
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/runtime-config.json', false); // false = synchronous
      xhr.send();

      if (xhr.status === 200) {
        const config = JSON.parse(xhr.responseText);
        runtimeConfig = config;
        return config.NEXT_PUBLIC_SERVER_URL;
      }
    } catch (error) {
      console.warn('Failed to load runtime config:', error);
    }
  }

  // Fallback to build-time env var or window location
  if (typeof window !== 'undefined') {
    // If all else fails, use the current window location
    const envUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!envUrl || envUrl === 'http://localhost:3000') {
      return window.location.origin;
    }
    return envUrl;
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
}

/**
 * Get the API URL for making requests
 */
export function getApiUrl(path: string): string {
  const serverUrl = getServerUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${serverUrl}${normalizedPath}`;
}

/**
 * Check if we're in a Coolify deployment
 */
export function isCoolifyDeployment(): boolean {
  if (typeof window === 'undefined') {
    return !!(process.env.COOLIFY_URL || process.env.COOLIFY_FQDN);
  }

  // On client, check if runtime config exists
  return !!runtimeConfig;
}

/**
 * Initialize runtime config (call this early in your app)
 */
export async function initializeRuntimeConfig(): Promise<void> {
  if (typeof window === 'undefined' || runtimeConfig) {
    return;
  }

  try {
    const response = await fetch('/runtime-config.json');
    if (response.ok) {
      runtimeConfig = await response.json();
      console.log('Runtime config loaded:', runtimeConfig);
    }
  } catch (error) {
    console.warn('Failed to load runtime config:', error);
  }
}
