import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Download,
  Search,
  User,
  FileText,
  Settings,
  Trash2,
  Edit,
  Eye,
  Plus,
} from "lucide-react";
import { adminApi } from "@/api/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { AuditLogFilters } from "@/types/admin";

export default function AuditLogsTab() {
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch audit logs
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => adminApi.getAuditLogs(filters),
  });

  const handleExport = async () => {
    try {
      const blob = await adminApi.exportAuditLogs(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Audit logs exported");
    } catch (error) {
      toast.error("Failed to export audit logs");
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('create') || action.includes('add')) return <Plus className="h-4 w-4" />;
    if (action.includes('update') || action.includes('edit')) return <Edit className="h-4 w-4" />;
    if (action.includes('delete') || action.includes('remove')) return <Trash2 className="h-4 w-4" />;
    if (action.includes('view') || action.includes('read')) return <Eye className="h-4 w-4" />;
    return <Settings className="h-4 w-4" />;
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('create') || action.includes('add')) return "border-accent-green text-accent-green";
    if (action.includes('update') || action.includes('edit')) return "border-accent-blue text-accent-blue";
    if (action.includes('delete') || action.includes('remove')) return "border-accent-red text-accent-red";
    if (action.includes('view') || action.includes('read')) return "border-accent-purple text-accent-purple";
    return "border-muted text-muted";
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'project':
      case 'proposal':
      case 'template':
        return <FileText className="h-4 w-4" />;
      case 'integration':
        return <Settings className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const filteredLogs = auditLogs?.filter((log) =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.resource_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                Track all system activities and user actions
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="action-filter" className="sr-only">Action</Label>
              <Select
                value={filters.action || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, action: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger id="action-filter">
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="resource-filter" className="sr-only">Resource Type</Label>
              <Select
                value={filters.resource_type || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, resource_type: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger id="resource-filter">
                  <SelectValue placeholder="All Resources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Resources</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="project">Projects</SelectItem>
                  <SelectItem value="proposal">Proposals</SelectItem>
                  <SelectItem value="template">Templates</SelectItem>
                  <SelectItem value="integration">Integrations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card className="bg-card">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-12 text-muted">Loading audit logs...</div>
          ) : filteredLogs && filteredLogs.length > 0 ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-background/50">
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-background/50">
                      <TableCell className="text-muted">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-full bg-accent-blue/10">
                            <User className="h-3 w-3 text-accent-blue" />
                          </div>
                          <span className="font-medium">{log.user_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("flex items-center gap-1 w-fit", getActionBadgeColor(log.action))}
                        >
                          {getActionIcon(log.action)}
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-full bg-accent-purple/10">
                            {getResourceIcon(log.resource_type)}
                          </div>
                          <span className="capitalize">{log.resource_type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted font-mono text-xs">
                        {log.ip_address || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No audit logs found</p>
              <p className="text-sm mt-2">
                System activities will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditLogs?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Unique Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(auditLogs?.map(log => log.user_id)).size || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Today's Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditLogs?.filter(log => 
                new Date(log.created_at).toDateString() === new Date().toDateString()
              ).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Critical Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditLogs?.filter(log => 
                log.action.includes('delete') || log.action.includes('remove')
              ).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
