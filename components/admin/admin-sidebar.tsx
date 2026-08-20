'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AirestsMark } from '@/components/shared/airests-mark'
import { adminNavItems } from '@/lib/admin-nav'
import { canSeeAppOverview, useSession } from '@/lib/session'
import { LayoutGrid, X } from 'lucide-react'
import { LayoutGroup, m } from 'framer-motion'

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const session = useSession()
  const name = session?.name ?? 'Elena Cruz'
  const role = session?.role ?? 'General Manager'
  const initials = session?.initials ?? 'EC'

  return (
    <div className="flex h-full min-h-0 w-64 max-w-[88vw] flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border px-4 md:h-[4.5rem] md:px-5">
        <Link href="/admin" className="flex items-center" aria-label="Airests Admin">
          <AirestsMark size="lg" />
        </Link>
        {onClose && (
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent md:hidden" aria-label="Close menu">
            <X className="size-5" />
          </button>
        )}
      </div>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        <LayoutGroup id="admin-nav">
        {adminNavItems.map((item, index) => {
          const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <m.div
              key={item.href}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.018, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                {isActive && (
                  <m.span
                    layoutId="admin-nav-pill"
                    className="absolute inset-0 rounded-lg bg-sidebar-primary shadow-sm"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <item.icon className="relative z-10 size-4" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            </m.div>
          )
        })}
        </LayoutGroup>
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-3">
        {canSeeAppOverview(role) && (
          <Link
            href="/"
            className="mb-1 flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LayoutGrid className="size-4" />
            All Apps Overview
          </Link>
        )}
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/70 px-2 py-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
