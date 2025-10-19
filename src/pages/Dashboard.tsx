import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  DollarSign,
  Clock,
  FileText,
  Plus,
  Calendar,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Active Projects",
      value: "12",
      change: "+2 this week",
      icon: FolderKanban,
      color: "text-accent-green",
      bgColor: "bg-accent-green/10",
    },
    {
      title: "Revenue (MTD)",
      value: "$48,500",
      change: "+12% from last month",
      icon: DollarSign,
      color: "text-accent-blue",
      bgColor: "bg-accent-blue/10",
    },
    {
      title: "Time Tracked",
      value: "342h",
      change: "This month",
      icon: Clock,
      color: "text-accent-purple",
      bgColor: "bg-accent-purple/10",
    },
    {
      title: "Proposals",
      value: "5",
      change: "2 pending approval",
      icon: FileText,
      color: "text-accent-yellow",
      bgColor: "bg-accent-yellow/10",
    },
  ];

  const projects = [
    {
      id: 1,
      name: "E-commerce Platform",
      client: "Acme Corp",
      status: "active",
      progress: 75,
      nextMilestone: "Payment Gateway Integration",
      dueDate: "2025-11-25",
    },
    {
      id: 2,
      name: "Mobile App Redesign",
      client: "TechStart Inc",
      status: "active",
      progress: 45,
      nextMilestone: "UI/UX Review",
      dueDate: "2025-11-20",
    },
    {
      id: 3,
      name: "CRM Dashboard",
      client: "SalesPro",
      status: "launch",
      progress: 92,
      nextMilestone: "Final QA",
      dueDate: "2025-11-18",
    },
  ];

  const activities = [
    {
      id: 1,
      type: "proposal",
      message: "New proposal sent to Acme Corp",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "milestone",
      message: "Milestone completed: API Development",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "contract",
      message: "Contract signed by TechStart Inc",
      time: "1 day ago",
    },
    {
      id: 4,
      type: "payment",
      message: "Payment received: $12,500",
      time: "2 days ago",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Book Meeting
            </Button>
            <Button className="bg-accent-green text-background hover:bg-accent-green/90">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="bg-card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
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

        {/* Projects and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Projects */}
          <Card className="lg:col-span-2 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>Your current project pipeline</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-lg bg-background hover:bg-background/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{project.name}</h4>
                      <p className="text-sm text-muted">{project.client}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        project.status === "active"
                          ? "border-accent-green text-accent-green"
                          : "border-accent-yellow text-accent-yellow"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted">Next: {project.nextMilestone}</span>
                      <span className="text-muted">Due {project.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="rounded-full bg-accent-green/10 p-2 h-fit">
                    <div className="h-2 w-2 rounded-full bg-accent-green" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto flex-col py-4">
                <Plus className="h-6 w-6 mb-2" />
                <span className="text-sm">Create Project</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-sm">New Proposal</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <Calendar className="h-6 w-6 mb-2" />
                <span className="text-sm">Book Meeting</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <Clock className="h-6 w-6 mb-2" />
                <span className="text-sm">Start Intake</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
