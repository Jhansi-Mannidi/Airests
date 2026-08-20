'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
  const [mounted, setMounted] = useState(false)
  const session = useSession()
  const initials = session?.initials ?? 'EC'

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileOpen])

  const drawer = mobileOpen ? (
    <div className="fixed inset-0 z-[80] flex md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close menu"
        onClick={() => setMobileOpen(false)}
      />
      <div className="relative z-10 flex h-full min-h-0 w-[min(18rem,88vw)] flex-col bg-sidebar shadow-elevated">
        <AdminSidebar onClose={() => setMobileOpen(false)} />
      </div>
    </div>
  ) : null

  return (
    <header className="relative z-40 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/80 bg-card px-3 md:h-[4.5rem] md:px-6">
      <div className="flex min-w-0 items-center gap-2 md:gap-3">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <AirestsMark showWordmark={false} size="md" className="md:hidden" />
        <div className="min-w-0">
          {title === 'Dashboard' ? (
            <h1 className="truncate font-sans text-base font-semibold tracking-tight text-foreground md:text-lg">{title}</h1>
          ) : (
            <div className="flex min-w-0 items-center gap-1 text-sm">
              <Link href="/admin" className="hidden font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline">
                Dashboard
              </Link>
              <ChevronRight className="hidden size-3.5 text-muted-foreground/60 sm:block" />
              <h1 className="truncate font-sans text-sm font-semibold tracking-tight text-foreground md:text-base">{title}</h1>
            </div>
          )}
          <p className="hidden text-xs text-muted-foreground sm:block">{brand.tenantName}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 md:gap-2.5">
        <AdminSearch />
        <ThemeToggle />
        <AppSwitcher />
        <div className="hidden size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground ring-1 ring-border sm:flex">
          {initials}
        </div>
      </div>

      {mounted ? createPortal(drawer, document.body) : null}
    </header>
  )
}
