import { DollarSign } from 'lucide-react'
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
import { payments, type PaymentStatus } from '@/lib/mock-data'

// ── Config ────────────────────────────────────────────────────────────────────
const statusConfig: Record<PaymentStatus, { bg: string; text: string; dot: string }> = {
  Paid:       { bg: 'rgba(34,197,94,0.08)',   text: '#4ade80', dot: '#22c55e' },
  Pending:    { bg: 'rgba(245,158,11,0.08)',  text: '#fbbf24', dot: '#f59e0b' },
  Processing: { bg: 'rgba(99,102,241,0.08)',  text: '#818cf8', dot: '#6366f1' },
  Failed:     { bg: 'rgba(239,68,68,0.08)',   text: '#f87171', dot: '#ef4444' },
}

const total      = payments.reduce((sum, p) => sum + p.amount, 0)
const paid       = payments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0)
const pending    = payments.filter((p) => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0)
const processing = payments.filter((p) => p.status === 'Processing').reduce((sum, p) => sum + p.amount, 0)

const card = {
  background: '#0f0f13',
  border: '1px solid rgba(255,255,255,0.055)',
  borderRadius: 14,
}

// ─────────────────────────────────────────────────────────────────────────────
export default function PaymentsPage() {
  return (
    <div style={{ padding: '48px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', color: '#f4f4f5', lineHeight: 1.1 }}>
              Payments
            </h1>
            <p style={{ marginTop: 8, fontSize: 14, color: '#71717a' }}>
              {payments.length} transactions · ${total.toLocaleString()} total disbursed
            </p>
          </div>
          <Button
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
            { label: 'Paid',       value: `$${paid.toLocaleString()}`,       color: '#4ade80' },
            { label: 'Pending',    value: `$${pending.toLocaleString()}`,     color: '#fbbf24' },
            { label: 'Processing', value: `$${processing.toLocaleString()}`,  color: '#818cf8' },
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
                  {payments.map((p) => {
                    const sc = statusConfig[p.status]
                    return (
                      <TableRow
                        key={p.id}
                        style={{ borderColor: 'rgba(255,255,255,0.04)', cursor: 'pointer' }}
                        className="transition-colors hover:bg-muted/40"
                      >
                        <TableCell style={{ paddingLeft: 32, paddingTop: 22, paddingBottom: 22 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback
                                style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', fontSize: 11, fontWeight: 600 }}
                              >
                                {p.creatorAvatar}
                              </AvatarFallback>
                            </Avatar>
                            <span style={{ fontSize: 13, fontWeight: 500, color: '#e4e4e7' }}>{p.creator}</span>
                          </div>
                        </TableCell>
                        <TableCell style={{ paddingTop: 22, paddingBottom: 22, maxWidth: 200 }}>
                          <p style={{ fontSize: 13, color: '#71717a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.campaign}
                          </p>
                        </TableCell>
                        <TableCell style={{ paddingTop: 22, paddingBottom: 22 }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: 14,
                              fontWeight: 600,
                              color: p.status === 'Paid' ? '#4ade80' : p.status === 'Failed' ? '#f87171' : '#f4f4f5',
                            }}
                          >
                            ${p.amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell style={{ paddingTop: 22, paddingBottom: 22 }}>
                          <span
                            style={{
                              fontSize: 12,
                              color: '#71717a',
                              borderRadius: 6,
                              padding: '3px 8px',
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            {p.method}
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
                            {p.status}
                          </span>
                        </TableCell>
                        <TableCell style={{ paddingRight: 32, paddingTop: 22, paddingBottom: 22, fontFamily: 'monospace', fontSize: 12, color: '#52525b' }}>
                          {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
