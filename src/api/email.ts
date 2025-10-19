/**
 * Email API
 * 
 * API functions for email operations including sending, scheduling,
 * and managing email templates.
 */

import { api } from '@/lib/api';
import type {
  EmailSendRequest,
  EmailSendResponse,
  EmailTemplate,
  EmailTemplateType,
  EmailQueueItem,
  EmailAnalytics,
} from '@/types/email';

/**
 * Send email
 */
export async function sendEmail(request: EmailSendRequest): Promise<EmailSendResponse> {
  return api.post<EmailSendResponse>('/emails/send', request);
}

/**
 * Send template email
 */
export async function sendTemplateEmail(
  templateType: EmailTemplateType,
  to: string | string[],
  variables: Record<string, unknown>,
  options?: {
    cc?: string[];
    bcc?: string[];
    scheduledAt?: Date;
  }
): Promise<EmailSendResponse> {
  return api.post<EmailSendResponse>('/emails/send-template', {
    templateType,
    to,
    variables,
    ...options,
  });
}

/**
 * Get email templates
 */
export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  return api.get<EmailTemplate[]>('/emails/templates');
}

/**
 * Get email template by type
 */
export async function getEmailTemplate(type: EmailTemplateType): Promise<EmailTemplate> {
  return api.get<EmailTemplate>(`/emails/templates/${type}`);
}

/**
 * Create email template
 */
export async function createEmailTemplate(
  template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<EmailTemplate> {
  return api.post<EmailTemplate>('/emails/templates', template);
}

/**
 * Update email template
 */
export async function updateEmailTemplate(
  id: string,
  updates: Partial<EmailTemplate>
): Promise<EmailTemplate> {
  return api.patch<EmailTemplate>(`/emails/templates/${id}`, updates);
}

/**
 * Delete email template
 */
export async function deleteEmailTemplate(id: string): Promise<void> {
  return api.delete(`/emails/templates/${id}`);
}

/**
 * Get email queue
 */
export async function getEmailQueue(): Promise<EmailQueueItem[]> {
  return api.get<EmailQueueItem[]>('/emails/queue');
}

/**
 * Get email by ID
 */
export async function getEmail(id: string): Promise<EmailQueueItem> {
  return api.get<EmailQueueItem>(`/emails/${id}`);
}

/**
 * Retry failed email
 */
export async function retryEmail(id: string): Promise<EmailSendResponse> {
  return api.post<EmailSendResponse>(`/emails/${id}/retry`, {});
}

/**
 * Cancel scheduled email
 */
export async function cancelEmail(id: string): Promise<void> {
  return api.delete(`/emails/${id}`);
}

/**
 * Get email analytics
 */
export async function getEmailAnalytics(
  templateType?: EmailTemplateType,
  startDate?: Date,
  endDate?: Date
): Promise<EmailAnalytics[]> {
  const params = new URLSearchParams();
  
  if (templateType) {
    params.append('templateType', templateType);
  }
  
  if (startDate) {
    params.append('startDate', startDate.toISOString());
  }
  
  if (endDate) {
    params.append('endDate', endDate.toISOString());
  }

  return api.get<EmailAnalytics[]>(`/emails/analytics?${params.toString()}`);
}

/**
 * Preview email template
 */
export async function previewEmailTemplate(
  templateType: EmailTemplateType,
  variables: Record<string, unknown>
): Promise<{ subject: string; html: string; text: string }> {
  return api.post<{ subject: string; html: string; text: string }>(
    '/emails/preview',
    { templateType, variables }
  );
}

/**
 * Test email delivery
 */
export async function sendTestEmail(
  templateType: EmailTemplateType,
  to: string,
  variables: Record<string, unknown>
): Promise<EmailSendResponse> {
  return api.post<EmailSendResponse>('/emails/test', {
    templateType,
    to,
    variables,
  });
}
