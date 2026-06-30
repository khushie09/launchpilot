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

// ── Shared design tokens ──────────────────────────────────────────────────────

const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`

const fieldInput = (hasError?: boolean): React.CSSProperties => ({
  height: 44,
  background: 'rgba(255,255,255,0.04)',
  border: hasError ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.1)',
  color: '#e4e4e7',
  fontSize: 14,
})

const selectStyle = (hasError?: boolean): React.CSSProperties => ({
  width: '100%', height: 44, borderRadius: 8,
  border: hasError ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.04)', color: '#e4e4e7',
  fontSize: 14, paddingLeft: 12, paddingRight: 36,
  outline: 'none', cursor: 'pointer', appearance: 'none',
  backgroundImage: CHEVRON_SVG, backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center', colorScheme: 'dark',
})

// ── Primitives ────────────────────────────────────────────────────────────────

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
    <select id={id} style={selectStyle(!!error)} {...props}>
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
    <select id={id} style={selectStyle(!!error)} {...props}>
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
        className="sm:max-w-[740px] p-0 gap-0 overflow-hidden ring-0"
        showCloseButton={false}
        style={{ background: '#0f0f13', border: '1px solid rgba(255,255,255,0.08)' }}
      >

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                height: 38, width: 38, borderRadius: 9, flexShrink: 0,
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CreditCard size={15} style={{ color: '#818cf8' }} />
              </div>
              <div style={{ paddingTop: 1 }}>
                <DialogTitle style={{ color: '#f4f4f5', fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                  {isEditing ? 'Edit Payment' : 'Send Payment'}
                </DialogTitle>
                <DialogDescription style={{ color: '#71717a', fontSize: 13, marginTop: 5, lineHeight: 1.5 }}>
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
              style={{ color: '#52525b', marginTop: -4, marginRight: -6, flexShrink: 0 }}
            >
              <X size={15} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* ── Body ───────────────────────────────────────────────────────── */}
          <div style={{
            padding: '24px',
            display: 'flex', flexDirection: 'column', gap: 24,
            maxHeight: 'calc(90vh - 200px)', overflowY: 'auto',
          }}>

            {/* Section: Assignment */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

            {/* Section: Payment Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

            {/* Section: Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                    border: errors.notes ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.1)',
                    color: '#e4e4e7', fontSize: 14, resize: 'none', lineHeight: 1.6,
                  }}
                />
              </Field>
            </div>
          </div>

          {/* ── Footer ─────────────────────────────────────────────────────── */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.01)',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
          }}>
            <Button
              variant="ghost"
              type="button"
              onClick={() => onOpenChange(false)}
              style={{ color: '#71717a' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || campaigns.length === 0 || creators.length === 0}
              style={{ background: '#6366f1', color: '#fff', minWidth: 130 }}
            >
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
