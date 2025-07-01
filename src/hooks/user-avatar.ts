import type { FieldHook, CollectionAfterReadHook } from 'payload'

/**
 * Hook to provide a resolved avatar URL for the user
 * This will be used by Payload's admin UI to display the correct avatar
 */
export const resolveAvatarURL: FieldHook = async ({ data, req }) => {
  // If user has uploaded avatar, return its URL
  if (data?.avatar && typeof data.avatar === 'object' && data.avatar.url) {
    return data.avatar.url
  }
  
  // If avatar is just an ID, we need to fetch the media document
  if (data?.avatar && typeof data.avatar === 'string') {
    try {
      const media = await req.payload.findByID({
        collection: 'media',
        id: data.avatar,
      })
      return media?.url || null
    } catch (error) {
      console.error('Error fetching avatar media:', error)
    }
  }
  
  // Fall back to gravatar URL if available
  return data?.gravatarUrl || null
}

/**
 * Hook to add a `image` property for Payload's admin UI
 * Payload's account navigation looks for specific properties
 */
export const addImageProperty: CollectionAfterReadHook = async ({ doc }) => {
  if (!doc) return doc
  
  // Add image property that Payload's admin UI expects
  if (doc.avatar && typeof doc.avatar === 'object' && doc.avatar.url) {
    doc.image = doc.avatar.url
  } else if (doc.avatarURL) {
    doc.image = doc.avatarURL
  } else if (doc.gravatarUrl) {
    doc.image = doc.gravatarUrl
  }
  
  return doc
}