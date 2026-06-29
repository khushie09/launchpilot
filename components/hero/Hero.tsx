'use client'

import AmbientGlow from './AmbientGlow'
import Orbit from './Orbit'
import HeroContent from './HeroContent'
import ScrollIndicator from './ScrollIndicator'

export default function Hero() {
  return (
    <section
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ background: '#06060F' }}
    >
      {/* Ambient glow layer — behind everything */}
      <AmbientGlow />

      {/* Orbit rings + nodes */}
      <Orbit />

      {/* Centered text + CTAs */}
      <HeroContent />

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  )
}
