import { getCampaigns } from '@/app/actions/campaigns'
import { CampaignsClient } from '@/components/dashboard/CampaignsClient'

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()
  return <CampaignsClient campaigns={campaigns} />
}
