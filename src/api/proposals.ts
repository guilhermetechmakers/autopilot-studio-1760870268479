import { api } from '@/lib/api';
import type {
  Proposal,
  ProposalTemplate,
  ProposalVersion,
  ESignature,
  ProposalComment,
  ProposalAuditLog,
  CreateProposalInput,
  UpdateProposalInput,
  SendProposalInput,
  ExportProposalInput,
} from '@/types/proposal';

// Use mock data in development
const USE_MOCK = true; // Always use mock for now

// Import mock data directly
import {
  mockProposals,
  mockTemplates,
  mockVersions,
  mockSignatures,
} from '@/lib/mockProposalData';

// Proposals
export const proposalsApi = {
  // Get all proposals
  getAll: () => USE_MOCK ? mockProposals.getAll() : api.get<Proposal[]>('/proposals'),

  // Get proposal by ID
  getById: (id: string) => USE_MOCK ? mockProposals.getById(id) : api.get<Proposal>(`/proposals/${id}`),

  // Create new proposal
  create: (data: CreateProposalInput) => USE_MOCK ? mockProposals.create(data) : api.post<Proposal>('/proposals', data),

  // Update proposal
  update: (data: UpdateProposalInput) => USE_MOCK ? mockProposals.update(data) : api.put<Proposal>(`/proposals/${data.id}`, data),

  // Delete proposal
  delete: (id: string) => USE_MOCK ? mockProposals.delete(id) : api.delete(`/proposals/${id}`),

  // Duplicate proposal
  duplicate: (id: string) => USE_MOCK ? mockProposals.duplicate(id) : api.post<Proposal>(`/proposals/${id}/duplicate`, {}),

  // Send proposal
  send: (data: SendProposalInput) => USE_MOCK ? mockProposals.send(data) : api.post<Proposal>(`/proposals/${data.proposal_id}/send`, data),

  // Export proposal
  export: (data: ExportProposalInput) => USE_MOCK ? mockProposals.export(data) : api.post<{ url: string }>(`/proposals/${data.proposal_id}/export`, data),

  // Get proposal versions
  getVersions: (proposalId: string) => 
    USE_MOCK ? mockVersions.getVersions(proposalId) : api.get<ProposalVersion[]>(`/proposals/${proposalId}/versions`),

  // Restore version
  restoreVersion: (proposalId: string, versionId: string) => 
    USE_MOCK ? mockVersions.restoreVersion(proposalId, versionId) : api.post<Proposal>(`/proposals/${proposalId}/versions/${versionId}/restore`, {}),

  // Get proposal comments
  getComments: async (proposalId: string) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return [] as ProposalComment[];
    }
    return api.get<ProposalComment[]>(`/proposals/${proposalId}/comments`);
  },

  // Add comment
  addComment: (proposalId: string, content: string, section?: string) => 
    api.post<ProposalComment>(`/proposals/${proposalId}/comments`, { content, section }),

  // Get audit log
  getAuditLog: async (proposalId: string) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return [] as ProposalAuditLog[];
    }
    return api.get<ProposalAuditLog[]>(`/proposals/${proposalId}/audit-log`);
  },
};

// Templates
export const templatesApi = {
  // Get all templates
  getAll: () => USE_MOCK ? mockTemplates.getAll() : api.get<ProposalTemplate[]>('/proposal-templates'),

  // Get template by ID
  getById: (id: string) => USE_MOCK ? mockTemplates.getById(id) : api.get<ProposalTemplate>(`/proposal-templates/${id}`),

  // Create template
  create: (data: Omit<ProposalTemplate, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<ProposalTemplate>('/proposal-templates', data),

  // Update template
  update: (id: string, data: Partial<ProposalTemplate>) => 
    api.put<ProposalTemplate>(`/proposal-templates/${id}`, data),

  // Delete template
  delete: (id: string) => api.delete(`/proposal-templates/${id}`),
};

// E-Signatures
export const eSignaturesApi = {
  // Get signature by proposal ID
  getByProposalId: (proposalId: string) => 
    USE_MOCK ? mockSignatures.getByProposalId(proposalId) : api.get<ESignature>(`/proposals/${proposalId}/signature`),

  // Create signature request
  create: (proposalId: string, signers: Array<{ name: string; email: string; role: string }>) => 
    USE_MOCK ? mockSignatures.create(proposalId, signers) : api.post<ESignature>(`/proposals/${proposalId}/signature`, { signers }),

  // Send signature request
  send: (signatureId: string) => USE_MOCK ? mockSignatures.send(signatureId) : api.post<ESignature>(`/signatures/${signatureId}/send`, {}),

  // Void signature request
  void: (signatureId: string, reason: string) => USE_MOCK ? mockSignatures.void(signatureId, reason) : api.post<ESignature>(`/signatures/${signatureId}/void`, { reason }),

  // Get signature status
  getStatus: (signatureId: string) => 
    api.get<ESignature>(`/signatures/${signatureId}/status`),

  // Download signed document
  downloadSigned: (signatureId: string) => USE_MOCK ? mockSignatures.downloadSigned(signatureId) : api.get<{ url: string }>(`/signatures/${signatureId}/download`),
};
