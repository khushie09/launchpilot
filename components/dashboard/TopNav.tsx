'use client'

import { Search, Bell, Menu, ChevronDown } from 'lucide-react'
import { UserButton, Show } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_LABELS: Record<string, string> = {
  '/dashboard':           'Dashboard',
  '/dashboard/campaigns': 'Campaigns',
  '/dashboard/creators':  'Creators',
  '/dashboard/payments':  'Payments',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/settings':  'Settings',
}

const NAV_ITEMS = Object.entries(NAV_LABELS)

export default function TopNav() {
  const pathname = usePathname()
  const title = NAV_LABELS[pathname] ?? 'Dashboard'
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="flex h-[57px] shrink-0 items-center justify-between border-b border-border bg-background px-5 sticky top-0 z-30">

        {/* Left — mobile toggle + workspace chip */}
        <div className="flex items-center gap-3">
          <button
            className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <Menu size={18} strokeWidth={1.8} />
          </button>

          {/* Workspace switcher — desktop only */}
          <button
            className="hidden md:flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            style={{ fontSize: 13 }}
          >
            <div
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
            >
              O
            </div>
            <span className="font-medium text-foreground/80 whitespace-nowrap">Orbis Creative</span>
            <ChevronDown size={12} strokeWidth={2} className="text-muted-foreground/50" />
          </button>

          {/* Separator */}
          <div className="hidden md:block h-4 w-px bg-border/60" />

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-2 text-[13px]">
            <span className="text-muted-foreground/50">Dashboard</span>
            {title !== 'Dashboard' && (
              <>
                <span className="text-muted-foreground/30">/</span>
                <span className="font-medium text-foreground/80">{title}</span>
              </>
            )}
          </div>

          {/* Mobile page title */}
          <span className="text-[13px] font-semibold text-foreground md:hidden">{title}</span>
        </div>

        {/* Right — search, bell, avatar */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none"
            />
            <Input
              placeholder="Search..."
              className="h-8 w-52 rounded-full border-border/60 bg-muted/50 pl-8 text-[13px] placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/30 transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
            <Bell size={15} strokeWidth={1.8} />
            <span
              className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400"
              style={{ boxShadow: '0 0 4px rgba(99,102,241,0.8)' }}
            />
          </button>

          {/* Divider */}
          <div className="h-4 w-px bg-border/60" />

          {/* User avatar */}
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: 30, height: 30, borderRadius: 8 },
                  userButtonPopoverCard: {
                    backgroundColor: '#0e0e12',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
                    borderRadius: '12px',
                  },
                  userButtonPopoverActionButton: { color: '#a1a1aa' },
                  userButtonPopoverActionButton__signOut: { color: '#ef4444' },
                  userButtonPopoverFooter: { display: 'none' },
                },
              }}
            />
          </Show>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <nav
            className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-border bg-sidebar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[57px] items-center border-b border-border px-4 gap-2.5">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
              >
                <svg viewBox="0 0 14 14" fill="none" width={10} height={10}>
                  <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" fillOpacity="0.95" />
                  <path d="M7 4.5L10 6.25V8.25L7 10L4 8.25V6.25L7 4.5Z" fill="#3b82f6" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-foreground">LaunchPilot</span>
            </div>
            <div className="flex flex-1 flex-col gap-0.5 p-3 pt-4">
              <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40">
                Menu
              </p>
              {NAV_ITEMS.map(([href, label]) => {
                const isActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors',
                      isActive
                        ? 'bg-indigo-500/10 text-indigo-300'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    )}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
