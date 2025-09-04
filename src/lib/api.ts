import type { TransformedVoiceover as Voiceover, VoiceoverDemo } from '@/types/voiceover';
import { getClientServerUrl } from './client-config';

// CRITICAL FIX: Use the improved client config for proper URL resolution
const API_URL = getClientServerUrl();

export type { Voiceover, VoiceoverDemo };

export async function getVoiceovers(): Promise<Voiceover[]> {
  try {
    const res = await fetch(`${API_URL}/api/public-voiceovers?depth=2`, {
      next: { revalidate: 900 }, // 15 minutes
      cache: 'force-cache', // Use cache when available
    });

    if (!res.ok) {
      console.error('Failed to fetch voiceovers:', res.status);
      return [];
    }

    const data = await res.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching voiceovers:', error);
    return [];
  }
}

export async function getVoiceoverBySlug(slug: string): Promise<Voiceover | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/public-voiceovers?where[slug][equals]=${slug}&depth=2`,
      {
        next: { revalidate: 900 }, // 15 minutes
      }
    );

    if (!res.ok) {
      console.error('Failed to fetch voiceover:', res.status);
      return null;
    }

    const data = await res.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching voiceover by slug:', error);
    return null;
  }
}

export async function getVoiceoverDemos(): Promise<VoiceoverDemo[]> {
  try {
    const res = await fetch(`${API_URL}/api/voiceover-demos?depth=1`, {
      next: { revalidate: 900 }, // 15 minutes
    });

    if (!res.ok) {
      console.error('Failed to fetch demos:', res.status);
      return [];
    }

    const data = await res.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching demos:', error);
    return [];
  }
}

export interface NavigationItem {
  label: string;
  type: 'page' | 'custom' | 'dropdown';
  page?: {
    slug: string;
    title: string;
  };
  url?: string;
  newTab?: boolean;
  subItems?: Array<{
    label: string;
    type: 'page' | 'custom';
    page?: {
      slug: string;
      title: string;
    };
    url?: string;
    description?: string;
  }>;
}

export interface Navigation {
  id: string;
  mainMenu?: NavigationItem[];
  footerColumns?: Array<{
    title: string;
    links: Array<{
      label: string;
      type: 'page' | 'custom';
      page?: {
        slug: string;
        title: string;
      };
      url?: string;
      newTab?: boolean;
    }>;
  }>;
  footerBottom?: {
    copyrightText?: string;
    legalLinks?: Array<{
      label: string;
      page?: {
        slug: string;
        title: string;
      };
    }>;
  };
  mobileMenu?: {
    showSearch?: boolean;
    showSocial?: boolean;
    additionalLinks?: Array<{
      label: string;
      type: 'page' | 'custom';
      page?: {
        slug: string;
        title: string;
      };
      url?: string;
      icon?: string;
    }>;
  };
}

export async function getNavigation(): Promise<Navigation | null> {
  try {
    const res = await fetch(`${API_URL}/api/navigation?depth=2`, {
      next: { revalidate: 900 }, // 15 minutes
    });

    if (!res.ok) {
      console.error('Failed to fetch navigation:', res.status);
      return null;
    }

    const data = await res.json();
    // Navigation is a singleton, so we get the first (and only) document
    return data.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return null;
  }
}
