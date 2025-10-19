/**
 * Email Service
 * 
 * Service layer for sending transactional emails with support for
 * multiple providers (SendGrid, Postmark, AWS SES, SMTP).
 */

import type {
  EmailSendRequest,
  EmailSendResponse,
  EmailConfig,
  EmailQueueItem,
  EmailTemplateType,
  EmailTemplateData,
} from '@/types/email';
import { emailTemplates, EmailTemplates } from '@/email/Templates';

/**
 * Email Service Configuration
 */
const emailConfig: EmailConfig = {
  provider: (import.meta.env.VITE_EMAIL_PROVIDER as EmailConfig['provider']) || 'sendgrid',
  apiKey: import.meta.env.VITE_EMAIL_API_KEY,
  from: {
    email: import.meta.env.VITE_EMAIL_FROM || 'noreply@autopilotstudio.com',
    name: import.meta.env.VITE_EMAIL_FROM_NAME || 'Autopilot Studio',
  },
  replyTo: {
    email: import.meta.env.VITE_EMAIL_REPLY_TO || 'support@autopilotstudio.com',
    name: import.meta.env.VITE_EMAIL_REPLY_TO_NAME || 'Autopilot Studio Support',
  },
  baseUrl: import.meta.env.VITE_APP_URL || 'https://autopilotstudio.com',
  logoUrl: import.meta.env.VITE_EMAIL_LOGO_URL,
  companyName: 'Autopilot Studio',
  companyAddress: import.meta.env.VITE_COMPANY_ADDRESS,
  socialLinks: {
    twitter: import.meta.env.VITE_SOCIAL_TWITTER,
    linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN,
    github: import.meta.env.VITE_SOCIAL_GITHUB,
  },
};

/**
 * Email queue for retry logic
 */
const emailQueue: Map<string, EmailQueueItem> = new Map();

/**
 * Email Service Class
 */
export class EmailService {
  private templates: EmailTemplates;

  constructor(config?: Partial<EmailConfig>) {
    // Config merged with defaults but not stored as we use provider service
    const mergedConfig = { ...emailConfig, ...config };
    this.templates = emailTemplates;
    
    // Suppress unused variable warning
    void mergedConfig;
  }

  /**
   * Send email using template
   */
  async sendTemplateEmail<T extends EmailTemplateData>(
    templateType: EmailTemplateType,
    to: string | string[],
    data: T,
    options?: {
      cc?: string[];
      bcc?: string[];
      priority?: EmailSendRequest['priority'];
      scheduledAt?: Date;
      metadata?: Record<string, unknown>;
    }
  ): Promise<EmailSendResponse> {
    try {
      // Generate email content from template
      const { subject, html, text } = this.generateEmailContent(templateType, data);

      // Create send request
      const request: EmailSendRequest = {
        to,
        cc: options?.cc,
        bcc: options?.bcc,
        subject,
        html,
        text,
        templateType,
        variables: data as unknown as Record<string, unknown>,
        priority: options?.priority || 'normal',
        scheduledAt: options?.scheduledAt,
        metadata: options?.metadata,
      };

      // Send email
      return await this.sendEmail(request);
    } catch (error) {
      console.error('Failed to send template email:', error);
      throw error;
    }
  }

  /**
   * Send raw email
   */
  async sendEmail(request: EmailSendRequest): Promise<EmailSendResponse> {
    try {
      // Validate request
      this.validateEmailRequest(request);

      // If scheduled, add to queue
      if (request.scheduledAt && request.scheduledAt > new Date()) {
        return this.scheduleEmail(request);
      }

      // Send immediately
      return await this.sendEmailNow(request);
    } catch (error) {
      console.error('Failed to send email:', error);
      
      return {
        id: this.generateId(),
        status: 'failed',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send email immediately
   */
  private async sendEmailNow(request: EmailSendRequest): Promise<EmailSendResponse> {
    try {
      // In development mode, log email instead of sending
      if (import.meta.env.DEV) {
        console.log('📧 Email (Development Mode):', {
          to: request.to,
          subject: request.subject,
          templateType: request.templateType,
          html: request.html.substring(0, 200) + '...',
        });

        return {
          id: this.generateId(),
          status: 'sent',
          messageId: `dev-${Date.now()}`,
          timestamp: new Date(),
        };
      }

      // In production, use the email provider service
      const { emailProviderService } = await import('./emailProviderService');
      return await emailProviderService.sendEmail(request);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  /**
   * Schedule email for later delivery
   */
  private scheduleEmail(request: EmailSendRequest): EmailSendResponse {
    const id = this.generateId();
    
    const queueItem: EmailQueueItem = {
      id,
      request,
      status: 'pending',
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date(),
      scheduledAt: request.scheduledAt,
    };

    emailQueue.set(id, queueItem);

    // In production, this would be handled by a job queue
    if (request.scheduledAt) {
      const delay = request.scheduledAt.getTime() - Date.now();
      setTimeout(() => {
        this.processQueueItem(id);
      }, delay);
    }

    return {
      id,
      status: 'pending',
      timestamp: new Date(),
    };
  }

  /**
   * Process queued email
   */
  private async processQueueItem(id: string): Promise<void> {
    const item = emailQueue.get(id);
    if (!item) return;

    try {
      const response = await this.sendEmailNow(item.request);
      
      item.status = response.status;
      item.sentAt = new Date();
      
      if (response.status === 'sent') {
        emailQueue.delete(id);
      }
    } catch (error) {
      item.attempts++;
      item.error = error instanceof Error ? error.message : 'Unknown error';

      if (item.attempts >= item.maxAttempts) {
        item.status = 'failed';
      } else {
        // Retry with exponential backoff
        const delay = Math.pow(2, item.attempts) * 1000;
        setTimeout(() => {
          this.processQueueItem(id);
        }, delay);
      }
    }
  }

  /**
   * Generate email content from template
   */
  private generateEmailContent(
    templateType: EmailTemplateType,
    data: EmailTemplateData
  ): { subject: string; html: string; text: string } {
    switch (templateType) {
      case 'verification':
        return this.templates.verification(data as any);
      case 'password-reset':
        return this.templates.passwordReset(data as any);
      case 'welcome':
        return this.templates.welcome(data as any);
      case 'invoice':
        return this.templates.invoice(data as any);
      case 'invoice-reminder':
        return this.templates.invoiceReminder(data as any);
      case 'standup-summary':
        return this.templates.standupSummary(data as any);
      case 'project-summary':
        return this.templates.projectSummary(data as any);
      case 'milestone-complete':
        return this.templates.milestoneComplete(data as any);
      case 'task-assigned':
        return this.templates.taskAssigned(data as any);
      case 'proposal-sent':
        return this.templates.proposalSent(data as any);
      case 'contract-signed':
        return this.templates.contractSigned(data as any);
      case 'handover-ready':
        return this.templates.handoverReady(data as any);
      case 'notification':
        return this.templates.notification(data as any);
      default:
        throw new Error(`Unknown template type: ${templateType}`);
    }
  }

  /**
   * Validate email request
   */
  private validateEmailRequest(request: EmailSendRequest): void {
    if (!request.to || (Array.isArray(request.to) && request.to.length === 0)) {
      throw new Error('Email recipient is required');
    }

    if (!request.subject || request.subject.trim() === '') {
      throw new Error('Email subject is required');
    }

    if (!request.html || request.html.trim() === '') {
      throw new Error('Email content is required');
    }

    // Validate email addresses
    const emails = Array.isArray(request.to) ? request.to : [request.to];
    emails.forEach(email => {
      if (!this.isValidEmail(email)) {
        throw new Error(`Invalid email address: ${email}`);
      }
    });
  }

  /**
   * Validate email address format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `email_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get queue status
   */
  getQueueStatus(): EmailQueueItem[] {
    return Array.from(emailQueue.values());
  }

  /**
   * Retry failed email
   */
  async retryEmail(id: string): Promise<EmailSendResponse> {
    const item = emailQueue.get(id);
    
    if (!item) {
      throw new Error(`Email not found in queue: ${id}`);
    }

    if (item.status === 'sent') {
      throw new Error('Email already sent');
    }

    item.attempts = 0;
    item.error = undefined;
    
    return await this.processQueueItem(id).then(() => {
      const updatedItem = emailQueue.get(id);
      return {
        id,
        status: updatedItem?.status || 'failed',
        timestamp: new Date(),
      };
    });
  }

  /**
   * Cancel scheduled email
   */
  cancelEmail(id: string): boolean {
    const item = emailQueue.get(id);
    
    if (!item) {
      return false;
    }

    if (item.status === 'sent') {
      return false;
    }

    emailQueue.delete(id);
    return true;
  }
}

/**
 * Default email service instance
 */
export const emailService = new EmailService();

/**
 * Helper functions for common email operations
 */

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  userName: string,
  verificationToken: string
): Promise<EmailSendResponse> {
  const verificationLink = `${emailConfig.baseUrl}/verify-email?token=${verificationToken}`;
  
  return emailService.sendTemplateEmail('verification', email, {
    userName,
    verificationLink,
    expiresIn: '24 hours',
    supportEmail: emailConfig.replyTo?.email || 'support@autopilotstudio.com',
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  userName: string,
  resetToken: string,
  ipAddress?: string
): Promise<EmailSendResponse> {
  const resetLink = `${emailConfig.baseUrl}/reset-password?token=${resetToken}`;
  
  return emailService.sendTemplateEmail('password-reset', email, {
    userName,
    resetLink,
    expiresIn: '1 hour',
    ipAddress,
    supportEmail: emailConfig.replyTo?.email || 'support@autopilotstudio.com',
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  email: string,
  userName: string
): Promise<EmailSendResponse> {
  return emailService.sendTemplateEmail('welcome', email, {
    userName,
    dashboardLink: `${emailConfig.baseUrl}/dashboard`,
    gettingStartedLink: `${emailConfig.baseUrl}/docs/getting-started`,
    supportEmail: emailConfig.replyTo?.email || 'support@autopilotstudio.com',
  });
}

/**
 * Send invoice email
 */
export async function sendInvoiceEmail(
  email: string,
  invoiceData: any
): Promise<EmailSendResponse> {
  return emailService.sendTemplateEmail('invoice', email, {
    ...invoiceData,
    invoiceLink: `${emailConfig.baseUrl}/invoices/${invoiceData.invoiceNumber}`,
    paymentLink: invoiceData.paymentLink || `${emailConfig.baseUrl}/pay/${invoiceData.invoiceNumber}`,
  });
}

/**
 * Send standup summary email
 */
export async function sendStandupSummaryEmail(
  emails: string[],
  summaryData: any
): Promise<EmailSendResponse> {
  return emailService.sendTemplateEmail('standup-summary', emails, {
    ...summaryData,
    dashboardLink: `${emailConfig.baseUrl}/dashboard/projects/${summaryData.projectId}`,
  });
}

/**
 * Send notification email
 */
export async function sendNotificationEmail(
  email: string,
  title: string,
  message: string,
  userName: string,
  actionText?: string,
  actionLink?: string
): Promise<EmailSendResponse> {
  return emailService.sendTemplateEmail('notification', email, {
    title,
    message,
    userName,
    actionText,
    actionLink,
  });
}
