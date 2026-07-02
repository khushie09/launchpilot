'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CampaignDialog } from '@/components/dashboard/CampaignDialog'

interface DashboardHeaderProps {
  activeCampaigns: number
}

export function DashboardHeader({ activeCampaigns }: DashboardHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', color: '#f4f4f5', lineHeight: 1.1 }}>
            Overview
          </h1>
          <p style={{ marginTop: 8, fontSize: 14, color: '#71717a' }}>
            {today} · {activeCampaigns} active {activeCampaigns === 1 ? 'campaign' : 'campaigns'}
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#fff',
            gap: 6,
            boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.25), 0 0 0 3px rgba(99,102,241,0.25)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.25)' }}
        >
          New Campaign
        </Button>
      </div>

      <CampaignDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) router.refresh()
        }}
        campaign={null}
      />
    </>
  )
}
