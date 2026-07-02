'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
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
  return name.split(' ').map((w) => w[0] ?? '').join('').slice(0, 2).toUpperCase()
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
        border: confirming ? '1px solid rgba(248,113,113,0.35)' : '1px solid transparent',
        background: confirming ? 'rgba(248,113,113,0.08)' : 'transparent',
        color: confirming ? '#f87171' : '#3f3f46',
        cursor: isPending ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s', flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!confirming) {
          e.currentTarget.style.color = '#f87171'
          e.currentTarget.style.background = 'rgba(248,113,113,0.07)'
        }
      }}
      onMouseLeave={(e) => {
        if (!confirming) {
          e.currentTarget.style.color = '#3f3f46'
          e.currentTarget.style.background = 'transparent'
        }
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
      style={{
        ...card,
        cursor: 'default',
        transition: 'border-color 200ms, box-shadow 200ms, transform 200ms',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(255,255,255,0.1)'
        el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)'
        el.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(255,255,255,0.055)'
        el.style.boxShadow = 'none'
        el.style.transform = 'translateY(0)'
      }}
    >
      <CardContent style={{ padding: '26px' }}>
        {/* Avatar + status + actions */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              height: 50, width: 50, borderRadius: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, color: 'white', background: gradient,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>
              {initials(creator.name)}
            </div>
            <div style={{
              position: 'absolute', bottom: -4, right: -4,
              height: 18, width: 18, borderRadius: '50%',
              background: '#0f0f13', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ height: 8, width: 8, borderRadius: '50%', background: platformColor }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', borderRadius: 20,
              padding: '3px 9px', fontSize: 11, fontWeight: 500,
              background: sc.bg, color: sc.text,
            }}>
              {creator.status}
            </span>
            <button
              onClick={() => onEdit(creator)}
              title="Edit creator"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 26, height: 26, borderRadius: 6,
                border: '1px solid transparent', background: 'transparent',
                color: '#3f3f46', cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
                e.currentTarget.style.color = '#a1a1aa'
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid transparent'
                e.currentTarget.style.color = '#3f3f46'
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
        <div style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', borderRadius: 6,
            padding: '2px 8px', fontSize: 11, fontWeight: 500,
            background: `${platformColor}14`, color: platformColor,
          }}>
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
        <div style={{
          marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)',
        }}>
          {[
            { label: 'Followers',   value: formatFollowers(creator.followersCount) },
            { label: 'Engagement',  value: creator.engagementRate > 0 ? `${creator.engagementRate.toFixed(1)}%` : '—' },
            { label: 'Campaigns',   value: String(campaignCount) },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: '11px 12px',
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
        <p style={{ marginTop: 13, fontSize: 12, color: '#52525b' }}>
          Total earned:{' '}
          <span style={{ color: creator.totalEarned > 0 ? '#a1a1aa' : '#3f3f46', fontWeight: 500 }}>
            {creator.totalEarned > 0 ? `$${creator.totalEarned.toLocaleString()}` : '—'}
          </span>
        </p>

        {/* CTAs */}
        <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
          <button
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: 500,
              color: '#71717a', border: '1px solid rgba(255,255,255,0.07)',
              background: 'transparent', cursor: 'pointer',
              transition: 'background 140ms, color 140ms, border-color 140ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.color = '#e4e4e7'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#71717a'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
            }}
          >
            <MessageSquare size={12} strokeWidth={1.8} />
            Message
          </button>
          <button
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: 500,
              color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)',
              background: 'rgba(99,102,241,0.06)', cursor: 'pointer',
              transition: 'background 140ms, border-color 140ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.12)'
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.06)'
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'
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

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '96px 32px', gap: 0,
      background: '#0f0f13', border: '1px solid rgba(255,255,255,0.055)',
      borderRadius: 14,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16, marginBottom: 20,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.16) 0%, rgba(99,102,241,0.05) 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 8px rgba(99,102,241,0.04)',
      }}>
        <Users size={22} strokeWidth={1.5} style={{ color: '#818cf8' }} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: '#e4e4e7', marginBottom: 8, letterSpacing: '-0.01em' }}>
        No creators yet
      </p>
      <p style={{ fontSize: 13, color: '#52525b', marginBottom: 24, textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
        Add creators to your network to manage collaborations, track performance, and send payments.
      </p>
      <Button
        onClick={onAdd}
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: '#fff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
          gap: 6,
        }}
      >
        <UserPlus size={13} strokeWidth={2} />
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
    <div className="dash-page">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* Header */}
        <div className="page-header">
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
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#fff',
              gap: 6,
              boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.25), 0 0 0 3px rgba(99,102,241,0.25)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.25)' }}
          >
            <UserPlus size={13} strokeWidth={2} />
            Add Creator
          </Button>
        </div>

        {/* Grid or empty state */}
        {creators.length === 0 ? (
          <EmptyState onAdd={openCreate} />
        ) : (
          <div className="creators-grid">
            {creators.map((creator, i) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.055, ease: [0.16, 1, 0.3, 1] }}
              >
                <CreatorCard creator={creator} onEdit={openEdit} />
              </motion.div>
            ))}
          </div>
        )}

      </div>

      <CreatorDialog open={dialogOpen} onOpenChange={setDialogOpen} creator={editing} />
    </div>
  )
}
