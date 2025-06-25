const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface VoiceoverDemo {
  id: string
  title: string
  demoType: 'reel' | 'commercials' | 'narrations'
  audioFile: {
    url: string
    filename: string
  }
  duration?: string
  language?: string
  accent?: string
  tags?: string[]
  isPrimary?: boolean
  voiceover: {
    id: string
    name: string
    slug: string
  }
}

export interface Voiceover {
  id: string
  name: string
  slug: string
  bio?: string
  profilePhoto?: {
    url: string
    alt?: string
  }
  demos?: VoiceoverDemo[]
}

export async function getVoiceovers(): Promise<Voiceover[]> {
  const res = await fetch(`${API_URL}/api/voiceovers?depth=2`, {
    next: { revalidate: 60 }
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch voiceovers')
  }
  
  const data = await res.json()
  return data.docs
}

export async function getVoiceoverBySlug(slug: string): Promise<Voiceover | null> {
  const res = await fetch(`${API_URL}/api/voiceovers?where[slug][equals]=${slug}&depth=2`, {
    next: { revalidate: 60 }
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch voiceover')
  }
  
  const data = await res.json()
  return data.docs[0] || null
}

export async function getVoiceoverDemos(): Promise<VoiceoverDemo[]> {
  const res = await fetch(`${API_URL}/api/voiceover-demos?depth=1`, {
    next: { revalidate: 60 }
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch demos')
  }
  
  const data = await res.json()
  return data.docs
}