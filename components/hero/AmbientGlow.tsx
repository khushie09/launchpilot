'use client'

import { motion } from 'framer-motion'

export default function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Wide outer haze */}
      <div
        className="absolute rounded-full"
        style={{
          width: 900,
          height: 560,
          background:
            'radial-gradient(ellipse at center, rgba(20,55,165,0.18) 0%, rgba(12,36,110,0.07) 50%, transparent 70%)',
        }}
      />

      {/* Mid glow — breathes */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 480,
          height: 480,
          background:
            'radial-gradient(ellipse at center, rgba(37,99,235,0.22) 0%, rgba(14,165,233,0.06) 52%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Tight inner core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 220,
          height: 220,
          background:
            'radial-gradient(ellipse at center, rgba(96,165,250,0.18) 0%, rgba(59,130,246,0.06) 55%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.1,
        }}
      />
    </div>
  )
}
