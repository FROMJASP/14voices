// This is a temporary file to get the build working
// Run `npm run payload generate:types` to generate the actual types

export interface Page {
  id: string
  title: string
  slug: string
  layout?: string | Layout
  hero?: {
    type: 'none' | 'simple' | 'image' | 'video' | 'gradient'
    title?: string
    subtitle?: string
    image?: string | Media
    videoUrl?: string
    cta?: {
      text?: string
      link?: string
      style?: string
    }
  }
  blocks?: Array<{
    blockType: string
    [key: string]: unknown
  }>
  meta?: {
    title?: string
    description?: string
    keywords?: Array<{ keyword: string }>
    image?: string | Media
    noIndex?: boolean
  }
  openGraph?: {
    title?: string
    description?: string
    type?: string
  }
  parent?: string | Page
  status: 'draft' | 'published' | 'archived'
  publishedDate?: string
  showInNav?: boolean
  navOrder?: number
  createdAt: string
  updatedAt: string
}

export interface Block {
  id: string
  name: string
  category: string
  blockType: string
  heroBanner?: Record<string, unknown>
  featureGrid?: Record<string, unknown>
  contentSection?: Record<string, unknown>
  callToAction?: Record<string, unknown>
  faqAccordion?: Record<string, unknown>
  testimonialsDisplay?: Record<string, unknown>
  teamDisplay?: Record<string, unknown>
  portfolioDisplay?: Record<string, unknown>
  customClasses?: string
  visibility?: {
    showOnDesktop?: boolean
    showOnTablet?: boolean
    showOnMobile?: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string | Media
  avatarURL?: string
  avatarColor?: string
  status: 'active' | 'inactive' | 'suspended'
  role: 'admin' | 'user' | 'editor'
  department?: 'management' | 'production' | 'marketing' | 'finance' | 'support' | 'other'
  jobTitle?: string
  phone?: string
  bio?: string
  timezone?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    github?: string
    website?: string
  }
  preferredLanguage?: 'nl' | 'en'
  emailPreferences?: {
    unsubscribed?: boolean
    marketing?: boolean
    transactional?: boolean
    updates?: boolean
  }
  security?: {
    lastLogin?: string
    loginCount?: number
    twoFactorEnabled?: boolean
    passwordChangedAt?: string
    loginHistory?: Array<{
      timestamp: string
      ipAddress?: string
      userAgent?: string
      success?: boolean
    }>
  }
  lastLogin?: string
  notifications?: {
    inApp?: boolean
    push?: boolean
    sms?: boolean
  }
  metadata?: {
    tags?: Array<{ tag: string }>
    notes?: string
    customFields?: Record<string, unknown>
    createdBy?: string | User
    updatedBy?: string | User
  }
  image?: string
  initials?: string
  createdAt: string
  updatedAt: string
}

export interface Media {
  id: string
  url?: string
  alt?: string
  width?: number
  height?: number
  mimeType?: string
  filesize?: number
  filename?: string
  createdAt: string
  updatedAt: string
}

export interface Layout {
  id: string
  name: string
  type: string
  isDefault?: boolean
  header?: Record<string, unknown>
  footer?: Record<string, unknown>
  sidebar?: Record<string, unknown>
  containerWidth?: string
  spacing?: {
    headerPadding?: string
    contentPadding?: string
    footerPadding?: string
  }
  customCSS?: string
  createdAt: string
  updatedAt: string
}

export interface Section {
  id: string
  name: string
  description?: string
  category: string
  style: string
  configuration?: Record<string, unknown>
  content?: Record<string, unknown>
  components?: Array<Record<string, unknown>>
  visibility?: {
    showOnDesktop?: boolean
    showOnTablet?: boolean
    showOnMobile?: boolean
  }
  customClasses?: string
  createdAt: string
  updatedAt: string
}

export interface Form {
  id: string
  title: string
  slug: string
  description?: string
  status: 'active' | 'inactive' | 'archived'
  fields: Array<{
    type: string
    name: string
    label: string
    required?: boolean
    placeholder?: string
    options?: Array<{ label: string; value: string }>
    validation?: Record<string, unknown>
  }>
  settings?: Record<string, unknown>
  style?: Record<string, unknown>
  submissions?: number
  createdAt: string
  updatedAt: string
}

export interface FormSubmission {
  id: string
  form: string | Form
  data: Record<string, unknown>
  status: string
  notes?: string
  submittedAt: string
  submittedBy?: string | User
  ipAddress?: string
  userAgent?: string
  createdAt: string
  updatedAt: string
}

export interface Testimonial {
  id: string
  name: string
  title?: string
  company?: string
  avatar?: string | Media
  testimonial: string
  rating?: string
  featured?: boolean
  publishedDate?: string
  media?: Record<string, unknown>
  project?: string | PortfolioProject
  display?: Record<string, unknown>
  status: string
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  department?: string
  photo: string | Media
  email?: string
  phone?: string
  order?: number
  featured?: boolean
  bio?: string
  fullBio?: Record<string, unknown>
  specialties?: Array<{ specialty: string }>
  languages?: Array<{ language: string; proficiency: string }>
  experience?: Record<string, unknown>
  social?: {
    linkedin?: string
    twitter?: string
    instagram?: string
    website?: string
    portfolio?: string
  }
  voiceoverProfile?: string | Record<string, unknown>
  media?: Record<string, unknown>
  status: string
  startDate?: string
  slug?: string
  createdAt: string
  updatedAt: string
}

export interface PortfolioProject {
  id: string
  title: string
  slug: string
  client: string
  category: string
  description?: string
  fullDescription?: Record<string, unknown>
  thumbnailImage: string | Media
  featured?: boolean
  completedDate: string
  media?: Record<string, unknown>
  credits?: Record<string, unknown>
  projectInfo?: Record<string, unknown>
  caseStudy?: Record<string, unknown>
  meta?: Record<string, unknown>
  status: string
  relatedProjects?: Array<string | PortfolioProject>
  createdAt: string
  updatedAt: string
}