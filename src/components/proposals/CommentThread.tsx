import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/templateEngine';
import type { ProposalComment } from '@/types/proposal';

interface CommentThreadProps {
  comments: ProposalComment[];
  onAddComment: (content: string, section?: string) => void;
  onDeleteComment?: (commentId: string) => void;
  currentUserId?: string;
  section?: string;
}

export function CommentThread({
  comments,
  onAddComment,
  onDeleteComment,
  currentUserId,
  section,
}: CommentThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment, section);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredComments = section
    ? comments.filter(c => c.section === section)
    : comments;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments
          {filteredComments.length > 0 && (
            <Badge variant="secondary">{filteredComments.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comments list */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 p-3 rounded-lg border border-border hover:bg-card/50 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {comment.user_name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{comment.user_name}</p>
                      <p className="text-xs text-muted">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                    {onDeleteComment && currentUserId === comment.user_id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <p className="text-sm text-secondary leading-relaxed">
                    {comment.content}
                  </p>

                  {comment.section && (
                    <Badge variant="outline" className="text-xs">
                      {comment.section}
                    </Badge>
                  )}
                </div>
              </div>
            ))}

            {filteredComments.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted mx-auto mb-4" />
                <p className="text-muted">No comments yet</p>
                <p className="text-sm text-muted mt-1">
                  Be the first to add a comment
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Add comment */}
        <div className="space-y-3 pt-4 border-t border-border">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
