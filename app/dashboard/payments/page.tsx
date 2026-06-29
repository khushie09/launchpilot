import { DollarSign, ArrowDownLeft, Clock, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const summaryCards = [
  { label: 'Total Disbursed', value: `$${total.toLocaleString()}`,      icon: DollarSign,   iconColor: '#818cf8', iconBg: 'rgba(99,102,241,0.12)'  },
  { label: 'Paid',            value: `$${paid.toLocaleString()}`,        icon: ArrowDownLeft, iconColor: '#4ade80', iconBg: 'rgba(34,197,94,0.12)'   },
  { label: 'Pending',         value: `$${pending.toLocaleString()}`,     icon: Clock,         iconColor: '#fbbf24', iconBg: 'rgba(245,158,11,0.12)'  },
  { label: 'Processing',      value: `$${processing.toLocaleString()}`,  icon: RefreshCw,     iconColor: '#60a5fa', iconBg: 'rgba(59,130,246,0.12)'  },
]

const cardStyle = {
  background: '#0f0f13',
  boxShadow: '0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
}

// ─────────────────────────────────────────────────────────────────────────────
export default function PaymentsPage() {
  return (
    <div className="space-y-6 p-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Payments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {payments.length} transactions · ${total.toLocaleString()} total
          </p>
        </div>
        <Button
          className="gap-2 text-[13px] font-medium"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none' }}
        >
          <DollarSign size={14} strokeWidth={2} />
          Send Payment
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {summaryCards.map(({ label, value, icon: Icon, iconColor, iconBg }) => (
          <Card key={label} className="border-border/60" style={cardStyle}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-[12px] font-medium text-muted-foreground">{label}</p>
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ background: iconBg }}
                >
                  <Icon size={13} strokeWidth={2} style={{ color: iconColor }} />
                </div>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transactions table */}
      <Card className="border-border/60" style={cardStyle}>
        <CardHeader className="border-b border-border/40 pb-3.5 pt-4 px-5">
          <CardTitle className="text-[13px] font-semibold text-foreground tracking-tight">
            All Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  {['Creator', 'Campaign', 'Amount', 'Method', 'Status', 'Date'].map((h) => (
                    <TableHead
                      key={h}
                      className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40 first:pl-5 last:pr-5"
                    >
                      {h}
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
                      className="border-border/30 cursor-pointer transition-colors hover:bg-muted/40"
                    >
                      <TableCell className="pl-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback
                              className="text-[10px] font-medium"
                              style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}
                            >
                              {p.creatorAvatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[13px] font-medium text-foreground">{p.creator}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 max-w-[180px]">
                        <p className="truncate text-[12px] text-muted-foreground">{p.campaign}</p>
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className="font-mono text-[14px] font-semibold"
                          style={{
                            color: p.status === 'Paid'
                              ? '#4ade80'
                              : p.status === 'Failed'
                                ? '#f87171'
                                : '#f4f4f5',
                          }}
                        >
                          ${p.amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className="text-[11px] text-muted-foreground/70 rounded-md px-2 py-0.5"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          {p.method}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
                          style={{ background: sc.bg, color: sc.text }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: sc.dot }} />
                          {p.status}
                        </span>
                      </TableCell>
                      <TableCell className="pr-5 py-4 font-mono text-[12px] text-muted-foreground/60">
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
  )
}
