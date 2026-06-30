import { TrendingUp, TrendingDown, ArrowRight, DollarSign, Megaphone, Users, Clock } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  overviewStats,
  campaigns,
  recentActivity,
  monthlyRevenue,
  type CampaignStatus,
} from '@/lib/mock-data'

// ── Shared tokens ─────────────────────────────────────────────────────────────
const card = {
  background: '#0f0f13',
  border: '1px solid rgba(255,255,255,0.055)',
  borderRadius: 14,
}

// ── Status badge ──────────────────────────────────────────────────────────────
const statusConfig: Record<CampaignStatus, { bg: string; text: string; dot: string }> = {
  Active:    { bg: 'rgba(34,197,94,0.08)',   text: '#4ade80', dot: '#22c55e' },
  Review:    { bg: 'rgba(245,158,11,0.08)',  text: '#fbbf24', dot: '#f59e0b' },
  Draft:     { bg: 'rgba(113,113,122,0.08)', text: '#a1a1aa', dot: '#71717a' },
  Completed: { bg: 'rgba(99,102,241,0.08)',  text: '#818cf8', dot: '#6366f1' },
  Paused:    { bg: 'rgba(113,113,122,0.06)', text: '#71717a', dot: '#52525b' },
}

function StatusBadge({ status }: { status: CampaignStatus }) {
  const c = statusConfig[status]
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

// ── KPI config ────────────────────────────────────────────────────────────────
const kpiIcons = [
  { icon: DollarSign, color: '#4ade80' },
  { icon: Megaphone,  color: '#818cf8' },
  { icon: Users,      color: '#a78bfa' },
  { icon: Clock,      color: '#fbbf24' },
]

// ── Revenue chart ─────────────────────────────────────────────────────────────
function RevenueChart() {
  const max = Math.max(...monthlyRevenue.map((d) => d.revenue))
  const barH = 200

  return (
    <div className="flex items-end gap-1.5" style={{ height: barH + 28 }}>
      {monthlyRevenue.map((d, i) => {
        const pct = (d.revenue / max) * 100
        const isRecent = i >= monthlyRevenue.length - 3
        const isCurrent = i === monthlyRevenue.length - 1
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

// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardOverview() {
  const recentCampaigns = campaigns.slice(0, 5)

  return (
    <div style={{ padding: '32px 48px 48px 112px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>

        {/* ── 1. Header ────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', color: '#f4f4f5', lineHeight: 1.1 }}>
              Overview
            </h1>
            <p style={{ marginTop: 8, fontSize: 14, color: '#71717a' }}>
              Monday, June 29, 2026 · 4 active campaigns
            </p>
          </div>
          <Link href="/dashboard/campaigns">
            <Button className="px-4">New Campaign</Button>
          </Link>
        </div>

        {/* ── 2. KPI cards ─────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {overviewStats.map((stat, i) => {
            const kpi = kpiIcons[i]
            const Icon = kpi.icon
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
                  <span style={{ fontSize: 12, fontWeight: 600, color: stat.trend === 'up' ? '#4ade80' : '#f87171' }}>
                    {stat.change}
                  </span>
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
                  $84,320
                </p>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <TrendingUp size={12} strokeWidth={2} style={{ color: '#4ade80' }} />
                  <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 500 }}>+12.5% from last month</span>
                </div>
              </div>
              <span style={{ fontSize: 12, color: '#3f3f46' }}>Jan – Dec 2026</span>
            </div>
          </div>
          <div style={{ padding: '28px 32px 24px' }}>
            <RevenueChart />
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
          <Card style={card}>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: 'rgba(255,255,255,0.05)' }} className="hover:bg-transparent">
                    <TableHead style={{ paddingLeft: 28, paddingTop: 16, paddingBottom: 16, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#3f3f46' }}>
                      Campaign
                    </TableHead>
                    <TableHead style={{ paddingTop: 16, paddingBottom: 16, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#3f3f46' }}>
                      Creator
                    </TableHead>
                    <TableHead style={{ paddingTop: 16, paddingBottom: 16, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#3f3f46' }}>
                      Status
                    </TableHead>
                    <TableHead style={{ paddingRight: 28, paddingTop: 16, paddingBottom: 16, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#3f3f46', textAlign: 'right' }}>
                      Budget
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCampaigns.map((c) => (
                    <TableRow
                      key={c.id}
                      style={{ borderColor: 'rgba(255,255,255,0.04)', cursor: 'pointer' }}
                      className="transition-colors hover:bg-muted/40"
                    >
                      <TableCell style={{ paddingLeft: 28, paddingTop: 22, paddingBottom: 22 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: '#e4e4e7', lineHeight: 1 }}>
                          {c.name}
                        </p>
                        <p style={{ marginTop: 5, fontSize: 12, color: '#52525b' }}>{c.brand}</p>
                      </TableCell>
                      <TableCell style={{ paddingTop: 22, paddingBottom: 22 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar className="h-7 w-7">
                            <AvatarFallback
                              style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', fontSize: 10, fontWeight: 600 }}
                            >
                              {c.creatorAvatar}
                            </AvatarFallback>
                          </Avatar>
                          <span style={{ fontSize: 13, color: '#a1a1aa' }}>{c.creator}</span>
                        </div>
                      </TableCell>
                      <TableCell style={{ paddingTop: 22, paddingBottom: 22 }}>
                        <StatusBadge status={c.status} />
                      </TableCell>
                      <TableCell style={{ paddingRight: 28, paddingTop: 22, paddingBottom: 22, textAlign: 'right', fontFamily: 'monospace', fontSize: 13, color: '#a1a1aa' }}>
                        ${c.budget.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* ── 5. Recent activity ────────────────────────────────────────────── */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em', color: '#f4f4f5', marginBottom: 20 }}>
            Recent Activity
          </h2>
          <div style={card}>
            {recentActivity.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  padding: '20px 28px',
                  borderBottom: idx < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                  <AvatarFallback
                    style={{ background: 'rgba(255,255,255,0.06)', color: '#71717a', fontSize: 10, fontWeight: 600 }}
                  >
                    {item.avatar ?? '·'}
                  </AvatarFallback>
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: '#d4d4d8', lineHeight: 1.5 }}>{item.message}</p>
                </div>
                <span style={{ fontSize: 12, color: '#3f3f46', flexShrink: 0, marginTop: 2 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
