import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Shield, Wrench, Sparkles, GraduationCap, Check } from 'lucide-react';
import type { RenewalOption } from '@/types/handover';
import { cn } from '@/lib/utils';

interface RenewalOptionsProps {
  options: RenewalOption[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export default function RenewalOptions({
  options,
  selectedIds,
  onSelectionChange,
}: RenewalOptionsProps) {
  const handleToggleOption = (optionId: string) => {
    if (selectedIds.includes(optionId)) {
      onSelectionChange(selectedIds.filter((id) => id !== optionId));
    } else {
      onSelectionChange([...selectedIds, optionId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === options.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(options.map((option) => option.id));
    }
  };

  const getOptionIcon = (type: string) => {
    switch (type) {
      case 'support':
        return Shield;
      case 'maintenance':
        return Wrench;
      case 'enhancement':
        return Sparkles;
      case 'training':
        return GraduationCap;
      default:
        return DollarSign;
    }
  };

  const getOptionColor = (type: string) => {
    switch (type) {
      case 'support':
        return 'text-accent-blue';
      case 'maintenance':
        return 'text-accent-green';
      case 'enhancement':
        return 'text-accent-purple';
      case 'training':
        return 'text-accent-yellow';
      default:
        return 'text-muted';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Renewal & Upsell Options</CardTitle>
              <CardDescription>
                Select renewal options to present to the client
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={options.length === 0}
            >
              {selectedIds.length === options.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Options Grid */}
      {options.length === 0 ? (
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted mx-auto mb-3" />
              <p className="text-muted">No renewal options available</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option) => {
            const Icon = getOptionIcon(option.type);
            const isSelected = selectedIds.includes(option.id);

            return (
              <Card
                key={option.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-lg',
                  isSelected
                    ? 'border-accent-green bg-accent-green/5'
                    : 'border-border bg-card'
                )}
                onClick={() => handleToggleOption(option.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleOption(option.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1"
                      />
                      <div
                        className={cn(
                          'rounded-lg p-2',
                          isSelected ? 'bg-accent-green/10' : 'bg-background'
                        )}
                      >
                        <Icon className={cn('h-5 w-5', getOptionColor(option.type))} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base mb-1">{option.title}</CardTitle>
                        <Badge variant="outline" className="text-xs capitalize">
                          {option.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted">{option.description}</p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{formatPrice(option.price)}</span>
                    <span className="text-sm text-muted">/ {option.duration}</span>
                  </div>

                  {option.features.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Includes:</p>
                      <ul className="space-y-1">
                        {option.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted">
                            <Check className="h-4 w-4 text-accent-green mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {selectedIds.length > 0 && (
        <Card className="bg-accent-green/5 border-accent-green/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1">
                  <span className="font-semibold text-accent-green">{selectedIds.length}</span>{' '}
                  renewal option{selectedIds.length !== 1 ? 's' : ''} selected
                </p>
                <p className="text-xs text-muted">
                  Total value:{' '}
                  {formatPrice(
                    options
                      .filter((opt) => selectedIds.includes(opt.id))
                      .reduce((sum, opt) => sum + opt.price, 0)
                  )}
                </p>
              </div>
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
