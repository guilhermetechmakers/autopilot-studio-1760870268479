import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIAssistantWidgetProps {
  taskTitle: string;
  taskDescription: string;
  onAcceptSuggestions: (suggestions: string[]) => void;
  onClose?: () => void;
}

export default function AIAssistantWidget({
  taskTitle,
  taskDescription,
  onAcceptSuggestions,
  onClose,
}: AIAssistantWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set());

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    
    // Simulate AI API call
    setTimeout(() => {
      const mockSuggestions = [
        'User can successfully authenticate with valid credentials',
        'System displays appropriate error messages for invalid inputs',
        'All form fields are properly validated before submission',
        'User receives confirmation feedback upon successful completion',
        'Feature works correctly across different browsers and devices',
      ];
      setSuggestions(mockSuggestions);
      setSelectedSuggestions(new Set(mockSuggestions.map((_, i) => i)));
      setIsLoading(false);
    }, 2000);
  };

  const handleGenerateWithPrompt = async () => {
    if (!customPrompt.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI API call with custom prompt
    setTimeout(() => {
      const mockSuggestions = [
        `Custom criteria based on: ${customPrompt}`,
        'System validates all edge cases',
        'Performance meets specified requirements',
      ];
      setSuggestions(mockSuggestions);
      setSelectedSuggestions(new Set(mockSuggestions.map((_, i) => i)));
      setIsLoading(false);
    }, 2000);
  };

  const toggleSuggestion = (index: number) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedSuggestions(newSelected);
  };

  const handleAccept = () => {
    const selected = suggestions.filter((_, i) => selectedSuggestions.has(i));
    onAcceptSuggestions(selected);
  };

  return (
    <Card className="bg-gradient-to-br from-accent-purple/5 to-accent-blue/5 border-accent-purple/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="rounded-lg bg-accent-purple/10 p-2">
              <Sparkles className="h-5 w-5 text-accent-purple" />
            </div>
            AI Assistant
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Task Context */}
        <div className="p-3 rounded-lg bg-card/50 border border-border">
          <p className="text-sm font-medium mb-1">{taskTitle}</p>
          {taskDescription && (
            <p className="text-xs text-muted line-clamp-2">{taskDescription}</p>
          )}
        </div>

        {/* Generate Buttons */}
        {suggestions.length === 0 && (
          <div className="space-y-3">
            <Button
              onClick={handleGenerateSuggestions}
              disabled={isLoading}
              className="w-full bg-accent-purple hover:bg-accent-purple/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Acceptance Criteria
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted">Or customize</span>
              </div>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Describe specific requirements or focus areas..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[80px]"
              />
              <Button
                onClick={handleGenerateWithPrompt}
                disabled={isLoading || !customPrompt.trim()}
                variant="outline"
                className="w-full"
              >
                Generate with Custom Prompt
              </Button>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Suggested Criteria</p>
              <Badge variant="outline" className="bg-accent-purple/10 text-accent-purple">
                {selectedSuggestions.size} selected
              </Badge>
            </div>

            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => toggleSuggestion(index)}
                  className={cn(
                    'p-3 rounded-lg border cursor-pointer transition-all duration-200',
                    selectedSuggestions.has(index)
                      ? 'bg-accent-purple/10 border-accent-purple'
                      : 'bg-card border-border hover:border-accent-purple/50'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={cn(
                        'mt-0.5 h-4 w-4 rounded border flex items-center justify-center transition-colors',
                        selectedSuggestions.has(index)
                          ? 'bg-accent-purple border-accent-purple'
                          : 'border-border'
                      )}
                    >
                      {selectedSuggestions.has(index) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <p className="text-sm flex-1">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAccept}
                disabled={selectedSuggestions.size === 0}
                className="flex-1 bg-accent-purple hover:bg-accent-purple/90"
              >
                <Check className="mr-2 h-4 w-4" />
                Accept Selected ({selectedSuggestions.size})
              </Button>
              <Button
                onClick={() => {
                  setSuggestions([]);
                  setSelectedSuggestions(new Set());
                  setCustomPrompt('');
                }}
                variant="outline"
              >
                Regenerate
              </Button>
            </div>
          </div>
        )}

        {/* Info */}
        <p className="text-xs text-muted text-center">
          AI suggestions are based on task context and best practices
        </p>
      </CardContent>
    </Card>
  );
}
