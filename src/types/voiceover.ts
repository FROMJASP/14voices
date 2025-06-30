export interface PayloadVoiceover {
  id: string
  name: string
  description?: string
  profilePhoto?: {
    id: string
    url: string
    filename: string
    mimeType?: string
    alt?: string
  } | string
  additionalPhotos?: Array<{
    photo: {
      id: string
      url: string
      filename: string
      mimeType?: string
    } | string
    caption?: string
  }>
  styleTags: Array<{
    tag: string
    customTag?: string
  }>
  primaryDemo?: {
    id: string
    url: string
    filename: string
    mimeType?: string
  } | string
  additionalDemos?: Array<{
    demo: {
      id: string
      url: string
      filename: string
      mimeType?: string
    } | string
    title: string
    description?: string
  }>
  status: 'active' | 'draft' | 'more-voices' | 'archived'
  group?: {
    id: string
    name: string
    slug: string
    color: string
    description?: string
    isActive?: boolean
  } | string
  availability?: {
    isAvailable?: boolean
    unavailableFrom?: string
    unavailableUntil?: string
  }
  slug?: string
  createdAt: string
  updatedAt: string
}

export interface TransformedVoiceover {
  id: string
  name: string
  slug: string
  bio?: string
  profilePhoto?: {
    url: string
    alt?: string
  }
  demos: VoiceoverDemo[]
  status: string
  group?: {
    id: string
    name: string
    slug: string
    color: string
    description?: string
    isActive?: boolean
  }
  styleTags?: Array<{
    tag: string
    customTag?: string
  }>
}

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
  description?: string
  voiceover: {
    id: string
    name: string
    slug: string
  }
}