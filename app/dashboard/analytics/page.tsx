import { TrendingUp, TrendingDown, Eye, MousePointerClick, FileVideo, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
  const barH = 200

  return (
    <div className="flex items-end gap-1.5" style={{ height: barH + 28 }}>
      {data.map((d, i) => {
        const pct = (d[valueKey] / max) * 100
        const isRecent = i >= data.length - 3
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
                    : isRecent
                      ? `${color}28`
                      : `${color}10`,
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

// ── Data ──────────────────────────────────────────────────────────────────────
const platformData = [
  { label: 'YouTube',   count: 3, pct: 37, color: '#f87171' },
  { label: 'Instagram', count: 3, pct: 37, color: '#f472b6' },
  { label: 'TikTok',    count: 2, pct: 25, color: '#22d3ee' },
]

const topMetrics = [
  { label: 'Total Impressions', value: '4.2M',  change: '+18%',   trend: 'up',   icon: Eye,               iconColor: '#818cf8' },
  { label: 'Avg. Engagement',   value: '5.3%',  change: '+0.6%',  trend: 'up',   icon: MousePointerClick, iconColor: '#4ade80' },
  { label: 'Content Pieces',    value: '94',    change: '+12',    trend: 'up',   icon: FileVideo,          iconColor: '#fbbf24' },
  { label: 'Avg. CPM',          value: '$4.20', change: '-$0.40', trend: 'down', icon: Target,             iconColor: '#f87171' },
]

const card = {
  background: '#0f0f13',
  border: '1px solid rgba(255,255,255,0.055)',
  borderRadius: 14,
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  return (
    <div style={{ padding: '32px 48px 48px 112px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', color: '#f4f4f5', lineHeight: 1.1 }}>
            Analytics
          </h1>
          <p style={{ marginTop: 8, fontSize: 14, color: '#71717a' }}>
            Performance overview across all campaigns · June 2026
          </p>
        </div>

        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {topMetrics.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.label} style={{ ...card, padding: '24px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                  <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#52525b' }}>
                    {m.label}
                  </p>
                  <Icon size={14} strokeWidth={1.8} style={{ color: '#3f3f46' }} />
                </div>
                <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', color: '#f4f4f5', lineHeight: 1 }}>
                  {m.value}
                </p>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {m.trend === 'up'
                    ? <TrendingUp size={11} strokeWidth={2} style={{ color: '#4ade80' }} />
                    : <TrendingDown size={11} strokeWidth={2} style={{ color: '#f87171' }} />
                  }
                  <span style={{ fontSize: 12, fontWeight: 600, color: m.trend === 'up' ? '#4ade80' : '#f87171' }}>
                    {m.change}
                  </span>
                  <span style={{ fontSize: 12, color: '#52525b' }}>this month</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Revenue + Campaigns charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {[
            { title: 'Monthly Revenue', value: '$420,700', valueKey: 'revenue' as const, color: '#6366f1', accent: '#818cf8' },
            { title: 'Campaigns Launched', value: '112 total', valueKey: 'campaigns' as const, color: '#3b82f6', accent: '#60a5fa' },
          ].map((chart) => (
            <div key={chart.title} style={card}>
              <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#52525b' }}>
                  {chart.title}
                </p>
                <p style={{ marginTop: 8, fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#f4f4f5', lineHeight: 1 }}>
                  {chart.value}
                </p>
              </div>
              <div style={{ padding: '24px 28px 20px' }}>
                <BarChart data={monthlyRevenue} valueKey={chart.valueKey} color={chart.color} accentColor={chart.accent} />
              </div>
            </div>
          ))}
        </div>

        {/* Platform mix + Top campaigns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>

          {/* Platform mix */}
          <div style={card}>
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#52525b' }}>
                Platform Mix
              </p>
            </div>
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
              {platformData.map((p) => (
                <div key={p.label}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ height: 8, width: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#e4e4e7' }}>{p.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, color: '#52525b' }}>{p.count} campaigns</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: p.color }}>{p.pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 2,
                        width: `${p.pct}%`,
                        background: `linear-gradient(90deg, ${p.color}80, ${p.color})`,
                        transition: 'width 600ms ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top campaigns by reach */}
          <div style={card}>
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#52525b' }}>
                Top Campaigns by Reach
              </p>
            </div>
            <div style={{ padding: '12px 16px' }}>
              {campaigns
                .filter((c) => c.reach !== '—')
                .sort((a, b) => {
                  const toNum = (s: string) =>
                    parseFloat(s.replace(/[KM]/g, '')) * (s.includes('M') ? 1000 : 1)
                  return toNum(b.reach) - toNum(a.reach)
                })
                .slice(0, 5)
                .map((c, i) => (
                  <div
                    key={c.id}
                    className="transition-colors hover:bg-muted/30"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      borderRadius: 8,
                      padding: '14px 12px',
                    }}
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
                      <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#a1a1aa' }}>{c.reach}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          borderRadius: 20,
                          padding: '2px 8px',
                          background: 'rgba(34,197,94,0.08)',
                          color: '#4ade80',
                        }}
                      >
                        {c.engagement}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
