import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, HelpCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AISuggestion, AIQuestion } from '@/types/intake';

interface AIAssistantPanelProps {
  suggestions: AISuggestion[];
  questions: AIQuestion[];
  isLoading?: boolean;
  onApplySuggestion: (suggestion: AISuggestion) => void;
  onAnswerQuestion: (question: AIQuestion, answer: string) => void;
  onRequestSuggestions: (field: string) => void;
}

export function AIAssistantPanel({
  suggestions,
  questions,
  isLoading,
  onApplySuggestion,
  onAnswerQuestion,
}: AIAssistantPanelProps) {
  const [answeringQuestion, setAnsweringQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');

  const handleAnswerSubmit = (question: AIQuestion) => {
    if (answer.trim()) {
      onAnswerQuestion(question, answer);
      setAnsweringQuestion(null);
      setAnswer('');
    }
  };

  const unansweredQuestions = questions.filter(q => !q.answered);
  const unappliedSuggestions = suggestions.filter(s => !s.applied);

  return (
    <Card className="bg-card border-border sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-accent-purple" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing your input...</span>
          </div>
        )}

        {/* AI Questions */}
        {unansweredQuestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-accent-blue" />
              <h4 className="text-sm font-medium">Clarifying Questions</h4>
            </div>
            {unansweredQuestions.map((question) => (
              <div
                key={question.id}
                className="p-3 bg-background rounded-lg border border-border space-y-2"
              >
                <p className="text-sm text-secondary">{question.question}</p>
                {answeringQuestion === question.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={2}
                      placeholder="Your answer..."
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAnswerSubmit(question)}
                        className="bg-accent-green hover:bg-accent-green/90"
                      >
                        Submit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setAnsweringQuestion(null);
                          setAnswer('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAnsweringQuestion(question.id)}
                    className="text-xs"
                  >
                    Answer
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* AI Suggestions */}
        {unappliedSuggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-yellow" />
              <h4 className="text-sm font-medium">Suggestions</h4>
            </div>
            {unappliedSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-3 bg-background rounded-lg border border-border space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-secondary flex-1">{suggestion.suggestion}</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      suggestion.confidence >= 0.8 && 'border-accent-green text-accent-green',
                      suggestion.confidence >= 0.6 && suggestion.confidence < 0.8 && 'border-accent-yellow text-accent-yellow',
                      suggestion.confidence < 0.6 && 'border-accent-red text-accent-red'
                    )}
                  >
                    {Math.round(suggestion.confidence * 100)}%
                  </Badge>
                </div>
                {suggestion.reasoning && (
                  <p className="text-xs text-muted">{suggestion.reasoning}</p>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onApplySuggestion(suggestion)}
                  className="text-xs"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Apply
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && unansweredQuestions.length === 0 && unappliedSuggestions.length === 0 && (
          <div className="text-center py-6 text-sm text-muted">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-muted" />
            <p>AI assistant is ready to help.</p>
            <p className="text-xs mt-1">Fill in the form to get suggestions.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
