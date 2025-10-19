import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, FileText, Video, Shield, DollarSign, Download, ExternalLink } from 'lucide-react';
import type { HandoverPack } from '@/types/handover';

interface HandoverPreviewProps {
  handoverPack: HandoverPack;
  onClose: () => void;
}

export default function HandoverPreview({ handoverPack, onClose }: HandoverPreviewProps) {
  return (
    <Card className="bg-card animate-scale-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Handover Pack Preview</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Info */}
        <div>
          <h3 className="font-semibold mb-2">Project Information</h3>
          <div className="bg-background rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted">Project Name:</span>
              <span className="font-medium">{handoverPack.project_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Client:</span>
              <span className="font-medium">{handoverPack.client_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Status:</span>
              <Badge variant="outline" className="border-accent-green text-accent-green">
                {handoverPack.status}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Assets */}
        {handoverPack.assets.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-accent-blue" />
              <h3 className="font-semibold">Project Assets</h3>
              <Badge variant="outline">{handoverPack.assets.length}</Badge>
            </div>
            <div className="space-y-2">
              {handoverPack.assets.slice(0, 5).map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted" />
                    <div>
                      <p className="text-sm font-medium">{asset.name}</p>
                      {asset.description && (
                        <p className="text-xs text-muted">{asset.description}</p>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {handoverPack.assets.length > 5 && (
                <p className="text-sm text-muted text-center py-2">
                  +{handoverPack.assets.length - 5} more assets
                </p>
              )}
            </div>
          </div>
        )}

        {/* Loom Videos */}
        {handoverPack.loom_videos.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Video className="h-5 w-5 text-accent-purple" />
                <h3 className="font-semibold">Loom Video Tutorials</h3>
                <Badge variant="outline">{handoverPack.loom_videos.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {handoverPack.loom_videos.slice(0, 4).map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center gap-3 p-3 bg-background rounded-lg"
                  >
                    <div className="rounded bg-card p-2">
                      <Video className="h-4 w-4 text-accent-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{video.title}</p>
                      {video.duration && (
                        <p className="text-xs text-muted">{video.duration}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {handoverPack.loom_videos.length > 4 && (
                <p className="text-sm text-muted text-center py-2">
                  +{handoverPack.loom_videos.length - 4} more videos
                </p>
              )}
            </div>
          </>
        )}

        {/* Governance */}
        {handoverPack.governance_templates.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-accent-green" />
                <h3 className="font-semibold">Governance Documents</h3>
                <Badge variant="outline">{handoverPack.governance_templates.length}</Badge>
              </div>
              <div className="space-y-2">
                {handoverPack.governance_templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-3 bg-background rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-muted" />
                      <div>
                        <p className="text-sm font-medium">{template.name}</p>
                        <Badge variant="outline" className="text-xs mt-1 capitalize">
                          {template.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Renewal Options */}
        {handoverPack.renewal_options.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-accent-yellow" />
                <h3 className="font-semibold">Renewal Options</h3>
                <Badge variant="outline">{handoverPack.renewal_options.length}</Badge>
              </div>
              <div className="space-y-2">
                {handoverPack.renewal_options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between p-3 bg-background rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{option.title}</p>
                      <p className="text-xs text-muted">{option.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        ${option.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted">{option.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <Separator />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close Preview
          </Button>
          {handoverPack.download_url && (
            <Button
              className="flex-1 bg-accent-green text-background hover:bg-accent-green/90"
              onClick={() => window.open(handoverPack.download_url, '_blank')}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Pack
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
