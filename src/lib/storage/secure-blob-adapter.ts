import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { getBlobPath } from './blob-paths'

export const secureVercelBlobStorage = (token: string) => {
  return vercelBlobStorage({
    collections: {
      'user-avatars': {
        prefix: ({ doc }) => {
          const userId = doc.user?.id || doc.user || 'unknown'
          return getBlobPath('userAvatar', String(userId))
        },
      },
      scripts: {
        prefix: ({ doc }) => {
          const userId = doc.uploadedBy?.id || doc.uploadedBy || 'unknown'
          return getBlobPath('userScript', String(userId), doc.id)
        },
      },
      invoices: {
        prefix: ({ doc }) => {
          const clientId = doc.client?.id || doc.client || 'unknown'
          return getBlobPath('userInvoice', String(clientId), doc.id)
        },
      },
      'voiceover-photos': {
        prefix: ({ doc }) => {
          const voiceoverId = doc.voiceover?.id || doc.voiceover || doc.id
          return getBlobPath('voiceoverPhoto', String(voiceoverId))
        },
      },
      'voiceover-demos': {
        prefix: ({ doc }) => {
          const voiceoverId = doc.voiceover?.id || doc.voiceover || doc.id
          return getBlobPath('voiceoverDemo', String(voiceoverId))
        },
      },
      media: true, // Keep for backward compatibility
    },
    token,
  })
}