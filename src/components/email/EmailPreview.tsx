/**
 * Email Preview Component
 * 
 * Component for previewing and testing email templates
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { usePreviewEmailTemplate, useSendTestEmail } from '@/hooks/useEmail';
import { Mail, Send, Eye, Code, FileText, Loader2 } from 'lucide-react';
import type { EmailTemplateType } from '@/types/email';

const templateTypes: { value: EmailTemplateType; label: string }[] = [
  { value: 'verification', label: 'Email Verification' },
  { value: 'password-reset', label: 'Password Reset' },
  { value: 'welcome', label: 'Welcome Email' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'invoice-reminder', label: 'Invoice Reminder' },
  { value: 'standup-summary', label: 'Standup Summary' },
  { value: 'project-summary', label: 'Project Summary' },
  { value: 'milestone-complete', label: 'Milestone Complete' },
  { value: 'task-assigned', label: 'Task Assigned' },
  { value: 'proposal-sent', label: 'Proposal Sent' },
  { value: 'contract-signed', label: 'Contract Signed' },
  { value: 'handover-ready', label: 'Handover Ready' },
  { value: 'notification', label: 'Notification' },
];

const sampleData: Partial<Record<EmailTemplateType, Record<string, unknown>>> = {
  verification: {
    userName: 'John Doe',
    verificationLink: 'https://autopilotstudio.com/verify?token=abc123',
    expiresIn: '24 hours',
    supportEmail: 'support@autopilotstudio.com',
  },
  'password-reset': {
    userName: 'John Doe',
    resetLink: 'https://autopilotstudio.com/reset?token=xyz789',
    expiresIn: '1 hour',
    ipAddress: '192.168.1.1',
    supportEmail: 'support@autopilotstudio.com',
  },
  welcome: {
    userName: 'John Doe',
    dashboardLink: 'https://autopilotstudio.com/dashboard',
    gettingStartedLink: 'https://autopilotstudio.com/docs/getting-started',
    supportEmail: 'support@autopilotstudio.com',
  },
  invoice: {
    invoiceNumber: 'INV-2024-001',
    clientName: 'Acme Corp',
    amount: '5,000.00',
    currency: '$',
    dueDate: 'March 15, 2024',
    invoiceLink: 'https://autopilotstudio.com/invoices/INV-2024-001',
    paymentLink: 'https://autopilotstudio.com/pay/INV-2024-001',
    items: [
      { description: 'Web Development', quantity: 40, unitPrice: '$100', total: '$4,000' },
      { description: 'Design Services', quantity: 10, unitPrice: '$100', total: '$1,000' },
    ],
    subtotal: '5,000.00',
    total: '5,000.00',
    companyName: 'Autopilot Studio',
  },
  'invoice-reminder': {
    invoiceNumber: 'INV-2024-001',
    clientName: 'Acme Corp',
    amount: '5,000.00',
    currency: '$',
    dueDate: 'March 15, 2024',
    daysOverdue: 5,
    invoiceLink: 'https://autopilotstudio.com/invoices/INV-2024-001',
    paymentLink: 'https://autopilotstudio.com/pay/INV-2024-001',
    companyName: 'Autopilot Studio',
  },
  'standup-summary': {
    date: 'March 20, 2024',
    projectName: 'E-commerce Platform',
    teamMembers: [
      {
        name: 'Alice Johnson',
        completed: ['Implemented user authentication', 'Fixed checkout bug'],
        inProgress: ['Working on payment integration'],
        blockers: [],
      },
      {
        name: 'Bob Smith',
        completed: ['Designed product page'],
        inProgress: ['Creating mobile responsive layouts'],
        blockers: ['Waiting for API documentation'],
      },
    ],
    overallProgress: 65,
    upcomingMilestone: 'Beta Launch - March 30, 2024',
    dashboardLink: 'https://autopilotstudio.com/dashboard/projects/123',
  },
  'project-summary': {
    projectName: 'E-commerce Platform',
    period: 'March 1-20, 2024',
    completedTasks: 24,
    totalTasks: 40,
    progress: 60,
    milestones: [
      { name: 'Design Phase', status: 'completed' as const, dueDate: 'March 10, 2024' },
      { name: 'Development', status: 'in-progress' as const, dueDate: 'March 25, 2024' },
      { name: 'Testing', status: 'pending' as const, dueDate: 'March 30, 2024' },
    ],
    commits: 156,
    teamActivity: [
      { member: 'Alice Johnson', contributions: 45 },
      { member: 'Bob Smith', contributions: 32 },
    ],
    upcomingDeadlines: [
      { title: 'Development Complete', date: 'March 25, 2024' },
      { title: 'Beta Launch', date: 'March 30, 2024' },
    ],
    dashboardLink: 'https://autopilotstudio.com/dashboard/projects/123',
  },
  'milestone-complete': {
    milestoneName: 'Design Phase',
    projectName: 'E-commerce Platform',
    completedDate: 'March 20, 2024',
    completedBy: 'Design Team',
    deliverables: ['UI Mockups', 'Design System', 'Component Library'],
    nextMilestone: 'Development Phase',
    dashboardLink: 'https://autopilotstudio.com/dashboard/projects/123',
  },
  'task-assigned': {
    taskTitle: 'Implement Payment Gateway',
    projectName: 'E-commerce Platform',
    assignedBy: 'Project Manager',
    assignedTo: 'Alice Johnson',
    dueDate: 'March 25, 2024',
    priority: 'high' as const,
    description: 'Integrate Stripe payment gateway with checkout flow',
    taskLink: 'https://autopilotstudio.com/tasks/456',
  },
  'proposal-sent': {
    clientName: 'Acme Corp',
    proposalTitle: 'E-commerce Platform Development',
    validUntil: 'March 30, 2024',
    totalAmount: '50,000',
    currency: '$',
    proposalLink: 'https://autopilotstudio.com/proposals/789',
    companyName: 'Autopilot Studio',
    senderName: 'Sales Team',
  },
  'contract-signed': {
    clientName: 'Acme Corp',
    projectName: 'E-commerce Platform',
    signedDate: 'March 20, 2024',
    startDate: 'March 25, 2024',
    contractLink: 'https://autopilotstudio.com/contracts/789',
    nextSteps: [
      'Project kickoff meeting scheduled',
      'Development environment setup',
      'Initial design review',
    ],
    companyName: 'Autopilot Studio',
  },
  'handover-ready': {
    projectName: 'E-commerce Platform',
    clientName: 'Acme Corp',
    handoverDate: 'March 30, 2024',
    deliverables: [
      'Source code repository',
      'Deployment documentation',
      'User guides',
      'Admin panel access',
    ],
    documentationLink: 'https://autopilotstudio.com/handover/123',
    videoTutorials: [
      'https://loom.com/tutorial1',
      'https://loom.com/tutorial2',
    ],
    supportEmail: 'support@autopilotstudio.com',
    companyName: 'Autopilot Studio',
  },
  notification: {
    title: 'System Update',
    message: 'Your project has been updated with new features.',
    actionText: 'View Changes',
    actionLink: 'https://autopilotstudio.com/updates',
    userName: 'John Doe',
  },
};

export function EmailPreview() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType>('verification');
  const [variables, setVariables] = useState<string>(
    JSON.stringify(sampleData[selectedTemplate], null, 2)
  );
  const [testEmail, setTestEmail] = useState('');
  
  const previewMutation = usePreviewEmailTemplate();
  const sendTestMutation = useSendTestEmail();

  const handleTemplateChange = (value: EmailTemplateType) => {
    setSelectedTemplate(value);
    setVariables(JSON.stringify(sampleData[value], null, 2));
  };

  const handlePreview = () => {
    try {
      const parsedVariables = JSON.parse(variables);
      previewMutation.mutate({
        templateType: selectedTemplate,
        variables: parsedVariables,
      });
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  const handleSendTest = () => {
    if (!testEmail) return;
    
    try {
      const parsedVariables = JSON.parse(variables);
      sendTestMutation.mutate({
        templateType: selectedTemplate,
        to: testEmail,
        variables: parsedVariables,
      });
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  const preview = previewMutation.data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Email Template Preview</h2>
        <p className="text-muted-foreground">
          Preview and test email templates with sample data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-type">Template Type</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger id="template-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templateTypes.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="variables">Template Variables (JSON)</Label>
              <Textarea
                id="variables"
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
                className="font-mono text-sm min-h-[300px]"
                placeholder="Enter JSON variables..."
              />
            </div>

            <Button onClick={handlePreview} className="w-full" disabled={previewMutation.isPending}>
              {previewMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Preview...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Generate Preview
                </>
              )}
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Send Test Email</h3>
            <div>
              <Label htmlFor="test-email">Email Address</Label>
              <Input
                id="test-email"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <Button
              onClick={handleSendTest}
              variant="secondary"
              className="w-full"
              disabled={!testEmail || sendTestMutation.isPending}
            >
              {sendTestMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test Email
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Preview Panel */}
        <Card className="p-6">
          {preview ? (
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="html-code">
                  <Code className="mr-2 h-4 w-4" />
                  HTML
                </TabsTrigger>
                <TabsTrigger value="text">
                  <FileText className="mr-2 h-4 w-4" />
                  Plain Text
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 space-y-4">
                <div>
                  <Label>Subject</Label>
                  <div className="mt-1 p-3 bg-card rounded-lg border">
                    <p className="text-sm font-medium">{preview.subject}</p>
                  </div>
                </div>

                <TabsContent value="html" className="mt-0">
                  <Label>Email Preview</Label>
                  <ScrollArea className="h-[500px] mt-1 border rounded-lg">
                    <div
                      className="p-4"
                      dangerouslySetInnerHTML={{ __html: preview.html }}
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="html-code" className="mt-0">
                  <Label>HTML Source</Label>
                  <ScrollArea className="h-[500px] mt-1">
                    <pre className="p-4 bg-card rounded-lg border text-xs overflow-x-auto">
                      <code>{preview.html}</code>
                    </pre>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="text" className="mt-0">
                  <Label>Plain Text Version</Label>
                  <ScrollArea className="h-[500px] mt-1">
                    <pre className="p-4 bg-card rounded-lg border text-sm whitespace-pre-wrap">
                      {preview.text}
                    </pre>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-center">
              <Mail className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Preview Available</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Select a template type and click "Generate Preview" to see how your email will look.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Template Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Template Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Template Type</Label>
            <p className="mt-1 font-medium">
              {templateTypes.find((t) => t.value === selectedTemplate)?.label}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">Status</Label>
            <div className="mt-1">
              <Badge variant="default">Active</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
