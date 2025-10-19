import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Video, Search, Play, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { LoomVideo } from '@/types/handover';
import { cn } from '@/lib/utils';

interface LoomVideoSelectorProps {
  videos: LoomVideo[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export default function LoomVideoSelector({
  videos,
  selectedIds,
  onSelectionChange,
}: LoomVideoSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleVideo = (videoId: string) => {
    if (selectedIds.includes(videoId)) {
      onSelectionChange(selectedIds.filter((id) => id !== videoId));
    } else {
      onSelectionChange([...selectedIds, videoId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredVideos.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredVideos.map((video) => video.id));
    }
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Loom Video Tutorials</CardTitle>
              <CardDescription>
                Select video tutorials to include in the handover pack
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={filteredVideos.length === 0}
            >
              {selectedIds.length === filteredVideos.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Videos Grid */}
      <Card className="bg-card">
        <CardContent className="pt-6">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-8">
              <Video className="h-12 w-12 text-muted mx-auto mb-3" />
              <p className="text-muted">
                {searchQuery ? 'No videos found matching your search' : 'No Loom videos available'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVideos.map((video) => {
                const isSelected = selectedIds.includes(video.id);

                return (
                  <div
                    key={video.id}
                    className={cn(
                      'rounded-lg border transition-all overflow-hidden',
                      isSelected
                        ? 'border-accent-green bg-accent-green/5'
                        : 'border-border bg-background'
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-card group cursor-pointer">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-12 w-12 text-muted" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(video.url, '_blank')}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Play
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(video.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-accent-green rounded-full p-1">
                          <Play className="h-3 w-3 text-background" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleVideo(video.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium mb-1 line-clamp-2">{video.title}</h4>
                          {video.description && (
                            <p className="text-sm text-muted line-clamp-2 mb-2">
                              {video.description}
                            </p>
                          )}
                          {video.duration && (
                            <p className="text-xs text-muted">{video.duration}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {selectedIds.length > 0 && (
        <Card className="bg-accent-green/5 border-accent-green/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                <span className="font-semibold text-accent-green">{selectedIds.length}</span>{' '}
                video{selectedIds.length !== 1 ? 's' : ''} selected
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
