import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Package,
  FileText,
  Video,
  Shield,
  DollarSign,
  Download,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Settings,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getHandoverPackByProject,
  getProjectAssets,
  getProjectLoomVideos,
  getGovernanceTemplates,
  getRenewalOptions,
  createHandoverPack,
  generateHandoverPack,
  deliverHandoverPack,
  getSLABotConfig,
} from '@/api/handover';
import AssetSelector from '@/components/handover/AssetSelector';
import LoomVideoSelector from '@/components/handover/LoomVideoSelector';
import GovernanceSelector from '@/components/handover/GovernanceSelector';
import RenewalOptions from '@/components/handover/RenewalOptions';
import HandoverPreview from '@/components/handover/HandoverPreview';
import SLABotSetup from '@/components/handover/SLABotSetup';
import type { CreateHandoverPackInput } from '@/types/handover';

export default function HandoverPackPage() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'demo-project-1';
  const queryClient = useQueryClient();

  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [selectedLoomIds, setSelectedLoomIds] = useState<string[]>([]);
  const [selectedGovernanceIds, setSelectedGovernanceIds] = useState<string[]>([]);
  const [selectedRenewalIds, setSelectedRenewalIds] = useState<string[]>([]);
  const [includeContracts, setIncludeContracts] = useState(true);
  const [includeFinalReport, setIncludeFinalReport] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch existing handover pack
  const { data: existingPack, isLoading: isLoadingPack } = useQuery({
    queryKey: ['handover-pack', projectId],
    queryFn: () => getHandoverPackByProject(projectId),
  });

  // Fetch available assets
  const { data: assets = [], isLoading: isLoadingAssets } = useQuery({
    queryKey: ['project-assets', projectId],
    queryFn: () => getProjectAssets(projectId),
  });

  // Fetch Loom videos
  const { data: loomVideos = [], isLoading: isLoadingLoom } = useQuery({
    queryKey: ['project-loom', projectId],
    queryFn: () => getProjectLoomVideos(projectId),
  });

  // Fetch governance templates
  const { data: governanceTemplates = [], isLoading: isLoadingGovernance } = useQuery({
    queryKey: ['governance-templates'],
    queryFn: getGovernanceTemplates,
  });

  // Fetch renewal options
  const { data: renewalOptions = [], isLoading: isLoadingRenewals } = useQuery({
    queryKey: ['renewal-options'],
    queryFn: getRenewalOptions,
  });

  // Fetch SLA bot config if pack exists
  const { data: slaBotConfig } = useQuery({
    queryKey: ['sla-bot-config', existingPack?.id],
    queryFn: () => (existingPack?.id ? getSLABotConfig(existingPack.id) : null),
    enabled: !!existingPack?.id,
  });

  // Create handover pack mutation
  const createPackMutation = useMutation({
    mutationFn: (input: CreateHandoverPackInput) => createHandoverPack(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['handover-pack', projectId] });
      toast.success('Handover pack created successfully');
    },
    onError: () => {
      toast.error('Failed to create handover pack');
    },
  });

  // Generate pack mutation
  const generateMutation = useMutation({
    mutationFn: ({ id, format }: { id: string; format: 'zip' | 'pdf' }) =>
      generateHandoverPack(id, format),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['handover-pack', projectId] });
      toast.success('Handover pack generated successfully');
      if (data.download_url) {
        window.open(data.download_url, '_blank');
      }
    },
    onError: () => {
      toast.error('Failed to generate handover pack');
    },
  });

  // Deliver pack mutation
  const deliverMutation = useMutation({
    mutationFn: ({ id, email }: { id: string; email: string }) =>
      deliverHandoverPack(id, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['handover-pack', projectId] });
      toast.success('Handover pack delivered to client portal');
    },
    onError: () => {
      toast.error('Failed to deliver handover pack');
    },
  });

  const handleCreatePack = () => {
    const input: CreateHandoverPackInput = {
      project_id: projectId,
      asset_ids: selectedAssetIds,
      loom_video_ids: selectedLoomIds,
      governance_template_ids: selectedGovernanceIds,
      renewal_option_ids: selectedRenewalIds,
      include_contracts: includeContracts,
      include_final_report: includeFinalReport,
    };

    createPackMutation.mutate(input);
  };

  const handleGeneratePack = (format: 'zip' | 'pdf') => {
    if (existingPack?.id) {
      generateMutation.mutate({ id: existingPack.id, format });
    }
  };

  const handleDeliverPack = () => {
    if (existingPack?.id) {
      // In production, this would prompt for client email
      const clientEmail = 'client@example.com';
      deliverMutation.mutate({ id: existingPack.id, email: clientEmail });
    }
  };

  const isLoading =
    isLoadingPack || isLoadingAssets || isLoadingLoom || isLoadingGovernance || isLoadingRenewals;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'border-muted text-muted', label: 'Draft' },
      generating: { color: 'border-accent-blue text-accent-blue', label: 'Generating' },
      ready: { color: 'border-accent-green text-accent-green', label: 'Ready' },
      delivered: { color: 'border-accent-purple text-accent-purple', label: 'Delivered' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Handover Pack</h1>
            <p className="text-muted">
              Generate comprehensive handover deliverables for your client
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            {existingPack && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={existingPack.status === 'generating'}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleGeneratePack('zip')}
                  disabled={
                    existingPack.status === 'generating' || generateMutation.isPending
                  }
                >
                  {generateMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Export ZIP
                </Button>
                <Button
                  onClick={handleDeliverPack}
                  disabled={
                    existingPack.status !== 'ready' || deliverMutation.isPending
                  }
                  className="bg-accent-green text-background hover:bg-accent-green/90"
                >
                  {deliverMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Deliver to Client
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Status Card */}
        {existingPack && (
          <Card className="bg-card animate-fade-in-up">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-accent-green/10 p-3">
                    <Package className="h-6 w-6 text-accent-green" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{existingPack.project_name}</h3>
                      {getStatusBadge(existingPack.status)}
                    </div>
                    <p className="text-sm text-muted">Client: {existingPack.client_name}</p>
                    <p className="text-xs text-muted mt-1">
                      Created {new Date(existingPack.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {existingPack.status === 'ready' && (
                    <div className="flex items-center gap-2 text-accent-green text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      Ready for delivery
                    </div>
                  )}
                  {existingPack.status === 'generating' && (
                    <div className="flex items-center gap-2 text-accent-blue text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating pack...
                    </div>
                  )}
                  {existingPack.delivered_at && (
                    <p className="text-xs text-muted">
                      Delivered {new Date(existingPack.delivered_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {isLoading ? (
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : showPreview && existingPack ? (
          <HandoverPreview
            handoverPack={existingPack}
            onClose={() => setShowPreview(false)}
          />
        ) : (
          <Tabs defaultValue="assets" className="space-y-6">
            <TabsList className="bg-card">
              <TabsTrigger value="assets">
                <FileText className="mr-2 h-4 w-4" />
                Assets
              </TabsTrigger>
              <TabsTrigger value="loom">
                <Video className="mr-2 h-4 w-4" />
                Loom Videos
              </TabsTrigger>
              <TabsTrigger value="governance">
                <Shield className="mr-2 h-4 w-4" />
                Governance
              </TabsTrigger>
              <TabsTrigger value="renewal">
                <DollarSign className="mr-2 h-4 w-4" />
                Renewal Options
              </TabsTrigger>
              <TabsTrigger value="sla">
                <Settings className="mr-2 h-4 w-4" />
                SLA Bot
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assets" className="space-y-4">
              <AssetSelector
                assets={assets}
                selectedIds={selectedAssetIds}
                onSelectionChange={setSelectedAssetIds}
                includeContracts={includeContracts}
                onIncludeContractsChange={setIncludeContracts}
                includeFinalReport={includeFinalReport}
                onIncludeFinalReportChange={setIncludeFinalReport}
              />
            </TabsContent>

            <TabsContent value="loom" className="space-y-4">
              <LoomVideoSelector
                videos={loomVideos}
                selectedIds={selectedLoomIds}
                onSelectionChange={setSelectedLoomIds}
              />
            </TabsContent>

            <TabsContent value="governance" className="space-y-4">
              <GovernanceSelector
                templates={governanceTemplates}
                selectedIds={selectedGovernanceIds}
                onSelectionChange={setSelectedGovernanceIds}
              />
            </TabsContent>

            <TabsContent value="renewal" className="space-y-4">
              <RenewalOptions
                options={renewalOptions}
                selectedIds={selectedRenewalIds}
                onSelectionChange={setSelectedRenewalIds}
              />
            </TabsContent>

            <TabsContent value="sla" className="space-y-4">
              <SLABotSetup
                handoverPackId={existingPack?.id}
                config={slaBotConfig ?? null}
              />
            </TabsContent>
          </Tabs>
        )}

        {/* Action Bar */}
        {!existingPack && !isLoading && (
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Ready to create handover pack?</h3>
                  <p className="text-sm text-muted">
                    Review your selections and create the handover pack
                  </p>
                </div>
                <Button
                  onClick={handleCreatePack}
                  disabled={
                    createPackMutation.isPending ||
                    (selectedAssetIds.length === 0 &&
                      selectedLoomIds.length === 0 &&
                      selectedGovernanceIds.length === 0)
                  }
                  className="bg-accent-green text-background hover:bg-accent-green/90"
                >
                  {createPackMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Create Handover Pack
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-card border-accent-blue/20">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-accent-blue mt-0.5" />
              <div>
                <CardTitle className="text-base">Handover Pack Contents</CardTitle>
                <CardDescription className="mt-2">
                  Your handover pack will include:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Selected project assets and documentation</li>
                    <li>Loom video tutorials and walkthroughs</li>
                    <li>Governance documents and templates</li>
                    <li>Renewal and support options</li>
                    <li>Final project report and P&L summary</li>
                    <li>Signed contracts and legal documents</li>
                  </ul>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </DashboardLayout>
  );
}
