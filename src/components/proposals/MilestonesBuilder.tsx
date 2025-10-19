import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/templateEngine';
import type { ProposalMilestone } from '@/types/proposal';

interface MilestonesBuilderProps {
  value: ProposalMilestone[];
  totalBudget: number;
  currency: string;
  onChange: (value: ProposalMilestone[]) => void;
}

export function MilestonesBuilder({
  value,
  totalBudget,
  currency,
  onChange,
}: MilestonesBuilderProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    const newMilestone: ProposalMilestone = {
      id: Date.now().toString(),
      title: 'New Milestone',
      description: '',
      deliverables: [],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      payment_percentage: 0,
      payment_amount: 0,
    };

    onChange([...value, newMilestone]);
    setEditingId(newMilestone.id);
  };

  const handleRemove = (id: string) => {
    onChange(value.filter(m => m.id !== id));
  };

  const handleUpdate = (id: string, field: keyof ProposalMilestone, newValue: unknown) => {
    onChange(
      value.map(milestone => {
        if (milestone.id !== id) return milestone;

        const updated = { ...milestone, [field]: newValue };

        // Auto-calculate payment amount from percentage
        if (field === 'payment_percentage') {
          updated.payment_amount = (totalBudget * (newValue as number)) / 100;
        }

        // Auto-calculate percentage from amount
        if (field === 'payment_amount' && totalBudget > 0) {
          updated.payment_percentage = ((newValue as number) / totalBudget) * 100;
        }

        return updated;
      })
    );
  };

  const handleAddDeliverable = (milestoneId: string) => {
    const deliverable = prompt('Enter deliverable:');
    if (!deliverable) return;

    onChange(
      value.map(milestone => {
        if (milestone.id !== milestoneId) return milestone;
        return {
          ...milestone,
          deliverables: [...milestone.deliverables, deliverable],
        };
      })
    );
  };

  const handleRemoveDeliverable = (milestoneId: string, index: number) => {
    onChange(
      value.map(milestone => {
        if (milestone.id !== milestoneId) return milestone;
        return {
          ...milestone,
          deliverables: milestone.deliverables.filter((_, i) => i !== index),
        };
      })
    );
  };

  const totalPaymentPercentage = value.reduce((sum, m) => sum + m.payment_percentage, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Milestones</h3>
          <p className="text-sm text-muted">
            Total payment allocation: {totalPaymentPercentage.toFixed(1)}%
            {totalPaymentPercentage !== 100 && (
              <span className="text-destructive ml-2">
                (Should equal 100%)
              </span>
            )}
          </p>
        </div>
        <Button onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      <div className="space-y-4">
        {value.map((milestone, index) => (
          <Card key={milestone.id}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Milestone {index + 1}</Badge>
                  </div>
                  {editingId === milestone.id ? (
                    <Input
                      value={milestone.title}
                      onChange={(e) => handleUpdate(milestone.id, 'title', e.target.value)}
                      onBlur={() => setEditingId(null)}
                      autoFocus
                      className="text-lg font-semibold mb-2"
                    />
                  ) : (
                    <CardTitle
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setEditingId(milestone.id)}
                    >
                      {milestone.title}
                    </CardTitle>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(milestone.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor={`desc-${milestone.id}`}>Description</Label>
                <Textarea
                  id={`desc-${milestone.id}`}
                  value={milestone.description}
                  onChange={(e) => handleUpdate(milestone.id, 'description', e.target.value)}
                  placeholder="Describe this milestone..."
                  rows={3}
                />
              </div>

              {/* Deliverables */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Deliverables</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddDeliverable(milestone.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
                {milestone.deliverables.length > 0 ? (
                  <ul className="space-y-2">
                    {milestone.deliverables.map((deliverable, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 bg-card px-3 py-2 rounded-md">
                          {deliverable}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleRemoveDeliverable(milestone.id, idx)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted">No deliverables added</p>
                )}
              </div>

              {/* Due date and payment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`date-${milestone.id}`}>
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Due Date
                  </Label>
                  <Input
                    id={`date-${milestone.id}`}
                    type="date"
                    value={milestone.due_date}
                    onChange={(e) => handleUpdate(milestone.id, 'due_date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`percent-${milestone.id}`}>
                    Payment %
                  </Label>
                  <Input
                    id={`percent-${milestone.id}`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={milestone.payment_percentage}
                    onChange={(e) =>
                      handleUpdate(milestone.id, 'payment_percentage', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`amount-${milestone.id}`}>
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    Payment Amount
                  </Label>
                  <Input
                    id={`amount-${milestone.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={milestone.payment_amount}
                    onChange={(e) =>
                      handleUpdate(milestone.id, 'payment_amount', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="flex items-center justify-between pt-2 border-t border-border text-sm">
                <span className="text-muted">
                  Due: {formatDate(milestone.due_date)}
                </span>
                <span className="font-medium text-primary">
                  {formatCurrency(milestone.payment_amount, currency)} ({milestone.payment_percentage.toFixed(1)}%)
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {value.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted mb-4">No milestones added yet</p>
              <Button onClick={handleAdd} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add First Milestone
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
