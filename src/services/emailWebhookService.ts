/**
 * Email Webhook Service
 * 
 * Handles incoming webhooks from email providers (SendGrid, Postmark, etc.)
 * for tracking email events like delivery, opens, clicks, bounces, and spam reports.
 */

// import type { EmailStatus } from '@/types/email';

/**
 * Email Event Types
 */
export type EmailEventType =
  | 'delivered'
  | 'opened'
  | 'clicked'
  | 'bounced'
  | 'dropped'
  | 'deferred'
  | 'spam_report'
  | 'unsubscribe';

/**
 * Email Event
 */
export interface EmailEvent {
  id: string;
  messageId: string;
  email: string;
  event: EmailEventType;
  timestamp: Date;
  reason?: string;
  url?: string;
  userAgent?: string;
  ip?: string;
  metadata?: Record<string, unknown>;
}

/**
 * SendGrid Webhook Event
 */
interface SendGridWebhookEvent {
  email: string;
  timestamp: number;
  event: string;
  'smtp-id'?: string;
  sg_message_id?: string;
  reason?: string;
  url?: string;
  useragent?: string;
  ip?: string;
  [key: string]: any;
}

/**
 * Postmark Webhook Event
 */
interface PostmarkWebhookEvent {
  RecordType: string;
  MessageID: string;
  Recipient: string;
  DeliveredAt?: string;
  BouncedAt?: string;
  Tag?: string;
  Description?: string;
  Details?: string;
  [key: string]: any;
}

/**
 * Email Webhook Handler
 */
export class EmailWebhookService {
  private eventHandlers: Map<EmailEventType, Array<(event: EmailEvent) => void | Promise<void>>>;

  constructor() {
    this.eventHandlers = new Map();
  }

  /**
   * Register event handler
   */
  on(eventType: EmailEventType, handler: (event: EmailEvent) => void | Promise<void>): void {
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.push(handler);
    this.eventHandlers.set(eventType, handlers);
  }

  /**
   * Handle SendGrid webhook
   */
  async handleSendGridWebhook(events: SendGridWebhookEvent[]): Promise<void> {
    for (const sgEvent of events) {
      const event = this.parseSendGridEvent(sgEvent);
      await this.processEvent(event);
    }
  }

  /**
   * Handle Postmark webhook
   */
  async handlePostmarkWebhook(event: PostmarkWebhookEvent): Promise<void> {
    const parsedEvent = this.parsePostmarkEvent(event);
    await this.processEvent(parsedEvent);
  }

  /**
   * Parse SendGrid event
   */
  private parseSendGridEvent(sgEvent: SendGridWebhookEvent): EmailEvent {
    const eventTypeMap: Record<string, EmailEventType> = {
      'delivered': 'delivered',
      'open': 'opened',
      'click': 'clicked',
      'bounce': 'bounced',
      'dropped': 'dropped',
      'deferred': 'deferred',
      'spamreport': 'spam_report',
      'unsubscribe': 'unsubscribe',
    };

    return {
      id: this.generateId(),
      messageId: sgEvent.sg_message_id || sgEvent['smtp-id'] || '',
      email: sgEvent.email,
      event: eventTypeMap[sgEvent.event] || 'delivered',
      timestamp: new Date(sgEvent.timestamp * 1000),
      reason: sgEvent.reason,
      url: sgEvent.url,
      userAgent: sgEvent.useragent,
      ip: sgEvent.ip,
      metadata: sgEvent,
    };
  }

  /**
   * Parse Postmark event
   */
  private parsePostmarkEvent(pmEvent: PostmarkWebhookEvent): EmailEvent {
    const eventTypeMap: Record<string, EmailEventType> = {
      'Delivery': 'delivered',
      'Bounce': 'bounced',
      'SpamComplaint': 'spam_report',
      'Open': 'opened',
      'Click': 'clicked',
    };

    return {
      id: this.generateId(),
      messageId: pmEvent.MessageID,
      email: pmEvent.Recipient,
      event: eventTypeMap[pmEvent.RecordType] || 'delivered',
      timestamp: new Date(pmEvent.DeliveredAt || pmEvent.BouncedAt || Date.now()),
      reason: pmEvent.Description || pmEvent.Details,
      metadata: pmEvent,
    };
  }

  /**
   * Process email event
   */
  private async processEvent(event: EmailEvent): Promise<void> {
    // Log event
    console.log('📧 Email Event:', {
      event: event.event,
      email: event.email,
      messageId: event.messageId,
      timestamp: event.timestamp,
    });

    // Call registered handlers
    const handlers = this.eventHandlers.get(event.event) || [];
    
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error('Email event handler error:', error);
      }
    }

    // Update email status in database (would be done via API in production)
    await this.updateEmailStatus(event);
  }

  /**
   * Update email status
   */
  private async updateEmailStatus(event: EmailEvent): Promise<void> {
    try {
      // In production, this would call your API to update the email status
      // For now, just store events in development mode
      
      // Store event in local storage for development
      if (import.meta.env.DEV) {
        const events = this.getStoredEvents();
        events.push(event);
        localStorage.setItem('email_events', JSON.stringify(events.slice(-100)));
      }
    } catch (error) {
      console.error('Failed to update email status:', error);
    }
  }

  /**
   * Map event type to email status
   * Currently not used but kept for future API integration
   */
  // private mapEventToStatus(eventType: EmailEventType): EmailStatus {
  //   switch (eventType) {
  //     case 'delivered':
  //       return 'delivered';
  //     case 'bounced':
  //     case 'dropped':
  //       return 'bounced';
  //     default:
  //       return 'sent';
  //   }
  // }

  /**
   * Get stored events (development only)
   */
  private getStoredEvents(): EmailEvent[] {
    try {
      const stored = localStorage.getItem('email_events');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get events by message ID
   */
  getEventsByMessageId(messageId: string): EmailEvent[] {
    if (!import.meta.env.DEV) {
      return [];
    }

    const events = this.getStoredEvents();
    return events.filter(e => e.messageId === messageId);
  }

  /**
   * Get events by email
   */
  getEventsByEmail(email: string): EmailEvent[] {
    if (!import.meta.env.DEV) {
      return [];
    }

    const events = this.getStoredEvents();
    return events.filter(e => e.email === email);
  }

  /**
   * Clear stored events
   */
  clearStoredEvents(): void {
    localStorage.removeItem('email_events');
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

/**
 * Default email webhook service instance
 */
export const emailWebhookService = new EmailWebhookService();

/**
 * Setup default event handlers
 */
emailWebhookService.on('bounced', async (event) => {
  console.warn('⚠️ Email bounced:', event.email, event.reason);
  // In production, you might want to:
  // - Mark email as invalid in database
  // - Notify admin
  // - Update user contact preferences
});

emailWebhookService.on('spam_report', async (event) => {
  console.warn('⚠️ Spam report:', event.email);
  // In production, you might want to:
  // - Automatically unsubscribe user
  // - Review email content
  // - Notify compliance team
});

emailWebhookService.on('unsubscribe', async (event) => {
  console.log('📭 Unsubscribe:', event.email);
  // In production, you might want to:
  // - Update user preferences
  // - Remove from mailing lists
  // - Log unsubscribe reason
});
