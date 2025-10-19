import { useQuery } from '@tanstack/react-query';
import type {
  HandoverAsset,
  LoomVideo,
  GovernanceTemplate,
  RenewalOption,
} from '@/types/handover';

// Mock data for development
const mockAssets: HandoverAsset[] = [
  {
    id: 'asset-1',
    name: 'Project Documentation.pdf',
    type: 'document',
    url: 'https://example.com/docs.pdf',
    size: 2048000,
    description: 'Complete project documentation and technical specs',
    selected: false,
  },
  {
    id: 'asset-2',
    name: 'API Documentation.md',
    type: 'document',
    url: 'https://example.com/api-docs.md',
    size: 512000,
    description: 'API endpoints and integration guide',
    selected: false,
  },
  {
    id: 'asset-3',
    name: 'Source Code Archive',
    type: 'code',
    url: 'https://github.com/example/repo',
    size: 10240000,
    description: 'Complete source code repository',
    selected: false,
  },
  {
    id: 'asset-4',
    name: 'Design Assets.zip',
    type: 'archive',
    url: 'https://example.com/designs.zip',
    size: 5120000,
    description: 'UI/UX design files and assets',
    selected: false,
  },
  {
    id: 'asset-5',
    name: 'Database Schema.sql',
    type: 'code',
    url: 'https://example.com/schema.sql',
    size: 256000,
    description: 'Database schema and migrations',
    selected: false,
  },
];

const mockLoomVideos: LoomVideo[] = [
  {
    id: 'loom-1',
    title: 'Project Overview and Architecture',
    url: 'https://loom.com/video/1',
    thumbnail: 'https://via.placeholder.com/640x360',
    duration: '12:34',
    description: 'High-level overview of the project architecture and key components',
  },
  {
    id: 'loom-2',
    title: 'Admin Dashboard Walkthrough',
    url: 'https://loom.com/video/2',
    thumbnail: 'https://via.placeholder.com/640x360',
    duration: '8:45',
    description: 'Step-by-step guide to using the admin dashboard',
  },
  {
    id: 'loom-3',
    title: 'API Integration Tutorial',
    url: 'https://loom.com/video/3',
    thumbnail: 'https://via.placeholder.com/640x360',
    duration: '15:20',
    description: 'How to integrate with the API and authentication flow',
  },
  {
    id: 'loom-4',
    title: 'Deployment and Configuration',
    url: 'https://loom.com/video/4',
    thumbnail: 'https://via.placeholder.com/640x360',
    duration: '10:15',
    description: 'Deployment process and environment configuration',
  },
];

const mockGovernanceTemplates: GovernanceTemplate[] = [
  {
    id: 'gov-1',
    name: 'Service Level Agreement (SLA)',
    type: 'sla',
    description: 'Standard SLA defining response times and service commitments',
    content: 'SLA content...',
    selected: false,
  },
  {
    id: 'gov-2',
    name: 'Support & Maintenance Agreement',
    type: 'support',
    description: 'Terms for ongoing support and maintenance services',
    content: 'Support agreement content...',
    selected: false,
  },
  {
    id: 'gov-3',
    name: 'Security Policy',
    type: 'security',
    description: 'Security protocols and data protection policies',
    content: 'Security policy content...',
    selected: false,
  },
  {
    id: 'gov-4',
    name: 'Compliance Documentation',
    type: 'compliance',
    description: 'GDPR, SOC2, and other compliance documentation',
    content: 'Compliance docs content...',
    selected: false,
  },
  {
    id: 'gov-5',
    name: 'Maintenance Schedule',
    type: 'maintenance',
    description: 'Regular maintenance windows and update procedures',
    content: 'Maintenance schedule content...',
    selected: false,
  },
];

const mockRenewalOptions: RenewalOption[] = [
  {
    id: 'renewal-1',
    title: 'Basic Support Package',
    description: 'Email support with 48-hour response time',
    price: 500,
    duration: 'month',
    type: 'support',
    features: [
      'Email support (48h response)',
      'Bug fixes and patches',
      'Monthly status reports',
      'Security updates',
    ],
  },
  {
    id: 'renewal-2',
    title: 'Premium Support Package',
    description: 'Priority support with 24-hour response time',
    price: 1500,
    duration: 'month',
    type: 'support',
    features: [
      'Priority email & chat support (24h response)',
      'Bug fixes and patches',
      'Weekly status reports',
      'Security updates',
      'Monthly strategy calls',
    ],
  },
  {
    id: 'renewal-3',
    title: 'Maintenance & Updates',
    description: 'Regular maintenance and feature updates',
    price: 2000,
    duration: 'month',
    type: 'maintenance',
    features: [
      'Regular maintenance windows',
      'Feature updates and improvements',
      'Performance optimization',
      'Database maintenance',
      'Backup management',
    ],
  },
  {
    id: 'renewal-4',
    title: 'Enhancement Package',
    description: 'New features and custom development',
    price: 5000,
    duration: 'month',
    type: 'enhancement',
    features: [
      '20 hours of development time',
      'New feature development',
      'Custom integrations',
      'UI/UX improvements',
      'Priority implementation',
    ],
  },
  {
    id: 'renewal-5',
    title: 'Training & Onboarding',
    description: 'Team training and knowledge transfer',
    price: 3000,
    duration: 'one-time',
    type: 'training',
    features: [
      '4 hours of live training',
      'Custom training materials',
      'Video tutorials',
      'Documentation walkthrough',
      'Q&A sessions',
    ],
  },
];

// Hook to use mock data in development
export function useMockHandoverData() {
  const assets = useQuery({
    queryKey: ['mock-assets'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockAssets;
    },
  });

  const loomVideos = useQuery({
    queryKey: ['mock-loom'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockLoomVideos;
    },
  });

  const governanceTemplates = useQuery({
    queryKey: ['mock-governance'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockGovernanceTemplates;
    },
  });

  const renewalOptions = useQuery({
    queryKey: ['mock-renewals'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockRenewalOptions;
    },
  });

  return {
    assets,
    loomVideos,
    governanceTemplates,
    renewalOptions,
  };
}
