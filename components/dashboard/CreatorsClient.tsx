'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UserPlus, ExternalLink, MessageSquare, Pencil, Trash2, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreatorDialog } from '@/components/dashboard/CreatorDialog'
import { deleteCreator, type CreatorWithCount } from '@/app/actions/creators'

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

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
  Available: { bg: 'rgba(34,197,94,0.08)',   text: '#4ade80' },
  Busy:      { bg: 'rgba(245,158,11,0.08)',  text: '#fbbf24' },
  Review:    { bg: 'rgba(113,113,122,0.08)', text: '#a1a1aa' },
} as const

const card = {
  background: '#0f0f13',
  border: '1px solid rgba(255,255,255,0.055)',
  borderRadius: 14,
} as const

// ── Delete button ─────────────────────────────────────────────────────────────
function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
      return
    }
    startTransition(async () => {
      const result = await deleteCreator(id)
      if (result.error) toast.error(result.error)
      else { toast.success(`"${name}" removed.`); router.refresh() }
      setConfirming(false)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={confirming ? 'Click again to confirm' : 'Remove creator'}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 26, height: 26, borderRadius: 6,
        border: confirming ? '1px solid rgba(248,113,113,0.4)' : '1px solid transparent',
        background: confirming ? 'rgba(248,113,113,0.1)' : 'transparent',
        color: confirming ? '#f87171' : '#52525b',
        cursor: isPending ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      <Trash2 size={12} strokeWidth={1.8} />
    </button>
  )
}

// ── Creator card ──────────────────────────────────────────────────────────────
function CreatorCard({
  creator,
  onEdit,
}: {
  creator: CreatorWithCount
  onEdit: (c: CreatorWithCount) => void
}) {
  const sc = statusConfig[creator.status as keyof typeof statusConfig] ?? statusConfig.Review
  const gradient = platformGradients[creator.platform] ?? 'linear-gradient(135deg, #6366f1, #4f46e5)'
  const platformColor = platformColors[creator.platform] ?? '#818cf8'
  const campaignCount = creator._count.campaigns

  return (
    <Card
      style={{ ...card, cursor: 'default', transition: 'border-color 180ms' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.055)' }}
    >
      <CardContent style={{ padding: '28px' }}>
        {/* Avatar + status + actions */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                height: 52, width: 52, borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: 'white', background: gradient,
              }}
            >
              {initials(creator.name)}
            </div>
            <div
              style={{
                position: 'absolute', bottom: -4, right: -4,
                height: 18, width: 18, borderRadius: '50%',
                background: '#0f0f13', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{ height: 8, width: 8, borderRadius: '50%', background: platformColor }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', borderRadius: 20,
                padding: '3px 9px', fontSize: 11, fontWeight: 500,
                background: sc.bg, color: sc.text,
              }}
            >
              {creator.status}
            </span>
            <button
              onClick={() => onEdit(creator)}
              title="Edit creator"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 26, height: 26, borderRadius: 6,
                border: '1px solid transparent', background: 'transparent',
                color: '#52525b', cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'
                e.currentTarget.style.color = '#a1a1aa'
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid transparent'
                e.currentTarget.style.color = '#52525b'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <Pencil size={12} strokeWidth={1.8} />
            </button>
            <DeleteButton id={creator.id} name={creator.name} />
          </div>
        </div>

        {/* Name + handle */}
        <p style={{ fontSize: 15, fontWeight: 600, color: '#f4f4f5', lineHeight: 1.2 }}>{creator.name}</p>
        <p style={{ marginTop: 3, fontSize: 12, color: '#52525b' }}>{creator.handle}</p>

        {/* Platform + niche */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', borderRadius: 6,
              padding: '2px 8px', fontSize: 11, fontWeight: 500,
              background: `${platformColor}14`, color: platformColor,
            }}
          >
            {creator.platform}
          </span>
          {creator.niche && (
            <>
              <span style={{ fontSize: 12, color: '#3f3f46' }}>·</span>
              <span style={{ fontSize: 12, color: '#52525b' }}>{creator.niche}</span>
            </>
          )}
        </div>

        {/* Stats grid */}
        <div
          style={{
            marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {[
            { label: 'Followers',  value: formatFollowers(creator.followersCount) },
            { label: 'Engagement', value: creator.engagementRate > 0 ? `${creator.engagementRate.toFixed(1)}%` : '—' },
            { label: 'Campaigns',  value: String(campaignCount) },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: '12px 14px',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                background: 'rgba(255,255,255,0.015)',
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7', lineHeight: 1 }}>{s.value}</p>
              <p style={{ marginTop: 4, fontSize: 11, color: '#52525b' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Earned */}
        <p style={{ marginTop: 14, fontSize: 12, color: '#52525b' }}>
          Earned:{' '}
          <span style={{ color: '#a1a1aa', fontWeight: 500 }}>
            {creator.totalEarned > 0 ? `$${creator.totalEarned.toLocaleString()}` : '—'}
          </span>
        </p>

        {/* CTAs */}
        <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
          <button
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, borderRadius: 8, padding: '9px 0', fontSize: 12, fontWeight: 500,
              color: '#71717a', border: '1px solid rgba(255,255,255,0.07)',
              background: 'transparent', cursor: 'pointer', transition: 'background 140ms, color 140ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#f4f4f5' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717a' }}
          >
            <MessageSquare size={12} strokeWidth={1.8} />
            Message
          </button>
          <button
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, borderRadius: 8, padding: '9px 0', fontSize: 12, fontWeight: 500,
              color: '#818cf8', border: '1px solid rgba(99,102,241,0.22)',
              background: 'rgba(99,102,241,0.07)', cursor: 'pointer', transition: 'background 140ms, border-color 140ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.14)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.36)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.07)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.22)' }}
          >
            <ExternalLink size={11} strokeWidth={2} />
            View Profile
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '80px 32px', gap: 16,
      background: '#0f0f13', border: '1px solid rgba(255,255,255,0.055)',
      borderRadius: 14,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'rgba(99,102,241,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Users size={20} strokeWidth={1.5} style={{ color: '#818cf8' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#e4e4e7' }}>No creators yet</p>
        <p style={{ marginTop: 6, fontSize: 13, color: '#52525b' }}>Add your first creator to build your network.</p>
      </div>
      <Button onClick={onAdd} style={{ background: '#6366f1', color: '#fff', marginTop: 4 }}>
        Add Creator
      </Button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface CreatorsClientProps {
  creators: CreatorWithCount[]
}

export function CreatorsClient({ creators }: CreatorsClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<CreatorWithCount | null>(null)

  function openCreate() { setEditing(null); setDialogOpen(true) }
  function openEdit(c: CreatorWithCount) { setEditing(c); setDialogOpen(true) }

  const available = creators.filter((c) => c.status === 'Available').length
  const busy = creators.filter((c) => c.status === 'Busy').length

  return (
    <div style={{ padding: '32px 48px 48px 112px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', color: '#f4f4f5', lineHeight: 1.1 }}>
              Creators
            </h1>
            <p style={{ marginTop: 8, fontSize: 14, color: '#71717a' }}>
              {creators.length} total · {available} available · {busy} busy
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="gap-2 text-[13px] font-medium"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', height: 38 }}
          >
            <UserPlus size={14} strokeWidth={2} />
            Add Creator
          </Button>
        </div>

        {/* Grid or empty state */}
        {creators.length === 0 ? (
          <EmptyState onAdd={openCreate} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {creators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} onEdit={openEdit} />
            ))}
          </div>
        )}

      </div>

      <CreatorDialog open={dialogOpen} onOpenChange={setDialogOpen} creator={editing} />
    </div>
  )
}
