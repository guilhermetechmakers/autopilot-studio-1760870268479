export interface HandoverAsset {
  id: string;
  name: string;
  type: 'document' | 'loom' | 'governance' | 'code' | 'archive' | 'image' | 'other';
  url: string;
  size?: number;
  description?: string;
  selected: boolean;
}

export interface LoomVideo {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  duration?: string;
  description?: string;
}

export interface GovernanceTemplate {
  id: string;
  name: string;
  type: 'sla' | 'support' | 'maintenance' | 'security' | 'compliance';
  description: string;
  content: string;
  selected: boolean;
}

export interface RenewalOption {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  type: 'support' | 'maintenance' | 'enhancement' | 'training';
}

export interface HandoverPack {
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

export interface CreateHandoverPackInput {
  project_id: string;
  asset_ids: string[];
  loom_video_ids: string[];
  governance_template_ids: string[];
  renewal_option_ids: string[];
  include_contracts: boolean;
  include_final_report: boolean;
}

export interface SLABotConfig {
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
