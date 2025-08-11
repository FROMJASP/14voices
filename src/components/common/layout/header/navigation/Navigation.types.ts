import type { LogoSettings } from '../logo/Logo';
import type { InfoNavbarData } from '../info-navbar/InfoNavbar.types';

export interface MenuItem {
  label: string;
  url: string;
  hasDropdown?: boolean;
  openInNewTab?: boolean;
}

export interface NavigationSettings {
  mainMenuItems?: MenuItem[];
  loginText?: string;
  loginUrl?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
}

export interface NavigationProps {
  menuItems?: MenuItem[];
  navigationSettings?: NavigationSettings;
  logoSettings?: LogoSettings;
  infoNavbarData?: InfoNavbarData;
  className?: string;
}
