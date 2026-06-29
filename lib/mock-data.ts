// ── Types ─────────────────────────────────────────────────────────────────────
// When connecting a real backend, replace these with API response types
// and swap the exported arrays with fetch calls or React Query hooks.

export type CampaignStatus = 'Active' | 'Review' | 'Draft' | 'Completed' | 'Paused'
export type PaymentStatus = 'Paid' | 'Pending' | 'Processing' | 'Failed'
export type Platform = 'Instagram' | 'TikTok' | 'YouTube' | 'Twitter' | 'LinkedIn'

export interface Campaign {
  id: string
  name: string
  brand: string
  creator: string
  creatorAvatar: string
  platform: Platform
  status: CampaignStatus
  budget: number
  spent: number
  reach: string
  engagement: string
  startDate: string
  endDate: string
}

export interface Creator {
  id: string
  name: string
  handle: string
  avatar: string
  platform: Platform
  followers: string
  engagement: string
  niche: string
  campaigns: number
  totalEarned: number
  status: 'Available' | 'Busy' | 'Review'
}

export interface Payment {
  id: string
  creator: string
  creatorAvatar: string
  campaign: string
  amount: number
  status: PaymentStatus
  date: string
  method: string
}

export interface Activity {
  id: string
  type: 'campaign_created' | 'creator_joined' | 'payment_sent' | 'content_approved' | 'campaign_completed' | 'brief_sent'
  message: string
  time: string
  avatar?: string
}

// ── Stats ─────────────────────────────────────────────────────────────────────
export const overviewStats = [
  { title: 'Total Revenue', value: '$84,320', change: '+12.5%', trend: 'up' as const, sub: 'vs last month' },
  { title: 'Active Campaigns', value: '24', change: '+3', trend: 'up' as const, sub: 'running now' },
  { title: 'Total Creators', value: '1,284', change: '+48', trend: 'up' as const, sub: 'in network' },
  { title: 'Pending Approvals', value: '9', change: '-4', trend: 'down' as const, sub: 'awaiting review' },
]

// ── Campaigns ─────────────────────────────────────────────────────────────────
export const campaigns: Campaign[] = [
  {
    id: 'c1',
    name: 'Summer Glow Collection',
    brand: 'Lumière Beauty',
    creator: 'Sarah Chen',
    creatorAvatar: 'SC',
    platform: 'Instagram',
    status: 'Active',
    budget: 4200,
    spent: 2800,
    reach: '142K',
    engagement: '4.8%',
    startDate: '2026-06-01',
    endDate: '2026-07-31',
  },
  {
    id: 'c2',
    name: 'Urban Edge Drop',
    brand: 'VRTX Streetwear',
    creator: 'Mike Torres',
    creatorAvatar: 'MT',
    platform: 'TikTok',
    status: 'Active',
    budget: 8500,
    spent: 5100,
    reach: '890K',
    engagement: '6.2%',
    startDate: '2026-05-15',
    endDate: '2026-06-30',
  },
  {
    id: 'c3',
    name: 'Q3 Protein Launch',
    brand: 'PeakForm Nutrition',
    creator: 'Alex Rivera',
    creatorAvatar: 'AR',
    platform: 'YouTube',
    status: 'Review',
    budget: 12000,
    spent: 0,
    reach: '320K',
    engagement: '3.9%',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
  },
  {
    id: 'c4',
    name: 'Autumn Wardrobe Edit',
    brand: 'Thread & Thread',
    creator: 'Emma Lawson',
    creatorAvatar: 'EL',
    platform: 'Instagram',
    status: 'Draft',
    budget: 5500,
    spent: 0,
    reach: '—',
    engagement: '—',
    startDate: '2026-09-01',
    endDate: '2026-10-15',
  },
  {
    id: 'c5',
    name: 'Creator Collab S2',
    brand: 'Orbis Coffee',
    creator: 'James Okafor',
    creatorAvatar: 'JO',
    platform: 'TikTok',
    status: 'Active',
    budget: 3100,
    spent: 2950,
    reach: '205K',
    engagement: '7.1%',
    startDate: '2026-05-20',
    endDate: '2026-06-20',
  },
  {
    id: 'c6',
    name: 'Home Reset Series',
    brand: 'Cove Interiors',
    creator: 'Priya Nair',
    creatorAvatar: 'PN',
    platform: 'YouTube',
    status: 'Completed',
    budget: 6800,
    spent: 6800,
    reach: '478K',
    engagement: '5.4%',
    startDate: '2026-04-01',
    endDate: '2026-05-31',
  },
  {
    id: 'c7',
    name: 'Tech Desk Setup Vol.3',
    brand: 'Logicraft',
    creator: 'David Kim',
    creatorAvatar: 'DK',
    platform: 'YouTube',
    status: 'Paused',
    budget: 9200,
    spent: 3400,
    reach: '210K',
    engagement: '4.1%',
    startDate: '2026-05-01',
    endDate: '2026-08-01',
  },
  {
    id: 'c8',
    name: 'Wellness Morning Routine',
    brand: 'Solis Wellness',
    creator: 'Nina Park',
    creatorAvatar: 'NP',
    platform: 'Instagram',
    status: 'Active',
    budget: 3800,
    spent: 1200,
    reach: '98K',
    engagement: '5.9%',
    startDate: '2026-06-10',
    endDate: '2026-07-20',
  },
]

// ── Creators ──────────────────────────────────────────────────────────────────
export const creators: Creator[] = [
  { id: 'cr1', name: 'Sarah Chen', handle: '@sarah.creates', avatar: 'SC', platform: 'Instagram', followers: '284K', engagement: '4.8%', niche: 'Beauty & Skincare', campaigns: 12, totalEarned: 28400, status: 'Available' },
  { id: 'cr2', name: 'Mike Torres', handle: '@mike.design', avatar: 'MT', platform: 'TikTok', followers: '1.2M', engagement: '6.2%', niche: 'Fashion & Streetwear', campaigns: 8, totalEarned: 41200, status: 'Busy' },
  { id: 'cr3', name: 'Alex Rivera', handle: '@alex.fitness', avatar: 'AR', platform: 'YouTube', followers: '520K', engagement: '3.9%', niche: 'Fitness & Nutrition', campaigns: 15, totalEarned: 67800, status: 'Available' },
  { id: 'cr4', name: 'Emma Lawson', handle: '@emma.content', avatar: 'EL', platform: 'Instagram', followers: '398K', engagement: '5.7%', niche: 'Lifestyle & Fashion', campaigns: 9, totalEarned: 33500, status: 'Review' },
  { id: 'cr5', name: 'James Okafor', handle: '@james.shoots', avatar: 'JO', platform: 'TikTok', followers: '760K', engagement: '7.1%', niche: 'Food & Beverage', campaigns: 6, totalEarned: 19600, status: 'Available' },
  { id: 'cr6', name: 'Priya Nair', handle: '@priya.home', avatar: 'PN', platform: 'YouTube', followers: '245K', engagement: '5.4%', niche: 'Home & Interior', campaigns: 11, totalEarned: 52100, status: 'Available' },
  { id: 'cr7', name: 'David Kim', handle: '@david.tech', avatar: 'DK', platform: 'YouTube', followers: '890K', engagement: '4.1%', niche: 'Tech & Gadgets', campaigns: 20, totalEarned: 95400, status: 'Busy' },
  { id: 'cr8', name: 'Nina Park', handle: '@nina.wellness', avatar: 'NP', platform: 'Instagram', followers: '178K', engagement: '5.9%', niche: 'Wellness & Mindfulness', campaigns: 7, totalEarned: 21900, status: 'Available' },
]

// ── Payments ──────────────────────────────────────────────────────────────────
export const payments: Payment[] = [
  { id: 'p1', creator: 'Sarah Chen', creatorAvatar: 'SC', campaign: 'Summer Glow Collection', amount: 2800, status: 'Paid', date: '2026-06-15', method: 'Bank Transfer' },
  { id: 'p2', creator: 'Mike Torres', creatorAvatar: 'MT', campaign: 'Urban Edge Drop', amount: 5100, status: 'Processing', date: '2026-06-18', method: 'PayPal' },
  { id: 'p3', creator: 'Alex Rivera', creatorAvatar: 'AR', campaign: 'Q3 Protein Launch', amount: 4000, status: 'Pending', date: '2026-07-01', method: 'Bank Transfer' },
  { id: 'p4', creator: 'Priya Nair', creatorAvatar: 'PN', campaign: 'Home Reset Series', amount: 6800, status: 'Paid', date: '2026-05-31', method: 'Bank Transfer' },
  { id: 'p5', creator: 'James Okafor', creatorAvatar: 'JO', campaign: 'Creator Collab S2', amount: 2950, status: 'Paid', date: '2026-06-19', method: 'Stripe' },
  { id: 'p6', creator: 'Emma Lawson', creatorAvatar: 'EL', campaign: 'Autumn Wardrobe Edit', amount: 1000, status: 'Pending', date: '2026-09-01', method: 'Bank Transfer' },
  { id: 'p7', creator: 'David Kim', creatorAvatar: 'DK', campaign: 'Tech Desk Setup Vol.3', amount: 3400, status: 'Processing', date: '2026-06-10', method: 'PayPal' },
  { id: 'p8', creator: 'Nina Park', creatorAvatar: 'NP', campaign: 'Wellness Morning Routine', amount: 1200, status: 'Paid', date: '2026-06-22', method: 'Stripe' },
]

// ── Activity feed ─────────────────────────────────────────────────────────────
export const recentActivity: Activity[] = [
  { id: 'a1', type: 'content_approved', message: 'Content approved for Summer Glow Collection', time: '2 min ago', avatar: 'SC' },
  { id: 'a2', type: 'payment_sent', message: '$6,800 paid to Priya Nair', time: '18 min ago', avatar: 'PN' },
  { id: 'a3', type: 'creator_joined', message: 'Nina Park joined Wellness Morning Routine', time: '1 hr ago', avatar: 'NP' },
  { id: 'a4', type: 'campaign_created', message: 'New campaign "Autumn Wardrobe Edit" created', time: '3 hr ago' },
  { id: 'a5', type: 'brief_sent', message: 'Creative brief sent to Alex Rivera', time: '5 hr ago', avatar: 'AR' },
  { id: 'a6', type: 'campaign_completed', message: 'Home Reset Series marked complete', time: '1 day ago', avatar: 'PN' },
  { id: 'a7', type: 'payment_sent', message: '$5,100 payment initiated to Mike Torres', time: '1 day ago', avatar: 'MT' },
  { id: 'a8', type: 'content_approved', message: 'Urban Edge Drop — 3 posts approved', time: '2 days ago', avatar: 'MT' },
]

// ── Revenue chart ─────────────────────────────────────────────────────────────
export const monthlyRevenue = [
  { month: 'Jan', revenue: 18400, campaigns: 4 },
  { month: 'Feb', revenue: 22100, campaigns: 5 },
  { month: 'Mar', revenue: 19800, campaigns: 6 },
  { month: 'Apr', revenue: 31200, campaigns: 8 },
  { month: 'May', revenue: 27600, campaigns: 7 },
  { month: 'Jun', revenue: 34800, campaigns: 9 },
  { month: 'Jul', revenue: 29400, campaigns: 7 },
  { month: 'Aug', revenue: 38900, campaigns: 11 },
  { month: 'Sep', revenue: 42100, campaigns: 12 },
  { month: 'Oct', revenue: 44800, campaigns: 13 },
  { month: 'Nov', revenue: 51200, campaigns: 14 },
  { month: 'Dec', revenue: 58400, campaigns: 16 },
]
