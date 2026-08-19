'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, CreditCard, ChefHat, LayoutDashboard, ShoppingBag } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { canSeeAppOverview, surfacesForRole, surfaceFromPath, useSession, type SurfaceId } from '@/lib/session'

const icons: Record<SurfaceId, typeof CreditCard> = {
  pos: CreditCard,
  kds: ChefHat,
  admin: LayoutDashboard,
  order: ShoppingBag,
}

export function AppSwitcher({ className, variant = 'icon' }: { className?: string; variant?: 'icon' | 'ghost-icon' }) {
  const pathname = usePathname()
  const session = useSession()
  const current = surfaceFromPath(pathname)

  if (!session) return null
  if (pathname === '/pos/login') return null
  if (current === 'order') return null

  const allowed = surfacesForRole(session.role)
  const showOverview = canSeeAppOverview(session.role)
  const onlyCurrent = allowed.length === 1 && allowed[0].id === current && !showOverview
  if (allowed.length === 0 || onlyCurrent) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Switch app"
        className={
          className ??
          (variant === 'ghost-icon' ? 'icon-btn rounded-full border-transparent' : 'icon-btn')
        }
      >
        <LayoutGrid className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span>Airests Surfaces</span>
            <span className="font-normal text-[11px] text-muted-foreground/80">
              {session.name.split(' ')[0]} · {session.role}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allowed.map((app) => {
            const Icon = icons[app.id]
            const href = app.id === 'pos' && pathname.startsWith('/pos') ? '/pos' : app.href
            return (
              <DropdownMenuItem key={app.id} render={<Link href={href} className="flex items-center gap-2.5" />}>
                <Icon className="size-4 text-muted-foreground" />
                {app.label}
              </DropdownMenuItem>
            )
          })}
          {showOverview && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/" className="text-muted-foreground" />}>
                All Apps Overview
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
