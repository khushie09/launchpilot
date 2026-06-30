'use client'

import { useEffect, useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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

// ── Shared styled primitives ───────────────────────────────────────────────────
function FieldSelect({
  id,
  options,
  error,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { id: string; options: readonly string[]; error?: string }) {
  return (
    <select
      id={id}
      style={{
        width: '100%', height: 36, borderRadius: 8,
        border: error ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.04)', color: '#e4e4e7',
        fontSize: 13, paddingLeft: 10, outline: 'none',
        cursor: 'pointer', appearance: 'auto',
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
  id,
  placeholder,
  items,
  error,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  id: string
  placeholder: string
  items: { value: string; label: string }[]
  error?: string
}) {
  return (
    <select
      id={id}
      style={{
        width: '100%', height: 36, borderRadius: 8,
        border: error ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.04)', color: '#e4e4e7',
        fontSize: 13, paddingLeft: 10, outline: 'none',
        cursor: 'pointer', appearance: 'auto',
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

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Label htmlFor={id} style={{ fontSize: 12, color: '#a1a1aa', fontWeight: 500 }}>{label}</Label>
      {children}
      {error && <p style={{ fontSize: 11, color: '#f87171', marginTop: 2 }}>{error}</p>}
    </div>
  )
}

const inputStyle = (hasError?: boolean): React.CSSProperties => ({
  background: 'rgba(255,255,255,0.04)',
  border: hasError ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.1)',
  color: '#e4e4e7', fontSize: 13, height: 36,
})

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
      campaignId: '',
      creatorId: '',
      amount: undefined,
      method: 'Bank Transfer',
      status: 'Pending',
      notes: '',
      paidAt: '',
    },
  })

  // When a campaign is selected, auto-fill creator if linked
  const watchedCampaignId = useWatch({ control, name: 'campaignId' })
  useEffect(() => {
    if (!watchedCampaignId) return
    const campaign = campaigns.find((c) => c.id === watchedCampaignId)
    if (campaign?.creatorId) {
      setValue('creatorId', campaign.creatorId)
    }
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
        className="sm:max-w-lg"
        style={{ background: '#0f0f13', border: '1px solid rgba(255,255,255,0.08)', maxWidth: 560 }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#f4f4f5', fontSize: 16, fontWeight: 600 }}>
            {isEditing ? 'Edit Payment' : 'Send Payment'}
          </DialogTitle>
          <DialogDescription style={{ color: '#52525b', fontSize: 13 }}>
            {isEditing ? 'Update the payment details.' : 'Create a new payment record.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '8px 0 20px' }}>

            {/* Campaign */}
            <Field label="Campaign" id="campaignId" error={errors.campaignId?.message}>
              {campaigns.length === 0 ? (
                <p style={{ fontSize: 12, color: '#f87171' }}>No campaigns found. Create a campaign first.</p>
              ) : (
                <DynSelect
                  id="campaignId"
                  placeholder="Select campaign…"
                  items={campaignItems}
                  error={errors.campaignId?.message}
                  {...register('campaignId')}
                />
              )}
            </Field>

            {/* Creator */}
            <Field label="Creator" id="creatorId" error={errors.creatorId?.message}>
              {creators.length === 0 ? (
                <p style={{ fontSize: 12, color: '#f87171' }}>No creators found. Add a creator first.</p>
              ) : (
                <DynSelect
                  id="creatorId"
                  placeholder="Select creator…"
                  items={creatorItems}
                  error={errors.creatorId?.message}
                  {...register('creatorId')}
                />
              )}
            </Field>

            {/* Amount + Method */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Amount (USD)" id="amount" error={errors.amount?.message}>
                <Input
                  id="amount" type="number" min="0" step="0.01" placeholder="2500"
                  {...register('amount')} style={inputStyle(!!errors.amount)}
                />
              </Field>
              <Field label="Method" id="method" error={errors.method?.message}>
                <FieldSelect id="method" options={PAYMENT_METHODS} error={errors.method?.message} {...register('method')} />
              </Field>
            </div>

            {/* Status + Paid At */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Status" id="status" error={errors.status?.message}>
                <FieldSelect id="status" options={PAYMENT_STATUSES} error={errors.status?.message} {...register('status')} />
              </Field>
              {watchedStatus === 'Paid' && (
                <Field label="Paid On" id="paidAt" error={errors.paidAt?.message}>
                  <Input
                    id="paidAt" type="date"
                    {...register('paidAt')}
                    style={{ ...inputStyle(!!errors.paidAt), colorScheme: 'dark' }}
                  />
                </Field>
              )}
            </div>

            {/* Notes */}
            <Field label="Notes (optional)" id="notes" error={errors.notes?.message}>
              <Textarea
                id="notes" rows={2} placeholder="Any relevant notes…"
                {...register('notes')}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e4e4e7', fontSize: 13, resize: 'none',
                }}
              />
            </Field>

          </div>

          <DialogFooter showCloseButton>
            <Button
              type="submit"
              disabled={isPending || campaigns.length === 0 || creators.length === 0}
              style={{ background: '#6366f1', color: '#fff', minWidth: 120 }}
            >
              {isPending
                ? isEditing ? 'Saving…' : 'Creating…'
                : isEditing ? 'Save Changes' : 'Send Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
