import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Plug,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  Github,
  Cloud,
  Calendar,
  DollarSign,
  Video,
} from "lucide-react";
import { adminApi } from "@/api/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function IntegrationsTab() {
  const queryClient = useQueryClient();

  // Fetch integrations
  const { data: integrations, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: adminApi.getIntegrations,
  });

  // Fetch integration logs
  const { data: logs } = useQuery({
    queryKey: ['integration-logs'],
    queryFn: () => adminApi.getIntegrationLogs(),
  });

  // Sync integration mutation
  const syncMutation = useMutation({
    mutationFn: adminApi.syncIntegration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['integration-logs'] });
      toast.success("Integration synced successfully");
    },
    onError: () => {
      toast.error("Failed to sync integration");
    },
  });

  // Disconnect integration mutation
  const disconnectMutation = useMutation({
    mutationFn: adminApi.disconnectIntegration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast.success("Integration disconnected");
    },
    onError: () => {
      toast.error("Failed to disconnect integration");
    },
  });

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'github':
      case 'gitlab':
        return <Github className="h-5 w-5" />;
      case 'vercel':
      case 'cloudflare':
        return <Cloud className="h-5 w-5" />;
      case 'google':
      case 'microsoft':
        return <Calendar className="h-5 w-5" />;
      case 'quickbooks':
      case 'stripe':
        return <DollarSign className="h-5 w-5" />;
      case 'loom':
        return <Video className="h-5 w-5" />;
      default:
        return <Plug className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-accent-green" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-muted" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-accent-red" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'connected':
        return "border-accent-green text-accent-green";
      case 'disconnected':
        return "border-muted text-muted";
      case 'error':
        return "border-accent-red text-accent-red";
      default:
        return "border-muted text-muted";
    }
  };

  const getHealthBadgeColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return "border-accent-green text-accent-green";
      case 'warning':
        return "border-accent-yellow text-accent-yellow";
      case 'error':
        return "border-accent-red text-accent-red";
      default:
        return "border-muted text-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Integrations List */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Connected Services</CardTitle>
          <CardDescription>
            Manage external service integrations and API connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted">Loading integrations...</div>
          ) : integrations && integrations.length > 0 ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-background/50">
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integrations.map((integration) => (
                    <TableRow key={integration.id} className="hover:bg-background/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-accent-blue/10">
                            {getIntegrationIcon(integration.type)}
                          </div>
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            <p className="text-sm text-muted capitalize">
                              {integration.type}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(integration.status)}
                          <Badge
                            variant="outline"
                            className={getStatusBadgeColor(integration.status)}
                          >
                            {integration.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getHealthBadgeColor(integration.health_status)}
                        >
                          {integration.health_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted">
                        {integration.last_sync
                          ? new Date(integration.last_sync).toLocaleString()
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => syncMutation.mutate(integration.id)}
                            disabled={syncMutation.isPending}
                          >
                            <RefreshCw className={cn(
                              "h-4 w-4",
                              syncMutation.isPending && "animate-spin"
                            )} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                          {integration.status === 'connected' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm("Are you sure you want to disconnect this integration?")) {
                                  disconnectMutation.mutate(integration.id);
                                }
                              }}
                            >
                              Disconnect
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted">
              <Plug className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No integrations configured</p>
              <Button variant="outline" size="sm" className="mt-4">
                Connect Service
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity Logs */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Integration Logs</CardTitle>
          <CardDescription>Recent integration events and sync activity</CardDescription>
        </CardHeader>
        <CardContent>
          {logs && logs.length > 0 ? (
            <div className="space-y-3">
              {logs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-background hover:bg-background/80 transition-colors"
                >
                  <div className={cn(
                    "p-2 rounded-full mt-1",
                    log.event_type === 'error' ? "bg-accent-red/10" : "bg-accent-green/10"
                  )}>
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      log.event_type === 'error' ? "bg-accent-red" : "bg-accent-green"
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{log.integration_name}</p>
                      <span className="text-xs text-muted">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted mt-1">{log.message}</p>
                    {log.event_type === 'error' && (
                      <Badge variant="outline" className="mt-2 border-accent-red text-accent-red">
                        Error
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted">
              <p>No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
