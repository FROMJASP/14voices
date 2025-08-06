export interface Script {
  id: string;
  title: string;
  filename: string;
  filesize?: number;
  url: string;
  originalFilename?: string;
  instructions?: string;
  scriptType?: string;
  language?: string;
  deadline?: string;
  assignedVoiceover?: string | { id: string };
  uploadedBy: string;
  accessLog?: AccessLogEntry[];
}

export interface AccessLogEntry {
  accessedBy: string;
  accessedAt: string;
  action: 'viewed' | 'downloaded' | 'edited';
}

export interface ScriptAccess {
  hasAccess: boolean;
  reason?: 'admin' | 'owner' | 'assigned' | 'denied';
}

export interface Booking {
  id: string;
  title: string;
  customer: string | { id: string };
  voiceover: string | { id: string };
  status: BookingStatus;
  script?: string | Script;
  deadline?: string;
  price?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export interface BookingCreateParams {
  title: string;
  customer: string;
  voiceover: string;
  script?: string;
  deadline?: string;
  price?: number;
  notes?: string;
}

export interface BookingUpdateParams {
  title?: string;
  status?: BookingStatus;
  deadline?: string;
  price?: number;
  notes?: string;
}
