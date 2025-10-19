# Handover Pack Developer Guide

## Quick Start

### Accessing the Handover Pack
Navigate to `/handover` or click "Handover Pack" in the sidebar navigation.

### URL Parameters
- `projectId` - Optional query parameter to load handover pack for a specific project
- Example: `/handover?projectId=project-123`

## Component Architecture

```
HandoverPackPage (Main Container)
├── AssetSelector
│   ├── Search & Filter
│   ├── Asset List
│   └── Additional Options
├── LoomVideoSelector
│   ├── Video Grid
│   └── Preview Controls
├── GovernanceSelector
│   ├── Template Groups
│   └── Document List
├── RenewalOptions
│   ├── Option Cards
│   └── Pricing Display
├── HandoverPreview (Modal)
│   └── Pack Contents Summary
└── SLABotSetup
    ├── Configuration Form
    └── Business Hours
```

## Data Flow

### 1. Initial Load
```typescript
// Fetch existing pack
useQuery(['handover-pack', projectId])

// Fetch available options in parallel
useQuery(['project-assets', projectId])
useQuery(['project-loom', projectId])
useQuery(['governance-templates'])
useQuery(['renewal-options'])
```

### 2. Create Pack
```typescript
const input: CreateHandoverPackInput = {
  project_id: projectId,
  asset_ids: selectedAssetIds,
  loom_video_ids: selectedLoomIds,
  governance_template_ids: selectedGovernanceIds,
  renewal_option_ids: selectedRenewalIds,
  include_contracts: true,
  include_final_report: true,
};

createHandoverPack(input);
```

### 3. Generate Export
```typescript
generateHandoverPack(handoverPackId, 'zip'); // or 'pdf'
```

### 4. Deliver to Client
```typescript
deliverHandoverPack(handoverPackId, clientEmail);
```

## API Endpoints Reference

### Get Handover Pack
```typescript
GET /handover/project/:projectId
Response: HandoverPack | null
```

### Get Project Assets
```typescript
GET /projects/:projectId/assets
Response: HandoverAsset[]
```

### Get Loom Videos
```typescript
GET /projects/:projectId/loom-videos
Response: LoomVideo[]
```

### Get Governance Templates
```typescript
GET /handover/governance-templates
Response: GovernanceTemplate[]
```

### Get Renewal Options
```typescript
GET /handover/renewal-options
Response: RenewalOption[]
```

### Create Handover Pack
```typescript
POST /handover
Body: CreateHandoverPackInput
Response: HandoverPack
```

### Generate Pack
```typescript
POST /handover/:id/generate
Body: { format: 'zip' | 'pdf' }
Response: { download_url: string }
```

### Deliver Pack
```typescript
POST /handover/:id/deliver
Body: { client_email: string }
Response: { success: boolean; message: string }
```

### Get SLA Bot Config
```typescript
GET /handover/:id/sla-bot
Response: SLABotConfig | null
```

### Update SLA Bot Config
```typescript
PUT /handover/:id/sla-bot
Body: Partial<SLABotConfig>
Response: SLABotConfig
```

## Type Definitions

### HandoverPack
```typescript
interface HandoverPack {
  id: string;
  project_id: string;
  project_name: string;
  client_name: string;
  assets: HandoverAsset[];
  loom_videos: LoomVideo[];
  governance_templates: GovernanceTemplate[];
  renewal_options: RenewalOption[];
  status: 'draft' | 'generating' | 'ready' | 'delivered';
  created_at: string;
  updated_at: string;
  delivered_at?: string;
  download_url?: string;
}
```

### HandoverAsset
```typescript
interface HandoverAsset {
  id: string;
  name: string;
  type: 'document' | 'loom' | 'governance' | 'code' | 'archive' | 'image' | 'other';
  url: string;
  size?: number;
  description?: string;
  selected: boolean;
}
```

### SLABotConfig
```typescript
interface SLABotConfig {
  id: string;
  handover_pack_id: string;
  enabled: boolean;
  response_time_hours: number;
  escalation_email: string;
  support_channels: ('email' | 'chat' | 'phone')[];
  business_hours: {
    start: string;
    end: string;
    timezone: string;
  };
  auto_responses: {
    greeting: string;
    away_message: string;
    escalation_message: string;
  };
}
```

## State Management

### Local State
```typescript
const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
const [selectedLoomIds, setSelectedLoomIds] = useState<string[]>([]);
const [selectedGovernanceIds, setSelectedGovernanceIds] = useState<string[]>([]);
const [selectedRenewalIds, setSelectedRenewalIds] = useState<string[]>([]);
const [includeContracts, setIncludeContracts] = useState(true);
const [includeFinalReport, setIncludeFinalReport] = useState(true);
const [showPreview, setShowPreview] = useState(false);
```

### Server State (React Query)
```typescript
// Queries
const { data: existingPack } = useQuery(['handover-pack', projectId]);
const { data: assets } = useQuery(['project-assets', projectId]);
const { data: loomVideos } = useQuery(['project-loom', projectId]);
const { data: governanceTemplates } = useQuery(['governance-templates']);
const { data: renewalOptions } = useQuery(['renewal-options']);
const { data: slaBotConfig } = useQuery(['sla-bot-config', packId]);

// Mutations
const createPackMutation = useMutation({ mutationFn: createHandoverPack });
const generateMutation = useMutation({ mutationFn: generateHandoverPack });
const deliverMutation = useMutation({ mutationFn: deliverHandoverPack });
const updateSLAMutation = useMutation({ mutationFn: updateSLABotConfig });
```

## Styling Guide

### Colors
```css
/* Backgrounds */
--background: 35 39 47;        /* #23272F */
--card: 44 49 58;              /* #2C313A */
--sidebar: 26 29 35;           /* #1A1D23 */

/* Accents */
--accent-green: 114 212 122;   /* #72D47A */
--accent-blue: 96 180 247;     /* #60B4F7 */
--accent-purple: 185 140 249;  /* #B98CF9 */
--accent-yellow: 255 223 110;  /* #FFDF6E */
--accent-red: 244 122 122;     /* #F47A7A */
```

### Common Classes
```tsx
// Cards
<Card className="bg-card">

// Accent backgrounds
<div className="bg-accent-green/10">

// Status badges
<Badge variant="outline" className="border-accent-green text-accent-green">

// Buttons
<Button className="bg-accent-green text-background hover:bg-accent-green/90">

// Animations
<div className="animate-fade-in-up">
```

## Common Patterns

### Selection Toggle
```typescript
const handleToggle = (id: string) => {
  if (selectedIds.includes(id)) {
    setSelectedIds(selectedIds.filter((i) => i !== id));
  } else {
    setSelectedIds([...selectedIds, id]);
  }
};
```

### Select All
```typescript
const handleSelectAll = () => {
  if (selectedIds.length === items.length) {
    setSelectedIds([]);
  } else {
    setSelectedIds(items.map((item) => item.id));
  }
};
```

### Status Badge
```typescript
const getStatusBadge = (status: string) => {
  const config = {
    draft: { color: 'border-muted text-muted', label: 'Draft' },
    generating: { color: 'border-accent-blue text-accent-blue', label: 'Generating' },
    ready: { color: 'border-accent-green text-accent-green', label: 'Ready' },
    delivered: { color: 'border-accent-purple text-accent-purple', label: 'Delivered' },
  };
  const { color, label } = config[status];
  return <Badge variant="outline" className={color}>{label}</Badge>;
};
```

### Loading State
```typescript
{isLoading ? (
  <Skeleton className="h-12 w-full" />
) : (
  <Content />
)}
```

### Empty State
```typescript
{items.length === 0 ? (
  <div className="text-center py-8">
    <Icon className="h-12 w-12 text-muted mx-auto mb-3" />
    <p className="text-muted">No items available</p>
  </div>
) : (
  <ItemList />
)}
```

## Error Handling

### API Errors
```typescript
try {
  const result = await apiCall();
  toast.success('Operation successful');
} catch (error) {
  toast.error('Operation failed');
  console.error(error);
}
```

### Mutation Errors
```typescript
const mutation = useMutation({
  mutationFn: apiFunction,
  onSuccess: () => {
    queryClient.invalidateQueries(['key']);
    toast.success('Success message');
  },
  onError: () => {
    toast.error('Error message');
  },
});
```

## Testing

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import HandoverPackPage from './HandoverPackPage';

test('renders handover pack page', () => {
  render(<HandoverPackPage />);
  expect(screen.getByText('Handover Pack')).toBeInTheDocument();
});
```

### Mock Data
```typescript
import { useMockHandoverData } from '@/hooks/useMockHandover';

// In development
const { assets, loomVideos, governanceTemplates, renewalOptions } = useMockHandoverData();
```

## Troubleshooting

### Pack Not Loading
1. Check projectId query parameter
2. Verify API endpoint is accessible
3. Check network tab for failed requests
4. Ensure user has proper permissions

### Selection Not Working
1. Verify state updates in React DevTools
2. Check if IDs match between items and selection
3. Ensure click handlers are properly bound

### Export Failing
1. Check handover pack status is 'ready'
2. Verify backend export service is running
3. Check for CORS issues
4. Ensure download URL is valid

### SLA Bot Not Saving
1. Verify handover pack ID exists
2. Check form validation
3. Ensure all required fields are filled
4. Check API response for errors

## Performance Optimization

### Lazy Loading
```typescript
const HandoverPreview = lazy(() => import('./HandoverPreview'));
```

### Memoization
```typescript
const filteredAssets = useMemo(
  () => assets.filter(asset => asset.name.includes(searchQuery)),
  [assets, searchQuery]
);
```

### Debounced Search
```typescript
const debouncedSearch = useMemo(
  () => debounce((query: string) => setSearchQuery(query), 300),
  []
);
```

## Accessibility

### Keyboard Navigation
- Tab through interactive elements
- Enter/Space to select items
- Escape to close modals

### Screen Readers
- Proper ARIA labels on buttons
- Descriptive text for icons
- Status announcements

### Focus Management
- Visible focus indicators
- Focus trap in modals
- Logical tab order

## Best Practices

1. **Always invalidate queries after mutations**
2. **Use loading states for async operations**
3. **Provide user feedback with toasts**
4. **Handle empty states gracefully**
5. **Validate data before submission**
6. **Use TypeScript strictly**
7. **Follow existing patterns**
8. **Keep components focused**
9. **Document complex logic**
10. **Test edge cases**

## Support

For questions or issues:
1. Check this guide first
2. Review the implementation summary
3. Check existing components for patterns
4. Consult the design reference
5. Ask the development team
