import { api } from '@/lib/api';
import type {
  TeamMember,
  InviteUserInput,
  UpdateUserRoleInput,
  Template,
  CreateTemplateInput,
  UpdateTemplateInput,
  Integration,
  IntegrationLog,
  AnalyticsMetrics,
  RevenueData,
  UserActivityData,
  IntegrationHealth,
  AuditLog,
  AuditLogFilters,
} from '@/types/admin';
import {
  mockTeamMembers,
  mockTemplates,
  mockIntegrations,
  mockIntegrationLogs,
  mockAnalyticsMetrics,
  mockRevenueData,
  mockUserActivityData,
  mockIntegrationHealth,
  mockAuditLogs,
} from '@/hooks/useMockAdmin';

// Use mock data for development
const USE_MOCK_DATA = true;

// Helper to simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Admin API service
export const adminApi = {
  // User & Team Management
  getTeamMembers: async (): Promise<TeamMember[]> => {
    if (USE_MOCK_DATA) {
      await delay();
      return mockTeamMembers;
    }
    return api.get<TeamMember[]>('/admin/users');
  },

  inviteUser: async (data: InviteUserInput): Promise<TeamMember> => {
    if (USE_MOCK_DATA) {
      await delay();
      const newMember: TeamMember = {
        id: String(mockTeamMembers.length + 1),
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      mockTeamMembers.push(newMember);
      return newMember;
    }
    return api.post<TeamMember>('/admin/users/invite', data);
  },

  updateUserRole: async (data: UpdateUserRoleInput): Promise<TeamMember> => {
    if (USE_MOCK_DATA) {
      await delay();
      const member = mockTeamMembers.find(m => m.id === data.user_id);
      if (member) {
        member.role = data.role;
        return member;
      }
      throw new Error('User not found');
    }
    return api.put<TeamMember>(`/admin/users/${data.user_id}/role`, data);
  },

  deactivateUser: async (userId: string): Promise<{ message: string }> => {
    if (USE_MOCK_DATA) {
      await delay();
      const member = mockTeamMembers.find(m => m.id === userId);
      if (member) member.status = 'inactive';
      return { message: 'User deactivated' };
    }
    return api.post<{ message: string }>(`/admin/users/${userId}/deactivate`, {});
  },

  reactivateUser: async (userId: string): Promise<{ message: string }> => {
    if (USE_MOCK_DATA) {
      await delay();
      const member = mockTeamMembers.find(m => m.id === userId);
      if (member) member.status = 'active';
      return { message: 'User reactivated' };
    }
    return api.post<{ message: string }>(`/admin/users/${userId}/reactivate`, {});
  },

  deleteUser: async (userId: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay();
      const index = mockTeamMembers.findIndex(m => m.id === userId);
      if (index > -1) mockTeamMembers.splice(index, 1);
      return;
    }
    await api.delete(`/admin/users/${userId}`);
  },

  // Template Management
  getTemplates: async (): Promise<Template[]> => {
    if (USE_MOCK_DATA) {
      await delay();
      return mockTemplates;
    }
    return api.get<Template[]>('/admin/templates');
  },

  getTemplate: async (id: string): Promise<Template> => {
    if (USE_MOCK_DATA) {
      await delay();
      const template = mockTemplates.find(t => t.id === id);
      if (!template) throw new Error('Template not found');
      return template;
    }
    return api.get<Template>(`/admin/templates/${id}`);
  },

  createTemplate: async (data: CreateTemplateInput): Promise<Template> => {
    if (USE_MOCK_DATA) {
      await delay();
      const newTemplate: Template = {
        id: String(mockTemplates.length + 1),
        ...data,
        variables: data.variables || [],
        created_by: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
      };
      mockTemplates.push(newTemplate);
      return newTemplate;
    }
    return api.post<Template>('/admin/templates', data);
  },

  updateTemplate: async (data: UpdateTemplateInput): Promise<Template> => {
    if (USE_MOCK_DATA) {
      await delay();
      const template = mockTemplates.find(t => t.id === data.id);
      if (!template) throw new Error('Template not found');
      Object.assign(template, data, { updated_at: new Date().toISOString() });
      return template;
    }
    return api.put<Template>(`/admin/templates/${data.id}`, data);
  },

  deleteTemplate: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay();
      const index = mockTemplates.findIndex(t => t.id === id);
      if (index > -1) mockTemplates.splice(index, 1);
      return;
    }
    await api.delete(`/admin/templates/${id}`);
  },

  duplicateTemplate: async (id: string): Promise<Template> => {
    if (USE_MOCK_DATA) {
      await delay();
      const template = mockTemplates.find(t => t.id === id);
      if (!template) throw new Error('Template not found');
      const duplicate: Template = {
        ...template,
        id: String(mockTemplates.length + 1),
        name: `${template.name} (Copy)`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockTemplates.push(duplicate);
      return duplicate;
    }
    return api.post<Template>(`/admin/templates/${id}/duplicate`, {});
  },

  // Integration Management
  getIntegrations: async (): Promise<Integration[]> => {
    if (USE_MOCK_DATA) {
      await delay();
      return mockIntegrations;
    }
    return api.get<Integration[]>('/admin/integrations');
  },

  getIntegration: async (id: string): Promise<Integration> => {
    if (USE_MOCK_DATA) {
      await delay();
      const integration = mockIntegrations.find(i => i.id === id);
      if (!integration) throw new Error('Integration not found');
      return integration;
    }
    return api.get<Integration>(`/admin/integrations/${id}`);
  },

  connectIntegration: async (type: string, config: Record<string, unknown>): Promise<Integration> => {
    if (USE_MOCK_DATA) {
      await delay();
      const newIntegration: Integration = {
        id: String(mockIntegrations.length + 1),
        name: type.charAt(0).toUpperCase() + type.slice(1),
        type: type as any,
        status: 'connected',
        connected_at: new Date().toISOString(),
        config,
        health_status: 'healthy',
      };
      mockIntegrations.push(newIntegration);
      return newIntegration;
    }
    return api.post<Integration>('/admin/integrations/connect', { type, config });
  },

  disconnectIntegration: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay();
      const integration = mockIntegrations.find(i => i.id === id);
      if (integration) integration.status = 'disconnected';
      return;
    }
    await api.post(`/admin/integrations/${id}/disconnect`, {});
  },

  syncIntegration: async (id: string): Promise<{ message: string }> => {
    if (USE_MOCK_DATA) {
      await delay();
      const integration = mockIntegrations.find(i => i.id === id);
      if (integration) integration.last_sync = new Date().toISOString();
      return { message: 'Integration synced successfully' };
    }
    return api.post<{ message: string }>(`/admin/integrations/${id}/sync`, {});
  },

  getIntegrationLogs: async (integrationId?: string): Promise<IntegrationLog[]> => {
    if (USE_MOCK_DATA) {
      await delay();
      return integrationId
        ? mockIntegrationLogs.filter(log => log.integration_id === integrationId)
        : mockIntegrationLogs;
    }
    const endpoint = integrationId 
      ? `/admin/integrations/${integrationId}/logs`
      : '/admin/integrations/logs';
    return api.get<IntegrationLog[]>(endpoint);
  },

  // Analytics
  getAnalyticsMetrics: async (): Promise<AnalyticsMetrics> => {
    if (USE_MOCK_DATA) {
      await delay();
      return mockAnalyticsMetrics;
    }
    return api.get<AnalyticsMetrics>('/admin/analytics/metrics');
  },

  getRevenueData: async (period: 'month' | 'quarter' | 'year' = 'month'): Promise<RevenueData[]> => {
    if (USE_MOCK_DATA) {
      await delay();
      return mockRevenueData;
    }
    return api.get<RevenueData[]>(`/admin/analytics/revenue?period=${period}`);
  },

  getUserActivityData: async (days: number = 30): Promise<UserActivityData[]> => {
    if (USE_MOCK_DATA) {
      await delay();
      return mockUserActivityData;
    }
    return api.get<UserActivityData[]>(`/admin/analytics/user-activity?days=${days}`);
  },

  getIntegrationHealth: async (): Promise<IntegrationHealth[]> => {
    if (USE_MOCK_DATA) {
      await delay();
      return mockIntegrationHealth;
    }
    return api.get<IntegrationHealth[]>('/admin/analytics/integration-health');
  },

  // Audit Logs
  getAuditLogs: async (filters?: AuditLogFilters): Promise<AuditLog[]> => {
    if (USE_MOCK_DATA) {
      await delay();
      let logs = [...mockAuditLogs];
      if (filters?.action) {
        logs = logs.filter(log => log.action.includes(filters.action!));
      }
      if (filters?.resource_type) {
        logs = logs.filter(log => log.resource_type === filters.resource_type);
      }
      return logs;
    }
    const params = new URLSearchParams();
    if (filters?.user_id) params.append('user_id', filters.user_id);
    if (filters?.action) params.append('action', filters.action);
    if (filters?.resource_type) params.append('resource_type', filters.resource_type);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    
    const query = params.toString();
    return api.get<AuditLog[]>(`/admin/audit-logs${query ? `?${query}` : ''}`);
  },

  exportAuditLogs: async (filters?: AuditLogFilters): Promise<Blob> => {
    if (USE_MOCK_DATA) {
      await delay();
      const logs = await adminApi.getAuditLogs(filters);
      const csv = [
        'Timestamp,User,Action,Resource Type,Resource ID,IP Address',
        ...logs.map(log => 
          `${log.created_at},${log.user_name},${log.action},${log.resource_type},${log.resource_id || ''},${log.ip_address || ''}`
        )
      ].join('\n');
      return new Blob([csv], { type: 'text/csv' });
    }
    const params = new URLSearchParams();
    if (filters?.user_id) params.append('user_id', filters.user_id);
    if (filters?.action) params.append('action', filters.action);
    if (filters?.resource_type) params.append('resource_type', filters.resource_type);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    
    const query = params.toString();
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/admin/audit-logs/export${query ? `?${query}` : ''}`;
    
    const token = localStorage.getItem('auth_token');
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to export audit logs');
    }
    
    return response.blob();
  },
};
