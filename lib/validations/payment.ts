import { z } from 'zod'

export const PAYMENT_METHODS = ['Bank Transfer', 'Stripe', 'PayPal', 'Wise'] as const
export const PAYMENT_STATUSES = ['Pending', 'Processing', 'Paid'] as const

export const paymentSchema = z.object({
  campaignId: z.string().min(1, 'Campaign is required'),
  creatorId: z.string().min(1, 'Creator is required'),
  amount: z.coerce.number().positive('Amount must be greater than 0') as z.ZodType<number>,
  method: z.enum(PAYMENT_METHODS),
  status: z.enum(PAYMENT_STATUSES),
  notes: z.string().max(500).optional(),
  paidAt: z.string().optional(),
})

export type PaymentFormValues = {
  campaignId: string
  creatorId: string
  amount: number
  method: (typeof PAYMENT_METHODS)[number]
  status: (typeof PAYMENT_STATUSES)[number]
  notes?: string
  paidAt?: string
}
