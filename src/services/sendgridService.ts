/**
 * SendGrid Email Service
 * 
 * Production-ready SendGrid integration for transactional emails.
 * Handles email delivery, webhooks, and error handling.
 */

import type {
  EmailSendRequest,
  EmailSendResponse,
} from '@/types/email';

/**
 * SendGrid API Configuration
 */
interface SendGridConfig {
  apiKey: string;
  apiUrl?: string;
  sandbox?: boolean;
}

/**
 * SendGrid Mail Send Request
 */
interface SendGridMailRequest {
  personalizations: Array<{
    to: Array<{ email: string; name?: string }>;
    cc?: Array<{ email: string; name?: string }>;
    bcc?: Array<{ email: string; name?: string }>;
    subject: string;
    custom_args?: Record<string, string>;
  }>;
  from: {
    email: string;
    name?: string;
  };
  reply_to?: {
    email: string;
    name?: string;
  };
  content: Array<{
    type: string;
    value: string;
  }>;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition?: string;
  }>;
  categories?: string[];
  custom_args?: Record<string, string>;
  send_at?: number;
  mail_settings?: {
    sandbox_mode?: {
      enable: boolean;
    };
  };
}

/**
 * SendGrid API Response
 */
interface SendGridResponse {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
}

/**
 * SendGrid Service Class
 */
export class SendGridService {
  private config: SendGridConfig;
  private apiUrl: string;

  constructor(config: SendGridConfig) {
    this.config = config;
    this.apiUrl = config.apiUrl || 'https://api.sendgrid.com/v3';
  }

  /**
   * Send email via SendGrid
   */
  async sendEmail(request: EmailSendRequest): Promise<EmailSendResponse> {
    try {
      // Validate API key
      if (!this.config.apiKey) {
        throw new Error('SendGrid API key is not configured');
      }

      // Build SendGrid request
      const sendGridRequest = this.buildSendGridRequest(request);

      // Send to SendGrid API
      const response = await this.callSendGridAPI(sendGridRequest);

      // Parse response
      return this.parseSendGridResponse(response);
    } catch (error) {
      console.error('SendGrid send failed:', error);
      
      return {
        id: this.generateId(),
        status: 'failed',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Build SendGrid API request
   */
  private buildSendGridRequest(request: EmailSendRequest): SendGridMailRequest {
    // Parse recipients
    const toEmails = Array.isArray(request.to) ? request.to : [request.to];
    const to = toEmails.map(email => ({ email }));

    // Parse CC
    const cc = request.cc?.map(email => ({ email }));

    // Parse BCC
    const bcc = request.bcc?.map(email => ({ email }));

    // Build content
    const content: Array<{ type: string; value: string }> = [];
    
    if (request.text) {
      content.push({
        type: 'text/plain',
        value: request.text,
      });
    }
    
    content.push({
      type: 'text/html',
      value: request.html,
    });

    // Build attachments
    const attachments = request.attachments?.map(att => ({
      content: this.encodeAttachment(att.content),
      filename: att.filename,
      type: att.contentType,
      disposition: 'attachment',
    }));

    // Build custom args for tracking
    const customArgs: Record<string, string> = {
      template_type: request.templateType,
      ...(request.metadata as Record<string, string>),
    };

    // Build request
    const sendGridRequest: SendGridMailRequest = {
      personalizations: [
        {
          to,
          cc,
          bcc,
          subject: request.subject,
          custom_args: customArgs,
        },
      ],
      from: {
        email: import.meta.env.VITE_EMAIL_FROM || 'noreply@autopilotstudio.com',
        name: import.meta.env.VITE_EMAIL_FROM_NAME || 'Autopilot Studio',
      },
      reply_to: {
        email: import.meta.env.VITE_EMAIL_REPLY_TO || 'support@autopilotstudio.com',
        name: import.meta.env.VITE_EMAIL_REPLY_TO_NAME || 'Autopilot Studio Support',
      },
      content,
      attachments,
      categories: [request.templateType],
      custom_args: customArgs,
    };

    // Add scheduled send time
    if (request.scheduledAt) {
      sendGridRequest.send_at = Math.floor(request.scheduledAt.getTime() / 1000);
    }

    // Enable sandbox mode if configured
    if (this.config.sandbox) {
      sendGridRequest.mail_settings = {
        sandbox_mode: {
          enable: true,
        },
      };
    }

    return sendGridRequest;
  }

  /**
   * Call SendGrid API
   */
  private async callSendGridAPI(request: SendGridMailRequest): Promise<SendGridResponse> {
    const response = await fetch(`${this.apiUrl}/mail/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const body = await response.text();
    const headers: Record<string, string> = {};
    
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      statusCode: response.status,
      body,
      headers,
    };
  }

  /**
   * Parse SendGrid response
   */
  private parseSendGridResponse(
    response: SendGridResponse
  ): EmailSendResponse {
    // SendGrid returns 202 for accepted emails
    if (response.statusCode === 202) {
      return {
        id: this.generateId(),
        status: 'sent',
        messageId: response.headers['x-message-id'],
        timestamp: new Date(),
      };
    }

    // Handle errors
    let errorMessage = `SendGrid API error: ${response.statusCode}`;
    
    try {
      const errorBody = JSON.parse(response.body);
      if (errorBody.errors && Array.isArray(errorBody.errors)) {
        errorMessage = errorBody.errors.map((e: any) => e.message).join(', ');
      }
    } catch {
      // Use default error message
    }

    return {
      id: this.generateId(),
      status: 'failed',
      timestamp: new Date(),
      error: errorMessage,
    };
  }

  /**
   * Encode attachment content to base64
   */
  private encodeAttachment(content: string | Uint8Array): string {
    if (typeof content === 'string') {
      // Assume it's already base64 encoded
      return content;
    }

    // Convert Uint8Array to base64
    const binary = Array.from(content)
      .map(byte => String.fromCharCode(byte))
      .join('');
    
    return btoa(binary);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `sg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Verify API key
   */
  async verifyApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/scopes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get email statistics
   */
  async getStats(startDate: Date, endDate: Date): Promise<any> {
    try {
      const params = new URLSearchParams({
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        aggregated_by: 'day',
      });

      const response = await fetch(`${this.apiUrl}/stats?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get stats: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Failed to get SendGrid stats:', error);
      throw error;
    }
  }
}

/**
 * Create SendGrid service instance
 */
export function createSendGridService(apiKey: string, options?: { sandbox?: boolean }): SendGridService {
  return new SendGridService({
    apiKey,
    sandbox: options?.sandbox || false,
  });
}

/**
 * Default SendGrid service instance (uses environment variables)
 */
export const sendGridService = new SendGridService({
  apiKey: import.meta.env.VITE_SENDGRID_API_KEY || '',
  sandbox: import.meta.env.VITE_SENDGRID_SANDBOX === 'true',
});
