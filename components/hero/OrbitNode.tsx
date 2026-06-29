'use client'

import { motion } from 'framer-motion'
import {
  User,
  Diamond,
  Rocket,
  FileCheck,
  BarChart2,
  Zap,
  ShieldCheck,
  Play,
} from 'lucide-react'

export type NodeId =
  | 'Creator'
  | 'Brand'
  | 'Campaign'
  | 'Deliverable'
  | 'Analytics'
  | 'Payment'
  | 'Approval'
  | 'Content'

interface NodeConfig {
  icon: React.ElementType
  color: string
  glow: string
}

const NODE_CONFIG: Record<NodeId, NodeConfig> = {
  Creator:     { icon: User,        color: '#A78BFA', glow: 'rgba(167,139,250,0.25)' },
  Brand:       { icon: Diamond,     color: '#34D399', glow: 'rgba(52,211,153,0.25)'  },
  Campaign:    { icon: Rocket,      color: '#60A5FA', glow: 'rgba(96,165,250,0.25)'  },
  Deliverable: { icon: FileCheck,   color: '#FBBF24', glow: 'rgba(251,191,36,0.25)'  },
  Analytics:   { icon: BarChart2,   color: '#38BDF8', glow: 'rgba(56,189,248,0.25)'  },
  Payment:     { icon: Zap,         color: '#4ADE80', glow: 'rgba(74,222,128,0.25)'  },
  Approval:    { icon: ShieldCheck, color: '#F472B6', glow: 'rgba(244,114,182,0.25)' },
  Content:     { icon: Play,        color: '#FB923C', glow: 'rgba(251,146,60,0.25)'  },
}

interface OrbitNodeProps {
  id: NodeId
  angle: number
  radius: number
  entranceDelay: number
  /** Duration of parent ring rotation (seconds) */
  ringDuration: number
  /** Direction of parent ring: 1 = CW, -1 = CCW */
  ringDirection: 1 | -1
}

export default function OrbitNode({
  id,
  angle,
  radius,
  entranceDelay,
  ringDuration,
  ringDirection,
}: OrbitNodeProps) {
  const { icon: Icon, color, glow } = NODE_CONFIG[id]

  const rad = (angle * Math.PI) / 180
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius

  // Counter-rotation keeps label upright
  const counterDeg = ringDirection === -1 ? 360 : -360

  return (
    <motion.div
      className="absolute"
      style={{ left: '50%', top: '50%', x: x - 59, y: y - 21 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: entranceDelay, duration: 0.45, ease: 'easeOut' }}
    >
      {/* Counter-rotate to keep pill facing right-side-up */}
      <motion.div
        animate={{ rotate: counterDeg }}
        transition={{ duration: ringDuration, repeat: Infinity, ease: 'linear' }}
      >
        {/* Float */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 3.2 + entranceDelay * 0.25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: entranceDelay * 0.2,
          }}
        >
          {/* Node pill */}
          <motion.div
            className="flex items-center gap-2 rounded-full px-3 py-2 cursor-default select-none"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              minWidth: 118,
            }}
            whileHover={{
              scale: 1.06,
              background: 'rgba(255,255,255,0.11)',
              border: '1px solid rgba(255,255,255,0.22)',
              boxShadow: `0 0 20px 0 ${glow}`,
              transition: { duration: 0.2 },
            }}
          >
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: 22, height: 22, background: glow }}
            >
              <Icon size={12} color={color} strokeWidth={2.2} />
            </div>
            <span
              className="text-xs font-medium tracking-wide whitespace-nowrap"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              {id}
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
