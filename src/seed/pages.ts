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

    const pages = [];

    // Create Home page without layout reference
    const homePage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        status: 'published',
        hero: {
          type: 'gradient',
          title: 'Professional Voice-Over Services',
          subtitle: 'Bringing your scripts to life with the perfect voice',
        },
        sections: [],
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
        status: 'published',
        hero: {
          type: 'simple',
          title: 'About 14voices',
          subtitle: 'Your trusted partner in professional voice-over services',
        },
        sections: [],
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
        status: 'published',
        hero: {
          type: 'simple',
          title: 'Get in Touch',
          subtitle: "Let's discuss your voice-over project",
        },
        sections: [],
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
        status: 'published',
        hero: {
          type: 'none',
        },
        sections: [],
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
        status: 'published',
        hero: {
          type: 'none',
        },
        sections: [],
        meta: {
          title: 'Terms of Service',
          description: 'Terms of service for using 14voices voice-over services.',
        },
      },
    });
    pages.push(termsPage);
    console.log('✅ Terms of Service page created');

    return pages;
  } catch (error) {
    console.error('❌ Error creating pages:', error);
    throw error;
  }
}
