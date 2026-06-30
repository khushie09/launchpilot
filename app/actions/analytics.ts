'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// ── Helpers ────────────────────────────────────────────────────────────────────

function lastNMonths(n: number) {
  const months = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      year: d.getFullYear(),
      month: d.getMonth(), // 0-indexed
      label: d.toLocaleString('en-US', { month: 'short' }),
    })
  }
  return months
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60_000)
  const hrs  = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (mins  <  1) return 'just now'
  if (mins  < 60) return `${mins} min ago`
  if (hrs   < 24) return `${hrs} hr ago`
  if (days  <  7) return `${days} day${days > 1 ? 's' : ''} ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function initials(name: string) {
  return name.split(' ').map((w) => w[0] ?? '').join('').slice(0, 2).toUpperCase()
}

// ── Types ──────────────────────────────────────────────────────────────────────

export type MonthlyPoint  = { month: string; value: number }
export type PlatformSlice = { platform: string; count: number; pct: number }
export type TopCampaign   = { id: string; name: string; brand: string; platform: string; reach: number; engagement: number }
export type ActivityItem  = { id: string; message: string; timeAgo: string; initials: string }

export type AnalyticsData = {
  // KPI cards
  totalImpressions: number
  avgEngagement: number     // %
  contentPieces: number
  // Charts
  monthlyRevenue: MonthlyPoint[]
  monthlyCampaigns: MonthlyPoint[]
  platformDistribution: PlatformSlice[]
  topByReach: TopCampaign[]
  // Activity
  recentActivity: ActivityItem[]
  // Totals used by the charts' header values
  totalPaidRevenue: number
  totalCampaignCount: number
}

// For the overview page revenue chart — a lightweight subset
export type RevenuePoint = { month: string; revenue: number }

// ── Main query ─────────────────────────────────────────────────────────────────

export async function getAnalyticsData(): Promise<AnalyticsData | null> {
  const { userId: clerkId } = await auth()
  if (!clerkId) return null

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return null

  const months = lastNMonths(12)

  const [campaigns, allPayments, creators] = await Promise.all([
    prisma.campaign.findMany({
      where: { userId: user.id },
      include: { creator: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.payment.findMany({
      where: { userId: user.id },
      include: { creator: true, campaign: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.creator.findMany({ orderBy: { createdAt: 'desc' } }),
  ])

  const paidPayments = allPayments.filter((p) => p.status === 'Paid')

  // ── Monthly revenue ──────────────────────────────────────────────────────────
  const monthlyRevenue: MonthlyPoint[] = months.map((m) => ({
    month: m.label,
    value: paidPayments
      .filter((p) => {
        const d = new Date(p.paidAt ?? p.createdAt)
        return d.getFullYear() === m.year && d.getMonth() === m.month
      })
      .reduce((sum, p) => sum + p.amount, 0),
  }))

  // ── Monthly campaigns ────────────────────────────────────────────────────────
  const monthlyCampaigns: MonthlyPoint[] = months.map((m) => ({
    month: m.label,
    value: campaigns.filter((c) => {
      const d = new Date(c.createdAt)
      return d.getFullYear() === m.year && d.getMonth() === m.month
    }).length,
  }))

  // ── Platform distribution ────────────────────────────────────────────────────
  const platformCounts: Record<string, number> = {}
  campaigns.forEach((c) => { platformCounts[c.platform] = (platformCounts[c.platform] ?? 0) + 1 })
  const platformDistribution: PlatformSlice[] = Object.entries(platformCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([platform, count]) => ({
      platform,
      count,
      pct: campaigns.length > 0 ? Math.round((count / campaigns.length) * 100) : 0,
    }))

  // ── Top campaigns by reach ───────────────────────────────────────────────────
  const topByReach: TopCampaign[] = [...campaigns]
    .filter((c) => c.reach > 0)
    .sort((a, b) => b.reach - a.reach)
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      name: c.name,
      brand: c.brand,
      platform: c.platform,
      reach: c.reach,
      engagement: c.engagement,
    }))

  // ── KPI aggregates ───────────────────────────────────────────────────────────
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.reach, 0)
  const avgEngagement = creators.length > 0
    ? creators.reduce((sum, c) => sum + c.engagementRate, 0) / creators.length
    : 0
  const contentPieces = campaigns.filter(
    (c) => c.status === 'Active' || c.status === 'Completed',
  ).length

  // ── Recent activity ──────────────────────────────────────────────────────────
  type RawActivity = { id: string; message: string; ts: Date; initials: string }
  const raw: RawActivity[] = []

  paidPayments.slice(0, 5).forEach((p) => {
    raw.push({
      id: `pay-${p.id}`,
      message: `$${p.amount.toLocaleString()} paid to ${p.creator.name}`,
      ts: p.paidAt ?? p.createdAt,
      initials: initials(p.creator.name),
    })
  })
  campaigns.slice(0, 5).forEach((c) => {
    raw.push({
      id: `camp-${c.id}`,
      message: c.status === 'Active'
        ? `Campaign "${c.name}" is now active`
        : `Campaign "${c.name}" created`,
      ts: c.createdAt,
      initials: c.brand.slice(0, 2).toUpperCase(),
    })
  })
  creators.slice(0, 3).forEach((c) => {
    raw.push({
      id: `cr-${c.id}`,
      message: `${c.name} added to the creator network`,
      ts: c.createdAt,
      initials: initials(c.name),
    })
  })

  const recentActivity: ActivityItem[] = raw
    .sort((a, b) => b.ts.getTime() - a.ts.getTime())
    .slice(0, 8)
    .map(({ id, message, ts, initials: ini }) => ({ id, message, timeAgo: timeAgo(ts), initials: ini }))

  return {
    totalImpressions,
    avgEngagement,
    contentPieces,
    monthlyRevenue,
    monthlyCampaigns,
    platformDistribution,
    topByReach,
    recentActivity,
    totalPaidRevenue: paidPayments.reduce((s, p) => s + p.amount, 0),
    totalCampaignCount: campaigns.length,
  }
}

// Lightweight fetch used by the dashboard overview RevenueChart
export async function getDashboardRevenue(): Promise<RevenuePoint[]> {
  const { userId: clerkId } = await auth()
  if (!clerkId) return []

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return []

  const months = lastNMonths(12)
  const paidPayments = await prisma.payment.findMany({
    where: { userId: user.id, status: 'Paid' },
    select: { amount: true, paidAt: true, createdAt: true },
  })

  return months.map((m) => ({
    month: m.label,
    revenue: paidPayments
      .filter((p) => {
        const d = new Date(p.paidAt ?? p.createdAt)
        return d.getFullYear() === m.year && d.getMonth() === m.month
      })
      .reduce((sum, p) => sum + p.amount, 0),
  }))
}

// Activity feed used by the dashboard overview
export async function getDashboardActivity(): Promise<ActivityItem[]> {
  const { userId: clerkId } = await auth()
  if (!clerkId) return []

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return []

  const [recentPayments, recentCampaigns, recentCreators] = await Promise.all([
    prisma.payment.findMany({
      where: { userId: user.id, status: 'Paid' },
      include: { creator: true },
      orderBy: { paidAt: 'desc' },
      take: 4,
    }),
    prisma.campaign.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    prisma.creator.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
  ])

  type RawActivity = { id: string; message: string; ts: Date; initials: string }
  const raw: RawActivity[] = []

  recentPayments.forEach((p) => {
    raw.push({
      id: `pay-${p.id}`,
      message: `$${p.amount.toLocaleString()} paid to ${p.creator.name}`,
      ts: p.paidAt ?? p.createdAt,
      initials: initials(p.creator.name),
    })
  })
  recentCampaigns.forEach((c) => {
    raw.push({
      id: `camp-${c.id}`,
      message: c.status === 'Active' ? `"${c.name}" is now active` : `Campaign "${c.name}" created`,
      ts: c.createdAt,
      initials: c.brand.slice(0, 2).toUpperCase(),
    })
  })
  recentCreators.forEach((c) => {
    raw.push({
      id: `cr-${c.id}`,
      message: `${c.name} joined the creator network`,
      ts: c.createdAt,
      initials: initials(c.name),
    })
  })

  return raw
    .sort((a, b) => b.ts.getTime() - a.ts.getTime())
    .slice(0, 8)
    .map(({ id, message, ts, initials: ini }) => ({ id, message, timeAgo: timeAgo(ts), initials: ini }))
}
