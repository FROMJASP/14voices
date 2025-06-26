import crypto from 'crypto'

export const generateSecureFilename = (originalFilename: string, userId: string): string => {
  const ext = originalFilename.split('.').pop()
  const hash = crypto.createHash('sha256')
    .update(`${userId}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 16)
  
  return `${hash}.${ext}`
}

export const beforeUploadHook = async ({ args, req, operation }: {
  args?: {
    data?: Record<string, unknown>
    req?: {
      file?: {
        name: string
        filename?: string
      }
      user?: {
        id: string
      }
    }
  }
  req: {
    file?: {
      name: string
      filename?: string
    }
    user?: {
      id: string
    }
  }
  operation: string
  collection?: unknown
  context?: unknown
}) => {
  const data = args?.data || {}
  const file = args?.req?.file || req?.file
  
  if (operation === 'create' && file) {
    const userId = args?.req?.user?.id || req?.user?.id || 'anonymous'
    const secureFilename = generateSecureFilename(file.name, userId)
    
    // Store original filename in data for reference
    data.originalFilename = file.name
    
    // Update the file object with secure filename
    file.name = secureFilename
    if (file.filename !== undefined) {
      file.filename = secureFilename
    }
  }
  
  return args || { data }
}