import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Shield, FileText, Mail } from 'lucide-react';

export default function SupportSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit a Dispute</CardTitle>
          <CardDescription>Report issues or disputes with bookings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="disputeType">Dispute Type</Label>
            <select className="w-full p-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <option>Payment Issue</option>
              <option>Tourist Behavior</option>
              <option>Booking Cancellation</option>
              <option>Platform Issue</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <Label htmlFor="bookingId">Related Booking ID</Label>
            <Input id="bookingId" placeholder="Enter booking ID (optional)" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} placeholder="Describe the issue in detail..." />
          </div>
          <div>
            <Label htmlFor="evidence">Upload Evidence</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload files or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
          <Button>Submit Dispute</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Disputes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Active Disputes</h3>
            <p className="text-gray-600 dark:text-gray-400">You don't have any ongoing disputes at the moment.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Help</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border dark:border-gray-700 rounded-lg">
              <h4 className="font-medium dark:text-gray-100 mb-2">Getting Started Guide</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Learn how to optimize your profile and attract more bookings
              </p>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Read Guide
              </Button>
            </div>
            <div className="p-4 border dark:border-gray-700 rounded-lg">
              <h4 className="font-medium dark:text-gray-100 mb-2">Contact Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Get help from our support team</p>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}