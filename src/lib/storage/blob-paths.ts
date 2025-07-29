export const STORAGE_PATHS = {
  // User-specific paths
  userAvatar: (userId: string) => `media/avatars/${userId}`,
  userScript: (userId: string, scriptId: string) => `documents/scripts/${userId}/${scriptId}`,
  userInvoice: (userId: string, invoiceId: string) => `documents/invoices/${userId}/${invoiceId}`,

  // Voiceover media paths
  voiceoverMedia: (voiceoverId: string) => `media/voiceovers/${voiceoverId}`,

  // Public paths
  publicMedia: (mediaId: string) => `media/public/${mediaId}`,
} as const;

export const getBlobPath = (type: keyof typeof STORAGE_PATHS, ...args: string[]): string => {
  const pathFunction = STORAGE_PATHS[type];
  return (pathFunction as (...args: string[]) => string)(...args);
};

interface UserWithRole {
  id: string;
  role?: string;
}

export const validateUserAccess = (user: UserWithRole | null, ownerId: string): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.id === ownerId;
};
