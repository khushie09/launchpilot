import { TrendingUp, TrendingDown, Eye, MousePointerClick, FileVideo, BarChart3, BarChart2 } from 'lucide-react'
import { getAnalyticsData } from '@/app/actions/analytics'

// ── Shared tokens ─────────────────────────────────────────────────────────────
const card = {
  background: '#0f0f13',
  border: '1px solid rgba(255,255,255,0.055)',
  borderRadius: 14,
} as const

const platformColors: Record<string, string> = {
  YouTube:   '#f87171',
  Instagram: '#f472b6',
  TikTok:    '#22d3ee',
  Twitter:   '#60a5fa',
  LinkedIn:  '#a78bfa',
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatReach(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

function fmt(n: number) { return `$${n.toLocaleString()}` }

// ── Bar chart ─────────────────────────────────────────────────────────────────
function BarChart({
  data,
  color,
  accentColor,
}: {
  data: { month: string; value: number }[]
  color: string
  accentColor: string
}) {
  const max   = Math.max(...data.map((d) => d.value), 1)
  const barH  = 200
  const hasData = data.some((d) => d.value > 0)

  if (!hasData) {
    return (
      <div style={{ height: barH + 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3f3f46', fontSize: 13 }}>
        No data for this period
      </div>
    )
  }

  return (
    <div className="flex items-end gap-1.5" style={{ height: barH + 28 }}>
      {data.map((d, i) => {
        const pct       = (d.value / max) * 100
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
                    ? `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}40 100%)`
                    : isRecent ? `${color}28` : `${color}10`,
                  border: isCurrent
                    ? `1px solid ${accentColor}40`
                    : `1px solid ${color}18`,
                  borderBottom: 'none',
                  borderRadius: '3px 3px 0 0',
                }}
              />
            </div>
            <span style={{ fontSize: 10, color: '#3f3f46' }}>{d.month}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default async function AnalyticsPage() {
  const data = await getAnalyticsData()

  const now = new Date()
  const periodLabel = `Jan – ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`

  const topMetrics = [
    {
      label: 'Total Impressions',
      value: data ? formatReach(data.totalImpressions) : '—',
      sub: 'from campaign reach',
      icon: Eye,
      hasData: !!data && data.totalImpressions > 0,
    },
    {
      label: 'Avg. Engagement',
      value: data ? `${data.avgEngagement.toFixed(1)}%` : '—',
      sub: 'across all creators',
      icon: MousePointerClick,
      hasData: !!data && data.avgEngagement > 0,
    },
    {
      label: 'Active Content',
      value: data ? String(data.contentPieces) : '—',
      sub: 'active or completed campaigns',
      icon: FileVideo,
      hasData: !!data && data.contentPieces > 0,
    },
    {
      label: 'Total Revenue',
      value: data ? fmt(data.totalPaidRevenue) : '—',
      sub: 'from paid payments',
      icon: BarChart2,
      hasData: !!data && data.totalPaidRevenue > 0,
    },
  ]

  return (
    <div className="dash-page">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', color: '#f4f4f5', lineHeight: 1.1 }}>
            Analytics
          </h1>
          <p style={{ marginTop: 8, fontSize: 14, color: '#71717a' }}>
            Performance overview across all campaigns · {periodLabel}
          </p>
        </div>

        {/* KPI cards */}
        <div className="kpi-grid">
          {topMetrics.map((m) => {
            const Icon = m.icon
            return (
              <div
                key={m.label}
                className="kpi-card"
                style={{
                  ...card,
                  padding: '24px 26px 22px',
                  background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.05) 0%, transparent 55%), #0f0f13',
                  transition: 'border-color 200ms, box-shadow 200ms',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#52525b' }}>
                    {m.label}
                  </p>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={13} strokeWidth={1.8} style={{ color: '#3f3f46' }} />
                  </div>
                </div>
                <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', color: '#f4f4f5', lineHeight: 1 }}>
                  {m.value}
                </p>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {m.hasData
                    ? <TrendingUp  size={11} strokeWidth={2} style={{ color: '#4ade80' }} />
                    : <TrendingDown size={11} strokeWidth={2} style={{ color: '#3f3f46' }} />
                  }
                  <span style={{ fontSize: 12, color: '#52525b' }}>{m.sub}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Revenue + Campaigns charts */}
        <div className="chart-grid-2">
          <div style={card}>
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#52525b' }}>
                Monthly Revenue
              </p>
              <p style={{ marginTop: 8, fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#f4f4f5', lineHeight: 1 }}>
                {data ? fmt(data.totalPaidRevenue) : '—'}
              </p>
            </div>
            <div style={{ padding: '24px 28px 20px' }}>
              <BarChart data={data?.monthlyRevenue ?? []} color="#6366f1" accentColor="#818cf8" />
            </div>
          </div>

          <div style={card}>
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#52525b' }}>
                Campaigns Launched
              </p>
              <p style={{ marginTop: 8, fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#f4f4f5', lineHeight: 1 }}>
                {data ? `${data.totalCampaignCount} total` : '—'}
              </p>
            </div>
            <div style={{ padding: '24px 28px 20px' }}>
              <BarChart data={data?.monthlyCampaigns ?? []} color="#3b82f6" accentColor="#60a5fa" />
            </div>
          </div>
        </div>

        {/* Platform mix + Top campaigns */}
        <div className="chart-grid-2">

          {/* Platform mix */}
          <div style={card}>
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#52525b' }}>
                Platform Mix
              </p>
            </div>
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
              {!data || data.platformDistribution.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 10 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <BarChart3 size={18} strokeWidth={1.5} style={{ color: '#52525b' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#71717a' }}>No platform data yet</p>
                    <p style={{ fontSize: 12, color: '#3f3f46', marginTop: 3 }}>Create campaigns to see platform breakdown</p>
                  </div>
                </div>
              ) : (
                data.platformDistribution.map((p) => {
                  const color = platformColors[p.platform] ?? '#71717a'
                  return (
                    <div key={p.platform}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ height: 8, width: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                          <span style={{ fontSize: 14, fontWeight: 500, color: '#e4e4e7' }}>{p.platform}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 12, color: '#52525b' }}>{p.count} campaign{p.count !== 1 ? 's' : ''}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color }}>{p.pct}%</span>
                        </div>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            borderRadius: 2,
                            width: `${p.pct}%`,
                            background: `linear-gradient(90deg, ${color}80, ${color})`,
                            transition: 'width 600ms ease',
                          }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Top campaigns by reach */}
          <div style={card}>
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#52525b' }}>
                Top Campaigns by Reach
              </p>
            </div>
            <div style={{ padding: '12px 16px' }}>
              {!data || data.topByReach.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', gap: 10 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <BarChart3 size={18} strokeWidth={1.5} style={{ color: '#52525b' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#71717a' }}>No reach data yet</p>
                    <p style={{ fontSize: 12, color: '#3f3f46', marginTop: 3 }}>Set reach values on campaigns to see rankings</p>
                  </div>
                </div>
              ) : (
                data.topByReach.map((c, i) => (
                  <div
                    key={c.id}
                    className="transition-colors hover:bg-muted/30"
                    style={{ display: 'flex', alignItems: 'center', gap: 16, borderRadius: 8, padding: '14px 12px' }}
                  >
                    <span style={{ width: 20, textAlign: 'center', fontSize: 12, fontWeight: 700, color: i === 0 ? '#fbbf24' : '#3f3f46', flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.name}
                      </p>
                      <p style={{ marginTop: 3, fontSize: 12, color: '#52525b' }}>{c.platform} · {c.brand}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#a1a1aa' }}>{formatReach(c.reach)}</span>
                      {c.engagement > 0 && (
                        <span style={{ fontSize: 11, fontWeight: 600, borderRadius: 20, padding: '2px 8px', background: 'rgba(34,197,94,0.08)', color: '#4ade80' }}>
                          {c.engagement.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
