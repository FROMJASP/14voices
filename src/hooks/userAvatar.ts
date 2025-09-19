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
export const resolveAvatarURL: FieldHook = async ({ data, req, originalDoc }) => {
  // Try to get avatar from data or originalDoc
  const avatarValue = data?.avatar ?? originalDoc?.avatar;

  // If user has uploaded avatar, return its URL
  if (avatarValue && typeof avatarValue === 'object' && avatarValue.url) {
    return avatarValue.url;
  }

  // If avatar is just an ID (string or number), we need to fetch the media document
  if (avatarValue && (typeof avatarValue === 'string' || typeof avatarValue === 'number')) {
    try {
      const media = await req.payload.findByID({
        collection: 'media',
        id: String(avatarValue),
        depth: 0,
      });
      if (media?.url) {
        return media.url;
      }
      // If no URL, the storage adapter should have set it
      console.warn('Avatar media found but no URL available:', media);
    } catch (error) {
      console.error('Error fetching avatar media:', error);
    }
  }

  // Generate default avatar with initials
  const name = data?.name || originalDoc?.name || data?.email || originalDoc?.email;
  return generateDefaultAvatar(name, data?.avatarColor || originalDoc?.avatarColor);
};

/**
 * Hook to add a `image` property for Payload's admin UI
 * Payload's account navigation looks for specific properties
 */
export const addImageProperty: CollectionAfterReadHook = async ({ doc, req }) => {
  if (!doc) return doc;

  // If avatar is just an ID (string or number), fetch the media
  if (doc.avatar && (typeof doc.avatar === 'string' || typeof doc.avatar === 'number')) {
    try {
      const media = await req.payload.findByID({
        collection: 'media',
        id: String(doc.avatar),
        depth: 0,
      });
      if (media) {
        // Replace the ID with the full media object
        doc.avatar = media;
        if (media.url) {
          doc.image = media.url;
          // Also ensure avatarURL is updated
          doc.avatarURL = media.url;
        }
      }
    } catch (error) {
      console.error('Error fetching avatar media in addImageProperty:', error);
    }
  } else if (doc.avatar && typeof doc.avatar === 'object' && doc.avatar.url) {
    // Avatar is already populated
    doc.image = doc.avatar.url;
  } else if (doc.avatarURL && !doc.avatarURL.includes('data:image/svg')) {
    // Use existing avatarURL if it's not a data URI
    doc.image = doc.avatarURL;
  } else {
    // Generate default avatar if no image exists
    doc.image = generateDefaultAvatar(doc.name || doc.email, doc.avatarColor);
  }

  // Also add initials for potential use in UI
  doc.initials = getInitials(doc.name || doc.email);

  return doc;
};
