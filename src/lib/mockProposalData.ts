import type {
  Proposal,
  ProposalTemplate,
  ProposalVersion,
  ESignature,
  CreateProposalInput,
  UpdateProposalInput,
  SendProposalInput,
  ExportProposalInput,
} from '@/types/proposal';

// Storage
const STORAGE_KEY = 'autopilot_proposals';
const SIGNATURES_KEY = 'autopilot_signatures';

// Initial mock data
const initialProposals: Proposal[] = [
  {
    id: '1',
    title: 'E-Commerce Platform Development',
    client_name: 'Acme Corp',
    client_email: 'john@acme.com',
    status: 'sent',
    template_id: '1',
    content: {
      introduction: '<p>We are excited to propose a comprehensive e-commerce solution.</p>',
      scope_of_work: '<p>Full-stack development with modern technologies.</p>',
      deliverables: ['Responsive website', 'Admin dashboard', 'Payment integration'],
      timeline: '<p>12 weeks from project kickoff</p>',
      assumptions: '<p>Client will provide all content and assets.</p>',
      terms_and_conditions: '<p>Standard terms apply.</p>',
    },
    pricing: {
      currency: 'USD',
      items: [
        { id: '1', description: 'Frontend Development', quantity: 1, unit_price: 15000, total: 15000 },
        { id: '2', description: 'Backend Development', quantity: 1, unit_price: 20000, total: 20000 },
        { id: '3', description: 'UI/UX Design', quantity: 1, unit_price: 8000, total: 8000 },
      ],
      subtotal: 43000,
      tax_rate: 10,
      tax_amount: 4300,
      total: 47300,
    },
    milestones: [
      {
        id: '1',
        title: 'Design Phase',
        description: 'Complete UI/UX design and prototypes',
        deliverables: ['Wireframes', 'High-fidelity mockups', 'Design system'],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        payment_percentage: 25,
        payment_amount: 11825,
      },
    ],
    version: 1,
    created_by: 'user-1',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Mobile App Development',
    client_name: 'Tech Startup Inc',
    client_email: 'ceo@techstartup.com',
    status: 'draft',
    template_id: '2',
    content: {
      introduction: '<p>Mobile app proposal for iOS and Android.</p>',
      scope_of_work: '<p>Native mobile applications.</p>',
      deliverables: ['iOS app', 'Android app', 'Backend API'],
      timeline: '<p>16 weeks</p>',
      assumptions: '<p>APIs will be provided by client.</p>',
      terms_and_conditions: '<p>Standard terms.</p>',
    },
    pricing: {
      currency: 'USD',
      items: [
        { id: '1', description: 'iOS Development', quantity: 1, unit_price: 25000, total: 25000 },
        { id: '2', description: 'Android Development', quantity: 1, unit_price: 25000, total: 25000 },
      ],
      subtotal: 50000,
      total: 50000,
    },
    milestones: [],
    version: 1,
    created_by: 'user-1',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const initialTemplates: ProposalTemplate[] = [
  {
    id: '1',
    name: 'Web Development Proposal',
    description: 'Standard template for web development projects',
    category: 'development',
    content_template: `<h2>Introduction</h2><p>Dear {{client_name}},</p><p>Thank you for considering our services.</p>`,
    variables: [
      { key: 'client_name', label: 'Client Name', type: 'text', required: true },
    ],
    conditional_sections: [],
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Mobile App Proposal',
    description: 'Template for mobile application development',
    category: 'development',
    content_template: `<h2>Mobile App Development Proposal</h2><p>We propose to develop a mobile application.</p>`,
    variables: [
      { key: 'client_name', label: 'Client Name', type: 'text', required: true },
    ],
    conditional_sections: [],
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Storage helpers
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// Proposals mock API
export const mockProposals = {
  getAll: async (): Promise<Proposal[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getFromStorage(STORAGE_KEY, initialProposals);
  },

  getById: async (id: string): Promise<Proposal> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const proposals = getFromStorage(STORAGE_KEY, initialProposals);
    const proposal = proposals.find(p => p.id === id);
    if (!proposal) throw new Error('Proposal not found');
    return proposal;
  },

  create: async (data: CreateProposalInput): Promise<Proposal> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const proposals = getFromStorage(STORAGE_KEY, initialProposals);
    const newProposal: Proposal = {
      ...data,
      id: Date.now().toString(),
      status: 'draft',
      version: 1,
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [...proposals, newProposal];
    saveToStorage(STORAGE_KEY, updated);
    return newProposal;
  },

  update: async (data: UpdateProposalInput): Promise<Proposal> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const proposals = getFromStorage(STORAGE_KEY, initialProposals);
    const updated = proposals.map(p => {
      if (p.id !== data.id) return p;
      
      return {
        ...p,
        ...data,
        content: data.content ? { ...p.content, ...data.content } : p.content,
        pricing: data.pricing ? { ...p.pricing, ...data.pricing } : p.pricing,
        updated_at: new Date().toISOString(),
      };
    });
    saveToStorage(STORAGE_KEY, updated);
    const proposal = updated.find(p => p.id === data.id);
    if (!proposal) throw new Error('Proposal not found');
    return proposal;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const proposals = getFromStorage(STORAGE_KEY, initialProposals);
    const updated = proposals.filter(p => p.id !== id);
    saveToStorage(STORAGE_KEY, updated);
  },

  duplicate: async (id: string): Promise<Proposal> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const proposals = getFromStorage(STORAGE_KEY, initialProposals);
    const original = proposals.find(p => p.id === id);
    if (!original) throw new Error('Proposal not found');

    const duplicated: Proposal = {
      ...original,
      id: Date.now().toString(),
      title: `${original.title} (Copy)`,
      status: 'draft',
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sent_at: undefined,
      viewed_at: undefined,
      signed_at: undefined,
    };

    const updated = [...proposals, duplicated];
    saveToStorage(STORAGE_KEY, updated);
    return duplicated;
  },

  send: async (data: SendProposalInput): Promise<Proposal> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProposals.update({
      id: data.proposal_id,
      status: 'sent',
    });
  },

  export: async (_data: ExportProposalInput): Promise<{ url: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { url: 'https://example.com/proposal.pdf' };
  },
};

// Templates mock API
export const mockTemplates = {
  getAll: async (): Promise<ProposalTemplate[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return initialTemplates;
  },

  getById: async (id: string): Promise<ProposalTemplate> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const template = initialTemplates.find(t => t.id === id);
    if (!template) throw new Error('Template not found');
    return template;
  },
};

// Versions mock API
export const mockVersions = {
  getVersions: async (proposalId: string): Promise<ProposalVersion[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      {
        id: '1',
        proposal_id: proposalId,
        version: 1,
        content: {} as any,
        pricing: {} as any,
        milestones: [],
        created_by: 'user-1',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        change_summary: 'Initial version',
      },
    ];
  },

  restoreVersion: async (proposalId: string, _versionId: string): Promise<Proposal> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProposals.getById(proposalId);
  },
};

// Signatures mock API
export const mockSignatures = {
  getByProposalId: async (proposalId: string): Promise<ESignature | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const signatures = getFromStorage<Record<string, ESignature>>(SIGNATURES_KEY, {});
    return signatures[proposalId];
  },

  create: async (
    proposalId: string,
    signers: Array<{ name: string; email: string; role: string }>
  ): Promise<ESignature> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const signatures = getFromStorage<Record<string, ESignature>>(SIGNATURES_KEY, {});
    const signature: ESignature = {
      id: Date.now().toString(),
      proposal_id: proposalId,
      provider: 'internal',
      status: 'pending',
      signers: signers.map((s, i) => ({
        id: `${Date.now()}-${i}`,
        ...s,
        role: s.role as any,
        status: 'pending',
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    signatures[proposalId] = signature;
    saveToStorage(SIGNATURES_KEY, signatures);
    return signature;
  },

  send: async (_signatureId: string): Promise<ESignature> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {} as ESignature;
  },

  void: async (_signatureId: string, _reason: string): Promise<ESignature> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {} as ESignature;
  },

  downloadSigned: async (_signatureId: string): Promise<{ url: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { url: 'https://example.com/signed-proposal.pdf' };
  },
};
