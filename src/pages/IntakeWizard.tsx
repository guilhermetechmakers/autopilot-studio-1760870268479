import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { IntakeStepIndicator } from '@/components/intake/IntakeStepIndicator';
import { AIAssistantPanel } from '@/components/intake/AIAssistantPanel';
import { QualificationScore } from '@/components/intake/QualificationScore';
import {
  ArrowLeft,
  ArrowRight,
  X,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { intakeApi } from '@/api/intake';
import type {
  IntakeForm,
  AISuggestion,
  AIQuestion,
  Stakeholder,
  QualificationResult,
} from '@/types/intake';

const STEPS = [
  { number: 1, title: 'Company Info', description: 'Basic company details' },
  { number: 2, title: 'Project Goals', description: 'Define objectives' },
  { number: 3, title: 'Budget & Timeline', description: 'Set constraints' },
  { number: 4, title: 'Technical Details', description: 'Tech requirements' },
  { number: 5, title: 'Review & Qualify', description: 'Final review' },
];

export default function IntakeWizard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const intakeId = searchParams.get('id');

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>([]);
  const [qualificationResult, setQualificationResult] = useState<QualificationResult | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<IntakeForm>>({
    company_name: '',
    contact_name: '',
    contact_email: '',
    project_name: '',
    project_description: '',
    project_goals: [],
    budget_range: 'flexible',
    timeline: 'flexible',
    stakeholders: [],
    files: [],
  });

  // Temporary state for multi-value inputs
  const [newGoal, setNewGoal] = useState('');
  const [newTechStack, setNewTechStack] = useState('');
  const [newStakeholder, setNewStakeholder] = useState<Partial<Stakeholder>>({});

  // Load existing intake if editing
  const { data: existingIntake } = useQuery({
    queryKey: ['intake', intakeId],
    queryFn: () => intakeApi.getById(intakeId!),
    enabled: !!intakeId,
  });

  useEffect(() => {
    if (existingIntake) {
      setFormData(existingIntake);
      // Determine completed steps based on filled data
      const completed = [];
      if (existingIntake.company_name && existingIntake.contact_email) completed.push(1);
      if (existingIntake.project_name && existingIntake.project_description) completed.push(2);
      if (existingIntake.budget_range && existingIntake.timeline) completed.push(3);
      setCompletedSteps(completed);
    }
  }, [existingIntake]);

  // Create intake mutation
  const createMutation = useMutation({
    mutationFn: intakeApi.create,
    onSuccess: (data) => {
      queryClient.setQueryData(['intake', data.id], data);
      navigate(`/intake?id=${data.id}`, { replace: true });
      toast.success('Intake created successfully');
    },
    onError: () => {
      toast.error('Failed to create intake');
    },
  });

  // Update intake mutation (autosave)
  const updateMutation = useMutation({
    mutationFn: intakeApi.update,
    onSuccess: (data) => {
      queryClient.setQueryData(['intake', data.id], data);
    },
  });

  // AI assistance mutation
  const aiMutation = useMutation({
    mutationFn: intakeApi.getAIAssistance,
    onSuccess: (response) => {
      if (response.suggestions) {
        setAiSuggestions((prev) => [...prev, ...response.suggestions!]);
      }
      if (response.questions) {
        setAiQuestions((prev) => [...prev, ...response.questions!]);
      }
      if (response.qualification) {
        setQualificationResult(response.qualification);
      }
    },
  });

  // Qualification mutation
  const qualifyMutation = useMutation({
    mutationFn: intakeApi.qualify,
    onSuccess: (result) => {
      setQualificationResult(result);
      toast.success('Qualification complete');
    },
    onError: () => {
      toast.error('Failed to qualify intake');
    },
  });

  // Generate proposal mutation
  const generateProposalMutation = useMutation({
    mutationFn: intakeApi.generateProposal,
    onSuccess: (data) => {
      toast.success('Proposal generated successfully');
      navigate(`/proposals/${data.proposal_id}`);
    },
    onError: () => {
      toast.error('Failed to generate proposal');
    },
  });

  // Schedule discovery mutation
  const scheduleDiscoveryMutation = useMutation({
    mutationFn: intakeApi.scheduleDiscovery,
    onSuccess: (data) => {
      toast.success('Discovery call scheduled');
      window.open(data.meeting_url, '_blank');
    },
    onError: () => {
      toast.error('Failed to schedule discovery call');
    },
  });

  // Autosave effect
  useEffect(() => {
    if (intakeId && formData) {
      const timer = setTimeout(() => {
        updateMutation.mutate({ id: intakeId, data: formData });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [formData, intakeId]);

  // Request AI suggestions when relevant fields change
  const requestAISuggestions = useCallback(
    async (field: string) => {
      if (!intakeId) return;
      setIsAILoading(true);
      try {
        await aiMutation.mutateAsync({
          intake_id: intakeId,
          context: formData,
          action: 'suggest',
          field,
        });
      } finally {
        setIsAILoading(false);
      }
    },
    [intakeId, formData]
  );

  // Request AI clarifying questions
  const requestAIQuestions = useCallback(async () => {
    if (!intakeId) return;
    setIsAILoading(true);
    try {
      await aiMutation.mutateAsync({
        intake_id: intakeId,
        context: formData,
        action: 'clarify',
      });
    } finally {
      setIsAILoading(false);
    }
  }, [intakeId, formData]);

  const updateFormData = (updates: Partial<IntakeForm>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      updateFormData({
        project_goals: [...(formData.project_goals || []), newGoal.trim()],
      });
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    updateFormData({
      project_goals: formData.project_goals?.filter((_, i) => i !== index),
    });
  };

  const addTechStack = () => {
    if (newTechStack.trim()) {
      updateFormData({
        tech_stack_preferences: [...(formData.tech_stack_preferences || []), newTechStack.trim()],
      });
      setNewTechStack('');
    }
  };

  const removeTechStack = (index: number) => {
    updateFormData({
      tech_stack_preferences: formData.tech_stack_preferences?.filter((_, i) => i !== index),
    });
  };

  const addStakeholder = () => {
    if (newStakeholder.name && newStakeholder.role) {
      updateFormData({
        stakeholders: [
          ...(formData.stakeholders || []),
          {
            id: `stakeholder-${Date.now()}`,
            name: newStakeholder.name,
            role: newStakeholder.role,
            email: newStakeholder.email,
            decision_maker: newStakeholder.decision_maker || false,
          } as Stakeholder,
        ],
      });
      setNewStakeholder({});
    }
  };

  const removeStakeholder = (id: string) => {
    updateFormData({
      stakeholders: formData.stakeholders?.filter((s) => s.id !== id),
    });
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    const field = suggestion.field;
    
    if (field === 'project_goals' && !formData.project_goals?.includes(suggestion.suggestion)) {
      updateFormData({
        project_goals: [...(formData.project_goals || []), suggestion.suggestion],
      });
    } else if (field === 'tech_stack_preferences' && !formData.tech_stack_preferences?.includes(suggestion.suggestion)) {
      updateFormData({
        tech_stack_preferences: [...(formData.tech_stack_preferences || []), suggestion.suggestion],
      });
    }

    setAiSuggestions((prev) =>
      prev.map((s) => (s.id === suggestion.id ? { ...s, applied: true } : s))
    );
    toast.success('Suggestion applied');
  };

  const handleAnswerQuestion = (question: AIQuestion, answer: string) => {
    setAiQuestions((prev) =>
      prev.map((q) => (q.id === question.id ? { ...q, answered: true, answer } : q))
    );
    
    if (question.field) {
      updateFormData({ [question.field]: answer });
    }
    
    toast.success('Answer recorded');
  };

  const handleNext = async () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.company_name || !formData.contact_name || !formData.contact_email) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // Create intake if new
      if (!intakeId) {
        await createMutation.mutateAsync({
          company_name: formData.company_name,
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
        });
      }
    }

    if (currentStep === 2) {
      if (!formData.project_name || !formData.project_description) {
        toast.error('Please fill in project name and description');
        return;
      }
      // Request AI suggestions for goals
      requestAISuggestions('project_goals');
    }

    if (currentStep === 3) {
      requestAIQuestions();
    }

    if (currentStep === 4) {
      // Request AI suggestions for tech stack
      if (formData.tech_stack_preferences && formData.tech_stack_preferences.length === 0) {
        requestAISuggestions('tech_stack_preferences');
      }
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }

    // Qualify on last step
    if (currentStep === STEPS.length - 1 && intakeId) {
      qualifyMutation.mutate(intakeId);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateProposal = () => {
    if (intakeId) {
      generateProposalMutation.mutate({ intake_id: intakeId });
    }
  };

  const handleScheduleDiscovery = () => {
    if (intakeId) {
      scheduleDiscoveryMutation.mutate({
        intake_id: intakeId,
        preferred_dates: [],
        preferred_times: [],
        duration_minutes: 60,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI-Assisted Intake Wizard</h1>
            <p className="text-muted mt-1">
              Capture project details with AI-powered assistance
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Autosave indicator */}
        {updateMutation.isPending && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <div className="h-3 w-3 border-2 border-muted border-t-transparent rounded-full animate-spin" />
            <span>Saving...</span>
          </div>
        )}
        {formData.auto_saved_at && !updateMutation.isPending && (
          <div className="flex items-center gap-2 text-sm text-accent-green">
            <CheckCircle2 className="h-3 w-3" />
            <span>Saved {new Date(formData.auto_saved_at).toLocaleTimeString()}</span>
          </div>
        )}

        {/* Step Indicator */}
        <IntakeStepIndicator
          steps={STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                {/* Step 1: Company Information */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Company Information</h2>
                      <p className="text-muted">Tell us about your company</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="company_name">
                          Company Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="company_name"
                          value={formData.company_name || ''}
                          onChange={(e) => updateFormData({ company_name: e.target.value })}
                          placeholder="Acme Inc."
                          className="mt-1.5"
                        />
                      </div>

                      <div>
                        <Label htmlFor="company_website">Company Website</Label>
                        <Input
                          id="company_website"
                          type="url"
                          value={formData.company_website || ''}
                          onChange={(e) => updateFormData({ company_website: e.target.value })}
                          placeholder="https://example.com"
                          className="mt-1.5"
                        />
                      </div>

                      <div>
                        <Label htmlFor="company_size">Company Size</Label>
                        <Select
                          value={formData.company_size || ''}
                          onValueChange={(value) => updateFormData({ company_size: value as IntakeForm['company_size'] })}
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solo">Solo / Freelancer</SelectItem>
                            <SelectItem value="small">Small (2-10 employees)</SelectItem>
                            <SelectItem value="medium">Medium (11-50 employees)</SelectItem>
                            <SelectItem value="large">Large (51-200 employees)</SelectItem>
                            <SelectItem value="enterprise">Enterprise (200+ employees)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          value={formData.industry || ''}
                          onChange={(e) => updateFormData({ industry: e.target.value })}
                          placeholder="e.g., SaaS, E-commerce, Healthcare"
                          className="mt-1.5"
                        />
                      </div>

                      <div className="border-t border-border pt-4 mt-6">
                        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="contact_name">
                              Contact Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="contact_name"
                              value={formData.contact_name || ''}
                              onChange={(e) => updateFormData({ contact_name: e.target.value })}
                              placeholder="John Doe"
                              className="mt-1.5"
                            />
                          </div>

                          <div>
                            <Label htmlFor="contact_email">
                              Contact Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="contact_email"
                              type="email"
                              value={formData.contact_email || ''}
                              onChange={(e) => updateFormData({ contact_email: e.target.value })}
                              placeholder="john@example.com"
                              className="mt-1.5"
                            />
                          </div>

                          <div>
                            <Label htmlFor="contact_phone">Contact Phone</Label>
                            <Input
                              id="contact_phone"
                              type="tel"
                              value={formData.contact_phone || ''}
                              onChange={(e) => updateFormData({ contact_phone: e.target.value })}
                              placeholder="+1 (555) 123-4567"
                              className="mt-1.5"
                            />
                          </div>

                          <div>
                            <Label htmlFor="contact_role">Contact Role</Label>
                            <Input
                              id="contact_role"
                              value={formData.contact_role || ''}
                              onChange={(e) => updateFormData({ contact_role: e.target.value })}
                              placeholder="e.g., CEO, CTO, Product Manager"
                              className="mt-1.5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Project Goals */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Project Goals</h2>
                      <p className="text-muted">Define your project objectives</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="project_name">
                          Project Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="project_name"
                          value={formData.project_name || ''}
                          onChange={(e) => updateFormData({ project_name: e.target.value })}
                          placeholder="My Awesome Project"
                          className="mt-1.5"
                        />
                      </div>

                      <div>
                        <Label htmlFor="project_description">
                          Project Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="project_description"
                          value={formData.project_description || ''}
                          onChange={(e) => updateFormData({ project_description: e.target.value })}
                          placeholder="Describe your project in detail..."
                          rows={5}
                          className="mt-1.5"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Project Goals</Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => requestAISuggestions('project_goals')}
                            disabled={isAILoading}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Suggest
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={newGoal}
                            onChange={(e) => setNewGoal(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                            placeholder="Add a project goal..."
                          />
                          <Button onClick={addGoal} size="icon">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {formData.project_goals && formData.project_goals.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {formData.project_goals.map((goal, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="px-3 py-1.5 text-sm"
                              >
                                {goal}
                                <button
                                  onClick={() => removeGoal(index)}
                                  className="ml-2 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="target_audience">Target Audience</Label>
                        <Input
                          id="target_audience"
                          value={formData.target_audience || ''}
                          onChange={(e) => updateFormData({ target_audience: e.target.value })}
                          placeholder="Who will use this product?"
                          className="mt-1.5"
                        />
                      </div>

                      <div>
                        <Label htmlFor="success_metrics">Success Metrics (optional)</Label>
                        <Textarea
                          id="success_metrics"
                          value={formData.success_metrics?.join('\n') || ''}
                          onChange={(e) =>
                            updateFormData({
                              success_metrics: e.target.value.split('\n').filter((m) => m.trim()),
                            })
                          }
                          placeholder="Enter one metric per line..."
                          rows={3}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Budget & Timeline */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Budget & Timeline</h2>
                      <p className="text-muted">Set your project constraints</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="budget_range">
                          Budget Range <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.budget_range || ''}
                          onValueChange={(value) =>
                            updateFormData({ budget_range: value as IntakeForm['budget_range'] })
                          }
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under_10k">Under $10,000</SelectItem>
                            <SelectItem value="10k_25k">$10,000 - $25,000</SelectItem>
                            <SelectItem value="25k_50k">$25,000 - $50,000</SelectItem>
                            <SelectItem value="50k_100k">$50,000 - $100,000</SelectItem>
                            <SelectItem value="100k_plus">$100,000+</SelectItem>
                            <SelectItem value="flexible">Flexible / TBD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="budget_notes">Budget Notes</Label>
                        <Textarea
                          id="budget_notes"
                          value={formData.budget_notes || ''}
                          onChange={(e) => updateFormData({ budget_notes: e.target.value })}
                          placeholder="Any additional budget considerations..."
                          rows={3}
                          className="mt-1.5"
                        />
                      </div>

                      <div>
                        <Label htmlFor="timeline">
                          Timeline <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.timeline || ''}
                          onValueChange={(value) =>
                            updateFormData({ timeline: value as IntakeForm['timeline'] })
                          }
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgent">Urgent (ASAP)</SelectItem>
                            <SelectItem value="1_3_months">1-3 months</SelectItem>
                            <SelectItem value="3_6_months">3-6 months</SelectItem>
                            <SelectItem value="6_12_months">6-12 months</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="timeline_notes">Timeline Notes</Label>
                        <Textarea
                          id="timeline_notes"
                          value={formData.timeline_notes || ''}
                          onChange={(e) => updateFormData({ timeline_notes: e.target.value })}
                          placeholder="Any timeline constraints or preferences..."
                          rows={3}
                          className="mt-1.5"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="start_date">Preferred Start Date</Label>
                          <Input
                            id="start_date"
                            type="date"
                            value={formData.start_date || ''}
                            onChange={(e) => updateFormData({ start_date: e.target.value })}
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <Label htmlFor="deadline">Target Deadline</Label>
                          <Input
                            id="deadline"
                            type="date"
                            value={formData.deadline || ''}
                            onChange={(e) => updateFormData({ deadline: e.target.value })}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Technical Details */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Technical Details</h2>
                      <p className="text-muted">Specify technical requirements</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Tech Stack Preferences</Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => requestAISuggestions('tech_stack_preferences')}
                            disabled={isAILoading}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Suggest
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={newTechStack}
                            onChange={(e) => setNewTechStack(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTechStack()}
                            placeholder="e.g., React, Node.js, PostgreSQL..."
                          />
                          <Button onClick={addTechStack} size="icon">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {formData.tech_stack_preferences &&
                          formData.tech_stack_preferences.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {formData.tech_stack_preferences.map((tech, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="px-3 py-1.5 text-sm"
                                >
                                  {tech}
                                  <button
                                    onClick={() => removeTechStack(index)}
                                    className="ml-2 hover:text-destructive"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                      </div>

                      <div>
                        <Label htmlFor="existing_systems">Existing Systems</Label>
                        <Textarea
                          id="existing_systems"
                          value={formData.existing_systems?.join('\n') || ''}
                          onChange={(e) =>
                            updateFormData({
                              existing_systems: e.target.value
                                .split('\n')
                                .filter((s) => s.trim()),
                            })
                          }
                          placeholder="List existing systems (one per line)..."
                          rows={3}
                          className="mt-1.5"
                        />
                      </div>

                      <div>
                        <Label htmlFor="integration_requirements">Integration Requirements</Label>
                        <Textarea
                          id="integration_requirements"
                          value={formData.integration_requirements?.join('\n') || ''}
                          onChange={(e) =>
                            updateFormData({
                              integration_requirements: e.target.value
                                .split('\n')
                                .filter((i) => i.trim()),
                            })
                          }
                          placeholder="List required integrations (one per line)..."
                          rows={3}
                          className="mt-1.5"
                        />
                      </div>

                      <div>
                        <Label htmlFor="technical_constraints">Technical Constraints</Label>
                        <Textarea
                          id="technical_constraints"
                          value={formData.technical_constraints || ''}
                          onChange={(e) =>
                            updateFormData({ technical_constraints: e.target.value })
                          }
                          placeholder="Any technical limitations or requirements..."
                          rows={4}
                          className="mt-1.5"
                        />
                      </div>

                      <div className="border-t border-border pt-4 mt-6">
                        <h3 className="text-lg font-semibold mb-4">Stakeholders</h3>
                        
                        <div className="space-y-3 mb-4">
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              value={newStakeholder.name || ''}
                              onChange={(e) =>
                                setNewStakeholder({ ...newStakeholder, name: e.target.value })
                              }
                              placeholder="Name"
                            />
                            <Input
                              value={newStakeholder.role || ''}
                              onChange={(e) =>
                                setNewStakeholder({ ...newStakeholder, role: e.target.value })
                              }
                              placeholder="Role"
                            />
                          </div>
                          <div className="flex gap-3">
                            <Input
                              value={newStakeholder.email || ''}
                              onChange={(e) =>
                                setNewStakeholder({ ...newStakeholder, email: e.target.value })
                              }
                              placeholder="Email (optional)"
                              className="flex-1"
                            />
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={newStakeholder.decision_maker || false}
                                onChange={(e) =>
                                  setNewStakeholder({
                                    ...newStakeholder,
                                    decision_maker: e.target.checked,
                                  })
                                }
                                className="rounded"
                              />
                              Decision Maker
                            </label>
                          </div>
                          <Button onClick={addStakeholder} className="w-full" variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Stakeholder
                          </Button>
                        </div>

                        {formData.stakeholders && formData.stakeholders.length > 0 && (
                          <div className="space-y-2">
                            {formData.stakeholders.map((stakeholder) => (
                              <div
                                key={stakeholder.id}
                                className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{stakeholder.name}</span>
                                    {stakeholder.decision_maker && (
                                      <Badge variant="outline" className="text-xs">
                                        Decision Maker
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted">{stakeholder.role}</p>
                                  {stakeholder.email && (
                                    <p className="text-xs text-muted">{stakeholder.email}</p>
                                  )}
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => removeStakeholder(stakeholder.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="additional_notes">Additional Notes</Label>
                        <Textarea
                          id="additional_notes"
                          value={formData.additional_notes || ''}
                          onChange={(e) => updateFormData({ additional_notes: e.target.value })}
                          placeholder="Any other information we should know..."
                          rows={4}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Review & Qualify */}
                {currentStep === 5 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Review & Qualify</h2>
                      <p className="text-muted">Review your submission and get qualified</p>
                    </div>

                    {/* Summary */}
                    <div className="space-y-4">
                      <div className="p-4 bg-background rounded-lg border border-border">
                        <h3 className="font-semibold mb-3">Project Summary</h3>
                        <dl className="space-y-2 text-sm">
                          <div>
                            <dt className="text-muted">Company:</dt>
                            <dd className="font-medium">{formData.company_name}</dd>
                          </div>
                          <div>
                            <dt className="text-muted">Project:</dt>
                            <dd className="font-medium">{formData.project_name}</dd>
                          </div>
                          <div>
                            <dt className="text-muted">Budget:</dt>
                            <dd className="font-medium">
                              {formData.budget_range?.replace('_', ' - ')}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-muted">Timeline:</dt>
                            <dd className="font-medium">
                              {formData.timeline?.replace('_', ' ')}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-muted">Goals:</dt>
                            <dd className="font-medium">
                              {formData.project_goals?.join(', ') || 'None specified'}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {qualificationResult && (
                        <QualificationScore
                          result={qualificationResult}
                          onGenerateProposal={handleGenerateProposal}
                          onScheduleDiscovery={handleScheduleDiscovery}
                          isGeneratingProposal={generateProposalMutation.isPending}
                          isSchedulingDiscovery={scheduleDiscoveryMutation.isPending}
                        />
                      )}

                      {!qualificationResult && (
                        <Button
                          onClick={() => intakeId && qualifyMutation.mutate(intakeId)}
                          disabled={qualifyMutation.isPending}
                          className="w-full bg-accent-purple hover:bg-accent-purple/90 text-background"
                          size="lg"
                        >
                          {qualifyMutation.isPending ? (
                            <>
                              <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Qualify This Lead
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < STEPS.length ? (
                    <Button
                      onClick={handleNext}
                      className="bg-accent-green hover:bg-accent-green/90 text-background"
                    >
                      Next Step
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate('/dashboard')}
                      className="bg-accent-green hover:bg-accent-green/90 text-background"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Panel */}
          <div className="lg:col-span-1">
            <AIAssistantPanel
              suggestions={aiSuggestions}
              questions={aiQuestions}
              isLoading={isAILoading}
              onApplySuggestion={handleApplySuggestion}
              onAnswerQuestion={handleAnswerQuestion}
              onRequestSuggestions={requestAISuggestions}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
