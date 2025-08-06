export interface EmailStats {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

export interface TemplateStats {
  templateName: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
}

export interface EmailAnalytics {
  overall: EmailStats;
  byTemplate: TemplateStats[];
}

export type DateRange = '24h' | '7d' | '30d' | '90d';

export interface EmailLogStatus {
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
}

export interface EmailPreviewParams {
  templateId: string;
  recipientEmail: string;
  subject?: string;
  data?: Record<string, any>;
}

export interface EmailTestParams {
  templateId: string;
  recipientEmail: string;
  subject?: string;
  testData?: Record<string, any>;
}
