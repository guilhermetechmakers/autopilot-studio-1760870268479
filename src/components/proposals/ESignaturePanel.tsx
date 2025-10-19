import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileSignature, Send, Download, XCircle, CheckCircle, Clock, Plus, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/templateEngine';
import { cn } from '@/lib/utils';
import type { ESignature } from '@/types/proposal';

interface ESignaturePanelProps {
  signature?: ESignature;
  onCreateSignature: (signers: Array<{ name: string; email: string; role: string }>) => void;
  onSendSignature: () => void;
  onVoidSignature: (reason: string) => void;
  onDownloadSigned: () => void;
}

export function ESignaturePanel({
  signature,
  onCreateSignature,
  onSendSignature,
  onVoidSignature,
  onDownloadSigned,
}: ESignaturePanelProps) {
  const [signers, setSigners] = useState<Array<{ name: string; email: string; role: string }>>([
    { name: '', email: '', role: 'client' },
  ]);
  const [voidReason, setVoidReason] = useState('');

  const handleAddSigner = () => {
    setSigners([...signers, { name: '', email: '', role: 'client' }]);
  };

  const handleRemoveSigner = (index: number) => {
    setSigners(signers.filter((_, i) => i !== index));
  };

  const handleUpdateSigner = (index: number, field: string, value: string) => {
    setSigners(
      signers.map((signer, i) =>
        i === index ? { ...signer, [field]: value } : signer
      )
    );
  };

  const handleCreateSignature = () => {
    const validSigners = signers.filter(s => s.name && s.email);
    if (validSigners.length > 0) {
      onCreateSignature(validSigners);
    }
  };

  const getStatusColor = (status: ESignature['status']) => {
    switch (status) {
      case 'signed':
        return 'text-accent-green';
      case 'pending':
      case 'sent':
      case 'delivered':
        return 'text-accent-yellow';
      case 'declined':
      case 'voided':
        return 'text-destructive';
      default:
        return 'text-muted';
    }
  };

  const getStatusIcon = (status: ESignature['status']) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
      case 'sent':
      case 'delivered':
        return <Clock className="h-4 w-4" />;
      case 'declined':
      case 'voided':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileSignature className="h-4 w-4" />;
    }
  };

  if (!signature) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            E-Signature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <FileSignature className="h-4 w-4 mr-2" />
                Setup E-Signature
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Setup E-Signature</DialogTitle>
                <DialogDescription>
                  Add signers who need to sign this proposal
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {signers.map((signer, index) => (
                  <div key={index} className="space-y-4 p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label>Signer {index + 1}</Label>
                      {signers.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSigner(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${index}`}>Name</Label>
                        <Input
                          id={`name-${index}`}
                          value={signer.name}
                          onChange={(e) => handleUpdateSigner(index, 'name', e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`email-${index}`}>Email</Label>
                        <Input
                          id={`email-${index}`}
                          type="email"
                          value={signer.email}
                          onChange={(e) => handleUpdateSigner(index, 'email', e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`role-${index}`}>Role</Label>
                        <Select
                          value={signer.role}
                          onValueChange={(value) => handleUpdateSigner(index, 'role', value)}
                        >
                          <SelectTrigger id={`role-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">Client</SelectItem>
                            <SelectItem value="company">Company</SelectItem>
                            <SelectItem value="witness">Witness</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={handleAddSigner}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Signer
                </Button>

                <div className="flex justify-end gap-2 pt-4">
                  <Button onClick={handleCreateSignature}>
                    Create Signature Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            E-Signature
          </span>
          <Badge variant="outline" className={cn('capitalize', getStatusColor(signature.status))}>
            <span className="flex items-center gap-1">
              {getStatusIcon(signature.status)}
              {signature.status}
            </span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Signers */}
        <div className="space-y-3">
          <Label>Signers</Label>
          <div className="space-y-2">
            {signature.signers.map((signer) => (
              <div
                key={signer.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border"
              >
                <div className="space-y-1">
                  <p className="font-medium">{signer.name}</p>
                  <p className="text-sm text-muted">{signer.email}</p>
                  <Badge variant="outline" className="capitalize text-xs">
                    {signer.role}
                  </Badge>
                </div>
                <Badge
                  variant="outline"
                  className={cn('capitalize', getStatusColor(signer.status as ESignature['status']))}
                >
                  {signer.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          {signature.status === 'pending' && (
            <Button onClick={onSendSignature} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send for Signature
            </Button>
          )}

          {signature.status === 'signed' && signature.signed_document_url && (
            <Button onClick={onDownloadSigned} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Signed Document
            </Button>
          )}

          {(signature.status === 'pending' || signature.status === 'sent' || signature.status === 'delivered') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full text-destructive">
                  <XCircle className="h-4 w-4 mr-2" />
                  Void Signature Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Void Signature Request</DialogTitle>
                  <DialogDescription>
                    This will cancel the signature request. Please provide a reason.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="void-reason">Reason</Label>
                    <Input
                      id="void-reason"
                      value={voidReason}
                      onChange={(e) => setVoidReason(e.target.value)}
                      placeholder="e.g., Client requested changes"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (voidReason) {
                          onVoidSignature(voidReason);
                          setVoidReason('');
                        }
                      }}
                      disabled={!voidReason}
                    >
                      Void Request
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm text-muted">
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{formatDate(signature.created_at)}</span>
          </div>
          {signature.completed_at && (
            <div className="flex justify-between">
              <span>Completed:</span>
              <span>{formatDate(signature.completed_at)}</span>
            </div>
          )}
          {signature.provider && (
            <div className="flex justify-between">
              <span>Provider:</span>
              <Badge variant="secondary" className="capitalize">
                {signature.provider}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
