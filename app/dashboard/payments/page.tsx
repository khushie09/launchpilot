import { getPayments, getPaymentFormData } from '@/app/actions/payments'
import { PaymentsClient } from '@/components/dashboard/PaymentsClient'

export default async function PaymentsPage() {
  const [payments, formData] = await Promise.all([getPayments(), getPaymentFormData()])
  return <PaymentsClient payments={payments} formData={formData} />
}
