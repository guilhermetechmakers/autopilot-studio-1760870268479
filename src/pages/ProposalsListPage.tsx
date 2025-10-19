import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Send,
  Download,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/templateEngine';
import { proposalsApi } from '@/api/proposals';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Proposal } from '@/types/proposal';

export default function ProposalsListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Proposal['status'] | 'all'>('all');

  // Fetch proposals
  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: proposalsApi.getAll,
  });

  // Filter proposals
  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch =
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDuplicate = async (id: string) => {
    try {
      const duplicated = await proposalsApi.duplicate(id);
      toast.success('Proposal duplicated successfully');
      navigate(`/proposals/${duplicated.id}`);
    } catch (error) {
      toast.error('Failed to duplicate proposal');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this proposal?')) return;

    try {
      await proposalsApi.delete(id);
      toast.success('Proposal deleted successfully');
    } catch (error) {
      toast.error('Failed to delete proposal');
    }
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-muted text-muted-foreground';
      case 'sent':
        return 'bg-accent-blue/20 text-accent-blue';
      case 'viewed':
        return 'bg-accent-yellow/20 text-accent-yellow';
      case 'accepted':
        return 'bg-accent-green/20 text-accent-green';
      case 'rejected':
        return 'bg-destructive/20 text-destructive';
      case 'expired':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Proposals</h1>
            <p className="text-muted">Manage and track your proposals</p>
          </div>
          <Button onClick={() => navigate('/proposals/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Proposal
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', count: proposals.length, color: 'text-foreground' },
            {
              label: 'Draft',
              count: proposals.filter(p => p.status === 'draft').length,
              color: 'text-muted',
            },
            {
              label: 'Sent',
              count: proposals.filter(p => p.status === 'sent' || p.status === 'viewed').length,
              color: 'text-accent-blue',
            },
            {
              label: 'Accepted',
              count: proposals.filter(p => p.status === 'accepted').length,
              color: 'text-accent-green',
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn('text-2xl font-bold', stat.color)}>
                  {stat.count}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  placeholder="Search proposals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'draft', 'sent', 'viewed', 'accepted', 'rejected'] as const).map(
                  (status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proposals table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center">
                <p className="text-muted">Loading proposals...</p>
              </div>
            ) : filteredProposals.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted mx-auto mb-4" />
                <p className="text-muted mb-4">No proposals found</p>
                <Button onClick={() => navigate('/proposals/new')} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Proposal
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProposals.map((proposal) => (
                    <TableRow
                      key={proposal.id}
                      className="cursor-pointer hover:bg-card/50"
                      onClick={() => navigate(`/proposals/${proposal.id}`)}
                    >
                      <TableCell className="font-medium">{proposal.title}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{proposal.client_name}</p>
                          <p className="text-sm text-muted">{proposal.client_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('capitalize', getStatusColor(proposal.status))}>
                          {proposal.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(proposal.pricing.total, proposal.pricing.currency)}
                      </TableCell>
                      <TableCell className="text-muted">
                        {formatDate(proposal.created_at)}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => navigate(`/proposals/${proposal.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigate(`/proposals/${proposal.id}/edit`)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(proposal.id)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Export PDF
                            </DropdownMenuItem>
                            {proposal.status === 'draft' && (
                              <DropdownMenuItem>
                                <Send className="h-4 w-4 mr-2" />
                                Send
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDelete(proposal.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
