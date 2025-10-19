# Transactional Email - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get SendGrid API Key (2 minutes)

1. Go to [sendgrid.com](https://sendgrid.com) and sign up (free tier available)
2. Navigate to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it "Autopilot Studio" and select **Full Access** (or at minimum **Mail Send**)
5. Copy the API key (you'll only see it once!)

### Step 2: Configure Environment (1 minute)

Add to your `.env` file:

```bash
VITE_EMAIL_PROVIDER=sendgrid
VITE_SENDGRID_API_KEY=SG.paste_your_key_here
VITE_EMAIL_FROM=noreply@yourdomain.com
VITE_EMAIL_FROM_NAME=Autopilot Studio
```

### Step 3: Verify Sender (2 minutes)

**Option A: Single Sender Verification (Quick)**
1. Go to SendGrid **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your email address
4. Check your email and click verification link

**Option B: Domain Authentication (Recommended for Production)**
1. Go to SendGrid **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Follow DNS setup instructions
4. Wait for verification (can take up to 48 hours)

### Step 4: Send Your First Email

```typescript
import { sendVerificationEmail } from '@/services/emailService';

// Send verification email
await sendVerificationEmail(
  'user@example.com',
  'John Doe',
  'verification_token_123'
);

console.log('✅ Email sent!');
```

## 📧 Common Email Types

### Verification Email
```typescript
import { sendVerificationEmail } from '@/services/emailService';

await sendVerificationEmail(
  email,
  userName,
  verificationToken
);
```

### Password Reset
```typescript
import { sendPasswordResetEmail } from '@/services/emailService';

await sendPasswordResetEmail(
  email,
  userName,
  resetToken,
  ipAddress // optional
);
```

### Welcome Email
```typescript
import { sendWelcomeEmail } from '@/services/emailService';

await sendWelcomeEmail(email, userName);
```

### Invoice
```typescript
import { sendInvoiceEmail } from '@/services/emailService';

await sendInvoiceEmail(clientEmail, {
  invoiceNumber: 'INV-001',
  clientName: 'Acme Corp',
  amount: '5,000.00',
  currency: '$',
  dueDate: 'Dec 31, 2025',
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

### Custom Notification
```typescript
import { sendNotificationEmail } from '@/services/emailService';

await sendNotificationEmail(
  email,
  'Your Project is Ready',
  'Great news! Your project has been completed.',
  userName,
  'View Project', // optional button text
  'https://app.com/projects/123' // optional button link
);
```

## 🧪 Testing

### Development Mode (No Emails Sent)
Emails are automatically logged to console in development:

```bash
npm run dev
# Emails will show in console, not actually sent
```

### Sandbox Mode (Test with SendGrid)
Enable sandbox to test without actual delivery:

```bash
VITE_SENDGRID_SANDBOX=true
```

### Send Test Email
```typescript
import { sendNotificationEmail } from '@/services/emailService';

await sendNotificationEmail(
  'your-email@example.com',
  'Test Email',
  'This is a test from Autopilot Studio',
  'Test User'
);
```

## 🔧 Troubleshooting

### "API key is not configured"
- Check `.env` file has `VITE_SENDGRID_API_KEY`
- Restart dev server after adding env variables
- Verify API key is correct (starts with `SG.`)

### "Sender email not verified"
- Go to SendGrid dashboard
- Verify single sender or authenticate domain
- Use verified email in `VITE_EMAIL_FROM`

### Emails going to spam
- Set up domain authentication (SPF, DKIM, DMARC)
- Use verified sender domain
- Avoid spam trigger words
- Include unsubscribe link

### Email not received
- Check spam folder
- Verify recipient email is valid
- Check SendGrid activity log
- Ensure sender is verified

## 📊 Monitor Emails

### Check Queue Status
```typescript
import { emailService } from '@/services/emailService';

const queue = emailService.getQueueStatus();
console.log('Pending:', queue.filter(e => e.status === 'pending').length);
console.log('Failed:', queue.filter(e => e.status === 'failed').length);
```

### View SendGrid Dashboard
1. Go to [app.sendgrid.com](https://app.sendgrid.com)
2. Click **Activity** to see email logs
3. View delivery status, opens, clicks

## 🎨 Customize Templates

Templates are in `src/email/Templates.ts`:

```typescript
// Edit existing template
verification(data: VerificationEmailData) {
  const content = `
    <h1>Verify Your Email</h1>
    <p>Hi ${data.userName},</p>
    <p>Your custom message here...</p>
    ${this.builder.buildButton('Verify Email', data.verificationLink)}
  `;
  
  return {
    subject: 'Verify Your Email',
    html: this.builder.buildEmail(content),
    text: this.generatePlainText(...),
  };
}
```

## 🚀 Production Checklist

Before going live:

- [ ] SendGrid API key added to production env
- [ ] Sender domain verified
- [ ] Test emails sent successfully
- [ ] Templates reviewed and approved
- [ ] Unsubscribe functionality working
- [ ] SPF/DKIM/DMARC records configured
- [ ] Monitoring set up
- [ ] Rate limits understood

## 📚 Full Documentation

For complete documentation, see:
- `EMAIL_INTEGRATION_GUIDE.md` - Complete guide
- `TRANSACTIONAL_EMAIL_IMPLEMENTATION.md` - Technical details

## 🆘 Need Help?

- Check troubleshooting section above
- Review SendGrid docs: https://docs.sendgrid.com
- Contact: support@autopilotstudio.com

---

**That's it!** You're ready to send transactional emails. 🎉
