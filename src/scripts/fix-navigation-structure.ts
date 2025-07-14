import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function fixNavigationStructure() {
  try {
    const payload = await getPayload({ config: configPromise });

    // Get existing navigation
    const result = await payload.find({
      collection: 'navigation',
      limit: 1,
    });

    if (result.docs.length === 0) {
      console.log('No navigation found, creating default...');

      // Create default navigation with proper structure
      await payload.create({
        collection: 'navigation',
        data: {
          navbar: {
            mainMenu: [],
            navbarMobileSettings: {
              showSearch: true,
              showSocial: true,
              mobileOnlyItems: [],
            },
          },
          footer: {
            footerColumns: [],
            footerBottom: {
              copyrightText: `© ${new Date().getFullYear()} Fourteen Voices. All rights reserved.`,
              legalLinks: [],
            },
            footerMobileSettings: {
              mobileColumns: 'stacked',
              hideColumnsOnMobile: false,
            },
          },
          banner: {
            bannerSettings: {
              enabled: false,
              message: '🚀 **14 Nieuwe Stemmen**. Beluister hier wat ze voor jou kunnen betekenen!',
              dismissible: true,
              style: 'gradient',
            },
          },
        },
      });

      console.log('Created default navigation');
    } else {
      console.log('Navigation exists, skipping...');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error fixing navigation structure:', error);
    process.exit(1);
  }
}

fixNavigationStructure();
