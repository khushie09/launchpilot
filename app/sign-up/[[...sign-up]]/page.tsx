import { SignUp } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerkAppearance'

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#07070a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        isolation: 'isolate',
      }}
    >
      {/* Grid */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '60vh',
          zIndex: -1,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(30,25,65,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Logo */}
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
          marginBottom: 28,
          position: 'relative',
        }}
      >
        <div
          style={{
            height: 30,
            width: 30,
            borderRadius: 7,
            background: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg viewBox="0 0 14 14" fill="none" width={11} height={11}>
            <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" fillOpacity="0.95" />
            <path d="M7 4.5L10 6.25V8.25L7 10L4 8.25V6.25L7 4.5Z" fill="#3b82f6" />
          </svg>
        </div>
        <span
          style={{
            color: '#fafafa',
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '-0.02em',
          }}
        >
          LaunchPilot
        </span>
      </a>

      <SignUp appearance={clerkAppearance} />
    </div>
  )
}
