export interface QuickLink {
  label: string;
  url: string;
  openInNewTab?: boolean;
}

export interface WhatsAppTooltip {
  enabled?: boolean;
  title?: string;
  message?: string;
  image?:
    | {
        url?: string;
        alt?: string;
      }
    | number;
}

export interface InfoNavbarData {
  enabled: boolean;
  whatsappNumber?: string;
  whatsappTooltip?: WhatsAppTooltip;
  email?: string;
  quickLinks?: QuickLink[];
}

export interface InfoNavbarProps {
  data: InfoNavbarData;
  className?: string;
}
