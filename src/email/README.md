# Email Template System

A comprehensive email template system for Autopilot Studio with branded transactional emails, preview tools, and queue management.

## Features

- 📧 **13 Pre-built Templates**: Verification, invoices, standups, summaries, and more
- 🎨 **Branded Design**: Follows Autopilot Studio design system with dark theme
- 📱 **Responsive**: Mobile-friendly email layouts
- 🔍 **Preview Tool**: Live preview with sample data
- 📬 **Queue Management**: Track, retry, and cancel emails
- 🔄 **Multiple Providers**: Support for SendGrid, Postmark, AWS SES, SMTP
- ✅ **Type-Safe**: Full TypeScript support
- 🧪 **Testing**: Send test emails with custom data

## Architecture

```
src/email/
├── EmailTemplateBuilder.ts  # Core email HTML builder
├── Templates.ts              # All email templates
└── README.md                 # This file

src/types/
└── email.ts                  # TypeScript types

src/services/
└── emailService.ts           # Email sending service

src/api/
└── email.ts                  # API functions

src/hooks/
└── useEmail.ts               # React hooks

src/components/email/
├── EmailPreview.tsx          # Preview component
└── EmailQueue.tsx            # Queue management
```

## Available Templates

### Authentication
- **verification**: Email verification with token link
- **password-reset**: Password reset with security notice
- **welcome**: Welcome email after verification

### Billing
- **invoice**: Detailed invoice with line items
- **invoice-reminder**: Payment reminder with overdue notice
- **invoice-paid**: Payment confirmation

### Project Management
- **standup-summary**: Daily standup with team updates
- **project-summary**: Weekly/monthly project progress
- **milestone-complete**: Milestone completion notification
- **task-assigned**: Task assignment with details

### Sales & Contracts
- **proposal-sent**: Proposal delivery to client
- **contract-signed**: Contract signature confirmation

### Handover
- **handover-ready**: Project completion and handover package

### General
- **notification**: Generic notification template

## Usage

### Basic Email Sending

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

### Using Helper Functions

```typescript
import { 
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendInvoiceEmail,
  sendStandupSummaryEmail,
} from '@/services/emailService';

// Send verification
await sendVerificationEmail(
  'user@example.com',
  'John Doe',
  'verification-token-123'
);

// Send invoice
await sendInvoiceEmail('client@example.com', {
  invoiceNumber: 'INV-2024-001',
  clientName: 'Acme Corp',
  amount: '5,000.00',
  currency: '$',
  dueDate: 'March 15, 2024',
  items: [
    {
      description: 'Web Development',
      quantity: 40,
      unitPrice: '$100',
      total: '$4,000',
    },
  ],
  subtotal: '5,000.00',
  total: '5,000.00',
  companyName: 'Autopilot Studio',
});
```

### Using React Hooks

```typescript
import { useSendTemplateEmail } from '@/hooks/useEmail';

function MyComponent() {
  const sendEmail = useSendTemplateEmail();

  const handleSendEmail = async () => {
    await sendEmail.mutateAsync({
      templateType: 'welcome',
      to: 'user@example.com',
      variables: {
        userName: 'John Doe',
        dashboardLink: 'https://app.com/dashboard',
        gettingStartedLink: 'https://app.com/docs',
        supportEmail: 'support@autopilotstudio.com',
      },
    });
  };

  return (
    <button onClick={handleSendEmail}>
      Send Welcome Email
    </button>
  );
}
```

### Scheduling Emails

```typescript
// Schedule email for later
await emailService.sendTemplateEmail(
  'invoice-reminder',
  'client@example.com',
  invoiceData,
  {
    scheduledAt: new Date('2024-03-15T09:00:00Z'),
  }
);
```

### Email Queue Management

```typescript
import { useEmailQueue, useRetryEmail, useCancelEmail } from '@/hooks/useEmail';

function QueueManager() {
  const { data: queue } = useEmailQueue();
  const retryEmail = useRetryEmail();
  const cancelEmail = useCancelEmail();

  return (
    <div>
      {queue?.map(email => (
        <div key={email.id}>
          <p>{email.request.subject}</p>
          <p>Status: {email.status}</p>
          {email.status === 'failed' && (
            <button onClick={() => retryEmail.mutate(email.id)}>
              Retry
            </button>
          )}
          {email.status === 'pending' && (
            <button onClick={() => cancelEmail.mutate(email.id)}>
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Design System

### Colors

The email templates follow the Autopilot Studio design system:

- **Background**: Deep charcoal (#23272F)
- **Card Background**: Medium dark gray (#2C313A)
- **Text**: High-contrast white (#FFFFFF) for headings
- **Secondary Text**: Light gray (#B0B6C3)
- **Muted Text**: Muted gray (#818899)
- **Border**: Subtle gray (#353A43)
- **Primary**: Muted green (#72D47A)
- **Accent Colors**:
  - Yellow: #FFDF6E
  - Green: #72D47A
  - Blue: #60B4F7
  - Red: #F47A7A
  - Purple: #B98CF9

### Typography

- **Font**: Inter, -apple-system, Segoe UI, sans-serif
- **Headings**: Bold (700), white color
- **Body**: Regular (400), light gray color
- **Line Height**: 1.6 for body text

### Components

#### Buttons

```typescript
emailBuilder.buildButton('Click Here', 'https://example.com', 'primary');
// or
emailBuilder.buildButton('Learn More', 'https://example.com', 'secondary');
```

#### Cards

```typescript
emailBuilder.buildCard(`
  <h3>Card Title</h3>
  <p>Card content goes here</p>
`);
```

#### Badges

```typescript
emailBuilder.buildBadge('Success', 'success');
emailBuilder.buildBadge('Warning', 'warning');
emailBuilder.buildBadge('Info', 'info');
emailBuilder.buildBadge('Danger', 'danger');
```

#### Lists

```typescript
emailBuilder.buildList([
  'First item',
  'Second item',
  'Third item',
]);

// Ordered list
emailBuilder.buildList([
  'Step one',
  'Step two',
  'Step three',
], true);
```

#### Tables

```typescript
emailBuilder.buildTable(
  ['Header 1', 'Header 2', 'Header 3'],
  [
    ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
    ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
  ]
);
```

## Configuration

### Environment Variables

```env
# Email Provider (sendgrid, postmark, ses, smtp)
VITE_EMAIL_PROVIDER=sendgrid

# API Key for email provider
VITE_EMAIL_API_KEY=your-api-key

# From address
VITE_EMAIL_FROM=noreply@autopilotstudio.com
VITE_EMAIL_FROM_NAME=Autopilot Studio

# Reply-to address
VITE_EMAIL_REPLY_TO=support@autopilotstudio.com
VITE_EMAIL_REPLY_TO_NAME=Autopilot Studio Support

# App URL
VITE_APP_URL=https://autopilotstudio.com

# Logo URL
VITE_EMAIL_LOGO_URL=https://autopilotstudio.com/logo.png

# Company info
VITE_COMPANY_ADDRESS=123 Innovation Drive, Tech City, TC 12345

# Social links
VITE_SOCIAL_TWITTER=https://twitter.com/autopilotstudio
VITE_SOCIAL_LINKEDIN=https://linkedin.com/company/autopilotstudio
VITE_SOCIAL_GITHUB=https://github.com/autopilotstudio
```

### Custom Configuration

```typescript
import { EmailService } from '@/services/emailService';

const customEmailService = new EmailService({
  provider: 'postmark',
  apiKey: 'your-postmark-api-key',
  from: {
    email: 'custom@example.com',
    name: 'Custom Name',
  },
  companyName: 'My Company',
});
```

## Creating Custom Templates

### 1. Define Template Data Type

```typescript
// src/types/email.ts
export interface MyCustomEmailData {
  userName: string;
  customField: string;
  actionLink: string;
}
```

### 2. Create Template Method

```typescript
// src/email/Templates.ts
export class EmailTemplates {
  // ... existing methods

  myCustomTemplate(data: MyCustomEmailData): { subject: string; html: string; text: string } {
    const content = `
      <h1>Custom Email</h1>
      <p>Hi ${data.userName},</p>
      <p>${data.customField}</p>
      ${this.builder.buildButton('Take Action', data.actionLink)}
    `;

    return {
      subject: 'Your Custom Email Subject',
      html: this.builder.buildEmail(content, 'Preview text here'),
      text: this.generatePlainText('Custom Email', data.userName, [
        data.customField,
        `Action link: ${data.actionLink}`,
      ]),
    };
  }
}
```

### 3. Add to Template Type

```typescript
// src/types/email.ts
export type EmailTemplateType = 
  | 'verification'
  | 'password-reset'
  // ... existing types
  | 'my-custom-template';
```

### 4. Update Service

```typescript
// src/services/emailService.ts
private generateEmailContent(
  templateType: EmailTemplateType,
  data: EmailTemplateData
): { subject: string; html: string; text: string } {
  switch (templateType) {
    // ... existing cases
    case 'my-custom-template':
      return this.templates.myCustomTemplate(data as MyCustomEmailData);
    default:
      throw new Error(`Unknown template type: ${templateType}`);
  }
}
```

## Testing

### Preview in Browser

1. Navigate to `/email-management`
2. Select template type
3. Modify sample data (JSON)
4. Click "Generate Preview"
5. View in HTML, HTML Code, or Plain Text tabs

### Send Test Email

1. In Email Management page
2. Enter test email address
3. Click "Send Test Email"
4. Check inbox

### Development Mode

In development, emails are logged to console instead of being sent:

```typescript
// Console output
📧 Email (Development Mode): {
  to: 'user@example.com',
  subject: 'Verify Your Email',
  templateType: 'verification',
  html: '<!DOCTYPE html>...'
}
```

## Email Provider Integration

### SendGrid

```typescript
// Backend implementation
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: request.to,
  from: config.from,
  subject: request.subject,
  html: request.html,
  text: request.text,
});
```

### Postmark

```typescript
// Backend implementation
import postmark from 'postmark';

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

await client.sendEmail({
  From: config.from.email,
  To: request.to,
  Subject: request.subject,
  HtmlBody: request.html,
  TextBody: request.text,
});
```

### AWS SES

```typescript
// Backend implementation
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const client = new SESClient({ region: 'us-east-1' });

await client.send(new SendEmailCommand({
  Source: config.from.email,
  Destination: { ToAddresses: [request.to] },
  Message: {
    Subject: { Data: request.subject },
    Body: {
      Html: { Data: request.html },
      Text: { Data: request.text },
    },
  },
}));
```

## Best Practices

1. **Always provide plain text**: Include text version for accessibility
2. **Test across clients**: Preview in Gmail, Outlook, Apple Mail
3. **Keep it simple**: Avoid complex CSS and JavaScript
4. **Mobile-first**: Design for mobile screens first
5. **Accessible**: Use semantic HTML and proper alt text
6. **Unsubscribe link**: Always include unsubscribe option
7. **Preheader text**: Add preview text for better open rates
8. **Error handling**: Always handle email failures gracefully
9. **Rate limiting**: Respect provider rate limits
10. **Monitoring**: Track delivery, opens, and bounces

## Troubleshooting

### Emails not sending

1. Check environment variables are set
2. Verify API key is valid
3. Check email provider dashboard for errors
4. Review email queue for failed attempts
5. Check browser console for errors

### Styling issues

1. Test in multiple email clients
2. Use inline styles for critical CSS
3. Avoid CSS Grid and Flexbox
4. Use tables for layout
5. Test with images disabled

### Delivery issues

1. Verify sender domain is authenticated
2. Check SPF, DKIM, and DMARC records
3. Monitor bounce and complaint rates
4. Use dedicated IP for high volume
5. Warm up new IP addresses gradually

## Support

For issues or questions:
- Email: support@autopilotstudio.com
- Documentation: https://autopilotstudio.com/docs/email
- GitHub: https://github.com/autopilotstudio

## License

Copyright © 2024 Autopilot Studio. All rights reserved.
