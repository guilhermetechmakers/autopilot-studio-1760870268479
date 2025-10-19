import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, RotateCcw, Clock } from 'lucide-react';
import { formatDate } from '@/lib/templateEngine';
import type { ProposalVersion } from '@/types/proposal';

interface VersionHistoryProps {
  versions: ProposalVersion[];
  currentVersion: number;
  onRestore: (versionId: string) => void;
}

export function VersionHistory({
  versions,
  currentVersion,
  onRestore,
}: VersionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {versions.map((version) => (
              <div
                key={version.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-card/50 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={version.version === currentVersion ? 'default' : 'outline'}
                    >
                      Version {version.version}
                    </Badge>
                    {version.version === currentVersion && (
                      <Badge variant="secondary">Current</Badge>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">{version.change_summary}</p>
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(version.created_at)}
                      </span>
                      <span>by {version.created_by}</span>
                    </div>
                  </div>
                </div>

                {version.version !== currentVersion && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRestore(version.id)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                )}
              </div>
            ))}

            {versions.length === 0 && (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-muted mx-auto mb-4" />
                <p className="text-muted">No version history available</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
