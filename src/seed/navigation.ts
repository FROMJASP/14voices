import type { Payload } from 'payload';

export async function seedNavigation(payload: Payload) {
  try {
    // Check if navigation exists
    const existingNavigation = await payload.find({
      collection: 'navigation',
      limit: 1,
    });

    if (existingNavigation.docs.length > 0) {
      console.log('ℹ️  Navigation already exists, skipping seed');
      return existingNavigation.docs[0];
    }

    // Get some pages to link to
    const pages = await payload.find({
      collection: 'pages',
      where: {
        status: {
          equals: 'published',
        },
      },
    });

    const homePage = pages.docs.find(
      (page) => (page as unknown as { slug: string }).slug === 'home'
    );
    const aboutPage = pages.docs.find(
      (page) => (page as unknown as { slug: string }).slug === 'about'
    );
    const contactPage = pages.docs.find(
      (page) => (page as unknown as { slug: string }).slug === 'contact'
    );

    // Create navigation
    const navigation = await payload.create({
      collection: 'navigation',
      data: {
        mainMenu: [
          {
            label: 'Home',
            type: 'page',
            page: homePage?.id,
          },
          {
            label: 'Stemmen',
            type: 'anchor',
            anchor: 'stemmen',
          },
          {
            label: 'Prijzen',
            type: 'anchor',
            anchor: 'prijzen',
          },
          {
            label: 'Blog',
            type: 'anchor',
            anchor: 'blog',
          },
          {
            label: 'Diensten',
            type: 'dropdown',
            subItems: [
              {
                label: 'Commercials',
                type: 'custom',
                url: '/diensten/commercials',
                description: 'Radio en TV commercials',
              },
              {
                label: 'Bedrijfsfilms',
                type: 'custom',
                url: '/diensten/bedrijfsfilms',
                description: 'Voice-overs voor bedrijfspresentaties',
              },
              {
                label: 'E-learning',
                type: 'custom',
                url: '/diensten/e-learning',
                description: 'Educatieve voice-overs',
              },
              {
                label: 'IVR & Telefonie',
                type: 'custom',
                url: '/diensten/ivr',
                description: 'Telefooncentrale en IVR systemen',
              },
            ],
          },
          {
            label: 'Contact',
            type: 'anchor',
            anchor: 'contact',
          },
        ],
        footerColumns: [
          {
            title: 'Diensten',
            links: [
              {
                label: 'Commercials',
                type: 'custom',
                url: '/diensten/commercials',
              },
              {
                label: 'Bedrijfsfilms',
                type: 'custom',
                url: '/diensten/bedrijfsfilms',
              },
              {
                label: 'E-learning',
                type: 'custom',
                url: '/diensten/e-learning',
              },
              {
                label: 'IVR & Telefonie',
                type: 'custom',
                url: '/diensten/ivr',
              },
            ],
          },
          {
            title: 'Bedrijf',
            links: [
              {
                label: 'Over Ons',
                type: aboutPage ? 'page' : 'custom',
                ...(aboutPage ? { page: aboutPage.id } : { url: '/over-ons' }),
              },
              {
                label: 'Onze Stemmen',
                type: 'custom',
                url: '/voiceovers',
              },
              {
                label: 'Contact',
                type: contactPage ? 'page' : 'custom',
                ...(contactPage ? { page: contactPage.id } : { url: '/contact' }),
              },
            ],
          },
          {
            title: 'Support',
            links: [
              {
                label: 'FAQ',
                type: 'custom',
                url: '/faq',
              },
              {
                label: 'Werkwijze',
                type: 'custom',
                url: '/werkwijze',
              },
              {
                label: 'Tarieven',
                type: 'custom',
                url: '/tarieven',
              },
            ],
          },
        ],
        footerBottom: {
          copyrightText: '© {year} 14voices. Alle rechten voorbehouden.',
          legalLinks: [
            {
              label: 'Privacy Policy',
              page: pages.docs.find(
                (page) => (page as unknown as { slug: string }).slug === 'privacy-policy'
              )?.id,
            },
            {
              label: 'Algemene Voorwaarden',
              page: pages.docs.find(
                (page) => (page as unknown as { slug: string }).slug === 'terms'
              )?.id,
            },
          ],
        },
        mobileMenu: {
          showSearch: true,
          showSocial: true,
          additionalLinks: [
            {
              label: 'Bel ons',
              type: 'custom',
              url: 'tel:+31612345678',
              icon: 'phone',
            },
            {
              label: 'Email',
              type: 'custom',
              url: 'mailto:info@14voices.nl',
              icon: 'email',
            },
          ],
        },
      },
    });

    console.log('✅ Navigation created successfully');
    return navigation;
  } catch (error) {
    console.error('❌ Error creating navigation:', error);
    throw error;
  }
}
