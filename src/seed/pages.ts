import type { Payload } from 'payload';

export async function seedPages(payload: Payload) {
  try {
    // Check if any pages exist
    const existingPages = await payload.find({
      collection: 'pages',
      limit: 1,
    });

    if (existingPages.docs.length > 0) {
      console.log('ℹ️  Pages already exist, skipping seed');
      return existingPages.docs;
    }

    // Get the default layout
    const layouts = await payload.find({
      collection: 'layouts',
      where: {
        isDefault: {
          equals: true,
        },
      },
      limit: 1,
    });

    const defaultLayout = layouts.docs[0];

    if (!defaultLayout) {
      console.error('❌ No default layout found. Please run layout seed first.');
      return [];
    }

    const pages = [];

    // Create Home page
    const homePage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        layout: defaultLayout.id,
        status: 'published',
        hero: {
          type: 'gradient',
          title: 'Professional Voice-Over Services',
          subtitle: 'Bringing your scripts to life with the perfect voice',
        },
        blocks: [],
        meta: {
          title: 'Home',
          description:
            'Professional voice-over services for commercials, narration, e-learning, and more.',
        },
      },
    });
    pages.push(homePage);
    console.log('✅ Home page created');

    // Create About page
    const aboutPage = await payload.create({
      collection: 'pages',
      data: {
        title: 'About Us',
        slug: 'about',
        layout: defaultLayout.id,
        status: 'published',
        hero: {
          type: 'simple',
          title: 'About 14voices',
          subtitle: 'Your trusted partner in professional voice-over services',
        },
        blocks: [],
        meta: {
          title: 'About Us',
          description:
            'Learn about 14voices and our commitment to delivering exceptional voice-over services.',
        },
      },
    });
    pages.push(aboutPage);
    console.log('✅ About page created');

    // Create Contact page
    const contactPage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Contact',
        slug: 'contact',
        layout: defaultLayout.id,
        status: 'published',
        hero: {
          type: 'simple',
          title: 'Get in Touch',
          subtitle: "Let's discuss your voice-over project",
        },
        blocks: [],
        meta: {
          title: 'Contact Us',
          description:
            'Contact 14voices for professional voice-over services. Get a quote for your project today.',
        },
      },
    });
    pages.push(contactPage);
    console.log('✅ Contact page created');

    // Create Privacy Policy page
    const privacyPage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        layout: defaultLayout.id,
        status: 'published',
        hero: {
          type: 'none',
        },
        blocks: [],
        meta: {
          title: 'Privacy Policy',
          description:
            'Privacy policy for 14voices - How we collect, use, and protect your information.',
        },
      },
    });
    pages.push(privacyPage);
    console.log('✅ Privacy Policy page created');

    // Create Terms of Service page
    const termsPage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Terms of Service',
        slug: 'terms-of-service',
        layout: defaultLayout.id,
        status: 'published',
        hero: {
          type: 'none',
        },
        blocks: [],
        meta: {
          title: 'Terms of Service',
          description: 'Terms of service for using 14voices voice-over services.',
        },
      },
    });
    pages.push(termsPage);
    console.log('✅ Terms of Service page created');

    // Now update the layout footer links to point to these pages
    await updateLayoutFooterLinks(payload, String(defaultLayout.id), {
      about: String(aboutPage.id),
      contact: String(contactPage.id),
      privacy: String(privacyPage.id),
      terms: String(termsPage.id),
    });

    return pages;
  } catch (error) {
    console.error('❌ Error creating pages:', error);
    throw error;
  }
}

async function updateLayoutFooterLinks(
  payload: Payload,
  layoutId: string,
  pageIds: {
    about: string;
    contact: string;
    privacy: string;
    terms: string;
  }
) {
  try {
    const layout = await payload.findByID({
      collection: 'layouts',
      id: layoutId,
    });

    // Update navigation column links
    const updatedNavColumns = layout.footer.navigationColumns.map(
      (column: {
        links: Array<{ label: string; page?: string; [key: string]: unknown }>;
        [key: string]: unknown;
      }) => {
        const updatedLinks = column.links.map(
          (link: { label: string; page?: string; [key: string]: unknown }) => {
            // Map page names to IDs
            if (link.label === 'About Us') {
              return { ...link, page: pageIds.about };
            }
            if (link.label === 'Contact') {
              return { ...link, page: pageIds.contact };
            }
            return link;
          }
        );
        return { ...column, links: updatedLinks };
      }
    );

    // Update legal links
    const updatedLegalLinks = layout.footer.legalLinks.map(
      (link: { label: string; page?: string; [key: string]: unknown }) => {
        if (link.label === 'Privacy Policy') {
          return { ...link, page: pageIds.privacy };
        }
        if (link.label === 'Terms of Service') {
          return { ...link, page: pageIds.terms };
        }
        return link;
      }
    );

    // Update the layout
    await payload.update({
      collection: 'layouts',
      id: layoutId,
      data: {
        footer: {
          ...layout.footer,
          navigationColumns: updatedNavColumns,
          legalLinks: updatedLegalLinks,
        },
      },
    });

    console.log('✅ Layout footer links updated');
  } catch (error) {
    console.error('⚠️  Warning: Could not update layout footer links:', error);
  }
}
