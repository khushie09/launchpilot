import { TrendingUp, TrendingDown, ArrowRight, DollarSign, Megaphone, Users, Clock } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCampaigns, getDashboardStats } from '@/app/actions/campaigns'
import { getDashboardRevenue, getDashboardActivity, type RevenuePoint, type ActivityItem } from '@/app/actions/analytics'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

// ── Shared tokens ─────────────────────────────────────────────────────────────
const card = {
  background: '#0f0f13',
  border: '1px solid rgba(255,255,255,0.055)',
  borderRadius: 14,
} as const

// ── Status badge ──────────────────────────────────────────────────────────────
const statusConfig = {
  Active:    { bg: 'rgba(34,197,94,0.08)',   text: '#4ade80', dot: '#22c55e' },
  Review:    { bg: 'rgba(245,158,11,0.08)',  text: '#fbbf24', dot: '#f59e0b' },
  Draft:     { bg: 'rgba(113,113,122,0.08)', text: '#a1a1aa', dot: '#71717a' },
  Completed: { bg: 'rgba(99,102,241,0.08)',  text: '#818cf8', dot: '#6366f1' },
  Paused:    { bg: 'rgba(113,113,122,0.06)', text: '#71717a', dot: '#52525b' },
} as const

function StatusBadge({ status }: { status: string }) {
  const c = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.Draft
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={{ background: c.bg, color: c.text }}
    >
      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: c.dot }} />
      {status}
    </span>
  )
}

// ── Revenue chart ─────────────────────────────────────────────────────────────
function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const max  = Math.max(...data.map((d) => d.revenue), 1)
  const barH = 200
  const hasData = data.some((d) => d.revenue > 0)

  if (!hasData) {
    return (
      <div style={{ height: barH + 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3f3f46', fontSize: 13 }}>
        No revenue data yet
      </div>
    )
  }

  return (
    <div className="flex items-end gap-1.5" style={{ height: barH + 28 }}>
      {data.map((d, i) => {
        const pct       = (d.revenue / max) * 100
        const isRecent  = i >= data.length - 3
        const isCurrent = i === data.length - 1
        return (
          <div key={d.month} className="group flex flex-1 flex-col items-center gap-2">
            <div className="relative w-full" style={{ height: barH }}>
              <div
                className="absolute bottom-0 w-full transition-all duration-200 group-hover:opacity-75"
                style={{
                  height: `${pct}%`,
                  background: isCurrent
                    ? 'linear-gradient(180deg, #818cf8 0%, rgba(99,102,241,0.4) 100%)'
                    : isRecent
                      ? 'rgba(99,102,241,0.16)'
                      : 'rgba(255,255,255,0.045)',
                  border: isCurrent
                    ? '1px solid rgba(129,140,248,0.35)'
                    : isRecent
                      ? '1px solid rgba(99,102,241,0.1)'
                      : '1px solid rgba(255,255,255,0.04)',
                  borderBottom: 'none',
                  borderRadius: '3px 3px 0 0',
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground/40">{d.month}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── Activity feed ─────────────────────────────────────────────────────────────
function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <p style={{ fontSize: 13, color: '#3f3f46', textAlign: 'center', padding: '32px 0' }}>
        No activity yet — create a campaign, add a creator, or send a payment.
      </p>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((item) => (
        <div
          key={item.id}
          className="transition-colors hover:bg-muted/30"
          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: 'rgba(99,102,241,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, color: '#818cf8',
          }}>
            {item.initials}
          </div>
          <p style={{ flex: 1, fontSize: 13, color: '#a1a1aa', lineHeight: 1.4 }}>{item.message}</p>
          <span style={{ fontSize: 12, color: '#3f3f46', flexShrink: 0 }}>{item.timeAgo}</span>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default async function DashboardOverview() {
  const [campaigns, stats, revenueData, activity] = await Promise.all([
    getCampaigns(),
    getDashboardStats(),
    getDashboardRevenue(),
    getDashboardActivity(),
  ])

  const recentCampaigns = campaigns.slice(0, 5)
  const activeCampaigns = stats?.activeCampaigns ?? 0

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue
        ? `$${stats.totalRevenue.toLocaleString()}`
        : '$0',
      change: '',
      trend: 'up' as const,
      sub: 'from paid campaigns',
      icon: DollarSign,
      iconColor: '#4ade80',
    },
    {
      title: 'Active Campaigns',
      value: String(activeCampaigns),
      change: '',
      trend: 'up' as const,
      sub: 'running now',
      icon: Megaphone,
      iconColor: '#818cf8',
    },
    {
      title: 'Total Creators',
      value: String(stats?.totalCreators ?? 0),
      change: '',
      trend: 'up' as const,
      sub: 'in network',
      icon: Users,
      iconColor: '#a78bfa',
    },
    {
      title: 'Pending Review',
      value: String(stats?.reviewCampaigns ?? 0),
      change: '',
      trend: 'down' as const,
      sub: 'awaiting review',
      icon: Clock,
      iconColor: '#fbbf24',
    },
  ]

  return (
    <div style={{ padding: '32px 48px 48px 112px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>

        {/* ── 1. Header ────────────────────────────────────────────────────── */}
        <DashboardHeader activeCampaigns={activeCampaigns} />

        {/* ── 2. KPI cards ─────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {kpiCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.title} style={{ ...card, padding: '28px 28px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {stat.title}
                  </p>
                  <Icon size={14} strokeWidth={1.8} style={{ color: '#3f3f46', flexShrink: 0 }} />
                </div>
                <p style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.035em', color: '#f4f4f5', lineHeight: 1 }}>
                  {stat.value}
                </p>
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {stat.trend === 'up'
                    ? <TrendingUp size={11} strokeWidth={2} style={{ color: '#4ade80' }} />
                    : <TrendingDown size={11} strokeWidth={2} style={{ color: '#f87171' }} />
                  }
                  <span style={{ fontSize: 12, color: '#52525b' }}>{stat.sub}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── 3. Revenue chart ─────────────────────────────────────────────── */}
        <div style={card}>
          <div style={{ padding: '28px 32px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 500, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Revenue
                </p>
                <p style={{ marginTop: 6, fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', color: '#f4f4f5', lineHeight: 1 }}>
                  {stats?.totalRevenue ? `$${stats.totalRevenue.toLocaleString()}` : '$0'}
                </p>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <TrendingUp size={12} strokeWidth={2} style={{ color: '#4ade80' }} />
                  <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 500 }}>from paid payments</span>
                </div>
              </div>
              <span style={{ fontSize: 12, color: '#3f3f46' }}>Jan – Dec 2026</span>
            </div>
          </div>
          <div style={{ padding: '28px 32px 24px' }}>
            <RevenueChart data={revenueData} />
          </div>
        </div>

        {/* ── 4. Recent campaigns ──────────────────────────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em', color: '#f4f4f5' }}>
              Recent Campaigns
            </h2>
            <Link
              href="/dashboard/campaigns"
              className="no-underline"
              style={{ fontSize: 13, color: '#52525b', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              View all <ArrowRight size={12} strokeWidth={1.8} />
            </Link>
          </div>

          {recentCampaigns.length === 0 ? (
            <div style={{ ...card, padding: '40px 28px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#52525b' }}>No campaigns yet.</p>
              <Link href="/dashboard/campaigns" style={{ fontSize: 13, color: '#818cf8', marginTop: 8, display: 'block' }}>
                Create your first campaign →
              </Link>
            </div>
          ) : (
            <Card style={card}>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor: 'rgba(255,255,255,0.05)' }} className="hover:bg-transparent">
                      <TableHead style={{ paddingLeft: 28, paddingTop: 16, paddingBottom: 16, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#3f3f46' }}>Campaign</TableHead>
                      <TableHead style={{ paddingTop: 16, paddingBottom: 16, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#3f3f46' }}>Creator</TableHead>
                      <TableHead style={{ paddingTop: 16, paddingBottom: 16, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#3f3f46' }}>Status</TableHead>
                      <TableHead style={{ paddingRight: 28, paddingTop: 16, paddingBottom: 16, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#3f3f46', textAlign: 'right' }}>Budget</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentCampaigns.map((c) => {
                      const creatorName = c.creator?.name ?? null
                      const creatorInitials = creatorName
                        ? creatorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                        : null
                      return (
                        <TableRow
                          key={c.id}
                          style={{ borderColor: 'rgba(255,255,255,0.04)', cursor: 'pointer' }}
                          className="transition-colors hover:bg-muted/40"
                        >
                          <TableCell style={{ paddingLeft: 28, paddingTop: 22, paddingBottom: 22 }}>
                            <p style={{ fontSize: 13, fontWeight: 500, color: '#e4e4e7', lineHeight: 1 }}>{c.name}</p>
                            <p style={{ marginTop: 5, fontSize: 12, color: '#52525b' }}>{c.brand}</p>
                          </TableCell>
                          <TableCell style={{ paddingTop: 22, paddingBottom: 22 }}>
                            {creatorName ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback
                                    style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', fontSize: 10, fontWeight: 600 }}
                                  >
                                    {creatorInitials}
                                  </AvatarFallback>
                                </Avatar>
                                <span style={{ fontSize: 13, color: '#a1a1aa' }}>{creatorName}</span>
                              </div>
                            ) : (
                              <span style={{ fontSize: 12, color: '#3f3f46' }}>—</span>
                            )}
                          </TableCell>
                          <TableCell style={{ paddingTop: 22, paddingBottom: 22 }}>
                            <StatusBadge status={c.status} />
                          </TableCell>
                          <TableCell style={{ paddingRight: 28, paddingTop: 22, paddingBottom: 22, textAlign: 'right', fontFamily: 'monospace', fontSize: 13, color: '#a1a1aa' }}>
                            ${c.budget.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── 5. Recent activity ────────────────────────────────────────────── */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em', color: '#f4f4f5', marginBottom: 20 }}>
            Recent Activity
          </h2>
          <div style={{ ...card, padding: '8px 28px' }}>
            <ActivityFeed items={activity} />
          </div>
        </div>

      </div>
    </div>
  )
}
