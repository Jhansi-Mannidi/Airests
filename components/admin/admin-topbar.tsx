'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, ChevronRight } from 'lucide-react'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { AppSwitcher } from '@/components/shared/app-switcher'
import { AirestsMark } from '@/components/shared/airests-mark'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminSearch } from '@/components/admin/admin-search'
import { brand } from '@/lib/mock-data'
import { useSession } from '@/lib/session'

export function AdminTopbar({ title }: { title: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const session = useSession()
  const initials = session?.initials ?? 'EC'

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/80 bg-card/90 px-3 backdrop-blur-md md:h-[4.5rem] md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <AirestsMark size="lg" className="md:hidden" />
        <div>
          {title === 'Dashboard' ? (
            <h1 className="font-sans text-base font-semibold tracking-tight text-foreground md:text-lg">{title}</h1>
          ) : (
            <div className="flex items-center gap-1 text-sm">
              <Link href="/admin" className="font-medium text-muted-foreground transition-colors hover:text-foreground">
                Dashboard
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground/60" />
              <h1 className="font-sans text-sm font-semibold tracking-tight text-foreground md:text-base">{title}</h1>
            </div>
          )}
          <p className="hidden text-xs text-muted-foreground sm:block">{brand.tenantName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-2.5">
        <AdminSearch />
        <ThemeToggle />
        <AppSwitcher />
        <div className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground ring-1 ring-border">
          {initials}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="modal-scrim absolute inset-0" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full shadow-elevated">
            <AdminSidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </header>
  )
}
