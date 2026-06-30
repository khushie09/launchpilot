'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { paymentSchema, type PaymentFormValues } from '@/lib/validations/payment'
import type { PaymentStatus } from '@/lib/generated/prisma/enums'

async function getDbUser() {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error('Unauthorized')
  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) throw new Error('User not found in database')
  return user
}

// ── Types ──────────────────────────────────────────────────────────────────────

export type PaymentWithRelations = Awaited<ReturnType<typeof getPayments>>[number]

export type PaymentFormData = Awaited<ReturnType<typeof getPaymentFormData>>

// ── Reads ──────────────────────────────────────────────────────────────────────

export async function getPayments() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return []
  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return []

  return prisma.payment.findMany({
    where: { userId: user.id },
    include: { creator: true, campaign: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getPaymentFormData() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return { campaigns: [], creators: [] }
  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return { campaigns: [], creators: [] }

  const [campaigns, creators] = await Promise.all([
    prisma.campaign.findMany({
      where: { userId: user.id },
      include: { creator: true },
      orderBy: { name: 'asc' },
    }),
    prisma.creator.findMany({ orderBy: { name: 'asc' } }),
  ])

  return { campaigns, creators }
}

export async function getPaymentStats() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return { paid: 0, pending: 0, processing: 0, total: 0 }
  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return { paid: 0, pending: 0, processing: 0, total: 0 }

  const payments = await prisma.payment.findMany({ where: { userId: user.id } })
  const paid       = payments.filter((p) => p.status === 'Paid').reduce((s, p) => s + p.amount, 0)
  const pending    = payments.filter((p) => p.status === 'Pending').reduce((s, p) => s + p.amount, 0)
  const processing = payments.filter((p) => p.status === 'Processing').reduce((s, p) => s + p.amount, 0)
  return { paid, pending, processing, total: paid + pending + processing }
}

// ── Mutations ──────────────────────────────────────────────────────────────────

export async function createPayment(data: PaymentFormValues) {
  const parsed = paymentSchema.safeParse(data)
  if (!parsed.success) return { error: 'Invalid form data' }

  try {
    const user = await getDbUser()

    const payment = await prisma.payment.create({
      data: {
        amount: parsed.data.amount,
        method: parsed.data.method,
        status: parsed.data.status as PaymentStatus,
        notes: parsed.data.notes ?? null,
        paidAt: parsed.data.paidAt ? new Date(parsed.data.paidAt) : null,
        campaignId: parsed.data.campaignId,
        creatorId: parsed.data.creatorId,
        userId: user.id,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/payments')
    return { success: true, payment }
  } catch (err) {
    console.error('[createPayment]', err)
    return { error: 'Failed to create payment. Please try again.' }
  }
}

export async function updatePayment(id: string, data: PaymentFormValues) {
  const parsed = paymentSchema.safeParse(data)
  if (!parsed.success) return { error: 'Invalid form data' }

  try {
    const user = await getDbUser()

    const existing = await prisma.payment.findFirst({ where: { id, userId: user.id } })
    if (!existing) return { error: 'Payment not found' }

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        amount: parsed.data.amount,
        method: parsed.data.method,
        status: parsed.data.status as PaymentStatus,
        notes: parsed.data.notes ?? null,
        paidAt: parsed.data.paidAt ? new Date(parsed.data.paidAt) : null,
        campaignId: parsed.data.campaignId,
        creatorId: parsed.data.creatorId,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/payments')
    return { success: true, payment }
  } catch (err) {
    console.error('[updatePayment]', err)
    return { error: 'Failed to update payment. Please try again.' }
  }
}

export async function updatePaymentStatus(id: string, status: PaymentStatus) {
  try {
    const user = await getDbUser()
    const existing = await prisma.payment.findFirst({ where: { id, userId: user.id } })
    if (!existing) return { error: 'Payment not found' }

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        status,
        paidAt: status === 'Paid' ? new Date() : existing.paidAt,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/payments')
    return { success: true, payment }
  } catch (err) {
    console.error('[updatePaymentStatus]', err)
    return { error: 'Failed to update status.' }
  }
}

export async function deletePayment(id: string) {
  try {
    const user = await getDbUser()
    const existing = await prisma.payment.findFirst({ where: { id, userId: user.id } })
    if (!existing) return { error: 'Payment not found' }

    await prisma.payment.delete({ where: { id } })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/payments')
    return { success: true }
  } catch (err) {
    console.error('[deletePayment]', err)
    return { error: 'Failed to delete payment. Please try again.' }
  }
}
