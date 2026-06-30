'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { creatorSchema, type CreatorFormValues } from '@/lib/validations/creator'
import type { Platform, CreatorStatus } from '@/lib/generated/prisma/enums'

async function requireAuth() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export type CreatorWithCount = Awaited<ReturnType<typeof getCreators>>[number]

export async function getCreators() {
  await requireAuth()
  return prisma.creator.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { campaigns: true } } },
  })
}

export async function getCreatorStats() {
  await requireAuth()
  const [total, available, busy] = await Promise.all([
    prisma.creator.count(),
    prisma.creator.count({ where: { status: 'Available' } }),
    prisma.creator.count({ where: { status: 'Busy' } }),
  ])
  return { total, available, busy }
}

export async function createCreator(data: CreatorFormValues) {
  await requireAuth()

  const parsed = creatorSchema.safeParse(data)
  if (!parsed.success) return { error: 'Invalid form data' }

  const existing = await prisma.creator.findUnique({ where: { handle: parsed.data.handle } })
  if (existing) return { error: `Handle ${parsed.data.handle} is already taken` }

  try {
    const creator = await prisma.creator.create({
      data: {
        name: parsed.data.name,
        handle: parsed.data.handle,
        platform: parsed.data.platform as Platform,
        niche: parsed.data.niche ?? null,
        status: parsed.data.status as CreatorStatus,
        followersCount: parsed.data.followersCount,
        engagementRate: parsed.data.engagementRate,
      },
    })
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/creators')
    return { success: true, creator }
  } catch (err) {
    console.error('[createCreator]', err)
    return { error: 'Failed to create creator. Please try again.' }
  }
}

export async function updateCreator(id: string, data: CreatorFormValues) {
  await requireAuth()

  const parsed = creatorSchema.safeParse(data)
  if (!parsed.success) return { error: 'Invalid form data' }

  const existing = await prisma.creator.findUnique({ where: { handle: parsed.data.handle } })
  if (existing && existing.id !== id) return { error: `Handle ${parsed.data.handle} is already taken` }

  try {
    const creator = await prisma.creator.update({
      where: { id },
      data: {
        name: parsed.data.name,
        handle: parsed.data.handle,
        platform: parsed.data.platform as Platform,
        niche: parsed.data.niche ?? null,
        status: parsed.data.status as CreatorStatus,
        followersCount: parsed.data.followersCount,
        engagementRate: parsed.data.engagementRate,
      },
    })
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/creators')
    return { success: true, creator }
  } catch (err) {
    console.error('[updateCreator]', err)
    return { error: 'Failed to update creator. Please try again.' }
  }
}

export async function deleteCreator(id: string) {
  await requireAuth()
  try {
    await prisma.creator.delete({ where: { id } })
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/creators')
    return { success: true }
  } catch (err) {
    console.error('[deleteCreator]', err)
    return { error: 'Failed to delete creator. Please try again.' }
  }
}
