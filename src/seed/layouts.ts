import type { Payload } from 'payload'

export async function seedLayouts(payload: Payload) {
  try {
    // Check if any layouts exist
    const existingLayouts = await payload.find({
      collection: 'layouts',
      limit: 1,
    })

    if (existingLayouts.docs.length > 0) {
      console.log('ℹ️  Layouts already exist, skipping seed')
      return existingLayouts.docs[0]
    }

    // Create the default layout with a beautiful footer
    const defaultLayout = await payload.create({
      collection: 'layouts',
      data: {
        name: 'Default Layout',
        type: 'standard',
        isDefault: true,
        header: {
          style: 'sticky',
          showLogo: true,
          showSearch: true,
          showCTA: true,
          ctaButton: {
            text: 'Get a Quote',
            link: '/contact',
            style: 'primary',
          },
        },
        footer: {
          style: 'multi-column',
          showLogo: true,
          description: 'Professional voice-over services for commercials, narration, e-learning, and more. Bringing your scripts to life with the perfect voice.',
          copyrightText: '© {year} {siteName}. All rights reserved.',
          navigationColumns: [
            {
              title: 'Services',
              links: [
                {
                  label: 'Commercial Voice-Over',
                  linkType: 'internal',
                  page: null, // Will be linked to actual page after creation
                },
                {
                  label: 'Narration',
                  linkType: 'internal',
                  page: null,
                },
                {
                  label: 'E-Learning',
                  linkType: 'internal',
                  page: null,
                },
                {
                  label: 'Animation & Gaming',
                  linkType: 'internal',
                  page: null,
                },
                {
                  label: 'IVR & Phone Systems',
                  linkType: 'internal',
                  page: null,
                },
              ],
            },
            {
              title: 'Company',
              links: [
                {
                  label: 'About Us',
                  linkType: 'internal',
                  page: null,
                },
                {
                  label: 'Our Team',
                  linkType: 'internal',
                  page: null,
                },
                {
                  label: 'Portfolio',
                  linkType: 'internal',
                  page: null,
                },
                {
                  label: 'Testimonials',
                  linkType: 'internal',
                  page: null,
                },
                {
                  label: 'Careers',
                  linkType: 'internal',
                  page: null,
                },
              ],
            },
            {
              title: 'Resources',
              links: [
                {
                  label: 'Blog',
                  linkType: 'internal',
                  page: null,
                },
                {
                  label: 'Voice-Over Guide',
                  linkType: 'internal',
                  page: null,
                },
                {
                  label: 'FAQ',
                  linkType: 'internal',
                  page: null,
                },
                {
                  label: 'Pricing',
                  linkType: 'internal',
                  page: null,
                },
                {
                  label: 'Contact',
                  linkType: 'internal',
                  page: null,
                },
              ],
            },
          ],
          showContactInfo: true,
          contactDisplay: {
            showEmail: true,
            showPhone: true,
            showAddress: true,
            showHours: false,
          },
          showSocialLinks: true,
          socialDisplay: {
            style: 'icons',
            size: 'medium',
          },
          newsletter: {
            enabled: true,
            title: 'Stay Connected',
            description: 'Get voice-over tips, industry news, and exclusive offers delivered to your inbox.',
            placeholder: 'Enter your email address',
            buttonText: 'Subscribe',
          },
          legalLinks: [
            {
              label: 'Privacy Policy',
              page: null,
            },
            {
              label: 'Terms of Service',
              page: null,
            },
            {
              label: 'Cookie Policy',
              page: null,
            },
          ],
          backgroundColor: '#1a1a1a',
          textColor: '#ffffff',
          linkColor: '#e0e0e0',
          linkHoverColor: '#ffffff',
          borderTop: true,
          borderColor: '#333333',
          padding: 'medium',
          showBackToTop: true,
        },
        sidebar: {
          enabled: false,
        },
        containerWidth: 'standard',
        spacing: {
          headerPadding: 'medium',
          contentPadding: 'medium',
          footerPadding: 'medium',
        },
      },
    })

    console.log('✅ Default layout created successfully')

    // Create a minimal layout option as well
    const minimalLayout = await payload.create({
      collection: 'layouts',
      data: {
        name: 'Minimal Layout',
        type: 'minimal',
        isDefault: false,
        header: {
          style: 'standard',
          showLogo: true,
          showSearch: false,
          showCTA: false,
        },
        footer: {
          style: 'minimal',
          showLogo: true,
          copyrightText: '© {year} {siteName}. All rights reserved.',
          showContactInfo: false,
          showSocialLinks: false,
          newsletter: {
            enabled: false,
          },
          legalLinks: [
            {
              label: 'Privacy',
              page: null,
            },
            {
              label: 'Terms',
              page: null,
            },
          ],
          backgroundColor: '#ffffff',
          textColor: '#1a1a1a',
          linkColor: '#666666',
          linkHoverColor: '#000000',
          borderTop: true,
          borderColor: '#e0e0e0',
          padding: 'small',
          showBackToTop: false,
        },
        sidebar: {
          enabled: false,
        },
        containerWidth: 'standard',
        spacing: {
          headerPadding: 'small',
          contentPadding: 'small',
          footerPadding: 'small',
        },
      },
    })

    console.log('✅ Minimal layout created successfully')

    return defaultLayout
  } catch (error) {
    console.error('❌ Error creating layouts:', error)
    throw error
  }
}