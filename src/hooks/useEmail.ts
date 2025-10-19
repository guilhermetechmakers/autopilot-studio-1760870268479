/**
 * Email Hooks
 * 
 * React hooks for email operations using TanStack Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  sendEmail,
  sendTemplateEmail,
  getEmailTemplates,
  getEmailTemplate,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  getEmailQueue,
  getEmail,
  retryEmail,
  cancelEmail,
  getEmailAnalytics,
  previewEmailTemplate,
  sendTestEmail,
} from '@/api/email';
import type {
  EmailTemplate,
  EmailTemplateType,
} from '@/types/email';

/**
 * Hook to send email
 */
export function useSendEmail() {
  return useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      toast.success('Email sent successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send email: ${error.message}`);
    },
  });
}

/**
 * Hook to send template email
 */
export function useSendTemplateEmail() {
  return useMutation({
    mutationFn: ({
      templateType,
      to,
      variables,
      options,
    }: {
      templateType: EmailTemplateType;
      to: string | string[];
      variables: Record<string, unknown>;
      options?: {
        cc?: string[];
        bcc?: string[];
        scheduledAt?: Date;
      };
    }) => sendTemplateEmail(templateType, to, variables, options),
    onSuccess: (data) => {
      if (data.status === 'sent') {
        toast.success('Email sent successfully');
      } else if (data.status === 'pending') {
        toast.success('Email scheduled successfully');
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to send email: ${error.message}`);
    },
  });
}

/**
 * Hook to get email templates
 */
export function useEmailTemplates() {
  return useQuery({
    queryKey: ['email-templates'],
    queryFn: getEmailTemplates,
  });
}

/**
 * Hook to get email template by type
 */
export function useEmailTemplate(type: EmailTemplateType) {
  return useQuery({
    queryKey: ['email-template', type],
    queryFn: () => getEmailTemplate(type),
    enabled: !!type,
  });
}

/**
 * Hook to create email template
 */
export function useCreateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast.success('Email template created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create template: ${error.message}`);
    },
  });
}

/**
 * Hook to update email template
 */
export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<EmailTemplate> }) =>
      updateEmailTemplate(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      queryClient.invalidateQueries({ queryKey: ['email-template', data.type] });
      toast.success('Email template updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update template: ${error.message}`);
    },
  });
}

/**
 * Hook to delete email template
 */
export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast.success('Email template deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete template: ${error.message}`);
    },
  });
}

/**
 * Hook to get email queue
 */
export function useEmailQueue() {
  return useQuery({
    queryKey: ['email-queue'],
    queryFn: getEmailQueue,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Hook to get email by ID
 */
export function useEmail(id: string) {
  return useQuery({
    queryKey: ['email', id],
    queryFn: () => getEmail(id),
    enabled: !!id,
  });
}

/**
 * Hook to retry failed email
 */
export function useRetryEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: retryEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-queue'] });
      toast.success('Email retry initiated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to retry email: ${error.message}`);
    },
  });
}

/**
 * Hook to cancel scheduled email
 */
export function useCancelEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-queue'] });
      toast.success('Email cancelled successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel email: ${error.message}`);
    },
  });
}

/**
 * Hook to get email analytics
 */
export function useEmailAnalytics(
  templateType?: EmailTemplateType,
  startDate?: Date,
  endDate?: Date
) {
  return useQuery({
    queryKey: ['email-analytics', templateType, startDate, endDate],
    queryFn: () => getEmailAnalytics(templateType, startDate, endDate),
  });
}

/**
 * Hook to preview email template
 */
export function usePreviewEmailTemplate() {
  return useMutation({
    mutationFn: ({
      templateType,
      variables,
    }: {
      templateType: EmailTemplateType;
      variables: Record<string, unknown>;
    }) => previewEmailTemplate(templateType, variables),
    onError: (error: Error) => {
      toast.error(`Failed to preview email: ${error.message}`);
    },
  });
}

/**
 * Hook to send test email
 */
export function useSendTestEmail() {
  return useMutation({
    mutationFn: ({
      templateType,
      to,
      variables,
    }: {
      templateType: EmailTemplateType;
      to: string;
      variables: Record<string, unknown>;
    }) => sendTestEmail(templateType, to, variables),
    onSuccess: () => {
      toast.success('Test email sent successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send test email: ${error.message}`);
    },
  });
}
