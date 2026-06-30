'use client'

import { motion } from 'framer-motion'
import { FileText, CreditCard, BarChart2, Users, CheckSquare, Layers } from 'lucide-react'

const FEATURES = [
  {
    icon: FileText,
    title: 'Brief Management',
    description:
      'Create and send detailed creative briefs. Track revisions, feedback, and approvals in one thread — no email chains.',
  },
  {
    icon: CreditCard,
    title: 'Automated Payments',
    description:
      'Pay creators in 30+ currencies automatically on milestone completion. No spreadsheets, no delays, no chasing.',
  },
  {
    icon: BarChart2,
    title: 'Campaign Analytics',
    description:
      'Real-time ROI across every creator and platform. Know what converts before the campaign ends.',
  },
  {
    icon: Users,
    title: 'Creator Discovery',
    description:
      'Search 2M+ vetted creators by niche, audience size, and past performance. Filter by what actually matters.',
  },
  {
    icon: CheckSquare,
    title: 'Content Approval',
    description:
      'Review, comment, and approve content in a single workflow. Your brand stays consistent across every post.',
  },
  {
    icon: Layers,
    title: 'Campaign OS',
    description:
      'Every brief, creator, payment, and asset in one place. Run ten campaigns with the overhead of one.',
  },
]

const ease = [0.22, 1, 0.36, 1] as const

// ── Corner bracket mark ───────────────────────────────────────────────────────
function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const d = {
    tl: 'M10 0 L0 0 L0 10',
    tr: 'M0 0 L10 0 L10 10',
    br: 'M0 10 L10 10 L10 0',
    bl: 'M10 10 L0 10 L0 0',
  }[pos]
  const style: React.CSSProperties = {
    position: 'absolute',
    ...(pos.includes('t') ? { top: -5 } : { bottom: -5 }),
    ...(pos.includes('l') ? { left: -5 } : { right: -5 }),
  }
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={style}>
      <path d={d} stroke="rgba(99,102,241,0.35)" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Features() {
  return (
    <section
      style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: 60,
        paddingBottom: 120,
        position: 'relative',
      }}
    >

      {/* Seam glow — dashboard → features */}
      <div
        aria-hidden="true"
        className="pointer-events-none"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 180,
          zIndex: -1,
          background: 'linear-gradient(180deg, rgba(7,7,10,0.50) 0%, transparent 48%)',
        }}
      />

      <div style={{ maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 32, paddingRight: 32, position: 'relative' }}>

        {/* Section header */}
        <div style={{ maxWidth: 480, marginBottom: 56 }}>
          <p
            className="uppercase"
            style={{ color: '#3f3f46', fontSize: 10, letterSpacing: '0.18em', fontWeight: 500, marginBottom: 16 }}
          >
            Features
          </p>
          <h2
            className="font-medium"
            style={{
              color: '#f4f4f5',
              fontSize: 'clamp(26px, 2.8vw, 34px)',
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
            }}
          >
            Everything you need to run
            <br />creator campaigns.
          </h2>
          <p style={{ color: '#52525b', fontSize: 15, lineHeight: 1.65, marginTop: 16 }}>
            Not just another tool — a complete operating system for every campaign
            from brief to final results.
          </p>
        </div>

        {/* Feature grid */}
        <div style={{ position: 'relative' }}>
          {/* Corner marks on the outer container */}
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />

          <div
            className="features-grid overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}
          >
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon

                return (
                  <motion.div
                    key={feature.title}
                    style={{
                      paddingTop: 28,
                      paddingBottom: 28,
                      paddingLeft: 28,
                      paddingRight: 28,
                      borderRight: '1px solid rgba(255,255,255,0.05)',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'background 0.18s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.012)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease }}
                  >
                    {/* Icon */}
                    <div
                      className="flex items-center justify-center"
                      style={{
                        height: 32,
                        width: 32,
                        border: '1px solid rgba(255,255,255,0.07)',
                        background: 'transparent',
                        borderRadius: 7,
                        marginBottom: 18,
                      }}
                    >
                      <Icon size={14} strokeWidth={1.6} style={{ color: '#52525b' }} />
                    </div>

                    <h3
                      className="font-medium"
                      style={{ color: '#d4d4d8', fontSize: 13, marginBottom: 8, letterSpacing: '-0.01em' }}
                    >
                      {feature.title}
                    </h3>
                    <p style={{ color: '#52525b', fontSize: 13, lineHeight: 1.65 }}>
                      {feature.description}
                    </p>
                  </motion.div>
                )
              })}
          </div>
        </div>
      </div>
    </section>
  )
}
