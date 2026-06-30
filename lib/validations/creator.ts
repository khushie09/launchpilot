import { z } from 'zod'
import { PLATFORMS } from './campaign'

export const CREATOR_STATUSES = ['Available', 'Busy', 'Review'] as const

export const creatorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  handle: z
    .string()
    .min(1, 'Handle is required')
    .max(50)
    .regex(/^@?[\w.]+$/, 'Handle can only contain letters, numbers, underscores, and dots')
    .transform((v) => (v.startsWith('@') ? v : `@${v}`)),
  platform: z.enum(PLATFORMS),
  niche: z.string().max(80).optional(),
  status: z.enum(CREATOR_STATUSES),
  followersCount: z.coerce.number().min(0).default(0) as z.ZodType<number>,
  engagementRate: z.coerce.number().min(0).max(100).default(0) as z.ZodType<number>,
})

export type CreatorFormValues = {
  name: string
  handle: string
  platform: (typeof PLATFORMS)[number]
  niche?: string
  status: (typeof CREATOR_STATUSES)[number]
  followersCount: number
  engagementRate: number
}
