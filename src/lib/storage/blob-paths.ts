export const STORAGE_PATHS = {
  // User-specific paths
  userAvatar: (userId: string) => `users/${userId}/avatars`,
  userScript: (userId: string, scriptId: string) => `users/${userId}/scripts/${scriptId}`,
  userInvoice: (userId: string, invoiceId: string) => `users/${userId}/invoices/${invoiceId}`,
  
  // System paths (admin-managed)
  voiceoverPhoto: (voiceoverId: string) => `system/voiceover-photos/${voiceoverId}`,
  voiceoverDemo: (voiceoverId: string) => `system/voiceover-demos/${voiceoverId}`,
  
  // Public paths
  publicDemo: (demoId: string) => `public/demos/${demoId}`,
} as const

export const getBlobPath = (type: keyof typeof STORAGE_PATHS, ...args: string[]): string => {
  const pathFunction = STORAGE_PATHS[type]
  return (pathFunction as (...args: string[]) => string)(...args)
}

interface UserWithRole {
  id: string
  role?: string
}

export const validateUserAccess = (user: UserWithRole | null, ownerId: string): boolean => {
  if (!user) return false
  if (user.role === 'admin') return true
  return user.id === ownerId
}