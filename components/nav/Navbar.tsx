'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Show, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const NAV_LINKS = ['Product', 'Pricing', 'Docs', 'Changelog']

export default function Navbar() {
  const [visible, setVisible] = useState(true)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY

    const onScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastY.current

      if (delta > 4) {
        setVisible(false)
        if (open) setOpen(false)
      } else if (delta < -4) {
        setVisible(true)
      }

      lastY.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      animate={{ y: visible ? 0 : '-100%' }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        className="landing-px flex items-center justify-between"
        style={{ maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto', height: 56 }}
      >
        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center select-none"
          style={{ gap: 10, textDecoration: 'none' }}
        >
          <div
            className="flex items-center justify-center"
            style={{ height: 24, width: 24, borderRadius: 6, background: '#3b82f6' }}
          >
            <svg viewBox="0 0 14 14" fill="none" width={10} height={10}>
              <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" fillOpacity="0.95" />
              <path d="M7 4.5L10 6.25V8.25L7 10L4 8.25V6.25L7 4.5Z" fill="#3b82f6" />
            </svg>
          </div>
          <span
            className="font-semibold"
            style={{ color: '#fafafa', fontSize: 14, letterSpacing: '-0.015em' }}
          >
            LaunchPilot
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center" style={{ gap: 4 }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="rounded-md transition-colors duration-150"
              style={{
                color: '#71717a',
                fontSize: 14,
                padding: '6px 12px',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e4e4e7')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center" style={{ gap: 8 }}>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="hidden sm:block rounded-md transition-colors duration-150"
              style={{
                color: '#71717a',
                fontSize: 14,
                padding: '6px 12px',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e4e4e7')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="hidden sm:inline-flex items-center font-medium text-white transition-opacity hover:opacity-90"
              style={{
                background: '#3b82f6',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 14,
                gap: 6,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Get Started
              <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          </Show>

          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="hidden sm:block rounded-md transition-colors duration-150"
              style={{
                color: '#71717a',
                fontSize: 14,
                padding: '6px 12px',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e4e4e7')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
            >
              Dashboard
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                  },
                  userButtonPopoverCard: {
                    backgroundColor: '#08081a',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                  },
                  userButtonPopoverActionButton: {
                    color: '#a1a1aa',
                  },
                  userButtonPopoverActionButton__signOut: {
                    color: '#ef4444',
                  },
                  userButtonPopoverFooter: {
                    display: 'none',
                  },
                },
              }}
            />
          </Show>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center transition-colors"
            style={{
              color: '#71717a',
              height: 32,
              width: 32,
              borderRadius: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="x"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.12 }}
                >
                  <X size={17} strokeWidth={2} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.12 }}
                >
                  <Menu size={17} strokeWidth={2} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile"
            className="overflow-hidden md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ borderTop: '1px solid #27272a', background: '#09090b' }}
          >
            <div className="flex flex-col" style={{ padding: '12px 16px' }}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="rounded-md text-sm transition-colors"
                  style={{
                    color: '#71717a',
                    padding: '10px 12px',
                    textDecoration: 'none',
                  }}
                  onClick={() => setOpen(false)}
                >
                  {link}
                </a>
              ))}
              <div
                className="flex flex-col"
                style={{ borderTop: '1px solid #27272a', marginTop: 8, paddingTop: 8, gap: 8 }}
              >
                <Show when="signed-out">
                  <Link
                    href="/sign-in"
                    className="text-sm text-center"
                    style={{ color: '#71717a', padding: '10px', textDecoration: 'none' }}
                    onClick={() => setOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center justify-center font-medium text-white"
                    style={{
                      background: '#3b82f6',
                      borderRadius: 8,
                      padding: '10px',
                      fontSize: 14,
                      gap: 6,
                      textDecoration: 'none',
                    }}
                    onClick={() => setOpen(false)}
                  >
                    Get Started
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </Link>
                </Show>
                <Show when="signed-in">
                  <Link
                    href="/dashboard"
                    className="text-sm text-center"
                    style={{ color: '#71717a', padding: '10px', textDecoration: 'none' }}
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                </Show>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
