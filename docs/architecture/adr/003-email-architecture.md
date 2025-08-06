# ADR 003: Email System Architecture

## Status

Accepted

## Context

The platform needs a sophisticated email system for:

- Transactional emails (bookings, invoices)
- Marketing campaigns
- Email sequences/automation
- Analytics and tracking
- Template management

## Decision

Built a custom email marketing system on top of Resend API with:

- Template system with rich text editor
- Campaign management
- Audience segmentation
- Batch processing for scale
- Analytics tracking
- Queue-based sending

## Consequences

### Positive

- Full control over email functionality
- Cost-effective compared to email marketing SaaS
- Integrated with our data model
- Custom analytics
- Flexible template system

### Negative

- More code to maintain
- Need to handle email compliance
- Building features that exist in SaaS solutions
- Responsible for deliverability

## Implementation

Created email domain with:

- `EmailService` - Main orchestrator
- `EmailBatchProcessor` - Queue processing
- `EmailAnalyticsService` - Tracking and reporting
- Collections for templates, campaigns, logs
- Background job processing
- Resend webhook integration
