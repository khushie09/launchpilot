'use client'

import { useState, useTransition, useOptimistic } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DollarSign, Pencil, Trash2, CheckCircle2 } from 'lucide-react'
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
        border: confirming ? '1px solid rgba(248,113,113,0.4)' : '1px solid transparent',
        background: confirming ? 'rgba(248,113,113,0.1)' : 'transparent',
        color: confirming ? '#f87171' : '#52525b',
        cursor: isPending ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
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
        color: '#52525b', cursor: isPending ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '1px solid rgba(34,197,94,0.3)'
        e.currentTarget.style.color = '#4ade80'
        e.currentTarget.style.background = 'rgba(34,197,94,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '1px solid transparent'
        e.currentTarget.style.color = '#52525b'
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
      justifyContent: 'center', padding: '80px 32px', gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'rgba(99,102,241,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <DollarSign size={20} strokeWidth={1.5} style={{ color: '#818cf8' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#e4e4e7' }}>No payments yet</p>
        <p style={{ marginTop: 6, fontSize: 13, color: '#52525b' }}>Send your first payment to a creator.</p>
      </div>
      <Button onClick={onNew} style={{ background: '#6366f1', color: '#fff', marginTop: 4 }}>
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

  // Optimistic list — removes deleted items instantly, reflects status changes
  const [optimisticPayments, updateOptimistic] = useOptimistic(
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

  return (
    <div style={{ padding: '32px 48px 48px 112px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
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
            className="gap-2 text-[13px] font-medium"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', height: 38 }}
          >
            <DollarSign size={14} strokeWidth={2} />
            Send Payment
          </Button>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Paid',       value: fmt(paid),       color: '#4ade80' },
            { label: 'Pending',    value: fmt(pending),     color: '#fbbf24' },
            { label: 'Processing', value: fmt(processing),  color: '#818cf8' },
          ].map((s) => (
            <div key={s.label} style={{ ...card, padding: '24px 28px' }}>
              <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#52525b', marginBottom: 14 }}>
                {s.label}
              </p>
              <p style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', color: s.color, lineHeight: 1 }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <Card style={card}>
          <CardContent className="p-0">
            {optimisticPayments.length === 0 ? (
              <EmptyState onNew={openCreate} />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor: 'rgba(255,255,255,0.05)' }} className="hover:bg-transparent">
                      {[
                        { label: 'Creator',  pl: 32 },
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
                            paddingLeft: h.pl, paddingTop: 18, paddingBottom: 18,
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
                          style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                          className="transition-colors hover:bg-muted/40"
                        >
                          {/* Creator */}
                          <TableCell style={{ paddingLeft: 32, paddingTop: 22, paddingBottom: 22 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <Avatar className="h-8 w-8">
                                <AvatarFallback style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', fontSize: 11, fontWeight: 600 }}>
                                  {initials(creatorName)}
                                </AvatarFallback>
                              </Avatar>
                              <span style={{ fontSize: 13, fontWeight: 500, color: '#e4e4e7' }}>{creatorName}</span>
                            </div>
                          </TableCell>

                          {/* Campaign */}
                          <TableCell style={{ paddingTop: 22, paddingBottom: 22, maxWidth: 200 }}>
                            <p style={{ fontSize: 13, color: '#71717a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.campaign.name}
                            </p>
                          </TableCell>

                          {/* Amount */}
                          <TableCell style={{ paddingTop: 22, paddingBottom: 22 }}>
                            <span style={{
                              fontFamily: 'monospace', fontSize: 14, fontWeight: 600,
                              color: p.status === 'Paid' ? '#4ade80' : p.status === 'Failed' ? '#f87171' : '#f4f4f5',
                            }}>
                              {fmt(p.amount)}
                            </span>
                          </TableCell>

                          {/* Method */}
                          <TableCell style={{ paddingTop: 22, paddingBottom: 22 }}>
                            <span style={{
                              fontSize: 12, color: '#71717a', borderRadius: 6,
                              padding: '3px 8px', background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}>
                              {p.method}
                            </span>
                          </TableCell>

                          {/* Status */}
                          <TableCell style={{ paddingTop: 22, paddingBottom: 22 }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              borderRadius: 20, padding: '4px 10px',
                              fontSize: 11, fontWeight: 500,
                              background: sc.bg, color: sc.text,
                            }}>
                              <span style={{ height: 6, width: 6, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                              {p.status}
                            </span>
                          </TableCell>

                          {/* Date */}
                          <TableCell style={{ paddingTop: 22, paddingBottom: 22, fontFamily: 'monospace', fontSize: 12, color: '#52525b' }}>
                            {fmtDate(displayDate)}
                          </TableCell>

                          {/* Actions */}
                          <TableCell style={{ paddingRight: 24, paddingTop: 22, paddingBottom: 22 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <MarkPaidButton id={p.id} currentStatus={p.status} />
                              <button
                                onClick={() => openEdit(p)}
                                title="Edit payment"
                                style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  width: 28, height: 28, borderRadius: 6,
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
