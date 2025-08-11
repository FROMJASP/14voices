export interface QuickLink {
  label: string;
  url: string;
  openInNewTab?: boolean;
}

export interface InfoNavbarData {
  enabled: boolean;
  whatsappNumber?: string;
  email?: string;
  quickLinks?: QuickLink[];
}

export interface InfoNavbarProps {
  data: InfoNavbarData;
  className?: string;
}
