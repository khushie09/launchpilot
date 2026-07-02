'use client'

import { useEffect, useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CreditCard, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  paymentSchema,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  type PaymentFormValues,
} from '@/lib/validations/payment'
import { createPayment, updatePayment } from '@/app/actions/payments'
import type { PaymentWithRelations, PaymentFormData } from '@/app/actions/payments'

// ── Design tokens ─────────────────────────────────────────────────────────────

const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`

const fieldInput = (hasError?: boolean): React.CSSProperties => ({
  height: 40,
  background: 'rgba(255,255,255,0.04)',
  border: hasError ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.09)',
  borderRadius: 8,
  color: '#e4e4e7',
  fontSize: 14,
  transition: 'border-color 150ms, box-shadow 150ms',
})

const selectStyle = (hasError?: boolean): React.CSSProperties => ({
  width: '100%', height: 40, borderRadius: 8,
  border: hasError ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.09)',
  background: 'rgba(255,255,255,0.04)', color: '#e4e4e7',
  fontSize: 14, paddingLeft: 12, paddingRight: 36,
  outline: 'none', cursor: 'pointer', appearance: 'none',
  backgroundImage: CHEVRON_SVG, backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center', colorScheme: 'dark',
  transition: 'border-color 150ms, box-shadow 150ms',
})

// ── Primitives ────────────────────────────────────────────────────────────────

function Spinner() {
  return <span className="btn-spinner" aria-hidden="true" />
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: '#3f3f46',
    }}>
      {children}
    </p>
  )
}

function Field({
  label, id, hint, error, children,
}: {
  label: string; id: string; hint?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Label htmlFor={id} style={{ fontSize: 13, color: '#d4d4d8', fontWeight: 500, letterSpacing: '-0.01em' }}>
        {label}
      </Label>
      {hint && <p style={{ fontSize: 12, color: '#52525b', marginTop: -2, lineHeight: 1.5 }}>{hint}</p>}
      {children}
      {error && <p style={{ fontSize: 12, color: '#f87171', marginTop: 2 }}>{error}</p>}
    </div>
  )
}

function FieldSelect({
  id, options, error, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { id: string; options: readonly string[]; error?: string }) {
  return (
    <select
      id={id}
      style={selectStyle(!!error)}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = error ? '#f87171' : 'rgba(255,255,255,0.09)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt} value={opt} style={{ background: '#0f0f13' }}>{opt}</option>
      ))}
    </select>
  )
}

function DynSelect({
  id, placeholder, items, error, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  id: string; placeholder: string
  items: { value: string; label: string }[]
  error?: string
}) {
  return (
    <select
      id={id}
      style={selectStyle(!!error)}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = error ? '#f87171' : 'rgba(255,255,255,0.09)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      {...props}
    >
      <option value="" style={{ background: '#0f0f13', color: '#52525b' }}>{placeholder}</option>
      {items.map((item) => (
        <option key={item.value} value={item.value} style={{ background: '#0f0f13' }}>{item.label}</option>
      ))}
    </select>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment?: PaymentWithRelations | null
  formData: PaymentFormData
}

export function PaymentDialog({ open, onOpenChange, payment, formData }: PaymentDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!payment
  const { campaigns, creators } = formData

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      campaignId: '', creatorId: '', amount: undefined,
      method: 'Bank Transfer', status: 'Pending', notes: '', paidAt: '',
    },
  })

  const watchedCampaignId = useWatch({ control, name: 'campaignId' })
  useEffect(() => {
    if (!watchedCampaignId) return
    const campaign = campaigns.find((c) => c.id === watchedCampaignId)
    if (campaign?.creatorId) setValue('creatorId', campaign.creatorId)
  }, [watchedCampaignId, campaigns, setValue])

  useEffect(() => {
    if (!open) return
    if (payment) {
      reset({
        campaignId: payment.campaignId,
        creatorId: payment.creatorId,
        amount: payment.amount,
        method: payment.method as PaymentFormValues['method'],
        status: payment.status as PaymentFormValues['status'],
        notes: payment.notes ?? '',
        paidAt: payment.paidAt ? new Date(payment.paidAt).toISOString().split('T')[0] : '',
      })
    } else {
      reset({ campaignId: '', creatorId: '', amount: undefined, method: 'Bank Transfer', status: 'Pending', notes: '', paidAt: '' })
    }
  }, [open, payment, reset])

  function onSubmit(data: PaymentFormValues) {
    startTransition(async () => {
      const result = isEditing
        ? await updatePayment(payment.id, data)
        : await createPayment(data)

      if (result.error) { toast.error(result.error); return }
      toast.success(isEditing ? 'Payment updated.' : 'Payment created.')
      onOpenChange(false)
      router.refresh()
    })
  }

  const watchedStatus = useWatch({ control, name: 'status' })
  const campaignItems = campaigns.map((c) => ({ value: c.id, label: `${c.name} — ${c.brand}` }))
  const creatorItems = creators.map((c) => ({ value: c.id, label: `${c.name} (${c.handle})` }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[620px] p-0 gap-0 overflow-hidden ring-0"
        showCloseButton={false}
        style={{
          background: '#0d0d11',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset',
        }}
      >

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                height: 38, width: 38, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0.06) 100%)',
                border: '1px solid rgba(99,102,241,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 4px rgba(99,102,241,0.06)',
              }}>
                <CreditCard size={15} style={{ color: '#818cf8' }} />
              </div>
              <div style={{ paddingTop: 1 }}>
                <DialogTitle style={{ color: '#f4f4f5', fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                  {isEditing ? 'Edit Payment' : 'Send Payment'}
                </DialogTitle>
                <DialogDescription style={{ color: '#71717a', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
                  {isEditing
                    ? 'Update the details and status for this payment.'
                    : 'Create a payment record for a creator. Selecting a campaign may auto-fill the creator.'}
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              onClick={() => onOpenChange(false)}
              style={{ color: '#3f3f46', marginTop: -4, marginRight: -6, flexShrink: 0 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a1a1aa' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#3f3f46' }}
            >
              <X size={15} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* ── Body ───────────────────────────────────────────────────────── */}
          <div
            className="dialog-body"
            style={{
              display: 'flex', flexDirection: 'column', gap: 22,
              maxHeight: 'calc(min(90vh, 680px) - 200px)', overflowY: 'auto',
            }}
          >

            {/* Assignment */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <SectionLabel>Assignment</SectionLabel>

              <Field label="Campaign" id="campaignId" error={errors.campaignId?.message}>
                {campaigns.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#f87171', padding: '10px 0' }}>
                    No campaigns found — create a campaign first.
                  </p>
                ) : (
                  <DynSelect
                    id="campaignId"
                    placeholder="Select a campaign…"
                    items={campaignItems}
                    error={errors.campaignId?.message}
                    {...register('campaignId')}
                  />
                )}
              </Field>

              <Field
                label="Creator"
                id="creatorId"
                hint="Auto-filled when a campaign with a linked creator is selected"
                error={errors.creatorId?.message}
              >
                {creators.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#f87171', padding: '10px 0' }}>
                    No creators found — add a creator first.
                  </p>
                ) : (
                  <DynSelect
                    id="creatorId"
                    placeholder="Select a creator…"
                    items={creatorItems}
                    error={errors.creatorId?.message}
                    {...register('creatorId')}
                  />
                )}
              </Field>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />

            {/* Payment Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <SectionLabel>Payment Details</SectionLabel>

              <div className="dialog-2col">
                <Field label="Amount (USD)" id="amount" hint="Payment amount in US dollars" error={errors.amount?.message}>
                  <Input
                    id="amount" type="number" min="0" step="0.01" placeholder="2,500"
                    {...register('amount')} style={fieldInput(!!errors.amount)}
                  />
                </Field>
                <Field label="Method" id="method" error={errors.method?.message}>
                  <FieldSelect id="method" options={PAYMENT_METHODS} error={errors.method?.message} {...register('method')} />
                </Field>
              </div>

              {watchedStatus === 'Paid' ? (
                <div className="dialog-2col">
                  <Field label="Status" id="status" error={errors.status?.message}>
                    <FieldSelect id="status" options={PAYMENT_STATUSES} error={errors.status?.message} {...register('status')} />
                  </Field>
                  <Field label="Paid On" id="paidAt" error={errors.paidAt?.message}>
                    <Input
                      id="paidAt" type="date"
                      {...register('paidAt')}
                      style={{ ...fieldInput(!!errors.paidAt), colorScheme: 'dark' } as React.CSSProperties}
                    />
                  </Field>
                </div>
              ) : (
                <Field label="Status" id="status" error={errors.status?.message}>
                  <FieldSelect id="status" options={PAYMENT_STATUSES} error={errors.status?.message} {...register('status')} />
                </Field>
              )}
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />

            {/* Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <SectionLabel>Notes</SectionLabel>
              <Field
                label="Internal Notes"
                id="notes"
                hint="Visible only to your team — not shared with the creator"
                error={errors.notes?.message}
              >
                <Textarea
                  id="notes" rows={2} placeholder="Any relevant context or reminders…"
                  {...register('notes')}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: errors.notes ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 8,
                    color: '#e4e4e7', fontSize: 14, resize: 'none', lineHeight: 1.6,
                    transition: 'border-color 150ms, box-shadow 150ms',
                  }}
                />
              </Field>
            </div>
          </div>

          {/* ── Footer ─────────────────────────────────────────────────────── */}
          <div className="dialog-footer">
            <Button
              variant="ghost"
              type="button"
              onClick={() => onOpenChange(false)}
              style={{ color: '#71717a', fontSize: 14 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a1a1aa' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#71717a' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || campaigns.length === 0 || creators.length === 0}
              style={{
                background: isPending
                  ? 'rgba(99,102,241,0.7)'
                  : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                minWidth: 130,
                gap: 7,
                boxShadow: isPending ? 'none' : '0 1px 2px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08) inset',
                transition: 'opacity 150ms, box-shadow 150ms',
              }}
              onMouseEnter={(e) => {
                if (!isPending) (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.25), 0 0 0 3px rgba(99,102,241,0.3)'
              }}
              onMouseLeave={(e) => {
                if (!isPending) (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08) inset'
              }}
            >
              {isPending && <Spinner />}
              {isPending
                ? isEditing ? 'Saving…' : 'Creating…'
                : isEditing ? 'Save Changes' : 'Send Payment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
