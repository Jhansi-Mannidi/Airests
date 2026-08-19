'use client'

import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreditCard, ChefHat, LayoutDashboard, ShoppingBag } from 'lucide-react'

const apps = [
  { label: 'Windows POS', href: '/pos/login', icon: CreditCard },
  { label: 'Kitchen Display', href: '/kds', icon: ChefHat },
  { label: 'Admin Portal', href: '/admin', icon: LayoutDashboard },
  { label: 'Customer Ordering', href: '/order', icon: ShoppingBag },
]

/**
 * Universal app switcher — lets staff jump between every Airests surface
 * (POS, KDS, Admin, Customer Web) from anywhere in the product, and back
 * to the top-level overview. Mirrors the "app grid" pattern used by
 * multi-product platforms so there is always a way back out.
 */
export function AppSwitcher({ className, variant = 'icon' }: { className?: string; variant?: 'icon' | 'ghost-icon' }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Switch app"
        className={
          className ??
          (variant === 'ghost-icon'
            ? 'flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground'
            : 'flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary hover:text-foreground')
        }
      >
        <LayoutGrid className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Airests Surfaces</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {apps.map((app) => (
            <DropdownMenuItem key={app.href} render={<Link href={app.href} className="flex items-center gap-2.5" />}>
              <app.icon className="size-4 text-muted-foreground" />
              {app.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/" className="text-muted-foreground" />}>All Apps Overview</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
