import { z } from 'zod'

export const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn'] as const
export const STATUSES = ['Draft', 'Active', 'Review', 'Paused', 'Completed'] as const

export const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(100),
  brand: z.string().min(1, 'Brand is required').max(100),
  platform: z.enum(PLATFORMS),
  status: z.enum(STATUSES),
  // z.coerce in Zod v4 infers unknown — explicit type avoids the resolver mismatch
  budget: z.coerce.number().positive('Budget must be greater than 0') as z.ZodType<number>,
  description: z.string().max(500).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type CampaignFormValues = {
  name: string
  brand: string
  platform: (typeof PLATFORMS)[number]
  status: (typeof STATUSES)[number]
  budget: number
  description?: string
  startDate?: string
  endDate?: string
}
