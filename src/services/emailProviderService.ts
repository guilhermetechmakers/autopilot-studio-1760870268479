/**
 * Email Provider Service
 * 
 * Unified interface for multiple email providers (SendGrid, Postmark, Mailgun, SES).
 * Automatically selects the configured provider and handles failover.
 */

import type {
  EmailSendRequest,
  EmailSendResponse,
  EmailConfig,
} from '@/types/email';
import { sendGridService } from './sendgridService';

/**
 * Email Provider Interface
 */
export interface EmailProvider {
  sendEmail(request: EmailSendRequest): Promise<EmailSendResponse>;
  verifyApiKey?(): Promise<boolean>;
  getStats?(startDate: Date, endDate: Date): Promise<any>;
}

/**
 * Postmark Email Provider
 */
class PostmarkProvider implements EmailProvider {
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.postmarkapp.com';
  }

  async sendEmail(request: EmailSendRequest): Promise<EmailSendResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/email`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': this.apiKey,
        },
        body: JSON.stringify({
          From: `${import.meta.env.VITE_EMAIL_FROM_NAME} <${import.meta.env.VITE_EMAIL_FROM}>`,
          To: Array.isArray(request.to) ? request.to.join(',') : request.to,
          Cc: request.cc?.join(','),
          Bcc: request.bcc?.join(','),
          Subject: request.subject,
          HtmlBody: request.html,
          TextBody: request.text,
          ReplyTo: import.meta.env.VITE_EMAIL_REPLY_TO,
          Tag: request.templateType,
          Metadata: request.metadata,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          id: data.MessageID,
          status: 'sent',
          messageId: data.MessageID,
          timestamp: new Date(),
        };
      }

      return {
        id: this.generateId(),
        status: 'failed',
        timestamp: new Date(),
        error: data.Message || 'Postmark API error',
      };
    } catch (error) {
      return {
        id: this.generateId(),
        status: 'failed',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private generateId(): string {
    return `pm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

/**
 * Mailgun Email Provider
 * Currently commented out - uncomment when needed
 */
/* class MailgunProvider implements EmailProvider {
  private apiKey: string;
  private domain: string;
  private apiUrl: string;

  constructor(apiKey: string, domain: string) {
    this.apiKey = apiKey;
    this.domain = domain;
    this.apiUrl = 'https://api.mailgun.net/v3';
  }

  async sendEmail(request: EmailSendRequest): Promise<EmailSendResponse> {
    try {
      const formData = new FormData();
      formData.append('from', `${import.meta.env.VITE_EMAIL_FROM_NAME} <${import.meta.env.VITE_EMAIL_FROM}>`);
      
      const toEmails = Array.isArray(request.to) ? request.to : [request.to];
      toEmails.forEach(email => formData.append('to', email));
      
      request.cc?.forEach(email => formData.append('cc', email));
      request.bcc?.forEach(email => formData.append('bcc', email));
      
      formData.append('subject', request.subject);
      formData.append('html', request.html);
      
      if (request.text) {
        formData.append('text', request.text);
      }
      
      formData.append('o:tag', request.templateType);

      const response = await fetch(`${this.apiUrl}/${this.domain}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${this.apiKey}`)}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return {
          id: data.id,
          status: 'sent',
          messageId: data.id,
          timestamp: new Date(),
        };
      }

      return {
        id: this.generateId(),
        status: 'failed',
        timestamp: new Date(),
        error: data.message || 'Mailgun API error',
      };
    } catch (error) {
      return {
        id: this.generateId(),
        status: 'failed',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private generateId(): string {
    return `mg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
} */

/**
 * SMTP Email Provider (fallback)
 */
class SMTPProvider implements EmailProvider {
  async sendEmail(request: EmailSendRequest): Promise<EmailSendResponse> {
    // SMTP would typically be handled server-side
    // This is a placeholder that logs the email in development
    console.log('📧 SMTP Email (Development):', {
      to: request.to,
      subject: request.subject,
      templateType: request.templateType,
    });

    return {
      id: this.generateId(),
      status: 'sent',
      messageId: `smtp-${Date.now()}`,
      timestamp: new Date(),
    };
  }

  private generateId(): string {
    return `smtp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

/**
 * Email Provider Factory
 */
export class EmailProviderFactory {
  /**
   * Create email provider based on configuration
   */
  static createProvider(config: EmailConfig): EmailProvider {
    switch (config.provider) {
      case 'sendgrid':
        if (!config.apiKey) {
          throw new Error('SendGrid API key is required');
        }
        return sendGridService;

      case 'postmark':
        if (!config.apiKey) {
          throw new Error('Postmark API key is required');
        }
        return new PostmarkProvider(config.apiKey);

      // case 'mailgun':
      //   if (!config.apiKey) {
      //     throw new Error('Mailgun API key is required');
      //   }
      //   const domain = import.meta.env.VITE_MAILGUN_DOMAIN;
      //   if (!domain) {
      //     throw new Error('Mailgun domain is required');
      //   }
      //   return new MailgunProvider(config.apiKey, domain);

      case 'smtp':
        return new SMTPProvider();

      default:
        throw new Error(`Unsupported email provider: ${config.provider}`);
    }
  }

  /**
   * Create provider from environment variables
   */
  static createFromEnv(): EmailProvider {
    const provider = (import.meta.env.VITE_EMAIL_PROVIDER || 'sendgrid') as EmailConfig['provider'];
    const apiKey = this.getApiKeyFromEnv(provider);

    const config: EmailConfig = {
      provider,
      apiKey,
      from: {
        email: import.meta.env.VITE_EMAIL_FROM || 'noreply@autopilotstudio.com',
        name: import.meta.env.VITE_EMAIL_FROM_NAME || 'Autopilot Studio',
      },
      replyTo: {
        email: import.meta.env.VITE_EMAIL_REPLY_TO || 'support@autopilotstudio.com',
        name: import.meta.env.VITE_EMAIL_REPLY_TO_NAME || 'Autopilot Studio Support',
      },
      baseUrl: import.meta.env.VITE_APP_URL || 'https://autopilotstudio.com',
      companyName: 'Autopilot Studio',
    };

    return this.createProvider(config);
  }

  /**
   * Get API key from environment based on provider
   */
  private static getApiKeyFromEnv(provider: EmailConfig['provider']): string | undefined {
    switch (provider) {
      case 'sendgrid':
        return import.meta.env.VITE_SENDGRID_API_KEY;
      case 'postmark':
        return import.meta.env.VITE_POSTMARK_API_KEY;
      // case 'mailgun':
      //   return import.meta.env.VITE_MAILGUN_API_KEY;
      case 'ses':
        return import.meta.env.VITE_AWS_SES_KEY;
      case 'smtp':
        return undefined;
      default:
        return undefined;
    }
  }
}

/**
 * Email Provider Service with Failover
 */
export class EmailProviderService {
  private primaryProvider: EmailProvider;
  private fallbackProvider?: EmailProvider;

  constructor(primaryProvider: EmailProvider, fallbackProvider?: EmailProvider) {
    this.primaryProvider = primaryProvider;
    this.fallbackProvider = fallbackProvider;
  }

  /**
   * Send email with automatic failover
   */
  async sendEmail(request: EmailSendRequest): Promise<EmailSendResponse> {
    try {
      // Try primary provider
      const response = await this.primaryProvider.sendEmail(request);

      if (response.status === 'sent') {
        return response;
      }

      // If primary fails and fallback exists, try fallback
      if (this.fallbackProvider) {
        console.warn('Primary email provider failed, trying fallback');
        return await this.fallbackProvider.sendEmail(request);
      }

      return response;
    } catch (error) {
      // If primary throws and fallback exists, try fallback
      if (this.fallbackProvider) {
        console.warn('Primary email provider error, trying fallback:', error);
        return await this.fallbackProvider.sendEmail(request);
      }

      throw error;
    }
  }

  /**
   * Verify provider configuration
   */
  async verifyConfiguration(): Promise<boolean> {
    if (this.primaryProvider.verifyApiKey) {
      return await this.primaryProvider.verifyApiKey();
    }
    return true;
  }
}

/**
 * Default email provider service instance
 */
export const emailProviderService = new EmailProviderService(
  EmailProviderFactory.createFromEnv(),
  // Fallback to SMTP in development
  import.meta.env.DEV ? new SMTPProvider() : undefined
);
