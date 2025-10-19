import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  Plug,
  BarChart3,
  Shield,
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { adminApi } from "@/api/admin";
import { cn } from "@/lib/utils";

// Import tab components
import UsersManagementTab from "@/components/admin/UsersManagementTab";
import TemplatesTab from "@/components/admin/TemplatesTab";
import IntegrationsTab from "@/components/admin/IntegrationsTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import AuditLogsTab from "@/components/admin/AuditLogsTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch analytics metrics for overview
  const { data: metrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: adminApi.getAnalyticsMetrics,
  });

  // Fetch integration health
  const { data: integrationHealth } = useQuery({
    queryKey: ['integration-health'],
    queryFn: adminApi.getIntegrationHealth,
  });

  const stats = [
    {
      title: "Total Users",
      value: metrics?.total_users || 0,
      change: `${metrics?.active_users || 0} active`,
      icon: Users,
      color: "text-accent-blue",
      bgColor: "bg-accent-blue/10",
    },
    {
      title: "Active Projects",
      value: metrics?.active_projects || 0,
      change: `${metrics?.total_projects || 0} total`,
      icon: Activity,
      color: "text-accent-green",
      bgColor: "bg-accent-green/10",
    },
    {
      title: "Monthly Revenue",
      value: `$${(metrics?.monthly_revenue || 0).toLocaleString()}`,
      change: `${metrics?.revenue_growth || 0}% growth`,
      icon: DollarSign,
      color: "text-accent-yellow",
      bgColor: "bg-accent-yellow/10",
    },
    {
      title: "Proposal Rate",
      value: `${metrics?.acceptance_rate || 0}%`,
      change: `${metrics?.proposals_accepted || 0}/${metrics?.total_proposals || 0} accepted`,
      icon: FileText,
      color: "text-accent-purple",
      bgColor: "bg-accent-purple/10",
    },
  ];

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-accent-green" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-accent-yellow" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-accent-red" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted">
              Manage users, templates, integrations, and monitor system health
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Security Settings
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card">
            <TabsTrigger value="overview">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Users & Teams
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="mr-2 h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Plug className="mr-2 h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="audit">
              <Shield className="mr-2 h-4 w-4" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card
                  key={stat.title}
                  className="bg-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted">
                      {stat.title}
                    </CardTitle>
                    <div className={`rounded-lg ${stat.bgColor} p-2`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Health & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Integration Health */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Integration Health</CardTitle>
                  <CardDescription>Status of connected services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {integrationHealth && integrationHealth.length > 0 ? (
                    integrationHealth.map((integration) => (
                      <div
                        key={integration.integration_name}
                        className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-background/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getHealthStatusIcon(integration.status)}
                          <div>
                            <p className="font-medium">{integration.integration_name}</p>
                            <p className="text-xs text-muted">
                              {integration.uptime_percentage}% uptime
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            integration.status === 'healthy' && "border-accent-green text-accent-green",
                            integration.status === 'warning' && "border-accent-yellow text-accent-yellow",
                            integration.status === 'error' && "border-accent-red text-accent-red"
                          )}
                        >
                          {integration.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted">
                      <Plug className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No integrations configured</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => setActiveTab("integrations")}
                      >
                        Configure Integrations
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto flex-col py-4"
                      onClick={() => setActiveTab("users")}
                    >
                      <Users className="h-6 w-6 mb-2" />
                      <span className="text-sm">Invite User</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col py-4"
                      onClick={() => setActiveTab("templates")}
                    >
                      <FileText className="h-6 w-6 mb-2" />
                      <span className="text-sm">New Template</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col py-4"
                      onClick={() => setActiveTab("integrations")}
                    >
                      <Plug className="h-6 w-6 mb-2" />
                      <span className="text-sm">Connect Service</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col py-4"
                      onClick={() => setActiveTab("audit")}
                    >
                      <Shield className="h-6 w-6 mb-2" />
                      <span className="text-sm">View Audit Logs</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Metrics Summary */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>System Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted">Total Revenue</p>
                    <p className="text-2xl font-bold">
                      ${(metrics?.total_revenue || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted">Avg. Project Value</p>
                    <p className="text-2xl font-bold">
                      ${(metrics?.average_project_value || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted">Billable Hours</p>
                    <p className="text-2xl font-bold">
                      {(metrics?.billable_hours || 0).toLocaleString()}h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users & Teams Tab */}
          <TabsContent value="users">
            <UsersManagementTab />
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <TemplatesTab />
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <IntegrationsTab />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit">
            <AuditLogsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
