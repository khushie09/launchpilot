'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Pencil, Trash2, TrendingUp, Megaphone } from 'lucide-react'
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
import { CampaignDialog } from '@/components/dashboard/CampaignDialog'
import { deleteCampaign, type CampaignWithCreator } from '@/app/actions/campaigns'

// ── Config ────────────────────────────────────────────────────────────────────
const statusConfig = {
  Active:    { bg: 'rgba(34,197,94,0.08)',   text: '#4ade80', dot: '#22c55e' },
  Review:    { bg: 'rgba(245,158,11,0.08)',  text: '#fbbf24', dot: '#f59e0b' },
  Draft:     { bg: 'rgba(113,113,122,0.08)', text: '#a1a1aa', dot: '#71717a' },
  Completed: { bg: 'rgba(99,102,241,0.08)',  text: '#818cf8', dot: '#6366f1' },
  Paused:    { bg: 'rgba(113,113,122,0.06)', text: '#71717a', dot: '#52525b' },
} as const

const platformConfig = {
  Instagram: { bg: 'rgba(244,114,182,0.08)', text: '#f472b6' },
  TikTok:    { bg: 'rgba(34,211,238,0.08)',  text: '#22d3ee' },
  YouTube:   { bg: 'rgba(248,113,113,0.08)', text: '#f87171' },
  Twitter:   { bg: 'rgba(56,189,248,0.08)',  text: '#38bdf8' },
  LinkedIn:  { bg: 'rgba(96,165,250,0.08)',  text: '#60a5fa' },
} as const

const card = {
  background: '#0f0f13',
  border: '1px solid rgba(255,255,255,0.055)',
  borderRadius: 14,
} as const

// ── Delete button with confirmation ───────────────────────────────────────────
function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  function handleClick() {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
      return
    }
    startTransition(async () => {
      const result = await deleteCampaign(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`"${name}" deleted.`)
        router.refresh()
      }
      setConfirming(false)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={confirming ? 'Click again to confirm' : 'Delete campaign'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 6,
        border: confirming ? '1px solid rgba(248,113,113,0.4)' : '1px solid transparent',
        background: confirming ? 'rgba(248,113,113,0.1)' : 'transparent',
        color: confirming ? '#f87171' : '#52525b',
        cursor: isPending ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        flexShrink: 0,
      }}
    >
      <Trash2 size={13} strokeWidth={1.8} />
    </button>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 32px',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: 'rgba(99,102,241,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Megaphone size={20} strokeWidth={1.5} style={{ color: '#818cf8' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#e4e4e7' }}>No campaigns yet</p>
        <p style={{ marginTop: 6, fontSize: 13, color: '#52525b' }}>
          Create your first campaign to get started.
        </p>
      </div>
      <Button
        onClick={onNew}
        style={{ background: '#6366f1', color: '#fff', marginTop: 4 }}
      >
        New Campaign
      </Button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface CampaignsClientProps {
  campaigns: CampaignWithCreator[]
}

export function CampaignsClient({ campaigns }: CampaignsClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<CampaignWithCreator | null>(null)

  function openCreate() {
    setEditingCampaign(null)
    setDialogOpen(true)
  }

  function openEdit(campaign: CampaignWithCreator) {
    setEditingCampaign(campaign)
    setDialogOpen(true)
  }

  const statusCounts = campaigns.reduce(
    (acc, c) => ({ ...acc, [c.status]: (acc[c.status] ?? 0) + 1 }),
    {} as Record<string, number>,
  )

  return (
    <div style={{ padding: '32px 48px 48px 112px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', color: '#f4f4f5', lineHeight: 1.1 }}>
              Campaigns
            </h1>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 16 }}>
              {(['Active', 'Review', 'Draft', 'Completed'] as const).map((s) => {
                const c = statusConfig[s]
                const count = statusCounts[s] ?? 0
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ height: 6, width: 6, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#71717a' }}>{count} {s.toLowerCase()}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <Button
            onClick={openCreate}
            className="px-4"
            style={{ background: '#6366f1', color: '#fff' }}
          >
            New Campaign
          </Button>
        </div>

        {/* Table */}
        <Card style={card}>
          <CardContent className="p-0">
            {campaigns.length === 0 ? (
              <EmptyState onNew={openCreate} />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor: 'rgba(255,255,255,0.05)' }} className="hover:bg-transparent">
                      {[
                        { label: 'Campaign', pl: 32 },
                        { label: 'Creator' },
                        { label: 'Platform' },
                        { label: 'Status' },
                        { label: 'Budget' },
                        { label: 'Spend' },
                        { label: 'Reach' },
                        { label: '' },
                      ].map((h) => (
                        <TableHead
                          key={h.label}
                          style={{
                            paddingLeft: h.pl,
                            paddingTop: 18,
                            paddingBottom: 18,
                            fontSize: 11,
                            fontWeight: 500,
                            textTransform: 'uppercase' as const,
                            letterSpacing: '0.07em',
                            color: '#3f3f46',
                          }}
                        >
                          {h.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((c) => {
                      const sc = statusConfig[c.status as keyof typeof statusConfig] ?? statusConfig.Draft
                      const pc = platformConfig[c.platform as keyof typeof platformConfig] ?? { bg: 'rgba(113,113,122,0.08)', text: '#a1a1aa' }
                      const spendPct = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0
                      const creatorName = c.creator?.name ?? null
                      const creatorInitials = creatorName
                        ? creatorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                        : null

                      return (
                        <TableRow
                          key={c.id}
                          style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                          className="transition-colors hover:bg-muted/40"
                        >
                          <TableCell style={{ paddingLeft: 32, paddingTop: 22, paddingBottom: 22 }}>
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
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                borderRadius: 20,
                                padding: '4px 10px',
                                fontSize: 11,
                                fontWeight: 500,
                                background: pc.bg,
                                color: pc.text,
                              }}
                            >
                              {c.platform}
                            </span>
                          </TableCell>
                          <TableCell style={{ paddingTop: 22, paddingBottom: 22 }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                borderRadius: 20,
                                padding: '4px 10px',
                                fontSize: 11,
                                fontWeight: 500,
                                background: sc.bg,
                                color: sc.text,
                              }}
                            >
                              <span style={{ height: 6, width: 6, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                              {c.status}
                            </span>
                          </TableCell>
                          <TableCell style={{ paddingTop: 22, paddingBottom: 22, fontFamily: 'monospace', fontSize: 13, color: '#a1a1aa' }}>
                            ${c.budget.toLocaleString()}
                          </TableCell>
                          <TableCell style={{ paddingTop: 22, paddingBottom: 22 }}>
                            {c.spent > 0 ? (
                              <div>
                                <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#a1a1aa' }}>
                                  ${c.spent.toLocaleString()}
                                </span>
                                <div style={{ marginTop: 6, height: 3, width: 80, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                                  <div
                                    style={{
                                      height: '100%',
                                      borderRadius: 2,
                                      width: `${Math.min(spendPct, 100)}%`,
                                      background: spendPct > 90 ? '#f87171' : spendPct > 70 ? '#fbbf24' : '#818cf8',
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span style={{ fontSize: 12, color: '#3f3f46' }}>—</span>
                            )}
                          </TableCell>
                          <TableCell style={{ paddingTop: 22, paddingBottom: 22 }}>
                            {c.reach > 0 ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#a1a1aa' }}>
                                  {c.reach >= 1000 ? `${(c.reach / 1000).toFixed(0)}K` : c.reach}
                                </span>
                                {c.engagement > 0 && (
                                  <>
                                    <TrendingUp size={10} style={{ color: '#4ade80' }} />
                                    <span style={{ fontSize: 12, color: '#4ade80' }}>{c.engagement.toFixed(1)}%</span>
                                  </>
                                )}
                              </div>
                            ) : (
                              <span style={{ fontSize: 12, color: '#3f3f46' }}>—</span>
                            )}
                          </TableCell>
                          <TableCell style={{ paddingRight: 24, paddingTop: 22, paddingBottom: 22 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <button
                                onClick={() => openEdit(c)}
                                title="Edit campaign"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 28,
                                  height: 28,
                                  borderRadius: 6,
                                  border: '1px solid transparent',
                                  background: 'transparent',
                                  color: '#52525b',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s',
                                  flexShrink: 0,
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
                                <Pencil size={13} strokeWidth={1.8} />
                              </button>
                              <DeleteButton id={c.id} name={c.name} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      <CampaignDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        campaign={editingCampaign}
      />
    </div>
  )
}
