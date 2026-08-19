'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, ChevronRight } from 'lucide-react'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { AppSwitcher } from '@/components/shared/app-switcher'
import { AirestsMark } from '@/components/shared/airests-mark'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { brand } from '@/lib/mock-data'

export function AdminTopbar({ title }: { title: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-3 md:h-[4.5rem] md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-muted-foreground hover:bg-secondary md:hidden"
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
              <Link href="/admin" className="font-medium text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground/60" />
              <h1 className="font-sans text-sm font-semibold tracking-tight text-foreground md:text-base">{title}</h1>
            </div>
          )}
          <p className="hidden text-xs text-muted-foreground sm:block">{brand.tenantName}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <AppSwitcher />
        <div className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
          EC
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full shadow-xl">
            <AdminSidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </header>
  )
}
