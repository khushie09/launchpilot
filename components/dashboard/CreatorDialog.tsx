'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Users, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { creatorSchema, CREATOR_STATUSES, type CreatorFormValues } from '@/lib/validations/creator'
import { PLATFORMS } from '@/lib/validations/campaign'
import { createCreator, updateCreator, type CreatorWithCount } from '@/app/actions/creators'

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
      name: '', handle: '', platform: 'Instagram', niche: '',
      status: 'Available', followersCount: 0, engagementRate: 0,
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
                <Users size={15} style={{ color: '#818cf8' }} />
              </div>
              <div style={{ paddingTop: 1 }}>
                <DialogTitle style={{ color: '#f4f4f5', fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                  {isEditing ? 'Edit Creator' : 'Add Creator'}
                </DialogTitle>
                <DialogDescription style={{ color: '#71717a', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
                  {isEditing
                    ? 'Update the profile and metrics for this creator.'
                    : 'Add a new creator to your network. All starred fields are required.'}
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

            {/* Profile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <SectionLabel>Profile</SectionLabel>

              <div className="dialog-2col">
                <Field label="Full Name" id="name" error={errors.name?.message}>
                  <Input id="name" placeholder="Sarah Chen" {...register('name')} style={fieldInput(!!errors.name)} />
                </Field>
                <Field label="Handle" id="handle" hint="Include the @ prefix" error={errors.handle?.message}>
                  <Input id="handle" placeholder="@sarah.creates" {...register('handle')} style={fieldInput(!!errors.handle)} />
                </Field>
              </div>

              <div className="dialog-2col">
                <Field label="Platform" id="platform" error={errors.platform?.message}>
                  <FieldSelect id="platform" options={PLATFORMS} error={errors.platform?.message} {...register('platform')} />
                </Field>
                <Field label="Status" id="status" error={errors.status?.message}>
                  <FieldSelect id="status" options={CREATOR_STATUSES} error={errors.status?.message} {...register('status')} />
                </Field>
              </div>

              <Field label="Niche" id="niche" hint="Primary content category or industry" error={errors.niche?.message}>
                <Input id="niche" placeholder="Beauty & Skincare" {...register('niche')} style={fieldInput(!!errors.niche)} />
              </Field>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />

            {/* Audience Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <SectionLabel>Audience Metrics</SectionLabel>

              <div className="dialog-2col">
                <Field
                  label="Followers Count"
                  id="followersCount"
                  hint="Total followers on the selected platform"
                  error={errors.followersCount?.message}
                >
                  <Input
                    id="followersCount" type="number" min="0" placeholder="284,000"
                    {...register('followersCount')} style={fieldInput(!!errors.followersCount)}
                  />
                </Field>
                <Field
                  label="Engagement Rate (%)"
                  id="engagementRate"
                  hint="Avg. (likes + comments) ÷ followers × 100"
                  error={errors.engagementRate?.message}
                >
                  <Input
                    id="engagementRate" type="number" min="0" max="100" step="0.1" placeholder="4.8"
                    {...register('engagementRate')} style={fieldInput(!!errors.engagementRate)}
                  />
                </Field>
              </div>
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
                minWidth: 120,
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
                ? isEditing ? 'Saving…' : 'Adding…'
                : isEditing ? 'Save Changes' : 'Add Creator'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
