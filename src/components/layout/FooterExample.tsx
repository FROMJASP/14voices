"use client"

import { Footer } from './Footer'

// Example configurations for different footer styles
const footerConfigs = {
  multiColumn: {
    style: 'multi-column' as const,
    logo: {
      text: '14voices',
      href: '/'
    },
    description: 'Premier voiceover talent agency connecting distinctive voices with creative projects worldwide.',
    columns: [
      {
        title: 'Services',
        links: [
          { label: 'Commercial', href: '/services/commercial' },
          { label: 'Narration', href: '/services/narration' },
          { label: 'Animation', href: '/services/animation' },
          { label: 'Video Games', href: '/services/video-games' },
          { label: 'Audio Books', href: '/services/audiobooks' },
        ]
      },
      {
        title: 'Company',
        links: [
          { label: 'About Us', href: '/about' },
          { label: 'Our Talent', href: '/talent' },
          { label: 'Portfolio', href: '/portfolio' },
          { label: 'Testimonials', href: '/testimonials' },
          { label: 'Contact', href: '/contact' },
        ]
      },
      {
        title: 'Resources',
        links: [
          { label: 'Blog', href: '/blog' },
          { label: 'FAQs', href: '/faqs' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'Casting Tips', href: '/resources/casting-tips' },
          { label: 'Support', href: '/support' },
        ]
      }
    ],
    contact: {
      email: 'hello@14voices.com',
      phone: '+1 (555) 123-4567',
      address: 'Los Angeles, CA 90028'
    },
    social: [
      { platform: 'facebook', href: 'https://facebook.com/14voices', label: 'Facebook' },
      { platform: 'twitter', href: 'https://twitter.com/14voices', label: 'Twitter' },
      { platform: 'instagram', href: 'https://instagram.com/14voices', label: 'Instagram' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/14voices', label: 'LinkedIn' },
      { platform: 'youtube', href: 'https://youtube.com/14voices', label: 'YouTube' },
    ],
    newsletter: {
      title: 'Stay in the loop',
      description: 'Get weekly updates on new talent, industry insights, and exclusive casting opportunities.',
      placeholder: 'your@email.com',
      buttonText: 'Subscribe'
    },
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
    copyright: `© ${new Date().getFullYear()} 14voices. All rights reserved.`,
    showBackToTop: true,
  },

  centered: {
    style: 'centered' as const,
    logo: {
      text: '14voices',
      href: '/'
    },
    description: 'Where every voice tells a story. Connect with professional voice talent for your next project.',
    columns: [
      {
        title: 'Quick Links',
        links: [
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Services', href: '/services' },
          { label: 'Talent', href: '/talent' },
          { label: 'Portfolio', href: '/portfolio' },
          { label: 'Blog', href: '/blog' },
          { label: 'Contact', href: '/contact' },
        ]
      }
    ],
    social: [
      { platform: 'facebook', href: 'https://facebook.com/14voices', label: 'Facebook' },
      { platform: 'twitter', href: 'https://twitter.com/14voices', label: 'Twitter' },
      { platform: 'instagram', href: 'https://instagram.com/14voices', label: 'Instagram' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/14voices', label: 'LinkedIn' },
    ],
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
    ],
    copyright: `© ${new Date().getFullYear()} 14voices`,
    showBackToTop: true,
  },

  minimal: {
    style: 'minimal' as const,
    logo: {
      text: '14voices',
      href: '/'
    },
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
    social: [
      { platform: 'twitter', href: 'https://twitter.com/14voices', label: 'Twitter' },
      { platform: 'instagram', href: 'https://instagram.com/14voices', label: 'Instagram' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/14voices', label: 'LinkedIn' },
    ],
    copyright: `© ${new Date().getFullYear()} 14voices`,
    showBackToTop: false,
  },

  split: {
    style: 'split' as const,
    logo: {
      text: '14voices',
      href: '/'
    },
    description: 'Your partner in finding the perfect voice for every project. From commercials to audiobooks, we\'ve got you covered.',
    columns: [
      {
        title: 'Services',
        links: [
          { label: 'Commercial VO', href: '/services/commercial' },
          { label: 'Narration', href: '/services/narration' },
          { label: 'Character Voices', href: '/services/character' },
          { label: 'IVR & Telephony', href: '/services/ivr' },
        ]
      },
      {
        title: 'Resources',
        links: [
          { label: 'Voice Samples', href: '/samples' },
          { label: 'Casting Guide', href: '/guide' },
          { label: 'Industry News', href: '/news' },
          { label: 'FAQ', href: '/faq' },
        ]
      },
      {
        title: 'Connect',
        links: [
          { label: 'Contact Us', href: '/contact' },
          { label: 'Join Our Roster', href: '/join' },
          { label: 'Client Portal', href: '/portal' },
          { label: 'Support', href: '/support' },
        ]
      }
    ],
    contact: {
      email: 'info@14voices.com',
      phone: '+1 (555) 987-6543',
      address: 'New York, NY 10001'
    },
    social: [
      { platform: 'facebook', href: 'https://facebook.com/14voices', label: 'Facebook' },
      { platform: 'instagram', href: 'https://instagram.com/14voices', label: 'Instagram' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/14voices', label: 'LinkedIn' },
      { platform: 'youtube', href: 'https://youtube.com/14voices', label: 'YouTube' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
    copyright: `© ${new Date().getFullYear()} 14voices Agency. All rights reserved.`,
    showBackToTop: true,
  }
}

export default function FooterExample() {
  return (
    <div className="space-y-16">
      <div>
        <h2 className="text-2xl font-bold mb-4">Multi-Column Footer</h2>
        <Footer config={footerConfigs.multiColumn} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Centered Footer</h2>
        <Footer config={footerConfigs.centered} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Minimal Footer</h2>
        <Footer config={footerConfigs.minimal} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Split Footer</h2>
        <Footer config={footerConfigs.split} />
      </div>
    </div>
  )
}