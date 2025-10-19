import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, Users, FolderKanban, Clock } from "lucide-react";
import { adminApi } from "@/api/admin";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";

export default function AnalyticsTab() {
  const [revenuePeriod, setRevenuePeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // Fetch analytics metrics
  const { data: metrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: adminApi.getAnalyticsMetrics,
  });

  // Fetch revenue data
  const { data: revenueData } = useQuery({
    queryKey: ['revenue-data', revenuePeriod],
    queryFn: () => adminApi.getRevenueData(revenuePeriod),
  });

  // Fetch user activity data
  const { data: userActivityData } = useQuery({
    queryKey: ['user-activity'],
    queryFn: () => adminApi.getUserActivityData(30),
  });

  const kpiCards = [
    {
      title: "Total Revenue",
      value: `$${(metrics?.total_revenue || 0).toLocaleString()}`,
      change: metrics?.revenue_growth || 0,
      icon: DollarSign,
      color: "text-accent-green",
    },
    {
      title: "Active Users",
      value: metrics?.active_users || 0,
      change: 12,
      icon: Users,
      color: "text-accent-blue",
    },
    {
      title: "Active Projects",
      value: metrics?.active_projects || 0,
      change: 8,
      icon: FolderKanban,
      color: "text-accent-purple",
    },
    {
      title: "Billable Hours",
      value: `${(metrics?.billable_hours || 0).toLocaleString()}h`,
      change: 15,
      icon: Clock,
      color: "text-accent-yellow",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card
            key={kpi.title}
            className="bg-card animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center gap-1 mt-1 text-xs">
                {kpi.change >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-accent-green" />
                    <span className="text-accent-green">+{kpi.change}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-accent-red" />
                    <span className="text-accent-red">{kpi.change}%</span>
                  </>
                )}
                <span className="text-muted ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Revenue and project count over time</CardDescription>
            </div>
            <Select value={revenuePeriod} onValueChange={(value: any) => setRevenuePeriod(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {revenueData && revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="rgb(var(--muted))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="rgb(var(--muted))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--card))',
                    border: '1px solid rgb(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="rgb(var(--accent-green))" name="Revenue ($)" />
                <Bar dataKey="projects" fill="rgb(var(--accent-blue))" name="Projects" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted">
              No revenue data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Activity Chart */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
          <CardDescription>Active and new users over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {userActivityData && userActivityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="rgb(var(--muted))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="rgb(var(--muted))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--card))',
                    border: '1px solid rgb(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="active_users"
                  stroke="rgb(var(--accent-blue))"
                  strokeWidth={2}
                  name="Active Users"
                />
                <Line
                  type="monotone"
                  dataKey="new_users"
                  stroke="rgb(var(--accent-green))"
                  strokeWidth={2}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted">
              No user activity data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Proposal Metrics</CardTitle>
            <CardDescription>Proposal performance overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted">Total Proposals</span>
              <span className="font-bold">{metrics?.total_proposals || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Accepted</span>
              <span className="font-bold text-accent-green">
                {metrics?.proposals_accepted || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Pending</span>
              <span className="font-bold text-accent-yellow">
                {metrics?.proposals_pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Acceptance Rate</span>
              <span className="font-bold">{metrics?.acceptance_rate || 0}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Project Metrics</CardTitle>
            <CardDescription>Project and time tracking overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted">Total Projects</span>
              <span className="font-bold">{metrics?.total_projects || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Active Projects</span>
              <span className="font-bold text-accent-green">
                {metrics?.active_projects || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Avg. Project Value</span>
              <span className="font-bold">
                ${(metrics?.average_project_value || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Total Time Tracked</span>
              <span className="font-bold">
                {(metrics?.total_time_tracked || 0).toLocaleString()}h
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
