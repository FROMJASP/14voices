import type { FieldHook, CollectionAfterReadHook } from 'payload';

/**
 * Generate initials from a name
 */
const getInitials = (name?: string): string => {
  if (!name) return 'U';

  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate a data URI for a default avatar with initials
 */
const generateDefaultAvatar = (name?: string, color?: string): string => {
  const initials = getInitials(name);
  const bgColor = color || '#3b82f6';

  // Create an SVG with initials
  const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${bgColor}" />
      <text x="50" y="50" font-family="Arial, sans-serif" font-size="40" font-weight="600" 
            fill="white" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    </svg>
  `.trim();

  // Convert to data URI
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  return dataUri;
};

/**
 * Hook to provide a resolved avatar URL for the user
 * This will be used by Payload's admin UI to display the correct avatar
 */
export const resolveAvatarURL: FieldHook = async ({ data, req }) => {
  // If user has uploaded avatar, return its URL
  if (data?.avatar && typeof data.avatar === 'object' && data.avatar.url) {
    return data.avatar.url;
  }

  // If avatar is just an ID, we need to fetch the media document
  if (data?.avatar && typeof data.avatar === 'string') {
    try {
      const media = await req.payload.findByID({
        collection: 'media',
        id: data.avatar,
      });
      if (media?.url) {
        return media.url;
      }
    } catch (error) {
      console.error('Error fetching avatar media:', error);
    }
  }

  // Generate default avatar with initials
  return generateDefaultAvatar(data?.name || data?.email, data?.avatarColor);
};

/**
 * Hook to add a `image` property for Payload's admin UI
 * Payload's account navigation looks for specific properties
 */
export const addImageProperty: CollectionAfterReadHook = async ({ doc }) => {
  if (!doc) return doc;

  // Add image property that Payload's admin UI expects
  if (doc.avatar && typeof doc.avatar === 'object' && doc.avatar.url) {
    doc.image = doc.avatar.url;
  } else if (doc.avatarURL) {
    doc.image = doc.avatarURL;
  } else {
    // Generate default avatar if no image exists
    doc.image = generateDefaultAvatar(doc.name || doc.email, doc.avatarColor);
  }

  // Also add initials for potential use in UI
  doc.initials = getInitials(doc.name || doc.email);

  return doc;
};
