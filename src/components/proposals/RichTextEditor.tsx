import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Undo,
  Redo,
  Type,
  Sparkles,
  Loader2,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  showAISuggestions?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  className,
  minHeight = '300px',
  showAISuggestions = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const handleFormat = useCallback((format: string) => {
    switch (format) {
      case 'bold':
        execCommand('bold');
        break;
      case 'italic':
        execCommand('italic');
        break;
      case 'underline':
        execCommand('underline');
        break;
      case 'ul':
        execCommand('insertUnorderedList');
        break;
      case 'ol':
        execCommand('insertOrderedList');
        break;
      case 'alignLeft':
        execCommand('justifyLeft');
        break;
      case 'alignCenter':
        execCommand('justifyCenter');
        break;
      case 'alignRight':
        execCommand('justifyRight');
        break;
      case 'undo':
        execCommand('undo');
        break;
      case 'redo':
        execCommand('redo');
        break;
      case 'h1':
        execCommand('formatBlock', '<h1>');
        break;
      case 'h2':
        execCommand('formatBlock', '<h2>');
        break;
      case 'h3':
        execCommand('formatBlock', '<h3>');
        break;
      case 'p':
        execCommand('formatBlock', '<p>');
        break;
    }
  }, [execCommand]);

  const handleLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  const handleImage = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  }, [execCommand]);

  const handleAISuggest = useCallback(async () => {
    setIsLoadingAI(true);
    setShowAIPanel(true);

    try {
      // Simulate AI suggestion generation
      // In production, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const suggestions = [
        'We are excited to present this comprehensive proposal that outlines our approach to delivering exceptional results for your project.',
        'Our team brings extensive experience in this domain, having successfully completed similar projects for leading organizations.',
        'This proposal details our methodology, timeline, and deliverables to ensure we meet and exceed your expectations.',
      ];

      setAiSuggestions(suggestions);
      toast.success('AI suggestions generated');
    } catch (error) {
      toast.error('Failed to generate AI suggestions');
      setShowAIPanel(false);
    } finally {
      setIsLoadingAI(false);
    }
  }, []);

  const handleApplySuggestion = useCallback((suggestion: string) => {
    if (editorRef.current) {
      const currentContent = editorRef.current.innerHTML;
      const newContent = currentContent ? `${currentContent}<p>${suggestion}</p>` : `<p>${suggestion}</p>`;
      editorRef.current.innerHTML = newContent;
      onChange(newContent);
      toast.success('Suggestion applied');
    }
  }, [onChange]);

  const handleDismissSuggestion = useCallback((index: number) => {
    setAiSuggestions(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className={cn('grid gap-4', showAISuggestions && showAIPanel ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1', className)}>
      {/* Editor */}
      <div className={cn('border border-border rounded-lg overflow-hidden', showAISuggestions && showAIPanel ? 'lg:col-span-2' : '')}>
        {/* Toolbar */}
        <div className="bg-card border-b border-border p-2 flex flex-wrap gap-1">
        {/* Text formatting */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormat('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormat('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormat('underline')}
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Headings */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => handleFormat('h1')}
            title="Heading 1"
          >
            H1
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => handleFormat('h2')}
            title="Heading 2"
          >
            H2
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => handleFormat('h3')}
            title="Heading 3"
          >
            H3
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormat('p')}
            title="Paragraph"
          >
            <Type className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Lists */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormat('ul')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormat('ol')}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Alignment */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormat('alignLeft')}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormat('alignCenter')}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormat('alignRight')}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Insert */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleLink}
            title="Insert Link"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleImage}
            title="Insert Image"
          >
            <Image className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormat('undo')}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormat('redo')}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {showAISuggestions && (
          <>
            <Separator orientation="vertical" className="h-8" />

            {/* AI Suggestions */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-3"
              onClick={handleAISuggest}
              disabled={isLoadingAI}
              title="Get AI Suggestions"
            >
              {isLoadingAI ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              AI Suggest
            </Button>
          </>
        )}
      </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'p-4 prose prose-invert max-w-none focus:outline-none',
            'bg-background text-foreground',
            isFocused && 'ring-1 ring-ring',
            !editorRef.current?.textContent && 'empty:before:content-[attr(data-placeholder)] empty:before:text-muted'
          )}
          style={{ minHeight }}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
      </div>

      {/* AI Suggestions Panel */}
      {showAISuggestions && showAIPanel && (
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-yellow" />
                AI Suggestions
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowAIPanel(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-3">
              {isLoadingAI ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted">Generating suggestions...</p>
                </div>
              ) : aiSuggestions.length > 0 ? (
                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="group p-3 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 space-y-3"
                    >
                      <p className="text-sm text-secondary leading-relaxed">{suggestion}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleApplySuggestion(suggestion)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Apply
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDismissSuggestion(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <Sparkles className="h-12 w-12 text-muted mx-auto" />
                  <p className="text-sm text-muted">
                    Click "AI Suggest" to generate content suggestions
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
