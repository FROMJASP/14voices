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

    // Create Home page with new layout blocks
    const homePage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        status: 'published',
        layout: [
          {
            blockType: 'hero-v1',
            title: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Professional Voice-Over Services',
                      },
                    ],
                  },
                ],
              },
            },
            description: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Bringing your scripts to life with the perfect voice',
                      },
                    ],
                  },
                ],
              },
            },
            processSteps: [
              {
                text: 'Script ontvangen',
              },
              {
                text: 'Offerte opstellen',
              },
              {
                text: 'Recording & levering',
              },
            ],
            stats: [
              {
                value: '14',
                label: 'Voice-over talenten',
              },
              {
                value: '500+',
                label: 'Projecten voltooid',
              },
              {
                value: '24u',
                label: 'Snelle levering',
              },
            ],
            cta: {
              primaryLabel: 'Get Started',
              primaryUrl: '/contact',
            },
          },
        ],
        meta: {
          title: 'Home',
          description:
            'Professional voice-over services for commercials, narration, e-learning, and more.',
        },
      } as any, // Type assertion to bypass strict typing during seed
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
        layout: [
          {
            blockType: 'hero-v2',
            title: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'About 14voices',
                      },
                    ],
                  },
                ],
              },
            },
            subtitle: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Your trusted partner in professional voice-over services',
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
        meta: {
          title: 'About Us',
          description:
            'Learn about 14voices and our commitment to delivering exceptional voice-over services.',
        },
      } as any,
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
        layout: [
          {
            blockType: 'hero-v2',
            title: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Get in Touch',
                      },
                    ],
                  },
                ],
              },
            },
            subtitle: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: "Let's discuss your voice-over project",
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
        meta: {
          title: 'Contact Us',
          description:
            'Contact 14voices for professional voice-over services. Get a quote for your project today.',
        },
      } as any,
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
        layout: [], // Empty layout for policy pages
        meta: {
          title: 'Privacy Policy',
          description:
            'Privacy policy for 14voices - How we collect, use, and protect your information.',
        },
      } as any,
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
        layout: [], // Empty layout for policy pages
        meta: {
          title: 'Terms of Service',
          description: 'Terms of service for using 14voices voice-over services.',
        },
      } as any,
    });
    pages.push(termsPage);
    console.log('✅ Terms of Service page created');

    return pages;
  } catch (error) {
    console.error('❌ Error creating pages:', error);
    throw error;
  }
}
