import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Trash2 } from 'lucide-react';

export default function SettingsSection({ 
  onUpdatePassword, 
  onDeactivateAccount, 
  onDeleteAccount 
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" />
          </div>
          <Button onClick={onUpdatePassword}>Update Password</Button>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>These actions cannot be undone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <p className="font-medium text-red-600 dark:text-red-400">Deactivate Account</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Temporarily disable your account</p>
            </div>
            <Button 
              variant="outline" 
              className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 bg-transparent"
              onClick={onDeactivateAccount}
            >
              <Lock className="h-4 w-4 mr-2" />
              Deactivate
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive" onClick={onDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}