'use client'

import { motion } from 'framer-motion'
import { Sparkles, Layers } from 'lucide-react'

export type InnerNodeId = 'Sparkles' | 'Layers'

interface InnerNodeConfig {
  icon: React.ElementType
  color: string
  glow: string
  bg: string
}

const INNER_NODE_CONFIG: Record<InnerNodeId, InnerNodeConfig> = {
  Sparkles: {
    icon: Sparkles,
    color: '#60A5FA',
    glow: 'rgba(96,165,250,0.45)',
    bg: 'rgba(96,165,250,0.14)',
  },
  Layers: {
    icon: Layers,
    color: '#A78BFA',
    glow: 'rgba(167,139,250,0.45)',
    bg: 'rgba(167,139,250,0.14)',
  },
}

const NODE_SIZE = 38

interface InnerOrbitNodeProps {
  id: InnerNodeId
  angle: number
  radius: number
  entranceDelay: number
  ringDuration: number
  ringDirection: 1 | -1
}

export default function InnerOrbitNode({
  id,
  angle,
  radius,
  entranceDelay,
  ringDuration,
  ringDirection,
}: InnerOrbitNodeProps) {
  const { icon: Icon, color, glow, bg } = INNER_NODE_CONFIG[id]

  const rad = (angle * Math.PI) / 180
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius

  const counterDeg = ringDirection === -1 ? 360 : -360

  return (
    <motion.div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        x: x - NODE_SIZE / 2,
        y: y - NODE_SIZE / 2,
      }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: entranceDelay, duration: 0.5, ease: 'easeOut' }}
    >
      {/* Counter-rotate to keep icon upright */}
      <motion.div
        animate={{ rotate: counterDeg }}
        transition={{ duration: ringDuration, repeat: Infinity, ease: 'linear' }}
      >
        {/* Gentle float */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 3.8 + entranceDelay * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: entranceDelay * 0.2,
          }}
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: NODE_SIZE,
              height: NODE_SIZE,
              background: bg,
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: `0 0 18px 2px ${glow}, inset 0 0 6px 0 ${glow}`,
            }}
          >
            <Icon size={15} color={color} strokeWidth={2} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
