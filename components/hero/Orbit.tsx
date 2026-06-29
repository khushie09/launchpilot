'use client'

import { motion } from 'framer-motion'
import OrbitNode, { type NodeId } from './OrbitNode'
import InnerOrbitNode, { type InnerNodeId } from './InnerOrbitNode'

const OUTER_RADIUS = 370
const INNER_RADIUS = 195
const OUTER_DURATION = 65
const INNER_DURATION = 42

// Outer ring — 8 labeled pill nodes
const OUTER_NODES: { id: NodeId; angleDeg: number }[] = [
  { id: 'Analytics',   angleDeg: 354 },
  { id: 'Campaign',    angleDeg: 314 },
  { id: 'Content',     angleDeg: 218 },
  { id: 'Creator',     angleDeg: 201 },
  { id: 'Payment',     angleDeg: 181 },
  { id: 'Deliverable', angleDeg: 131 },
  { id: 'Brand',       angleDeg:  67 },
  { id: 'Approval',    angleDeg:  33 },
]

// Inner ring — 2 icon-only nodes, placed diagonally opposite
const INNER_NODES: { id: InnerNodeId; angleDeg: number }[] = [
  { id: 'Sparkles', angleDeg: 315 },
  { id: 'Layers',   angleDeg: 135 },
]

export default function Orbit() {
  const outerCircumference = 2 * Math.PI * OUTER_RADIUS
  const innerCircumference = 2 * Math.PI * INNER_RADIUS

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      {/*
        800×800 logical canvas. CSS scale adapts it to every viewport without JS.
        Both rings and all node positions live in this same coordinate space.
      */}
      <div
        className="relative shrink-0 scale-[0.40] sm:scale-[0.52] md:scale-[0.65] lg:scale-[0.86] xl:scale-100"
        style={{ width: 800, height: 800 }}
      >
        {/* Both dotted orbit rings in one SVG */}
        <svg
          className="absolute inset-0"
          width={800}
          height={800}
          viewBox="0 0 800 800"
          style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.10))' }}
        >
          {/* Outer dotted ring — dashes drift CCW */}
          <motion.circle
            cx={400}
            cy={400}
            r={OUTER_RADIUS}
            fill="none"
            stroke="white"
            strokeWidth={1.5}
            strokeDasharray="4 12"
            initial={{ strokeOpacity: 0, strokeDashoffset: 0 }}
            animate={{
              strokeOpacity: 0.28,
              strokeDashoffset: -outerCircumference,
            }}
            transition={{
              strokeOpacity: { duration: 1.4, delay: 0.3, ease: 'easeOut' },
              strokeDashoffset: {
                duration: OUTER_DURATION,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          />

          {/* Inner dotted ring — dashes drift CW (opposite to outer) */}
          <motion.circle
            cx={400}
            cy={400}
            r={INNER_RADIUS}
            fill="none"
            stroke="white"
            strokeWidth={1.5}
            strokeDasharray="3 10"
            initial={{ strokeOpacity: 0, strokeDashoffset: 0 }}
            animate={{
              strokeOpacity: 0.22,
              strokeDashoffset: innerCircumference,
            }}
            transition={{
              strokeOpacity: { duration: 1.4, delay: 0.6, ease: 'easeOut' },
              strokeDashoffset: {
                duration: INNER_DURATION,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          />
        </svg>

        {/* Outer ring nodes — rotate CW */}
        <motion.div
          className="absolute"
          style={{ left: 400, top: 400, width: 0, height: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: OUTER_DURATION, repeat: Infinity, ease: 'linear' }}
        >
          {OUTER_NODES.map((node, i) => (
            <OrbitNode
              key={node.id}
              id={node.id}
              angle={node.angleDeg}
              radius={OUTER_RADIUS}
              entranceDelay={0.35 + i * 0.08}
              ringDuration={OUTER_DURATION}
              ringDirection={1}
            />
          ))}
        </motion.div>

        {/* Inner ring nodes — rotate CCW */}
        <motion.div
          className="absolute"
          style={{ left: 400, top: 400, width: 0, height: 0 }}
          animate={{ rotate: -360 }}
          transition={{ duration: INNER_DURATION, repeat: Infinity, ease: 'linear' }}
        >
          {INNER_NODES.map((node, i) => (
            <InnerOrbitNode
              key={node.id}
              id={node.id}
              angle={node.angleDeg}
              radius={INNER_RADIUS}
              entranceDelay={0.7 + i * 0.18}
              ringDuration={INNER_DURATION}
              ringDirection={-1}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
