export interface AnnouncementBarData {
  enabled: boolean;
  message: string;
  linkType?: 'none' | 'custom' | 'page';
  linkUrl?: string;
  linkText?: string;
  dismissible?: boolean;
  style?: 'gradient' | 'solid' | 'subtle';
}

export interface AnnouncementBarProps {
  data: AnnouncementBarData;
  className?: string;
}
