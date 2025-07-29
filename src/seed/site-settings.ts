import type { Payload } from 'payload';

export async function seedSiteSettings(payload: Payload) {
  try {
    // Check if site settings already exist
    const existingSettings = await payload
      .findGlobal({
        slug: 'site-settings',
      })
      .catch(() => null);

    if (existingSettings) {
      console.log('ℹ️  Site settings already exist, skipping seed');
      return existingSettings;
    }

    // Create default site settings
    const siteSettings = await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        siteName: '14voices',
        tagline: 'Professional Voice-Over Services',
        siteUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
        language: 'en',
        contact: {
          email: 'hello@14voices.com',
          phone: '+1 (555) 123-4567',
          address: {
            street: '123 Studio Way',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90028',
            country: 'United States',
          },
          hours: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed',
        },
        socialLinks: {
          facebook: 'https://facebook.com/14voices',
          twitter: 'https://twitter.com/14voices',
          instagram: 'https://instagram.com/14voices',
          linkedin: 'https://linkedin.com/company/14voices',
          youtube: 'https://youtube.com/@14voices',
        },
        defaultSeo: {
          title: '%s | 14voices - Professional Voice-Over Services',
          description:
            '14voices offers professional voice-over services for commercials, narration, e-learning, and more. Find the perfect voice for your project.',
          keywords: [
            { keyword: 'voice over' },
            { keyword: 'voice acting' },
            { keyword: 'commercial voice' },
            { keyword: 'narration' },
            { keyword: 'voice talent' },
            { keyword: '14voices' },
          ],
        },
        openGraph: {
          siteName: '14voices',
          type: 'website',
        },
        twitterCard: {
          cardType: 'summary_large_image',
          handle: '@14voices',
        },
        features: {
          enableSearch: true,
          enableBlog: true,
          maintenanceMode: false,
          maintenanceTitle: 'We zijn zo terug!',
          maintenanceMessage: 'We voeren momenteel gepland onderhoud uit. We zijn zo weer online.',
          maintenanceContactLabel: 'Contact nodig?',
          showContactEmail: true,
        },
      },
    });

    console.log('✅ Site settings created successfully');
    return siteSettings;
  } catch (error) {
    console.error('❌ Error creating site settings:', error);
    throw error;
  }
}
