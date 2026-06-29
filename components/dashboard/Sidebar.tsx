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
    setMounted(true)
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
        width: collapsed ? 56 : 220,
        minWidth: collapsed ? 56 : 220,
        transition: 'width 220ms cubic-bezier(0.4,0,0.2,1), min-width 220ms cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}
    >
      {/* Brand */}
      <div
        className="flex h-[57px] shrink-0 items-center border-b border-border"
        style={{ padding: '0 14px' }}
      >
        <Link href="/" className="flex items-center gap-2.5 no-underline min-w-0 overflow-hidden">
          <div
            className="flex shrink-0 items-center justify-center rounded-lg"
            style={{
              height: 28,
              width: 28,
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              boxShadow: '0 1px 4px rgba(59,130,246,0.35)',
            }}
          >
            <svg viewBox="0 0 14 14" fill="none" width={11} height={11}>
              <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" fillOpacity="0.95" />
              <path d="M7 4.5L10 6.25V8.25L7 10L4 8.25V6.25L7 4.5Z" fill="#3b82f6" />
            </svg>
          </div>
          <div
            className="flex flex-col min-w-0"
            style={{
              opacity: !collapsed && mounted ? 1 : 0,
              transform: collapsed ? 'translateX(-6px)' : 'translateX(0)',
              transition: 'opacity 160ms, transform 160ms',
              pointerEvents: collapsed ? 'none' : 'auto',
            }}
          >
            <span className="text-[13px] font-semibold text-foreground tracking-tight whitespace-nowrap leading-none">
              LaunchPilot
            </span>
            <span className="mt-0.5 text-[10px] text-muted-foreground/50 whitespace-nowrap leading-none">
              Creator OS
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col" style={{ padding: '12px 8px', gap: 2 }}>
        {!collapsed && mounted && (
          <p
            className="mb-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/35"
            style={{ paddingLeft: 8 }}
          >
            Menu
          </p>
        )}

        {NAV.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <div
              key={item.href}
              className="relative group/nav"
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg text-[13px] font-medium transition-all duration-150 outline-none',
                  collapsed ? 'justify-center' : 'gap-2.5 px-2.5',
                  isActive ? 'text-indigo-300' : 'text-muted-foreground'
                )}
                style={{
                  height: 34,
                  width: collapsed ? 38 : undefined,
                  margin: collapsed ? '0 auto' : undefined,
                  background: isActive ? 'rgba(99,102,241,0.12)' : undefined,
                  borderLeft: isActive && !collapsed ? '2px solid rgba(99,102,241,0.6)' : undefined,
                  paddingLeft: isActive && !collapsed ? 8 : undefined,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = ''
                }}
              >
                <Icon
                  size={15}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  style={{ flexShrink: 0, color: isActive ? '#818cf8' : undefined }}
                />
                {!collapsed && (
                  <span
                    className="whitespace-nowrap"
                    style={{ opacity: mounted ? 1 : 0, transition: 'opacity 130ms 30ms' }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>

              {/* Tooltip when collapsed — shown via group hover */}
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

      {/* Footer / collapse toggle */}
      <div className="border-t border-border">
        <button
          onClick={toggle}
          className={cn(
            'flex w-full items-center text-muted-foreground/40 transition-colors duration-150 hover:text-muted-foreground',
            collapsed ? 'h-12 justify-center' : 'h-10 justify-between px-4'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {!collapsed && (
            <span
              className="text-[11px] tracking-tight"
              style={{ opacity: mounted ? 1 : 0, transition: 'opacity 150ms' }}
            >
              v0.1.0
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
