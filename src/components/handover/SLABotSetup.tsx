import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Bot, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { updateSLABotConfig } from '@/api/handover';
import type { SLABotConfig } from '@/types/handover';

interface SLABotSetupProps {
  handoverPackId?: string;
  config: SLABotConfig | null;
}

export default function SLABotSetup({ handoverPackId, config }: SLABotSetupProps) {
  const queryClient = useQueryClient();
  const [enabled, setEnabled] = useState(config?.enabled ?? false);
  const [responseTime, setResponseTime] = useState(config?.response_time_hours ?? 24);
  const [escalationEmail, setEscalationEmail] = useState(config?.escalation_email ?? '');
  const [supportChannels, setSupportChannels] = useState<('email' | 'chat' | 'phone')[]>(
    config?.support_channels ?? ['email']
  );
  const [businessHoursStart, setBusinessHoursStart] = useState(
    config?.business_hours.start ?? '09:00'
  );
  const [businessHoursEnd, setBusinessHoursEnd] = useState(
    config?.business_hours.end ?? '17:00'
  );
  const [timezone, setTimezone] = useState(config?.business_hours.timezone ?? 'UTC');
  const [greeting, setGreeting] = useState(
    config?.auto_responses.greeting ??
      'Thank you for contacting support. How can we help you today?'
  );
  const [awayMessage, setAwayMessage] = useState(
    config?.auto_responses.away_message ??
      'We are currently outside business hours. We will respond to your message as soon as possible.'
  );
  const [escalationMessage, setEscalationMessage] = useState(
    config?.auto_responses.escalation_message ??
      'Your request has been escalated to our senior support team. They will contact you shortly.'
  );

  useEffect(() => {
    if (config) {
      setEnabled(config.enabled);
      setResponseTime(config.response_time_hours);
      setEscalationEmail(config.escalation_email);
      setSupportChannels(config.support_channels);
      setBusinessHoursStart(config.business_hours.start);
      setBusinessHoursEnd(config.business_hours.end);
      setTimezone(config.business_hours.timezone);
      setGreeting(config.auto_responses.greeting);
      setAwayMessage(config.auto_responses.away_message);
      setEscalationMessage(config.auto_responses.escalation_message);
    }
  }, [config]);

  const updateConfigMutation = useMutation({
    mutationFn: (data: Partial<SLABotConfig>) => {
      if (!handoverPackId) throw new Error('No handover pack ID');
      return updateSLABotConfig(handoverPackId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sla-bot-config', handoverPackId] });
      toast.success('SLA bot configuration saved successfully');
    },
    onError: () => {
      toast.error('Failed to save SLA bot configuration');
    },
  });

  const handleSave = () => {
    const configData: Partial<SLABotConfig> = {
      enabled,
      response_time_hours: responseTime,
      escalation_email: escalationEmail,
      support_channels: supportChannels,
      business_hours: {
        start: businessHoursStart,
        end: businessHoursEnd,
        timezone,
      },
      auto_responses: {
        greeting,
        away_message: awayMessage,
        escalation_message: escalationMessage,
      },
    };

    updateConfigMutation.mutate(configData);
  };

  const handleChannelToggle = (channel: 'email' | 'chat' | 'phone') => {
    if (supportChannels.includes(channel)) {
      setSupportChannels(supportChannels.filter((c) => c !== channel));
    } else {
      setSupportChannels([...supportChannels, channel]);
    }
  };

  if (!handoverPackId) {
    return (
      <Card className="bg-card">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted mx-auto mb-3" />
            <p className="text-muted">
              Create a handover pack first to configure the SLA bot
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent-purple/10 p-2">
                <Bot className="h-5 w-5 text-accent-purple" />
              </div>
              <div>
                <CardTitle>SLA Bot Configuration</CardTitle>
                <CardDescription>
                  Set up automated support and SLA management
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="bot-enabled" className="text-sm">
                Enable Bot
              </Label>
              <Switch id="bot-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Status */}
      {config && (
        <Card className={enabled ? 'bg-accent-green/5 border-accent-green/20' : 'bg-card'}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              {enabled ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-accent-green" />
                  <span className="font-medium text-accent-green">SLA Bot is active</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-muted" />
                  <span className="font-medium text-muted">SLA Bot is disabled</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Settings */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-base">Basic Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="response-time">Response Time (hours)</Label>
            <Input
              id="response-time"
              type="number"
              min="1"
              max="72"
              value={responseTime}
              onChange={(e) => setResponseTime(parseInt(e.target.value))}
              disabled={!enabled}
            />
            <p className="text-xs text-muted">
              Maximum time to respond to support requests
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="escalation-email">Escalation Email</Label>
            <Input
              id="escalation-email"
              type="email"
              placeholder="support@example.com"
              value={escalationEmail}
              onChange={(e) => setEscalationEmail(e.target.value)}
              disabled={!enabled}
            />
            <p className="text-xs text-muted">
              Email address for escalated support requests
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Support Channels */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-base">Support Channels</CardTitle>
          <CardDescription>Select available support channels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="channel-email"
              checked={supportChannels.includes('email')}
              onCheckedChange={() => handleChannelToggle('email')}
              disabled={!enabled}
            />
            <label
              htmlFor="channel-email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Email Support
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="channel-chat"
              checked={supportChannels.includes('chat')}
              onCheckedChange={() => handleChannelToggle('chat')}
              disabled={!enabled}
            />
            <label
              htmlFor="channel-chat"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Live Chat
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="channel-phone"
              checked={supportChannels.includes('phone')}
              onCheckedChange={() => handleChannelToggle('phone')}
              disabled={!enabled}
            />
            <label
              htmlFor="channel-phone"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Phone Support
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-base">Business Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={businessHoursStart}
                onChange={(e) => setBusinessHoursStart(e.target.value)}
                disabled={!enabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={businessHoursEnd}
                onChange={(e) => setBusinessHoursEnd(e.target.value)}
                disabled={!enabled}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              type="text"
              placeholder="UTC"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              disabled={!enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Auto Responses */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-base">Automated Responses</CardTitle>
          <CardDescription>Customize automated messages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="greeting">Greeting Message</Label>
            <Textarea
              id="greeting"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              disabled={!enabled}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="away">Away Message</Label>
            <Textarea
              id="away"
              value={awayMessage}
              onChange={(e) => setAwayMessage(e.target.value)}
              disabled={!enabled}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="escalation">Escalation Message</Label>
            <Textarea
              id="escalation"
              value={escalationMessage}
              onChange={(e) => setEscalationMessage(e.target.value)}
              disabled={!enabled}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card className="bg-card">
        <CardContent className="pt-6">
          <Button
            onClick={handleSave}
            disabled={updateConfigMutation.isPending || !enabled}
            className="w-full bg-accent-green text-background hover:bg-accent-green/90"
          >
            {updateConfigMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
