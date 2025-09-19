/**
 * Generates URL-friendly slugs with proper handling of special characters
 * Converts characters like ö→o, ä→a, ü→u, etc.
 */
export function slugify(text: string): string {
  if (!text) return '';

  // Character mappings for common special characters
  const charMap: Record<string, string> = {
    // German/Nordic
    ä: 'a',
    Ä: 'a',
    ö: 'o',
    Ö: 'o',
    ü: 'u',
    Ü: 'u',
    ß: 'ss',
    ø: 'o',
    Ø: 'o',
    å: 'a',
    Å: 'a',
    æ: 'ae',
    Æ: 'ae',
    // French
    é: 'e',
    É: 'e',
    è: 'e',
    È: 'e',
    ê: 'e',
    Ê: 'e',
    ë: 'e',
    Ë: 'e',
    à: 'a',
    À: 'a',
    â: 'a',
    Â: 'a',
    î: 'i',
    Î: 'i',
    ï: 'i',
    Ï: 'i',
    ô: 'o',
    Ô: 'o',
    ù: 'u',
    Ù: 'u',
    û: 'u',
    Û: 'u',
    ç: 'c',
    Ç: 'c',
    // Spanish/Portuguese
    ñ: 'n',
    Ñ: 'n',
    ã: 'a',
    Ã: 'a',
    õ: 'o',
    Õ: 'o',
    // Polish
    ą: 'a',
    Ą: 'a',
    ć: 'c',
    Ć: 'c',
    ę: 'e',
    Ę: 'e',
    ł: 'l',
    Ł: 'l',
    ń: 'n',
    Ń: 'n',
    ś: 's',
    Ś: 's',
    ź: 'z',
    Ź: 'z',
    ż: 'z',
    Ż: 'z',
    // Other
    ð: 'd',
    Ð: 'd',
    þ: 'th',
    Þ: 'th',
  };

  // Replace special characters with their ASCII equivalents
  let slug = text
    .split('')
    .map((char) => charMap[char] || char)
    .join('');

  // Convert to lowercase and replace spaces and remaining special chars with hyphens
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  return slug;
}

// Export a version specifically for voiceover names (uses only first name)
export function slugifyVoiceoverName(fullName: string): string {
  if (!fullName) return '';

  // Extract first name only
  const firstName = fullName.split(' ')[0];
  return slugify(firstName);
}
