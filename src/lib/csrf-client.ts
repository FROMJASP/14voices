/**
 * Client-side CSRF token management
 */

let csrfToken: string | null = null;

/**
 * Get or fetch CSRF token
 */
export async function getCSRFToken(): Promise<string> {
  // Return cached token if available
  if (csrfToken) {
    return csrfToken;
  }

  try {
    // Fetch new token from API
    const response = await fetch('/api/csrf', {
      method: 'GET',
      credentials: 'include', // Important: include cookies
    });

    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token');
    }

    // Get token from response header
    const token = response.headers.get('x-csrf-token');
    if (!token) {
      throw new Error('CSRF token not found in response');
    }

    // Cache the token
    csrfToken = token;
    return token;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
}

/**
 * Clear cached CSRF token
 */
export function clearCSRFToken(): void {
  csrfToken = null;
}

/**
 * Fetch wrapper that automatically includes CSRF token
 */
export async function fetchWithCSRF(url: string, options: RequestInit = {}): Promise<Response> {
  // Skip CSRF for safe methods
  const method = options.method?.toUpperCase() || 'GET';
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return fetch(url, options);
  }

  // Get CSRF token
  const token = await getCSRFToken();

  // Add CSRF token to headers
  const headers = new Headers(options.headers);
  headers.set('x-csrf-token', token);

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Always include cookies
  });
}

/**
 * Axios-like API client with CSRF protection
 */
export const api = {
  async get(url: string, options?: RequestInit) {
    return fetchWithCSRF(url, { ...options, method: 'GET' });
  },

  async post(url: string, data?: any, options?: RequestInit) {
    return fetchWithCSRF(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  },

  async put(url: string, data?: any, options?: RequestInit) {
    return fetchWithCSRF(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  },

  async patch(url: string, data?: any, options?: RequestInit) {
    return fetchWithCSRF(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  },

  async delete(url: string, options?: RequestInit) {
    return fetchWithCSRF(url, { ...options, method: 'DELETE' });
  },
};
