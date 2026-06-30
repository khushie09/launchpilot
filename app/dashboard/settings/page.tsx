import type { ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { currentUser } from '@clerk/nextjs/server'
import { User, Building2, Bell, ShieldAlert } from 'lucide-react'

const card = {
  background: '#0f0f13',
  border: '1px solid rgba(255,255,255,0.055)',
  borderRadius: 14,
}

const sectionHeader = (icon: ReactNode, title: string, description: string) => (
  <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 14 }}>
    {icon}
    <div>
      <p style={{ fontSize: 15, fontWeight: 600, color: '#f4f4f5', lineHeight: 1.2 }}>{title}</p>
      <p style={{ marginTop: 3, fontSize: 13, color: '#52525b' }}>{description}</p>
    </div>
  </div>
)

export default async function SettingsPage() {
  const user = await currentUser()

  const notifications = [
    { id: 'campaign-updates', label: 'Campaign updates',  description: 'Status changes, completions, and reviews',  defaultChecked: true  },
    { id: 'payment-alerts',   label: 'Payment alerts',    description: 'Successful transfers and pending invoices',   defaultChecked: true  },
    { id: 'creator-activity', label: 'Creator activity',  description: 'New joins and content submissions',            defaultChecked: false },
    { id: 'weekly-digest',    label: 'Weekly digest',     description: 'Performance summary every Monday morning',    defaultChecked: true  },
  ]

  return (
    <div style={{ padding: '32px 48px 48px 112px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', color: '#f4f4f5', lineHeight: 1.1 }}>
            Settings
          </h1>
          <p style={{ marginTop: 8, fontSize: 14, color: '#71717a' }}>
            Manage your account and workspace preferences
          </p>
        </div>

        <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Profile */}
          <div style={card}>
            {sectionHeader(
              <div style={{ height: 36, width: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.1)', flexShrink: 0 }}>
                <User size={15} strokeWidth={1.8} style={{ color: '#818cf8' }} />
              </div>,
              'Profile',
              'Your personal information'
            )}
            <div style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'First Name', value: user?.firstName ?? '', placeholder: 'Your first name' },
                  { label: 'Last Name',  value: user?.lastName ?? '',  placeholder: 'Your last name'  },
                ].map((f) => (
                  <div key={f.label}>
                    <label style={{ display: 'block', marginBottom: 7, fontSize: 12, fontWeight: 500, color: '#71717a' }}>
                      {f.label}
                    </label>
                    <Input
                      defaultValue={f.value}
                      placeholder={f.placeholder}
                      className="h-10 border-border/60 bg-muted/40 text-[13px] text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-indigo-500/50"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 7, fontSize: 12, fontWeight: 500, color: '#71717a' }}>
                  Email Address
                </label>
                <Input
                  type="email"
                  defaultValue={user?.emailAddresses[0]?.emailAddress ?? ''}
                  placeholder="your@email.com"
                  className="h-10 border-border/60 bg-muted/40 text-[13px] text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-indigo-500/50"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
                <Button
                  size="sm"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', height: 34, fontSize: 13 }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          {/* Workspace */}
          <div style={card}>
            {sectionHeader(
              <div style={{ height: 36, width: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.1)', flexShrink: 0 }}>
                <Building2 size={15} strokeWidth={1.8} style={{ color: '#60a5fa' }} />
              </div>,
              'Workspace',
              'Your brand or agency settings'
            )}
            <div style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { label: 'Brand / Agency Name', value: 'Orbis Creative Studio', type: 'text' },
                { label: 'Website',              value: 'https://orbis.studio',   type: 'url'  },
              ].map((f) => (
                <div key={f.label}>
                  <label style={{ display: 'block', marginBottom: 7, fontSize: 12, fontWeight: 500, color: '#71717a' }}>
                    {f.label}
                  </label>
                  <Input
                    type={f.type}
                    defaultValue={f.value}
                    className="h-10 border-border/60 bg-muted/40 text-[13px] text-foreground focus-visible:ring-1 focus-visible:ring-indigo-500/50"
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', marginBottom: 7, fontSize: 12, fontWeight: 500, color: '#71717a' }}>
                  Default Currency
                </label>
                <Input
                  defaultValue="USD"
                  style={{ width: 96 }}
                  className="h-10 border-border/60 bg-muted/40 text-[13px] text-foreground focus-visible:ring-1 focus-visible:ring-indigo-500/50"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
                <Button
                  size="sm"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', height: 34, fontSize: 13 }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div style={card}>
            {sectionHeader(
              <div style={{ height: 36, width: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.1)', flexShrink: 0 }}>
                <Bell size={15} strokeWidth={1.8} style={{ color: '#fbbf24' }} />
              </div>,
              'Notifications',
              'Choose what you want to be notified about'
            )}
            <div style={{ padding: '8px 28px' }}>
              {notifications.map((n, i) => (
                <div key={n.id}>
                  {i > 0 && <Separator style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0' }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#e4e4e7' }}>{n.label}</p>
                      <p style={{ marginTop: 3, fontSize: 12, color: '#52525b' }}>{n.description}</p>
                    </div>
                    <Switch
                      defaultChecked={n.defaultChecked}
                      aria-label={`Toggle ${n.label}`}
                      className="data-[state=checked]:bg-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div style={{ ...card, border: '1px solid rgba(239,68,68,0.12)' }}>
            {sectionHeader(
              <div style={{ height: 36, width: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.1)', flexShrink: 0 }}>
                <ShieldAlert size={15} strokeWidth={1.8} style={{ color: '#f87171' }} />
              </div>,
              'Danger Zone',
              'Irreversible actions — proceed with care'
            )}
            <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#e4e4e7' }}>Delete Account</p>
                <p style={{ marginTop: 4, fontSize: 13, color: '#52525b' }}>
                  Permanently delete your account, workspaces, and all associated data.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                style={{
                  flexShrink: 0,
                  fontSize: 13,
                  color: '#f87171',
                  borderColor: 'rgba(239,68,68,0.2)',
                  background: 'transparent',
                  height: 34,
                }}
                className="hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/40"
              >
                Delete Account
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
