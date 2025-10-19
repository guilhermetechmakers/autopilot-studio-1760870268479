import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Download,
  Video,
  DollarSign,
  Calendar,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  CheckCheck,
  RotateCcw,
} from "lucide-react";
import {
  submitApproval,
} from "@/api/clientPortal";
import {
  useMockClientPortalProject,
  useMockClientPortalMilestones,
  useMockDeliverables,
  useMockSharedAssets,
  useMockClientPortalInvoices,
  useMockMeetingMinutes,
  useMockProjectUpdates,
} from "@/hooks/useMockClientPortal";
import type { Deliverable, ApprovalAction } from "@/types/clientPortal";

export default function ClientPortalPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject" | "request_revision">("approve");

  // Queries - using mock data for development
  const { data: project, isLoading: projectLoading } = useMockClientPortalProject(projectId || "");
  const { data: milestones = [], isLoading: milestonesLoading } = useMockClientPortalMilestones(projectId || "");
  const { data: deliverables = [], isLoading: deliverablesLoading, refetch: refetchDeliverables } = useMockDeliverables(projectId || "");
  const { data: assets = [], isLoading: assetsLoading } = useMockSharedAssets(projectId || "");
  const { data: invoices = [], isLoading: invoicesLoading } = useMockClientPortalInvoices(projectId || "");
  const { data: meetings = [], isLoading: meetingsLoading } = useMockMeetingMinutes(projectId || "");
  const { data: updates = [], isLoading: updatesLoading } = useMockProjectUpdates(projectId || "");

  // Handle approval submission
  const handleApprovalSubmit = async () => {
    if (!selectedDeliverable) return;

    try {
      const action: ApprovalAction = {
        deliverable_id: selectedDeliverable.id,
        action: approvalAction,
        notes: approvalNotes || undefined,
      };

      await submitApproval(action);
      
      toast.success(
        approvalAction === "approve"
          ? "Deliverable approved successfully"
          : approvalAction === "reject"
          ? "Deliverable rejected"
          : "Revision requested"
      );

      setIsApprovalDialogOpen(false);
      setSelectedDeliverable(null);
      setApprovalNotes("");
      refetchDeliverables();
    } catch (error) {
      toast.error("Failed to submit approval");
      console.error(error);
    }
  };

  const openApprovalDialog = (deliverable: Deliverable, action: "approve" | "reject" | "request_revision") => {
    setSelectedDeliverable(deliverable);
    setApprovalAction(action);
    setIsApprovalDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
      case "approved":
      case "paid":
        return "text-accent-green border-accent-green";
      case "pending_approval":
      case "sent":
        return "text-accent-yellow border-accent-yellow";
      case "rejected":
      case "overdue":
        return "text-accent-red border-accent-red";
      case "launch":
      case "in_progress":
        return "text-accent-blue border-accent-blue";
      default:
        return "text-muted border-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
      case "paid":
        return <CheckCircle2 className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending_approval":
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (projectLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-green mx-auto mb-4" />
            <p className="text-muted">Loading project details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-accent-red mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
            <p className="text-muted">The project you're looking for doesn't exist or you don't have access.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Project Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <Badge variant="outline" className={getStatusColor(project.status)}>
                  {getStatusIcon(project.status)}
                  <span className="ml-1 capitalize">{project.status.replace("_", " ")}</span>
                </Badge>
              </div>
              <p className="text-muted">{project.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(project.start_date)} - {formatDate(project.end_date)}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Budget: {formatCurrency(project.budget)}
                </span>
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-bold">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-3" />
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Budget Spent: {formatCurrency(project.spent)}</span>
                  <span>{formatCurrency(project.budget - project.spent)} remaining</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deliverables">
              Deliverables
              {deliverables.filter(d => d.status === "pending_approval").length > 0 && (
                <Badge className="ml-2 bg-accent-yellow text-background" variant="secondary">
                  {deliverables.filter(d => d.status === "pending_approval").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Milestones */}
              <Card className="lg:col-span-2 bg-card">
                <CardHeader>
                  <CardTitle>Milestones</CardTitle>
                  <CardDescription>Project timeline and key deliverables</CardDescription>
                </CardHeader>
                <CardContent>
                  {milestonesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-background animate-pulse rounded-lg" />
                      ))}
                    </div>
                  ) : milestones.length === 0 ? (
                    <div className="text-center py-8 text-muted">
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No milestones yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="p-4 rounded-lg bg-background border border-border hover:border-accent-green/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold">{milestone.title}</h4>
                              <p className="text-sm text-muted mt-1">{milestone.description}</p>
                            </div>
                            <Badge variant="outline" className={getStatusColor(milestone.status)}>
                              {getStatusIcon(milestone.status)}
                              <span className="ml-1 capitalize">{milestone.status.replace("_", " ")}</span>
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted">Progress</span>
                              <span className="font-medium">{milestone.progress}%</span>
                            </div>
                            <Progress value={milestone.progress} className="h-2" />
                            <div className="flex items-center justify-between text-xs text-muted mt-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due: {formatDate(milestone.due_date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Updates */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Recent Updates</CardTitle>
                  <CardDescription>Latest project activity</CardDescription>
                </CardHeader>
                <CardContent>
                  {updatesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-background animate-pulse rounded-lg" />
                      ))}
                    </div>
                  ) : updates.length === 0 ? (
                    <div className="text-center py-8 text-muted">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No updates yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {updates.slice(0, 5).map((update) => (
                        <div key={update.id} className="flex gap-3">
                          <div className="rounded-full bg-accent-green/10 p-2 h-fit">
                            <div className="h-2 w-2 rounded-full bg-accent-green" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{update.title}</p>
                            <p className="text-xs text-muted mt-1">{update.description}</p>
                            <p className="text-xs text-muted mt-1">{formatDate(update.created_at)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Deliverables Tab */}
          <TabsContent value="deliverables" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Deliverables & Approvals</CardTitle>
                <CardDescription>Review and approve project deliverables</CardDescription>
              </CardHeader>
              <CardContent>
                {deliverablesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-32 bg-background animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : deliverables.length === 0 ? (
                  <div className="text-center py-12 text-muted">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No deliverables yet</p>
                    <p className="text-sm mt-2">Deliverables will appear here when submitted for review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deliverables.map((deliverable) => (
                      <div
                        key={deliverable.id}
                        className="p-6 rounded-lg bg-background border border-border hover:border-accent-green/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">{deliverable.title}</h4>
                              <Badge variant="outline" className={getStatusColor(deliverable.status)}>
                                {getStatusIcon(deliverable.status)}
                                <span className="ml-1 capitalize">{deliverable.status.replace("_", " ")}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted">{deliverable.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-muted">
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                Type: {deliverable.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Submitted: {formatDate(deliverable.submitted_at)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {deliverable.file_url && (
                          <div className="mb-4">
                            <Button variant="outline" size="sm" asChild>
                              <a href={deliverable.file_url} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Download File
                              </a>
                            </Button>
                          </div>
                        )}

                        {deliverable.reviewer_notes && (
                          <div className="mb-4 p-3 rounded-lg bg-card border border-border">
                            <p className="text-xs font-medium text-muted mb-1">Review Notes:</p>
                            <p className="text-sm">{deliverable.reviewer_notes}</p>
                          </div>
                        )}

                        {deliverable.status === "pending_approval" && (
                          <div className="flex gap-2 pt-4 border-t border-border">
                            <Button
                              size="sm"
                              className="bg-accent-green text-background hover:bg-accent-green/90"
                              onClick={() => openApprovalDialog(deliverable, "approve")}
                            >
                              <CheckCheck className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-accent-yellow text-accent-yellow hover:bg-accent-yellow/10"
                              onClick={() => openApprovalDialog(deliverable, "request_revision")}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Request Revision
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-accent-red text-accent-red hover:bg-accent-red/10"
                              onClick={() => openApprovalDialog(deliverable, "reject")}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Shared Assets</CardTitle>
                <CardDescription>Files, documents, and Loom videos</CardDescription>
              </CardHeader>
              <CardContent>
                {assetsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-32 bg-background animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : assets.length === 0 ? (
                  <div className="text-center py-12 text-muted">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No shared assets yet</p>
                    <p className="text-sm mt-2">Assets will appear here when uploaded</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="p-4 rounded-lg bg-background border border-border hover:border-accent-green/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {asset.type === "loom" ? (
                              <Video className="h-5 w-5 text-accent-purple" />
                            ) : (
                              <FileText className="h-5 w-5 text-accent-blue" />
                            )}
                            <span className="text-xs text-muted capitalize">{asset.type}</span>
                          </div>
                        </div>
                        <h4 className="font-semibold mb-2 line-clamp-2">{asset.name}</h4>
                        {asset.description && (
                          <p className="text-xs text-muted mb-3 line-clamp-2">{asset.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted">
                            {formatDate(asset.uploaded_at)}
                          </span>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={asset.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Invoices & Payments</CardTitle>
                <CardDescription>View and pay project invoices</CardDescription>
              </CardHeader>
              <CardContent>
                {invoicesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-32 bg-background animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="text-center py-12 text-muted">
                    <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No invoices yet</p>
                    <p className="text-sm mt-2">Invoices will appear here when generated</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="p-6 rounded-lg bg-background border border-border hover:border-accent-green/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">Invoice #{invoice.invoice_number}</h4>
                              <Badge variant="outline" className={getStatusColor(invoice.status)}>
                                {getStatusIcon(invoice.status)}
                                <span className="ml-1 capitalize">{invoice.status}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Due: {formatDate(invoice.due_date)}
                              </span>
                              {invoice.paid_at && (
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="h-4 w-4 text-accent-green" />
                                  Paid: {formatDate(invoice.paid_at)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{formatCurrency(invoice.amount)}</p>
                          </div>
                        </div>

                        {invoice.line_items.length > 0 && (
                          <div className="mb-4">
                            <Separator className="mb-3" />
                            <div className="space-y-2">
                              {invoice.line_items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                  <span className="text-muted">
                                    {item.description} (×{item.quantity})
                                  </span>
                                  <span className="font-medium">{formatCurrency(item.total)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {invoice.status === "sent" && (
                          <div className="flex gap-2 pt-4 border-t border-border">
                            <Button
                              size="sm"
                              className="bg-accent-green text-background hover:bg-accent-green/90"
                              onClick={() => {
                                toast.info("Payment processing will be implemented");
                              }}
                            >
                              <DollarSign className="mr-2 h-4 w-4" />
                              Pay Now
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Meeting Minutes & Messages</CardTitle>
                <CardDescription>AI-synthesized summaries and communications</CardDescription>
              </CardHeader>
              <CardContent>
                {meetingsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-40 bg-background animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : meetings.length === 0 ? (
                  <div className="text-center py-12 text-muted">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No meeting minutes yet</p>
                    <p className="text-sm mt-2">Meeting summaries will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {meetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="p-6 rounded-lg bg-background border border-border"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2">{meeting.title}</h4>
                            <div className="flex items-center gap-4 text-xs text-muted mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(meeting.date)}
                              </span>
                              <span>
                                Attendees: {meeting.attendees.join(", ")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-medium mb-2">Summary</h5>
                            <p className="text-sm text-muted">{meeting.summary}</p>
                          </div>

                          {meeting.action_items.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium mb-2">Action Items</h5>
                              <div className="space-y-2">
                                {meeting.action_items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-start gap-2 p-2 rounded bg-card"
                                  >
                                    <div className={`mt-1 ${item.status === "completed" ? "text-accent-green" : "text-muted"}`}>
                                      {item.status === "completed" ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                      ) : (
                                        <Clock className="h-4 w-4" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm">{item.description}</p>
                                      <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                                        <span>Assignee: {item.assignee}</span>
                                        {item.due_date && (
                                          <span>Due: {formatDate(item.due_date)}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {meeting.recording_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={meeting.recording_url} target="_blank" rel="noopener noreferrer">
                                <Video className="mr-2 h-4 w-4" />
                                View Recording
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>
              {approvalAction === "approve"
                ? "Approve Deliverable"
                : approvalAction === "reject"
                ? "Reject Deliverable"
                : "Request Revision"}
            </DialogTitle>
            <DialogDescription>
              {selectedDeliverable?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {approvalAction === "approve"
                  ? "Approval Notes (Optional)"
                  : "Please provide feedback"}
              </label>
              <Textarea
                placeholder={
                  approvalAction === "approve"
                    ? "Add any comments or feedback..."
                    : "Explain what needs to be changed..."
                }
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={4}
                className="bg-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className={
                approvalAction === "approve"
                  ? "bg-accent-green text-background hover:bg-accent-green/90"
                  : approvalAction === "reject"
                  ? "bg-accent-red text-background hover:bg-accent-red/90"
                  : "bg-accent-yellow text-background hover:bg-accent-yellow/90"
              }
              onClick={handleApprovalSubmit}
            >
              {approvalAction === "approve"
                ? "Approve"
                : approvalAction === "reject"
                ? "Reject"
                : "Request Revision"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
