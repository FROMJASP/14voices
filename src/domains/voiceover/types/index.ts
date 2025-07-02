export interface VoiceoverEntity {
  id: string
  name: string
  slug: string
  bio?: string
  profilePhoto?: {
    url: string
    alt?: string
  }
  demos: DemoEntity[]
  status: VoiceoverStatus
  group?: GroupEntity
  styleTags?: StyleTag[]
  availability?: AvailabilityInfo
  createdAt: Date
  updatedAt: Date
}

export interface DemoEntity {
  id: string
  title: string
  demoType: DemoType
  audioFile: AudioFile
  duration?: string
  language?: string
  accent?: string
  tags?: string[]
  isPrimary?: boolean
  description?: string
  voiceoverId: string
}

export interface GroupEntity {
  id: string
  name: string
  slug: string
  color: string
  description?: string
  isActive?: boolean
}

export interface StyleTag {
  tag: string
  customTag?: string
}

export interface AudioFile {
  url: string
  filename: string
  mimeType?: string
}

export interface AvailabilityInfo {
  isAvailable?: boolean
  unavailableFrom?: Date
  unavailableUntil?: Date
}

export type VoiceoverStatus = 'active' | 'draft' | 'more-voices' | 'archived'
export type DemoType = 'reel' | 'commercials' | 'narrations'

export interface VoiceoverQueryParams {
  locale?: string
  slug?: string
  status?: VoiceoverStatus[]
  page?: number
  limit?: number
  sort?: string
  depth?: number
}

export interface PaginatedResult<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface RepositoryError extends Error {
  code: string
  statusCode?: number
  details?: any
}

export class VoiceoverNotFoundError extends Error implements RepositoryError {
  code = 'VOICEOVER_NOT_FOUND'
  statusCode = 404
  
  constructor(slug: string) {
    super(`Voiceover with slug "${slug}" not found`)
    this.name = 'VoiceoverNotFoundError'
  }
}

export class RepositoryConnectionError extends Error implements RepositoryError {
  code = 'REPOSITORY_CONNECTION_ERROR'
  statusCode = 503
  
  constructor(message: string, public details?: any) {
    super(message)
    this.name = 'RepositoryConnectionError'
  }
}

export class ValidationError extends Error implements RepositoryError {
  code = 'VALIDATION_ERROR'
  statusCode = 400
  
  constructor(message: string, public details?: any) {
    super(message)
    this.name = 'ValidationError'
  }
}