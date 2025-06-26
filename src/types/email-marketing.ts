export interface EmailCampaign {
  id: string
  name: string
  subject: string
  previewText?: string
  fromName: string
  fromEmail: string
  replyTo?: string
  content: Record<string, unknown>
  markdownContent?: string
  contentType: 'richtext' | 'markdown' | 'react'
  reactComponent?: string
  audience: string | EmailAudience
  tags?: Array<{ tag: string }>
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled'
  scheduledAt?: string | Date
  resendBroadcastId?: string
  analytics?: CampaignAnalytics
  testEmails?: Array<{
    email: string
    sentAt?: Date
  }>
  abTesting?: {
    enabled: boolean
    variants?: Array<{
      name: string
      subject: string
      percentage: number
    }>
  }
  createdAt: string
  updatedAt: string
}

export interface CampaignAnalytics {
  sentCount: number
  deliveredCount: number
  openedCount: number
  clickedCount: number
  bouncedCount: number
  unsubscribedCount: number
  openRate: number
  clickRate: number
}

export interface EmailAudience {
  id: string
  name: string
  description?: string
  type: 'static' | 'dynamic' | 'all'
  resendAudienceId?: string
  contacts?: string[] | EmailContact[]
  segmentRules?: SegmentRules
  tags?: Array<{ tag: string }>
  contactCount: number
  active: boolean
  syncStatus?: {
    lastSyncedAt?: Date
    syncError?: string
  }
  statistics?: {
    avgOpenRate: number
    avgClickRate: number
    lastCampaignDate?: Date
  }
  createdAt: string
  updatedAt: string
}

export interface SegmentRules {
  rules: Array<{
    field: 'tags' | 'location' | 'engagement' | 'signupDate' | 'lastActivity' | 'custom'
    operator: 'contains' | 'not_contains' | 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty'
    value?: string
    customField?: string
  }>
  logic: 'all' | 'any'
}

export interface EmailContact {
  id: string
  email: string
  firstName?: string
  lastName?: string
  resendContactId?: string
  user?: string | Record<string, unknown>
  subscribed: boolean
  unsubscribedAt?: Date
  tags?: Array<{ tag: string }>
  customFields?: Record<string, unknown>
  location?: {
    country?: string
    state?: string
    city?: string
    timezone?: string
  }
  preferences?: {
    frequency: 'all' | 'weekly' | 'monthly' | 'important'
    categories?: Array<{
      category: 'newsletter' | 'product' | 'promotions' | 'events' | 'educational'
    }>
  }
  engagement?: {
    totalSent: number
    totalOpened: number
    totalClicked: number
    lastOpenedAt?: Date
    lastClickedAt?: Date
    engagementScore: number
  }
  source?: {
    type: 'manual' | 'website' | 'api' | 'csv' | 'integration'
    detail?: string
    signupDate: Date
  }
  status: 'active' | 'bounced' | 'complained' | 'suppressed'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface EmailLog {
  id: string
  recipient?: string | Record<string, unknown>
  recipientEmail: string
  template?: string
  subject: string
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed'
  sentAt?: Date
  deliveredAt?: Date
  openedAt?: Date
  clickedAt?: Date
  openCount?: number
  clickCount?: number
  resendId?: string
  error?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}