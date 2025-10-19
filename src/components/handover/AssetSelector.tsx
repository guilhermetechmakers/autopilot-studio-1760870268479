import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, File, Code, Image, FileArchive, Search } from 'lucide-react';
import { useState } from 'react';
import type { HandoverAsset } from '@/types/handover';
import { cn } from '@/lib/utils';

interface AssetSelectorProps {
  assets: HandoverAsset[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  includeContracts: boolean;
  onIncludeContractsChange: (value: boolean) => void;
  includeFinalReport: boolean;
  onIncludeFinalReportChange: (value: boolean) => void;
}

export default function AssetSelector({
  assets,
  selectedIds,
  onSelectionChange,
  includeContracts,
  onIncludeContractsChange,
  includeFinalReport,
  onIncludeFinalReportChange,
}: AssetSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'document':
        return FileText;
      case 'code':
        return Code;
      case 'image':
        return Image;
      case 'archive':
        return FileArchive;
      default:
        return File;
    }
  };

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'text-accent-blue';
      case 'code':
        return 'text-accent-green';
      case 'image':
        return 'text-accent-purple';
      case 'archive':
        return 'text-accent-yellow';
      default:
        return 'text-muted';
    }
  };

  const handleToggleAsset = (assetId: string) => {
    if (selectedIds.includes(assetId)) {
      onSelectionChange(selectedIds.filter((id) => id !== assetId));
    } else {
      onSelectionChange([...selectedIds, assetId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredAssets.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredAssets.map((asset) => asset.id));
    }
  };

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Project Assets</CardTitle>
              <CardDescription>
                Select assets to include in the handover pack
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedIds.length === filteredAssets.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Options */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-base">Additional Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="contracts"
              checked={includeContracts}
              onCheckedChange={(checked) => onIncludeContractsChange(checked as boolean)}
            />
            <label
              htmlFor="contracts"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Include signed contracts and legal documents
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="report"
              checked={includeFinalReport}
              onCheckedChange={(checked) => onIncludeFinalReportChange(checked as boolean)}
            />
            <label
              htmlFor="report"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Include final project report and P&L summary
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Assets List */}
      <Card className="bg-card">
        <CardContent className="pt-6">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted mx-auto mb-3" />
              <p className="text-muted">
                {searchQuery ? 'No assets found matching your search' : 'No assets available'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAssets.map((asset) => {
                const Icon = getAssetIcon(asset.type);
                const isSelected = selectedIds.includes(asset.id);

                return (
                  <div
                    key={asset.id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer hover:bg-background/50',
                      isSelected
                        ? 'border-accent-green bg-accent-green/5'
                        : 'border-border bg-background'
                    )}
                    onClick={() => handleToggleAsset(asset.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleAsset(asset.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div
                      className={cn(
                        'rounded-lg p-2',
                        isSelected ? 'bg-accent-green/10' : 'bg-card'
                      )}
                    >
                      <Icon className={cn('h-5 w-5', getAssetTypeColor(asset.type))} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{asset.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {asset.type}
                        </Badge>
                      </div>
                      {asset.description && (
                        <p className="text-sm text-muted truncate">{asset.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted">{formatFileSize(asset.size)}</p>
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
                asset{selectedIds.length !== 1 ? 's' : ''} selected
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
