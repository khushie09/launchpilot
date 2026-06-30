import { getCreators } from '@/app/actions/creators'
import { CreatorsClient } from '@/components/dashboard/CreatorsClient'

export default async function CreatorsPage() {
  const creators = await getCreators()
  return <CreatorsClient creators={creators} />
}
