import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/proposals/RichTextEditor';
import { TemplateSelector } from '@/components/proposals/TemplateSelector';
import { PricingTableBuilder } from '@/components/proposals/PricingTableBuilder';
import { MilestonesBuilder } from '@/components/proposals/MilestonesBuilder';
import { VersionHistory } from '@/components/proposals/VersionHistory';
import { ESignaturePanel } from '@/components/proposals/ESignaturePanel';
import { CommentThread } from '@/components/proposals/CommentThread';
import {
  Save,
  Send,
  FileText,
  Download,
  ArrowLeft,
  FileSignature,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { proposalsApi, templatesApi, eSignaturesApi } from '@/api/proposals';
import { processTemplateVariables } from '@/lib/templateEngine';
import type { ProposalContent, PricingTable, ProposalMilestone } from '@/types/proposal';

export default function ProposalGenerator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new' || !id;

  const [showTemplateSelector, setShowTemplateSelector] = useState(isNew);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [content, setContent] = useState<ProposalContent>({
    introduction: '',
    scope_of_work: '',
    deliverables: [],
    timeline: '',
    assumptions: '',
    terms_and_conditions: '',
  });
  const [pricing, setPricing] = useState<PricingTable>({
    currency: 'USD',
    items: [],
    subtotal: 0,
    total: 0,
  });
  const [milestones, setMilestones] = useState<ProposalMilestone[]>([]);

  // Fetch templates
  const { data: templates = [] } = useQuery({
    queryKey: ['proposal-templates'],
    queryFn: templatesApi.getAll,
  });

  // Fetch proposal if editing
  const { data: proposal, isLoading } = useQuery({
    queryKey: ['proposal', id],
    queryFn: () => proposalsApi.getById(id!),
    enabled: !isNew,
  });

  // Fetch versions
  const { data: versions = [] } = useQuery({
    queryKey: ['proposal-versions', id],
    queryFn: () => proposalsApi.getVersions(id!),
    enabled: !isNew,
  });

  // Fetch signature
  const { data: signature } = useQuery({
    queryKey: ['proposal-signature', id],
    queryFn: () => eSignaturesApi.getByProposalId(id!),
    enabled: !isNew,
  });

  // Fetch comments
  const { data: comments = [] } = useQuery({
    queryKey: ['proposal-comments', id],
    queryFn: () => proposalsApi.getComments(id!),
    enabled: !isNew,
  });

  // Initialize form with proposal data
  useEffect(() => {
    if (proposal) {
      setTitle(proposal.title);
      setClientName(proposal.client_name);
      setClientEmail(proposal.client_email);
      setContent(proposal.content);
      setPricing(proposal.pricing);
      setMilestones(proposal.milestones);
      setSelectedTemplateId(proposal.template_id);
    }
  }, [proposal]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        title,
        client_name: clientName,
        client_email: clientEmail,
        template_id: selectedTemplateId,
        content,
        pricing,
        milestones,
      };

      if (isNew) {
        return proposalsApi.create(data);
      } else {
        return proposalsApi.update({ id: id!, ...data });
      }
    },
    onSuccess: (savedProposal) => {
      toast.success('Proposal saved successfully');
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      if (isNew) {
        navigate(`/proposals/${savedProposal.id}`);
      }
    },
    onError: () => {
      toast.error('Failed to save proposal');
    },
  });

  // Send mutation
  const sendMutation = useMutation({
    mutationFn: () =>
      proposalsApi.send({
        proposal_id: id!,
        recipient_email: clientEmail,
        expires_in_days: 30,
      }),
    onSuccess: () => {
      toast.success('Proposal sent successfully');
      queryClient.invalidateQueries({ queryKey: ['proposal', id] });
    },
    onError: () => {
      toast.error('Failed to send proposal');
    },
  });

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: () =>
      proposalsApi.export({
        proposal_id: id!,
        format: 'pdf',
        include_pricing: true,
        include_terms: true,
      }),
    onSuccess: (data) => {
      window.open(data.url, '_blank');
      toast.success('PDF generated successfully');
    },
    onError: () => {
      toast.error('Failed to generate PDF');
    },
  });

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setSelectedTemplateId(template.id);
    
    // Process template with sample data
    const context = {
      client_name: clientName || 'Client Name',
      company_name: 'Your Company',
      project_title: title || 'Project Title',
    };

    setContent({
      ...content,
      introduction: processTemplateVariables(template.content_template, context),
    });

    setShowTemplateSelector(false);
  };

  const handleSave = () => {
    if (!title || !clientName || !clientEmail) {
      toast.error('Please fill in all required fields');
      return;
    }
    saveMutation.mutate();
  };

  const handleSend = () => {
    if (proposal?.status === 'draft') {
      sendMutation.mutate();
    }
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleCreateSignature = async (signers: Array<{ name: string; email: string; role: string }>) => {
    try {
      await eSignaturesApi.create(id!, signers);
      toast.success('Signature request created');
      queryClient.invalidateQueries({ queryKey: ['proposal-signature', id] });
    } catch {
      toast.error('Failed to create signature request');
    }
  };

  const handleSendSignature = async () => {
    if (!signature) return;
    try {
      await eSignaturesApi.send(signature.id);
      toast.success('Signature request sent');
      queryClient.invalidateQueries({ queryKey: ['proposal-signature', id] });
    } catch {
      toast.error('Failed to send signature request');
    }
  };

  const handleVoidSignature = async (reason: string) => {
    if (!signature) return;
    try {
      await eSignaturesApi.void(signature.id, reason);
      toast.success('Signature request voided');
      queryClient.invalidateQueries({ queryKey: ['proposal-signature', id] });
    } catch {
      toast.error('Failed to void signature request');
    }
  };

  const handleDownloadSigned = async () => {
    if (!signature) return;
    try {
      const data = await eSignaturesApi.downloadSigned(signature.id);
      window.open(data.url, '_blank');
    } catch {
      toast.error('Failed to download signed document');
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    try {
      await proposalsApi.restoreVersion(id!, versionId);
      toast.success('Version restored');
      queryClient.invalidateQueries({ queryKey: ['proposal', id] });
    } catch {
      toast.error('Failed to restore version');
    }
  };

  const handleAddComment = async (content: string, section?: string) => {
    try {
      await proposalsApi.addComment(id!, content, section);
      toast.success('Comment added');
      queryClient.invalidateQueries({ queryKey: ['proposal-comments', id] });
    } catch {
      toast.error('Failed to add comment');
    }
  };

  if (showTemplateSelector) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          <TemplateSelector
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onSelect={handleTemplateSelect}
            onClose={() => navigate('/proposals')}
          />
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted">Loading proposal...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/proposals')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {isNew ? 'New Proposal' : 'Edit Proposal'}
              </h1>
              {proposal && (
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="capitalize">{proposal.status}</Badge>
                  <span className="text-sm text-muted">Version {proposal.version}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isNew && (
              <>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                {proposal?.status === 'draft' && (
                  <Button variant="outline" onClick={handleSend}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                )}
              </>
            )}
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Basic info */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Proposal Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Website Redesign Proposal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-name">Client Name *</Label>
                <Input
                  id="client-name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Acme Corp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">Client Email *</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@acme.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main content */}
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="content">
              <FileText className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="signature" disabled={isNew}>
              <FileSignature className="h-4 w-4 mr-2" />
              E-Signature
            </TabsTrigger>
            <TabsTrigger value="comments" disabled={isNew}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments
            </TabsTrigger>
            <TabsTrigger value="history" disabled={isNew}>History</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label>Introduction</Label>
                  <RichTextEditor
                    value={content.introduction}
                    onChange={(value) => setContent({ ...content, introduction: value })}
                    placeholder="Introduce your proposal..."
                    showAISuggestions
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Scope of Work</Label>
                  <RichTextEditor
                    value={content.scope_of_work}
                    onChange={(value) => setContent({ ...content, scope_of_work: value })}
                    placeholder="Describe the scope of work..."
                    showAISuggestions
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <RichTextEditor
                    value={content.timeline}
                    onChange={(value) => setContent({ ...content, timeline: value })}
                    placeholder="Project timeline..."
                    minHeight="200px"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Terms & Conditions</Label>
                  <RichTextEditor
                    value={content.terms_and_conditions}
                    onChange={(value) => setContent({ ...content, terms_and_conditions: value })}
                    placeholder="Terms and conditions..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <PricingTableBuilder value={pricing} onChange={setPricing} />
          </TabsContent>

          <TabsContent value="milestones">
            <MilestonesBuilder
              value={milestones}
              totalBudget={pricing.total}
              currency={pricing.currency}
              onChange={setMilestones}
            />
          </TabsContent>

          <TabsContent value="signature">
            <ESignaturePanel
              signature={signature}
              onCreateSignature={handleCreateSignature}
              onSendSignature={handleSendSignature}
              onVoidSignature={handleVoidSignature}
              onDownloadSigned={handleDownloadSigned}
            />
          </TabsContent>

          <TabsContent value="comments">
            <CommentThread
              comments={comments}
              onAddComment={handleAddComment}
            />
          </TabsContent>

          <TabsContent value="history">
            <VersionHistory
              versions={versions}
              currentVersion={proposal?.version || 1}
              onRestore={handleRestoreVersion}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
