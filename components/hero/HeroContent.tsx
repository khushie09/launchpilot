'use client'

import { motion } from 'framer-motion'
import { ArrowRight, PlayCircle } from 'lucide-react'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay,
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1] as const,
  },
})

export default function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col items-center text-center px-6 select-none">
      {/* Announcement pill */}
      <motion.a
        href="#"
        className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
        style={{
          background: 'rgba(37,99,235,0.09)',
          border: '1px solid rgba(96,165,250,0.18)',
          color: '#93C5FD',
        }}
        {...fadeUp(0.18)}
        whileHover={{ background: 'rgba(37,99,235,0.16)' }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: '#60A5FA' }}
        />
        Launch your campaign in minutes
        <ArrowRight size={10} className="opacity-55" />
      </motion.a>

      {/* Headline */}
      <motion.h1
        className="font-bold text-white"
        style={{
          fontSize: 'clamp(1.75rem, 3.5vw, 3.5rem)',
          letterSpacing: '-0.04em',
          lineHeight: 1.15,
          maxWidth: '600px',
        }}
        {...fadeUp(0.3)}
      >
        The OS for
        <br />
        creator{' '}
        <span
          style={{
            background:
              'linear-gradient(135deg, #93C5FD 0%, #60A5FA 35%, #3B82F6 75%, #2563EB 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          campaigns
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        className="mt-5 text-balance"
        style={{
          color: 'rgba(148,163,184,0.62)',
          fontSize: '0.9375rem',
          lineHeight: 1.65,
          maxWidth: '360px',
          letterSpacing: '-0.01em',
        }}
        {...fadeUp(0.44)}
      >
        Connect everything.
        <br />
        Brief, pay, orchestrate — done.
      </motion.p>

      {/* CTA row */}
      <motion.div
        className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-5"
        {...fadeUp(0.56)}
      >
        {/* Primary */}
        <motion.a
          href="#"
          className="group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white"
          style={{
            background: 'linear-gradient(160deg, #2563EB 0%, #1D4ED8 100%)',
            boxShadow:
              '0 0 0 1px rgba(96,165,250,0.18) inset, 0 0 28px rgba(37,99,235,0.28), 0 1px 3px rgba(0,0,0,0.4)',
          }}
          whileHover={{
            y: -1,
            boxShadow:
              '0 0 0 1px rgba(96,165,250,0.26) inset, 0 0 44px rgba(37,99,235,0.44), 0 1px 3px rgba(0,0,0,0.4)',
            transition: { duration: 0.18 },
          }}
          whileTap={{ scale: 0.975 }}
        >
          Get Started Free
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </motion.a>

        {/* Secondary */}
        <a
          href="#"
          className="group inline-flex items-center gap-2 text-xs font-medium transition-colors duration-200"
          style={{ color: 'rgba(100,116,139,0.8)' }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              'rgba(203,213,225,0.9)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              'rgba(100,116,139,0.8)')
          }
        >
          See how it works
          <PlayCircle
            size={16}
            className="transition-opacity duration-200 group-hover:opacity-100 opacity-60"
          />
        </a>
      </motion.div>
    </div>
  )
}
