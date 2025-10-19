# Transactional Email Integration Guide

## Overview

Autopilot Studio includes a comprehensive transactional email system with support for multiple providers (SendGrid, Postmark, Mailgun, AWS SES, SMTP) and automatic failover capabilities.

## Features

✅ **Multiple Provider Support**
- SendGrid (primary)
- Postmark
- Mailgun
- AWS SES
- SMTP (fallback)

✅ **Comprehensive Templates**
- Email verification
- Password reset
- Welcome emails
- Invoice notifications
- Standup summaries
- Project updates
- Task assignments
- Proposal notifications
- Contract signed
- Handover ready

✅ **Advanced Capabilities**
- Automatic failover between providers
- Webhook handling for delivery tracking
- Email analytics and reporting
- Scheduled email delivery
- Attachment support
- Template variables and customization
- Retry logic with exponential backoff
- Development mode with email logging

## Quick Start

### 1. Configure Environment Variables

Copy `.env.example` to `.env` and configure your email provider:

```bash
# Email Provider (sendgrid, postmark, mailgun, ses, smtp)
VITE_EMAIL_PROVIDER=sendgrid

# SendGrid Configuration
VITE_SENDGRID_API_KEY=your_sendgrid_api_key_here
VITE_SENDGRID_SANDBOX=false

# Email Settings
VITE_EMAIL_FROM=noreply@autopilotstudio.com
VITE_EMAIL_FROM_NAME=Autopilot Studio
VITE_EMAIL_REPLY_TO=support@autopilotstudio.com
VITE_EMAIL_REPLY_TO_NAME=Autopilot Studio Support

# Application URL
VITE_APP_URL=http://localhost:5173
```

### 2. Get API Keys

#### SendGrid (Recommended)
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key with "Mail Send" permissions
3. Add to `.env` as `VITE_SENDGRID_API_KEY`

#### Postmark (Alternative)
1. Sign up at [postmarkapp.com](https://postmarkapp.com)
2. Create a server and get the API token
3. Add to `.env` as `VITE_POSTMARK_API_KEY`

#### Mailgun (Alternative)
1. Sign up at [mailgun.com](https://mailgun.com)
2. Get your API key and domain
3. Add to `.env` as `VITE_MAILGUN_API_KEY` and `VITE_MAILGUN_DOMAIN`

### 3. Send Your First Email

```typescript
import { emailService } from '@/services/emailService';

// Send verification email
await emailService.sendTemplateEmail('verification', 'user@example.com', {
  userName: 'John Doe',
  verificationLink: 'https://app.com/verify?token=abc123',
  expiresIn: '24 hours',
  supportEmail: 'support@autopilotstudio.com',
});
```

## Usage Examples

### Send Verification Email

```typescript
import { sendVerificationEmail } from '@/services/emailService';

await sendVerificationEmail(
  'user@example.com',
  'John Doe',
  'verification_token_here'
);
```

### Send Password Reset Email

```typescript
import { sendPasswordResetEmail } from '@/services/emailService';

await sendPasswordResetEmail(
  'user@example.com',
  'John Doe',
  'reset_token_here',
  '192.168.1.1' // Optional IP address
);
```

### Send Invoice Email

```typescript
import { sendInvoiceEmail } from '@/services/emailService';

await sendInvoiceEmail('client@example.com', {
  invoiceNumber: 'INV-001',
  clientName: 'Acme Corp',
  amount: '5,000.00',
  currency: '$',
  dueDate: 'December 31, 2025',
  items: [
    {
      description: 'Web Development',
      quantity: 40,
      unitPrice: '$125.00',
      total: '$5,000.00',
    },
  ],
  subtotal: '5,000.00',
  total: '5,000.00',
  companyName: 'Autopilot Studio',
});
```

### Send Standup Summary

```typescript
import { sendStandupSummaryEmail } from '@/services/emailService';

await sendStandupSummaryEmail(
  ['team@example.com'],
  {
    date: 'October 19, 2025',
    projectName: 'Project Alpha',
    teamMembers: [
      {
        name: 'Alice',
        completed: ['Implemented login page', 'Fixed navigation bug'],
        inProgress: ['Working on dashboard'],
        blockers: [],
      },
      {
        name: 'Bob',
        completed: ['Set up CI/CD pipeline'],
        inProgress: ['Database optimization'],
        blockers: ['Waiting for API documentation'],
      },
    ],
    overallProgress: 65,
    upcomingMilestone: 'Beta Release - Oct 25',
    dashboardLink: 'https://app.com/dashboard/projects/123',
  }
);
```

### Send Custom Email

```typescript
import { emailService } from '@/services/emailService';

await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Custom Email',
  html: '<h1>Hello!</h1><p>This is a custom email.</p>',
  text: 'Hello! This is a custom email.',
  templateType: 'notification',
  priority: 'high',
});
```

### Schedule Email for Later

```typescript
import { emailService } from '@/services/emailService';

const scheduledDate = new Date('2025-10-20T09:00:00Z');

await emailService.sendTemplateEmail(
  'notification',
  'user@example.com',
  {
    title: 'Reminder',
    message: 'Your meeting starts in 1 hour',
    userName: 'John',
  },
  {
    scheduledAt: scheduledDate,
  }
);
```

### Send Email with Attachments

```typescript
import { emailService } from '@/services/emailService';

await emailService.sendEmail({
  to: 'client@example.com',
  subject: 'Invoice with PDF',
  html: '<p>Please find your invoice attached.</p>',
  templateType: 'invoice',
  attachments: [
    {
      filename: 'invoice.pdf',
      content: base64EncodedPDF,
      contentType: 'application/pdf',
    },
  ],
});
```

## Email Templates

All email templates follow the Autopilot Studio design system with:
- Deep charcoal background (#23272F)
- Accent colors for status and actions
- Responsive design
- Plain text fallback
- Branded header and footer

### Available Templates

1. **verification** - Email address verification
2. **password-reset** - Password reset request
3. **welcome** - Welcome new users
4. **invoice** - Invoice notifications
5. **invoice-reminder** - Payment reminders
6. **standup-summary** - Daily standup summaries
7. **project-summary** - Project progress reports
8. **milestone-complete** - Milestone completion
9. **task-assigned** - Task assignment notifications
10. **proposal-sent** - Proposal delivery
11. **contract-signed** - Contract confirmation
12. **handover-ready** - Project handover
13. **notification** - Generic notifications

### Customize Templates

Templates are defined in `src/email/Templates.ts`. You can customize them by:

1. Editing the template methods
2. Modifying the EmailTemplateBuilder
3. Adding new template types

```typescript
// Add custom template
class EmailTemplates {
  customTemplate(data: CustomEmailData): { subject: string; html: string; text: string } {
    const content = `
      <h1>${data.title}</h1>
      <p>${data.message}</p>
      ${this.builder.buildButton(data.actionText, data.actionLink)}
    `;

    return {
      subject: data.title,
      html: this.builder.buildEmail(content, data.preheader),
      text: this.generatePlainText(data.title, data.userName, [data.message]),
    };
  }
}
```

## Webhook Integration

### Setup SendGrid Webhooks

1. Go to SendGrid Settings > Mail Settings > Event Webhook
2. Set HTTP POST URL: `https://your-api.com/webhooks/sendgrid`
3. Select events: Delivered, Opened, Clicked, Bounced, Spam Reports, Unsubscribes
4. Enable webhook

### Handle Webhooks

```typescript
import { emailWebhookService } from '@/services/emailWebhookService';

// Register custom event handlers
emailWebhookService.on('delivered', async (event) => {
  console.log('Email delivered:', event.email);
  // Update database, send notification, etc.
});

emailWebhookService.on('bounced', async (event) => {
  console.warn('Email bounced:', event.email, event.reason);
  // Mark email as invalid, notify admin
});

// Process webhook payload (in your API endpoint)
app.post('/webhooks/sendgrid', async (req, res) => {
  await emailWebhookService.handleSendGridWebhook(req.body);
  res.status(200).send('OK');
});
```

## Email Analytics

### Track Email Performance

```typescript
import { sendGridService } from '@/services/sendgridService';

// Get email statistics
const stats = await sendGridService.getStats(
  new Date('2025-10-01'),
  new Date('2025-10-31')
);

console.log('Emails sent:', stats.requests);
console.log('Delivered:', stats.delivered);
console.log('Opens:', stats.opens);
console.log('Clicks:', stats.clicks);
console.log('Bounces:', stats.bounces);
```

### Monitor Email Queue

```typescript
import { emailService } from '@/services/emailService';

// Get queue status
const queue = emailService.getQueueStatus();

console.log('Pending emails:', queue.filter(e => e.status === 'pending').length);
console.log('Failed emails:', queue.filter(e => e.status === 'failed').length);

// Retry failed email
await emailService.retryEmail('email_id_here');

// Cancel scheduled email
emailService.cancelEmail('email_id_here');
```

## Provider Configuration

### SendGrid Setup

```typescript
import { createSendGridService } from '@/services/sendgridService';

const sendgrid = createSendGridService('your_api_key', {
  sandbox: false, // Enable sandbox mode for testing
});

// Verify API key
const isValid = await sendgrid.verifyApiKey();
console.log('API key valid:', isValid);
```

### Multiple Providers with Failover

```typescript
import { EmailProviderService, EmailProviderFactory } from '@/services/emailProviderService';

// Create primary and fallback providers
const primary = EmailProviderFactory.createProvider({
  provider: 'sendgrid',
  apiKey: 'sendgrid_key',
  from: { email: 'noreply@example.com', name: 'App' },
  baseUrl: 'https://example.com',
  companyName: 'Example Inc',
});

const fallback = EmailProviderFactory.createProvider({
  provider: 'postmark',
  apiKey: 'postmark_key',
  from: { email: 'noreply@example.com', name: 'App' },
  baseUrl: 'https://example.com',
  companyName: 'Example Inc',
});

// Create service with automatic failover
const emailProvider = new EmailProviderService(primary, fallback);

// Send email (automatically fails over if primary fails)
await emailProvider.sendEmail(request);
```

## Development Mode

In development, emails are logged to console instead of being sent:

```typescript
// Development mode automatically enabled when VITE_DEV=true
console.log('📧 Email (Development Mode):', {
  to: 'user@example.com',
  subject: 'Welcome',
  templateType: 'welcome',
});
```

To test with real emails in development, set:

```bash
VITE_SENDGRID_SANDBOX=true
```

This sends emails through SendGrid's sandbox mode (no actual delivery).

## Testing

### Unit Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { emailService } from '@/services/emailService';

describe('Email Service', () => {
  it('should send verification email', async () => {
    const response = await emailService.sendTemplateEmail(
      'verification',
      'test@example.com',
      {
        userName: 'Test User',
        verificationLink: 'https://example.com/verify',
        expiresIn: '24 hours',
        supportEmail: 'support@example.com',
      }
    );

    expect(response.status).toBe('sent');
    expect(response.id).toBeDefined();
  });
});
```

### Integration Tests

```typescript
import { sendGridService } from '@/services/sendgridService';

// Test SendGrid connection
const isValid = await sendGridService.verifyApiKey();
console.assert(isValid, 'SendGrid API key is invalid');

// Send test email
const response = await sendGridService.sendEmail({
  to: 'test@example.com',
  subject: 'Test Email',
  html: '<p>Test</p>',
  templateType: 'notification',
});

console.assert(response.status === 'sent', 'Email failed to send');
```

## Troubleshooting

### Common Issues

**1. Email not sending**
- Check API key is correct
- Verify environment variables are loaded
- Check console for error messages
- Ensure sender email is verified with provider

**2. Emails going to spam**
- Set up SPF, DKIM, and DMARC records
- Use verified sender domain
- Avoid spam trigger words
- Include unsubscribe link

**3. Webhook not working**
- Verify webhook URL is publicly accessible
- Check webhook signature validation
- Ensure correct event types are selected
- Review webhook logs in provider dashboard

**4. Rate limiting**
- Check provider rate limits
- Implement exponential backoff
- Use queue for batch sending
- Consider upgrading provider plan

### Debug Mode

Enable detailed logging:

```typescript
import { emailService } from '@/services/emailService';

// Set log level
localStorage.setItem('email_debug', 'true');

// View email events (development only)
const events = emailWebhookService.getEventsByEmail('user@example.com');
console.log('Email events:', events);
```

## Best Practices

1. **Always use templates** - Consistent branding and easier maintenance
2. **Include plain text version** - Better deliverability and accessibility
3. **Test before sending** - Use sandbox mode or test emails
4. **Monitor deliverability** - Track bounces, spam reports, and unsubscribes
5. **Respect user preferences** - Honor unsubscribe requests immediately
6. **Use appropriate priority** - Reserve 'urgent' for critical emails only
7. **Include unsubscribe link** - Required by law in many jurisdictions
8. **Validate email addresses** - Before sending to avoid bounces
9. **Rate limit sends** - Avoid hitting provider limits
10. **Log all sends** - For audit trail and debugging

## Security Considerations

- Store API keys in environment variables, never in code
- Use HTTPS for webhook endpoints
- Validate webhook signatures
- Implement rate limiting
- Sanitize user input in email content
- Use secure token generation for verification links
- Set appropriate CORS headers
- Monitor for suspicious activity

## Production Checklist

- [ ] API keys configured in production environment
- [ ] Sender domain verified with email provider
- [ ] SPF, DKIM, and DMARC records configured
- [ ] Webhooks set up and tested
- [ ] Email templates reviewed and approved
- [ ] Unsubscribe functionality implemented
- [ ] Rate limiting configured
- [ ] Monitoring and alerting set up
- [ ] Backup provider configured (failover)
- [ ] Legal compliance verified (CAN-SPAM, GDPR)
- [ ] Test emails sent to various providers (Gmail, Outlook, etc.)
- [ ] Error handling and retry logic tested

## Support

For issues or questions:
- Check the troubleshooting section above
- Review SendGrid documentation: https://docs.sendgrid.com
- Contact support: support@autopilotstudio.com

## License

This email integration is part of Autopilot Studio and follows the same license.
