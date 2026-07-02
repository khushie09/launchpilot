'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Rocket, X } from 'lucide-react'
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
  campaignSchema,
  PLATFORMS,
  STATUSES,
  type CampaignFormValues,
} from '@/lib/validations/campaign'
import { createCampaign, updateCampaign } from '@/app/actions/campaigns'
import type { CampaignWithCreator } from '@/app/actions/campaigns'

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
      {error && (
        <p style={{ fontSize: 12, color: '#f87171', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
          {error}
        </p>
      )}
    </div>
  )
}

function FieldSelect({
  id, options, error, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { id: string; options: readonly string[]; error?: string }) {
  return (
    <select
      id={id}
      style={{
        width: '100%', height: 40, borderRadius: 8,
        border: error ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.09)',
        background: 'rgba(255,255,255,0.04)', color: '#e4e4e7',
        fontSize: 14, paddingLeft: 12, paddingRight: 36,
        outline: 'none', cursor: 'pointer', appearance: 'none',
        backgroundImage: CHEVRON_SVG, backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center', colorScheme: 'dark',
        transition: 'border-color 150ms, box-shadow 150ms',
      } as React.CSSProperties}
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

// ─────────────────────────────────────────────────────────────────────────────

interface CampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign?: CampaignWithCreator | null
}

export function CampaignDialog({ open, onOpenChange, campaign }: CampaignDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!campaign

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(campaignSchema) as any,
    defaultValues: {
      name: '', brand: '', platform: 'Instagram', status: 'Draft',
      budget: undefined, description: '', startDate: '', endDate: '',
    },
  })

  useEffect(() => {
    if (!open) return
    if (campaign) {
      reset({
        name: campaign.name,
        brand: campaign.brand,
        platform: campaign.platform as CampaignFormValues['platform'],
        status: campaign.status as CampaignFormValues['status'],
        budget: campaign.budget,
        description: campaign.description ?? '',
        startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : '',
        endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
      })
    } else {
      reset({ name: '', brand: '', platform: 'Instagram', status: 'Draft', budget: undefined, description: '', startDate: '', endDate: '' })
    }
  }, [open, campaign, reset])

  function onSubmit(data: CampaignFormValues) {
    startTransition(async () => {
      const result = isEditing
        ? await updateCampaign(campaign.id, data)
        : await createCampaign(data)

      if (result.error) { toast.error(result.error); return }
      toast.success(isEditing ? 'Campaign updated.' : 'Campaign created.')
      onOpenChange(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[660px] p-0 gap-0 overflow-hidden ring-0"
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
                <Rocket size={16} style={{ color: '#818cf8' }} />
              </div>
              <div style={{ paddingTop: 1 }}>
                <DialogTitle style={{ color: '#f4f4f5', fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                  {isEditing ? 'Edit Campaign' : 'New Campaign'}
                </DialogTitle>
                <DialogDescription style={{ color: '#71717a', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
                  {isEditing
                    ? 'Update the details and settings for this campaign.'
                    : 'Set up a new creator campaign. Fill in the required fields below.'}
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

            {/* Campaign Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <SectionLabel>Campaign Details</SectionLabel>

              <div className="dialog-2col">
                <Field label="Campaign Name" id="name" error={errors.name?.message}>
                  <Input id="name" placeholder="Summer Glow 2026" {...register('name')} style={fieldInput(!!errors.name)} />
                </Field>
                <Field label="Brand" id="brand" error={errors.brand?.message}>
                  <Input id="brand" placeholder="Lumière Beauty" {...register('brand')} style={fieldInput(!!errors.brand)} />
                </Field>
              </div>

              <div className="dialog-2col">
                <Field label="Platform" id="platform" error={errors.platform?.message}>
                  <FieldSelect id="platform" options={PLATFORMS} error={errors.platform?.message} {...register('platform')} />
                </Field>
                <Field label="Status" id="status" error={errors.status?.message}>
                  <FieldSelect id="status" options={STATUSES} error={errors.status?.message} {...register('status')} />
                </Field>
              </div>

              <Field label="Budget (USD)" id="budget" hint="Total budget allocated for this campaign" error={errors.budget?.message}>
                <Input
                  id="budget" type="number" min="0" step="0.01" placeholder="5,000"
                  {...register('budget')} style={fieldInput(!!errors.budget)}
                />
              </Field>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />

            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <SectionLabel>Timeline</SectionLabel>
              <div className="dialog-2col">
                <Field label="Start Date" id="startDate" error={errors.startDate?.message}>
                  <Input
                    id="startDate" type="date" {...register('startDate')}
                    style={{ ...fieldInput(!!errors.startDate), colorScheme: 'dark' } as React.CSSProperties}
                  />
                </Field>
                <Field label="End Date" id="endDate" error={errors.endDate?.message}>
                  <Input
                    id="endDate" type="date" {...register('endDate')}
                    style={{ ...fieldInput(!!errors.endDate), colorScheme: 'dark' } as React.CSSProperties}
                  />
                </Field>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <SectionLabel>Description</SectionLabel>
              <Field
                label="Overview"
                id="description"
                hint="Brief summary of objectives and deliverables for participating creators"
                error={errors.description?.message}
              >
                <Textarea
                  id="description"
                  placeholder="Describe the campaign goals, creative direction, and key deliverables…"
                  rows={3}
                  {...register('description')}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: errors.description ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.09)',
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
              disabled={isPending}
              style={{
                background: isPending
                  ? 'rgba(99,102,241,0.7)'
                  : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                minWidth: 134,
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
                : isEditing ? 'Save Changes' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
