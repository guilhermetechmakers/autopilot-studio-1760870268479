// API functions for Intake Wizard

import type {
  IntakeForm,
  CreateIntakeInput,
  UpdateIntakeInput,
  IntakeAIRequest,
  IntakeAIResponse,
  QualificationResult,
  GenerateProposalFromIntakeInput,
  ScheduleDiscoveryInput,
} from '@/types/intake';

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data store
let mockIntakes: IntakeForm[] = [];

// Generate mock AI suggestions
const generateMockSuggestions = (field: string, _context: Partial<IntakeForm>) => {
  const suggestions = {
    project_goals: [
      { text: 'Increase user engagement by 50%', confidence: 0.85 },
      { text: 'Improve conversion rate by 25%', confidence: 0.78 },
      { text: 'Reduce operational costs through automation', confidence: 0.82 },
    ],
    success_metrics: [
      { text: 'Monthly active users (MAU)', confidence: 0.90 },
      { text: 'Customer satisfaction score (CSAT)', confidence: 0.85 },
      { text: 'Return on investment (ROI)', confidence: 0.88 },
    ],
    tech_stack_preferences: [
      { text: 'React', confidence: 0.92 },
      { text: 'TypeScript', confidence: 0.89 },
      { text: 'Node.js', confidence: 0.87 },
    ],
  };

  return suggestions[field as keyof typeof suggestions] || [];
};

// Generate mock AI questions
const generateMockQuestions = (context: Partial<IntakeForm>) => {
  const questions = [];
  
  if (!context.target_audience) {
    questions.push({
      id: `q-${Date.now()}-1`,
      question: 'Who is your primary target audience for this project?',
      field: 'target_audience',
      answered: false,
      created_at: new Date().toISOString(),
    });
  }
  
  if (!context.existing_systems || context.existing_systems.length === 0) {
    questions.push({
      id: `q-${Date.now()}-2`,
      question: 'Do you have any existing systems that need to integrate with this project?',
      field: 'existing_systems',
      answered: false,
      created_at: new Date().toISOString(),
    });
  }
  
  if (!context.success_metrics || context.success_metrics.length === 0) {
    questions.push({
      id: `q-${Date.now()}-3`,
      question: 'What key metrics will you use to measure the success of this project?',
      field: 'success_metrics',
      answered: false,
      created_at: new Date().toISOString(),
    });
  }
  
  return questions;
};

// Calculate qualification score
const calculateQualificationScore = (intake: Partial<IntakeForm>): QualificationResult => {
  const factors = [
    {
      name: 'Budget Alignment',
      score: intake.budget_range && !['under_10k'].includes(intake.budget_range) ? 90 : 50,
      weight: 0.3,
      reasoning: 'Budget range aligns with our typical project scope',
    },
    {
      name: 'Timeline Feasibility',
      score: intake.timeline && !['urgent'].includes(intake.timeline) ? 85 : 60,
      weight: 0.2,
      reasoning: 'Timeline allows for proper planning and execution',
    },
    {
      name: 'Project Clarity',
      score: intake.project_description && intake.project_goals?.length ? 80 : 40,
      weight: 0.25,
      reasoning: 'Clear project goals and description provided',
    },
    {
      name: 'Technical Fit',
      score: intake.tech_stack_preferences?.length ? 75 : 50,
      weight: 0.15,
      reasoning: 'Technical requirements match our expertise',
    },
    {
      name: 'Stakeholder Engagement',
      score: intake.stakeholders?.some(s => s.decision_maker) ? 85 : 55,
      weight: 0.1,
      reasoning: 'Decision makers are identified and engaged',
    },
  ];
  
  const totalScore = factors.reduce((sum, factor) => sum + (factor.score * factor.weight), 0);
  
  let status: 'qualified' | 'disqualified' | 'needs_review';
  let recommendation: string;
  let next_steps: string[];
  
  if (totalScore >= 75) {
    status = 'qualified';
    recommendation = 'This lead is well-qualified. Proceed with proposal generation.';
    next_steps = [
      'Generate automated proposal',
      'Schedule discovery call',
      'Assign project manager',
    ];
  } else if (totalScore >= 60) {
    status = 'needs_review';
    recommendation = 'This lead shows potential but needs additional qualification.';
    next_steps = [
      'Schedule discovery call to clarify requirements',
      'Request additional project details',
      'Review with sales team',
    ];
  } else {
    status = 'disqualified';
    recommendation = 'This lead may not be a good fit at this time.';
    next_steps = [
      'Send polite decline with alternative resources',
      'Add to nurture campaign',
      'Revisit in 6 months',
    ];
  }
  
  return {
    score: Math.round(totalScore),
    status,
    factors,
    recommendation,
    next_steps,
  };
};

export const intakeApi = {
  // Get all intakes
  getAll: async (): Promise<IntakeForm[]> => {
    await delay(300);
    return mockIntakes;
  },

  // Get intake by ID
  getById: async (id: string): Promise<IntakeForm> => {
    await delay(200);
    const intake = mockIntakes.find(i => i.id === id);
    if (!intake) {
      throw new Error('Intake not found');
    }
    return intake;
  },

  // Create new intake
  create: async (input: CreateIntakeInput): Promise<IntakeForm> => {
    await delay(300);
    
    const newIntake: IntakeForm = {
      id: `intake-${Date.now()}`,
      status: 'draft',
      company_name: input.company_name || '',
      contact_name: input.contact_name,
      contact_email: input.contact_email,
      project_name: '',
      project_description: '',
      project_goals: [],
      budget_range: 'flexible',
      timeline: 'flexible',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockIntakes.push(newIntake);
    return newIntake;
  },

  // Update intake (with autosave)
  update: async (input: UpdateIntakeInput): Promise<IntakeForm> => {
    await delay(200);
    
    const index = mockIntakes.findIndex(i => i.id === input.id);
    if (index === -1) {
      throw new Error('Intake not found');
    }
    
    const updatedIntake = {
      ...mockIntakes[index],
      ...input.data,
      updated_at: new Date().toISOString(),
      auto_saved_at: new Date().toISOString(),
    };
    
    mockIntakes[index] = updatedIntake;
    return updatedIntake;
  },

  // Get AI assistance
  getAIAssistance: async (request: IntakeAIRequest): Promise<IntakeAIResponse> => {
    await delay(800); // Simulate AI processing time
    
    const response: IntakeAIResponse = {};
    
    switch (request.action) {
      case 'suggest':
        if (request.field) {
          const mockSuggestions = generateMockSuggestions(request.field, request.context);
          response.suggestions = mockSuggestions.map((s, i) => ({
            id: `sug-${Date.now()}-${i}`,
            field: request.field!,
            suggestion: s.text,
            reasoning: 'Based on similar successful projects',
            confidence: s.confidence,
            applied: false,
            created_at: new Date().toISOString(),
          }));
        }
        break;
        
      case 'clarify':
        response.questions = generateMockQuestions(request.context);
        break;
        
      case 'summarize':
        response.summary = `
          Project: ${request.context.project_name || 'Untitled'}
          Company: ${request.context.company_name || 'N/A'}
          Budget: ${request.context.budget_range?.replace('_', '-') || 'Not specified'}
          Timeline: ${request.context.timeline?.replace('_', ' ') || 'Not specified'}
          Goals: ${request.context.project_goals?.join(', ') || 'Not specified'}
        `.trim();
        break;
        
      case 'qualify':
        response.qualification = calculateQualificationScore(request.context);
        break;
    }
    
    return response;
  },

  // Qualify intake
  qualify: async (id: string): Promise<QualificationResult> => {
    await delay(500);
    
    const intake = mockIntakes.find(i => i.id === id);
    if (!intake) {
      throw new Error('Intake not found');
    }
    
    const result = calculateQualificationScore(intake);
    
    // Update intake with qualification
    const index = mockIntakes.findIndex(i => i.id === id);
    mockIntakes[index] = {
      ...intake,
      status: result.status === 'qualified' ? 'qualified' : result.status === 'disqualified' ? 'disqualified' : 'completed',
      qualification_score: result.score,
      updated_at: new Date().toISOString(),
    };
    
    return result;
  },

  // Generate proposal from intake
  generateProposal: async (_input: GenerateProposalFromIntakeInput): Promise<{ proposal_id: string }> => {
    await delay(1000);
    
    return {
      proposal_id: `proposal-${Date.now()}`,
    };
  },

  // Schedule discovery call
  scheduleDiscovery: async (_input: ScheduleDiscoveryInput): Promise<{ meeting_id: string; meeting_url: string }> => {
    await delay(500);
    
    return {
      meeting_id: `meeting-${Date.now()}`,
      meeting_url: 'https://meet.example.com/discovery-call',
    };
  },

  // Upload file
  uploadFile: async (file: File, intakeId: string): Promise<{ url: string; file_id: string }> => {
    await delay(800);
    
    // In a real app, this would upload to S3 or similar
    return {
      file_id: `file-${Date.now()}`,
      url: `https://storage.example.com/intakes/${intakeId}/${file.name}`,
    };
  },

  // Delete intake
  delete: async (id: string): Promise<void> => {
    await delay(200);
    mockIntakes = mockIntakes.filter(i => i.id !== id);
  },
};
