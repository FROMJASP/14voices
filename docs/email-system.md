# Email System Documentation

## Overview

The 14voices email system is built on Resend and integrated with Payload CMS, providing:
- Template management with reusable components
- Email sequences (drip campaigns)
- Comprehensive tracking and analytics
- Preview and testing capabilities

## Features

### 1. Email Templates
- Create and manage email templates in Payload admin
- Support for variables using Handlebars syntax (`{{variableName}}`)
- Rich text editor for content
- Preview functionality with test data
- Active/inactive status control

### 2. Reusable Components
- Headers, footers, signatures, and CTAs
- Update once, apply everywhere
- Variables support for dynamic content

### 3. Email Sequences
- Automated drip campaigns
- Trigger on events (user registration, booking, etc.)
- Configurable delays (minutes, hours, days, weeks)
- Conditional sending with JavaScript expressions

### 4. Tracking & Analytics
- Real-time email status tracking
- Open rates, click rates, bounce rates
- Performance metrics by template
- Dashboard with date range filtering

### 5. Background Processing
- Scheduled email processing via cron jobs
- Retry logic for failed emails
- Batch processing for efficiency

## Setup

### Environment Variables

```env
RESEND_API_KEY=your_resend_api_key
RESEND_WEBHOOK_SECRET=your_webhook_secret
CRON_SECRET=your_cron_secret
```

### Webhook Configuration

Set up Resend webhook at: `https://yourdomain.com/api/webhooks/resend`

### Cron Job

For Vercel, add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/process-emails",
    "schedule": "*/5 * * * *"
  }]
}
```

## Usage

### Creating Email Templates

1. Navigate to Admin > Email Templates
2. Create new template with:
   - Unique key (e.g., "welcome-email")
   - Subject line with variables
   - Content with rich text
   - Optional header/footer components

### Setting Up Sequences

1. Go to Admin > Email Sequences
2. Define trigger event
3. Add emails with delays
4. Activate sequence

### Sending Emails Programmatically

```typescript
import { sendEmail } from '@/lib/email/renderer'

await sendEmail({
  templateKey: 'welcome-email',
  recipient: {
    id: userId,
    email: userEmail,
    name: userName,
  },
  variables: {
    userName: 'John Doe',
    activationLink: 'https://...',
  },
  payload,
})
```

### Triggering Sequences

```typescript
import { triggerEmailSequence } from '@/lib/email/sequences'

await triggerEmailSequence({
  sequenceKey: 'user-onboarding',
  userId: userId,
  variables: {
    userName: 'John Doe',
  },
  payload,
})
```

## Email Variables

Common variables available in all templates:
- `{{recipientEmail}}` - Recipient's email
- `{{recipientName}}` - Recipient's name
- `{{companyName}}` - From global settings
- `{{companyAddress}}` - From global settings
- `{{unsubscribeUrl}}` - Unsubscribe link

## Best Practices

1. **Test Before Sending**: Use preview and test email features
2. **Monitor Performance**: Check analytics regularly
3. **Handle Unsubscribes**: Respect user preferences
4. **Retry Failed Emails**: System automatically retries 3 times
5. **Use Variables**: Make templates dynamic and reusable

## Troubleshooting

- **Emails not sending**: Check Resend API key and logs
- **Webhooks failing**: Verify webhook secret
- **Cron not running**: Check cron configuration and secret
- **Preview not working**: Ensure test data is valid JSON