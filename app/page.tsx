import Navbar from '@/components/nav/Navbar'
import Hero from '@/components/sections/Hero'
import ProductPreview from '@/components/sections/ProductPreview'
import Features from '@/components/sections/Features'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', isolation: 'isolate' }}>

        {/* Grid — white lines, very faint so they read as texture not structure */}
        <div
          aria-hidden="true"
          className="pointer-events-none"
          style={{
            position: 'absolute', inset: 0,
            zIndex: -1,
            backgroundImage: [
              'linear-gradient(rgba(255,255,255,0.014) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px)',
            ].join(','),
            backgroundSize: '48px 48px',
          }}
        />

        {/* Page-level atmospheric glow — neutral deep indigo, barely perceptible */}
        <div
          aria-hidden="true"
          className="pointer-events-none"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2400,
            zIndex: -1,
            background:
              'radial-gradient(ellipse 70% 1100px at 50% 0%, rgba(30,25,65,0.05) 0%, rgba(15,12,32,0.012) 58%, transparent 100%)',
          }}
        />

        <Hero />
        <ProductPreview />
        <Features />
        <Footer />
      </main>
    </>
  )
}
