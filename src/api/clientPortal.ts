import { api } from '@/lib/api';
import type {
  ClientPortalProject,
  ClientPortalMilestone,
  Deliverable,
  ApprovalAction,
  SharedAsset,
  ClientPortalInvoice,
  MeetingMinute,
  ClientMessage,
  ProjectUpdate,
} from '@/types/clientPortal';

/**
 * Get client portal project details
 */
export async function getClientPortalProject(projectId: string): Promise<ClientPortalProject> {
  return api.get<ClientPortalProject>(`/client-portal/projects/${projectId}`);
}

/**
 * Get project milestones for client portal
 */
export async function getClientPortalMilestones(projectId: string): Promise<ClientPortalMilestone[]> {
  return api.get<ClientPortalMilestone[]>(`/client-portal/projects/${projectId}/milestones`);
}

/**
 * Get deliverables pending approval
 */
export async function getDeliverables(projectId: string): Promise<Deliverable[]> {
  return api.get<Deliverable[]>(`/client-portal/projects/${projectId}/deliverables`);
}

/**
 * Submit approval action for a deliverable
 */
export async function submitApproval(action: ApprovalAction): Promise<Deliverable> {
  return api.post<Deliverable>(
    `/client-portal/deliverables/${action.deliverable_id}/approve`,
    action
  );
}

/**
 * Get shared assets for a project
 */
export async function getSharedAssets(projectId: string): Promise<SharedAsset[]> {
  return api.get<SharedAsset[]>(`/client-portal/projects/${projectId}/assets`);
}

/**
 * Get invoices for a project
 */
export async function getClientPortalInvoices(projectId: string): Promise<ClientPortalInvoice[]> {
  return api.get<ClientPortalInvoice[]>(`/client-portal/projects/${projectId}/invoices`);
}

/**
 * Get invoice details
 */
export async function getInvoiceDetails(invoiceId: string): Promise<ClientPortalInvoice> {
  return api.get<ClientPortalInvoice>(`/client-portal/invoices/${invoiceId}`);
}

/**
 * Initiate payment for an invoice
 */
export async function initiatePayment(invoiceId: string): Promise<{ payment_url: string }> {
  return api.post<{ payment_url: string }>(
    `/client-portal/invoices/${invoiceId}/pay`,
    {}
  );
}

/**
 * Get meeting minutes for a project
 */
export async function getMeetingMinutes(projectId: string): Promise<MeetingMinute[]> {
  return api.get<MeetingMinute[]>(`/client-portal/projects/${projectId}/meetings`);
}

/**
 * Get messages for a project
 */
export async function getClientMessages(projectId: string): Promise<ClientMessage[]> {
  return api.get<ClientMessage[]>(`/client-portal/projects/${projectId}/messages`);
}

/**
 * Send a message
 */
export async function sendClientMessage(
  projectId: string,
  message: string
): Promise<ClientMessage> {
  return api.post<ClientMessage>(`/client-portal/projects/${projectId}/messages`, {
    message,
  });
}

/**
 * Get project updates/activity feed
 */
export async function getProjectUpdates(projectId: string): Promise<ProjectUpdate[]> {
  return api.get<ProjectUpdate[]>(`/client-portal/projects/${projectId}/updates`);
}
