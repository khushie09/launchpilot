'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutGrid,
  Megaphone,
  Users,
  CreditCard,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard',           icon: LayoutGrid, label: 'Dashboard'  },
  { href: '/dashboard/campaigns', icon: Megaphone,  label: 'Campaigns'  },
  { href: '/dashboard/creators',  icon: Users,      label: 'Creators'   },
  { href: '/dashboard/payments',  icon: CreditCard, label: 'Payments'   },
  { href: '/dashboard/analytics', icon: BarChart2,  label: 'Analytics'  },
  { href: '/dashboard/settings',  icon: Settings,   label: 'Settings'   },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true) // eslint-disable-line react-hooks/set-state-in-effect
    try {
      const stored = localStorage.getItem('lp-sidebar-collapsed')
      if (stored !== null) setCollapsed(stored === 'true')
    } catch {}
  }, [])

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      try { localStorage.setItem('lp-sidebar-collapsed', String(next)) } catch {}
      return next
    })
  }

  return (
    <aside
      className="hidden md:flex h-full shrink-0 flex-col border-r border-border bg-sidebar"
      style={{
        width: collapsed ? 68 : 260,
        minWidth: collapsed ? 68 : 260,
        transition: 'width 220ms cubic-bezier(0.4,0,0.2,1), min-width 220ms cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}
    >
      {/* Brand */}
      <div
        className="flex shrink-0 items-center border-b border-border"
        style={{ height: 57, padding: '0 20px' }}
      >
        <Link href="/" className="flex items-center gap-3 no-underline overflow-hidden min-w-0">
          <div
            className="flex shrink-0 items-center justify-center rounded-lg"
            style={{
              height: 26,
              width: 26,
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              boxShadow: '0 1px 4px rgba(59,130,246,0.3)',
            }}
          >
            <svg viewBox="0 0 14 14" fill="none" width={10} height={10}>
              <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" fillOpacity="0.95" />
              <path d="M7 4.5L10 6.25V8.25L7 10L4 8.25V6.25L7 4.5Z" fill="#3b82f6" />
            </svg>
          </div>
          <span
            className="text-sm font-semibold text-foreground tracking-tight whitespace-nowrap"
            style={{
              opacity: !collapsed && mounted ? 1 : 0,
              transition: 'opacity 160ms',
              pointerEvents: collapsed ? 'none' : 'auto',
            }}
          >
            LaunchPilot
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <div key={item.href} className="relative group/nav">
              <Link
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg transition-all duration-150 outline-none',
                  collapsed ? 'justify-center' : 'gap-3',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
                style={{
                  height: 38,
                  padding: collapsed ? '0' : '0 12px',
                  width: collapsed ? 44 : undefined,
                  margin: collapsed ? '0 auto' : undefined,
                  background: isActive ? 'rgba(255,255,255,0.07)' : undefined,
                  fontWeight: isActive ? 500 : 400,
                  fontSize: 14,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = '#c4c4c8'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = ''
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = ''
                }}
              >
                <Icon
                  size={16}
                  strokeWidth={isActive ? 2 : 1.6}
                  style={{ flexShrink: 0, opacity: isActive ? 1 : 0.65 }}
                />
                {!collapsed && (
                  <span
                    className="whitespace-nowrap"
                    style={{ opacity: mounted ? 1 : 0, transition: 'opacity 130ms' }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>

              {/* Collapsed tooltip */}
              {collapsed && (
                <span
                  className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 z-50 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-100"
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    borderRadius: 6,
                    padding: '5px 10px',
                    fontSize: 12,
                    fontWeight: 500,
                    background: '#f4f4f5',
                    color: '#09090b',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  }}
                >
                  {item.label}
                </span>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border">
        <button
          onClick={toggle}
          className={cn(
            'flex w-full items-center text-muted-foreground/30 transition-colors hover:text-muted-foreground',
            collapsed ? 'h-12 justify-center' : 'h-10 justify-between'
          )}
          style={{ padding: collapsed ? 0 : '0 20px' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {!collapsed && (
            <span
              className="text-[11px]"
              style={{ opacity: mounted ? 1 : 0 }}
            >
              v0.1
            </span>
          )}
          {collapsed
            ? <ChevronRight size={13} strokeWidth={1.8} />
            : <ChevronLeft size={13} strokeWidth={1.8} />
          }
        </button>
      </div>
    </aside>
  )
}
