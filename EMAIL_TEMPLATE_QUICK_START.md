# Email Template System - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Preview Email Templates

Navigate to the Email Management page (admin only):
```
http://localhost:5173/email-management
```

**Steps:**
1. Select a template type from dropdown (e.g., "Email Verification")
2. Review the pre-filled sample data (JSON)
3. Click "Generate Preview"
4. View the email in three formats:
   - **Preview**: See how it looks
   - **HTML**: View source code
   - **Plain Text**: See text version

### 2. Send a Test Email

In the Email Management page:
1. Enter your email address in the "Email Address" field
2. Click "Send Test Email"
3. Check your inbox (or console in dev mode)

### 3. Use in Your Code

#### Send Verification Email
```typescript
import { sendVerificationEmail } from '@/services/emailService';

await sendVerificationEmail(
  'user@example.com',
  'John Doe',
  'verification-token-123'
);
```

#### Send Invoice
```typescript
import { sendInvoiceEmail } from '@/services/emailService';

await sendInvoiceEmail('client@example.com', {
  invoiceNumber: 'INV-2024-001',
  clientName: 'Acme Corp',
  amount: '5,000.00',
  currency: '$',
  dueDate: 'March 15, 2024',
  items: [
    { description: 'Web Development', quantity: 40, unitPrice: '$100', total: '$4,000' },
  ],
  subtotal: '5,000.00',
  total: '5,000.00',
  companyName: 'Autopilot Studio',
});
```

#### Use React Hook
```typescript
import { useSendTemplateEmail } from '@/hooks/useEmail';

function MyComponent() {
  const sendEmail = useSendTemplateEmail();

  const handleSend = () => {
    sendEmail.mutate({
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

  return <button onClick={handleSend}>Send Email</button>;
}
```

## 📧 Available Templates

1. **verification** - Email verification with token
2. **password-reset** - Password reset with security notice
3. **welcome** - Welcome email after signup
4. **invoice** - Detailed invoice with line items
5. **invoice-reminder** - Payment reminder
6. **standup-summary** - Daily standup summary
7. **project-summary** - Project progress report
8. **milestone-complete** - Milestone completion
9. **task-assigned** - Task assignment notification
10. **proposal-sent** - Proposal delivery
11. **contract-signed** - Contract signature confirmation
12. **handover-ready** - Project handover package
13. **notification** - Generic notification

## 🎨 Design System

All emails follow the Autopilot Studio design:
- **Background**: Deep charcoal (#23272F)
- **Cards**: Medium dark gray (#2C313A)
- **Primary**: Muted green (#72D47A)
- **Text**: High-contrast white (#FFFFFF)
- **Font**: Inter, sans-serif

## ⚙️ Configuration

### Environment Variables

Create a `.env` file:
```env
VITE_EMAIL_PROVIDER=sendgrid
VITE_EMAIL_API_KEY=your-api-key
VITE_EMAIL_FROM=noreply@autopilotstudio.com
VITE_EMAIL_FROM_NAME=Autopilot Studio
VITE_APP_URL=https://autopilotstudio.com
```

### Development Mode

In development, emails are logged to console instead of being sent:
```
📧 Email (Development Mode): {
  to: 'user@example.com',
  subject: 'Verify Your Email',
  ...
}
```

## 🧪 Testing Checklist

- [ ] Preview all templates in browser
- [ ] Send test email to yourself
- [ ] Check mobile responsiveness
- [ ] Verify all links work
- [ ] Test in Gmail, Outlook, Apple Mail
- [ ] Check plain text version

## 📚 Full Documentation

For complete documentation, see:
- **Implementation Guide**: `EMAIL_TEMPLATE_IMPLEMENTATION.md`
- **API Reference**: `src/email/README.md`
- **Type Definitions**: `src/types/email.ts`

## 🆘 Troubleshooting

### Emails not showing in preview
- Check browser console for errors
- Verify JSON variables are valid
- Try a different template

### Test email not received
- Check spam folder
- Verify email address is correct
- In dev mode, check console logs
- Ensure backend is running

### Build errors
- Run `npm install` to ensure dependencies
- Check TypeScript errors with `npm run build`
- Verify all imports are correct

## 🎯 Next Steps

1. ✅ Test all templates in preview
2. ✅ Send test emails
3. ⏳ Configure email provider (SendGrid/Postmark)
4. ⏳ Set up backend endpoints
5. ⏳ Add domain authentication (SPF, DKIM)

## 📞 Support

- **Documentation**: `src/email/README.md`
- **Email**: support@autopilotstudio.com
- **GitHub**: Issues tab

---

**Ready to use!** Start by visiting `/email-management` to preview templates.
