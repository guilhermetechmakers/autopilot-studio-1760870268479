import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { GovernanceTemplate } from '@/types/handover';
import { cn } from '@/lib/utils';

interface GovernanceSelectorProps {
  templates: GovernanceTemplate[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export default function GovernanceSelector({
  templates,
  selectedIds,
  onSelectionChange,
}: GovernanceSelectorProps) {
  const handleToggleTemplate = (templateId: string) => {
    if (selectedIds.includes(templateId)) {
      onSelectionChange(selectedIds.filter((id) => id !== templateId));
    } else {
      onSelectionChange([...selectedIds, templateId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === templates.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(templates.map((template) => template.id));
    }
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'sla':
        return CheckCircle2;
      case 'support':
        return Shield;
      case 'maintenance':
        return FileText;
      case 'security':
        return Lock;
      case 'compliance':
        return AlertTriangle;
      default:
        return FileText;
    }
  };

  const getTemplateColor = (type: string) => {
    switch (type) {
      case 'sla':
        return 'text-accent-green';
      case 'support':
        return 'text-accent-blue';
      case 'maintenance':
        return 'text-accent-purple';
      case 'security':
        return 'text-accent-red';
      case 'compliance':
        return 'text-accent-yellow';
      default:
        return 'text-muted';
    }
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.type]) {
      acc[template.type] = [];
    }
    acc[template.type].push(template);
    return acc;
  }, {} as Record<string, GovernanceTemplate[]>);

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Governance Documents</CardTitle>
              <CardDescription>
                Select governance templates to include in the handover pack
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={templates.length === 0}
            >
              {selectedIds.length === templates.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Templates by Type */}
      {templates.length === 0 ? (
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted mx-auto mb-3" />
              <p className="text-muted">No governance templates available</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedTemplates).map(([type, typeTemplates]) => (
          <Card key={type} className="bg-card">
            <CardHeader>
              <CardTitle className="text-base capitalize flex items-center gap-2">
                {type} Documents
                <Badge variant="outline" className="text-xs">
                  {typeTemplates.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {typeTemplates.map((template) => {
                const Icon = getTemplateIcon(template.type);
                const isSelected = selectedIds.includes(template.id);

                return (
                  <div
                    key={template.id}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer hover:bg-background/50',
                      isSelected
                        ? 'border-accent-green bg-accent-green/5'
                        : 'border-border bg-background'
                    )}
                    onClick={() => handleToggleTemplate(template.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleTemplate(template.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />
                    <div
                      className={cn(
                        'rounded-lg p-2 mt-0.5',
                        isSelected ? 'bg-accent-green/10' : 'bg-card'
                      )}
                    >
                      <Icon className={cn('h-5 w-5', getTemplateColor(template.type))} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium mb-1">{template.name}</h4>
                      <p className="text-sm text-muted">{template.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))
      )}

      {/* Summary */}
      {selectedIds.length > 0 && (
        <Card className="bg-accent-green/5 border-accent-green/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                <span className="font-semibold text-accent-green">{selectedIds.length}</span>{' '}
                governance document{selectedIds.length !== 1 ? 's' : ''} selected
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectionChange([])}
                className="text-accent-green hover:text-accent-green/80"
              >
                Clear selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
