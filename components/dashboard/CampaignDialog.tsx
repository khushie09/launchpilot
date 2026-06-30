'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
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
  campaignSchema,
  PLATFORMS,
  STATUSES,
  type CampaignFormValues,
} from '@/lib/validations/campaign'
import { createCampaign, updateCampaign } from '@/app/actions/campaigns'
import type { CampaignWithCreator } from '@/app/actions/campaigns'

// ── Styled native select ───────────────────────────────────────────────────────
function FieldSelect({
  id,
  options,
  error,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  id: string
  options: readonly string[]
  error?: string
}) {
  return (
    <select
      id={id}
      style={{
        width: '100%',
        height: 36,
        borderRadius: 8,
        border: error ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.04)',
        color: '#e4e4e7',
        fontSize: 13,
        paddingLeft: 10,
        paddingRight: 10,
        outline: 'none',
        cursor: 'pointer',
        appearance: 'auto',
      }}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt} value={opt} style={{ background: '#0f0f13' }}>
          {opt}
        </option>
      ))}
    </select>
  )
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({
  label,
  id,
  error,
  children,
}: {
  label: string
  id: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Label htmlFor={id} style={{ fontSize: 12, color: '#a1a1aa', fontWeight: 500 }}>
        {label}
      </Label>
      {children}
      {error && <p style={{ fontSize: 11, color: '#f87171', marginTop: 2 }}>{error}</p>}
    </div>
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
      name: '',
      brand: '',
      platform: 'Instagram',
      status: 'Draft',
      budget: undefined,
      description: '',
      startDate: '',
      endDate: '',
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (open) {
      if (campaign) {
        reset({
          name: campaign.name,
          brand: campaign.brand,
          platform: campaign.platform as CampaignFormValues['platform'],
          status: campaign.status as CampaignFormValues['status'],
          budget: campaign.budget,
          description: campaign.description ?? '',
          startDate: campaign.startDate
            ? new Date(campaign.startDate).toISOString().split('T')[0]
            : '',
          endDate: campaign.endDate
            ? new Date(campaign.endDate).toISOString().split('T')[0]
            : '',
        })
      } else {
        reset({
          name: '',
          brand: '',
          platform: 'Instagram',
          status: 'Draft',
          budget: undefined,
          description: '',
          startDate: '',
          endDate: '',
        })
      }
    }
  }, [open, campaign, reset])

  function onSubmit(data: CampaignFormValues) {
    startTransition(async () => {
      const result = isEditing
        ? await updateCampaign(campaign.id, data)
        : await createCampaign(data)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(isEditing ? 'Campaign updated.' : 'Campaign created.')
      onOpenChange(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        style={{
          background: '#0f0f13',
          border: '1px solid rgba(255,255,255,0.08)',
          maxWidth: 560,
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#f4f4f5', fontSize: 16, fontWeight: 600 }}>
            {isEditing ? 'Edit Campaign' : 'New Campaign'}
          </DialogTitle>
          <DialogDescription style={{ color: '#52525b', fontSize: 13 }}>
            {isEditing
              ? 'Update the campaign details below.'
              : 'Fill in the details to launch a new campaign.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0 20px' }}>
            {/* Row 1: Name + Brand */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Campaign Name" id="name" error={errors.name?.message}>
                <Input
                  id="name"
                  placeholder="Summer Glow 2026"
                  {...register('name')}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: errors.name ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.1)',
                    color: '#e4e4e7',
                    fontSize: 13,
                    height: 36,
                  }}
                />
              </Field>
              <Field label="Brand" id="brand" error={errors.brand?.message}>
                <Input
                  id="brand"
                  placeholder="Lumière Beauty"
                  {...register('brand')}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: errors.brand ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.1)',
                    color: '#e4e4e7',
                    fontSize: 13,
                    height: 36,
                  }}
                />
              </Field>
            </div>

            {/* Row 2: Platform + Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Platform" id="platform" error={errors.platform?.message}>
                <FieldSelect
                  id="platform"
                  options={PLATFORMS}
                  error={errors.platform?.message}
                  {...register('platform')}
                />
              </Field>
              <Field label="Status" id="status" error={errors.status?.message}>
                <FieldSelect
                  id="status"
                  options={STATUSES}
                  error={errors.status?.message}
                  {...register('status')}
                />
              </Field>
            </div>

            {/* Row 3: Budget */}
            <Field label="Budget (USD)" id="budget" error={errors.budget?.message}>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="5000"
                {...register('budget')}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: errors.budget ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.1)',
                  color: '#e4e4e7',
                  fontSize: 13,
                  height: 36,
                }}
              />
            </Field>

            {/* Row 4: Description */}
            <Field label="Description" id="description" error={errors.description?.message}>
              <Textarea
                id="description"
                placeholder="What is this campaign about?"
                rows={3}
                {...register('description')}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: errors.description
                    ? '1px solid #f87171'
                    : '1px solid rgba(255,255,255,0.1)',
                  color: '#e4e4e7',
                  fontSize: 13,
                  resize: 'none',
                }}
              />
            </Field>

            {/* Row 5: Start + End date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Start Date" id="startDate" error={errors.startDate?.message}>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e4e4e7',
                    fontSize: 13,
                    height: 36,
                    colorScheme: 'dark',
                  }}
                />
              </Field>
              <Field label="End Date" id="endDate" error={errors.endDate?.message}>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e4e4e7',
                    fontSize: 13,
                    height: 36,
                    colorScheme: 'dark',
                  }}
                />
              </Field>
            </div>
          </div>

          <DialogFooter showCloseButton>
            <Button
              type="submit"
              disabled={isPending}
              style={{ background: '#6366f1', color: '#fff', minWidth: 120 }}
            >
              {isPending
                ? isEditing
                  ? 'Saving…'
                  : 'Creating…'
                : isEditing
                  ? 'Save Changes'
                  : 'Create Campaign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
