/**
 * Email Management Page
 * 
 * Page for managing email templates, previewing, and monitoring queue
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailPreview } from '@/components/email/EmailPreview';
import { EmailQueue } from '@/components/email/EmailQueue';
import { Eye, List } from 'lucide-react';

export default function EmailManagement() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Email Management</h1>
        <p className="text-muted-foreground">
          Manage email templates, preview designs, and monitor email delivery
        </p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            Template Preview
          </TabsTrigger>
          <TabsTrigger value="queue" className="gap-2">
            <List className="h-4 w-4" />
            Email Queue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-6">
          <EmailPreview />
        </TabsContent>

        <TabsContent value="queue" className="mt-6">
          <EmailQueue />
        </TabsContent>
      </Tabs>
    </div>
  );
}
