import crypto from 'crypto'

export function generateGravatarUrl(
  email: string,
  size: number = 50,
  defaultImage: string = 'mp'
): string {
  const trimmedEmail = email.trim().toLowerCase()
  const hash = crypto.createHash('md5').update(trimmedEmail).digest('hex')
  return `https://www.gravatar.com/avatar/${hash}?d=${defaultImage}&r=g&s=${size}`
}

export function getInitials(name: string): string {
  if (!name) return '?'
  
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}