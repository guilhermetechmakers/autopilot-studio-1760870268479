import { api } from '@/lib/api';
import type {
  HandoverPack,
  CreateHandoverPackInput,
  HandoverAsset,
  LoomVideo,
  GovernanceTemplate,
  RenewalOption,
  SLABotConfig,
} from '@/types/handover';

// Fetch handover pack by project ID
export const getHandoverPackByProject = async (projectId: string): Promise<HandoverPack | null> => {
  try {
    return await api.get<HandoverPack>(`/handover/project/${projectId}`);
  } catch (error) {
    return null;
  }
};

// Fetch available assets for a project
export const getProjectAssets = async (projectId: string): Promise<HandoverAsset[]> => {
  return api.get<HandoverAsset[]>(`/projects/${projectId}/assets`);
};

// Fetch Loom videos for a project
export const getProjectLoomVideos = async (projectId: string): Promise<LoomVideo[]> => {
  return api.get<LoomVideo[]>(`/projects/${projectId}/loom-videos`);
};

// Fetch governance templates
export const getGovernanceTemplates = async (): Promise<GovernanceTemplate[]> => {
  return api.get<GovernanceTemplate[]>('/handover/governance-templates');
};

// Fetch renewal options
export const getRenewalOptions = async (): Promise<RenewalOption[]> => {
  return api.get<RenewalOption[]>('/handover/renewal-options');
};

// Create handover pack
export const createHandoverPack = async (
  input: CreateHandoverPackInput
): Promise<HandoverPack> => {
  return api.post<HandoverPack>('/handover', input);
};

// Generate handover pack (trigger export)
export const generateHandoverPack = async (
  handoverPackId: string,
  format: 'zip' | 'pdf'
): Promise<{ download_url: string }> => {
  return api.post<{ download_url: string }>(`/handover/${handoverPackId}/generate`, { format });
};

// Deliver handover pack to client portal
export const deliverHandoverPack = async (
  handoverPackId: string,
  clientEmail: string
): Promise<{ success: boolean; message: string }> => {
  return api.post<{ success: boolean; message: string }>(
    `/handover/${handoverPackId}/deliver`,
    { client_email: clientEmail }
  );
};

// Get SLA bot configuration
export const getSLABotConfig = async (
  handoverPackId: string
): Promise<SLABotConfig | null> => {
  try {
    return await api.get<SLABotConfig>(`/handover/${handoverPackId}/sla-bot`);
  } catch (error) {
    return null;
  }
};

// Update SLA bot configuration
export const updateSLABotConfig = async (
  handoverPackId: string,
  config: Partial<SLABotConfig>
): Promise<SLABotConfig> => {
  return api.put<SLABotConfig>(`/handover/${handoverPackId}/sla-bot`, config);
};

// Delete handover pack
export const deleteHandoverPack = async (handoverPackId: string): Promise<void> => {
  await api.delete(`/handover/${handoverPackId}`);
};
