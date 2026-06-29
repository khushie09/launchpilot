'use client'

import { UserPlus, ExternalLink, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { creators, type Creator } from '@/lib/mock-data'

// ── Config ────────────────────────────────────────────────────────────────────
const platformGradients: Record<string, string> = {
  Instagram: 'linear-gradient(135deg, #f472b6 0%, #a855f7 100%)',
  TikTok:    'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)',
  YouTube:   'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
  Twitter:   'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
  LinkedIn:  'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
}

const platformColors: Record<string, string> = {
  Instagram: '#f472b6',
  TikTok:    '#22d3ee',
  YouTube:   '#f87171',
  Twitter:   '#38bdf8',
  LinkedIn:  '#60a5fa',
}

const statusConfig = {
  Available: { bg: 'rgba(34,197,94,0.08)',   text: '#4ade80'  },
  Busy:      { bg: 'rgba(245,158,11,0.08)',  text: '#fbbf24'  },
  Review:    { bg: 'rgba(113,113,122,0.08)', text: '#a1a1aa'  },
}

const cardStyle = {
  background: '#0f0f13',
  boxShadow: '0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
}

// ── Creator card ──────────────────────────────────────────────────────────────
function CreatorCard({ creator }: { creator: Creator }) {
  const sc = statusConfig[creator.status]
  const gradient = platformGradients[creator.platform] ?? 'linear-gradient(135deg, #6366f1, #4f46e5)'
  const platformColor = platformColors[creator.platform] ?? '#818cf8'

  return (
    <Card
      className="border-border/60 transition-all duration-200 group"
      style={{
        ...cardStyle,
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          '0 4px 12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = ''
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          '0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)'
      }}
    >
      <CardContent className="p-5">
        {/* Top row: avatar + status */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            {/* Avatar */}
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-[15px] font-semibold text-white"
              style={{ background: gradient, boxShadow: `0 4px 12px rgba(0,0,0,0.4)` }}
            >
              {creator.avatar}
            </div>
            {/* Platform dot */}
            <div
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-card"
              style={{ background: '#0f0f13', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: platformColor }}
              />
            </div>
          </div>
          {/* Status badge */}
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ background: sc.bg, color: sc.text }}
          >
            {creator.status}
          </span>
        </div>

        {/* Name + handle */}
        <p className="text-[14px] font-semibold text-foreground leading-none">{creator.name}</p>
        <p className="mt-0.5 text-[12px] text-muted-foreground/60">{creator.handle}</p>

        {/* Platform + niche */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium"
            style={{ background: `${platformColor}14`, color: platformColor }}
          >
            {creator.platform}
          </span>
          <span className="text-[10px] text-muted-foreground/50">·</span>
          <span className="text-[11px] text-muted-foreground/60 truncate">{creator.niche}</span>
        </div>

        {/* Stats */}
        <div
          className="mt-4 flex rounded-lg overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="flex-1 px-3 py-2.5 border-r border-r-[rgba(255,255,255,0.05)]">
            <p className="text-[13px] font-semibold text-foreground tabular-nums">{creator.followers}</p>
            <p className="text-[10px] text-muted-foreground/50 mt-0.5">Followers</p>
          </div>
          <div className="flex-1 px-3 py-2.5 border-r border-r-[rgba(255,255,255,0.05)]">
            <p className="text-[13px] font-semibold text-foreground tabular-nums">{creator.engagement}</p>
            <p className="text-[10px] text-muted-foreground/50 mt-0.5">Engagement</p>
          </div>
          <div className="flex-1 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground tabular-nums">{creator.campaigns}</p>
            <p className="text-[10px] text-muted-foreground/50 mt-0.5">Campaigns</p>
          </div>
        </div>

        {/* Earned */}
        <p className="mt-3 text-[11px] text-muted-foreground/50">
          Total earned:{' '}
          <span className="font-semibold text-muted-foreground">
            ${creator.totalEarned.toLocaleString()}
          </span>
        </p>

        {/* CTAs */}
        <div className="mt-4 flex gap-2">
          <button
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-medium text-muted-foreground transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'transparent' }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
              ;(e.currentTarget as HTMLElement).style.color = '#f4f4f5'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = ''
            }}
          >
            <MessageSquare size={12} strokeWidth={1.8} />
            Message
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-medium text-indigo-300 transition-all"
            style={{ border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.08)' }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.15)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.4)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.08)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.25)'
            }}
          >
            <ExternalLink size={11} strokeWidth={2} />
            View Profile
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function CreatorsPage() {
  const available = creators.filter((c) => c.status === 'Available').length
  const busy = creators.filter((c) => c.status === 'Busy').length

  return (
    <div className="space-y-6 p-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Creators</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {creators.length} creators · {available} available · {busy} busy
          </p>
        </div>
        <Button
          className="gap-2 text-[13px] font-medium"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none' }}
        >
          <UserPlus size={14} strokeWidth={2} />
          Invite Creator
        </Button>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {creators.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    </div>
  )
}
