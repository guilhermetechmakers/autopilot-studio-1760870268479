import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useMockCopilot } from '@/hooks/useMockCopilot';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ChatMessage } from '@/components/copilot/ChatMessage';
import { ActionButtons } from '@/components/copilot/ActionButtons';
import { ContextPanel } from '@/components/copilot/ContextPanel';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, Loader2, Save, Sparkles, RotateCcw } from 'lucide-react';
import type { Message, CopilotAction } from '@/types/copilot';

export default function AICopilotPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'project-1';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedAction, setSelectedAction] = useState<CopilotAction | undefined>();
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use mock data for development
  const { generateResponse, mockContext } = useMockCopilot();
  const context = projectId ? mockContext : null;
  const isLoadingHistory = false;
  const isLoadingContext = false;

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Send message handler
  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      metadata: selectedAction ? { action: selectedAction } : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    const currentAction = selectedAction;
    setSelectedAction(undefined);
    setIsStreaming(true);

    try {
      // Simulate streaming by showing response character by character
      const response = await generateResponse(content, currentAction);
      
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        sources: currentAction ? [
          {
            type: 'repo',
            title: 'ProductCard.tsx',
            excerpt: 'Product card component implementation',
          },
          {
            type: 'proposal',
            title: 'E-commerce Platform Development',
            excerpt: 'Main project proposal and scope',
          },
        ] : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Simulate streaming effect
      const words = response.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 30));
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: words.slice(0, i + 1).join(' '),
                }
              : msg
          )
        );
      }
    } catch (error) {
      toast.error('Failed to get response from AI Copilot');
      console.error(error);
    } finally {
      setIsStreaming(false);
    }
  };

  // Save conversation handler
  const handleSaveConversation = () => {
    if (!projectId || messages.length === 0) return;
    toast.success('Conversation saved successfully');
  };

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    handleSendMessage(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActionSelect = (action: CopilotAction) => {
    setSelectedAction(action);
    textareaRef.current?.focus();
  };

  const handleClearConversation = () => {
    setMessages([]);
    setSelectedAction(undefined);
    toast.success('Conversation cleared');
  };

  const handleProjectChange = (value: string) => {
    setSearchParams({ projectId: value });
    setMessages([]);
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent-purple/10 p-2">
              <Sparkles className="h-6 w-6 text-accent-purple" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Copilot</h1>
              <p className="text-sm text-muted">
                Context-aware assistant for specs, tickets, and feedback
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={projectId} onValueChange={handleProjectChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project-1">E-commerce Platform</SelectItem>
                <SelectItem value="project-2">Mobile App Redesign</SelectItem>
                <SelectItem value="project-3">CRM Dashboard</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearConversation}
              disabled={messages.length === 0}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveConversation}
              disabled={!projectId || messages.length === 0}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          {/* Chat Area */}
          <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
            {/* Action Buttons */}
            <Card className="p-4 bg-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Quick Actions</h3>
                {selectedAction && (
                  <Badge variant="outline" className="text-xs border-accent-green text-accent-green">
                    {selectedAction.replace(/_/g, ' ')}
                  </Badge>
                )}
              </div>
              <ActionButtons
                onActionSelect={handleActionSelect}
                disabled={isStreaming}
              />
            </Card>

            {/* Messages */}
            <Card className="flex-1 flex flex-col bg-card min-h-0">
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-accent-purple" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="rounded-full bg-accent-purple/10 p-4 mb-4">
                      <Sparkles className="h-8 w-8 text-accent-purple" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Welcome to AI Copilot
                    </h3>
                    <p className="text-sm text-muted max-w-md">
                      Start a conversation or select a quick action above. I can help
                      you draft specs, create tickets, summarize meetings, and more.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    {isStreaming && (
                      <div className="flex items-center gap-2 text-muted">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              <Separator />

              {/* Input Area */}
              <div className="p-4">
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything or describe what you need..."
                    className="min-h-[60px] max-h-[200px] resize-none"
                    disabled={isStreaming}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isStreaming}
                    className="bg-accent-green text-background hover:bg-accent-green/90"
                  >
                    {isStreaming ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </Card>
          </div>

          {/* Context Panel */}
          <div className="min-h-0">
            <ContextPanel context={context || null} isLoading={isLoadingContext} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
