'use client'

import { useState, useTransition, useOptimistic } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DollarSign, Pencil, Trash2, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { PaymentDialog } from '@/components/dashboard/PaymentDialog'
import {
  deletePayment,
  updatePaymentStatus,
  type PaymentWithRelations,
  type PaymentFormData,
} from '@/app/actions/payments'

// ── Config ────────────────────────────────────────────────────────────────────
const statusConfig = {
  Paid:       { bg: 'rgba(34,197,94,0.08)',   text: '#4ade80', dot: '#22c55e' },
  Pending:    { bg: 'rgba(245,158,11,0.08)',  text: '#fbbf24', dot: '#f59e0b' },
  Processing: { bg: 'rgba(99,102,241,0.08)',  text: '#818cf8', dot: '#6366f1' },
  Failed:     { bg: 'rgba(239,68,68,0.08)',   text: '#f87171', dot: '#ef4444' },
} as const

const card = {
  background: '#0f0f13',
  border: '1px solid rgba(255,255,255,0.055)',
  borderRadius: 14,
} as const

// ── Helpers ───────────────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(' ').map((w) => w[0] ?? '').join('').slice(0, 2).toUpperCase()
}

function fmt(n: number) { return `$${n.toLocaleString()}` }

function fmtDate(d: Date | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Delete button ─────────────────────────────────────────────────────────────
function DeleteButton({ id, amount }: { id: string; amount: number }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  function handleClick() {
    if (!confirming) { setConfirming(true); setTimeout(() => setConfirming(false), 3000); return }
    startTransition(async () => {
      const result = await deletePayment(id)
      if (result.error) toast.error(result.error)
      else { toast.success(`Payment of ${fmt(amount)} deleted.`); router.refresh() }
      setConfirming(false)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={confirming ? 'Click again to confirm' : 'Delete payment'}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 28, height: 28, borderRadius: 6,
        border: confirming ? '1px solid rgba(248,113,113,0.35)' : '1px solid transparent',
        background: confirming ? 'rgba(248,113,113,0.08)' : 'transparent',
        color: confirming ? '#f87171' : '#3f3f46',
        cursor: isPending ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
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

// ── Mark Paid button (optimistic) ─────────────────────────────────────────────
function MarkPaidButton({ id, currentStatus }: { id: string; currentStatus: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  if (currentStatus === 'Paid' || currentStatus === 'Failed') return null

  function handleClick() {
    startTransition(async () => {
      const result = await updatePaymentStatus(id, 'Paid')
      if (result.error) toast.error(result.error)
      else { toast.success('Payment marked as Paid.'); router.refresh() }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title="Mark as Paid"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 28, height: 28, borderRadius: 6,
        border: '1px solid transparent', background: 'transparent',
        color: '#3f3f46', cursor: isPending ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '1px solid rgba(34,197,94,0.25)'
        e.currentTarget.style.color = '#4ade80'
        e.currentTarget.style.background = 'rgba(34,197,94,0.07)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '1px solid transparent'
        e.currentTarget.style.color = '#3f3f46'
        e.currentTarget.style.background = 'transparent'
      }}
    >
      <CheckCircle2 size={13} strokeWidth={1.8} />
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
        <DollarSign size={22} strokeWidth={1.5} style={{ color: '#818cf8' }} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: '#e4e4e7', marginBottom: 8, letterSpacing: '-0.01em' }}>
        No payments yet
      </p>
      <p style={{ fontSize: 13, color: '#52525b', marginBottom: 24, textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
        Send your first payment to a creator. Payments are tracked in real time with instant status updates.
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
        <DollarSign size={13} strokeWidth={2} />
        Send Payment
      </Button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface PaymentsClientProps {
  payments: PaymentWithRelations[]
  formData: PaymentFormData
}

export function PaymentsClient({ payments, formData }: PaymentsClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<PaymentWithRelations | null>(null)

  const [optimisticPayments] = useOptimistic(
    payments,
    (state, action: { type: 'delete'; id: string } | { type: 'status'; id: string; status: string }) => {
      if (action.type === 'delete') return state.filter((p) => p.id !== action.id)
      if (action.type === 'status') return state.map((p) => p.id === action.id ? { ...p, status: action.status as typeof p.status } : p)
      return state
    },
  )

  function openCreate() { setEditingPayment(null); setDialogOpen(true) }
  function openEdit(p: PaymentWithRelations) { setEditingPayment(p); setDialogOpen(true) }

  const total      = optimisticPayments.reduce((s, p) => s + p.amount, 0)
  const paid       = optimisticPayments.filter((p) => p.status === 'Paid').reduce((s, p) => s + p.amount, 0)
  const pending    = optimisticPayments.filter((p) => p.status === 'Pending').reduce((s, p) => s + p.amount, 0)
  const processing = optimisticPayments.filter((p) => p.status === 'Processing').reduce((s, p) => s + p.amount, 0)

  const stats = [
    { label: 'Paid',       value: fmt(paid),       color: '#4ade80', accent: 'rgba(34,197,94,0.12)',  dot: '#22c55e' },
    { label: 'Pending',    value: fmt(pending),     color: '#fbbf24', accent: 'rgba(245,158,11,0.12)', dot: '#f59e0b' },
    { label: 'Processing', value: fmt(processing),  color: '#818cf8', accent: 'rgba(99,102,241,0.12)', dot: '#6366f1' },
  ]

  return (
    <div className="dash-page">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', color: '#f4f4f5', lineHeight: 1.1 }}>
              Payments
            </h1>
            <p style={{ marginTop: 8, fontSize: 14, color: '#71717a' }}>
              {optimisticPayments.length} transactions · {fmt(total)} total disbursed
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
            <DollarSign size={13} strokeWidth={2} />
            Send Payment
          </Button>
        </div>

        {/* Quick stats */}
        <div className="payments-stats">
          {stats.map((s) => (
            <div
              key={s.label}
              className="kpi-card"
              style={{
                ...card,
                padding: '22px 24px',
                background: `radial-gradient(ellipse at top left, ${s.accent} 0%, transparent 60%), #0f0f13`,
                transition: 'border-color 200ms, box-shadow 200ms',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.09)'
                el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.055)'
                el.style.boxShadow = 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#52525b' }}>
                  {s.label}
                </p>
                <span style={{ height: 7, width: 7, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
              </div>
              <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: s.color, lineHeight: 1 }}>
                {s.value}
              </p>
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ArrowUpRight size={11} style={{ color: '#3f3f46' }} />
                <span style={{ fontSize: 12, color: '#3f3f46' }}>from {optimisticPayments.length} payment{optimisticPayments.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <Card
          style={card}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.055)' }}
        >
          <CardContent className="p-0">
            {optimisticPayments.length === 0 ? (
              <EmptyState onNew={openCreate} />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor: 'rgba(255,255,255,0.04)' }} className="hover:bg-transparent">
                      {[
                        { label: 'Creator',  pl: 28 },
                        { label: 'Campaign' },
                        { label: 'Amount' },
                        { label: 'Method' },
                        { label: 'Status' },
                        { label: 'Date' },
                        { label: '' },
                      ].map((h) => (
                        <TableHead
                          key={h.label}
                          style={{
                            paddingLeft: h.pl, paddingTop: 14, paddingBottom: 14,
                            fontSize: 11, fontWeight: 500,
                            textTransform: 'uppercase' as const,
                            letterSpacing: '0.07em', color: '#3f3f46',
                          }}
                        >
                          {h.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {optimisticPayments.map((p) => {
                      const sc = statusConfig[p.status as keyof typeof statusConfig] ?? statusConfig.Pending
                      const creatorName = p.creator.name
                      const displayDate = p.paidAt ?? p.createdAt

                      return (
                        <TableRow
                          key={p.id}
                          className="table-row-fade transition-colors hover:bg-white/[0.025]"
                          style={{ borderColor: 'rgba(255,255,255,0.035)' }}
                        >
                          {/* Creator */}
                          <TableCell style={{ paddingLeft: 28, paddingTop: 18, paddingBottom: 18 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                              <Avatar className="h-8 w-8">
                                <AvatarFallback style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', fontSize: 11, fontWeight: 600 }}>
                                  {initials(creatorName)}
                                </AvatarFallback>
                              </Avatar>
                              <span style={{ fontSize: 13, fontWeight: 500, color: '#e4e4e7' }}>{creatorName}</span>
                            </div>
                          </TableCell>

                          {/* Campaign */}
                          <TableCell style={{ paddingTop: 18, paddingBottom: 18, maxWidth: 200 }}>
                            <p style={{ fontSize: 13, color: '#71717a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.campaign.name}
                            </p>
                          </TableCell>

                          {/* Amount */}
                          <TableCell style={{ paddingTop: 18, paddingBottom: 18 }}>
                            <span style={{
                              fontFamily: 'monospace', fontSize: 14, fontWeight: 600,
                              color: p.status === 'Paid' ? '#4ade80' : p.status === 'Failed' ? '#f87171' : '#f4f4f5',
                            }}>
                              {fmt(p.amount)}
                            </span>
                          </TableCell>

                          {/* Method */}
                          <TableCell style={{ paddingTop: 18, paddingBottom: 18 }}>
                            <span style={{
                              fontSize: 12, color: '#71717a', borderRadius: 6,
                              padding: '3px 8px', background: 'rgba(255,255,255,0.035)',
                              border: '1px solid rgba(255,255,255,0.05)',
                            }}>
                              {p.method}
                            </span>
                          </TableCell>

                          {/* Status */}
                          <TableCell style={{ paddingTop: 18, paddingBottom: 18 }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              borderRadius: 20, padding: '3px 9px',
                              fontSize: 11, fontWeight: 500,
                              background: sc.bg, color: sc.text,
                            }}>
                              <span style={{ height: 5, width: 5, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                              {p.status}
                            </span>
                          </TableCell>

                          {/* Date */}
                          <TableCell style={{ paddingTop: 18, paddingBottom: 18, fontFamily: 'monospace', fontSize: 12, color: '#52525b' }}>
                            {fmtDate(displayDate)}
                          </TableCell>

                          {/* Actions */}
                          <TableCell style={{ paddingRight: 20, paddingTop: 18, paddingBottom: 18 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <MarkPaidButton id={p.id} currentStatus={p.status} />
                              <button
                                onClick={() => openEdit(p)}
                                title="Edit payment"
                                style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  width: 28, height: 28, borderRadius: 6,
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
                                <Pencil size={13} strokeWidth={1.8} />
                              </button>
                              <DeleteButton id={p.id} amount={p.amount} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                <div style={{
                  padding: '12px 28px',
                  borderTop: '1px solid rgba(255,255,255,0.035)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 12, color: '#3f3f46' }}>
                    {optimisticPayments.length} payment{optimisticPayments.length !== 1 ? 's' : ''}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#52525b' }}>
                    Total: <span style={{ color: '#71717a' }}>{fmt(total)}</span>
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      <PaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        payment={editingPayment}
        formData={formData}
      />
    </div>
  )
}
