import { TrendingUp, TrendingDown, ArrowRight, DollarSign, Megaphone, Users, Clock } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
  type Activity,
} from '@/lib/mock-data'

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

// ── Activity icon map ─────────────────────────────────────────────────────────
const activityConfig: Record<Activity['type'], { bg: string; border: string }> = {
  content_approved:   { bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.25)'   },
  payment_sent:       { bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.25)'  },
  creator_joined:     { bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)' },
  campaign_created:   { bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)'  },
  campaign_completed: { bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.25)'  },
  brief_sent:         { bg: 'rgba(125,211,252,0.12)', border: 'rgba(125,211,252,0.25)' },
}

const activityDotColor: Record<Activity['type'], string> = {
  content_approved:   '#22c55e',
  payment_sent:       '#3b82f6',
  creator_joined:     '#a78bfa',
  campaign_created:   '#f59e0b',
  campaign_completed: '#6366f1',
  brief_sent:         '#7dd3fc',
}

// ── KPI icon map ─────────────────────────────────────────────────────────────
const kpiIcons = [
  { icon: DollarSign, color: '#4ade80', bg: 'rgba(34,197,94,0.1)'   },
  { icon: Megaphone,  color: '#818cf8', bg: 'rgba(99,102,241,0.1)'  },
  { icon: Users,      color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  { icon: Clock,      color: '#fbbf24', bg: 'rgba(245,158,11,0.1)'  },
]

// ── Revenue chart ─────────────────────────────────────────────────────────────
function RevenueChart() {
  const max = Math.max(...monthlyRevenue.map((d) => d.revenue))
  const barH = 160

  return (
    <div className="flex items-end gap-1" style={{ height: barH + 24 }}>
      {monthlyRevenue.map((d, i) => {
        const pct = (d.revenue / max) * 100
        const isRecent = i >= monthlyRevenue.length - 3
        const isCurrent = i === monthlyRevenue.length - 1
        return (
          <div key={d.month} className="group flex flex-1 flex-col items-center gap-1">
            <div className="relative w-full" style={{ height: barH }}>
              <div
                className="absolute bottom-0 w-full rounded-t-sm transition-all duration-200 group-hover:opacity-80"
                style={{
                  height: `${pct}%`,
                  background: isCurrent
                    ? 'linear-gradient(180deg, #818cf8 0%, rgba(99,102,241,0.5) 100%)'
                    : isRecent
                      ? 'rgba(99,102,241,0.18)'
                      : 'rgba(255,255,255,0.05)',
                  border: isCurrent
                    ? '1px solid rgba(99,102,241,0.4)'
                    : isRecent
                      ? '1px solid rgba(99,102,241,0.12)'
                      : '1px solid rgba(255,255,255,0.04)',
                  borderBottom: 'none',
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground/50">{d.month}</span>
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
    <div className="space-y-6 p-8">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monday, June 29, 2026 · 4 active campaigns running
          </p>
        </div>
        <Link href="/dashboard/campaigns">
          <Button
            className="gap-2 text-[13px] font-medium"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none' }}
          >
            New Campaign
            <ArrowRight size={14} strokeWidth={2} />
          </Button>
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {overviewStats.map((stat, i) => {
          const kpi = kpiIcons[i]
          const Icon = kpi.icon
          return (
            <Card
              key={stat.title}
              className="border-border/60 transition-all duration-200 hover:border-border"
              style={{
                background: '#0f0f13',
                boxShadow: '0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
              }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <p className="text-[12px] font-medium text-muted-foreground leading-none">
                    {stat.title}
                  </p>
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: kpi.bg }}
                  >
                    <Icon size={13} strokeWidth={2} style={{ color: kpi.color }} />
                  </div>
                </div>
                <p className="mt-3 text-[28px] font-semibold tracking-tight text-foreground leading-none">
                  {stat.value}
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  {stat.trend === 'up'
                    ? <TrendingUp size={11} className="text-emerald-400" />
                    : <TrendingDown size={11} className="text-red-400" />
                  }
                  <span className={`text-[11px] font-semibold ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                  <span className="text-[11px] text-muted-foreground/60">{stat.sub}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Revenue chart — full width */}
      <Card
        className="border-border/60"
        style={{
          background: '#0f0f13',
          boxShadow: '0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
        }}
      >
        <CardHeader className="border-b border-border/40 pb-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
                Revenue
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                $84,320
              </p>
              <p className="mt-1 flex items-center gap-1 text-[12px] text-emerald-400">
                <TrendingUp size={12} strokeWidth={2} />
                +12.5% from last month
              </p>
            </div>
            <span className="text-[12px] text-muted-foreground/50">Jan – Dec 2026</span>
          </div>
        </CardHeader>
        <CardContent className="px-5 pt-5 pb-4">
          <RevenueChart />
        </CardContent>
      </Card>

      {/* Two-column: campaigns + activity */}
      <div className="grid gap-4 xl:grid-cols-5">

        {/* Recent campaigns — 3/5 width */}
        <Card
          className="border-border/60 xl:col-span-3"
          style={{
            background: '#0f0f13',
            boxShadow: '0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-3.5 pt-4 px-5">
            <CardTitle className="text-[13px] font-semibold text-foreground tracking-tight">
              Recent Campaigns
            </CardTitle>
            <Link
              href="/dashboard/campaigns"
              className="flex items-center gap-1 text-[11px] text-muted-foreground/60 transition-colors hover:text-foreground no-underline"
            >
              View all <ArrowRight size={10} strokeWidth={2} />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="pl-5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
                    Campaign
                  </TableHead>
                  <TableHead className="hidden sm:table-cell text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
                    Creator
                  </TableHead>
                  <TableHead className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
                    Status
                  </TableHead>
                  <TableHead className="pr-5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
                    Budget
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCampaigns.map((c) => (
                  <TableRow
                    key={c.id}
                    className="border-border/30 cursor-pointer transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="pl-5 py-4">
                      <p className="text-[13px] font-medium text-foreground leading-none">
                        {c.name}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground/60">{c.brand}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell py-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback
                            className="text-[10px] font-medium"
                            style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}
                          >
                            {c.creatorAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[12px] text-muted-foreground">{c.creator}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <StatusBadge status={c.status} />
                    </TableCell>
                    <TableCell className="pr-5 text-right py-4 font-mono text-[12px] text-muted-foreground">
                      ${c.budget.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Activity feed — 2/5 width */}
        <Card
          className="border-border/60 xl:col-span-2"
          style={{
            background: '#0f0f13',
            boxShadow: '0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
          }}
        >
          <CardHeader className="border-b border-border/40 pb-3.5 pt-4 px-5">
            <CardTitle className="text-[13px] font-semibold text-foreground tracking-tight">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              {/* Timeline line */}
              <div
                className="absolute left-[28px] top-4 bottom-4 w-px"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />

              {recentActivity.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative flex items-start gap-3 px-5 py-3.5"
                  style={{
                    borderBottom: idx < recentActivity.length - 1
                      ? '1px solid rgba(255,255,255,0.04)'
                      : 'none',
                  }}
                >
                  {/* Avatar / dot */}
                  <div className="relative z-10 mt-0.5 shrink-0">
                    {item.avatar ? (
                      <Avatar className="h-7 w-7">
                        <AvatarFallback
                          className="text-[10px] font-medium"
                          style={{ background: activityConfig[item.type].bg, color: activityDotColor[item.type] }}
                        >
                          {item.avatar}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full"
                        style={{ background: activityConfig[item.type].bg, border: `1px solid ${activityConfig[item.type].border}` }}
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: activityDotColor[item.type] }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[12px] leading-snug text-foreground/80">{item.message}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/50">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
