import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, User, ExternalLink } from 'lucide-react';
import type { Message } from '@/types/copilot';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 animate-fade-in-up',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            isUser
              ? 'bg-accent-blue/10 text-accent-blue'
              : 'bg-accent-purple/10 text-accent-purple'
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn('flex flex-col gap-2 max-w-[80%]', isUser && 'items-end')}>
        <Card
          className={cn(
            'p-4',
            isUser
              ? 'bg-accent-blue/10 border-accent-blue/20'
              : 'bg-card border-border'
          )}
        >
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>

          {/* Action Badge */}
          {message.metadata?.action && (
            <Badge
              variant="outline"
              className="mt-3 text-xs border-accent-green text-accent-green"
            >
              {message.metadata.action.replace(/_/g, ' ')}
            </Badge>
          )}
        </Card>

        {/* Source Citations */}
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted px-2">Sources:</p>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  size="sm"
                  className="h-auto py-1 px-2 text-xs"
                  onClick={() => source.url && window.open(source.url, '_blank')}
                >
                  <Badge
                    variant="outline"
                    className="mr-1 text-[10px] px-1 py-0"
                  >
                    {source.type}
                  </Badge>
                  {source.title}
                  {source.url && <ExternalLink className="ml-1 h-3 w-3" />}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-muted px-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
