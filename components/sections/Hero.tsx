'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  User, Diamond, Rocket, FileCheck,
  BarChart2, Zap, ShieldCheck, Play,
} from 'lucide-react'

// ── Node definitions ──────────────────────────────────────────────────────────
// x / y are percentages of the hero section dimensions
const NODES = [
  { id: 'Creator',       icon: User,        color: '#a5b4fc', x: 15,  y: 19,  delay: 0.30, float: 4.1 },
  { id: 'Brand',         icon: Diamond,     color: '#6ee7b7', x: 60,  y:  9,  delay: 0.38, float: 3.8 },
  { id: 'Content',       icon: Play,        color: '#fca5a5', x: 84,  y: 26,  delay: 0.46, float: 4.5 },
  { id: 'Campaign',      icon: Rocket,      color: '#93c5fd', x: 87,  y: 57,  delay: 0.52, float: 3.5 },
  { id: 'Analytics',    icon: BarChart2,   color: '#7dd3fc', x: 67,  y: 83,  delay: 0.58, float: 4.0 },
  { id: 'Payments',     icon: Zap,         color: '#86efac', x: 36,  y: 87,  delay: 0.50, float: 4.7 },
  { id: 'Approval',     icon: ShieldCheck, color: '#f0abfc', x: 13,  y: 67,  delay: 0.44, float: 3.6 },
  { id: 'Deliverables', icon: FileCheck,   color: '#fcd34d', x: 11,  y: 43,  delay: 0.36, float: 4.3 },
] as const

const CX = 50
const CY = 50

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
    ...(pos.includes('t') ? { top: -8 } : { bottom: -8 }),
    ...(pos.includes('l') ? { left: -8 } : { right: -8 }),
  }
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={style}>
      <path d={d} stroke="rgba(99,102,241,0.50)" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Hero() {
  // Responsive ring sizes: clamp so they shrink on narrow viewports.
  // We use calc() for the negative-margin centering since we can't do -size/2 with a CSS string.
  const RINGS = [
    { size: 'clamp(180px, 22vw, 320px)' },
    { size: 'clamp(115px, 14vw, 200px)' },
  ]

  return (
    <section
      className="hero-section relative overflow-hidden"
      style={{
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 56,   /* navbar height — prevents content hiding under fixed header */
      }}
    >

      {/* ── 1. Ambient spotlight ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none"
        style={{
          position: 'absolute', inset: 0,
          background:
            'radial-gradient(ellipse 55% 46% at 50% 50%, rgba(35,28,80,0.05) 0%, transparent 68%)',
        }}
      />

      {/* ── 2. Concentric decorative rings — clamp-based so they scale with vw */}
      {RINGS.map(({ size }) => (
        <motion.div
          key={size}
          aria-hidden="true"
          className="pointer-events-none"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            // calc() lets us negate a clamp() value for centering
            marginLeft: `calc(${size} * -0.5)`,
            marginTop: `calc(${size} * -0.5)`,
            width: size,
            height: size,
            borderRadius: '50%',
            border: '1px solid rgba(99,102,241,0.08)',
          }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.05, ease: 'easeOut' }}
        />
      ))}

      {/* ── 3. SVG connection lines — viewBox 0 0 100 100 with preserveAspectRatio none
               so x/y in the SVG match the node's left/top percentages exactly.         */}
      <svg
        aria-hidden="true"
        className="pointer-events-none"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {NODES.map((node) => (
            <linearGradient
              key={`lg-${node.id}`}
              id={`lg-${node.id}`}
              x1={CX} y1={CY}
              x2={node.x} y2={node.y}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%"   stopColor="rgba(99,102,241,0.18)" />
              <stop offset="100%" stopColor="rgba(99,102,241,0.02)" />
            </linearGradient>
          ))}
        </defs>

        {NODES.map((node) => (
          <motion.path
            key={`line-${node.id}`}
            d={`M ${CX} ${CY} L ${node.x} ${node.y}`}
            stroke={`url(#lg-${node.id})`}
            strokeWidth={0.12}
            strokeDasharray="2 3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: node.delay - 0.05, ease: 'easeOut' }}
          />
        ))}
      </svg>

      {/* ── 4. Floating node cards ─────────────────────────────────────────────
               Visible from md (768px) upward. CSS class handles responsive sizing.
               Nodes positioned behind the content on narrow viewports are invisible
               (z-index 2 < content z-index 10) but their SVG lines still show.     */}
      {NODES.map((node) => {
        const Icon = node.icon
        return (
          <motion.div
            key={node.id}
            className="pointer-events-none"
            style={{
              position: 'absolute',
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              // Hide below 768px via CSS (not Tailwind class, to avoid specificity fight with motion)
              display: undefined,
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: node.delay, ease: 'easeOut' }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: node.float, repeat: Infinity, ease: 'easeInOut', delay: node.delay * 0.3 }}
            >
              {/*
                .hero-node-card carries gap + padding (responsive via @media in globals.css).
                background / border / borderRadius / whiteSpace stay inline.
              */}
              <div
                className="hero-node-card flex items-center select-none"
                style={{
                  background: 'rgba(7,7,10,0.75)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 6,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon
                  size={10}
                  strokeWidth={2}
                  style={{ color: node.color, flexShrink: 0 }}
                />
                {/* .hero-node-label carries font-size (responsive via @media in globals.css).
                    color / fontWeight / letterSpacing stay inline.                            */}
                <span
                  className="hero-node-label"
                  style={{ color: 'rgba(226,232,240,0.60)', fontWeight: 500, letterSpacing: '-0.01em' }}
                >
                  {node.id}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )
      })}

      {/* ── 5. Central content ────────────────────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center text-center"
        style={{
          zIndex: 10,
          width: '100%',
          maxWidth: 680,
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(20px, 4vw, 40px)',
          paddingRight: 'clamp(20px, 4vw, 40px)',
        }}
      >
        {/* Corner bracket markers */}
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />

        {/* Logo mark */}
        <motion.div
          className="flex items-center justify-center"
          style={{
            height: 44,
            width: 44,
            borderRadius: 10,
            background: 'rgba(37,99,235,0.08)',
            border: '1px solid rgba(99,102,241,0.20)',
            marginBottom: 24,
          }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease }}
        >
          <svg viewBox="0 0 14 14" fill="none" width={18} height={18}>
            <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" fillOpacity="0.88" />
            <path d="M7 4.5L10 6.25V8.25L7 10L4 8.25V6.25L7 4.5Z" fill="#3b82f6" />
          </svg>
        </motion.div>

        {/* Badge */}
        <motion.div
          className="inline-flex items-center"
          style={{
            border: '1px solid rgba(99,102,241,0.20)',
            background: 'rgba(99,102,241,0.06)',
            color: 'rgba(165,180,252,0.85)',
            fontSize: 11,
            fontWeight: 500,
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 12,
            paddingRight: 12,
            borderRadius: 4,
            marginBottom: 28,
            gap: 6,
            letterSpacing: '0.01em',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.10, ease }}
        >
          <span style={{ display: 'inline-block', height: 5, width: 5, borderRadius: '50%', background: '#818cf8', flexShrink: 0 }} />
          Launch creator campaigns faster
        </motion.div>

        {/* Headline — clamp keeps it proportional across all desktop + tablet widths */}
        <motion.h1
          className="font-semibold"
          style={{
            color: '#f1f5f9',
            fontSize: 'clamp(28px, 3.8vw, 52px)',
            lineHeight: 1.09,
            letterSpacing: '-0.033em',
            marginBottom: 18,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.14, ease }}
        >
          The operating system
          <br />
          for creator campaigns.
        </motion.h1>

        {/* Thin rule */}
        <motion.div
          aria-hidden="true"
          style={{ width: 40, height: 1, background: 'rgba(99,102,241,0.30)', marginBottom: 18 }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.22, ease }}
        />

        {/* Description */}
        <motion.p
          style={{
            color: 'rgba(148,163,184,0.72)',
            fontSize: 'clamp(13px, 1.4vw, 15px)',
            lineHeight: 1.72,
            maxWidth: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 36,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.20, ease }}
        >
          Manage creators, briefs, approvals, payments and analytics
          from one beautiful workspace.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center justify-center"
          style={{ gap: 10 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.26, ease }}
        >
          <a
            href="/sign-in"
            className="inline-flex items-center font-medium text-white"
            style={{
              background: '#2563eb',
              borderRadius: 6,
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 20,
              paddingRight: 20,
              fontSize: 13,
              gap: 7,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Get Started
            <ArrowRight size={13} strokeWidth={2.5} />
          </a>

          <a
            href="#"
            className="inline-flex items-center font-medium"
            style={{
              border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(203,213,225,0.72)',
              background: 'transparent',
              borderRadius: 6,
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 20,
              paddingRight: 20,
              fontSize: 13,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#f1f5f9'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(203,213,225,0.72)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
            }}
          >
            Book Demo
          </a>
        </motion.div>
      </div>

    </section>
  )
}
