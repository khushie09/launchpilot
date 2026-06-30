'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { campaignSchema, type CampaignFormValues } from '@/lib/validations/campaign'
import type { Platform, CampaignStatus } from '@/lib/generated/prisma/enums'

async function getOrCreateDbUser() {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error('Unauthorized')

  const clerkUser = await currentUser()
  if (!clerkUser) throw new Error('Unauthorized')

  return prisma.user.upsert({
    where: { clerkId },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      clerkId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
  })
}

export type CampaignWithCreator = Awaited<ReturnType<typeof getCampaigns>>[number]

export async function getCampaigns() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return []

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return []

  return prisma.campaign.findMany({
    where: { userId: user.id },
    include: { creator: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getDashboardStats() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return null

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return null

  const [campaigns, payments, totalCreators] = await Promise.all([
    prisma.campaign.findMany({ where: { userId: user.id } }),
    prisma.payment.findMany({ where: { userId: user.id, status: 'Paid' } }),
    prisma.creator.count(),
  ])

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
  const activeCampaigns = campaigns.filter((c) => c.status === 'Active').length
  const reviewCampaigns = campaigns.filter((c) => c.status === 'Review').length

  return { totalRevenue, activeCampaigns, reviewCampaigns, totalCampaigns: campaigns.length, totalCreators }
}

export async function createCampaign(data: CampaignFormValues) {
  const parsed = campaignSchema.safeParse(data)
  if (!parsed.success) return { error: 'Invalid form data' }

  try {
    const user = await getOrCreateDbUser()

    const campaign = await prisma.campaign.create({
      data: {
        name: parsed.data.name,
        brand: parsed.data.brand,
        platform: parsed.data.platform as Platform,
        status: parsed.data.status as CampaignStatus,
        budget: parsed.data.budget,
        description: parsed.data.description ?? null,
        startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        userId: user.id,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/campaigns')

    return { success: true, campaign }
  } catch (err) {
    console.error('[createCampaign]', err)
    return { error: 'Failed to create campaign. Please try again.' }
  }
}

export async function updateCampaign(id: string, data: CampaignFormValues) {
  const parsed = campaignSchema.safeParse(data)
  if (!parsed.success) return { error: 'Invalid form data' }

  try {
    const user = await getOrCreateDbUser()

    const existing = await prisma.campaign.findFirst({ where: { id, userId: user.id } })
    if (!existing) return { error: 'Campaign not found' }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        name: parsed.data.name,
        brand: parsed.data.brand,
        platform: parsed.data.platform as Platform,
        status: parsed.data.status as CampaignStatus,
        budget: parsed.data.budget,
        description: parsed.data.description ?? null,
        startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/campaigns')

    return { success: true, campaign }
  } catch (err) {
    console.error('[updateCampaign]', err)
    return { error: 'Failed to update campaign. Please try again.' }
  }
}

export async function deleteCampaign(id: string) {
  try {
    const user = await getOrCreateDbUser()

    const existing = await prisma.campaign.findFirst({ where: { id, userId: user.id } })
    if (!existing) return { error: 'Campaign not found' }

    await prisma.campaign.delete({ where: { id } })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/campaigns')

    return { success: true }
  } catch (err) {
    console.error('[deleteCampaign]', err)
    return { error: 'Failed to delete campaign. Please try again.' }
  }
}
