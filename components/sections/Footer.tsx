'use client'

import { X } from 'lucide-react'

const NAV_LINKS = ['Product', 'Pricing', 'Docs', 'Changelog']

function GithubIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        isolation: 'isolate',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: 56,
        paddingBottom: 56,
      }}
    >
      {/* Seam glow — features → footer */}
      <div
        aria-hidden="true"
        className="pointer-events-none"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 140,
          zIndex: -1,
          background: 'linear-gradient(180deg, rgba(7,7,10,0.45) 0%, transparent 48%)',
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 32,
          paddingRight: 32,
          position: 'relative',
        }}
      >
        {/* Top row — brand left, nav right */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 48,
          }}
        >
          {/* Brand */}
          <div>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none',
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  height: 22,
                  width: 22,
                  borderRadius: 5,
                  background: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg viewBox="0 0 14 14" fill="none" width={9} height={9}>
                  <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" fillOpacity="0.95" />
                  <path d="M7 4.5L10 6.25V8.25L7 10L4 8.25V6.25L7 4.5Z" fill="#3b82f6" />
                </svg>
              </div>
              <span
                style={{
                  color: '#fafafa',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '-0.015em',
                }}
              >
                LaunchPilot
              </span>
            </a>
            <p
              style={{
                color: '#3f3f46',
                fontSize: 13,
                lineHeight: 1.6,
                maxWidth: 220,
              }}
            >
              The operating system for creator campaigns.
            </p>
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', gap: 28 }}>
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: '#52525b',
                  fontSize: 13,
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#a1a1aa')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#52525b')}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'rgba(255,255,255,0.05)',
            marginBottom: 24,
          }}
        />

        {/* Bottom row — copyright left, socials right */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p style={{ color: '#3f3f46', fontSize: 12 }}>
            © 2026 LaunchPilot. All rights reserved.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a
              href="#"
              aria-label="GitHub"
              style={{
                color: '#3f3f46',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#71717a')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#3f3f46')}
            >
              <GithubIcon />
            </a>
            <a
              href="#"
              aria-label="X (Twitter)"
              style={{
                color: '#3f3f46',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#71717a')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#3f3f46')}
            >
              <X size={15} strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
