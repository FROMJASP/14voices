// Common shared types across domains

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'customer' | 'voiceover';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  filename: string;
  url: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  alt?: string;
}

export interface DateRange {
  start: Date | string;
  end: Date | string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
}

// Re-export domain-specific types for convenience
export * from '@/types/voiceover';
export * from '@/types/blocks';
export * from '@/types/email-marketing';
export * from '@/types/forms';
