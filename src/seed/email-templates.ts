import { Payload } from 'payload'

export async function seedEmailTemplates(payload: Payload) {
  console.log('Creating email components...')
  
  // Create default footer
  const defaultFooter = await payload.create({
    collection: 'email-components',
    data: {
      name: 'Default Footer',
      type: 'footer',
      content: {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                { text: '{{companyName}} | {{companyAddress}}' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: 'Website: {{companyWebsite}} | Phone: {{companyPhone}}' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: '{{unsubscribeText}}' },
              ],
            },
          ],
        },
      },
      plainTextContent: '{{companyName}} | {{companyAddress}}\nWebsite: {{companyWebsite}} | Phone: {{companyPhone}}\n\n{{unsubscribeText}}',
      variables: [
        { key: 'companyName', description: 'Company name' },
        { key: 'companyAddress', description: 'Company address' },
        { key: 'companyWebsite', description: 'Company website URL' },
        { key: 'companyPhone', description: 'Company phone number' },
        { key: 'unsubscribeText', description: 'Unsubscribe message' },
      ],
    },
  })
  
  // Create default header
  const defaultHeader = await payload.create({
    collection: 'email-components',
    data: {
      name: 'Default Header',
      type: 'header',
      content: {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                { text: '14voices - Professional Voice Over Services' },
              ],
            },
          ],
        },
      },
      plainTextContent: '14voices - Professional Voice Over Services',
      variables: [],
    },
  })
  
  console.log('Creating email templates...')
  
  // Welcome email template
  await payload.create({
    collection: 'email-templates',
    data: {
      name: 'Welcome Email',
      key: 'welcome-email',
      subject: 'Welcome to 14voices, {{userName}}!',
      previewText: 'Thank you for joining our voice over platform',
      header: defaultHeader.id,
      footer: defaultFooter.id,
      content: {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                { text: 'Hi {{userName}},' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: 'Welcome to 14voices! We\'re excited to have you join our community of professional voice over artists and clients.' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: 'Here\'s what you can do next:' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: '• Browse our talented voice over artists' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: '• Create your first booking' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: '• Upload your scripts securely' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: 'If you have any questions, feel free to reach out to our support team.' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: 'Best regards,\nThe 14voices Team' },
              ],
            },
          ],
        },
      },
      plainTextContent: 'Hi {{userName}},\n\nWelcome to 14voices! We\'re excited to have you join our community of professional voice over artists and clients.\n\nHere\'s what you can do next:\n• Browse our talented voice over artists\n• Create your first booking\n• Upload your scripts securely\n\nIf you have any questions, feel free to reach out to our support team.\n\nBest regards,\nThe 14voices Team',
      variables: [
        { key: 'userName', description: 'User\'s name', required: true },
      ],
      testData: {
        userName: 'John Doe',
        companyName: '14voices',
        companyAddress: '123 Voice Street, Audio City, AC 12345',
        companyWebsite: 'https://14voices.com',
        companyPhone: '+1 (555) 123-4567',
        unsubscribeText: 'You received this email because you signed up for 14voices. If you no longer wish to receive emails from us, you can unsubscribe at any time.',
      },
      active: true,
    },
  })
  
  // Booking confirmation template
  await payload.create({
    collection: 'email-templates',
    data: {
      name: 'Booking Confirmation',
      key: 'booking-confirmation',
      subject: 'Booking Confirmed - {{voiceoverName}}',
      previewText: 'Your voice over booking has been confirmed',
      header: defaultHeader.id,
      footer: defaultFooter.id,
      content: {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                { text: 'Hi {{userName}},' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: 'Your booking has been confirmed!' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: 'Booking Details:' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: '• Voice Over Artist: {{voiceoverName}}' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: '• Booking ID: {{bookingId}}' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: '• Date: {{bookingDate}}' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: 'Next steps:' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: '1. Upload your script in the booking dashboard' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: '2. The voice over artist will review and provide the recording' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: '3. You\'ll be notified when the recording is ready' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                { text: 'Thank you for choosing 14voices!' },
              ],
            },
          ],
        },
      },
      plainTextContent: 'Hi {{userName}},\n\nYour booking has been confirmed!\n\nBooking Details:\n• Voice Over Artist: {{voiceoverName}}\n• Booking ID: {{bookingId}}\n• Date: {{bookingDate}}\n\nNext steps:\n1. Upload your script in the booking dashboard\n2. The voice over artist will review and provide the recording\n3. You\'ll be notified when the recording is ready\n\nThank you for choosing 14voices!',
      variables: [
        { key: 'userName', description: 'User\'s name', required: true },
        { key: 'voiceoverName', description: 'Voice over artist name', required: true },
        { key: 'bookingId', description: 'Booking ID', required: true },
        { key: 'bookingDate', description: 'Booking date', required: true },
      ],
      active: true,
    },
  })
  
  console.log('Creating email sequences...')
  
  // User onboarding sequence
  await payload.create({
    collection: 'email-sequences',
    data: {
      name: 'New User Onboarding',
      key: 'user-onboarding',
      description: 'Welcome sequence for new users',
      triggerEvent: 'user_registered',
      emails: [
        {
          template: (await payload.find({
            collection: 'email-templates',
            where: { key: { equals: 'welcome-email' } },
          })).docs[0].id,
          delayValue: 0,
          delayUnit: 'minutes',
        },
      ],
      active: true,
      stopOnReply: false,
      stopOnUnsubscribe: true,
    },
  })
  
  console.log('Email templates and sequences created successfully!')
}

// Run this script with: tsx src/seed/email-templates.ts
import { fileURLToPath } from 'url'
import { getPayload } from '../utilities/payload.js'

const __filename = fileURLToPath(import.meta.url)

if (process.argv[1] === __filename) {
  getPayload()
    .then(async (payload: Payload) => {
      await seedEmailTemplates(payload)
      process.exit(0)
    })
    .catch((error: unknown) => {
      console.error('Seed error:', error)
      process.exit(1)
    })
}