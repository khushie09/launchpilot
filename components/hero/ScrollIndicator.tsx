'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.35 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      aria-hidden="true"
    >
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={18} color="white" />
      </motion.div>
    </motion.div>
  )
}
