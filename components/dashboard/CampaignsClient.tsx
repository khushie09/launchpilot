'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Pencil, Trash2, TrendingUp, Megaphone, ArrowRight } from 'lucide-react'
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
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 28, height: 28, borderRadius: 6,
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
      <Trash2 size={13} strokeWidth={1.8} />
    </button>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '96px 32px', gap: 0,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16, marginBottom: 20,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.16) 0%, rgba(99,102,241,0.05) 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 8px rgba(99,102,241,0.04)',
      }}>
        <Megaphone size={22} strokeWidth={1.5} style={{ color: '#818cf8' }} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: '#e4e4e7', marginBottom: 8, letterSpacing: '-0.01em' }}>
        No campaigns yet
      </p>
      <p style={{ fontSize: 13, color: '#52525b', marginBottom: 24, textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
        Create your first campaign to start managing creator collaborations and tracking performance.
      </p>
      <Button
        onClick={onNew}
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: '#fff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
          gap: 6,
        }}
      >
        <Megaphone size={13} strokeWidth={2} />
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
    <div className="dash-page">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', color: '#f4f4f5', lineHeight: 1.1 }}>
              Campaigns
            </h1>
            <div className="status-counts" style={{ marginTop: 10 }}>
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
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#fff',
              gap: 6,
              boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.25), 0 0 0 3px rgba(99,102,241,0.25)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.25)' }}
          >
            <Megaphone size={13} strokeWidth={2} />
            New Campaign
          </Button>
        </div>

        {/* Table */}
        <Card
          style={card}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.055)' }}
        >
          <CardContent className="p-0">
            {campaigns.length === 0 ? (
              <EmptyState onNew={openCreate} />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor: 'rgba(255,255,255,0.04)' }} className="hover:bg-transparent">
                      {[
                        { label: 'Campaign', pl: 28 },
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
                            paddingTop: 14,
                            paddingBottom: 14,
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
                          className="table-row-fade transition-colors hover:bg-white/[0.025]"
                          style={{ borderColor: 'rgba(255,255,255,0.035)' }}
                        >
                          <TableCell style={{ paddingLeft: 28, paddingTop: 18, paddingBottom: 18 }}>
                            <p style={{ fontSize: 13, fontWeight: 500, color: '#e4e4e7', lineHeight: 1 }}>{c.name}</p>
                            <p style={{ marginTop: 4, fontSize: 12, color: '#52525b' }}>{c.brand}</p>
                          </TableCell>
                          <TableCell style={{ paddingTop: 18, paddingBottom: 18 }}>
                            {creatorName ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
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
                          <TableCell style={{ paddingTop: 18, paddingBottom: 18 }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center',
                              borderRadius: 20, padding: '3px 9px',
                              fontSize: 11, fontWeight: 500,
                              background: pc.bg, color: pc.text,
                            }}>
                              {c.platform}
                            </span>
                          </TableCell>
                          <TableCell style={{ paddingTop: 18, paddingBottom: 18 }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              borderRadius: 20, padding: '3px 9px',
                              fontSize: 11, fontWeight: 500,
                              background: sc.bg, color: sc.text,
                            }}>
                              <span style={{ height: 5, width: 5, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                              {c.status}
                            </span>
                          </TableCell>
                          <TableCell style={{ paddingTop: 18, paddingBottom: 18, fontFamily: 'monospace', fontSize: 13, color: '#a1a1aa' }}>
                            ${c.budget.toLocaleString()}
                          </TableCell>
                          <TableCell style={{ paddingTop: 18, paddingBottom: 18 }}>
                            {c.spent > 0 ? (
                              <div>
                                <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#a1a1aa' }}>
                                  ${c.spent.toLocaleString()}
                                </span>
                                <div style={{ marginTop: 5, height: 3, width: 72, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                  <div style={{
                                    height: '100%', borderRadius: 2,
                                    width: `${Math.min(spendPct, 100)}%`,
                                    background: spendPct > 90 ? '#f87171' : spendPct > 70 ? '#fbbf24' : '#818cf8',
                                    transition: 'width 600ms ease',
                                  }} />
                                </div>
                              </div>
                            ) : (
                              <span style={{ fontSize: 12, color: '#3f3f46' }}>—</span>
                            )}
                          </TableCell>
                          <TableCell style={{ paddingTop: 18, paddingBottom: 18 }}>
                            {c.reach > 0 ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
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
                          <TableCell style={{ paddingRight: 20, paddingTop: 18, paddingBottom: 18 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <button
                                onClick={() => openEdit(c)}
                                title="Edit campaign"
                                style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  width: 28, height: 28, borderRadius: 6,
                                  border: '1px solid transparent', background: 'transparent',
                                  color: '#3f3f46', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
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
                {campaigns.length > 0 && (
                  <div style={{
                    padding: '12px 28px',
                    borderTop: '1px solid rgba(255,255,255,0.035)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: 12, color: '#3f3f46' }}>
                      {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
                    </span>
                    <span style={{ fontSize: 12, color: '#52525b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Total budget: <span style={{ fontFamily: 'monospace', color: '#71717a', marginLeft: 4 }}>
                        ${campaigns.reduce((s, c) => s + c.budget, 0).toLocaleString()}
                      </span>
                      <ArrowRight size={11} style={{ color: '#3f3f46' }} />
                    </span>
                  </div>
                )}
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
