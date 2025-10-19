import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  FilePlus,
  MoreVertical,
  Search,
  FileText,
  FileCheck,
  FileCode,
  FileSignature,
  Copy,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { adminApi } from "@/api/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CreateTemplateInput } from "@/types/admin";

export default function TemplatesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [templateData, setTemplateData] = useState<CreateTemplateInput>({
    name: "",
    type: "proposal",
    description: "",
    content: "",
    variables: [],
  });

  const queryClient = useQueryClient();

  // Fetch templates
  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: adminApi.getTemplates,
  });

  // Create template mutation
  const createMutation = useMutation({
    mutationFn: adminApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success("Template created successfully");
      setCreateDialogOpen(false);
      setTemplateData({
        name: "",
        type: "proposal",
        description: "",
        content: "",
        variables: [],
      });
    },
    onError: () => {
      toast.error("Failed to create template");
    },
  });

  // Duplicate template mutation
  const duplicateMutation = useMutation({
    mutationFn: adminApi.duplicateTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success("Template duplicated");
    },
    onError: () => {
      toast.error("Failed to duplicate template");
    },
  });

  // Delete template mutation
  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success("Template deleted");
    },
    onError: () => {
      toast.error("Failed to delete template");
    },
  });

  const handleCreate = () => {
    if (!templateData.name || !templateData.content) {
      toast.error("Please fill in all required fields");
      return;
    }
    createMutation.mutate(templateData);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'proposal':
        return <FileText className="h-4 w-4" />;
      case 'sow':
        return <FileCheck className="h-4 w-4" />;
      case 'task':
        return <FileCode className="h-4 w-4" />;
      case 'contract':
        return <FileSignature className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'proposal':
        return "border-accent-blue text-accent-blue";
      case 'sow':
        return "border-accent-green text-accent-green";
      case 'task':
        return "border-accent-purple text-accent-purple";
      case 'contract':
        return "border-accent-yellow text-accent-yellow";
      default:
        return "border-muted text-muted";
    }
  };

  const filteredTemplates = templates?.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || template.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Template Library</CardTitle>
              <CardDescription>
                Manage proposal, SoW, task, and contract templates
              </CardDescription>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent-green text-background hover:bg-accent-green/90">
                  <FilePlus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                  <DialogDescription>
                    Create a reusable template for proposals, SoWs, or tasks
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Standard Proposal Template"
                      value={templateData.name}
                      onChange={(e) =>
                        setTemplateData({ ...templateData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={templateData.type}
                      onValueChange={(value: any) =>
                        setTemplateData({ ...templateData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="sow">Statement of Work</SelectItem>
                        <SelectItem value="task">Task Template</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of this template..."
                      value={templateData.description}
                      onChange={(e) =>
                        setTemplateData({ ...templateData, description: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Template Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Template content with {{variables}}..."
                      value={templateData.content}
                      onChange={(e) =>
                        setTemplateData({ ...templateData, content: e.target.value })
                      }
                      rows={10}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted">
                      Use {"{{variable_name}}"} for dynamic content
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={createMutation.isPending}
                    className="bg-accent-green text-background hover:bg-accent-green/90"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Template"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                placeholder="Search templates..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="proposal">Proposals</SelectItem>
                <SelectItem value="sow">SoW</SelectItem>
                <SelectItem value="task">Tasks</SelectItem>
                <SelectItem value="contract">Contracts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Templates Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-muted">Loading templates...</div>
          ) : filteredTemplates && filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="bg-background hover:bg-background/80 transition-all hover:shadow-lg cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("p-2 rounded-lg", `bg-${template.type === 'proposal' ? 'accent-blue' : template.type === 'sow' ? 'accent-green' : template.type === 'task' ? 'accent-purple' : 'accent-yellow'}/10`)}>
                          {getTypeIcon(template.type)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <Badge
                            variant="outline"
                            className={cn("mt-1", getTypeBadgeColor(template.type))}
                          >
                            {template.type}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => duplicateMutation.mutate(template.id)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this template?")) {
                                deleteMutation.mutate(template.id);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted line-clamp-3">
                      {template.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted">
                      <span>
                        {template.variables?.length || 0} variables
                      </span>
                      <span>
                        {new Date(template.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No templates found</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setCreateDialogOpen(true)}
              >
                Create Your First Template
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
