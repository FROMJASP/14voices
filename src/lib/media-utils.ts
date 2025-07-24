/**
 * Converts absolute media URLs to relative URLs for Next.js Image optimization
 * This is needed because Payload CMS prepends the serverURL to media URLs
 * but Next.js Image component needs relative URLs when the images are served
 * from the same domain
 */
export function makeMediaUrlRelative(url: string | undefined | null): string {
  if (!url) return '';

  // If already relative, return as is
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    // Return pathname + search + hash (everything after the domain)
    return urlObj.pathname + urlObj.search + urlObj.hash;
  } catch {
    // If URL parsing fails, return the original URL
    return url;
  }
}

/**
 * Checks if a URL is absolute (starts with http:// or https://)
 */
export function isAbsoluteUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Gets the media URL, converting to relative if needed
 * This is a convenience function for use in components
 */
export function getMediaUrl(media: { url?: string } | string | undefined | null): string {
  if (!media) return '';

  const url = typeof media === 'string' ? media : media.url;
  return makeMediaUrlRelative(url);
}
