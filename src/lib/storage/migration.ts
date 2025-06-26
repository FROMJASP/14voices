import { list, copy, del } from '@vercel/blob'
import type { Payload } from 'payload'
import { getBlobPath } from './blob-paths'

interface MigrationResult {
  collection: string
  docId: string
  oldPath: string
  newPath: string
  status: 'success' | 'error'
  error?: string
}

export async function migrateStorageStructure(
  payload: Payload,
  token: string,
  dryRun = true
): Promise<MigrationResult[]> {
  const results: MigrationResult[] = []
  
  // Migrate Scripts
  const scripts = await payload.find({
    collection: 'scripts',
    limit: 1000,
  })
  
  for (const script of scripts.docs) {
    const oldPrefix = `media/scripts/`
    const newPrefix = getBlobPath('userScript', script.uploadedBy as string, String(script.id))
    
    try {
      const { blobs } = await list({
        prefix: oldPrefix,
        token,
      })
      
      const scriptBlobs = blobs.filter(blob => blob.pathname.includes(script.filename))
      
      for (const blob of scriptBlobs) {
        const oldPath = blob.pathname
        const newPath = oldPath.replace(oldPrefix, newPrefix + '/')
        
        if (!dryRun) {
          await copy(blob.url, newPath, { access: 'public', token })
          await del(blob.url, { token })
        }
        
        results.push({
          collection: 'scripts',
          docId: String(script.id),
          oldPath,
          newPath,
          status: 'success',
        })
      }
    } catch (error) {
      results.push({
        collection: 'scripts',
        docId: String(script.id),
        oldPath: oldPrefix,
        newPath: newPrefix,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
  
  // Migrate Invoices
  const invoices = await payload.find({
    collection: 'invoices',
    limit: 1000,
  })
  
  for (const invoice of invoices.docs) {
    const oldPrefix = `media/invoices/`
    const newPrefix = getBlobPath('userInvoice', invoice.client as string, String(invoice.id))
    
    try {
      const { blobs } = await list({
        prefix: oldPrefix,
        token,
      })
      
      const invoiceBlobs = blobs.filter(blob => blob.pathname.includes(invoice.filename))
      
      for (const blob of invoiceBlobs) {
        const oldPath = blob.pathname
        const newPath = oldPath.replace(oldPrefix, newPrefix + '/')
        
        if (!dryRun) {
          await copy(blob.url, newPath, { access: 'public', token })
          await del(blob.url, { token })
        }
        
        results.push({
          collection: 'invoices',
          docId: String(invoice.id),
          oldPath,
          newPath,
          status: 'success',
        })
      }
    } catch (error) {
      results.push({
        collection: 'invoices',
        docId: String(invoice.id),
        oldPath: oldPrefix,
        newPath: newPrefix,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
  
  // Migrate User Avatars
  const userAvatars = await payload.find({
    collection: 'user-avatars',
    limit: 1000,
  })
  
  for (const avatar of userAvatars.docs) {
    const oldPrefix = `media/user-avatars/`
    const newPrefix = getBlobPath('userAvatar', avatar.user as string)
    
    try {
      const { blobs } = await list({
        prefix: oldPrefix,
        token,
      })
      
      const avatarBlobs = blobs.filter(blob => blob.pathname.includes(avatar.filename))
      
      for (const blob of avatarBlobs) {
        const oldPath = blob.pathname
        const newPath = oldPath.replace(oldPrefix, newPrefix + '/')
        
        if (!dryRun) {
          await copy(blob.url, newPath, { access: 'public', token })
          await del(blob.url, { token })
        }
        
        results.push({
          collection: 'user-avatars',
          docId: String(avatar.id),
          oldPath,
          newPath,
          status: 'success',
        })
      }
    } catch (error) {
      results.push({
        collection: 'user-avatars',
        docId: String(avatar.id),
        oldPath: oldPrefix,
        newPath: newPrefix,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
  
  return results
}