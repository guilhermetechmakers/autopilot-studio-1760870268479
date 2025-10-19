import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileCode,
  FileText,
  Inbox,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import type { CopilotContext } from '@/types/copilot';

interface ContextPanelProps {
  context: CopilotContext | null;
  isLoading?: boolean;
}

export function ContextPanel({ context, isLoading }: ContextPanelProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  const toggleFile = (path: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <Card className="h-full bg-card">
        <CardHeader>
          <CardTitle className="text-sm">Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-background animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!context) {
    return (
      <Card className="h-full bg-card">
        <CardHeader>
          <CardTitle className="text-sm">Context</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted">
            No context loaded. Select a project to load relevant context.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-card flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle className="text-sm">Project Context</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs defaultValue="repos" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-2">
            <TabsTrigger value="repos" className="text-xs">
              <FileCode className="h-3 w-3 mr-1" />
              Repos
            </TabsTrigger>
            <TabsTrigger value="proposals" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Proposals
            </TabsTrigger>
            <TabsTrigger value="intake" className="text-xs">
              <Inbox className="h-3 w-3 mr-1" />
              Intake
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-4 pb-4">
            {/* Repository Files */}
            <TabsContent value="repos" className="mt-4 space-y-2">
              {context.repoFiles && context.repoFiles.length > 0 ? (
                context.repoFiles.map((file) => (
                  <div key={file.path} className="space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-auto py-2"
                      onClick={() => toggleFile(file.path)}
                    >
                      {expandedFiles.has(file.path) ? (
                        <ChevronDown className="h-3 w-3 mr-2" />
                      ) : (
                        <ChevronRight className="h-3 w-3 mr-2" />
                      )}
                      <FileCode className="h-3 w-3 mr-2 text-accent-blue" />
                      <span className="truncate flex-1 text-left">
                        {file.path.split('/').pop()}
                      </span>
                      <Badge variant="outline" className="text-[10px] ml-2">
                        {file.language}
                      </Badge>
                    </Button>
                    {expandedFiles.has(file.path) && (
                      <Card className="ml-4 bg-background">
                        <CardContent className="p-3">
                          <pre className="text-[10px] text-muted overflow-x-auto">
                            {file.content.slice(0, 200)}
                            {file.content.length > 200 && '...'}
                          </pre>
                          <p className="text-[10px] text-muted mt-2">
                            Last modified:{' '}
                            {new Date(file.lastModified).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted">No repository files available</p>
              )}
            </TabsContent>

            {/* Proposals */}
            <TabsContent value="proposals" className="mt-4 space-y-2">
              {context.proposals && context.proposals.length > 0 ? (
                context.proposals.map((proposal) => (
                  <Card key={proposal.id} className="bg-background">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xs font-medium">{proposal.title}</h4>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted mb-2">
                        {proposal.scope.slice(0, 100)}...
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          ${proposal.budget.toLocaleString()}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {proposal.timeline}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-xs text-muted">No proposals available</p>
              )}
            </TabsContent>

            {/* Intake Data */}
            <TabsContent value="intake" className="mt-4">
              {context.intakeData ? (
                <Card className="bg-background">
                  <CardContent className="p-3 space-y-3">
                    <div>
                      <p className="text-xs font-medium mb-1">Company</p>
                      <p className="text-xs text-muted">
                        {context.intakeData.companyName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1">Goals</p>
                      <ul className="space-y-1">
                        {context.intakeData.goals.map((goal, idx) => (
                          <li key={idx} className="text-xs text-muted flex gap-2">
                            <span className="text-accent-green">•</span>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        ${context.intakeData.budget.toLocaleString()}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {context.intakeData.timeline}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1">Tech Stack</p>
                      <div className="flex flex-wrap gap-1">
                        {context.intakeData.techStack.map((tech, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-xs text-muted">No intake data available</p>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
