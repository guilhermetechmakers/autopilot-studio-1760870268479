/**
 * Email Template Types
 * 
 * Comprehensive type definitions for the email template system
 * supporting verification, invoices, standups, and summaries.
 */

export type EmailTemplateType = 
  | 'verification'
  | 'password-reset'
  | 'welcome'
  | 'invoice'
  | 'invoice-reminder'
  | 'invoice-paid'
  | 'standup-summary'
  | 'project-summary'
  | 'milestone-complete'
  | 'task-assigned'
  | 'proposal-sent'
  | 'contract-signed'
  | 'handover-ready'
  | 'notification';

export type EmailPriority = 'low' | 'normal' | 'high' | 'urgent';

export type EmailStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';

/**
 * Base email template interface
 */
export interface EmailTemplate {
  id: string;
  type: EmailTemplateType;
  name: string;
  subject: string;
  preheader?: string;
  html: string;
  text?: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Email send request
 */
export interface EmailSendRequest {
  to: string | string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  text?: string;
  templateType: EmailTemplateType;
  variables?: Record<string, unknown>;
  priority?: EmailPriority;
  attachments?: EmailAttachment[];
  scheduledAt?: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Email attachment
 */
export interface EmailAttachment {
  filename: string;
  content: string | Uint8Array;
  contentType: string;
  encoding?: string;
}

/**
 * Email send response
 */
export interface EmailSendResponse {
  id: string;
  status: EmailStatus;
  messageId?: string;
  timestamp: Date;
  error?: string;
}

/**
 * Email verification template data
 */
export interface VerificationEmailData {
  userName: string;
  verificationLink: string;
  expiresIn: string;
  supportEmail: string;
}

/**
 * Password reset template data
 */
export interface PasswordResetEmailData {
  userName: string;
  resetLink: string;
  expiresIn: string;
  ipAddress?: string;
  supportEmail: string;
}

/**
 * Welcome email template data
 */
export interface WelcomeEmailData {
  userName: string;
  dashboardLink: string;
  gettingStartedLink: string;
  supportEmail: string;
}

/**
 * Invoice email template data
 */
export interface InvoiceEmailData {
  invoiceNumber: string;
  clientName: string;
  amount: string;
  currency: string;
  dueDate: string;
  invoiceLink: string;
  paymentLink?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: string;
    total: string;
  }>;
  subtotal: string;
  tax?: string;
  total: string;
  notes?: string;
  companyName: string;
  companyAddress?: string;
  companyLogo?: string;
}

/**
 * Invoice reminder template data
 */
export interface InvoiceReminderEmailData {
  invoiceNumber: string;
  clientName: string;
  amount: string;
  currency: string;
  dueDate: string;
  daysOverdue?: number;
  invoiceLink: string;
  paymentLink?: string;
  companyName: string;
}

/**
 * Standup summary template data
 */
export interface StandupSummaryEmailData {
  date: string;
  projectName: string;
  teamMembers: Array<{
    name: string;
    avatar?: string;
    completed: string[];
    inProgress: string[];
    blockers: string[];
  }>;
  overallProgress: number;
  upcomingMilestone?: string;
  dashboardLink: string;
}

/**
 * Project summary template data
 */
export interface ProjectSummaryEmailData {
  projectName: string;
  period: string;
  completedTasks: number;
  totalTasks: number;
  progress: number;
  milestones: Array<{
    name: string;
    status: 'completed' | 'in-progress' | 'pending';
    dueDate?: string;
  }>;
  commits: number;
  teamActivity: Array<{
    member: string;
    contributions: number;
  }>;
  upcomingDeadlines: Array<{
    title: string;
    date: string;
  }>;
  dashboardLink: string;
}

/**
 * Milestone complete template data
 */
export interface MilestoneCompleteEmailData {
  milestoneName: string;
  projectName: string;
  completedDate: string;
  completedBy: string;
  deliverables: string[];
  nextMilestone?: string;
  dashboardLink: string;
}

/**
 * Task assigned template data
 */
export interface TaskAssignedEmailData {
  taskTitle: string;
  projectName: string;
  assignedBy: string;
  assignedTo: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  taskLink: string;
}

/**
 * Proposal sent template data
 */
export interface ProposalSentEmailData {
  clientName: string;
  proposalTitle: string;
  validUntil: string;
  totalAmount: string;
  currency: string;
  proposalLink: string;
  companyName: string;
  senderName: string;
}

/**
 * Contract signed template data
 */
export interface ContractSignedEmailData {
  clientName: string;
  projectName: string;
  signedDate: string;
  startDate?: string;
  contractLink: string;
  nextSteps: string[];
  companyName: string;
}

/**
 * Handover ready template data
 */
export interface HandoverReadyEmailData {
  projectName: string;
  clientName: string;
  handoverDate: string;
  deliverables: string[];
  documentationLink: string;
  videoTutorials?: string[];
  supportEmail: string;
  companyName: string;
}

/**
 * Generic notification template data
 */
export interface NotificationEmailData {
  title: string;
  message: string;
  actionText?: string;
  actionLink?: string;
  userName: string;
}

/**
 * Email template data union type
 */
export type EmailTemplateData =
  | VerificationEmailData
  | PasswordResetEmailData
  | WelcomeEmailData
  | InvoiceEmailData
  | InvoiceReminderEmailData
  | StandupSummaryEmailData
  | ProjectSummaryEmailData
  | MilestoneCompleteEmailData
  | TaskAssignedEmailData
  | ProposalSentEmailData
  | ContractSignedEmailData
  | HandoverReadyEmailData
  | NotificationEmailData;

/**
 * Email configuration
 */
export interface EmailConfig {
  provider: 'sendgrid' | 'postmark' | 'ses' | 'smtp';
  apiKey?: string;
  from: {
    email: string;
    name: string;
  };
  replyTo?: {
    email: string;
    name: string;
  };
  baseUrl: string;
  logoUrl?: string;
  companyName: string;
  companyAddress?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

/**
 * Email queue item
 */
export interface EmailQueueItem {
  id: string;
  request: EmailSendRequest;
  status: EmailStatus;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  scheduledAt?: Date;
  sentAt?: Date;
  error?: string;
}

/**
 * Email analytics
 */
export interface EmailAnalytics {
  templateType: EmailTemplateType;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  failed: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}
