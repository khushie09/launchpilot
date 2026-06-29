import { TrendingUp, TrendingDown, Eye, MousePointerClick, FileVideo, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { monthlyRevenue, campaigns } from '@/lib/mock-data'

// ── Bar chart ─────────────────────────────────────────────────────────────────
function BarChart({
  data,
  valueKey,
  color,
  accentColor,
}: {
  data: typeof monthlyRevenue
  valueKey: 'revenue' | 'campaigns'
  color: string
  accentColor: string
}) {
  const max = Math.max(...data.map((d) => d[valueKey]))
  const barH = 180

  return (
    <div className="flex items-end gap-1.5" style={{ height: barH + 24 }}>
      {data.map((d, i) => {
        const pct = (d[valueKey] / max) * 100
        const isRecent = i >= data.length - 3
        const isCurrent = i === data.length - 1
        return (
          <div key={d.month} className="group flex flex-1 flex-col items-center gap-1.5">
            <div className="relative w-full" style={{ height: barH }}>
              <div
                className="absolute bottom-0 w-full rounded-t transition-all duration-200 group-hover:opacity-75"
                style={{
                  height: `${pct}%`,
                  background: isCurrent
                    ? `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}50 100%)`
                    : isRecent
                      ? `${color}30`
                      : `${color}12`,
                  border: isCurrent
                    ? `1px solid ${accentColor}50`
                    : `1px solid ${color}20`,
                  borderBottom: 'none',
                  borderRadius: '3px 3px 0 0',
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

// ── Platform data ─────────────────────────────────────────────────────────────
const platformData = [
  { label: 'YouTube',   count: 3, pct: 37, color: '#f87171', bg: 'rgba(248,113,113,0.1)'   },
  { label: 'Instagram', count: 3, pct: 37, color: '#f472b6', bg: 'rgba(244,114,182,0.1)'   },
  { label: 'TikTok',    count: 2, pct: 25, color: '#22d3ee', bg: 'rgba(34,211,238,0.1)'    },
]

// ── Top metrics ───────────────────────────────────────────────────────────────
const topMetrics = [
  { label: 'Total Impressions', value: '4.2M',   change: '+18%',   trend: 'up',   icon: Eye,               iconColor: '#818cf8', iconBg: 'rgba(99,102,241,0.1)'  },
  { label: 'Avg. Engagement',   value: '5.3%',   change: '+0.6%',  trend: 'up',   icon: MousePointerClick, iconColor: '#4ade80', iconBg: 'rgba(34,197,94,0.1)'   },
  { label: 'Content Pieces',    value: '94',     change: '+12',    trend: 'up',   icon: FileVideo,          iconColor: '#fbbf24', iconBg: 'rgba(245,158,11,0.1)'  },
  { label: 'Avg. CPM',          value: '$4.20',  change: '-$0.40', trend: 'down', icon: Target,             iconColor: '#f87171', iconBg: 'rgba(239,68,68,0.1)'   },
]

const cardStyle = {
  background: '#0f0f13',
  boxShadow: '0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-8">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Performance overview across all campaigns · June 2026
        </p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {topMetrics.map((m) => {
          const Icon = m.icon
          return (
            <Card key={m.label} className="border-border/60" style={cardStyle}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[12px] font-medium text-muted-foreground">{m.label}</p>
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: m.iconBg }}
                  >
                    <Icon size={13} strokeWidth={2} style={{ color: m.iconColor }} />
                  </div>
                </div>
                <p className="text-[26px] font-semibold tracking-tight text-foreground leading-none">
                  {m.value}
                </p>
                <p className={`mt-2 flex items-center gap-1 text-[11px] font-medium ${m.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {m.trend === 'up'
                    ? <TrendingUp size={11} strokeWidth={2.5} />
                    : <TrendingDown size={11} strokeWidth={2.5} />
                  }
                  {m.change} this month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Revenue + Campaigns charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60" style={cardStyle}>
          <CardHeader className="border-b border-border/40 pb-3.5 pt-4 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[13px] font-semibold text-foreground tracking-tight">
                Monthly Revenue
              </CardTitle>
              <span className="text-[11px] text-muted-foreground/50">Jan – Dec 2026</span>
            </div>
            <p className="text-xl font-semibold tracking-tight text-foreground mt-1">
              $420,700
            </p>
          </CardHeader>
          <CardContent className="px-5 pt-5 pb-4">
            <BarChart data={monthlyRevenue} valueKey="revenue" color="#6366f1" accentColor="#818cf8" />
          </CardContent>
        </Card>

        <Card className="border-border/60" style={cardStyle}>
          <CardHeader className="border-b border-border/40 pb-3.5 pt-4 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[13px] font-semibold text-foreground tracking-tight">
                Campaigns Launched
              </CardTitle>
              <span className="text-[11px] text-muted-foreground/50">Jan – Dec 2026</span>
            </div>
            <p className="text-xl font-semibold tracking-tight text-foreground mt-1">
              112 total
            </p>
          </CardHeader>
          <CardContent className="px-5 pt-5 pb-4">
            <BarChart data={monthlyRevenue} valueKey="campaigns" color="#3b82f6" accentColor="#60a5fa" />
          </CardContent>
        </Card>
      </div>

      {/* Platform breakdown + top campaigns */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Platform mix */}
        <Card className="border-border/60" style={cardStyle}>
          <CardHeader className="border-b border-border/40 pb-3.5 pt-4 px-5">
            <CardTitle className="text-[13px] font-semibold text-foreground tracking-tight">
              Platform Mix
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pt-5 pb-5 space-y-4">
            {platformData.map((p) => (
              <div key={p.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-[13px] font-medium text-foreground">{p.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-muted-foreground">{p.count} campaigns</span>
                    <span
                      className="text-[11px] font-semibold rounded-md px-1.5 py-0.5"
                      style={{ background: p.bg, color: p.color }}
                    >
                      {p.pct}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${p.pct}%`, background: `linear-gradient(90deg, ${p.color}90, ${p.color})` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top campaigns by reach */}
        <Card className="border-border/60" style={cardStyle}>
          <CardHeader className="border-b border-border/40 pb-3.5 pt-4 px-5">
            <CardTitle className="text-[13px] font-semibold text-foreground tracking-tight">
              Top Campaigns by Reach
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pt-4 pb-5">
            <div className="space-y-1">
              {campaigns
                .filter((c) => c.reach !== '—')
                .sort((a, b) => {
                  const toNum = (s: string) =>
                    parseFloat(s.replace(/[KM]/g, '')) *
                    (s.includes('M') ? 1000 : 1)
                  return toNum(b.reach) - toNum(a.reach)
                })
                .slice(0, 5)
                .map((c, i) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/30"
                  >
                    <span
                      className="w-5 shrink-0 text-center text-[11px] font-bold"
                      style={{ color: i === 0 ? '#fbbf24' : '#52525b' }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-foreground">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground/60">{c.platform} · {c.brand}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-[12px] text-muted-foreground">{c.reach}</span>
                      <span
                        className="text-[11px] font-semibold rounded-full px-2 py-0.5"
                        style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}
                      >
                        {c.engagement}
                      </span>
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
