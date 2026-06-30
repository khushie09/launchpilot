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
import { Label } from '@/components/ui/label'
import { creatorSchema, CREATOR_STATUSES, type CreatorFormValues } from '@/lib/validations/creator'
import { PLATFORMS } from '@/lib/validations/campaign'
import { createCreator, updateCreator, type CreatorWithCount } from '@/app/actions/creators'

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

const inputStyle = (hasError?: boolean): React.CSSProperties => ({
  background: 'rgba(255,255,255,0.04)',
  border: hasError ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.1)',
  color: '#e4e4e7',
  fontSize: 13,
  height: 36,
})

// ─────────────────────────────────────────────────────────────────────────────

interface CreatorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  creator?: CreatorWithCount | null
}

export function CreatorDialog({ open, onOpenChange, creator }: CreatorDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!creator

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatorFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(creatorSchema) as any,
    defaultValues: {
      name: '',
      handle: '',
      platform: 'Instagram',
      niche: '',
      status: 'Available',
      followersCount: 0,
      engagementRate: 0,
    },
  })

  useEffect(() => {
    if (!open) return
    if (creator) {
      reset({
        name: creator.name,
        handle: creator.handle,
        platform: creator.platform as CreatorFormValues['platform'],
        niche: creator.niche ?? '',
        status: creator.status as CreatorFormValues['status'],
        followersCount: creator.followersCount,
        engagementRate: creator.engagementRate,
      })
    } else {
      reset({ name: '', handle: '', platform: 'Instagram', niche: '', status: 'Available', followersCount: 0, engagementRate: 0 })
    }
  }, [open, creator, reset])

  function onSubmit(data: CreatorFormValues) {
    startTransition(async () => {
      const result = isEditing
        ? await updateCreator(creator.id, data)
        : await createCreator(data)

      if (result.error) { toast.error(result.error); return }
      toast.success(isEditing ? 'Creator updated.' : 'Creator added.')
      onOpenChange(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        style={{ background: '#0f0f13', border: '1px solid rgba(255,255,255,0.08)', maxWidth: 540 }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#f4f4f5', fontSize: 16, fontWeight: 600 }}>
            {isEditing ? 'Edit Creator' : 'Add Creator'}
          </DialogTitle>
          <DialogDescription style={{ color: '#52525b', fontSize: 13 }}>
            {isEditing ? 'Update creator details.' : 'Add a creator to your network.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '8px 0 20px' }}>
            {/* Name + Handle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Full Name" id="name" error={errors.name?.message}>
                <Input id="name" placeholder="Sarah Chen" {...register('name')} style={inputStyle(!!errors.name)} />
              </Field>
              <Field label="Handle" id="handle" error={errors.handle?.message}>
                <Input id="handle" placeholder="@sarah.creates" {...register('handle')} style={inputStyle(!!errors.handle)} />
              </Field>
            </div>

            {/* Platform + Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Platform" id="platform" error={errors.platform?.message}>
                <FieldSelect id="platform" options={PLATFORMS} error={errors.platform?.message} {...register('platform')} />
              </Field>
              <Field label="Status" id="status" error={errors.status?.message}>
                <FieldSelect id="status" options={CREATOR_STATUSES} error={errors.status?.message} {...register('status')} />
              </Field>
            </div>

            {/* Niche */}
            <Field label="Niche" id="niche" error={errors.niche?.message}>
              <Input id="niche" placeholder="Beauty & Skincare" {...register('niche')} style={inputStyle(!!errors.niche)} />
            </Field>

            {/* Followers + Engagement */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Followers Count" id="followersCount" error={errors.followersCount?.message}>
                <Input id="followersCount" type="number" min="0" placeholder="284000" {...register('followersCount')} style={inputStyle(!!errors.followersCount)} />
              </Field>
              <Field label="Engagement Rate (%)" id="engagementRate" error={errors.engagementRate?.message}>
                <Input id="engagementRate" type="number" min="0" max="100" step="0.1" placeholder="4.8" {...register('engagementRate')} style={inputStyle(!!errors.engagementRate)} />
              </Field>
            </div>
          </div>

          <DialogFooter showCloseButton>
            <Button
              type="submit"
              disabled={isPending}
              style={{ background: '#6366f1', color: '#fff', minWidth: 110 }}
            >
              {isPending
                ? isEditing ? 'Saving…' : 'Adding…'
                : isEditing ? 'Save Changes' : 'Add Creator'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
