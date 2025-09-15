/**
 * Query parameter validation utilities to prevent SQL injection and other attacks
 */

/**
 * Validate and sanitize limit parameter
 */
export function validateLimit(limit: string | null, defaultValue = 10, max = 100): number {
  const parsed = parseInt(limit || String(defaultValue));

  // Check if it's a valid number
  if (isNaN(parsed)) {
    return defaultValue;
  }

  // Ensure it's within bounds
  return Math.min(Math.max(1, parsed), max);
}

/**
 * Validate and sanitize depth parameter
 */
export function validateDepth(depth: string | null, defaultValue = 1, max = 3): number {
  const parsed = parseInt(depth || String(defaultValue));

  // Check if it's a valid number
  if (isNaN(parsed)) {
    return defaultValue;
  }

  // Ensure it's within bounds
  return Math.min(Math.max(0, parsed), max);
}

/**
 * Validate and sanitize sort parameter
 * Only allows specific field names with optional '-' prefix for descending order
 */
export function validateSort(
  sort: string | null,
  defaultValue: string,
  allowedFields: string[]
): string {
  if (!sort) {
    return defaultValue;
  }

  // Remove any whitespace
  const cleaned = sort.trim();

  // Check if it starts with '-' (descending order)
  const isDescending = cleaned.startsWith('-');
  const fieldName = isDescending ? cleaned.substring(1) : cleaned;

  // Validate against allowed fields
  if (!allowedFields.includes(fieldName)) {
    return defaultValue;
  }

  // Return the validated sort string
  return isDescending ? `-${fieldName}` : fieldName;
}

/**
 * Validate boolean parameter
 */
export function validateBoolean(value: string | null, defaultValue = false): boolean {
  if (!value) {
    return defaultValue;
  }

  return value === 'true' || value === '1';
}

/**
 * Validate and sanitize page parameter
 */
export function validatePage(page: string | null, defaultValue = 1): number {
  const parsed = parseInt(page || String(defaultValue));

  // Check if it's a valid number
  if (isNaN(parsed)) {
    return defaultValue;
  }

  // Ensure it's at least 1
  return Math.max(1, parsed);
}

/**
 * Validate slug parameter (alphanumeric with hyphens)
 */
export function validateSlug(slug: string | null): string | null {
  if (!slug) {
    return null;
  }

  // Only allow alphanumeric characters, hyphens, and underscores
  const cleaned = slug.replace(/[^a-zA-Z0-9\-_]/g, '');

  // Return null if nothing is left after cleaning
  return cleaned.length > 0 ? cleaned : null;
}

/**
 * Validate ID parameter (alphanumeric)
 */
export function validateId(id: string | null): string | null {
  if (!id) {
    return null;
  }

  // Only allow alphanumeric characters
  const cleaned = id.replace(/[^a-zA-Z0-9]/g, '');

  // Return null if nothing is left after cleaning or if length is suspicious
  return cleaned.length > 0 && cleaned.length <= 50 ? cleaned : null;
}

/**
 * Validate search query parameter
 * Removes potentially dangerous characters while allowing safe search
 */
export function validateSearchQuery(query: string | null, maxLength = 100): string | null {
  if (!query) {
    return null;
  }

  // Remove SQL injection attempts and dangerous characters
  let cleaned = query
    .replace(/[<>'"`;\\]/g, '') // Remove dangerous characters
    .replace(/\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|EXEC|EXECUTE)\b/gi, '') // Remove SQL keywords
    .trim();

  // Limit length
  cleaned = cleaned.substring(0, maxLength);

  // Return null if nothing is left after cleaning
  return cleaned.length > 0 ? cleaned : null;
}
