'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, CreditCard, ChefHat, LayoutDashboard, ShoppingBag, ChevronDown, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { surfaceFromPath, type SurfaceId } from '@/lib/session'
import { cn } from '@/lib/utils'

const roles: {
  id: SurfaceId
  label: string
  hint: string
  href: string
  icon: typeof CreditCard
}[] = [
  { id: 'order', label: 'Customer', hint: 'Guest menu and checkout', href: '/order', icon: ShoppingBag },
  { id: 'pos', label: 'POS', hint: 'Register, floor, and tender', href: '/pos', icon: CreditCard },
  { id: 'kds', label: 'KDS', hint: 'Kitchen tickets and expo', href: '/kds', icon: ChefHat },
  { id: 'admin', label: 'Admin', hint: 'Menu, staff, and reports', href: '/admin', icon: LayoutDashboard },
]

export function AppSwitcher({ className }: { className?: string }) {
  const pathname = usePathname()
  const current = surfaceFromPath(pathname)
  const currentRole = roles.find((role) => role.id === current)

  if (pathname === '/') return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Switch role"
        className={cn(
          'inline-flex size-10 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border bg-background text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-9 sm:w-auto sm:px-2.5',
          className,
        )}
      >
        <LayoutGrid className="size-4 text-primary" />
        <span className="hidden sm:inline">{currentRole?.label ?? 'Apps'}</span>
        <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Switch role
          </DropdownMenuLabel>
          {roles.map((role) => {
            const Icon = role.icon
            const active = role.id === current
            return (
              <DropdownMenuItem
                key={role.id}
                render={<Link href={role.href} className="flex items-start" />}
                className={cn(
                  'h-auto items-start gap-3 rounded-xl px-2.5 py-2',
                  active && 'bg-accent text-accent-foreground',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
                    active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground',
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">{role.label}</span>
                  <span className="block text-[11px] font-normal text-muted-foreground">{role.hint}</span>
                </span>
                {active && <Check className="mt-1.5 size-4 shrink-0 text-primary" />}
              </DropdownMenuItem>
            )
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/" />} className="h-10 gap-2.5 rounded-xl px-2.5 text-muted-foreground">
            <LayoutGrid className="size-4" />
            All apps
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
