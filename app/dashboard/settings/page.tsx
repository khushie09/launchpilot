import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { currentUser } from '@clerk/nextjs/server'
import { User, Building2, Bell, ShieldAlert } from 'lucide-react'

const cardStyle = {
  background: '#0f0f13',
  boxShadow: '0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
}

export default async function SettingsPage() {
  const user = await currentUser()

  const notifications = [
    { id: 'campaign-updates',  label: 'Campaign updates',  description: 'Status changes, completions, and reviews',   defaultChecked: true  },
    { id: 'payment-alerts',    label: 'Payment alerts',    description: 'Successful transfers and pending invoices',    defaultChecked: true  },
    { id: 'creator-activity',  label: 'Creator activity',  description: 'New joins, content submissions',               defaultChecked: false },
    { id: 'weekly-digest',     label: 'Weekly digest',     description: 'Performance summary every Monday morning',     defaultChecked: true  },
  ]

  return (
    <div className="space-y-6 p-8">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and workspace preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-4">

        {/* Profile */}
        <Card className="border-border/60" style={cardStyle}>
          <CardHeader className="border-b border-border/40 pb-4 pt-5 px-6">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: 'rgba(99,102,241,0.1)' }}
              >
                <User size={14} strokeWidth={2} className="text-indigo-400" />
              </div>
              <div>
                <CardTitle className="text-[14px] font-semibold text-foreground tracking-tight">
                  Profile
                </CardTitle>
                <CardDescription className="text-[12px] text-muted-foreground mt-0.5">
                  Your personal information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pt-5 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-muted-foreground">First Name</label>
                <Input
                  defaultValue={user?.firstName ?? ''}
                  placeholder="Your first name"
                  className="h-9 border-border/60 bg-muted/40 text-[13px] text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-indigo-500/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-muted-foreground">Last Name</label>
                <Input
                  defaultValue={user?.lastName ?? ''}
                  placeholder="Your last name"
                  className="h-9 border-border/60 bg-muted/40 text-[13px] text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-indigo-500/50"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Email Address</label>
              <Input
                type="email"
                defaultValue={user?.emailAddresses[0]?.emailAddress ?? ''}
                placeholder="your@email.com"
                className="h-9 border-border/60 bg-muted/40 text-[13px] text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-indigo-500/50"
              />
            </div>
            <div className="flex justify-end pt-1">
              <Button
                size="sm"
                className="text-[12px] font-medium px-4"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', height: 32 }}
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workspace */}
        <Card className="border-border/60" style={cardStyle}>
          <CardHeader className="border-b border-border/40 pb-4 pt-5 px-6">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: 'rgba(59,130,246,0.1)' }}
              >
                <Building2 size={14} strokeWidth={2} className="text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-[14px] font-semibold text-foreground tracking-tight">
                  Workspace
                </CardTitle>
                <CardDescription className="text-[12px] text-muted-foreground mt-0.5">
                  Your brand or agency settings
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pt-5 pb-6">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Brand / Agency Name</label>
              <Input
                defaultValue="Orbis Creative Studio"
                className="h-9 border-border/60 bg-muted/40 text-[13px] text-foreground focus-visible:ring-1 focus-visible:ring-indigo-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Website</label>
              <Input
                defaultValue="https://orbis.studio"
                className="h-9 border-border/60 bg-muted/40 text-[13px] text-foreground focus-visible:ring-1 focus-visible:ring-indigo-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Default Currency</label>
              <Input
                defaultValue="USD"
                className="h-9 w-28 border-border/60 bg-muted/40 text-[13px] text-foreground focus-visible:ring-1 focus-visible:ring-indigo-500/50"
              />
            </div>
            <div className="flex justify-end pt-1">
              <Button
                size="sm"
                className="text-[12px] font-medium px-4"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', height: 32 }}
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border/60" style={cardStyle}>
          <CardHeader className="border-b border-border/40 pb-4 pt-5 px-6">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: 'rgba(245,158,11,0.1)' }}
              >
                <Bell size={14} strokeWidth={2} className="text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-[14px] font-semibold text-foreground tracking-tight">
                  Notifications
                </CardTitle>
                <CardDescription className="text-[12px] text-muted-foreground mt-0.5">
                  Choose what you want to be notified about
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pt-2 pb-2">
            {notifications.map((n, i) => (
              <div key={n.id}>
                {i > 0 && <Separator className="bg-border/40" />}
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-medium text-foreground">{n.label}</p>
                    <p className="text-[12px] text-muted-foreground/60">{n.description}</p>
                  </div>
                  <Switch
                    defaultChecked={n.defaultChecked}
                    aria-label={`Toggle ${n.label}`}
                    className="data-[state=checked]:bg-indigo-500"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card
          className="border-red-500/15"
          style={{
            background: '#0f0f13',
            boxShadow: '0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px rgba(239,68,68,0.06)',
          }}
        >
          <CardHeader className="border-b border-red-500/10 pb-4 pt-5 px-6">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: 'rgba(239,68,68,0.1)' }}
              >
                <ShieldAlert size={14} strokeWidth={2} className="text-red-400" />
              </div>
              <div>
                <CardTitle className="text-[14px] font-semibold text-red-400 tracking-tight">
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-[12px] text-muted-foreground mt-0.5">
                  Irreversible actions — proceed with care
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pt-5 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium text-foreground">Delete Account</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground/60">
                  Permanently delete your account, workspaces, and all associated data.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 text-[12px] font-medium text-red-400 border-red-500/25 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/40"
                style={{ height: 32 }}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
