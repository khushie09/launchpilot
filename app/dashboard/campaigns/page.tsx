import { Plus, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { campaigns, type CampaignStatus } from '@/lib/mock-data'

// ── Config ────────────────────────────────────────────────────────────────────
const statusConfig: Record<CampaignStatus, { bg: string; text: string; dot: string }> = {
  Active:    { bg: 'rgba(34,197,94,0.08)',   text: '#4ade80', dot: '#22c55e' },
  Review:    { bg: 'rgba(245,158,11,0.08)',  text: '#fbbf24', dot: '#f59e0b' },
  Draft:     { bg: 'rgba(113,113,122,0.08)', text: '#a1a1aa', dot: '#71717a' },
  Completed: { bg: 'rgba(99,102,241,0.08)',  text: '#818cf8', dot: '#6366f1' },
  Paused:    { bg: 'rgba(113,113,122,0.06)', text: '#71717a', dot: '#52525b' },
}

const platformConfig: Record<string, { bg: string; text: string }> = {
  Instagram: { bg: 'rgba(244,114,182,0.08)', text: '#f472b6' },
  TikTok:    { bg: 'rgba(34,211,238,0.08)',  text: '#22d3ee' },
  YouTube:   { bg: 'rgba(248,113,113,0.08)', text: '#f87171' },
  Twitter:   { bg: 'rgba(56,189,248,0.08)',  text: '#38bdf8' },
  LinkedIn:  { bg: 'rgba(96,165,250,0.08)',  text: '#60a5fa' },
}

const summaryCards: { label: CampaignStatus; color: string }[] = [
  { label: 'Active',    color: '#22c55e' },
  { label: 'Review',    color: '#f59e0b' },
  { label: 'Draft',     color: '#71717a' },
  { label: 'Completed', color: '#6366f1' },
]

const statusCounts = campaigns.reduce(
  (acc, c) => ({ ...acc, [c.status]: (acc[c.status] ?? 0) + 1 }),
  {} as Record<string, number>
)

const cardStyle = {
  background: '#0f0f13',
  boxShadow: '0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
}

// ─────────────────────────────────────────────────────────────────────────────
export default function CampaignsPage() {
  return (
    <div className="space-y-6 p-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Campaigns</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {campaigns.length} campaigns · {statusCounts['Active'] ?? 0} active
          </p>
        </div>
        <Button
          className="gap-2 text-[13px] font-medium"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none' }}
        >
          <Plus size={14} strokeWidth={2.5} />
          New Campaign
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {summaryCards.map(({ label, color }) => (
          <Card key={label} className="border-border/60" style={cardStyle}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                  {label}
                </p>
              </div>
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {statusCounts[label] ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground/50">campaigns</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-border/60" style={cardStyle}>
        <CardHeader className="border-b border-border/40 pb-3.5 pt-4 px-5">
          <CardTitle className="text-[13px] font-semibold text-foreground tracking-tight">
            All Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  {['Campaign', 'Creator', 'Platform', 'Status', 'Budget', 'Spend', 'Reach'].map((h) => (
                    <TableHead
                      key={h}
                      className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40 first:pl-5 last:pr-5"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c) => {
                  const sc = statusConfig[c.status]
                  const pc = platformConfig[c.platform] ?? { bg: 'rgba(113,113,122,0.08)', text: '#a1a1aa' }
                  const spendPct = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0
                  return (
                    <TableRow
                      key={c.id}
                      className="border-border/30 cursor-pointer transition-colors hover:bg-muted/40"
                    >
                      <TableCell className="pl-5 py-4">
                        <p className="text-[13px] font-medium text-foreground leading-none">{c.name}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground/60">{c.brand}</p>
                      </TableCell>
                      <TableCell className="py-4">
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
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
                          style={{ background: pc.bg, color: pc.text }}
                        >
                          {c.platform}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
                          style={{ background: sc.bg, color: sc.text }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: sc.dot }} />
                          {c.status}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 font-mono text-[12px] text-muted-foreground">
                        ${c.budget.toLocaleString()}
                      </TableCell>
                      <TableCell className="py-4">
                        {c.spent > 0 ? (
                          <div className="space-y-1.5">
                            <span className="font-mono text-[12px] text-muted-foreground">
                              ${c.spent.toLocaleString()}
                            </span>
                            <div className="h-1 w-20 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${spendPct}%`,
                                  background: spendPct > 90
                                    ? '#f87171'
                                    : spendPct > 70
                                      ? '#fbbf24'
                                      : '#818cf8',
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-[12px] text-muted-foreground/30">—</span>
                        )}
                      </TableCell>
                      <TableCell className="pr-5 py-4">
                        {c.reach !== '—' ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[12px] text-muted-foreground">{c.reach}</span>
                            <TrendingUp size={10} className="text-emerald-400" />
                            <span className="text-[11px] text-emerald-400">{c.engagement}</span>
                          </div>
                        ) : (
                          <span className="text-[12px] text-muted-foreground/30">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
