import Link from 'next/link'
import { AirestsMark } from '@/components/shared/airests-mark'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { CreditCard, ChefHat, LayoutDashboard, ShoppingBag, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const surfaces: {
  title: string
  description: string
  icon: LucideIcon
  href: string
  screens: { label: string; href: string }[]
}[] = [
  {
    title: 'Windows POS',
    description: 'Touch-first register for servers and bartenders — order entry, floor plan, tender, and offline resilience.',
    icon: CreditCard,
    href: '/pos/login',
    screens: [
      { label: 'Login / PIN Entry', href: '/pos/login' },
      { label: 'Order Type & Home', href: '/pos' },
      { label: 'Floor Plan', href: '/pos/floor-plan' },
      { label: 'Order Building', href: '/pos/order' },
      { label: 'Check / Split', href: '/pos/checkout' },
      { label: 'Payment / Tender', href: '/pos/payment' },
      { label: 'Void Flow', href: '/pos/void' },
      { label: 'Offline Mode', href: '/pos/offline' },
    ],
  },
  {
    title: 'Kitchen Display (KDS)',
    description: 'Mounted-monitor kitchen tickets with station tabs, escalating timers, and expo aggregation.',
    icon: ChefHat,
    href: '/kds',
    screens: [
      { label: 'Expo — All Stations', href: '/kds' },
      { label: 'Grill Station', href: '/kds/grill' },
      { label: 'Fry Station', href: '/kds/fry' },
      { label: 'Salad / Cold Station', href: '/kds/salad' },
    ],
  },
  {
    title: 'Admin Portal',
    description: 'Multi-location back office — dashboards, menu builder, staff roles, reports, and integrations.',
    icon: LayoutDashboard,
    href: '/admin',
    screens: [
      { label: 'Dashboard', href: '/admin' },
      { label: 'Locations', href: '/admin/locations' },
      { label: 'Menu Builder', href: '/admin/menu' },
      { label: 'Staff & Roles', href: '/admin/staff' },
      { label: 'Reports', href: '/admin/reports' },
      { label: 'Integrations Console', href: '/admin/integrations' },
      { label: 'Onboarding Wizard', href: '/admin/onboarding' },
      { label: 'Settings', href: '/admin/settings' },
      { label: 'Billing', href: '/admin/billing' },
    ],
  },
  {
    title: 'Customer Web Ordering',
    description: 'Warm, mobile-first ordering site — browse menu, checkout, live status, and QR table ordering.',
    icon: ShoppingBag,
    href: '/order',
    screens: [
      { label: 'Restaurant Landing', href: '/order' },
      { label: 'Menu Browse', href: '/order/menu' },
      { label: 'Item Detail', href: '/order/menu/mi-1' },
      { label: 'Cart Review', href: '/order/cart' },
      { label: 'Checkout', href: '/order/checkout' },
      { label: 'Order Status', href: '/order/status' },
      { label: 'QR Table Ordering', href: '/order/table/12' },
    ],
  },
]

export default function Home() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 md:px-10">
        <AirestsMark size="lg" />
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="max-w-2xl">
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            A complete restaurant operations platform
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Explore every surface of Airests — the point-of-sale register, kitchen display system, multi-location
            admin portal, and customer-facing ordering site. Toggle light/dark theme from any screen; layouts adapt
            from desktop to mobile automatically.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {surfaces.map((surface) => (
            <div key={surface.title} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent">
                    <surface.icon className="size-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h2 className="font-sans text-lg font-semibold tracking-tight text-foreground">{surface.title}</h2>
                  </div>
                </div>
                <Link
                  href={surface.href}
                  className="flex shrink-0 items-center gap-1 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                  Open <ArrowRight className="size-3.5" />
                </Link>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{surface.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-4">
                {surface.screens.map((screen) => (
                  <Link
                    key={screen.href}
                    href={screen.href}
                    className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
                  >
                    {screen.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
