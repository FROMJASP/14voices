import { getNavigationData } from '@/lib/navigation';
import { AnnouncementBanner as AnnouncementBannerClient } from '../AnnouncementBanner';

// Server component that fetches its own data - no props needed
export async function AnnouncementBanner() {
  const navigationData = await getNavigationData();

  if (!navigationData?.banner) {
    return null;
  }

  const { banner } = navigationData;

  // Format the link URL based on type
  let linkUrl: string | undefined;
  if (banner.linkType === 'page' && banner.linkPage && typeof banner.linkPage === 'object') {
    linkUrl = `/${banner.linkPage.slug}`;
  } else if (banner.linkType === 'custom' && banner.linkUrl) {
    linkUrl = banner.linkUrl;
  }

  return (
    <AnnouncementBannerClient
      enabled={banner.enabled}
      message={banner.message || ''}
      linkText={banner.linkText}
      linkUrl={linkUrl}
      dismissible={banner.dismissible}
      style={banner.style}
    />
  );
}
