'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Lock, Palette, Database, LogOut, Save, X } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [showSaveAlert, setShowSaveAlert] = useState(false)
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      daily_digest: false,
    },
    preferences: {
      language: 'English',
      timezone: 'UTC-5 (EST)',
      auto_save: true,
    },
    privacy: {
      profile_public: false,
      share_analytics: true,
      data_collection: true,
    },
  })

  const handleToggle = (category: string, key: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: !prev[category as keyof typeof prev][key as keyof typeof prev[category as keyof typeof prev]],
      },
    }))
    setShowSaveAlert(true)
  }

  const handleSave = () => {
    setShowSaveAlert(false)
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and settings</p>
      </div>

      {/* Save Alert */}
      {showSaveAlert && (
        <Card className="p-4 border-yellow-500/30 bg-yellow-500/10">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground">You have unsaved changes</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowSaveAlert(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Account Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lock size={20} />
          Account
        </h2>
        <div className="space-y-4">
          <div className="pb-4 border-b border-border">
            <p className="text-sm font-medium text-foreground mb-2">Email Address</p>
            <div className="flex gap-2">
              <input
                type="email"
                value="alex.chen@example.com"
                disabled
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-secondary text-foreground disabled:opacity-60"
              />
              <Button variant="outline">Change</Button>
            </div>
          </div>

          <div className="pb-4 border-b border-border">
            <p className="text-sm font-medium text-foreground mb-2">Password</p>
            <p className="text-xs text-muted-foreground mb-3">Last changed 3 months ago</p>
            <Button variant="outline">Update Password</Button>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">Two-Factor Authentication</p>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <div>
                <p className="text-sm text-foreground font-medium">Status: Enabled</p>
                <p className="text-xs text-muted-foreground">Your account is protected</p>
              </div>
              <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Active</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell size={20} />
          Notifications
        </h2>
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground capitalize">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {key === 'email' && 'Receive updates via email'}
                  {key === 'push' && 'Receive browser notifications'}
                  {key === 'daily_digest' && 'Get a daily summary of activity'}
                </p>
              </div>
              <button
                onClick={() => handleToggle('notifications', key)}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  value ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    value ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Appearance Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Palette size={20} />
          Appearance
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Theme</p>
            <div className="flex gap-3">
              {['light', 'dark', 'system'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-lg border-2 capitalize font-medium text-sm transition-all ${
                    theme === t
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-3">Color Accent</p>
            <div className="flex gap-3">
              {['purple', 'blue', 'green', 'orange'].map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-lg border-2 ${
                    color === 'purple'
                      ? 'border-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{
                    backgroundColor:
                      color === 'purple'
                        ? '#7c3aed'
                        : color === 'blue'
                          ? '#3b82f6'
                          : color === 'green'
                            ? '#10b981'
                            : '#f97316',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Database size={20} />
          Preferences
        </h2>
        <div className="space-y-4">
          <div className="pb-4 border-b border-border">
            <label className="text-sm font-medium text-foreground mb-2 block">Language</label>
            <select className="w-full px-4 py-2 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Japanese</option>
            </select>
          </div>

          <div className="pb-4 border-b border-border">
            <label className="text-sm font-medium text-foreground mb-2 block">Timezone</label>
            <select className="w-full px-4 py-2 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option>UTC-8 (PST)</option>
              <option>UTC-5 (EST)</option>
              <option>UTC (GMT)</option>
              <option>UTC+1 (CET)</option>
              <option>UTC+8 (Singapore)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors">
            <div>
              <p className="text-sm font-medium text-foreground">Auto-save Content</p>
              <p className="text-xs text-muted-foreground">Automatically save drafts every 30 seconds</p>
            </div>
            <button
              onClick={() => handleToggle('preferences', 'auto_save')}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                settings.preferences.auto_save ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.preferences.auto_save ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Privacy</h2>
        <div className="space-y-3">
          {Object.entries(settings.privacy).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground capitalize">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {key === 'profile_public' && 'Allow others to view your profile'}
                  {key === 'share_analytics' && 'Share performance data for insights'}
                  {key === 'data_collection' && 'Help us improve with anonymized data'}
                </p>
              </div>
              <button
                onClick={() => handleToggle('privacy', key)}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  value ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    value ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive/20 bg-destructive/5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div className="pb-4 border-b border-border">
            <p className="text-sm font-medium text-foreground mb-2">Download Your Data</p>
            <p className="text-xs text-muted-foreground mb-3">
              Get a copy of all your data in a portable format
            </p>
            <Button variant="outline">Download Data</Button>
          </div>

          <div className="pb-4 border-b border-border">
            <p className="text-sm font-medium text-foreground mb-2">Delete Account</p>
            <p className="text-xs text-muted-foreground mb-3">
              Permanently delete your account and all associated data
            </p>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              Delete Account
            </Button>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">Sign Out</p>
            <p className="text-xs text-muted-foreground mb-3">Sign out from all devices</p>
            <Button variant="outline" className="gap-2">
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </div>
      </Card>

      {/* Help Section */}
      <Card className="p-6 bg-accent/5 border-accent/20">
        <h3 className="font-semibold text-foreground mb-3">Need Help?</h3>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            Have questions about your settings? Check out our{' '}
            <a href="#" className="text-primary hover:underline">
              documentation
            </a>
            {' '}or{' '}
            <a href="#" className="text-primary hover:underline">
              contact support
            </a>
            .
          </p>
        </div>
      </Card>
    </div>
  )
}
