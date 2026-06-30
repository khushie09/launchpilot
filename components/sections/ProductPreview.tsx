'use client'

import { motion } from 'framer-motion'

const CAMPAIGNS = [
  { name: 'Summer Collection',    creator: '@sarah.creates', status: 'Active', dot: '#22c55e', budget: '$4,200' },
  { name: 'Brand Identity Shoot', creator: '@mike.design',   status: 'Active', dot: '#22c55e', budget: '$1,800' },
  { name: 'Q4 Holiday Launch',    creator: '@emma.content',  status: 'Review', dot: '#f59e0b', budget: '$8,500' },
  { name: 'Creator Collab S2',    creator: '@james.shoots',  status: 'Draft',  dot: '#3f3f46', budget: '$3,100' },
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
    ...(pos.includes('t') ? { top: -6 } : { bottom: -6 }),
    ...(pos.includes('l') ? { left: -6 } : { right: -6 }),
  }
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={style}>
      <path d={d} stroke="rgba(99,102,241,0.40)" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ProductPreview() {
  return (
    <section
      style={{
        marginTop: -60,
        paddingTop: 'clamp(60px, 15vw, 180px)',
        paddingBottom: 60,
        position: 'relative',
        zIndex: 1,
      }}
    >

      {/* Seam glow — hero → dashboard */}
      <div
        aria-hidden="true"
        className="pointer-events-none"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 240,
          zIndex: -1,
          background: 'linear-gradient(180deg, rgba(7,7,10,0.55) 0%, transparent 48%)',
        }}
      />

      <div className="landing-px" style={{ maxWidth: 1440, marginLeft: 'auto', marginRight: 'auto' }}>

        {/* Section label + headline */}
        <motion.div
          style={{ marginBottom: 40, textAlign: 'center' }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease }}
        >
          <p
            className="uppercase"
            style={{ color: '#3f3f46', fontSize: 10, letterSpacing: '0.18em', fontWeight: 500, marginBottom: 12 }}
          >
            Product
          </p>
          <h2
            className="font-medium"
            style={{
              color: '#e4e4e7',
              fontSize: 'clamp(22px, 2.2vw, 28px)',
              letterSpacing: '-0.022em',
              lineHeight: 1.2,
            }}
          >
            Your entire campaign stack, unified.
          </h2>
        </motion.div>

        {/* Browser chrome wrapper — relative for corner marks + glow */}
        <motion.div
          style={{ position: 'relative' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, delay: 0.08, ease }}
        >
          {/* Spotlight glow behind the frame */}
          <div
            aria-hidden="true"
            className="pointer-events-none"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 1100,
              height: 480,
              marginLeft: -550,
              marginTop: -240,
              background:
                'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(37,99,235,0.08) 0%, transparent 70%)',
              zIndex: 0,
            }}
          />

          {/* Corner marks */}
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />

          {/* Browser chrome */}
          <div
            className="overflow-hidden"
            style={{
              position: 'relative',
              zIndex: 1,
              border: '1px solid rgba(255,255,255,0.07)',
              background: '#0c0c0f',
              borderRadius: 12,
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: '#09090b',
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 16,
                paddingRight: 16,
                gap: 12,
              }}
            >
              <div className="flex items-center" style={{ gap: 5 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{ height: 8, width: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                ))}
              </div>
              <div
                className="text-xs text-center"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#3f3f46',
                  borderRadius: 4,
                  paddingTop: 3,
                  paddingBottom: 3,
                  paddingLeft: 12,
                  paddingRight: 12,
                  minWidth: 200,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                }}
              >
                app.launchpilot.io/campaigns
              </div>
              <div style={{ width: 46 }} />
            </div>

            {/* App UI */}
            <div className="flex">
              {/* Sidebar */}
              <div
                className="hidden shrink-0 flex-col sm:flex"
                style={{
                  width: 192,
                  borderRight: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: 16,
                  paddingBottom: 16,
                  paddingLeft: 12,
                  paddingRight: 12,
                  gap: 2,
                }}
              >
                {[
                  { label: 'Campaigns', active: true },
                  { label: 'Creators',  active: false },
                  { label: 'Payments',  active: false },
                  { label: 'Analytics', active: false },
                  { label: 'Settings',  active: false },
                ].map(({ label, active }) => (
                  <div
                    key={label}
                    className="text-xs"
                    style={{
                      color: active ? '#e4e4e7' : '#3f3f46',
                      background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                      border: active ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                      borderRadius: 5,
                      paddingTop: 7,
                      paddingBottom: 7,
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1" style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 24, paddingRight: 24 }}>
                {/* Topbar */}
                <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#a1a1aa' }}>
                      Active Campaigns
                    </p>
                    <p className="text-xs" style={{ color: '#3f3f46', marginTop: 2 }}>
                      4 campaigns · $17,600 total
                    </p>
                  </div>
                  <button
                    className="text-xs font-medium"
                    style={{
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: '#71717a',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: 5,
                      paddingTop: 5,
                      paddingBottom: 5,
                      paddingLeft: 11,
                      paddingRight: 11,
                    }}
                  >
                    + New Campaign
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table style={{ width: '100%', minWidth: 480, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {['Campaign', 'Creator', 'Status', 'Budget'].map((h) => (
                          <th
                            key={h}
                            className="text-left font-medium text-xs"
                            style={{ color: '#27272a', paddingBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 10 }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {CAMPAIGNS.map((row, i) => (
                        <tr
                          key={row.name}
                          style={{
                            borderBottom: i < CAMPAIGNS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                          }}
                        >
                          <td className="text-xs" style={{ color: '#71717a', paddingTop: 12, paddingBottom: 12, paddingRight: 16 }}>
                            {row.name}
                          </td>
                          <td
                            className="text-xs"
                            style={{ color: '#3f3f46', paddingTop: 12, paddingBottom: 12, paddingRight: 16, fontFamily: 'var(--font-geist-mono, monospace)' }}
                          >
                            {row.creator}
                          </td>
                          <td style={{ paddingTop: 12, paddingBottom: 12, paddingRight: 16 }}>
                            <span className="inline-flex items-center" style={{ gap: 5 }}>
                              <span
                                style={{ display: 'inline-block', height: 5, width: 5, borderRadius: '50%', background: row.dot }}
                              />
                              <span className="text-xs" style={{ color: '#52525b' }}>{row.status}</span>
                            </span>
                          </td>
                          <td
                            className="text-xs text-right"
                            style={{ color: '#71717a', paddingTop: 12, paddingBottom: 12, fontFamily: 'var(--font-geist-mono, monospace)' }}
                          >
                            {row.budget}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
