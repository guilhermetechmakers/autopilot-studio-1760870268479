import { api } from '@/lib/api';
import type {
  CopilotRequest,
  CopilotResponse,
  Message,
  CopilotContext,
  StreamChunk,
} from '@/types/copilot';

export const copilotApi = {
  // Send a message to the AI Copilot
  sendMessage: async (request: CopilotRequest): Promise<CopilotResponse> => {
    return api.post<CopilotResponse>('/copilot/chat', request);
  },

  // Stream a response from the AI Copilot
  streamMessage: async function* (
    request: CopilotRequest
  ): AsyncGenerator<StreamChunk> {
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/copilot/stream`;
    const token = localStorage.getItem('auth_token');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Stream error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter((line) => line.trim());

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            yield { delta: '', done: true };
            return;
          }
          try {
            const parsed = JSON.parse(data) as StreamChunk;
            yield parsed;
          } catch (e) {
            console.error('Failed to parse stream chunk:', e);
          }
        }
      }
    }
  },

  // Get conversation history
  getHistory: async (projectId?: string): Promise<Message[]> => {
    const endpoint = projectId
      ? `/copilot/history?projectId=${projectId}`
      : '/copilot/history';
    return api.get<Message[]>(endpoint);
  },

  // Get context for a project
  getContext: async (projectId: string): Promise<CopilotContext> => {
    return api.get<CopilotContext>(`/copilot/context/${projectId}`);
  },

  // Execute a specific action
  executeAction: async (
    action: string,
    params: Record<string, unknown>
  ): Promise<unknown> => {
    return api.post(`/copilot/action/${action}`, params);
  },

  // Save a conversation
  saveConversation: async (
    projectId: string,
    messages: Message[]
  ): Promise<void> => {
    await api.post('/copilot/save', { projectId, messages });
  },
};
