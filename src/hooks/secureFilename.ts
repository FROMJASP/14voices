import crypto from 'crypto'

export const generateSecureFilename = (originalFilename: string, userId: string): string => {
  const ext = originalFilename.split('.').pop()
  const hash = crypto.createHash('sha256')
    .update(`${userId}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 16)
  
  return `${hash}.${ext}`
}

export const beforeUploadHook = async ({ req, data, operation }: any) => {
  if (operation === 'create' && req.file) {
    const userId = req.user?.id || 'anonymous'
    const secureFilename = generateSecureFilename(req.file.name, userId)
    
    // Store original filename in data for reference
    data.originalFilename = req.file.name
    
    // Update the file object with secure filename
    req.file.name = secureFilename
    req.file.filename = secureFilename
  }
  
  return data
}